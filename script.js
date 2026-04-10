// ═══════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════
let fixedItems = [];
let varItems = [];
let currentStep = 0;

// ═══════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════
function fmt(n) {
  return isNaN(n) ? "0" : Math.round(n).toLocaleString("en-US");
}
function fmtF(n) {
  return isNaN(n) ? "0" : parseFloat(n.toFixed(2)).toLocaleString("en-US");
}
function pct(n) {
  const c = n >= 0 ? "green-val" : "red-val";
  return `<span class="${c}">${fmtF(n)}%</span>`;
}
function money(n) {
  const c = n >= 0 ? "green-val" : "red-val";
  return `<span class="${c}">${fmt(n)}</span>`;
}

// ═══════════════════════════════════════════════════════════
//  NAV
// ═══════════════════════════════════════════════════════════
function goSection(id, idx) {
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  currentStep = idx;
  document.querySelectorAll(".prog-step").forEach((ps, i) => {
    ps.classList.remove("active", "done");
    if (i < idx) ps.classList.add("done");
    if (i === idx) ps.classList.add("active");
  });
}

// ═══════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════
function init() {
  fixedItems = [
    { name: "Building", cost: 500000, years: 20 },
    { name: "Equipment", cost: 30000, years: 5 },
  ];
  varItems = [
    { name: "Chicks", valueCycle: 0, auto: true },
    { name: "Feeding & Ration", valueCycle: 118000, auto: false },
    { name: "Drugs & Vaccines", valueCycle: 20000, auto: false },
    { name: "Labor", valueCycle: 4000, auto: false },
    { name: "Veterinary Supervision", valueCycle: 800, auto: false },
    { name: "Transport & Other Costs", valueCycle: 2000, auto: false },
    { name: "Fuel, Water & Electrolytes", valueCycle: 500, auto: false },
    { name: "Litter Bedding", valueCycle: 1000, auto: false },
    { name: "Miscellaneous Costs", valueCycle: 2000, auto: false },
  ];
  renderFixed();
  renderVar();
}

// ═══════════════════════════════════════════════════════════
//  FIXED ITEMS RENDER
// ═══════════════════════════════════════════════════════════
function renderFixed() {
  const cycles = parseFloat(document.getElementById("cycles").value) || 6;
  const c = document.getElementById("fixedContainer");
  c.innerHTML = "";
  
  fixedItems.forEach((item, i) => {
    const d = document.createElement("div");
    d.className = "item-block";
    d.innerHTML = `
      <div class="item-block-header">
        <span class="item-label">Fixed Item ${i + 1}</span>
        <button class="del-btn" onclick="removeFixed(${i})">Remove</button>
      </div>
      <div class="form-grid">
        <div class="field">
          <label>Item Name</label>
          <input type="text" value="${item.name}" oninput="fixedItems[${i}].name=this.value">
        </div>
        <div class="field">
          <label>Investment Cost (EGP)</label>
          <input type="number" value="${item.cost}" 
            oninput="updateItemValues(${i}, this.value, 'cost')">
        </div>
        <div class="field">
          <label>Asset Lifespan (years)</label>
          <input type="number" value="${item.years}" min="1" 
            oninput="updateItemValues(${i}, this.value, 'years')">
        </div>
        <div class="field" style="justify-content:flex-end; padding-top:18px;">
          <span id="dep-calc-${i}" style="font-size:0.78rem; color:var(--g3); font-family:'JetBrains Mono',monospace; line-height:1.9;">
            ${calculateDepText(item, cycles)}
          </span>
        </div>
      </div>`;
    c.appendChild(d);
  });
}

// دالة جديدة لتحديث الأرقام فقط بدون مسح العناصر
function updateItemValues(index, value, type) {
  const cycles = parseFloat(document.getElementById("cycles").value) || 6;
  fixedItems[index][type] = parseFloat(value) || 0;
  
  // تحديث النص الحسابي فقط
  const displaySpan = document.getElementById(`dep-calc-${index}`);
  if (displaySpan) {
    displaySpan.innerHTML = calculateDepText(fixedItems[index], cycles);
  }
}

