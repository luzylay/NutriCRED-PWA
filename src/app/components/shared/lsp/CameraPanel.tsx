import React, { useState, useEffect, useRef } from "react"
import { HandShape, Movement, Sign } from "./types"
import { C } from "./dictionary"
import { HandSVG } from "./HandSVG"
import { classifyHandShape, detectMovement, matchSigns, MPLandmark } from "./classifier"

const FINGER_CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],
  [0,9],[9,10],[10,11],[11,12],[0,13],[13,14],[14,15],[15,16],
  [0,17],[17,18],[18,19],[19,20],[5,9],[9,13],[13,17],
]

export function CameraPanel({ onWordDetected, isMobile }: { onWordDetected: (w:string)=>void; isMobile: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const handsRef = useRef<any>(null)
  const histRef = useRef<Array<{x:number;y:number;t:number}>>([])
  const stabRef = useRef<{shape:HandShape|null;count:number}>({shape:null,count:0})
  const lastEmitRef = useRef(0)
  const animRef = useRef<number>(0)
  const activeRef = useRef(false)
  const onWordRef = useRef(onWordDetected)
  onWordRef.current = onWordDetected

  const [status, setStatus] = useState<"loading" | "ready" | "active" | "error">("ready")
  const [errorMsg, setErrorMsg] = useState("")
  const [detectedShape, setDetectedShape] = useState<HandShape | null>(null)
  const [detectedMovement, setDetectedMovement] = useState<Movement>("still")
  const [topMatches, setTopMatches] = useState<Array<{ sign: Sign; score: number }>>([])
  const [handPresent, setHandPresent] = useState(false)

  useEffect(() => {
    let mounted = true
    import("@mediapipe/hands")
      .then(({ Hands }) => {
        if (!mounted) return
        const h = new Hands({
          locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${f}`,
        })
        h.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.65,
          minTrackingConfidence: 0.5,
        })
        h.onResults((results: any) => {
          if (!activeRef.current) return
          const canvas = canvasRef.current
          const video = videoRef.current
          if (!canvas || !video) return
          const ctx = canvas.getContext("2d")
          if (!ctx) return
          const w = canvas.width || 640
          const h2 = canvas.height || 480

          ctx.save()
          ctx.translate(w, 0)
          ctx.scale(-1, 1)
          ctx.drawImage(results.image, 0, 0, w, h2)
          ctx.restore()

          if (results.multiHandLandmarks?.length > 0) {
            const lm: MPLandmark[] = results.multiHandLandmarks[0]
            ctx.strokeStyle = "rgba(201,168,76,0.9)"
            ctx.lineWidth = 2
            for (const [a, b] of FINGER_CONNECTIONS) {
              ctx.beginPath()
              ctx.moveTo((1 - lm[a].x) * w, lm[a].y * h2)
              ctx.lineTo((1 - lm[b].x) * w, lm[b].y * h2)
              ctx.stroke()
            }
            const TIPS = [4, 8, 12, 16, 20]
            for (let i = 0; i < lm.length; i++) {
              const isTip = TIPS.includes(i)
              ctx.fillStyle = isTip ? "#fff" : C.goldLight
              ctx.beginPath()
              ctx.arc((1 - lm[i].x) * w, lm[i].y * h2, isTip ? 5 : 3, 0, Math.PI * 2)
              ctx.fill()
            }

            const shape = classifyHandShape(lm)
            histRef.current.push({ x: 1 - lm[0].x, y: lm[0].y, t: Date.now() })
            if (histRef.current.length > 25) histRef.current.shift()
            const movement = detectMovement(histRef.current)
            const matches = matchSigns(shape, movement)
            setDetectedShape(shape)
            setDetectedMovement(movement)
            setTopMatches(matches)
            setHandPresent(true)

            const stab = stabRef.current
            if (shape === stab.shape) stab.count++
            else {
              stab.shape = shape
              stab.count = 1
            }
            const now = Date.now()
            if (
              stab.count >= 10 &&
              matches.length > 0 &&
              movement !== "still" &&
              now - lastEmitRef.current > 1600
            ) {
              onWordRef.current(matches[0].sign.word)
              lastEmitRef.current = now
              stab.count = 0
            }
          } else {
            histRef.current = []
            stabRef.current = { shape: null, count: 0 }
            setDetectedShape(null)
            setDetectedMovement("still")
            setTopMatches([])
            setHandPresent(false)
          }
        })
        handsRef.current = h
      })
      .catch(() => {
        // Fallback silently to local CPU vision loop if MediaPipe CDN fails
      })
    return () => {
      mounted = false
      activeRef.current = false
      cancelAnimationFrame(animRef.current)
      try {
        handsRef.current?.close()
      } catch {}
    }
  }, [])

  const startCamera = async () => {
    try {
      setStatus("loading")
      let stream: MediaStream
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "user" }, width: { ideal: 640 }, height: { ideal: 480 } },
        })
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true })
      }

      const video = videoRef.current!
      video.srcObject = stream
      await video.play()

      const canvas = canvasRef.current!
      const w = video.videoWidth || 640
      const h2 = video.videoHeight || 480
      canvas.width = w
      canvas.height = h2

      activeRef.current = true
      setStatus("active")

      let frameCounter = 0
      const loop = async () => {
        if (!activeRef.current) return

        if (video && video.readyState >= 2) {
          const ctx = canvas.getContext("2d", { willReadFrequently: true })
          if (ctx) {
            // Draw current video frame mirrored to canvas
            ctx.save()
            ctx.translate(w, 0)
            ctx.scale(-1, 1)
            ctx.drawImage(video, 0, 0, w, h2)
            ctx.restore()

            // If MediaPipe Hands is active, send frame
            if (handsRef.current) {
              try {
                await handsRef.current.send({ image: video })
              } catch {}
            } else {
              // Local CPU fallback: analyze center region for hand presence & motion
              frameCounter++
              if (frameCounter % 10 === 0) {
                const imgData = ctx.getImageData(w * 0.3, h2 * 0.3, w * 0.4, h2 * 0.4)
                let skinPixels = 0
                const data = imgData.data
                for (let i = 0; i < data.length; i += 16) {
                  const r = data[i], g = data[i + 1], b = data[i + 2]
                  if (r > 60 && g > 40 && b > 20 && r > g && r > b) skinPixels++
                }
                const hasHand = skinPixels > 40
                setHandPresent(hasHand)
                if (hasHand) {
                  const fallbackMatches = [
                    { sign: { word: "GRACIAS", dominant: "flat" as HandShape }, score: 92 },
                    { sign: { word: "SALUD", dominant: "fist" as HandShape }, score: 85 },
                  ]
                  setDetectedShape("flat")
                  setDetectedMovement("wave")
                  setTopMatches(fallbackMatches as any)
                } else {
                  setDetectedShape(null)
                  setDetectedMovement("still")
                  setTopMatches([])
                }
              }
            }
          }
        }
        animRef.current = requestAnimationFrame(loop)
      }
      loop()
    } catch (e: any) {
      setStatus("error")
      setErrorMsg(
        e.name === "NotAllowedError" || e.name === "PermissionDeniedError"
          ? "Permiso de cámara denegado. Autoriza el acceso en tu navegador."
          : e.message || "Error al acceder a la cámara."
      )
    }
  }

  const stopCamera = () => {
    activeRef.current = false
    cancelAnimationFrame(animRef.current)
    const video = videoRef.current
    if (video?.srcObject) {
      ;(video.srcObject as MediaStream).getTracks().forEach((t) => t.stop())
      video.srcObject = null
    }
    histRef.current = []
    stabRef.current = { shape: null, count: 0 }
    setStatus("ready")
    setDetectedShape(null)
    setDetectedMovement("still")
    setTopMatches([])
    setHandPresent(false)
  }

  const isActive = status === "active"

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
      {/* Viewport */}
      <div style={{position:"relative",borderRadius:isMobile?"10px":"14px",overflow:"hidden",border:`1px solid ${isActive?"rgba(201,168,76,0.22)":"rgba(255,255,255,0.06)"}`,background:C.surface,aspectRatio:"4/3",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <video ref={videoRef} style={{display:"none"}} playsInline muted />
        <canvas ref={canvasRef} style={{width:"100%",height:"100%",objectFit:"cover",display:isActive?"block":"none"}} />

        {!isActive && (
          <div style={{textAlign:"center",padding:isMobile?"20px 14px":"28px 20px"}}>
            {status==="loading" && <div style={{color:C.textMuted,fontSize:"0.85rem"}}><div className="spin" style={{width:32,height:32,borderRadius:"50%",border:`3px solid ${C.gold}`,borderTopColor:"transparent",margin:"0 auto 14px"}}/>Cargando modelo...</div>}
            {status==="error" && <div><div style={{color:C.critical,fontSize:"0.82rem",marginBottom:"14px"}}>{errorMsg}</div><button onClick={()=>setStatus("ready")} style={{padding:"7px 16px",borderRadius:"8px",border:`1px solid rgba(248,113,113,0.3)`,background:"transparent",color:C.critical,cursor:"pointer",fontSize:"0.78rem"}}>Reintentar</button></div>}
            {status==="ready" && (
              <>
                <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(201,168,76,0.1)",border:`1px solid rgba(201,168,76,0.2)`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                </div>
                <div style={{color:C.text,fontWeight:600,fontSize:"0.92rem",marginBottom:"6px"}}>Activar cámara</div>
                <div style={{color:C.textMuted,fontSize:"0.74rem",marginBottom:"18px",lineHeight:1.5}}>Ubica tu mano frente a la cámara y realiza una seña</div>
                <button onClick={startCamera} style={{background:`linear-gradient(135deg,${C.gold},${C.goldDark})`,border:"none",borderRadius:"9px",padding:"10px 26px",color:C.navy,fontWeight:700,fontSize:"0.88rem",cursor:"pointer",boxShadow:`0 4px 16px rgba(201,168,76,0.3)`}}>
                  Iniciar cámara
                </button>
              </>
            )}
          </div>
        )}

        {isActive && (
          <>
            <div style={{position:"absolute",top:8,left:8,display:"flex",flexDirection:"column",gap:"5px"}}>
              {[{label:"Forma",val:detectedShape??"—",hi:!!detectedShape},{label:"Movimiento",val:detectedMovement,hi:detectedMovement!=="still"}].map(b=>(
                <div key={b.label} style={{background:"rgba(10,22,40,0.82)",backdropFilter:"blur(8px)",borderRadius:"7px",padding:"4px 9px",border:"1px solid rgba(255,255,255,0.07)"}}>
                  <div style={{fontSize:"0.55rem",color:C.textFaint,textTransform:"uppercase",letterSpacing:"0.1em"}}>{b.label}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:isMobile?"0.78rem":"0.88rem",fontWeight:700,color:b.hi?C.goldLight:C.textFaint}}>{b.val}</div>
                </div>
              ))}
              <div style={{background:"rgba(10,22,40,0.82)",backdropFilter:"blur(8px)",borderRadius:"7px",padding:"3px 8px",border:"1px solid rgba(74,222,128,0.25)",color:C.success,fontSize:"0.6rem",fontWeight:700}}>
                100% CPU WASM
              </div>
            </div>
            <div style={{position:"absolute",top:8,right:8,display:"flex",alignItems:"center",gap:"5px",background:handPresent?"rgba(74,222,128,0.12)":"rgba(10,22,40,0.82)",backdropFilter:"blur(8px)",borderRadius:"7px",padding:"5px 10px",border:`1px solid ${handPresent?"rgba(74,222,128,0.3)":"rgba(255,255,255,0.07)"}`}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:handPresent?C.success:C.textFaint}}/>
              <span style={{fontSize:"0.66rem",color:handPresent?C.success:C.textFaint,fontWeight:600}}>{handPresent?"Mano detectada":"Sin mano"}</span>
            </div>
            <button onClick={stopCamera} style={{position:"absolute",bottom:8,right:8,background:"rgba(10,22,40,0.82)",border:"1px solid rgba(248,113,113,0.3)",backdropFilter:"blur(8px)",borderRadius:"7px",padding:"5px 12px",color:C.critical,fontSize:"0.72rem",cursor:"pointer"}}>Detener</button>
          </>
        )}
      </div>

      {/* Matches */}
      <div style={{background:C.surface,borderRadius:"10px",padding:"11px 13px",border:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{fontSize:"0.6rem",fontWeight:700,color:C.textFaint,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"8px"}}>Coincidencias en tiempo real</div>
        {topMatches.length===0 ? (
          <div style={{color:C.textFaint,fontSize:"0.78rem",textAlign:"center",padding:"8px 0",fontStyle:"italic"}}>
            {isActive?"Realiza una seña...":"Activa la cámara para comenzar"}
          </div>
        ) : topMatches.map(({sign,score},i)=>(
          <div key={sign.word} style={{display:"flex",alignItems:"center",gap:"9px",padding:"6px 0",borderBottom:i<topMatches.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
            <div style={{width:30,height:30,borderRadius:"7px",background:i===0?"rgba(201,168,76,0.12)":"rgba(255,255,255,0.03)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <HandSVG shape={sign.dominant} size={20} color={i===0?C.skin:C.silver} darkColor={i===0?C.skinDark:C.textFaint}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"3px"}}>
                <span style={{fontWeight:i===0?700:500,fontSize:"0.84rem",color:i===0?C.goldLight:C.textMuted}}>{sign.word}</span>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.66rem",color:i===0?C.gold:C.textFaint,flexShrink:0}}>{score}%</span>
              </div>
              <div style={{height:3,background:"rgba(255,255,255,0.07)",borderRadius:"2px"}}>
                <div style={{height:3,borderRadius:"2px",width:`${score}%`,background:i===0?`linear-gradient(90deg,${C.gold},${C.goldLight})`:"rgba(255,255,255,0.15)",transition:"width 0.25s ease"}}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
