import { useState } from "react";

const GOLD = "#D4AF37";

const DATA = {
  enero: {
    revenue: {
      total:     { v26: 418625, v25: 375041, obj: 436000 },
      madCorpo:  { v26: 340000, v25: 326000, obj: 334000 },
      madDias:   { v26: 7106,   v25: 0,      obj: 30000  },
      madTur:    { v26: 32917,  v25: 48582,  obj: 38000  },
      barcelona: { v26: 20151,  v25: 18000,  obj: 15000  },
      valencia:  { v26: 3996,   v25: 6300,   obj: 8000   },
      malaga:    { v26: 13164,  v25: 6400,   obj: 14000  },
      sansebas:  { v26: 2067,   v25: 0,      obj: 1000   },
      ibiza:     { v26: 1975,   v25: 0,      obj: 1000   },
      lisboa:    null,
    },
    ocu: {
      global:    { v26: 0.8422, v25: 0.84,   obj: 0.84 },
      madrid:    { v26: 0.8444, v25: 0.85,   obj: 0.84 },
      barcelona: { v26: 0.6627, v25: null,   obj: 0.82 },
      valencia:  { v26: 0.9315, v25: null,   obj: 0.90 },
      malaga:    { v26: 0.7296, v25: null,   obj: 0.85 },
      ibiza:     { v26: 0.6774, v25: null,   obj: 0.60 },
      sansebas:  { v26: 0.3684, v25: null,   obj: 0.50 },
    },
    leads:    { inbound: { v26: 2005, v25: 1757 }, missed: { v26: 0.253, v25: 0.1748 } },
    bookings: { total: { v26: 1111, v25: 842 } },
    b2b:      { total: { v26: 100681, v25: 125530, obj: 109250 } },
  },
  febrero: {
    revenue: {
      total:     { v26: 461700, v25: 422450, obj: 508000 },
      madCorpo:  { v26: 366771, v25: 350310, obj: 405500 },
      madDias:   { v26: 18356,  v25: 0,      obj: 20000  },
      madTur:    { v26: 35314,  v25: 38039,  obj: 38000  },
      barcelona: { v26: 19246,  v25: 18587,  obj: 15000  },
      valencia:  { v26: 4256,   v25: 6478,   obj: 7000   },
      malaga:    { v26: 13059,  v25: 7865,   obj: 16000  },
      sansebas:  { v26: 405,    v25: 0,      obj: 2000   },
      ibiza:     { v26: 2116,   v25: 1055,   obj: 3000   },
      lisboa:    { v26: 813,    v25: 0,      obj: 1500   },
    },
    ocu: {
      global:    { v26: 0.8534, v25: 0.7984, obj: 0.82 },
      madrid:    { v26: 0.8578, v25: 0.7970, obj: 0.84 },
      barcelona: { v26: 0.6600, v25: 0.8339, obj: 0.82 },
      valencia:  { v26: 0.9500, v25: 0.9064, obj: 0.90 },
      malaga:    { v26: 0.9000, v25: 0.8504, obj: 0.85 },
      ibiza:     { v26: 0.5233, v25: 0.22,   obj: 0.60 },
      sansebas:  { v26: 0.40,   v25: null,   obj: 0.50 },
    },
    leads:    { inbound: { v26: 1663, v25: 1733 }, missed: { v26: 0.208, v25: 0.1951 } },
    bookings: { total: { v26: 1225, v25: 942 } },
    b2b:      { total: { v26: 118953, v25: 128600, obj: 100000 } },
  },
};

const YTD = [
  { label: "Enero",   v26: 418625, v25: 375041, obj: 436000 },
  { label: "Febrero", v26: 461700, v25: 422450, obj: 508000 },
];

function eur(v) {
  if (!v && v !== 0) return "—";
  if (v >= 1000000) return `€${(v/1000000).toFixed(2)}M`;
  if (v >= 1000)    return `€${(v/1000).toFixed(0)}K`;
  return `€${Math.round(v)}`;
}
function pp(v) { return `${(v*100).toFixed(1)}%`; }
function dd(a, b) {
  if (!b) return null;
  return ((a-b)/b*100).toFixed(1);
}

function Arrow({ value }) {
  if (value === null || value === undefined) {
    return <span style={{fontSize:10,color:"rgba(255,255,255,0.2)"}}>—</span>;
  }
  const pos = parseFloat(value) >= 0;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:3,
      padding:"3px 8px", borderRadius:20, fontSize:11, fontWeight:600,
      background: pos ? "rgba(52,211,153,0.15)" : "rgba(239,68,68,0.15)",
      color: pos ? "#34d399" : "#f87171",
    }}>
      {pos ? "▲" : "▼"} {Math.abs(value)}%
    </span>
  );
}