// دالة مساعدة لحساب النص
function calculateDepText(item, cycles) {
  const depY = item.cost / (item.years || 1);
  const depC = depY / cycles;
  return `Dep/year = ${fmt(depY)} EGP<br>Dep/cycle = ${fmt(depC)} EGP`;
}

// ═══════════════════════════════════════════════════════════
//  VARIABLE ITEMS RENDER
// ═══════════════════════════════════════════════════════════
function renderVar() {
  const c = document.getElementById("varContainer");
  c.innerHTML = "";
  varItems.forEach((item, i) => {
    const d = document.createElement("div");
    d.className = "item-block";
    d.innerHTML = `
      <div class="item-block-header">
        <span class="item-label">${item.name}</span>
        ${i > 0 ? `<button class="del-btn" onclick="removeVar(${i})">Remove</button>` : "<span></span>"}
      </div>
      <div class="form-grid">
        <div class="field">
          <label>Item Name</label>
          <input type="text" value="${item.name}" oninput="varItems[${i}].name=this.value">
        </div>
        <div class="field">
          <label>Value per Cycle (EGP)</label>
          <input type="number" value="${item.auto ? "" : item.valueCycle}"
            ${item.auto ? 'disabled placeholder="Auto: Chicks × Price per chick"' : ""}
            oninput="varItems[${i}].valueCycle=parseFloat(this.value)||0">
          ${item.auto ? '<span class="hint">= Chicks × Price per chick (set below)</span>' : ""}
        </div>
        ${
          item.auto
            ? `
        <div class="field">
          <label>Price per Chick (EGP)</label>
          <input type="number" id="chickPrice" value="7" min="1">
        </div>`
            : ""
        }
      </div>`;
    c.appendChild(d);
  });
}

function addVar() {
  varItems.push({ name: "New Variable Item", valueCycle: 0, auto: false });
  renderVar();
}
function removeVar(i) {
  varItems.splice(i, 1);
  renderVar();
}

