import React from "react"
import { C } from "./dictionary"

export function TranscriptPanel({ words, onClear, onCopy, isMobile }: { words:string[]; onClear:()=>void; onCopy:()=>void; isMobile:boolean }) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"10px",height:isMobile?"auto":"100%"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontSize:"0.6rem",fontWeight:700,color:C.textFaint,textTransform:"uppercase",letterSpacing:"0.1em"}}>
          Texto detectado ({words.length} {words.length===1?"seña":"señas"})
        </div>
        <div style={{display:"flex",gap:"5px"}}>
          {[{fn:onCopy,icon:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,title:"Copiar"},
           {fn:onClear,icon:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,title:"Limpiar"}
          ].map(({fn,icon,title})=>(
            <button key={title} onClick={fn} title={title} style={{width:28,height:28,borderRadius:"6px",border:"1px solid rgba(255,255,255,0.07)",background:"transparent",color:C.textMuted,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {icon}
            </button>
          ))}
        </div>
      </div>

      <div style={{flex:isMobile?"none":"1",background:C.surface,borderRadius:"10px",padding:"13px",border:"1px solid rgba(255,255,255,0.06)",overflowY:"auto",minHeight:isMobile?"80px":"120px"}}>
        {words.length===0 ? (
          <div style={{color:C.textFaint,fontSize:"0.78rem",fontStyle:"italic"}}>Las señas detectadas aparecerán aquí...</div>
        ) : (
          <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
            {words.map((w,i)=>(
              <span key={i} style={{padding:"3px 10px",borderRadius:"6px",background:i===words.length-1?"rgba(201,168,76,0.2)":"rgba(255,255,255,0.06)",border:`1px solid ${i===words.length-1?"rgba(201,168,76,0.3)":"rgba(255,255,255,0.07)"}`,fontSize:"0.8rem",fontWeight:600,color:i===words.length-1?C.goldLight:C.text,fontFamily:"'DM Mono',monospace"}}>
                {w}
              </span>
            ))}
          </div>
        )}
      </div>

      {words.length>0 && (
        <div style={{background:C.surfaceAlt,borderRadius:"9px",padding:"10px 12px",border:"1px solid rgba(255,255,255,0.05)"}}>
          <div style={{fontSize:"0.6rem",color:C.textFaint,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"5px"}}>Texto acumulado</div>
          <div style={{fontSize:"0.86rem",color:C.text,lineHeight:1.6}}>{words.join(" · ")}</div>
        </div>
      )}

      <div style={{background:"rgba(201,168,76,0.05)",borderRadius:"8px",padding:"9px 11px",border:"1px solid rgba(201,168,76,0.1)"}}>
        <div style={{fontSize:"0.63rem",color:C.textFaint,lineHeight:1.55}}>
          <strong style={{color:C.goldLight,display:"block",marginBottom:"2px"}}>Nota</strong>
          Clasificación heurística por geometría de 21 puntos (MediaPipe Hands). Mantén la mano bien iluminada y estable.
        </div>
      </div>
    </div>
  )
}
