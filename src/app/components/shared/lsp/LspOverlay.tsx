import React, { useState, useEffect } from "react"
import { X, Globe } from "lucide-react"
import { LSP_DICTIONARY, C } from "./dictionary"
import { Translator } from "./Translator"
import { Dictionary } from "./DictionaryPanel"
import { useA11y } from "../../../contexts/A11yContext"

function useWindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth)
  useEffect(() => {
    const update = () => setWidth(window.innerWidth)
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])
  return width
}

export function LspOverlay({ onMinimize }: { onMinimize?: () => void }) {
  const { a11y, setA11y } = useA11y()
  const [tab, setTab] = useState<"traductor"|"diccionario">("traductor")
  const [infoOpen, setInfoOpen] = useState(false)
  const w = useWindowWidth()
  const isMobile = w < 640
  const isTablet = w >= 640 && w < 1024

  if (!a11y.signLang) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-6" style={{fontFamily:"'Outfit',sans-serif"}}>
      <div 
        className="w-full max-w-6xl h-full max-h-[90vh] sm:h-[85vh] rounded-xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border"
        style={{background:C.bg, color:C.text, borderColor:"rgba(201,168,76,0.2)"}}
        role="dialog"
        aria-modal="true"
        aria-label="Intérprete Avanzado LSP"
      >
        {/* Header */}
        <header style={{background:C.surface,borderBottom:"1px solid rgba(201,168,76,0.12)",padding:isMobile?"8px 12px":"10px 20px",display:"flex",alignItems:"center",gap:isMobile?"10px":"14px",flexShrink:0}}>
          <div style={{width:36,height:36,borderRadius:"9px",background:`linear-gradient(135deg,${C.gold},${C.goldDark})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 2px 12px rgba(201,168,76,0.35)`,flexShrink:0}}>
            <Globe className="text-slate-900 size-5" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{fontFamily:"'Fraunces',serif",fontSize:isMobile?"0.9rem":"1rem",fontWeight:700,margin:0,lineHeight:1.2}}>Intérprete LSP</h1>
            {!isMobile && <p style={{margin:0,fontSize:"0.6rem",color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.07em"}}>Lengua de Señas Peruana · Traducción bidireccional</p>}
          </div>

          {/* Main tabs */}
          <div style={{display:"flex",gap:"3px",marginLeft:isMobile?"auto":"16px",background:C.surfaceAlt,borderRadius:"9px",padding:"3px"}}>
            {[{key:"traductor",label:isMobile?"Traductor":"Traductor"},{key:"diccionario",label:isMobile?"Dic.":"Diccionario"}].map(t=>(
              <button key={t.key} onClick={()=>setTab(t.key as "traductor"|"diccionario")}
                style={{padding:isMobile?"5px 12px":"5px 14px",borderRadius:"6px",border:"none",background:tab===t.key?C.gold:"transparent",color:tab===t.key?C.navy:C.textMuted,fontSize:isMobile?"0.76rem":"0.78rem",fontWeight:tab===t.key?700:500,cursor:"pointer",transition:"all 0.13s",fontFamily:"inherit"}}>
                {t.label}
              </button>
            ))}
          </div>

          {!isMobile && <div style={{flex:1}}/>}

          {!isMobile && (
            <span style={{fontSize:"0.68rem",color:C.textFaint,display:"flex",alignItems:"center",gap:"4px"}}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {LSP_DICTIONARY.length} señas
            </span>
          )}

          <button onClick={()=>setInfoOpen(!infoOpen)}
            style={{background:infoOpen?"rgba(201,168,76,0.15)":"transparent",border:"1px solid rgba(201,168,76,0.25)",borderRadius:"7px",padding:isMobile?"6px 8px":"6px 12px",color:C.goldLight,cursor:"pointer",fontSize:"0.72rem",display:"flex",alignItems:"center",gap:"5px",flexShrink:0, marginLeft:isMobile?"0":"12px"}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {!isMobile && "Info"}
          </button>
          
          {onMinimize ? (
            <button 
              onClick={onMinimize}
              title="Minimizar a panel"
              className="ml-2 bg-white/5 hover:bg-white/10 text-white/80 p-2 rounded-lg transition-colors border border-transparent hover:border-white/20"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
            </button>
          ) : (
            <button 
              onClick={() => setA11y("signLang", false)}
              className="ml-2 bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 p-2 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
            >
              <X className="size-4" />
            </button>
          )}
        </header>

        {/* Info panel */}
        {infoOpen && (
          <div style={{background:C.surfaceAlt,borderBottom:"1px solid rgba(201,168,76,0.08)",padding:isMobile?"12px":"14px 20px",display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(auto-fit,minmax(210px,1fr))",gap:"12px",flexShrink:0}}>
            {[
              {t:"¿Qué es la LSP?",b:"Lengua natural de la comunidad sorda del Perú, reconocida por Ley N° 29535. Más de 380,000 hablantes en el país."},
              {t:"Seña → Texto",b:"MediaPipe Hands detecta 21 puntos de la mano vía cámara y clasifica la forma y movimiento para identificar señas."},
              {t:"Texto → Seña",b:"Escribe en español, el avatar animado realiza cada seña del diccionario LSP en secuencia automática."},
              {t:"Fuentes",b:"Glosario MINEDU, CONADIS, FENASEP. Corpus académico PUCP."},
            ].map(c=>(
              <div key={c.t}>
                <div style={{fontWeight:700,fontSize:"0.78rem",color:C.goldLight,marginBottom:"3px"}}>{c.t}</div>
                <div style={{fontSize:"0.72rem",color:C.textMuted,lineHeight:1.5}}>{c.b}</div>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div style={{flex:1,overflow:"hidden"}}>
          {tab==="traductor"
            ? <Translator isMobile={isMobile} isTablet={isTablet}/>
            : <Dictionary isMobile={isMobile} isTablet={isTablet}/>
          }
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          .spin { animation: spin 0.9s linear infinite; }
          input[type="search"]::-webkit-search-cancel-button { display:none }
          input::placeholder, textarea::placeholder { color: ${C.textFaint} }
          * { box-sizing: border-box }
          ::-webkit-scrollbar { width: 4px }
          ::-webkit-scrollbar-track { background: transparent }
          ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 4px }
          :focus-visible { outline: 2px solid ${C.gold}; outline-offset: 2px; border-radius: 4px }
          @media (hover: hover) {
            button:hover { opacity: 0.88; }
          }
        `}</style>
      </div>
    </div>
  )
}