function Card({ label, group, value, prev, obj, type, highlight, icon }) {
  const fmt = type==="pct" ? pp(value) : type==="num" ? value?.toLocaleString("es-ES") : eur(value);
  return (
    <div style={{
      background: highlight ? "linear-gradient(135deg,rgba(212,175,55,0.1),rgba(212,175,55,0.03))" : "rgba(255,255,255,0.025)",
      border: `1px solid ${highlight ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.07)"}`,
      borderRadius:14, padding:"20px 20px 16px", position:"relative", overflow:"hidden",
      transition:"transform 0.2s",
    }}
    onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
    onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
      <div style={{position:"absolute",top:0,right:0,width:44,height:44,
        background:highlight?"rgba(212,175,55,0.07)":"rgba(255,255,255,0.015)",
        borderRadius:"0 14px 0 44px"}}/>
      <div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",
        color:"rgba(255,255,255,0.3)",marginBottom:2,fontFamily:"'DM Sans',sans-serif"}}>{group}</div>
      <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginBottom:10,
        fontFamily:"'DM Sans',sans-serif"}}>{icon} {label}</div>
      <div style={{fontSize:highlight?56:28,fontFamily:"'Playfair Display',serif",fontWeight:700,
        color:highlight?GOLD:"#fff",letterSpacing:-1,lineHeight:1,marginBottom:10}}>{fmt}</div>
      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <Arrow value={dd(value,prev)}/>
          <span style={{fontSize:10,color:"rgba(255,255,255,0.25)",fontFamily:"'DM Sans',sans-serif"}}>vs 2025</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <Arrow value={dd(value,obj)}/>
          <span style={{fontSize:10,color:"rgba(255,255,255,0.25)",fontFamily:"'DM Sans',sans-serif"}}>vs budget</span>
        </div>
      </div>
    </div>
  );
}

function SecHeader({ title }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
      <div style={{width:3,height:14,background:GOLD,borderRadius:2}}/>
      <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",
        color:"rgba(255,255,255,0.3)",fontFamily:"'DM Sans',sans-serif"}}>{title}</div>
    </div>
  );
}

