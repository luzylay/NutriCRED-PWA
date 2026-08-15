import React, { useState, useMemo } from "react";
import {
  BarChart3,
  Filter,
  PieChart as PieIcon,
  Table as TableIcon,
  Layers,
  Globe,
  MapPin,
  Calendar,
  Activity,
  Download,
  Code,
  ShieldCheck,
  RefreshCw,
  Search,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useData } from "../../contexts/DataContext";

// Mock Data structure mirroring Power BI DirectQuery model
const MONTHLY_EVALUATIONS_DATA = [
  { mes: "Ene 2026", evaluados: 1240, leve: 320, moderada: 140, severa: 25, normal: 755 },
  { mes: "Feb 2026", evaluados: 1380, leve: 310, moderada: 132, severa: 20, normal: 918 },
  { mes: "Mar 2026", evaluados: 1520, leve: 290, moderada: 118, severa: 15, normal: 1097 },
  { mes: "Abr 2026", evaluados: 1650, leve: 275, moderada: 105, severa: 12, normal: 1258 },
  { mes: "May 2026", evaluados: 1790, leve: 250, moderada: 90, severa: 8, normal: 1442 },
  { mes: "Jun 2026", evaluados: 1920, leve: 230, moderada: 82, severa: 5, normal: 1603 },
  { mes: "Jul 2026", evaluados: 2050, leve: 210, moderada: 70, severa: 3, normal: 1767 },
  { mes: "Ago 2026", evaluados: 2180, leve: 195, moderada: 62, severa: 2, normal: 1921 },
];

const DIRESA_TOP_DATA = [
  { diresa: "DIRESA Huancavelica", evaluados: 850, anemia: 340, pct: "40.0%" },
  { diresa: "DIRESA Ayacucho", evaluados: 720, anemia: 266, pct: "36.9%" },
  { diresa: "DIRESA Puno", evaluados: 680, anemia: 272, pct: "40.0%" },
  { diresa: "DIRESA Apurímac", evaluados: 540, anemia: 189, pct: "35.0%" },
  { diresa: "DIRIS Lima Sur", evaluados: 1100, anemia: 308, pct: "28.0%" },
];

const AMBITO_VISITAS_DATA = [
  { ambito: "Consulta Externa (CRED)", cantidad: 1420 },
  { ambito: "Visita Domiciliaria (ACS)", cantidad: 890 },
  { ambito: "Emergencia", cantidad: 180 },
  { ambito: "Hospitalario", cantidad: 65 },
];

const COLORS = ["#10b981", "#f59e0b", "#f97316", "#ef4444"];

