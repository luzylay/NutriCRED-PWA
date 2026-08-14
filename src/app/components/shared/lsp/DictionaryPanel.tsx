import React, { useState } from "react"
import { Sign } from "./types"
import { LSP_DICTIONARY, CATEGORIES, C } from "./dictionary"
import { Avatar, useAvatarAnim, SPEEDS } from "./Avatar"
import { HandSVG } from "./HandSVG"

export function Dictionary({ isMobile, isTablet }: { isMobile:boolean; isTablet:boolean }) {
  const [search, setSearch] = useState("")
  const [activeCat, setActiveCat] = useState("Todos")
  const [sign, setSign] = useState<Sign>(LSP_DICTIONARY[0])
  const [playing, setPlaying] = useState(true)
  const [speedIdx, setSpeedIdx] = useState(1)
  const [mobileTab, setMobileTab] = useState<"list"|"sign"|"info">("sign")

  const { frame, frameRef } = useAvatarAnim(playing, speedIdx)
  const isNarrow = isMobile || isTablet

  const filtered = LSP_DICTIONARY.filter(s => {
    const cat = activeCat==="Todos" || s.category===activeCat
    const q = search.toLowerCase()
    return cat && (s.word.toLowerCase().includes(q) || s.translation.toLowerCase().includes(q))
  })

  const selectSign = (s:Sign) => { setSign(s); frameRef.current=0; if(isNarrow) setMobileTab("sign") }
  const idx = LSP_DICTIONARY.indexOf(sign)

  const signList = (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"10px 10px 6px"}}>
        <div style={{position:"relative"}}>
          <svg style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.textFaint} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="search" placeholder="Buscar seña..." value={search} onChange={e=>setSearch(e.target.value)} aria-label="Buscar seña LSP"
            style={{width:"100%",padding:"7px 10px 7px 29px",background:C.surfaceAlt,border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px",color:C.text,fontSize:"0.82rem",outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
        </div>
      </div>
      <div style={{padding:"0 10px 7px",display:"flex",gap:"4px",flexWrap:"wrap"}}>
        {["Todos",...CATEGORIES].map(cat=>(
          <button key={cat} onClick={()=>setActiveCat(cat)}
            style={{padding:"3px 8px",borderRadius:"999px",border:"none",background:activeCat===cat?C.gold:"rgba(255,255,255,0.05)",color:activeCat===cat?C.navy:C.textMuted,fontSize:"0.68rem",fontWeight:activeCat===cat?700:400,cursor:"pointer"}}>
            {cat}
          </button>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"0 5px 10px"}}>
        {filtered.length===0 && <div style={{padding:"18px",textAlign:"center",color:C.textFaint,fontSize:"0.8rem"}}>Sin resultados</div>}
        {filtered.map(s=>{
          const active=sign.word===s.word
          return (
            <button key={s.word} onClick={()=>selectSign(s)}
              style={{width:"100%",display:"flex",alignItems:"center",gap:"9px",padding:"8px 9px",borderRadius:"8px",border:"none",background:active?"rgba(201,168,76,0.1)":"transparent",borderLeft:active?`3px solid ${C.gold}`:"3px solid transparent",cursor:"pointer",textAlign:"left",marginBottom:"1px"}}>
              <div style={{width:28,height:28,borderRadius:"6px",background:active?"rgba(201,168,76,0.18)":"rgba(255,255,255,0.04)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <HandSVG shape={s.dominant} size={18} color={active?C.goldLight:C.silver} darkColor={active?C.gold:C.textFaint}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:active?700:500,fontSize:"0.84rem",color:active?C.goldLight:C.text}}>{s.word}</div>
                <div style={{fontSize:"0.68rem",color:C.textFaint}}>{s.translation} · {s.category}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )

  const avatarScale = isMobile ? 0.78 : isTablet ? 0.9 : 1

  const avatarStage = (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:`radial-gradient(ellipse at 50% 42%,rgba(44,82,130,0.18) 0%,${C.bg} 68%)`,padding:"14px",position:"relative",overflow:"hidden"}}>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.035}} aria-hidden="true">
        <defs><pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M42 0L0 0 0 42" fill="none" stroke={C.gold} strokeWidth="0.5"/></pattern></defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>
      <div style={{textAlign:"center",marginBottom:"4px",position:"relative",zIndex:1}}>
        <div style={{display:"inline-block",background:`linear-gradient(135deg,${C.gold},${C.goldDark})`,borderRadius:"999px",padding:"5px 22px",fontFamily:"'DM Mono',monospace",fontSize:isMobile?"1rem":"1.1rem",fontWeight:700,color:C.navy,letterSpacing:"0.13em",boxShadow:`0 4px 18px rgba(201,168,76,0.38)`}}>
          {sign.word}
        </div>
        <div style={{fontSize:"0.76rem",color:C.textMuted,marginTop:"4px"}}>{sign.translation}</div>
      </div>
      <div style={{position:"relative",zIndex:1}}>
        <Avatar sign={sign} animFrame={frame} isPlaying={playing} scale={avatarScale}/>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"7px",background:C.surface,borderRadius:"12px",padding:"8px 14px",border:"1px solid rgba(255,255,255,0.06)",position:"relative",zIndex:1,flexWrap:"wrap",justifyContent:"center"}}>
        <button onClick={()=>selectSign(LSP_DICTIONARY[(idx-1+LSP_DICTIONARY.length)%LSP_DICTIONARY.length])}
          style={{width:32,height:32,borderRadius:"7px",border:"1px solid rgba(255,255,255,0.07)",background:"transparent",color:C.textMuted,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button onClick={()=>setPlaying(!playing)}
          style={{width:42,height:42,borderRadius:"50%",border:"none",background:`linear-gradient(135deg,${C.gold},${C.goldDark})`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 2px 12px rgba(201,168,76,0.4)`}}>
          {playing
            ? <svg width="13" height="13" viewBox="0 0 24 24" fill={C.navy}><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
            : <svg width="13" height="13" viewBox="0 0 24 24" fill={C.navy}><polygon points="5 3 19 12 5 21 5 3"/></svg>
          }
        </button>
        <button onClick={()=>selectSign(LSP_DICTIONARY[(idx+1)%LSP_DICTIONARY.length])}
          style={{width:32,height:32,borderRadius:"7px",border:"1px solid rgba(255,255,255,0.07)",background:"transparent",color:C.textMuted,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <div style={{width:1,height:26,background:"rgba(255,255,255,0.07)"}}/>
        {SPEEDS.map((s,i)=>(
          <button key={s.label} onClick={()=>setSpeedIdx(i)}
            style={{padding:"4px 10px",borderRadius:"6px",border:"none",background:speedIdx===i?"rgba(201,168,76,0.2)":"rgba(255,255,255,0.04)",color:speedIdx===i?C.goldLight:C.textMuted,fontSize:"0.72rem",fontWeight:speedIdx===i?700:400,cursor:"pointer"}}>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )

  const infoPanel = (
    <div style={{padding:"16px 14px",overflowY:"auto",height:"100%",display:"flex",flexDirection:"column",gap:"14px"}}>
      <div>
        <div style={{fontSize:"0.62rem",fontWeight:700,color:C.textFaint,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"9px"}}>Parámetros LSP</div>
        {[
          {label:"Mano dominante",  value:sign.dominant},
          {label:"No dominante",    value:sign.nonDominant},
          {label:"Movimiento",      value:sign.movement.replace(/-/g," ")},
          {label:"Ubicación",       value:sign.location},
          {label:"Expresión facial",value:sign.faceExpr},
        ].map(p=>(
          <div key={p.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",gap:"6px"}}>
            <span style={{fontSize:"0.74rem",color:C.textMuted}}>{p.label}</span>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.68rem",fontWeight:700,color:C.goldLight,background:"rgba(201,168,76,0.1)",padding:"2px 7px",borderRadius:"4px",textTransform:"uppercase",whiteSpace:"nowrap"}}>{p.value}</span>
          </div>
        ))}
      </div>

      <div style={{background:C.surfaceAlt,borderRadius:"9px",padding:"11px",border:"1px solid rgba(255,255,255,0.05)"}}>
        <div style={{fontSize:"0.62rem",fontWeight:700,color:C.textFaint,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"6px"}}>Descripción</div>
        <p style={{margin:0,fontSize:"0.79rem",color:C.textMuted,lineHeight:1.6}}>{sign.description}</p>
      </div>

      <div>
        <div style={{fontSize:"0.62rem",fontWeight:700,color:C.textFaint,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"9px"}}>Configuración de manos</div>
        <div style={{display:"flex",gap:"8px"}}>
          {[
            {shape:sign.dominant,label:"Dominante",mirrored:false,hl:true},
            ...(sign.twoHands?[{shape:sign.nonDominant,label:"No dominante",mirrored:true,hl:false}]:[])
          ].map(h=>(
            <div key={h.label} style={{flex:1,background:C.surfaceAlt,borderRadius:"9px",padding:"10px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:"5px",border:`1px solid ${h.hl?"rgba(201,168,76,0.18)":"rgba(255,255,255,0.04)"}`}}>
              <HandSVG shape={h.shape} size={46} color={C.skin} darkColor={C.skinDark} mirrored={h.mirrored}/>
              <span style={{fontSize:"0.62rem",color:h.hl?C.gold:C.textMuted,fontWeight:700}}>{h.label}</span>
              <span style={{fontSize:"0.6rem",color:C.textFaint,fontFamily:"'DM Mono',monospace"}}>{h.shape}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:"rgba(201,168,76,0.05)",borderRadius:"8px",padding:"10px 11px",border:"1px solid rgba(201,168,76,0.1)",marginTop:"auto"}}>
        <div style={{fontSize:"0.64rem",color:C.textFaint,lineHeight:1.5}}>
          <strong style={{color:C.goldLight,display:"block",marginBottom:"2px"}}>Fuentes</strong>
          Glosario LSP — MINEDU · CONADIS · FENASEP · Corpus PUCP
        </div>
      </div>
    </div>
  )

  if (!isNarrow) {
    // Desktop: three-panel
    return (
      <div style={{display:"flex",height:"100%",overflow:"hidden"}}>
        <div style={{width:240,background:C.surface,borderRight:"1px solid rgba(255,255,255,0.05)",flexShrink:0}}>
          {signList}
        </div>
        {avatarStage}
        <div style={{width:244,background:C.surface,borderLeft:"1px solid rgba(255,255,255,0.05)",flexShrink:0}}>
          {infoPanel}
        </div>
      </div>
    )
  }

  // Mobile/tablet: tabs
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Mobile tab bar */}
      <div style={{display:"flex",background:C.surface,borderBottom:"1px solid rgba(255,255,255,0.05)",flexShrink:0}}>
        {[
          {key:"list",label:"Lista",icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>},
          {key:"sign",label:"Seña",icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 11V6a2 2 0 0 0-4 0v5"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-16 0v-5"/></svg>},
          {key:"info",label:"Info",icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>},
        ].map(tab=>{
          const active=mobileTab===tab.key
          return (
            <button key={tab.key} onClick={()=>setMobileTab(tab.key as "list"|"sign"|"info")}
              style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",padding:"9px 4px 8px",background:"transparent",border:"none",borderBottom:`2px solid ${active?C.gold:"transparent"}`,cursor:"pointer",color:active?C.goldLight:C.textMuted,fontSize:"0.72rem",fontWeight:active?700:400,fontFamily:"inherit",marginBottom:"-1px"}}>
              <span style={{color:active?C.gold:C.textFaint}}>{tab.icon}</span>
              {tab.label}
            </button>
          )
        })}
      </div>

      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        {mobileTab==="list" && signList}
        {mobileTab==="sign" && avatarStage}
        {mobileTab==="info" && infoPanel}
      </div>
    </div>
  )
}