// ═══════════════════════════════════════════════════════════
//  CALCULATE
// ═══════════════════════════════════════════════════════════
function calculate() {
  const chicks = parseFloat(document.getElementById("chicks").value) || 5000;
  const cycles = parseFloat(document.getElementById("cycles").value) || 6;
  const mortality = parseFloat(document.getElementById("mortality").value) || 2;
  const avgWeight = parseFloat(document.getElementById("avgWeight").value) || 2;
  const pricePerKg =
    parseFloat(document.getElementById("pricePerKg").value) || 27;
  const creditRate =
    (parseFloat(document.getElementById("creditRate").value) || 14.3) / 100;
  const litterS = parseFloat(document.getElementById("litterSales").value) || 0;
  const otherR = parseFloat(document.getElementById("otherReturns").value) || 0;
  const chickPriceEl = document.getElementById("chickPrice");
  const chickPrice = chickPriceEl ? parseFloat(chickPriceEl.value) || 7 : 7;

  // ── Returns ──
  const birdsSold = chicks * (1 - mortality / 100);
  const broilerSales_C = birdsSold * avgWeight * pricePerKg;
  const totalReturn_C = broilerSales_C + litterS + otherR;
  const totalReturn_Y = totalReturn_C * cycles;

  // ── Fixed costs ──
  let totalInvest = 0,
    totalDepY = 0,
    totalDepC = 0;
  const fRows = [];
  fixedItems.forEach((item) => {
    const dY = item.cost / item.years;
    const dC = dY / cycles;
    totalInvest += item.cost;
    totalDepY += dY;
    totalDepC += dC;
    fRows.push({ ...item, dY, dC });
  });

  // ── Variable costs ──
  varItems[0].valueCycle = chicks * chickPrice;
  let totalVar_C = 0;
  const vRows = [];
  varItems.forEach((item) => {
    totalVar_C += item.valueCycle;
    vRows.push({ ...item, valueYear: item.valueCycle * cycles });
  });

  // Labor item (for rounded capital formula)
  const laborIdx = varItems.findIndex((v) =>
    v.name.toLowerCase().includes("labor"),
  );
  const laborCost = laborIdx >= 0 ? varItems[laborIdx].valueCycle : 4000;
  const varNoLabor_C = totalVar_C - laborCost;

  // ── Costs ──
  const totalCost_C = totalDepC + totalVar_C;
  const totalCost_Y = totalCost_C * cycles;

  // ── Capital ──
  const totalCapital = totalInvest + varNoLabor_C; // working capital for analysis
  const roundedCapital = varNoLabor_C * cycles; // rounded/working capital per year

  // ── Net profit (no credit) ──
  const netProfit_C = totalReturn_C - totalCost_C;
  const netProfit_Y = netProfit_C * cycles;

  // ── Credit scenarios (annual basis) ──
  const creditCost50 = totalCapital * 0.5 * creditRate;
  const creditCost100 = totalCapital * 1.0 * creditRate;

  const totalCost50 = totalCost_Y + creditCost50;
  const totalCost100 = totalCost_Y + creditCost100;

  const netProfit50 = totalReturn_Y - totalCost50;
  const netProfit100 = totalReturn_Y - totalCost100;

  // ── Measure builder ──
  function measures(tc, np) {
    return {
      tc,
      tr: totalReturn_Y,
      np,
      pNP_TC: (np / tc) * 100,
      pTR_TC: (totalReturn_Y / tc) * 100,
      capRate: (np / totalInvest) * 100,
      capCycle: totalInvest / np,
    };
  }
  const m0 = measures(totalCost_Y, netProfit_Y);
  const m50 = measures(totalCost50, netProfit50);
  const m100 = measures(totalCost100, netProfit100);

  // ═══════════════ RENDER ═══════════════

  // KPIs
  document.getElementById("k_tc_cycle").textContent = fmt(totalCost_C);
  document.getElementById("k_tr_cycle").textContent = fmt(totalReturn_C);
  document.getElementById("k_np_cycle").textContent = fmt(netProfit_C);
  document.getElementById("k_tc_year").textContent = fmt(totalCost_Y);
  document.getElementById("k_tr_year").textContent = fmt(totalReturn_Y);
  document.getElementById("k_np_year").textContent = fmt(netProfit_Y);

  // Fixed table
  let ft = fRows
    .map(
      (r) => `<tr>
    <td>${r.name}</td>
    <td class="num">${fmt(r.cost)}</td>
    <td class="num">${r.years}</td>
    <td class="num">${fmt(r.dY)}</td>
    <td class="num">${fmt(r.dC)}</td>
  </tr>`,
    )
    .join("");
  ft += `<tr class="total-row">
    <td>Total</td>
    <td class="num">${fmt(totalInvest)}</td>
    <td>—</td>
    <td class="num">${fmt(totalDepY)}</td>
    <td class="num">${fmt(totalDepC)}</td>
  </tr>`;
  document.getElementById("fixedResultTbody").innerHTML = ft;

  // Variable table
  let vt = vRows
    .map(
      (r) => `<tr>
    <td>${r.name}</td>
    <td class="num">${fmt(r.valueCycle)}</td>
    <td class="num">${fmt(r.valueYear)}</td>
  </tr>`,
    )
    .join("");
  vt += `<tr class="total-row">
    <td>Total</td>
    <td class="num">${fmt(totalVar_C)}</td>
    <td class="num">${fmt(totalVar_C * cycles)}</td>
  </tr>`;
  document.getElementById("varResultTbody").innerHTML = vt;

  // Total costs summary
  document.getElementById("s_fixDep_c").textContent = fmt(totalDepC);
  document.getElementById("s_fixDep_y").textContent = fmt(totalDepY);
  document.getElementById("s_var_c").textContent = fmt(totalVar_C);
  document.getElementById("s_var_y").textContent = fmt(totalVar_C * cycles);
  document.getElementById("s_tot_c").textContent = fmt(totalCost_C);
  document.getElementById("s_tot_y").textContent = fmt(totalCost_Y);

  // Returns table
  let rt = `<tr>
    <td>Broiler Sales</td>
    <td style="font-size:0.79rem; color:var(--muted);">${fmt(birdsSold)} birds × ${avgWeight} kg × ${pricePerKg} EGP/kg</td>
    <td class="num">${fmt(broilerSales_C)}</td>
    <td class="num">${fmt(broilerSales_C * cycles)}</td>
  </tr>
  <tr>
    <td>Litter Sales</td>
    <td style="font-size:0.79rem; color:var(--muted);">—</td>
    <td class="num">${fmt(litterS)}</td>
    <td class="num">${fmt(litterS * cycles)}</td>
  </tr>`;
  if (otherR > 0) {
    rt += `<tr>
      <td>Other Revenue</td>
      <td>—</td>
      <td class="num">${fmt(otherR)}</td>
      <td class="num">${fmt(otherR * cycles)}</td>
    </tr>`;
  }
  rt += `<tr class="total-row">
    <td>Total Returns</td>
    <td>—</td>
    <td class="num">${fmt(totalReturn_C)}</td>
    <td class="num">${fmt(totalReturn_Y)}</td>
  </tr>`;
  document.getElementById("returnTbody").innerHTML = rt;

  // Economic analysis table
  const rows = [
    {
      lbl: "Investment Costs (EGP)",
      f: (_) => `<span class="num">${fmt(totalInvest)}</span>`,
    },
    {
      lbl: "Total Capital = Inv. + Var. (no labor)",
      f: (_) => `<span class="num">${fmt(totalCapital)}</span>`,
    },
    {
      lbl: "Rounded / Working Capital (annual)",
      f: (_) => `<span class="num">${fmt(roundedCapital)}</span>`,
    },
    {
      lbl: "Total Costs (EGP/year)",
      f: (m) => `<span class="num">${fmt(m.tc)}</span>`,
    },
    {
      lbl: "Total Returns (EGP/year)",
      f: (m) => `<span class="num">${fmt(m.tr)}</span>`,
    },
    { lbl: "Net Profit (EGP/year)", f: (m) => money(m.np) },
    { lbl: "% Net Profit / Total Costs", f: (m) => pct(m.pNP_TC) },
    { lbl: "% Total Returns / Total Costs (BC)", f: (m) => pct(m.pTR_TC) },
    { lbl: "Capital Return Rate (%)", f: (m) => pct(m.capRate) },
    {
      lbl: "Capital Cycle (years)",
      f: (m) => {
        const cls = m.capCycle > 0 ? "green-val" : "red-val";
        return `<span class="${cls}">${fmtF(m.capCycle)} yrs</span>`;
      },
    },
  ];

  let et = rows
    .map(
      (row) => `<tr>
    <td>${row.lbl}</td>
    <td>${row.f(m0)}</td>
    <td>${row.f(m50)}</td>
    <td>${row.f(m100)}</td>
  </tr>`,
    )
    .join("");

  et += `<tr style="background:#fffde7;">
    <td style="color:#888; font-size:0.78rem;">Credit interest added (EGP/year)</td>
    <td style="color:#888;">—</td>
    <td><span style="color:#e65100; font-family:'JetBrains Mono',monospace; font-size:0.8rem;">${fmt(creditCost50)}</span></td>
    <td><span style="color:#c62828; font-family:'JetBrains Mono',monospace; font-size:0.8rem;">${fmt(creditCost100)}</span></td>
  </tr>`;

  document.getElementById("econTbody").innerHTML = et;

  // Verdict
  const vd = document.getElementById("verdictDiv");
  if (netProfit_Y >= 0) {
    vd.innerHTML = `<div class="verdict profit">
      <span class="icon">✅</span>
      <span>This project is <strong>PROFITABLE</strong> — Annual net profit: <strong>${fmt(netProfit_Y)} EGP</strong></span>
    </div>`;
  } else {
    vd.innerHTML = `<div class="verdict loss">
      <span class="icon">❌</span>
      <span>This project is <strong>NOT PROFITABLE</strong> under current parameters — Review costs or selling price.</span>
    </div>`;
  }

  document.getElementById("resultsWrap").style.display = "block";
  document.getElementById("noResults").style.display = "none";
  goSection("s5", 4);
}

// ═══════════════════════════════════════════════════════════
//  RESET
// ═══════════════════════════════════════════════════════════
function resetAll() {
  document.getElementById("resultsWrap").style.display = "none";
  document.getElementById("noResults").style.display = "block";
  goSection("s1", 0);
}

// ═══════════════════════════════════════════════════════════
//  BOOT
// ═══════════════════════════════════════════════════════════
init();
