import React, { useState, useEffect, useRef } from "react"
import { Sign } from "./types"
import { LSP_DICTIONARY, C } from "./dictionary"
import { Avatar, useAvatarAnim, SPEEDS } from "./Avatar"

interface Token { word:string; sign:Sign|null }

export function TextToSign({ isMobile, isTablet }: { isMobile:boolean; isTablet:boolean }) {
  const [text, setText] = useState("")
  const [tokens, setTokens] = useState<Token[]>([])
  const [queueIdx, setQueueIdx] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedIdx, setSpeedIdx] = useState(1)

  const { frame, frameRef } = useAvatarAnim(isPlaying, speedIdx)
  const isNarrow = isMobile || isTablet

  useEffect(() => {
    const raw = text.split(/[\s,.;]+/).filter(w=>w.trim().length>0)
    const newTokens = raw.map(w => {
      const q = w.toLowerCase()
      const match = LSP_DICTIONARY.find(s=>s.word.toLowerCase()===q || s.translation.toLowerCase()===q)
      return { word:w, sign:match||null }
    })
    setTokens(newTokens)
  }, [text])

  useEffect(() => {
    if(!isPlaying || queueIdx >= tokens.length || queueIdx < 0) return
    const current = tokens[queueIdx]
    const baseTime = current.sign ? 1800 : 800
    const ms = baseTime * (1.5 - (speedIdx * 0.3)) // scale time
    const timer = setTimeout(() => {
      frameRef.current = 0
      if(queueIdx < tokens.length - 1) setQueueIdx(queueIdx + 1)
      else setIsPlaying(false)
    }, ms)
    return () => clearTimeout(timer)
  }, [isPlaying, queueIdx, tokens, speedIdx])

  const playAll = () => {
    if(tokens.length===0) return
    setQueueIdx(0)
    frameRef.current=0
    setIsPlaying(true)
  }

  const currentSign = queueIdx>=0 && queueIdx<tokens.length ? tokens[queueIdx].sign : null
  const displaySign = currentSign || LSP_DICTIONARY[0] // fallback if no sign

  const avatarScale = isMobile ? 0.8 : isTablet ? 0.95 : 1

  const controlPanel = (
    <div style={{display:"flex",flexDirection:"column",gap:"14px",height:"100%"}}>
      <div style={{position:"relative"}}>
        <textarea placeholder="Escribe aquí para traducir a LSP (ej. médico control anemia niño)..." value={text} onChange={e=>setText(e.target.value)}
          style={{width:"100%",height:isMobile?"90px":"120px",resize:"none",padding:"12px 14px",background:C.surfaceAlt,border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",color:C.text,fontSize:"0.86rem",lineHeight:1.5,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
        {text && (
          <button onClick={()=>{setText("");setTokens([]);setIsPlaying(false)}} style={{position:"absolute",top:8,right:8,width:24,height:24,borderRadius:"50%",background:"rgba(255,255,255,0.06)",border:"none",color:C.textMuted,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",gap:"6px"}}>
          {SPEEDS.map((s,i)=>(
            <button key={s.label} onClick={()=>setSpeedIdx(i)}
              style={{padding:"5px 12px",borderRadius:"7px",border:"none",background:speedIdx===i?"rgba(201,168,76,0.2)":"rgba(255,255,255,0.05)",color:speedIdx===i?C.goldLight:C.textMuted,fontSize:"0.72rem",fontWeight:speedIdx===i?700:400,cursor:"pointer"}}>
              {s.label}
            </button>
          ))}
        </div>
        <button onClick={playAll} disabled={tokens.length===0}
          style={{padding:"8px 18px",borderRadius:"8px",border:"none",background:tokens.length>0?`linear-gradient(135deg,${C.gold},${C.goldDark})`:"rgba(255,255,255,0.05)",color:tokens.length>0?C.navy:C.textFaint,fontWeight:700,fontSize:"0.82rem",cursor:tokens.length>0?"pointer":"not-allowed",display:"flex",alignItems:"center",gap:"6px",boxShadow:tokens.length>0?`0 3px 12px rgba(201,168,76,0.3)`:"none"}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill={tokens.length>0?C.navy:C.textFaint}><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Reproducir
        </button>
      </div>

      <div style={{flex:1,background:C.surfaceAlt,borderRadius:"10px",padding:"14px",border:"1px solid rgba(255,255,255,0.05)",overflowY:"auto",minHeight:"120px"}}>
        <div style={{fontSize:"0.6rem",fontWeight:700,color:C.textFaint,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"10px"}}>Secuencia de señas</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>
          {tokens.map((t,i)=>{
            const active = isPlaying && queueIdx === i
            return (
              <span key={i} style={{padding:"5px 12px",borderRadius:"7px",background:active?C.gold:t.sign?"rgba(74,222,128,0.12)":"rgba(255,255,255,0.04)",border:`1px solid ${active?C.gold:t.sign?"rgba(74,222,128,0.25)":"rgba(255,255,255,0.06)"}`,color:active?C.navy:t.sign?C.success:C.textFaint,fontSize:"0.84rem",fontWeight:active?700:t.sign?600:400,transition:"all 0.2s"}}>
                {t.word}
              </span>
            )
          })}
          {tokens.length===0 && <div style={{color:C.textFaint,fontSize:"0.8rem",fontStyle:"italic"}}>La secuencia aparecerá aquí...</div>}
        </div>
      </div>
    </div>
  )

  const avatarStage = (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:`radial-gradient(circle at 50% 50%,rgba(44,82,130,0.15) 0%,${C.bg} 80%)`,padding:"10px",position:"relative",minHeight:isMobile?"320px":"auto"}}>
      <div style={{position:"absolute",top:20,textAlign:"center",zIndex:1}}>
        {currentSign ? (
          <div>
            <div style={{display:"inline-block",background:`linear-gradient(135deg,${C.gold},${C.goldDark})`,borderRadius:"999px",padding:"4px 20px",fontFamily:"'DM Mono',monospace",fontSize:"1rem",fontWeight:700,color:C.navy,letterSpacing:"0.1em",boxShadow:`0 4px 14px rgba(201,168,76,0.3)`}}>
              {currentSign.word}
            </div>
            <span style={{fontSize:"0.72rem",color:C.textMuted}}>{currentSign.translation}</span>
          </div>
        ) : (
          <div style={{fontFamily:"'Fraunces',serif",fontSize:"0.9rem",color:C.textFaint}}>
            {tokens.length>0?"Listo para reproducir":"Escribe texto para comenzar"}
          </div>
        )}
      </div>
      <div style={{position:"relative",zIndex:1}}>
        <Avatar sign={displaySign} animFrame={frame} isPlaying={isPlaying&&queueIdx>=0} scale={avatarScale}/>
      </div>
      {currentSign && (
        <div style={{position:"relative",zIndex:1,display:"flex",gap:"5px",flexWrap:"wrap",justifyContent:"center"}}>
          <span style={{padding:"3px 9px",borderRadius:"999px",background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.18)",fontSize:"0.68rem",color:C.gold}}>{currentSign.category}</span>
          <span style={{padding:"3px 9px",borderRadius:"999px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",fontSize:"0.68rem",color:C.textFaint}}>{currentSign.twoHands?"Dos manos":"Una mano"}</span>
        </div>
      )}
    </div>
  )

  if (isNarrow) {
    return (
      <div style={{display:"flex",flexDirection:"column",gap:"12px",padding:isMobile?"12px":"16px",overflowY:"auto",height:"100%"}}>
        {avatarStage}
        {controlPanel}
      </div>
    )
  }

  return (
    <div style={{display:"flex",height:"100%"}}>
      <div style={{width:360,flexShrink:0,background:C.surface,borderRight:"1px solid rgba(255,255,255,0.05)",padding:"18px 16px",overflowY:"auto"}}>
        {controlPanel}
      </div>
      {avatarStage}
    </div>
  )
}
