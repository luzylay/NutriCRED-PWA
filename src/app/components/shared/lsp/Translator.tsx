import React, { useState } from "react"
import { C } from "./dictionary"
import { CameraPanel } from "./CameraPanel"
import { TranscriptPanel } from "./TranscriptPanel"
import { TextToSign } from "./TextToSign"

export function Translator({ isMobile, isTablet }: { isMobile:boolean; isTablet:boolean }) {
  const [mode, setMode] = useState<"camera"|"text">("camera")
  const [detectedWords, setDetectedWords] = useState<string[]>([])

  const isNarrow = isMobile || isTablet

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Sub-tabs */}
      <div style={{background:C.surface,borderBottom:"1px solid rgba(255,255,255,0.05)",padding:`0 ${isMobile?"12px":"20px"}`,display:"flex",alignItems:"center",flexShrink:0}}>
        {[
          {key:"camera",icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,label:"Seña → Texto"},
          {key:"text",  icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>,label:"Texto → Seña"},
        ].map(tab => {
          const active = mode === tab.key
          return (
            <button key={tab.key} onClick={()=>setMode(tab.key as "camera"|"text")}
              style={{display:"flex",alignItems:"center",gap:"7px",padding:`10px ${isMobile?"12px":"16px"}`,background:"transparent",border:"none",borderBottom:`2px solid ${active?C.gold:"transparent"}`,cursor:"pointer",color:active?C.goldLight:C.textMuted,fontSize:isMobile?"0.8rem":"0.84rem",fontWeight:active?700:400,transition:"all 0.14s",fontFamily:"inherit",marginBottom:"-1px",flexShrink:0}}>
              <span style={{color:active?C.gold:C.textFaint}}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          )
        })}
        {!isMobile && (
          <span style={{marginLeft:"auto",fontSize:"0.66rem",color:C.textFaint,paddingRight:"4px"}}>
            {mode==="camera"?"MediaPipe Hands · tiempo real":"Diccionario LSP · 36 señas"}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{flex:1,overflow:"hidden"}}>
        {mode==="camera" ? (
          isNarrow ? (
            // Mobile/tablet: stacked scroll
            <div style={{height:"100%",overflowY:"auto",padding:isMobile?"12px":"16px",display:"flex",flexDirection:"column",gap:"12px"}}>
              <CameraPanel onWordDetected={w=>setDetectedWords(p=>[...p,w])} isMobile={isMobile}/>
              <TranscriptPanel words={detectedWords} onClear={()=>setDetectedWords([])} onCopy={()=>navigator.clipboard?.writeText(detectedWords.join(" "))} isMobile={isMobile}/>
            </div>
          ) : (
            // Desktop: side by side
            <div style={{display:"flex",height:"100%"}}>
              <div style={{width:420,flexShrink:0,padding:"18px 16px",overflowY:"auto",borderRight:"1px solid rgba(255,255,255,0.05)"}}>
                <CameraPanel onWordDetected={w=>setDetectedWords(p=>[...p,w])} isMobile={false}/>
              </div>
              <div style={{flex:1,padding:"18px 16px",overflowY:"auto"}}>
                <TranscriptPanel words={detectedWords} onClear={()=>setDetectedWords([])} onCopy={()=>navigator.clipboard?.writeText(detectedWords.join(" "))} isMobile={false}/>
              </div>
            </div>
          )
        ) : (
          <TextToSign isMobile={isMobile} isTablet={isTablet}/>
        )}
      </div>
    </div>
  )
}