function CityTile({ city, o }) {
  const okObj = !o.obj || o.v26 >= o.obj;
  const dV25  = o.v25 ? dd(o.v26, o.v25) : null;
  const dObj  = o.obj  ? dd(o.v26, o.obj) : null;
  return (
    <div style={{background:"rgba(255,255,255,0.03)",borderRadius:10,padding:16,
      border:`1px solid ${okObj?"rgba(52,211,153,0.15)":"rgba(255,255,255,0.05)"}`}}>
      <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",fontFamily:"'DM Sans',sans-serif",marginBottom:8}}>{city}</div>
      <div style={{fontSize:26,fontFamily:"'Playfair Display',serif",fontWeight:700,
        color:okObj?"#34d399":GOLD,marginBottom:10}}>{Math.round(o.v26*100)}%</div>
      <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:2,marginBottom:10,position:"relative"}}>
        <div style={{height:"100%",width:`${Math.min(o.v26*100,100)}%`,borderRadius:2,
          background:okObj?"linear-gradient(90deg,#34d399,#059669)":`linear-gradient(90deg,${GOLD},#B8960C)`}}/>
        {o.obj && <div style={{position:"absolute",top:-2,left:`${o.obj*100}%`,
          width:2,height:8,background:"rgba(255,255,255,0.3)",borderRadius:1}}/>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:3}}>
        {dV25 && <span style={{fontSize:10,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
          color:parseFloat(dV25)>=0?"#34d399":"#f87171"}}>
          {parseFloat(dV25)>=0?"▲":"▼"} {Math.abs(dV25)}% vs 2025</span>}
        {dObj && <span style={{fontSize:10,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
          color:parseFloat(dObj)>=0?"#34d399":"#f87171"}}>
          {parseFloat(dObj)>=0?"▲":"▼"} {Math.abs(dObj)}% vs obj</span>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [active, setActive] = useState("febrero");
  const d = DATA[active];

  const DEST = ["madTur","barcelona","valencia","malaga","sansebas","ibiza","lisboa"];
  const destV26 = DEST.reduce((s,k) => s+(d.revenue[k]?.v26||0),0);
  const destV25 = DEST.reduce((s,k) => s+(d.revenue[k]?.v25||0),0);
  const destObj  = DEST.reduce((s,k) => s+(d.revenue[k]?.obj||0),0);
  const madDV26 = (d.revenue.madDias?.v26||0)+(d.revenue.madTur?.v26||0);
  const madDV25 = (d.revenue.madDias?.v25||0)+(d.revenue.madTur?.v25||0);
  const madDObj  = (d.revenue.madDias?.obj||0)+(d.revenue.madTur?.obj||0);
  const ytdV26 = 418625+461700, ytdV25 = 375041+422450, ytdObj = 436000+508000;

  const ocuGlobal = d.ocu.global;
  const ocuOk = ocuGlobal.v26 >= ocuGlobal.obj;

  // Resumen automático del mes
  const rev = d.revenue.total;
  const gap = rev.v26 - rev.obj;
  const gapPct = Math.abs(dd(rev.v26, rev.obj));
  const vs25 = dd(rev.v26, rev.v25);
  const cumpleBudget = rev.v26 >= rev.obj;
  const mes = active === "enero" ? "Enero" : "Febrero";
  const resumen = cumpleBudget
    ? `${mes} cerró ${gapPct}% por encima de budget (+${eur(gap)}), con una facturación de ${eur(rev.v26)} — ${parseFloat(vs25)>=0 ? `+${vs25}% vs ${active==="enero"?2025:2025}` : `${vs25}% vs 2025`}.`
    : `${mes} cerró ${gapPct}% por debajo de budget (${eur(gap)} de desviación), con una facturación de ${eur(rev.v26)} — ${parseFloat(vs25)>=0 ? `+${vs25}% vs 2025` : `${vs25}% vs 2025`}.`;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
      <div style={{minHeight:"100vh",background:"#080a0f",
        backgroundImage:"radial-gradient(ellipse at 15% 40%,rgba(212,175,55,0.05) 0%,transparent 55%)",
        fontFamily:"'DM Sans',sans-serif"}}>

        {/* HEADER */}
        <div style={{borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"18px 36px",
          display:"flex",justifyContent:"space-between",alignItems:"center",
          background:"rgba(8,10,15,0.92)",backdropFilter:"blur(20px)",
          position:"sticky",top:0,zIndex:100}}>
          <div>
            <div style={{fontSize:10,letterSpacing:4,textTransform:"uppercase",color:GOLD,marginBottom:2,fontWeight:500}}>Homeclub</div>
            <div style={{fontSize:19,fontFamily:"'Playfair Display',serif",color:"#fff",fontWeight:600}}>Dashboard Comercial</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            {["enero","febrero"].map(m=>(
              <button key={m} onClick={()=>setActive(m)} style={{
                padding:"7px 18px",
                background:active===m?"linear-gradient(135deg,#D4AF37,#B8960C)":"rgba(255,255,255,0.05)",
                border:active===m?"none":"1px solid rgba(255,255,255,0.1)",
                borderRadius:8,color:active===m?"#000":"rgba(255,255,255,0.5)",
                fontSize:12,fontWeight:active===m?700:400,cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif",textTransform:"capitalize",
              }}>{m.charAt(0).toUpperCase()+m.slice(1)} 2026</button>
            ))}
          </div>
        </div>

        <div style={{padding:"24px 36px 48px"}}>

          {/* FILA 1: Facturación Total */}
          <div style={{marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:32,
              padding:"24px 28px",background:"linear-gradient(135deg,rgba(212,175,55,0.1),rgba(212,175,55,0.03))",
              border:"1px solid rgba(212,175,55,0.3)",borderRadius:16}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,
                lineHeight:1,color:cumpleBudget?"#34d399":GOLD,fontSize:"5rem",letterSpacing:"-2px"}}>
                {eur(d.revenue.total.v26)}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",fontFamily:"'DM Sans',sans-serif",
                  letterSpacing:2,textTransform:"uppercase"}}>Facturación Total</div>
                <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                  <Arrow value={dd(d.revenue.total.v26, d.revenue.total.v25)}/>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.3)",fontFamily:"'DM Sans',sans-serif"}}>vs 2025</span>
                  <Arrow value={dd(d.revenue.total.v26, d.revenue.total.obj)}/>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.3)",fontFamily:"'DM Sans',sans-serif"}}>vs budget ({eur(d.revenue.total.obj)})</span>
                </div>
              </div>
            </div>
            <div style={{marginTop:10,padding:"12px 16px",
              background:cumpleBudget?"rgba(52,211,153,0.07)":"rgba(239,68,68,0.07)",
              border:`1px solid ${cumpleBudget?"rgba(52,211,153,0.2)":"rgba(239,68,68,0.2)"}`,
              borderRadius:10}}>
              <span style={{fontSize:13,color:cumpleBudget?"#34d399":"#f87171",
                fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>
                {cumpleBudget?"✓":"✗"}
              </span>
              <span style={{fontSize:13,color:"rgba(255,255,255,0.6)",
                fontFamily:"'DM Sans',sans-serif",marginLeft:8}}>{resumen}</span>
            </div>
          </div>

          {/* FILA 2: Desglose revenue */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
            <Card group="Revenue" label="Madrid Corpo" icon="◆"
              value={d.revenue.madCorpo.v26} prev={d.revenue.madCorpo.v25} obj={d.revenue.madCorpo.obj}/>
            <Card group="Revenue" label="Madrid Días" icon="◇"
              value={madDV26} prev={madDV25||null} obj={madDObj}/>
            <Card group="Revenue" label="Destinos" icon="◈"
              value={destV26} prev={destV25||null} obj={destObj}/>
          </div>

          {/* FACTURACIÓN POR DESTINO */}
          <div style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.07)",
            borderRadius:16,padding:22,marginBottom:16}}>
            <SecHeader title="Facturación por Destino"/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {[
                {label:"Mad Corpo", v:d.revenue.madCorpo},
                {label:"Mad Días",  v:d.revenue.madDias},
                {label:"Mad Tur",   v:d.revenue.madTur},
                {label:"Barcelona", v:d.revenue.barcelona},
                {label:"Valencia",  v:d.revenue.valencia},
                {label:"Málaga",    v:d.revenue.malaga},
                {label:"S. Sebas",  v:d.revenue.sansebas},
                {label:"Ibiza",     v:d.revenue.ibiza},
                {label:"Lisboa",    v:d.revenue.lisboa},
              ].filter(i=>i.v).map(({label,v})=>{
                const ok  = v.v26>=v.obj;
                const dV25 = v.v25 ? dd(v.v26,v.v25) : null;
                const dObj = v.obj  ? dd(v.v26,v.obj) : null;
                return (
                  <div key={label} style={{background:"rgba(255,255,255,0.03)",borderRadius:8,padding:"10px 12px",
                    border:`1px solid ${ok?"rgba(52,211,153,0.15)":"rgba(255,255,255,0.05)"}`}}>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontFamily:"'DM Sans',sans-serif",marginBottom:3}}>{label}</div>
                    <div style={{fontSize:15,fontFamily:"'Playfair Display',serif",
                      color:ok?"#34d399":"#fff",fontWeight:700,marginBottom:6}}>{eur(v.v26)}</div>
                    <div style={{display:"flex",flexDirection:"column",gap:3}}>
                      <div style={{display:"flex",alignItems:"center",gap:4}}>
                        <Arrow value={dV25}/>
                        <span style={{fontSize:9,color:"rgba(255,255,255,0.2)",fontFamily:"'DM Sans',sans-serif"}}>vs 2025</span>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:4}}>
                        <Arrow value={dObj}/>
                        <span style={{fontSize:9,color:"rgba(255,255,255,0.2)",fontFamily:"'DM Sans',sans-serif"}}>vs budget</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* YTD */}
          <div style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.07)",
            borderRadius:16,padding:22,marginBottom:16}}>
            <SecHeader title="Evolución Facturación YTD"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:8,marginBottom:8}}>
              {["Mes","2026","Budget","vs Budget","vs 2025"].map(h=>(
                <div key={h} style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase",
                  color:"rgba(255,255,255,0.25)",fontFamily:"'DM Sans',sans-serif",
                  textAlign:h==="Mes"?"left":"right"}}>{h}</div>
              ))}
            </div>
            {YTD.map(({label,v26,v25,obj})=>(
              <div key={label} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",
                gap:8,padding:"11px 0",borderTop:"1px solid rgba(255,255,255,0.05)",alignItems:"center"}}>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>{label}</div>
                <div style={{fontSize:15,fontFamily:"'Playfair Display',serif",fontWeight:700,color:"#fff",textAlign:"right"}}>{eur(v26)}</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.3)",fontFamily:"'DM Sans',sans-serif",textAlign:"right"}}>{eur(obj)}</div>
                <div style={{textAlign:"right"}}><Arrow value={dd(v26,obj)}/></div>
                <div style={{textAlign:"right"}}><Arrow value={v25?dd(v26,v25):null}/></div>
              </div>
            ))}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",
              gap:8,padding:"11px 0",borderTop:`1px solid rgba(212,175,55,0.25)`,alignItems:"center"}}>
              <div style={{fontSize:12,color:GOLD,fontFamily:"'DM Sans',sans-serif",fontWeight:600,letterSpacing:1,textTransform:"uppercase"}}>YTD Total</div>
              <div style={{fontSize:16,fontFamily:"'Playfair Display',serif",fontWeight:700,color:GOLD,textAlign:"right"}}>{eur(ytdV26)}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.3)",fontFamily:"'DM Sans',sans-serif",textAlign:"right"}}>{eur(ytdObj)}</div>
              <div style={{textAlign:"right"}}><Arrow value={dd(ytdV26,ytdObj)}/></div>
              <div style={{textAlign:"right"}}><Arrow value={dd(ytdV26,ytdV25)}/></div>
            </div>
          </div>

          {/* OCUPACIÓN */}
          <div style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.07)",
            borderRadius:16,padding:22,marginBottom:16}}>
            <SecHeader title="Ocupación por Ciudad"/>
            {/* Global grande */}
            <div style={{display:"flex",alignItems:"center",gap:32,marginBottom:24,
              padding:"20px 28px",background:"rgba(212,175,55,0.06)",
              border:"1px solid rgba(212,175,55,0.2)",borderRadius:12}}>
              <div style={{
                fontFamily:"'Playfair Display',serif",
                fontWeight:700,
                fontSize:"5rem",
                lineHeight:1,
                color:ocuOk?"#34d399":GOLD,
              }}>
                {pp(ocuGlobal.v26)}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",fontFamily:"'DM Sans',sans-serif",
                  letterSpacing:2,textTransform:"uppercase"}}>Ocupación Global</div>
                <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                  <Arrow value={dd(ocuGlobal.v26,ocuGlobal.v25)}/>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.3)",fontFamily:"'DM Sans',sans-serif"}}>vs 2025</span>
                  <Arrow value={dd(ocuGlobal.v26,ocuGlobal.obj)}/>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.3)",fontFamily:"'DM Sans',sans-serif"}}>vs budget ({pp(ocuGlobal.obj)})</span>
                </div>
              </div>
            </div>
            {/* Ciudades en 2 filas de 3 */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
              <CityTile city="Madrid"        o={d.ocu.madrid}/>
              <CityTile city="Barcelona"     o={d.ocu.barcelona}/>
              <CityTile city="Valencia"      o={d.ocu.valencia}/>
              <CityTile city="Málaga"        o={d.ocu.malaga}/>
              <CityTile city="Ibiza"         o={d.ocu.ibiza}/>
              <CityTile city="San Sebastián" o={d.ocu.sansebas}/>
            </div>
          </div>

          {/* LEADS & B2B */}
          <div style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.07)",
            borderRadius:16,padding:22}}>
            <SecHeader title="Leads & Actividad Comercial"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <Card group="B2B" label="Facturación B2B" icon="◎"
                value={d.b2b.total.v26} prev={d.b2b.total.v25} obj={d.b2b.total.obj}/>
              <div style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.07)",
                borderRadius:14,padding:"20px 20px 16px"}}>
                <div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",
                  color:"rgba(255,255,255,0.3)",marginBottom:2,fontFamily:"'DM Sans',sans-serif"}}>Leads</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginBottom:10,
                  fontFamily:"'DM Sans',sans-serif"}}>Missed Calls Rate</div>
                <div style={{fontSize:28,fontFamily:"'Playfair Display',serif",fontWeight:700,
                  letterSpacing:-1,lineHeight:1,marginBottom:10,
                  color:d.leads.missed.v26>0.20?"#f87171":"#34d399"}}>
                  {pp(d.leads.missed.v26)}
                </div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.25)",fontFamily:"'DM Sans',sans-serif"}}>2025: {pp(d.leads.missed.v25)}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.2)",fontFamily:"'DM Sans',sans-serif"}}>Objetivo: &lt;17%</div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div style={{marginTop:28,paddingTop:18,borderTop:"1px solid rgba(255,255,255,0.05)",
            display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.15)",letterSpacing:1}}>
              HOMECLUB · Dashboard Comercial · Fuente: reportes mensuales + cartera de propiedades
            </div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.15)"}}>
              {new Date().toLocaleDateString("es-ES",{day:"2-digit",month:"long",year:"numeric"})}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
