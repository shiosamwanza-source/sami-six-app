import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════
// DESIGN SYSTEM
// ═══════════════════════════════════════════════════════════════════
const C = {
  bg:     "#000F1A", navy:  "#001222", navy2: "#001D36",
  card:   "#051828", card2: "#071F34", glass: "#0A2540",
  gold:   "#C8940A", goldL: "#F0B429", goldX: "#FFD166",
  orange: "#D97706", ornL:  "#FBBF24",
  teal:   "#0E7490", tealL: "#22D3EE",
  green:  "#059669", greenL:"#34D399",
  red:    "#DC2626", redL:  "#FCA5A5",
  purple: "#7C3AED", purpL: "#C4B5FD",
  white:  "#FFFFFF", off:   "#E2EBF6",
  muted:  "#94A3B8", dim:   "#4A6080",
};
const F = {
  display: "'Cormorant Garamond', Georgia, serif",
  sans:    "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
  mono:    "'JetBrains Mono', monospace",
};

// ═══════════════════════════════════════════════════════════════════
// MICRO COMPONENTS
// ═══════════════════════════════════════════════════════════════════
const Tag = ({ text, color, size = 8 }) => (
  <span style={{ background:`${color}22`, color, fontSize:size, fontFamily:F.mono,
    padding:"2px 8px", borderRadius:20, fontWeight:700, letterSpacing:0.5,
    border:`1px solid ${color}35`, whiteSpace:"nowrap" }}>{text}</span>
);
const Dot = ({ color, pulse }) => (
  <span style={{ display:"inline-block", width:6, height:6, borderRadius:"50%",
    background:color, flexShrink:0,
    boxShadow: pulse ? `0 0 0 3px ${color}30` : `0 0 6px ${color}80`,
    animation: pulse ? "pulse 2s infinite" : "none" }} />
);
const Divider = ({ color = C.gold }) => (
  <div style={{ height:1, margin:"6px 0",
    background:`linear-gradient(90deg,transparent,${color}35,transparent)` }} />
);
const Row = ({ label, value, valueColor = C.white, mono }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
    <span style={{ color:C.muted, fontSize:9.5, fontFamily:F.sans }}>{label}</span>
    <span style={{ color:valueColor, fontSize:9.5, fontFamily:mono?F.mono:F.sans, fontWeight:600 }}>{value}</span>
  </div>
);
const SLabel = ({ text, color = C.gold }) => (
  <p style={{ color, fontSize:8, fontFamily:F.mono, letterSpacing:1.5, margin:"0 0 8px", fontWeight:700 }}>{text}</p>
);
const CardBox = ({ children, color = C.gold, style = {} }) => (
  <div style={{ background:C.card2, border:`1px solid ${color}22`, borderRadius:14, padding:"11px 13px", ...style }}>
    {children}
  </div>
);
const PrimaryBtn = ({ label, sub, color = C.teal, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{
    width:"100%", background: disabled ? C.card2 : `linear-gradient(135deg,${color},${color}cc)`,
    border:"none", borderRadius:14, padding:"13px", cursor:disabled?"default":"pointer",
    opacity:disabled?0.45:1, boxShadow:disabled?"none":`0 8px 24px ${color}40`,
    transition:"all 0.3s ease"
  }}>
    <p style={{ color:C.white, fontSize:12, fontWeight:700, fontFamily:F.sans, margin:0 }}>{label}</p>
    {sub && <p style={{ color:`${C.white}80`, fontSize:8, fontFamily:F.mono, margin:"2px 0 0" }}>{sub}</p>}
  </button>
);
const StatusBar = () => (
  <div style={{ background:C.navy2, display:"flex", justifyContent:"space-between",
    padding:"5px 16px 4px", flexShrink:0, borderBottom:`1px solid ${C.gold}12` }}>
    <span style={{ color:C.white, fontSize:9.5, fontFamily:F.mono, fontWeight:700 }}>9:41</span>
    <div style={{ display:"flex", gap:5, alignItems:"center" }}>
      <Dot color={C.green} />
      <span style={{ color:C.muted, fontSize:9, fontFamily:F.mono }}>●●● 98%</span>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════
const STEPS = [
  { n:1,  phase:"A", label:"Request Product",        desc:"Upload photo, link, or voice",              icon:"📸", color:C.teal,   done:true  },
  { n:2,  phase:"A", label:"Supplier Sourcing",       desc:"Six Cargo team sources overseas",           icon:"🌏", color:C.teal,   done:true  },
  { n:3,  phase:"A", label:"Quotation Display",       desc:"Full itemized cost — no hidden fees",       icon:"📋", color:C.teal,   done:true  },
  { n:4,  phase:"A", label:"Product Deposit",         desc:"Pay product cost only · SAMI Escrow",      icon:"🔐", color:C.teal,   done:true  },
  { n:5,  phase:"B", label:"Purchase Authorization",  desc:"Admin verifies deposit",                    icon:"✅", color:C.orange, done:true  },
  { n:6,  phase:"B", label:"Warehouse Verification",  desc:"Barcode scan + 2 photos + 1 video",        icon:"📦", color:C.orange, active:true},
  { n:7,  phase:"C", label:"Shipping",                desc:"Six Cargo finances international freight",  icon:"🚢", color:C.gold,   done:false },
  { n:8,  phase:"C", label:"Customs & Clearing",      desc:"Sami Agency pays TRA duty + VAT",           icon:"🏛️", color:C.gold,   done:false },
  { n:9,  phase:"C", label:"Arrival Notification",    desc:"Cargo in Dar · Final invoice generated",    icon:"🔔", color:C.gold,   done:false },
  { n:10, phase:"D", label:"Final Payment",           desc:"Pay logistics balance via M-Pesa",          icon:"💰", color:C.green,  done:false },
  { n:11, phase:"D", label:"Cargo Release",           desc:"Digital release pass · FAW delivery",       icon:"🎫", color:C.green,  done:false },
];
const PHASES = [
  { id:"A", label:"Request & Deposit",  color:C.teal   },
  { id:"B", label:"Verify & Approve",   color:C.orange },
  { id:"C", label:"Finance & Ship",     color:C.gold   },
  { id:"D", label:"Clear & Release",    color:C.green  },
];
const ORDERS = [
  { id:"SSA-0142", item:"Samsung A55 × 50 pcs",    step:6,  phase:"B", progress:45,  status:"APPROVE REQUIRED", color:C.orange, amount:"$9,000",  eta:"~Feb 14", dest:"Kariakoo, DSM"   },
  { id:"SSA-0138", item:"Vipodozi Bundle × 200",   step:11, phase:"D", progress:100, status:"DELIVERED",        color:C.green,  amount:"$4,200",  eta:"Jan 28",  dest:"Ilala, DSM"      },
  { id:"SSA-0131", item:"Solar Panels × 30 pcs",   step:7,  phase:"C", progress:60,  status:"AT SEA",           color:C.gold,   amount:"$6,800",  eta:"~Mar 2",  dest:"Lubumbashi, DRC" },
  { id:"SSA-0128", item:"FAW Spare Parts × 1 CT",  step:8,  phase:"C", progress:70,  status:"CLEARING",         color:C.tealL,  amount:"$14,500", eta:"~Feb 20", dest:"Lusaka, Zambia"  },
];
const PAIN_POINTS = [
  { icon:"✈️", title:"High Travel Costs Eliminated",        color:C.teal,
    wa:"$2,000–$4,000 per trip to Guangzhou/Dubai just for sourcing",
    sami:"Source verified suppliers from your phone in Kariakoo — zero travel" },
  { icon:"🔐", title:"SAMI Escrow — Zero Fraud Risk",        color:C.orange,
    wa:"Brokers with no office, no license, no collateral run away with your money",
    sami:"Funds held by SAMI Agencies (15+ years, Congo/Faru St). Released only after cargo verified at Six Cargo warehouse" },
  { icon:"📦", title:"Barcode System — No Lost Cargo",       color:C.gold,
    wa:"LCL agents use manual bookkeeping. Cargo gets mixed, lost, or smuggled — TRA seizes it",
    sami:"Every item gets barcode + Digital Inspection Passport the moment it enters Six Cargo warehouse" },
  { icon:"🧮", title:"Tariff Engine — No Hidden Costs",      color:C.green,
    wa:"Agent quotes cheap price. At Dar port: surprise TRA fines, storage charges, cargo auctioned",
    sami:"Automated Tariff Estimation Engine shows exact Total Landed Cost before you pay anything" },
  { icon:"🚚", title:"FAW Fleet + GPS — Cross-Border Clarity",color:C.purple,
    wa:"DRC/Zambia/Uganda: random trucks, drivers delay at border, cargo theft, zero visibility",
    sami:"SAMI's own FAW Haulage Fleet with IoT GPS — track your truck live to Lubumbashi, Lusaka, Kampala" },
];

// ═══════════════════════════════════════════════════════════════════
// SCREEN: HOME
// ═══════════════════════════════════════════════════════════════════
function ScreenHome({ nav }) {
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", overflowY:"auto",
      background:`linear-gradient(180deg,${C.navy2} 0%,${C.bg} 100%)` }}>
      {/* Header */}
      <div style={{ padding:"12px 15px 10px", borderBottom:`1px solid ${C.gold}18` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <p style={{ color:C.muted, fontSize:8.5, fontFamily:F.mono, margin:0, letterSpacing:1.5 }}>SME BUYER · KARIAKOO</p>
            <p style={{ color:C.white, fontSize:18, fontFamily:F.display, fontStyle:"italic",
              fontWeight:700, margin:"2px 0 0" }}>Juma Makame</p>
          </div>
          <div style={{ background:C.card, border:`1px solid ${C.gold}30`, borderRadius:20,
            padding:"5px 11px", display:"flex", alignItems:"center", gap:5 }}>
            <Dot color={C.green} pulse />
            <span style={{ color:C.goldL, fontSize:8, fontFamily:F.mono, fontWeight:700 }}>ONLINE</span>
          </div>
        </div>
        <div onClick={() => nav("request")} style={{ marginTop:11, background:C.card2,
          border:`1px solid ${C.teal}30`, borderRadius:24, padding:"9px 15px",
          display:"flex", gap:8, alignItems:"center", cursor:"pointer" }}>
          <span style={{ fontSize:14 }}>📸</span>
          <span style={{ color:C.dim, fontSize:9.5, fontFamily:F.sans }}>Upload photo or paste supplier link...</span>
          <span style={{ marginLeft:"auto", color:C.orange, fontSize:12 }}>🎙</span>
        </div>
      </div>

      {/* ACTION REQUIRED */}
      <div onClick={() => nav("verify")} style={{ margin:"11px 13px 0",
        background:`linear-gradient(135deg,${C.orange}16 0%,${C.card} 100%)`,
        border:`1px solid ${C.orange}45`, borderRadius:14, padding:"12px 13px", cursor:"pointer",
        boxShadow:`0 4px 20px ${C.orange}18` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
              <Dot color={C.orange} pulse />
              <Tag text="⚡ ACTION REQUIRED" color={C.orange} />
            </div>
            <p style={{ color:C.white, fontSize:12, fontWeight:700, fontFamily:F.sans, margin:"0 0 2px" }}>
              Samsung A55 × 50 pcs</p>
            <p style={{ color:C.muted, fontSize:8, fontFamily:F.mono, margin:0 }}>
              SSA-0142 · Step 6/11 · Warehouse verification pending</p>
          </div>
          <div style={{ textAlign:"right" }}>
            <p style={{ color:C.ornL, fontSize:10, fontFamily:F.sans, fontWeight:700, margin:0 }}>Tap to Review</p>
            <p style={{ color:C.muted, fontSize:8, fontFamily:F.mono, margin:"4px 0 0" }}>ETA Feb 14</p>
          </div>
        </div>
        <div style={{ marginTop:9, background:`${C.orange}18`, borderRadius:5, height:5 }}>
          <div style={{ width:"45%", background:`linear-gradient(90deg,${C.orange},${C.ornL})`,
            borderRadius:5, height:5, boxShadow:`0 0 10px ${C.orange}70` }} />
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
          <span style={{ color:C.orange, fontSize:7.5, fontFamily:F.mono }}>Phase B — Verify & Approve · 6/11</span>
          <span style={{ color:C.orange, fontSize:10 }}>→</span>
        </div>
      </div>

      {/* Cargo Credit Model */}
      <div style={{ margin:"10px 13px 0", background:C.card2,
        border:`1px solid ${C.teal}22`, borderRadius:13, padding:"10px 12px" }}>
        <SLabel text="CARGO CREDIT MODEL · HOW YOUR CAPITAL IS PROTECTED" color={C.teal} />
        <div style={{ display:"flex", gap:7 }}>
          <div style={{ flex:1, background:`${C.teal}10`, border:`1px solid ${C.teal}25`,
            borderRadius:10, padding:"8px 9px" }}>
            <p style={{ color:C.teal, fontSize:7.5, fontFamily:F.mono, margin:"0 0 2px", fontWeight:700 }}>YOU PAY NOW</p>
            <p style={{ color:C.white, fontSize:13, fontFamily:F.display, fontStyle:"italic",
              fontWeight:700, margin:"0 0 2px" }}>Product Cost</p>
            <p style={{ color:C.muted, fontSize:7, fontFamily:F.mono, margin:0 }}>
              🔐 Held in SAMI Escrow</p>
          </div>
          <div style={{ display:"flex", alignItems:"center" }}>
            <span style={{ color:C.gold, fontSize:20 }}>⟶</span>
          </div>
          <div style={{ flex:1, background:`${C.orange}10`, border:`1px solid ${C.orange}25`,
            borderRadius:10, padding:"8px 9px" }}>
            <p style={{ color:C.orange, fontSize:7.5, fontFamily:F.mono, margin:"0 0 2px", fontWeight:700 }}>WE FINANCE</p>
            <p style={{ color:C.white, fontSize:10, fontFamily:F.display, fontStyle:"italic",
              fontWeight:700, margin:"0 0 2px" }}>Freight+Duty+VAT</p>
            <p style={{ color:C.muted, fontSize:7, fontFamily:F.mono, margin:0 }}>
              Pay only on arrival</p>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ margin:"10px 13px 13px", background:C.card2,
        border:`1px solid ${C.gold}15`, borderRadius:13, padding:"10px 0", display:"flex" }}>
        {[["📦","4","Active"],["✅","12","Delivered"],["🌍","3","Countries"],["💰","TZS 0","Travel"]].map(([ic,v,l],i) => (
          <div key={l} style={{ flex:1, textAlign:"center",
            borderRight: i<3 ? `1px solid ${C.gold}10` : "none" }}>
            <div style={{ fontSize:13 }}>{ic}</div>
            <p style={{ color:C.goldL, fontSize:13, fontFamily:F.display, fontStyle:"italic",
              fontWeight:700, margin:"2px 0 0" }}>{v}</p>
            <p style={{ color:C.muted, fontSize:6.5, fontFamily:F.mono, margin:0 }}>{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCREEN: REQUEST (Step 1)
// ═══════════════════════════════════════════════════════════════════
function ScreenRequest({ nav }) {
  const [country, setCountry] = useState("China");
  const [mode, setMode] = useState("photo");
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:C.bg, overflowY:"auto" }}>
      <div style={{ padding:"11px 14px 10px", borderBottom:`1px solid ${C.teal}25` }}>
        <Tag text="STEP 1 OF 11" color={C.teal} />
        <p style={{ color:C.white, fontSize:16, fontFamily:F.display, fontStyle:"italic",
          fontWeight:700, margin:"5px 0 2px" }}>Request Product</p>
        <p style={{ color:C.muted, fontSize:8.5, fontFamily:F.mono, margin:0 }}>
          No travel · No brokers · Six Cargo sources for you</p>
      </div>
      <div style={{ flex:1, padding:"12px 14px", overflowY:"auto" }}>
        <div style={{ display:"flex", gap:5, marginBottom:13 }}>
          {[["photo","📸 Photo"],["link","🔗 Link"],["voice","🎙 Voice"]].map(([id,lbl]) => (
            <button key={id} onClick={() => setMode(id)} style={{ flex:1, padding:"7px 2px",
              borderRadius:10, border:`1px solid ${mode===id?C.teal:C.dim+"50"}`,
              background:mode===id?`${C.teal}18`:"transparent",
              color:mode===id?C.tealL:C.muted, fontSize:9, fontFamily:F.mono, cursor:"pointer" }}>{lbl}</button>
          ))}
        </div>
        <div style={{ background:C.card2, border:`2px dashed ${C.teal}35`, borderRadius:14,
          padding:"26px 14px", textAlign:"center", marginBottom:12, cursor:"pointer" }}>
          <div style={{ fontSize:38, marginBottom:7 }}>📸</div>
          <p style={{ color:C.off, fontSize:11, fontFamily:F.sans, fontWeight:700, margin:"0 0 3px" }}>
            Upload Product Photo</p>
          <p style={{ color:C.muted, fontSize:8, fontFamily:F.mono, margin:"0 0 8px" }}>
            or paste Alibaba / supplier link below</p>
          <Tag text="Swahili Voice Search Supported" color={C.teal} size={7} />
        </div>
        <CardBox color={C.teal} style={{ marginBottom:12 }}>
          <SLabel text="PRODUCT DESCRIPTION" color={C.teal} />
          <p style={{ color:C.dim, fontSize:9.5, fontFamily:F.sans, margin:0, fontStyle:"italic" }}>
            e.g. Samsung Galaxy A55, 128GB, Black, × 50 units</p>
        </CardBox>
        <SLabel text="SOURCE COUNTRY" color={C.muted} />
        <div style={{ display:"flex", gap:7, marginBottom:13 }}>
          {[["🇨🇳","China","Yiwu/Guangzhou"],["🇦🇪","Dubai","Jebel Ali"],["🇹🇷","Turkey","Istanbul"]].map(([flag,name,city]) => (
            <button key={name} onClick={() => setCountry(name)} style={{ flex:1, padding:"9px 4px",
              background:country===name?`${C.teal}18`:C.card2,
              border:`1px solid ${country===name?C.teal:C.dim+"40"}`, borderRadius:11, cursor:"pointer" }}>
              <div style={{ fontSize:20 }}>{flag}</div>
              <p style={{ color:country===name?C.tealL:C.muted, fontSize:9, fontFamily:F.sans,
                margin:"3px 0 1px", fontWeight:country===name?700:400 }}>{name}</p>
              <p style={{ color:C.dim, fontSize:7, fontFamily:F.mono, margin:0 }}>{city}</p>
            </button>
          ))}
        </div>
        <PrimaryBtn label="Submit Request → Get Verified Quote" color={C.teal} onClick={() => nav("quote")} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCREEN: QUOTE (Step 3) — TWO PAYMENT ZONES
// ═══════════════════════════════════════════════════════════════════
function ScreenQuote({ nav }) {
  const [qty, setQty] = useState(50);
  const unit = 180;
  const product = qty * unit;
  const freight  = Math.round(product * 0.14);
  const duty     = Math.round(product * 0.11);
  const vat      = Math.round(product * 0.06);
  const port     = Math.round(product * 0.04);
  const delivery = 120;
  const financed = freight + duty + vat + port + delivery;
  const total    = product + financed;

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:C.bg, overflowY:"auto" }}>
      <div style={{ padding:"11px 14px 10px", borderBottom:`1px solid ${C.gold}20` }}>
        <Tag text="STEP 3 OF 11" color={C.teal} />
        <p style={{ color:C.white, fontSize:16, fontFamily:F.display, fontStyle:"italic",
          fontWeight:700, margin:"5px 0 2px" }}>Your Quote</p>
        <p style={{ color:C.muted, fontSize:8.5, fontFamily:F.mono, margin:0 }}>
          Automated Tariff Engine · No hidden fees</p>
      </div>
      <div style={{ flex:1, padding:"11px 14px", overflowY:"auto" }}>
        {/* Product + qty */}
        <div style={{ display:"flex", gap:9, alignItems:"center", marginBottom:12,
          background:C.card2, border:`1px solid ${C.teal}22`, borderRadius:11, padding:"9px 12px" }}>
          <span style={{ fontSize:24 }}>📱</span>
          <div style={{ flex:1 }}>
            <p style={{ color:C.white, fontSize:11, fontWeight:700, fontFamily:F.sans, margin:0 }}>Samsung Galaxy A55</p>
            <p style={{ color:C.muted, fontSize:8, fontFamily:F.mono, margin:"2px 0 0" }}>🇨🇳 TechLink Guangzhou · ★ 4.8 · Verified</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <button onClick={() => setQty(Math.max(20,qty-10))} style={{ width:22, height:22, borderRadius:6,
              background:C.card, border:`1px solid ${C.gold}35`, color:C.gold, fontSize:13, cursor:"pointer" }}>−</button>
            <span style={{ color:C.white, fontSize:13, fontFamily:F.mono, fontWeight:700, minWidth:24, textAlign:"center" }}>{qty}</span>
            <button onClick={() => setQty(qty+10)} style={{ width:22, height:22, borderRadius:6,
              background:C.card, border:`1px solid ${C.gold}35`, color:C.gold, fontSize:13, cursor:"pointer" }}>+</button>
          </div>
        </div>

        {/* ZONE 1 — PAY NOW */}
        <div style={{ background:`${C.teal}0D`, border:`2px solid ${C.teal}45`,
          borderRadius:13, padding:"12px 13px", marginBottom:9 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:9 }}>
            <Dot color={C.teal} />
            <SLabel text="UPFRONT — PAY INTO SIX CARGO BANK ACCOUNT" color={C.teal} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ color:C.off, fontSize:10, fontFamily:F.sans }}>Product Cost ({qty} × ${unit})</span>
            <span style={{ color:C.tealL, fontSize:14, fontWeight:700, fontFamily:F.mono }}>${product.toLocaleString()}</span>
          </div>
          <div style={{ marginTop:7, padding:"5px 8px", background:`${C.teal}10`,
            border:`1px solid ${C.teal}25`, borderRadius:8 }}>
            <p style={{ color:C.tealL, fontSize:8, fontFamily:F.sans, margin:0 }}>
              🔐 Held in SAMI Escrow · Released to factory only after cargo verified at Six Cargo warehouse
            </p>
          </div>
          <Divider color={C.teal} />
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span style={{ color:C.white, fontSize:10, fontWeight:700, fontFamily:F.sans }}>Total Due Now</span>
            <span style={{ color:C.tealL, fontSize:17, fontWeight:700, fontFamily:F.display, fontStyle:"italic" }}>
              ${product.toLocaleString()}</span>
          </div>
        </div>

        {/* ZONE 2 — FINANCED */}
        <div style={{ background:`${C.orange}0C`, border:`2px solid ${C.orange}40`,
          borderRadius:13, padding:"12px 13px", marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:9 }}>
            <Dot color={C.orange} />
            <SLabel text="FINANCED BY SIX CARGO & SAMI AGENCY — PAY ON ARRIVAL" color={C.orange} />
          </div>
          {[
            ["Sea Freight (LCL)","Six Cargo finances",freight],
            ["TRA Customs Duty", "Sami Agency pays",  duty],
            ["VAT (18%)",        "Sami Agency pays",  vat],
            ["TPA Port Charges", "Sami Agency pays",  port],
            ["Inland Delivery",  "FAW Haulage Fleet", delivery],
          ].map(([lbl,by,val]) => (
            <div key={lbl} style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", marginBottom:6 }}>
              <div>
                <span style={{ color:C.off, fontSize:9.5, fontFamily:F.sans }}>{lbl}</span>
                <span style={{ color:C.dim, fontSize:7.5, fontFamily:F.mono, marginLeft:5 }}>via {by}</span>
              </div>
              <span style={{ color:C.ornL, fontSize:10, fontWeight:700, fontFamily:F.mono }}>${val.toLocaleString()}</span>
            </div>
          ))}
          <Divider color={C.orange} />
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span style={{ color:C.white, fontSize:10, fontWeight:700, fontFamily:F.sans }}>Due on Arrival in Dar</span>
            <span style={{ color:C.ornL, fontSize:17, fontWeight:700, fontFamily:F.display, fontStyle:"italic" }}>
              ${financed.toLocaleString()}</span>
          </div>
        </div>

        {/* Grand Total */}
        <div style={{ background:`linear-gradient(135deg,${C.gold}20,${C.navy2})`,
          border:`1px solid ${C.gold}50`, borderRadius:13, padding:"12px 14px", marginBottom:12 }}>
          <SLabel text="TOTAL LANDED COST · DAR ES SALAAM" color={C.gold} />
          <p style={{ color:C.white, fontSize:28, fontFamily:F.display, fontStyle:"italic",
            fontWeight:700, margin:"0 0 3px" }}>${total.toLocaleString()}</p>
          <p style={{ color:C.muted, fontSize:8.5, fontFamily:F.mono, margin:0 }}>
            ${(total/qty).toFixed(0)}/unit fully landed · Calculated by Automated Tariff Engine
          </p>
        </div>
        <PrimaryBtn label={`Pay Deposit — $${product.toLocaleString()}`}
          sub="Freight & customs financed until cargo arrives in Dar"
          color={C.teal} onClick={() => nav("deposit")} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCREEN: DEPOSIT (Step 4) — SAMI ESCROW
// ═══════════════════════════════════════════════════════════════════
function ScreenDeposit({ nav }) {
  const [currency, setCurrency] = useState("USD");
  const [uploaded, setUploaded] = useState(false);
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:C.bg, overflowY:"auto" }}>
      <div style={{ padding:"11px 14px 10px", borderBottom:`1px solid ${C.gold}20` }}>
        <Tag text="STEP 4 OF 11" color={C.teal} />
        <p style={{ color:C.white, fontSize:16, fontFamily:F.display, fontStyle:"italic",
          fontWeight:700, margin:"5px 0 2px" }}>Product Deposit</p>
        <p style={{ color:C.muted, fontSize:8.5, fontFamily:F.mono, margin:0 }}>
          Pay product cost only · Protected by SAMI Escrow System</p>
      </div>
      <div style={{ flex:1, padding:"11px 14px", overflowY:"auto" }}>
        <div style={{ display:"flex", gap:8, marginBottom:13 }}>
          {["USD","TZS"].map(cur => (
            <button key={cur} onClick={() => setCurrency(cur)} style={{ flex:1, padding:"12px",
              background:currency===cur?`${C.teal}20`:C.card2,
              border:`2px solid ${currency===cur?C.teal:C.dim+"40"}`, borderRadius:12, cursor:"pointer" }}>
              <p style={{ color:currency===cur?C.tealL:C.muted, fontSize:16, fontFamily:F.display,
                fontStyle:"italic", fontWeight:700, margin:0 }}>{cur==="USD"?"$USD":"TZS"}</p>
            </button>
          ))}
        </div>
        <CardBox color={C.gold} style={{ marginBottom:12 }}>
          <SLabel text="SIX CARGO · VERIFIED BANK ACCOUNT" color={C.gold} />
          {[
            ["Bank","CRDB Bank Tanzania"],
            ["Account Name","Six Cargo Limited"],
            ["Account No.","0150 9876 5432 1"],
            ["Branch","Congo/Faru Street, Dar es Salaam"],
            ["Amount Due", currency==="USD"?"$9,000 USD":"TZS 22,950,000"],
          ].map(([l,v]) => <Row key={l} label={l} value={v} valueColor={l==="Amount Due"?C.goldL:C.white} mono />)}
        </CardBox>

        {/* Escrow guarantee */}
        <div style={{ background:`${C.green}10`, border:`1px solid ${C.green}30`,
          borderRadius:12, padding:"10px 12px", marginBottom:12 }}>
          <div style={{ display:"flex", gap:7, alignItems:"flex-start" }}>
            <span style={{ fontSize:18 }}>🔐</span>
            <div>
              <p style={{ color:C.greenL, fontSize:9.5, fontFamily:F.sans,
                fontWeight:700, margin:"0 0 3px" }}>SAMI Escrow System — Your Money is Safe</p>
              <p style={{ color:C.muted, fontSize:8.5, fontFamily:F.sans, margin:0, lineHeight:1.5 }}>
                Pesa inakaa chini ya dhamana ya SAMI Agencies (miaka 15+, ofisi Congo/Faru St).
                Inatolewa kwa factory tu baada ya mzigo kukaguliwa ghalani na Six Cargo.
              </p>
            </div>
          </div>
        </div>

        <div onClick={() => setUploaded(!uploaded)} style={{ background:uploaded?`${C.green}12`:C.card2,
          border:`2px dashed ${uploaded?C.green:C.teal+"40"}`, borderRadius:13,
          padding:"18px 14px", textAlign:"center", marginBottom:12, cursor:"pointer",
          transition:"all 0.3s ease" }}>
          <div style={{ fontSize:30, marginBottom:7 }}>{uploaded?"✅":"📤"}</div>
          <p style={{ color:uploaded?C.greenL:C.off, fontSize:11, fontFamily:F.sans,
            fontWeight:700, margin:"0 0 3px" }}>
            {uploaded?"Receipt Uploaded!":"Upload Payment Receipt"}</p>
          <p style={{ color:C.muted, fontSize:8, fontFamily:F.mono, margin:0 }}>
            {uploaded?"Tap to change":"Bank slip photo or M-Pesa screenshot"}</p>
        </div>
        <PrimaryBtn label={uploaded?"Submit → Await Admin Verification":"Upload receipt to continue"}
          sub={uploaded?"Admin will verify and trigger overseas purchase":""}
          color={C.orange} onClick={() => uploaded && nav("tracking")} disabled={!uploaded} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCREEN: WAREHOUSE VERIFY (Step 6) — BARCODE + APPROVAL
// ═══════════════════════════════════════════════════════════════════
function ScreenVerify({ nav }) {
  const [decision, setDecision] = useState(null);
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:C.bg, overflowY:"auto" }}>
      <div style={{ padding:"11px 14px 10px", borderBottom:`1px solid ${C.orange}30` }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
          <Dot color={C.orange} pulse />
          <Tag text="STEP 6 · ACTION REQUIRED" color={C.orange} />
        </div>
        <p style={{ color:C.white, fontSize:16, fontFamily:F.display, fontStyle:"italic",
          fontWeight:700, margin:"0 0 2px" }}>Warehouse Verification</p>
        <p style={{ color:C.orange, fontSize:8.5, fontFamily:F.mono, margin:0 }}>
          Your cargo is at Six Cargo warehouse · Review before shipping</p>
      </div>
      <div style={{ flex:1, padding:"11px 14px", overflowY:"auto" }}>
        {/* Barcode scan result */}
        <div style={{ background:`${C.teal}10`, border:`1px solid ${C.teal}30`,
          borderRadius:11, padding:"9px 12px", marginBottom:12,
          display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:22 }}>▊▌▋▍▊</span>
          <div style={{ flex:1 }}>
            <p style={{ color:C.tealL, fontSize:8, fontFamily:F.mono, letterSpacing:1,
              margin:"0 0 2px", fontWeight:700 }}>BARCODE SCANNED · DIGITAL INSPECTION PASSPORT</p>
            <p style={{ color:C.white, fontSize:10, fontFamily:F.sans, fontWeight:700, margin:"0 0 1px" }}>
              Samsung A55 × 50 pcs</p>
            <p style={{ color:C.muted, fontSize:8, fontFamily:F.mono, margin:0 }}>
              ID: SIX-GZH-2025-0142 · Weight: 42kg · CBM: 0.8</p>
          </div>
          <Tag text="VERIFIED" color={C.green} />
        </div>

        <CardBox color={C.orange} style={{ marginBottom:12 }}>
          <SLabel text="FROM WAREHOUSE · Guangzhou, China" color={C.orange} />
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            <Tag text="Logged by: Hassan K." color={C.muted} />
            <Tag text="Jan 18, 2025 · 14:32" color={C.muted} />
          </div>
        </CardBox>

        {/* Media */}
        <SLabel text="WAREHOUSE MEDIA — VERIFY YOUR CARGO CAREFULLY" color={C.orange} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, marginBottom:9 }}>
          {[{cap:"Photo 1 · Front view",icon:"📦"},{cap:"Photo 2 · Labels & serial",icon:"🏷️"}].map((m,i) => (
            <div key={i} style={{ background:C.glass, border:`1px solid ${C.orange}25`,
              borderRadius:11, overflow:"hidden" }}>
              <div style={{ height:72, display:"flex", alignItems:"center", justifyContent:"center",
                flexDirection:"column", gap:4,
                background:`linear-gradient(135deg,${C.card},${C.glass})` }}>
                <span style={{ fontSize:26 }}>{m.icon}</span>
                <Tag text={`Photo ${i+1}`} color={C.teal} size={7} />
              </div>
              <p style={{ color:C.muted, fontSize:7.5, fontFamily:F.mono, margin:0, padding:"5px 8px" }}>{m.cap}</p>
            </div>
          ))}
        </div>

        {/* Video */}
        <div style={{ background:C.glass, border:`1px solid ${C.orange}28`, borderRadius:12,
          padding:"13px", textAlign:"center", marginBottom:12 }}>
          <div style={{ width:42, height:42, borderRadius:"50%", background:`${C.orange}20`,
            border:`2px solid ${C.orange}`, display:"flex", alignItems:"center",
            justifyContent:"center", margin:"0 auto 8px" }}>
            <span style={{ color:C.orange, fontSize:18 }}>▶</span>
          </div>
          <p style={{ color:C.white, fontSize:10, fontFamily:F.sans, fontWeight:700, margin:"0 0 2px" }}>
            Validation Video · 0:45</p>
          <p style={{ color:C.muted, fontSize:8, fontFamily:F.mono, margin:"0 0 5px" }}>
            Warehouse walkthrough with serial numbers</p>
          <Tag text="Required: Min 1 video per shipment" color={C.orange} size={7} />
        </div>

        {!decision ? (
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => setDecision("rejected")} style={{ flex:1, padding:"12px",
              background:`${C.red}14`, border:`1px solid ${C.red}40`, borderRadius:12,
              color:C.red, fontSize:11, fontFamily:F.sans, fontWeight:700, cursor:"pointer" }}>
              ✗ Reject & Recheck</button>
            <button onClick={() => setDecision("approved")} style={{ flex:2, padding:"12px",
              background:`linear-gradient(135deg,${C.green},#047857)`,
              border:"none", borderRadius:12, color:C.white, fontSize:12,
              fontFamily:F.sans, fontWeight:700, cursor:"pointer",
              boxShadow:`0 6px 20px ${C.green}40` }}>
              ✓ APPROVE SHIPMENT</button>
          </div>
        ) : decision==="approved" ? (
          <div style={{ background:`${C.green}12`, border:`1px solid ${C.green}35`,
            borderRadius:13, padding:"16px", textAlign:"center" }}>
            <div style={{ fontSize:36, marginBottom:8 }}>✅</div>
            <p style={{ color:C.greenL, fontSize:13, fontWeight:700, fontFamily:F.sans, margin:"0 0 4px" }}>
              Shipment Approved!</p>
            <p style={{ color:C.muted, fontSize:8.5, fontFamily:F.mono, margin:"0 0 12px" }}>
              Six Cargo will now arrange sea freight from Guangzhou</p>
            <button onClick={() => nav("tracking")} style={{ background:`linear-gradient(135deg,${C.teal},#065F78)`,
              border:"none", borderRadius:10, padding:"9px 22px", cursor:"pointer" }}>
              <span style={{ color:C.white, fontSize:11, fontFamily:F.sans, fontWeight:700 }}>Track Shipment →</span>
            </button>
          </div>
        ) : (
          <div style={{ background:`${C.red}10`, border:`1px solid ${C.red}30`,
            borderRadius:13, padding:"14px", textAlign:"center" }}>
            <div style={{ fontSize:28, marginBottom:6 }}>🔄</div>
            <p style={{ color:C.red, fontSize:12, fontWeight:700, fontFamily:F.sans, margin:"0 0 3px" }}>
              Recheck Requested</p>
            <p style={{ color:C.muted, fontSize:8.5, fontFamily:F.mono, margin:0 }}>
              Warehouse team notified to re-verify and upload new media</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCREEN: 11-STEP TRACKING + CROSS-BORDER GPS
// ═══════════════════════════════════════════════════════════════════
function ScreenTracking({ nav }) {
  const [sel, setSel] = useState(0);
  const order = ORDERS[sel];
  const isCross = order.dest.includes("DRC") || order.dest.includes("Zambia");

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:C.bg }}>
      <div style={{ padding:"11px 14px 9px", borderBottom:`1px solid ${C.gold}18`, flexShrink:0 }}>
        <p style={{ color:C.white, fontSize:15, fontFamily:F.display, fontStyle:"italic",
          fontWeight:700, margin:"0 0 7px" }}>Live Tracking</p>
        <div style={{ display:"flex", gap:5, overflowX:"auto" }}>
          {ORDERS.map((o,i) => (
            <button key={i} onClick={() => setSel(i)} style={{ padding:"4px 10px", borderRadius:20,
              whiteSpace:"nowrap", border:`1px solid ${sel===i?o.color:C.dim+"40"}`,
              background:sel===i?`${o.color}18`:"transparent",
              color:sel===i?o.color:C.muted, fontSize:8, fontFamily:F.mono, cursor:"pointer" }}>
              {o.id}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto" }}>
        {/* Order card */}
        <div style={{ margin:"11px 13px 0", background:`linear-gradient(135deg,${C.navy2},${C.card})`,
          border:`1px solid ${order.color}30`, borderRadius:13, padding:"11px 13px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <p style={{ color:C.muted, fontSize:7.5, fontFamily:F.mono, margin:0 }}>ORDER ID</p>
              <p style={{ color:C.white, fontSize:12, fontWeight:700, fontFamily:F.sans, margin:"2px 0 1px" }}>{order.id}</p>
              <p style={{ color:C.muted, fontSize:9, fontFamily:F.sans, margin:"0 0 3px" }}>{order.item}</p>
              <Tag text={`📍 ${order.dest}`} color={order.color} size={7} />
            </div>
            <div style={{ textAlign:"right" }}>
              <Tag text={order.status} color={order.color} />
              <p style={{ color:C.goldL, fontSize:10, fontFamily:F.mono, margin:"6px 0 2px", fontWeight:700 }}>{order.amount}</p>
              <p style={{ color:C.muted, fontSize:7.5, fontFamily:F.mono, margin:0 }}>ETA {order.eta}</p>
            </div>
          </div>
          <div style={{ marginTop:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ color:C.muted, fontSize:7.5, fontFamily:F.mono }}>Progress</span>
              <span style={{ color:order.color, fontSize:7.5, fontFamily:F.mono, fontWeight:700 }}>
                Step {order.step}/11 · {order.progress}%</span>
            </div>
            <div style={{ background:`${order.color}15`, borderRadius:5, height:7 }}>
              <div style={{ width:`${order.progress}%`, height:7, borderRadius:5,
                background:`linear-gradient(90deg,${order.color},${order.color}cc)`,
                boxShadow:`0 0 10px ${order.color}60` }} />
            </div>
          </div>
        </div>

        {/* Cross-border GPS tracker */}
        {isCross && (
          <div style={{ margin:"10px 13px 0", background:`${C.purple}10`,
            border:`1px solid ${C.purple}30`, borderRadius:12, padding:"10px 12px" }}>
            <SLabel text="FAW HAULAGE FLEET · IoT GPS TRACKING" color={C.purpL} />
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div>
                <p style={{ color:C.white, fontSize:10, fontFamily:F.sans, fontWeight:700, margin:0 }}>
                  FAW Truck · TZ 482 G</p>
                <p style={{ color:C.muted, fontSize:8, fontFamily:F.mono, margin:0 }}>
                  Last ping: 3 min ago · 87 km/h</p>
              </div>
              <Dot color={C.purple} pulse />
            </div>
            {/* Mini map visual */}
            <div style={{ background:C.card2, borderRadius:10, padding:"8px 10px",
              border:`1px solid ${C.purple}20`, position:"relative", overflow:"hidden" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                {["Dar es Salaam","Zambia Border","Lusaka"].map((city,i) => (
                  <div key={city} style={{ textAlign:"center", flex:1 }}>
                    <div style={{ width:10, height:10, borderRadius:"50%",
                      background: i===0?C.green:i===1?C.gold:C.purple,
                      margin:"0 auto 3px",
                      boxShadow:`0 0 6px ${i===0?C.green:i===1?C.gold:C.purple}80` }} />
                    <p style={{ color:C.muted, fontSize:7, fontFamily:F.mono, margin:0 }}>{city}</p>
                  </div>
                ))}
              </div>
              {/* Road line */}
              <div style={{ position:"absolute", top:"50%", left:"10%", right:"10%",
                height:2, background:`linear-gradient(90deg,${C.green},${C.gold},${C.purple}40)`,
                borderRadius:2, transform:"translateY(-60%)" }} />
              {/* Truck icon moving */}
              <div style={{ position:"absolute", top:"30%", left:"45%",
                transform:"translateY(-50%)" }}>
                <span style={{ fontSize:14 }}>🚛</span>
              </div>
            </div>
            <p style={{ color:C.muted, fontSize:7.5, fontFamily:F.mono, margin:"6px 0 0" }}>
              ETA Lusaka: ~Feb 20 · Border status: Approaching Nakonde
            </p>
          </div>
        )}

        {/* Timeline */}
        <div style={{ padding:"12px 14px" }}>
          {PHASES.map(phase => (
            <div key={phase.id} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:8 }}>
                <div style={{ width:20, height:20, borderRadius:"50%", background:phase.color,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ color:C.bg, fontSize:8, fontWeight:900 }}>{phase.id}</span>
                </div>
                <p style={{ color:phase.color, fontSize:8.5, fontFamily:F.mono,
                  margin:0, fontWeight:700, letterSpacing:0.5 }}>
                  PHASE {phase.id}: {phase.label.toUpperCase()}</p>
              </div>
              {STEPS.filter(s => s.phase===phase.id).map((step,si,arr) => {
                const isDone   = step.done;
                const isActive = step.active && sel===0;
                const dotBg    = isDone?C.green:isActive?step.color:C.card2;
                const dotBdr   = isDone?C.green:isActive?step.color:C.dim+"50";
                return (
                  <div key={step.n} style={{ display:"flex", gap:9, marginBottom:3 }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:22 }}>
                      <div style={{ width:22, height:22, borderRadius:"50%", background:dotBg,
                        border:`2px solid ${dotBdr}`, display:"flex", alignItems:"center",
                        justifyContent:"center", flexShrink:0,
                        boxShadow:isActive?`0 0 12px ${step.color}70`:isDone?`0 0 5px ${C.green}35`:"none" }}>
                        {isDone ? <span style={{ color:C.bg, fontSize:9, fontWeight:900 }}>✓</span>
                          : isActive ? <span style={{ fontSize:9 }}>{step.icon}</span>
                          : <span style={{ color:C.dim, fontSize:7.5 }}>{step.n}</span>}
                      </div>
                      {si<arr.length-1 && <div style={{ width:2, flex:1, minHeight:12, marginTop:2,
                        background:isDone?`${C.green}40`:`${C.dim}18` }} />}
                    </div>
                    <div style={{ flex:1, paddingBottom:9, paddingTop:1 }}>
                      <div style={{ display:"flex", justifyContent:"space-between" }}>
                        <p style={{ color:isDone?C.off:isActive?step.color:C.dim,
                          fontSize:9.5, fontFamily:F.sans, margin:0, fontWeight:isActive?700:400 }}>
                          {step.label}</p>
                        {isDone && <span style={{ color:C.green, fontSize:7.5, fontFamily:F.mono }}>Done</span>}
                        {isActive && <Tag text="NOW" color={step.color} size={7} />}
                      </div>
                      <p style={{ color:C.dim, fontSize:8, fontFamily:F.mono, margin:"1px 0 0" }}>{step.desc}</p>
                      {isActive && (
                        <div onClick={() => nav("verify")} style={{ background:`${step.color}10`,
                          border:`1px solid ${step.color}28`, borderRadius:7, padding:"5px 9px",
                          marginTop:5, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                          <span style={{ color:step.color, fontSize:8.5, fontFamily:F.sans }}>
                            ⚡ Review warehouse photos & approve shipment
                          </span>
                          <span style={{ color:step.color, marginLeft:"auto" }}>→</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCREEN: CARGO RELEASE (Step 11)
// ═══════════════════════════════════════════════════════════════════
function ScreenRelease({ nav }) {
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:C.bg, overflowY:"auto" }}>
      <div style={{ padding:"11px 14px 10px", borderBottom:`1px solid ${C.green}25` }}>
        <Tag text="STEP 11 · COMPLETE" color={C.green} />
        <p style={{ color:C.white, fontSize:16, fontFamily:F.display, fontStyle:"italic",
          fontWeight:700, margin:"5px 0 2px" }}>Cargo Release</p>
        <p style={{ color:C.greenL, fontSize:8.5, fontFamily:F.mono, margin:0 }}>
          ✅ Final payment confirmed · Release pass ready</p>
      </div>
      <div style={{ flex:1, padding:"11px 14px", overflowY:"auto" }}>
        {/* Digital pass */}
        <div style={{ background:`linear-gradient(135deg,${C.green}16,${C.card})`,
          border:`2px solid ${C.green}50`, borderRadius:16, padding:"18px 14px",
          textAlign:"center", marginBottom:13, boxShadow:`0 8px 32px ${C.green}18` }}>
          <div style={{ fontSize:44, marginBottom:8 }}>🎫</div>
          <SLabel text="DIGITAL CARGO RELEASE PASS" color={C.green} />
          <p style={{ color:C.white, fontSize:20, fontFamily:F.display, fontStyle:"italic",
            fontWeight:700, margin:"0 0 3px" }}>SSA-0142</p>
          <p style={{ color:C.muted, fontSize:9, fontFamily:F.mono, margin:"0 0 12px" }}>
            Samsung A55 × 50 pcs · Verified · Cleared</p>
          <div style={{ width:88, height:88, background:C.card2, border:`1px solid ${C.green}30`,
            borderRadius:10, margin:"0 auto 12px", display:"flex", flexWrap:"wrap",
            alignItems:"center", justifyContent:"center", gap:2, padding:8 }}>
            {Array.from({length:36}).map((_,i) => (
              <div key={i} style={{ width:10, height:10, borderRadius:2,
                background:[0,2,5,7,9,11,14,16,19,21,24,26,29,31,34].includes(i)?C.greenL:"transparent" }} />
            ))}
          </div>
          <Tag text="SHOW AT GATE · VALID 48 HOURS" color={C.green} />
        </div>
        <CardBox color={C.green} style={{ marginBottom:12 }}>
          <SLabel text="COLLECTION DETAILS" color={C.green} />
          {[
            ["Go-Down","Sami Agency Warehouse, Industrial Area, DSM"],
            ["Hours","Mon–Sat, 7:00 AM – 5:00 PM"],
            ["Contact","Hamisi · +255 754 000 000"],
          ].map(([l,v]) => <Row key={l} label={l} value={v} />)}
        </CardBox>
        <PrimaryBtn label="🚚 Request FAW Delivery to Kariakoo"
          sub="SAMI FAW Haulage Fleet · GPS-tracked delivery" color={C.gold} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCREEN: VS WHATSAPP — 5 Pain Points
// ═══════════════════════════════════════════════════════════════════
function ScreenVsWhatsapp({ nav }) {
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:C.bg }}>
      <div style={{ padding:"11px 14px 10px", borderBottom:`1px solid ${C.gold}18`, flexShrink:0 }}>
        <p style={{ color:C.white, fontSize:15, fontFamily:F.display, fontStyle:"italic",
          fontWeight:700, margin:"0 0 2px" }}>Why Not WhatsApp?</p>
        <p style={{ color:C.muted, fontSize:8.5, fontFamily:F.mono, margin:0 }}>
          5 systemic problems · 5 complete solutions</p>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"10px 13px" }}>
        {PAIN_POINTS.map((p,i) => (
          <div key={i} style={{ background:C.card2, border:`1px solid ${p.color}20`,
            borderRadius:13, marginBottom:9, overflow:"hidden" }}>
            <div style={{ background:`${p.color}14`, borderBottom:`1px solid ${p.color}20`,
              padding:"8px 12px", display:"flex", alignItems:"center", gap:7 }}>
              <span style={{ fontSize:16 }}>{p.icon}</span>
              <p style={{ color:p.color, fontSize:10, fontFamily:F.sans, fontWeight:700, margin:0 }}>
                {p.title}</p>
            </div>
            <div style={{ padding:"9px 12px", display:"flex", gap:8 }}>
              <div style={{ flex:1, background:`${C.red}08`, border:`1px solid ${C.red}20`,
                borderRadius:8, padding:"7px 8px" }}>
                <p style={{ color:C.red, fontSize:7.5, fontFamily:F.mono, margin:"0 0 3px", fontWeight:700 }}>
                  ✗ WHATSAPP / BROKERS</p>
                <p style={{ color:C.muted, fontSize:8.5, fontFamily:F.sans, margin:0, lineHeight:1.45 }}>{p.wa}</p>
              </div>
              <div style={{ flex:1, background:`${p.color}08`, border:`1px solid ${p.color}20`,
                borderRadius:8, padding:"7px 8px" }}>
                <p style={{ color:p.color, fontSize:7.5, fontFamily:F.mono, margin:"0 0 3px", fontWeight:700 }}>
                  ✓ SAMI SIX APP</p>
                <p style={{ color:C.off, fontSize:8.5, fontFamily:F.sans, margin:0, lineHeight:1.45 }}>{p.sami}</p>
              </div>
            </div>
          </div>
        ))}
        <div style={{ background:`linear-gradient(135deg,${C.gold}18,${C.navy2})`,
          border:`1px solid ${C.gold}40`, borderRadius:13, padding:"13px", textAlign:"center",
          margin:"4px 0 14px" }}>
          <p style={{ color:C.goldL, fontSize:11, fontFamily:F.display, fontStyle:"italic",
            fontWeight:700, margin:"0 0 4px", lineHeight:1.4 }}>
            "Sisi tayari tunafanya biashara hii kila siku.<br/>App inaifanya iwe wazi, salama, na rahisi zaidi."
          </p>
          <p style={{ color:C.muted, fontSize:8, fontFamily:F.mono, margin:0 }}>
            Six Cargo + Sami Agency · Miaka 15+ ya biashara halisi · Congo/Faru St, Dar es Salaam
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCREEN: ALL ORDERS
// ═══════════════════════════════════════════════════════════════════
function ScreenOrders({ nav }) {
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:C.bg }}>
      <div style={{ padding:"11px 14px 10px", borderBottom:`1px solid ${C.gold}18`, flexShrink:0 }}>
        <p style={{ color:C.white, fontSize:15, fontFamily:F.display, fontStyle:"italic",
          fontWeight:700, margin:"0 0 2px" }}>My Orders</p>
        <p style={{ color:C.muted, fontSize:8.5, fontFamily:F.mono, margin:0 }}>
          Tanzania · DRC · Zambia · Uganda</p>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"11px 13px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
          {[["4","Active Orders",C.teal],["$34.5K","Total Value",C.gold],["3","Countries",C.purple]].map(([v,l,col]) => (
            <div key={l} style={{ background:C.card2, border:`1px solid ${col}20`,
              borderRadius:11, padding:"9px 6px", textAlign:"center" }}>
              <p style={{ color:col, fontSize:16, fontFamily:F.display, fontStyle:"italic",
                fontWeight:700, margin:0 }}>{v}</p>
              <p style={{ color:C.muted, fontSize:7.5, fontFamily:F.mono, margin:"2px 0 0" }}>{l}</p>
            </div>
          ))}
        </div>
        {ORDERS.map((o,i) => (
          <div key={i} onClick={() => nav("tracking")} style={{ background:C.card2,
            border:`1px solid ${o.color}22`, borderRadius:13, padding:"11px 12px",
            marginBottom:9, cursor:"pointer" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <div>
                <p style={{ color:C.white, fontSize:11, fontWeight:700, fontFamily:F.sans, margin:"0 0 2px" }}>{o.item}</p>
                <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                  <Tag text={o.id} color={C.muted} size={7} />
                  <Tag text={`📍 ${o.dest}`} color={o.color} size={7} />
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <p style={{ color:C.goldL, fontSize:11, fontWeight:700, fontFamily:F.mono, margin:0 }}>{o.amount}</p>
                <Tag text={o.status} color={o.color} size={7} />
              </div>
            </div>
            <div style={{ background:`${o.color}14`, borderRadius:4, height:5 }}>
              <div style={{ width:`${o.progress}%`, height:5, borderRadius:4,
                background:`linear-gradient(90deg,${o.color},${o.color}cc)`,
                boxShadow:`0 0 8px ${o.color}50` }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
              <span style={{ color:C.muted, fontSize:7.5, fontFamily:F.mono }}>Step {o.step}/11</span>
              <span style={{ color:o.color, fontSize:7.5, fontFamily:F.mono }}>ETA {o.eta}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// NAV + ROUTING CONFIG
// ═══════════════════════════════════════════════════════════════════
const BOTTOM_NAV = [
  { id:"home",     icon:"⌂",  label:"Home"   },
  { id:"request",  icon:"📸", label:"Request" },
  { id:"tracking", icon:"◎",  label:"Track"   },
  { id:"orders",   icon:"▦",  label:"Orders"  },
  { id:"vswa",     icon:"⚡", label:"vs WA"   },
];
const SCREENS = {
  home:     { title:"Dashboard",            C: ScreenHome     },
  request:  { title:"Step 1 — Request",     C: ScreenRequest  },
  quote:    { title:"Step 3 — Quote",       C: ScreenQuote    },
  deposit:  { title:"Step 4 — Deposit",     C: ScreenDeposit  },
  verify:   { title:"Step 6 — Verify",      C: ScreenVerify   },
  tracking: { title:"11-Step Tracking",     C: ScreenTracking },
  release:  { title:"Step 11 — Release",    C: ScreenRelease  },
  vswa:     { title:"vs WhatsApp",          C: ScreenVsWhatsapp },
  orders:   { title:"My Orders",            C: ScreenOrders   },
};
const QUICK = [
  { id:"home",    label:"⌂ Home",          color:C.teal   },
  { id:"request", label:"📸 Request",      color:C.teal   },
  { id:"quote",   label:"📋 Quote",        color:C.orange },
  { id:"deposit", label:"🔐 Deposit",      color:C.orange },
  { id:"verify",  label:"📦 Verify",       color:C.green  },
  { id:"tracking",label:"◎ Track (11)",   color:C.gold   },
  { id:"orders",  label:"▦ Orders",        color:C.purple },
  { id:"vswa",    label:"⚡ vs WA",       color:C.tealL  },
  { id:"release", label:"🎫 Release",      color:C.green  },
];

// ═══════════════════════════════════════════════════════════════════
// ROOT ENGINE & LANDING PAGE ROUTING
// ═══════════════════════════════════════════════════════════════════
export default function App() {
  const [viewMode, setViewMode] = useState("landing"); 
  const [screen, setScreen] = useState("home");
  const [hist, setHist] = useState(["home"]);

  const nav = (id) => { setScreen(id); setHist(h => [...h, id]); };
  const goBack = () => {
    if (hist.length > 1) {
      const h = hist.slice(0,-1);
      setHist(h); setScreen(h[h.length-1]);
    }
  };

  const cur = SCREENS[screen] || SCREENS.home;
  const Comp = cur.C;

  // 1. UKURASA WA NJE: SCREEN NZIMA LANDING PAGE
  if (viewMode === "landing") {
    return (
      <div style={{ 
        minHeight: "100vh", background: `radial-gradient(ellipse at 50% 0%, #001a33 0%, ${C.bg} 60%, #00050a 100%)`,
        color: C.white, fontFamily: F.sans, display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "40px 20px", textAlign: "center" 
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,600;1,700&family=Plus+Jakarta+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
        `}</style>

        {/* Nembo na Juu ya Landing Page */}
        <div style={{ maxWidth: 800, marginBottom: 40 }}>
          <p style={{ color: C.orange, fontSize: 11, fontFamily: F.mono, letterSpacing: 4, fontWeight: 700, margin: "0 0 12px" }}>
            CONGO / FARU STREET · DAR ES SALAAM
          </p>
          <h1 style={{ fontSize: "clamp(42px, 6vw, 64px)", fontFamily: F.display, fontStyle: "italic", fontWeight: 700, margin: 0,
            background: `linear-gradient(135deg, ${C.white} 0%, ${C.goldX} 55%, ${C.orange} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            SAMI SIX APP
          </h1>
          <p style={{ color: C.goldL, fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 600, marginTop: 10, fontFamily: F.sans }}>
            Digital Trade Operating System for African SMEs
          </p>
          <Divider color={C.gold} />
          <p style={{ color: C.off, fontSize: 15, maxWidth: 600, margin: "20px auto 0", lineHeight: 1.6, opacity: 0.85 }}>
            Mfumo wa kidijitali unaowawezesha wafanyabiashara wa Afrika Mashariki kuagiza bidhaa moja kwa moja kutoka viwandani duniani kote bila kulazimika kusafiri, bila madalali, na bila hatari ya utapeli.
          </p>
        </div>

        {/* Nguzo Mbili za Miundombinu */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, maxWidth: 750, width: "100%", marginBottom: 40 }}>
          <div style={{ background: C.card, border: `1px solid ${C.teal}30`, padding: 24, borderRadius: 16, textAlign: "left" }}>
            <span style={{ fontSize: 28 }}>🚢</span>
            <h3 style={{ color: C.tealL, fontSize: 16, marginTop: 10, marginBottom: 6, fontWeight: 700 }}>Six Cargo</h3>
            <p style={{ color: C.muted, fontSize: 12, margin: 0, lineHeight: 1.5 }}>
              Mizigo ya Kimataifa, maghala makuu ya ukaguzi, na uhakiki wa viwanda vya uzalishaji (China · Dubai · Uturuki).
            </p>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.green}30`, padding: 24, borderRadius: 16, textAlign: "left" }}>
            <span style={{ fontSize: 28 }}>🏛️</span>
            <h3 style={{ color: C.greenL, fontSize: 16, marginTop: 10, marginBottom: 6, fontWeight: 700 }}>Sami Agency</h3>
            <p style={{ color: C.muted, fontSize: 12, margin: 0, lineHeight: 1.5 }}>
              Uondoshaji mizigo forodha (TRA), usafirishaji wa ndani, na malori ya kisasa ya FAW hadi mikoani na nchi jirani.
            </p>
          </div>
        </div>

        {/* Kitufe Kikuu cha Kuingia Ndani ya Mfumo */}
        <div style={{ zIndex: 10 }}>
          <button onClick={() => setViewMode("app")} style={{
            background: `linear-gradient(135deg, ${C.orange}, #b45309)`, border: "none", color: C.white,
            padding: "16px 40px", borderRadius: 30, fontSize: 15, fontWeight: 700, cursor: "pointer",
            boxShadow: `0 12px 30px ${C.orange}40`, transition: "all 0.3s ease", display: "flex", alignItems: "center", gap: 10
          }}>
            <span>Fungua Interactive Prototype</span>
            <span style={{ fontSize: 16 }}>→</span>
          </button>
          <p style={{ color: C.dim, fontSize: 10, fontFamily: F.mono, marginTop: 12 }}>
            Inayo miundo ya skrini 9, Cargo Credit Model, na mifumo ya ufuatiliaji (Live Simulation).
          </p>
        </div>

        {/* Background Footer Detail */}
        <div style={{ marginTop: "auto", opacity: 0.25, fontSize: 10, fontFamily: F.mono }}>
          © 2025-2026 SAMI SIX APP · Powered by 15+ Years of Active Field Infrastructure
        </div>
      </div>
    );
  }

  // 2. UKURASA WA NDANI: INTERACTIVE PHONE SIMULATOR
  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center",
      minHeight:"100vh", padding:"24px 16px",
      background:`radial-gradient(ellipse at 25% 0%,#001a33 0%,${C.bg} 45%,#000810 100%)`,
      fontFamily:F.sans }}>

      <style>{`
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(5,150,105,0.5)}50%{box-shadow:0 0 0 6px rgba(5,150,105,0)}}
        ::-webkit-scrollbar{width:2px}
        ::-webkit-scrollbar-thumb{background:${C.gold}40;border-radius:10px}
      `}</style>

      {/* Kitufe cha kurudi kwenye Landing Page ya nje */}
      <button onClick={() => setViewMode("landing")} style={{
        position: "absolute", top: 20, left: 20, background: C.card, border: `1px solid ${C.dim}40`,
        color: C.gold, padding: "8px 14px", borderRadius: 20, fontSize: 10, fontFamily: F.mono,
        cursor: "pointer", zIndex: 100
      }}>
        ← Toka Nje (Landing Page)
      </button>

      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:18 }}>

        {/* Header ya Juu ya Simu */}
        <div style={{ textAlign:"center" }}>
          <p style={{ color:C.orange, fontSize:8.5, fontFamily:F.mono,
            letterSpacing:4, margin:"0 0 5px", fontWeight:700 }}>
            INTERACTIVE PROTOTYPE · LIVE SIMULATOR</p>
          <h1 style={{ fontSize:32, fontFamily:F.display, fontStyle:"italic",
            fontWeight:700, margin:0,
            background:`linear-gradient(135deg,${C.white} 0%,${C.goldX} 55%,${C.orange} 100%)`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            SAMI SIX APP</h1>
          <p style={{ color:C.orange, fontSize:9.5, fontFamily:F.sans,
            fontWeight:600, margin:"3px 0 2px" }}>
            Digital Procurement + Cargo Credit Platform</p>
        </div>

        {/* PHONE GANDA */}
        <div style={{ width:324, background:"#0a0a0a", borderRadius:48, padding:"11px 9px",
          boxShadow:`0 60px 130px rgba(0,0,0,0.95),0 0 0 1px #1a1a1a,
            inset 0 0 0 2px #2a2a2a,0 0 100px ${C.orange}05` }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:7 }}>
            <div style={{ width:92, height:10, background:"#000", borderRadius:10 }} />
          </div>
          <div style={{ width:306, height:606, background:C.bg, borderRadius:36,
            overflow:"hidden", display:"flex", flexDirection:"column" }}>
            <StatusBar />
            {screen !== "home" && (
              <div style={{ background:C.navy2, display:"flex", alignItems:"center",
                padding:"7px 13px", borderBottom:`1px solid ${C.gold}15`, flexShrink:0 }}>
                <button onClick={goBack} style={{ background:"none", border:"none", color:C.gold,
                  cursor:"pointer", fontSize:16, padding:0, marginRight:8 }}>←</button>
                <span style={{ color:C.white, fontSize:11, fontWeight:700,
                  fontFamily:F.sans, flex:1 }}>{cur.title}</span>
                <span style={{ color:C.orange, fontSize:8, fontFamily:F.mono, fontWeight:700 }}>SAMI SIX</span>
              </div>
            )}
            <div style={{ flex:1, overflow:"hidden" }}><Comp nav={nav} /></div>
            <div style={{ background:C.navy2, borderTop:`1px solid ${C.gold}15`,
              display:"flex", padding:"6px 0 8px", flexShrink:0 }}>
              {BOTTOM_NAV.map(item => {
                const active = screen === item.id;
                return (
                  <button key={item.id} onClick={() => nav(item.id)} style={{ flex:1,
                    background:"none", border:"none", cursor:"pointer",
                    display:"flex", flexDirection:"column", alignItems:"center", gap:2, padding:"3px 0" }}>
                    <span style={{ fontSize:14, filter:active?"none":"grayscale(70%) opacity(35%)" }}>{item.icon}</span>
                    <span style={{ color:active?C.goldL:C.dim, fontSize:7.5,
                      fontFamily:F.mono, fontWeight:active?700:400 }}>{item.label}</span>
                    {active && <div style={{ width:14, height:2, background:C.gold,
                      borderRadius:2, boxShadow:`0 0 6px ${C.gold}` }} />}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"center", marginTop:8 }}>
            <div style={{ width:68, height:4, background:"#2a2a2a", borderRadius:4 }} />
          </div>
        </div>

        {/* Quick access tabs */}
        <div style={{ display:"flex", gap:5, flexWrap:"wrap", justifyContent:"center", maxWidth:420 }}>
          {QUICK.map(q => (
            <button key={q.id} onClick={() => nav(q.id)} style={{ padding:"5px 12px", borderRadius:20,
              border:`1px solid ${screen===q.id?q.color:C.dim+"40"}`,
              background:screen===q.id?`${q.color}18`:"transparent",
              color:screen===q.id?q.color:C.dim,
              fontSize:9, fontFamily:F.mono, cursor:"pointer", transition:"all 0.2s" }}>{q.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