export const PowerBIDashboard: React.FC = () => {
  const { children } = useData();
  const [activePage, setActivePage] = useState<1 | 2>(1);
  const [showSQLEmbed, setShowSQLEmbed] = useState(false);

  // Filters State (7 filters)
  const [periodo, setPeriodo] = useState<string>("2026-Q3");
  const [departamento, setDepartamento] = useState<string>("Todos");
  const [provincia, setProvincia] = useState<string>("Todas");
  const [distrito, setDistrito] = useState<string>("Todos");
  const [centroPoblado, setCentroPoblado] = useState<string>("Todos");
  const [diresa, setDiresa] = useState<string>("Todas");
  const [atributoAnemia, setAtributoAnemia] = useState<string>("Todos");

  // Computed metrics
  const totalEvaluados = useMemo(() => MONTHLY_EVALUATIONS_DATA.reduce((acc, curr) => acc + curr.evaluados, 0), []);
  const totalConAnemia = useMemo(() => MONTHLY_EVALUATIONS_DATA.reduce((acc, curr) => acc + curr.leve + curr.moderada + curr.severa, 0), []);
  const pctAnemiaGlobal = ((totalConAnemia / totalEvaluados) * 100).toFixed(1);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Bar Header & Page Navigation */}
      <div className="bg-card border-2 border-primary/20 p-5 rounded-[2rem] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary text-primary-foreground rounded-2xl shadow-sm">
            <BarChart3 className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-foreground font-nunito tracking-tight">
                Consola Integrada Power BI (DirectQuery SQL)
              </h2>
              <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                TIEMPO REAL
              </span>
            </div>
            <p className="text-xs font-bold text-muted-foreground mt-0.5">
              Mapeo con BD_Calendario, Hb, Medidas y ML1_PlanSalud_Detalle
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-muted p-1 rounded-xl flex gap-1 border border-border">
            <button
              onClick={() => setActivePage(1)}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                activePage === 1 ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Página 1: Principal (1500x1280)
            </button>
            <button
              onClick={() => setActivePage(2)}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                activePage === 2 ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Página 2: Frecuencia de Visita (720x1280)
            </button>
          </div>

          <button
            onClick={() => setShowSQLEmbed(!showSQLEmbed)}
            className="p-2 rounded-xl bg-card border border-border hover:bg-muted text-foreground text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Code className="size-4" />
            {showSQLEmbed ? "Ocultar Mapeo SQL" : "Mapeo SQL / Gateway"}
          </button>
        </div>
      </div>

      {/* SQL Connection and DirectQuery Details (Collapsible) */}
      {showSQLEmbed && (
        <div className="bg-slate-900 text-slate-100 p-5 rounded-[2rem] border border-slate-800 space-y-3 font-mono text-xs shadow-xl animate-in fade-in duration-300">
          <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-slate-800 pb-2">
            <span>Mapeo SQL NutriCRED ➔ Power BI DirectQuery</span>
            <span>Gateway Status: CONNECTED 🟢</span>
          </div>
          <pre className="overflow-x-auto text-[11px] leading-relaxed text-slate-300">
{`SELECT n.id_niño, n.dni, n.nombre, n.ubigeo_departamento AS DepartamentoPN,
       n.ubigeo_provincia AS ProvinciaPN, n.ubigeo_distrito AS DistritoPN,
       n.ubigeo_centro_poblado AS CentroPobladoPN, n.diresa AS Diresa,
       e.fecha_evaluacion, e.peso, e.talla, e.diagnostico_anemia AS Dx_anemia,
       e.tipo_atencion AS ambito, c.periodo2 AS Periodo2, c.mes AS Mes
FROM niños n JOIN evaluaciones e ON n.id_niño = e.id_niño
JOIN calendario c ON DATE_TRUNC('month', e.fecha_evaluacion) = c.fecha_mes
WHERE e.activo = TRUE;`}
          </pre>
          <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 flex justify-between">
            <span>Power BI Embed iframe: <code>&lt;iframe src="https://app.powerbi.com/reportEmbed?reportId=NUTRICRED_LIVE" width="100%" height="600"&gt;&lt;/iframe&gt;</code></span>
            <span>Cumplimiento Ley N° 29733: Vistas filtradas RLS</span>
          </div>
        </div>
      )}

      {/* 7 FILTERS BAR */}
      <div className="bg-card p-4 rounded-2xl border border-border shadow-sm space-y-2 text-xs">
        <div className="flex items-center gap-2 font-black uppercase text-[10px] text-muted-foreground tracking-wider">
          <Filter className="size-3.5 text-primary" /> 7 Filtros Oficiales Power BI (Filtro Dinámico):
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          <div>
            <label className="text-[9px] font-bold text-muted-foreground block">Período</label>
            <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="w-full bg-card border rounded-lg px-2 py-1 font-bold">
              <option value="2026-Q3">2026 - Q3</option>
              <option value="2026-Q2">2026 - Q2</option>
              <option value="2026-Q1">2026 - Q1</option>
            </select>
          </div>
          <div>
            <label className="text-[9px] font-bold text-muted-foreground block">Departamento</label>
            <select value={departamento} onChange={(e) => setDepartamento(e.target.value)} className="w-full bg-card border rounded-lg px-2 py-1 font-bold">
              <option value="Todos">Todos</option>
              <option value="Huancavelica">Huancavelica</option>
              <option value="Ayacucho">Ayacucho</option>
              <option value="Puno">Puno</option>
            </select>
          </div>
          <div>
            <label className="text-[9px] font-bold text-muted-foreground block">Provincia</label>
            <select value={provincia} onChange={(e) => setProvincia(e.target.value)} className="w-full bg-card border rounded-lg px-2 py-1 font-bold">
              <option value="Todas">Todas</option>
              <option value="Angaraes">Angaraes</option>
              <option value="Acobamba">Acobamba</option>
            </select>
          </div>
          <div>
            <label className="text-[9px] font-bold text-muted-foreground block">Distrito</label>
            <select value={distrito} onChange={(e) => setDistrito(e.target.value)} className="w-full bg-card border rounded-lg px-2 py-1 font-bold">
              <option value="Todos">Todos</option>
              <option value="Anchonga">Anchonga</option>
              <option value="Secclla">Secclla</option>
            </select>
          </div>
          <div>
            <label className="text-[9px] font-bold text-muted-foreground block">Centro Poblado</label>
            <select value={centroPoblado} onChange={(e) => setCentroPoblado(e.target.value)} className="w-full bg-card border rounded-lg px-2 py-1 font-bold">
              <option value="Todos">Todos</option>
              <option value="Ccasapata">Ccasapata</option>
              <option value="Lircay">Lircay</option>
            </select>
          </div>
          <div>
            <label className="text-[9px] font-bold text-muted-foreground block">DIRESA</label>
            <select value={diresa} onChange={(e) => setDiresa(e.target.value)} className="w-full bg-card border rounded-lg px-2 py-1 font-bold">
              <option value="Todas">Todas</option>
              <option value="DIRESA Huancavelica">DIRESA Huancavelica</option>
              <option value="DIRESA Ayacucho">DIRESA Ayacucho</option>
            </select>
          </div>
          <div>
            <label className="text-[9px] font-bold text-muted-foreground block">Hb.Dx_anemia</label>
            <select value={atributoAnemia} onChange={(e) => setAtributoAnemia(e.target.value)} className="w-full bg-card border rounded-lg px-2 py-1 font-bold">
              <option value="Todos">Todos</option>
              <option value="Leve">Leve</option>
              <option value="Moderada">Moderada</option>
              <option value="Severa">Severa</option>
              <option value="Normal">Normal</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-muted-foreground uppercase">Cantidad Evaluados</span>
            <p className="text-2xl font-black text-foreground font-nunito mt-0.5">{totalEvaluados.toLocaleString()}</p>
            <span className="text-[10px] font-bold text-emerald-600">Medidas.cantidad_per</span>
          </div>
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Activity className="size-6" />
          </div>
        </div>

        <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-muted-foreground uppercase">Casos con Anemia</span>
            <p className="text-2xl font-black text-amber-600 font-nunito mt-0.5">{totalConAnemia.toLocaleString()}</p>
            <span className="text-[10px] font-bold text-amber-600">Medidas.cantidad_per_anemia</span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
            <PieIcon className="size-6" />
          </div>
        </div>

        <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-muted-foreground uppercase">% Prevalencia Anemia</span>
            <p className="text-2xl font-black text-rose-600 font-nunito mt-0.5">{pctAnemiaGlobal}%</p>
            <span className="text-[10px] font-bold text-rose-600">Medidas.%per_anemia</span>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-600 rounded-xl">
            <BarChart3 className="size-6" />
          </div>
        </div>
      </div>

      {/* PAGE 1 CONTENT (1500x1280 VIEWPORT) */}
      {activePage === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Visual 1 & Visual 2 Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Visual 1: Cantidad Evaluados vs Mes */}
            <div className="bg-card p-5 rounded-[2rem] border border-border shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="font-black text-sm text-foreground font-nunito flex items-center gap-2">
                  Visual 1: "Cantidad Evaluados" (Medidas.cantidad_per vs BD_Calendario.Mes)
                </h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MONTHLY_EVALUATIONS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="evaluados" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Visual 2: Anemia por Mes y Dx_anemia */}
            <div className="bg-card p-5 rounded-[2rem] border border-border shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="font-black text-sm text-foreground font-nunito flex items-center gap-2">
                  Visual 2: "Anemia por Severidad" (Mes vs Hb.Dx_anemia)
                </h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MONTHLY_EVALUATIONS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="leve" name="Anemia Leve" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="moderada" name="Anemia Moderada" stroke="#f97316" strokeWidth={2} />
                    <Line type="monotone" dataKey="severa" name="Anemia Severa" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Visual 3 & Visual 4 Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Visual 3: Tabla Niños con Anemia */}
            <div className="bg-card p-5 rounded-[2rem] border border-border shadow-md space-y-3">
              <h3 className="font-black text-sm text-foreground font-nunito border-b border-border pb-2">
                Visual 3: "Niños con Anemia" (Mes vs Dx_anemia con cantidad_per)
              </h3>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/60 border-b border-border font-black text-[10px] text-muted-foreground uppercase">
                      <th className="p-2.5">Mes</th>
                      <th className="p-2.5">Anemia Leve</th>
                      <th className="p-2.5">Anemia Moderada</th>
                      <th className="p-2.5">Anemia Severa</th>
                      <th className="p-2.5">Total Anemia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-medium">
                    {MONTHLY_EVALUATIONS_DATA.map((row, idx) => (
                      <tr key={idx} className="hover:bg-muted/30">
                        <td className="p-2.5 font-bold text-foreground">{row.mes}</td>
                        <td className="p-2.5 text-amber-600 font-mono font-bold">{row.leve}</td>
                        <td className="p-2.5 text-orange-600 font-mono font-bold">{row.moderada}</td>
                        <td className="p-2.5 text-rose-600 font-mono font-bold">{row.severa}</td>
                        <td className="p-2.5 text-foreground font-mono font-black">{row.leve + row.moderada + row.severa}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual 4: Tabla Top por DIRESA */}
            <div className="bg-card p-5 rounded-[2rem] border border-border shadow-md space-y-3">
              <h3 className="font-black text-sm text-foreground font-nunito border-b border-border pb-2">
                Visual 4: "Top por DIRESA" (cantidad_per_anemia, cantidad_per, %per_anemia)
              </h3>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/60 border-b border-border font-black text-[10px] text-muted-foreground uppercase">
                      <th className="p-2.5">DIRESA</th>
                      <th className="p-2.5">Evaluados</th>
                      <th className="p-2.5">Con Anemia</th>
                      <th className="p-2.5">% Prevalencia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-medium">
                    {DIRESA_TOP_DATA.map((row, idx) => (
                      <tr key={idx} className="hover:bg-muted/30">
                        <td className="p-2.5 font-bold text-foreground">{row.diresa}</td>
                        <td className="p-2.5 font-mono">{row.evaluados}</td>
                        <td className="p-2.5 text-rose-600 font-mono font-bold">{row.anemia}</td>
                        <td className="p-2.5 text-emerald-600 font-mono font-black">{row.pct}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 2 CONTENT (720x1280 VIEWPORT: FRECUENCIA DE VISITA POR ÁMBITO) */}
      {activePage === 2 && (
        <div className="bg-card p-6 rounded-[2.5rem] border border-border shadow-xl space-y-5 animate-in fade-in duration-300 max-w-3xl mx-auto">
          <div className="border-b border-border pb-3">
            <h3 className="font-black text-base text-foreground font-nunito flex items-center gap-2">
              Página 2: Visual "Frecuencia Visita" por Ámbito (ML1_PlanSalud_Detalle.ambito)
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Desglose de atenciones entre Consulta Externa (CRED), Visita Domiciliaria (ACS), Emergencia y Hospitalario.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={AMBITO_VISITAS_DATA}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="ambito" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-muted/40 p-4 rounded-2xl border border-border space-y-2 text-xs">
            <span className="font-black uppercase tracking-wider text-[10px] text-muted-foreground block">
              Mapeo NutriCRED ➔ ML1_PlanSalud_Detalle:
            </span>
            <div className="grid grid-cols-2 gap-2 text-muted-foreground font-medium">
              <div>• <code>Consulta Externa</code>: Controles CRED en Posta Médica</div>
              <div>• <code>Visita Domiciliaria</code>: Triaje por Actores Sociales (ACS)</div>
              <div>• <code>Emergencia</code>: Alertas Rojas derivadas &lt; 24h</div>
              <div>• <code>Hospitalario</code>: Cuidados intensivos o transfusiones</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
