// ══════════════════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════════════════
let fixedItems = [];
let varItems = [];
let currentStep = 0;
let chartInstances = {};

const ANIMAL_CONFIGS = {
  broiler: {
    icon: "🐔",
    label: "broiler",
    animalsLabel: "Chicks per Cycle",
    weightLabel: "Avg. Selling Weight (kg/bird)",
    byproductLabel: "Litter Sales / Cycle",
    byproductHint: "Revenue from selling litter/bedding",
    weightHint: "e.g. 2 kg per bird",
    animalsHint: "e.g. 5000 chicks",
    title: "Broiler Chicken Feasibility Study",
    fixed: [
      { name: "Building", cost: 500000, years: 20 },
      { name: "Equipment", cost: 30000, years: 5 },
    ],
    variable: [
      { name: "Chicks", valueCycle: 0, auto: true },
      { name: "Feeding & Ration", valueCycle: 118000 },
      { name: "Drugs & Vaccines", valueCycle: 20000 },
      { name: "Labor", valueCycle: 4000 },
      { name: "Veterinary Supervision", valueCycle: 800 },
      { name: "Transport & Other Costs", valueCycle: 2000 },
      { name: "Fuel, Water & Electrolytes", valueCycle: 500 },
      { name: "Litter Bedding", valueCycle: 1000 },
      { name: "Miscellaneous Costs", valueCycle: 2000 },
    ],
    animalsDefault: 5000,
    cyclesDefault: 6,
    mortalityDefault: 2,
    weightDefault: 2,
    priceDefault: 27,
    animalPriceLabel: "Price per Chick (EGP)",
    litterDefault: 3300,
  },
  cattle: {
    icon: "🐄",
    label: "cattle",
    animalsLabel: "Cattle per Cycle",
    weightLabel: "Avg. Selling Weight (kg/animal)",
    byproductLabel: "Manure Sales / Cycle",
    byproductHint: "Revenue from manure sales",
    weightHint: "e.g. 450 kg per animal",
    animalsHint: "e.g. 20 cattle per batch",
    title: "Cattle / Beef Feasibility Study",
    fixed: [
      { name: "Barn/Shed", cost: 800000, years: 20 },
      { name: "Equipment & Feeders", cost: 50000, years: 7 },
    ],
    variable: [
      { name: "Calves/Animals", valueCycle: 0, auto: true },
      { name: "Feeding & Ration", valueCycle: 80000 },
      { name: "Drugs & Vaccines", valueCycle: 8000 },
      { name: "Labor", valueCycle: 6000 },
      { name: "Veterinary Supervision", valueCycle: 2000 },
      { name: "Water & Utilities", valueCycle: 1500 },
      { name: "Miscellaneous", valueCycle: 2000 },
    ],
    animalsDefault: 20,
    cyclesDefault: 2,
    mortalityDefault: 1,
    weightDefault: 450,
    priceDefault: 70,
    animalPriceLabel: "Price per Calf (EGP)",
    litterDefault: 5000,
  },
  sheep: {
    icon: "🐑",
    label: "sheep",
    animalsLabel: "Sheep per Cycle",
    weightLabel: "Avg. Selling Weight (kg/animal)",
    byproductLabel: "Wool/By-product Sales / Cycle",
    byproductHint: "Revenue from wool or manure",
    weightHint: "e.g. 40 kg per animal",
    animalsHint: "e.g. 100 sheep per batch",
    title: "Sheep / Lamb Feasibility Study",
    fixed: [
      { name: "Shed/Pen", cost: 200000, years: 15 },
      { name: "Equipment", cost: 20000, years: 7 },
    ],
    variable: [
      { name: "Lambs/Animals", valueCycle: 0, auto: true },
      { name: "Feeding & Ration", valueCycle: 25000 },
      { name: "Drugs & Vaccines", valueCycle: 5000 },
      { name: "Labor", valueCycle: 3000 },
      { name: "Veterinary Supervision", valueCycle: 800 },
      { name: "Water & Utilities", valueCycle: 600 },
      { name: "Miscellaneous", valueCycle: 1000 },
    ],
    animalsDefault: 100,
    cyclesDefault: 2,
    mortalityDefault: 2,
    weightDefault: 40,
    priceDefault: 90,
    animalPriceLabel: "Price per Lamb (EGP)",
    litterDefault: 2000,
  },
  swine: {
    icon: "🐖",
    label: "swine",
    animalsLabel: "Pigs per Cycle",
    weightLabel: "Avg. Selling Weight (kg/animal)",
    byproductLabel: "Manure/By-product Sales / Cycle",
    byproductHint: "By-product revenue",
    weightHint: "e.g. 100 kg per pig",
    animalsHint: "e.g. 50 pigs per batch",
    title: "Swine / Pig Feasibility Study",
    fixed: [
      { name: "Pig House", cost: 400000, years: 15 },
      { name: "Equipment", cost: 40000, years: 5 },
    ],
    variable: [
      { name: "Piglets", valueCycle: 0, auto: true },
      { name: "Feeding & Ration", valueCycle: 60000 },
      { name: "Drugs & Vaccines", valueCycle: 8000 },
      { name: "Labor", valueCycle: 5000 },
      { name: "Veterinary Supervision", valueCycle: 1500 },
      { name: "Water & Utilities", valueCycle: 1000 },
      { name: "Miscellaneous", valueCycle: 1500 },
    ],
    animalsDefault: 50,
    cyclesDefault: 3,
    mortalityDefault: 3,
    weightDefault: 100,
    priceDefault: 60,
    animalPriceLabel: "Price per Piglet (EGP)",
    litterDefault: 3000,
  },
  fish: {
    icon: "🐟",
    label: "fish",
    animalsLabel: "Fish (kg of fingerlings) per Cycle",
    weightLabel: "Avg. Selling Weight (kg/fish)",
    byproductLabel: "Algae/By-product Sales / Cycle",
    byproductHint: "Any aquaculture by-product revenue",
    weightHint: "e.g. 0.5 kg per fish",
    animalsHint: "e.g. 10000 fingerlings",
    title: "Fish / Aquaculture Feasibility Study",
    fixed: [
      { name: "Pond/Tank", cost: 600000, years: 20 },
      { name: "Equipment & Aeration", cost: 80000, years: 8 },
    ],
    variable: [
      { name: "Fingerlings", valueCycle: 0, auto: true },
      { name: "Fish Feed", valueCycle: 50000 },
      { name: "Chemicals & Treatments", valueCycle: 8000 },
      { name: "Labor", valueCycle: 4000 },
      { name: "Water & Electricity", valueCycle: 3000 },
      { name: "Miscellaneous", valueCycle: 1500 },
    ],
    animalsDefault: 10000,
    cyclesDefault: 2,
    mortalityDefault: 5,
    weightDefault: 0.5,
    priceDefault: 40,
    animalPriceLabel: "Price per Fingerling (EGP)",
    litterDefault: 0,
  },
  goat: {
    icon: "🐐",
    label: "goat",
    animalsLabel: "Goats per Cycle",
    weightLabel: "Avg. Selling Weight (kg/animal)",
    byproductLabel: "Milk/Cheese Sales / Cycle",
    byproductHint: "Revenue from milk or cheese",
    weightHint: "e.g. 30 kg per goat",
    animalsHint: "e.g. 50 goats per batch",
    title: "Goat Feasibility Study",
    fixed: [
      { name: "Shed/Pen", cost: 150000, years: 15 },
      { name: "Equipment", cost: 15000, years: 7 },
    ],
    variable: [
      { name: "Kids/Animals", valueCycle: 0, auto: true },
      { name: "Feeding & Ration", valueCycle: 18000 },
      { name: "Drugs & Vaccines", valueCycle: 4000 },
      { name: "Labor", valueCycle: 2500 },
      { name: "Veterinary Supervision", valueCycle: 600 },
      { name: "Miscellaneous", valueCycle: 800 },
    ],
    animalsDefault: 50,
    cyclesDefault: 2,
    mortalityDefault: 2,
    weightDefault: 30,
    priceDefault: 100,
    animalPriceLabel: "Price per Kid (EGP)",
    litterDefault: 4000,
  },
  duck: {
    icon: "🦆",
    label: "duck",
    animalsLabel: "Ducks per Cycle",
    weightLabel: "Avg. Selling Weight (kg/duck)",
    byproductLabel: "Eggs/Feather Sales / Cycle",
    byproductHint: "Revenue from eggs or feathers",
    weightHint: "e.g. 3 kg per duck",
    animalsHint: "e.g. 3000 ducklings",
    title: "Duck / Waterfowl Feasibility Study",
    fixed: [
      { name: "Duck House", cost: 250000, years: 15 },
      { name: "Equipment", cost: 25000, years: 5 },
    ],
    variable: [
      { name: "Ducklings", valueCycle: 0, auto: true },
      { name: "Feeding & Ration", valueCycle: 70000 },
      { name: "Drugs & Vaccines", valueCycle: 10000 },
      { name: "Labor", valueCycle: 3000 },
      { name: "Water & Utilities", valueCycle: 1500 },
      { name: "Miscellaneous", valueCycle: 1500 },
    ],
    animalsDefault: 3000,
    cyclesDefault: 4,
    mortalityDefault: 3,
    weightDefault: 3,
    priceDefault: 35,
    animalPriceLabel: "Price per Duckling (EGP)",
    litterDefault: 2000,
  },
  rabbit: {
    icon: "🐇",
    label: "rabbit",
    animalsLabel: "Rabbits per Cycle",
    weightLabel: "Avg. Selling Weight (kg/rabbit)",
    byproductLabel: "Manure/Fur Sales / Cycle",
    byproductHint: "Revenue from manure or fur",
    weightHint: "e.g. 2 kg per rabbit",
    animalsHint: "e.g. 500 rabbits per batch",
    title: "Rabbit Feasibility Study",
    fixed: [
      { name: "Rabbit House", cost: 80000, years: 10 },
      { name: "Cages & Equipment", cost: 30000, years: 5 },
    ],
    variable: [
      { name: "Young Rabbits", valueCycle: 0, auto: true },
      { name: "Feeding & Ration", valueCycle: 15000 },
      { name: "Drugs & Vaccines", valueCycle: 3000 },
      { name: "Labor", valueCycle: 2000 },
      { name: "Utilities", valueCycle: 500 },
      { name: "Miscellaneous", valueCycle: 800 },
    ],
    animalsDefault: 500,
    cyclesDefault: 5,
    mortalityDefault: 5,
    weightDefault: 2,
    priceDefault: 50,
    animalPriceLabel: "Price per Young Rabbit (EGP)",
    litterDefault: 1000,
  },
  turkey: {
    icon: "🦃",
    label: "turkey",
    animalsLabel: "Turkeys per Cycle",
    weightLabel: "Avg. Selling Weight (kg/turkey)",
    byproductLabel: "Feather/By-product Sales / Cycle",
    byproductHint: "Revenue from feathers or offal",
    weightHint: "e.g. 8 kg per turkey",
    animalsHint: "e.g. 1000 poults",
    title: "Turkey Feasibility Study",
    fixed: [
      { name: "Turkey House", cost: 350000, years: 20 },
      { name: "Equipment", cost: 35000, years: 7 },
    ],
    variable: [
      { name: "Poults", valueCycle: 0, auto: true },
      { name: "Feeding & Ration", valueCycle: 90000 },
      { name: "Drugs & Vaccines", valueCycle: 12000 },
      { name: "Labor", valueCycle: 4000 },
      { name: "Water & Utilities", valueCycle: 1200 },
      { name: "Miscellaneous", valueCycle: 2000 },
    ],
    animalsDefault: 1000,
    cyclesDefault: 2,
    mortalityDefault: 3,
    weightDefault: 8,
    priceDefault: 55,
    animalPriceLabel: "Price per Poult (EGP)",
    litterDefault: 2500,
  },
  custom: {
    icon: "🐾",
    label: "animal",
    animalsLabel: "Animals per Cycle",
    weightLabel: "Avg. Selling Weight (kg/animal)",
    byproductLabel: "By-product Sales / Cycle",
    byproductHint: "Any by-product revenue",
    weightHint: "e.g. market weight per animal",
    animalsHint: "e.g. number of animals per batch",
    title: "Custom Animal Feasibility Study",
    fixed: [
      { name: "Facility", cost: 300000, years: 15 },
      { name: "Equipment", cost: 30000, years: 5 },
    ],
    variable: [
      { name: "Young Animals", valueCycle: 0, auto: true },
      { name: "Feeding & Ration", valueCycle: 50000 },
      { name: "Drugs & Vaccines", valueCycle: 8000 },
      { name: "Labor", valueCycle: 4000 },
      { name: "Utilities", valueCycle: 1000 },
      { name: "Miscellaneous", valueCycle: 1500 },
    ],
    animalsDefault: 1000,
    cyclesDefault: 4,
    mortalityDefault: 3,
    weightDefault: 5,
    priceDefault: 40,
    animalPriceLabel: "Price per Young Animal (EGP)",
    litterDefault: 2000,
  },
};

// ══════════════════════════════════════════════════════
//  LANDING → APP
// ══════════════════════════════════════════════════════
function enterApp() {
  document.getElementById("landing").classList.add("slide-out");
  setTimeout(() => {
    document.getElementById("landing").style.display = "none";
    const app = document.getElementById("app");
    app.style.display = "block";
    setTimeout(() => app.classList.add("visible"), 50);
  }, 700);
}
function backToLanding() {
  const app = document.getElementById("app");
  app.classList.remove("visible");
  setTimeout(() => {
    app.style.display = "none";
    const land = document.getElementById("landing");
    land.style.display = "flex";
    land.classList.remove("slide-out");
    setTimeout(() => (land.style.transform = ""), 50);
  }, 500);
}

// ══════════════════════════════════════════════════════
//  ANIMAL TYPE
// ══════════════════════════════════════════════════════
function updateAnimalType() {
  const type = document.getElementById("animalType").value;
  const cfg = ANIMAL_CONFIGS[type];
  // Update header
  document.getElementById("hdrIcon").textContent = cfg.icon;
  document.getElementById("hdrTitle").textContent = cfg.title;
  document.getElementById("hdrBadge").textContent =
    "AgriCalc Pro — " + cfg.title;
  document.getElementById("animalLabel").textContent = cfg.label;
  // Update labels
  document.getElementById("lbl_animals").textContent = cfg.animalsLabel;
  document.getElementById("lbl_weight").textContent = cfg.weightLabel;
  document.getElementById("lbl_byproduct").textContent = cfg.byproductLabel;
  document.getElementById("hint_animals").textContent = cfg.animalsHint;
  document.getElementById("hint_weight").textContent = cfg.weightHint;
  document.getElementById("hint_byproduct").textContent = cfg.byproductHint;
  // Update defaults
  document.getElementById("chicks").value = cfg.animalsDefault;
  document.getElementById("cycles").value = cfg.cyclesDefault;
  document.getElementById("mortality").value = cfg.mortalityDefault;
  document.getElementById("avgWeight").value = cfg.weightDefault;
  document.getElementById("pricePerKg").value = cfg.priceDefault;
  document.getElementById("litterSales").value = cfg.litterDefault || 0;
  // Reset items
  fixedItems = cfg.fixed.map((f) => ({ ...f }));
  varItems = cfg.variable.map((v) => ({ ...v, auto: !!v.auto }));
  renderFixed();
  renderVar();
  // Reset results
  document.getElementById("resultsWrap").style.display = "none";
  document.getElementById("noResults").style.display = "block";
}

// ══════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════
function fmt(n) {
  return isNaN(n) ? "0" : Math.round(n).toLocaleString("en-US");
}
function fmtF(n) {
  return isNaN(n) ? "0" : parseFloat(n.toFixed(2)).toLocaleString("en-US");
}
function getCur() {
  return document.getElementById("currencyLabel").value || "EGP";
}
function pct(n) {
  const c = n >= 0 ? "green-val" : "red-val";
  return `<span class="${c}">${fmtF(n)}%</span>`;
}
function money(n) {
  const c = n >= 0 ? "green-val" : "red-val";
  return `<span class="${c}">${fmt(n)}</span>`;
}

// ══════════════════════════════════════════════════════
//  NAV
// ══════════════════════════════════════════════════════
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
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ══════════════════════════════════════════════════════
//  FIXED RENDER
// ══════════════════════════════════════════════════════
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
        <div class="field"><label>Item Name</label>
          <input type="text" value="${item.name}" oninput="fixedItems[${i}].name=this.value"></div>
        <div class="field"><label>Investment Cost (${getCur()})</label>
          <input type="number" value="${item.cost}" oninput="updateFixedVal(${i},this.value,'cost')"></div>
        <div class="field"><label>Asset Lifespan (years)</label>
          <input type="number" value="${item.years}" min="1" oninput="updateFixedVal(${i},this.value,'years')"></div>
        <div class="field" style="justify-content:flex-end;padding-top:18px;">
          <span id="dep-calc-${i}" style="font-size:0.78rem;color:var(--g3);font-family:'JetBrains Mono',monospace;line-height:1.9">
            ${calcDepText(item, cycles)}
          </span>
        </div>
      </div>`;
    c.appendChild(d);
  });
}
function updateFixedVal(i, val, type) {
  const cycles = parseFloat(document.getElementById("cycles").value) || 6;
  fixedItems[i][type] = parseFloat(val) || 0;
  const sp = document.getElementById(`dep-calc-${i}`);
  if (sp) sp.innerHTML = calcDepText(fixedItems[i], cycles);
}
function calcDepText(item, cycles) {
  const dY = item.cost / (item.years || 1);
  const dC = dY / cycles;
  return `Dep/year = ${fmt(dY)}<br>Dep/cycle = ${fmt(dC)}`;
}
function addFixed() {
  fixedItems.push({ name: "New Asset", cost: 0, years: 5 });
  renderFixed();
}
function removeFixed(i) {
  fixedItems.splice(i, 1);
  renderFixed();
}

// ══════════════════════════════════════════════════════
//  VARIABLE RENDER
// ══════════════════════════════════════════════════════
function renderVar() {
  const type = document.getElementById("animalType").value;
  const cfg = ANIMAL_CONFIGS[type];
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
        <div class="field"><label>Item Name</label>
          <input type="text" value="${item.name}" oninput="varItems[${i}].name=this.value"></div>
        <div class="field"><label>Value per Cycle (${getCur()})</label>
          <input type="number" value="${item.auto ? "" : item.valueCycle}"
            ${item.auto ? `disabled placeholder="Auto: Animals × Price per animal"` : ""}
            oninput="varItems[${i}].valueCycle=parseFloat(this.value)||0">
          ${item.auto ? `<span class="hint">= Animals × Price per animal (enter below)</span>` : ""}
        </div>
        ${
          item.auto
            ? `<div class="field"><label>${cfg.animalPriceLabel}</label>
          <input type="number" id="chickPrice" value="7" min="0.1" step="0.1"></div>`
            : ""
        }
      </div>`;
    c.appendChild(d);
  });
}
function addVar() {
  varItems.push({
    name: "New Variable Item",
    valueCycle: 0,
    auto: false,
  });
  renderVar();
}
function removeVar(i) {
  varItems.splice(i, 1);
  renderVar();
}

// ══════════════════════════════════════════════════════
//  CALCULATE
// ══════════════════════════════════════════════════════
function calculate() {
  const CUR = getCur();
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
  const projName =
    document.getElementById("projectName").value || "Livestock Project";
  const animalType = document.getElementById("animalType").value;
  const cfg = ANIMAL_CONFIGS[animalType];

  // ── Returns ──
  const birdsSold = chicks * (1 - mortality / 100);
  const broilerSales_C = birdsSold * avgWeight * pricePerKg;
  const totalReturn_C = broilerSales_C + litterS + otherR;
  const totalReturn_Y = totalReturn_C * cycles;

  // ── Fixed ──
  let totalInvest = 0,
    totalDepY = 0,
    totalDepC = 0;
  const fRows = [];
  fixedItems.forEach((item) => {
    const dY = item.cost / (item.years || 1);
    const dC = dY / cycles;
    totalInvest += item.cost;
    totalDepY += dY;
    totalDepC += dC;
    fRows.push({ ...item, dY, dC });
  });

  // ── Variable ──
  varItems[0].valueCycle = chicks * chickPrice;
  let totalVar_C = 0;
  const vRows = [];
  varItems.forEach((item) => {
    totalVar_C += item.valueCycle;
    vRows.push({ ...item, valueYear: item.valueCycle * cycles });
  });
  const laborIdx = varItems.findIndex((v) =>
    v.name.toLowerCase().includes("labor"),
  );
  const laborCost = laborIdx >= 0 ? varItems[laborIdx].valueCycle : 0;
  const varNoLabor_C = totalVar_C - laborCost;

  // ── Costs ──
  const totalCost_C = totalDepC + totalVar_C;
  const totalCost_Y = totalCost_C * cycles;

  // ── Capital ──
  const totalCapital = totalInvest + varNoLabor_C;
  const roundedCapital = varNoLabor_C * cycles;

  // ── Net profit ──
  const netProfit_C = totalReturn_C - totalCost_C;
  const netProfit_Y = netProfit_C * cycles;

  // ── Credit scenarios ──
  const creditCost50 = totalCapital * 0.5 * creditRate;
  const creditCost100 = totalCapital * 1.0 * creditRate;
  const totalCost50 = totalCost_Y + creditCost50;
  const totalCost100 = totalCost_Y + creditCost100;
  const netProfit50 = totalReturn_Y - totalCost50;
  const netProfit100 = totalReturn_Y - totalCost100;

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

  // ═══════════════ UPDATE CURRENCY LABELS ═══════════════
  [
    "k_currency1",
    "k_currency2",
    "k_currency3",
    "k_currency4",
    "k_currency5",
    "k_currency6",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = CUR;
  });

  // ═══════════════ KPIs ═══════════════
  document.getElementById("k_tc_cycle").textContent = fmt(totalCost_C);
  document.getElementById("k_tr_cycle").textContent = fmt(totalReturn_C);
  document.getElementById("k_np_cycle").textContent = fmt(netProfit_C);
  document.getElementById("k_tc_year").textContent = fmt(totalCost_Y);
  document.getElementById("k_tr_year").textContent = fmt(totalReturn_Y);
  document.getElementById("k_np_year").textContent = fmt(netProfit_Y);

  // ═══════════════ FORMULA LINES ═══════════════
  document.getElementById("fml_chick_cost").innerHTML =
    `<span class="var">${cfg.label} purchase/cycle</span> <span class="op">=</span> <span class="val">${chicks.toLocaleString()}</span> <span class="op">×</span> <span class="val">${chickPrice}</span> <span class="op">=</span> <span class="result">${fmt(chicks * chickPrice)} ${CUR}</span>`;

  document.getElementById("fml_total_costs").innerHTML =
    `<span class="var">Total Costs/cycle</span> <span class="op">=</span> <span class="val">${fmt(totalDepC)}</span> <span class="op">+</span> <span class="val">${fmt(totalVar_C)}</span> <span class="op">=</span> <span class="result">${fmt(totalCost_C)} ${CUR}</span>`;

  document.getElementById("fml_fixdep_row").textContent =
    `Sum of (Cost ÷ Years ÷ Cycles)`;
  document.getElementById("fml_var_row").textContent =
    `Sum of all variable items`;
  document.getElementById("fml_tot_row").textContent =
    `${fmt(totalDepC)} + ${fmt(totalVar_C)}`;

  document.getElementById("fml_birds_sold").innerHTML =
    `<span class="var">Animals sold/cycle</span> <span class="op">=</span> <span class="val">${chicks.toLocaleString()}</span> <span class="op">×</span> <span class="op">(1 −</span> <span class="val">${mortality}%</span><span class="op">)</span> <span class="op">=</span> <span class="result">${fmt(birdsSold)} animals</span>`;
  document.getElementById("fml_broiler_sales").innerHTML =
    `<span class="var">Main sales/cycle</span> <span class="op">=</span> <span class="val">${fmt(birdsSold)}</span> <span class="op">×</span> <span class="val">${avgWeight} kg</span> <span class="op">×</span> <span class="val">${pricePerKg} ${CUR}/kg</span> <span class="op">=</span> <span class="result">${fmt(broilerSales_C)} ${CUR}</span>`;

  document.getElementById("fml_net_profit_cycle").innerHTML =
    `<span class="var">Net Profit/cycle</span> <span class="op">=</span> <span class="val">${fmt(totalReturn_C)}</span> <span class="op">−</span> <span class="val">${fmt(totalCost_C)}</span> <span class="op">=</span> <span class="result">${fmt(netProfit_C)} ${CUR}</span>`;
  document.getElementById("fml_net_profit_year").innerHTML =
    `<span class="var">Net Profit/year</span> <span class="op">=</span> <span class="val">${fmt(netProfit_C)}</span> <span class="op">×</span> <span class="val">${cycles} cycles</span> <span class="op">=</span> <span class="result">${fmt(netProfit_Y)} ${CUR}</span>`;

  document.getElementById("fml_credit_calc").innerHTML =
    `<span class="var">50% credit cost</span> <span class="op">=</span> <span class="val">${fmt(totalCapital)}</span> <span class="op">× 0.5 ×</span> <span class="val">${(creditRate * 100).toFixed(1)}%</span> <span class="op">=</span> <span class="result">${fmt(creditCost50)} ${CUR}/year</span>`;

  // ═══════════════ FIXED TABLE ═══════════════
  let ft = fRows
    .map(
      (r) => `<tr>
    <td>${r.name}</td>
    <td class="num">${fmt(r.cost)}</td>
    <td class="num">${r.years}</td>
    <td class="formula-col">${fmt(r.cost)} ÷ ${r.years}</td>
    <td class="num">${fmt(r.dY)}</td>
    <td class="formula-col">${fmt(r.dY)} ÷ ${cycles}</td>
    <td class="num">${fmt(r.dC)}</td>
  </tr>`,
    )
    .join("");
  ft += `<tr class="total-row">
    <td>Total</td><td class="num">${fmt(totalInvest)}</td><td>—</td>
    <td>—</td><td class="num">${fmt(totalDepY)}</td>
    <td>—</td><td class="num">${fmt(totalDepC)}</td></tr>`;
  document.getElementById("fixedResultTbody").innerHTML = ft;

  // ═══════════════ VARIABLE TABLE ═══════════════
  let vt = vRows
    .map(
      (r) => `<tr>
    <td>${r.name}</td>
    <td class="formula-col">${r.auto ? `${chicks.toLocaleString()} × ${chickPrice}` : fmt(r.valueCycle) + ` × ${cycles}`}</td>
    <td class="num">${fmt(r.valueCycle)}</td>
    <td class="num">${fmt(r.valueYear)}</td>
  </tr>`,
    )
    .join("");
  vt += `<tr class="total-row"><td>Total</td><td>—</td><td class="num">${fmt(totalVar_C)}</td><td class="num">${fmt(totalVar_C * cycles)}</td></tr>`;
  document.getElementById("varResultTbody").innerHTML = vt;

  // ═══════════════ TOTAL COSTS ═══════════════
  document.getElementById("s_fixDep_c").textContent = fmt(totalDepC);
  document.getElementById("s_fixDep_y").textContent = fmt(totalDepY);
  document.getElementById("s_var_c").textContent = fmt(totalVar_C);
  document.getElementById("s_var_y").textContent = fmt(totalVar_C * cycles);
  document.getElementById("s_tot_c").textContent = fmt(totalCost_C);
  document.getElementById("s_tot_y").textContent = fmt(totalCost_Y);

  // ═══════════════ RETURNS TABLE ═══════════════
  let rt = `<tr>
    <td>Main Sales (${cfg.label})</td>
    <td class="formula-col">${fmt(birdsSold)} animals × ${avgWeight}kg × ${pricePerKg}</td>
    <td class="num">${fmt(broilerSales_C)}</td>
    <td class="num">${fmt(broilerSales_C * cycles)}</td>
  </tr>
  <tr>
    <td>By-product Sales</td>
    <td class="formula-col">${fmt(litterS)} × ${cycles} cycles</td>
    <td class="num">${fmt(litterS)}</td>
    <td class="num">${fmt(litterS * cycles)}</td>
  </tr>`;
  if (otherR > 0)
    rt += `<tr><td>Other Revenue</td><td class="formula-col">${fmt(otherR)} × ${cycles}</td><td class="num">${fmt(otherR)}</td><td class="num">${fmt(otherR * cycles)}</td></tr>`;
  rt += `<tr class="total-row"><td>Total Returns</td><td>—</td><td class="num">${fmt(totalReturn_C)}</td><td class="num">${fmt(totalReturn_Y)}</td></tr>`;
  document.getElementById("returnTbody").innerHTML = rt;

  // ═══════════════ ECONOMIC TABLE ═══════════════
  const econRows = [
    {
      lbl: "Investment Costs",
      fml: `Fixed assets total`,
      f: (_) => `<span class="num">${fmt(totalInvest)}</span>`,
    },
    {
      lbl: "Total Capital = Invest. + Var. (excl. labor)",
      fml: `${fmt(totalInvest)} + ${fmt(varNoLabor_C)}`,
      f: (_) => `<span class="num">${fmt(totalCapital)}</span>`,
    },
    {
      lbl: "Rounded / Working Capital (annual)",
      fml: `${fmt(varNoLabor_C)} × ${cycles}`,
      f: (_) => `<span class="num">${fmt(roundedCapital)}</span>`,
    },
    {
      lbl: "Total Costs (annual)",
      fml: `TC/cycle × cycles`,
      f: (m) => `<span class="num">${fmt(m.tc)}</span>`,
    },
    {
      lbl: "Total Returns (annual)",
      fml: `TR/cycle × cycles`,
      f: (m) => `<span class="num">${fmt(m.tr)}</span>`,
    },
    { lbl: "Net Profit (annual)", fml: `TR − TC`, f: (m) => money(m.np) },
    {
      lbl: "% Net Profit / Total Costs",
      fml: `NP ÷ TC × 100`,
      f: (m) => pct(m.pNP_TC),
    },
    {
      lbl: "% Total Returns / Total Costs (B:C)",
      fml: `TR ÷ TC × 100`,
      f: (m) => pct(m.pTR_TC),
    },
    {
      lbl: "Capital Return Rate (%)",
      fml: `NP ÷ Invest. × 100`,
      f: (m) => pct(m.capRate),
    },
    {
      lbl: "Capital Cycle (years)",
      fml: `Invest. ÷ NP`,
      f: (m) => {
        const cls = m.capCycle > 0 ? "green-val" : "red-val";
        return `<span class="${cls}">${fmtF(m.capCycle)} yrs</span>`;
      },
    },
  ];
  let et = econRows
    .map(
      (row) => `<tr>
    <td>${row.lbl}</td>
    <td class="formula-col" style="font-size:0.7rem;color:#5a7d5e">${row.fml}</td>
    <td>${row.f(m0)}</td><td>${row.f(m50)}</td><td>${row.f(m100)}</td>
  </tr>`,
    )
    .join("");
  et += `<tr style="background:#fffde7">
    <td style="color:#888;font-size:0.78rem">Credit interest added (${CUR}/year)</td>
    <td class="formula-col">TC_credit × rate%</td>
    <td style="color:#888">—</td>
    <td><span style="color:#e65100;font-family:'JetBrains Mono',monospace;font-size:0.8rem">${fmt(creditCost50)}</span></td>
    <td><span style="color:#c62828;font-family:'JetBrains Mono',monospace;font-size:0.8rem">${fmt(creditCost100)}</span></td>
  </tr>`;
  document.getElementById("econTbody").innerHTML = et;

  // ═══════════════ VERDICT ═══════════════
  const vd = document.getElementById("verdictDiv");
  vd.innerHTML =
    netProfit_Y >= 0
      ? `<div class="verdict profit"><span class="icon">✅</span><span>This project is <strong>PROFITABLE</strong> — Annual net profit: <strong>${fmt(netProfit_Y)} ${CUR}</strong></span></div>`
      : `<div class="verdict loss"><span class="icon">❌</span><span>This project is <strong>NOT PROFITABLE</strong> under current parameters — Review costs or selling price.</span></div>`;

  // ═══════════════ CHARTS ═══════════════
  renderCharts({
    totalCost_Y,
    totalReturn_Y,
    netProfit_Y,
    totalDepY,
    totalVar_Y: totalVar_C * cycles,
    vRows,
    cycles,
    m0,
    m50,
    m100,
    netProfit_C,
    netProfit50,
    netProfit100,
    CUR,
  });

  document.getElementById("resultsWrap").style.display = "block";
  document.getElementById("noResults").style.display = "none";
  goSection("s5", 4);
}

// ══════════════════════════════════════════════════════
//  CHARTS
// ══════════════════════════════════════════════════════
function destroyChart(id) {
  if (chartInstances[id]) {
    chartInstances[id].destroy();
    delete chartInstances[id];
  }
}

function renderCharts({
  totalCost_Y,
  totalReturn_Y,
  netProfit_Y,
  totalDepY,
  totalVar_Y,
  vRows,
  cycles,
  m0,
  m50,
  m100,
  netProfit_C,
  netProfit50,
  netProfit100,
  CUR,
}) {
  const g1 = "#0d2b12",
    g2 = "#1a5c24",
    g3 = "#2e8b3a",
    g4 = "#56c464",
    gold = "#e8b923",
    red = "#c0392b";

  // Chart 1: Bar — Cost vs Return Annual
  destroyChart("chartBarMain");
  chartInstances["chartBarMain"] = new Chart(
    document.getElementById("chartBarMain"),
    {
      type: "bar",
      data: {
        labels: ["Total Costs", "Total Returns", "Net Profit"],
        datasets: [
          {
            label: `${CUR}/year`,
            data: [totalCost_Y, totalReturn_Y, netProfit_Y],
            backgroundColor: [red, g3, netProfit_Y >= 0 ? g4 : red],
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (c) => `${fmt(c.raw)} ${CUR}` },
          },
        },
        scales: {
          y: {
            ticks: { callback: (v) => fmt(v) },
            grid: { color: "rgba(0,0,0,0.05)" },
          },
          x: { grid: { display: false } },
        },
      },
    },
  );

  // Chart 2: Pie — Cost breakdown
  destroyChart("chartPieCosts");
  chartInstances["chartPieCosts"] = new Chart(
    document.getElementById("chartPieCosts"),
    {
      type: "doughnut",
      data: {
        labels: ["Fixed Depreciation", "Variable Costs"],
        datasets: [
          {
            data: [totalDepY, totalVar_Y],
            backgroundColor: [g1, g4],
            borderWidth: 0,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom", labels: { font: { size: 11 } } },
          tooltip: {
            callbacks: {
              label: (c) => `${c.label}: ${fmt(c.raw)} ${CUR}`,
            },
          },
        },
      },
    },
  );

  // Chart 3: Bar — Credit scenarios profit
  destroyChart("chartCreditScenarios");
  chartInstances["chartCreditScenarios"] = new Chart(
    document.getElementById("chartCreditScenarios"),
    {
      type: "bar",
      data: {
        labels: ["No Credit", "50% Credit", "100% Credit"],
        datasets: [
          {
            label: `Net Profit (${CUR}/year)`,
            data: [netProfit_Y, netProfit50, netProfit100],
            backgroundColor: [g4, gold, netProfit100 >= 0 ? g3 : red],
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (c) => `${fmt(c.raw)} ${CUR}` },
          },
        },
        scales: {
          y: {
            ticks: { callback: (v) => fmt(v) },
            grid: { color: "rgba(0,0,0,0.05)" },
          },
          x: { grid: { display: false } },
        },
      },
    },
  );

  // Chart 4: Horizontal bar — Variable cost distribution
  destroyChart("chartVarCosts");
  const topVar = vRows.slice(0, 8);
  const palette = [
    "#0d2b12",
    "#1a5c24",
    "#2e8b3a",
    "#56c464",
    "#a8e6af",
    "#e8b923",
    "#fde27a",
    "#c0392b",
  ];
  chartInstances["chartVarCosts"] = new Chart(
    document.getElementById("chartVarCosts"),
    {
      type: "bar",
      data: {
        labels: topVar.map((r) => r.name),
        datasets: [
          {
            label: `${CUR}/cycle`,
            data: topVar.map((r) => r.valueCycle),
            backgroundColor: palette,
            borderRadius: 6,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (c) => `${fmt(c.raw)} ${CUR}` },
          },
        },
        scales: {
          x: {
            ticks: { callback: (v) => fmt(v) },
            grid: { color: "rgba(0,0,0,0.05)" },
          },
          y: { grid: { display: false }, ticks: { font: { size: 10 } } },
        },
      },
    },
  );
}

// ══════════════════════════════════════════════════════
//  EXPORT PDF
// ══════════════════════════════════════════════════════
async function exportPDF() {
  const el = document.getElementById("exportLoading");
  document.getElementById("exportMsg").textContent = "Generating PDF report...";
  el.classList.add("show");
  try {
    await new Promise((r) => setTimeout(r, 100));
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pageW = 210;
    const pageH = 297;
    const margin = 15;
    const usableW = pageW - 2 * margin;

    const projName =
      document.getElementById("projectName").value || "Livestock Project";
    const animalType = document.getElementById("animalType").value;
    const cfg = ANIMAL_CONFIGS[animalType];
    const CUR = getCur();

    // Header
    pdf.setFillColor(13, 43, 18);
    pdf.rect(0, 0, pageW, 45, "F");
    pdf.setFillColor(46, 139, 58);
    pdf.rect(0, 38, pageW, 7, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.text(cfg.icon + " " + cfg.title, pageW / 2, 18, {
      align: "center",
    });
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text(projName, pageW / 2, 27, { align: "center" });
    pdf.setFontSize(9);
    pdf.text(
      "Generated by AgriCalc Pro  |  " +
        new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      pageW / 2,
      35,
      { align: "center" },
    );

    // KPI section
    let y = 55;
    pdf.setTextColor(13, 43, 18);
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    pdf.text("Summary KPIs", margin, y);
    y += 8;

    const kpiIds = [
      ["k_tc_cycle", "Total Cost/Cycle"],
      ["k_tr_cycle", "Total Return/Cycle"],
      ["k_np_cycle", "Net Profit/Cycle"],
      ["k_tc_year", "Total Cost/Year"],
      ["k_tr_year", "Total Return/Year"],
      ["k_np_year", "Net Profit/Year"],
    ];
    const kpiW = usableW / 3;
    kpiIds.forEach(([id, label], i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = margin + col * kpiW;
      const ky = y + row * 20;
      const val = document.getElementById(id).textContent;
      pdf.setFillColor(
        col === 2 && row === 0 ? 13 : col === 1 ? 46 : 13,
        col === 2 && row === 0 ? 77 : col === 1 ? 139 : 43,
        col === 2 && row === 0 ? 22 : col === 1 ? 58 : 18,
      );
      pdf.roundedRect(x, ky - 5, kpiW - 3, 17, 3, 3, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.text(label.toUpperCase(), x + 4, ky + 1);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(val + " " + CUR, x + 4, ky + 10);
    });
    y += 50;

    // Helper: add a simple table
    function addTable(headers, rows, startY) {
      const colW = usableW / headers.length;
      pdf.setFillColor(13, 43, 18);
      pdf.rect(margin, startY, usableW, 7, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "bold");
      headers.forEach((h, i) => pdf.text(h, margin + i * colW + 2, startY + 5));
      let ry = startY + 7;
      rows.forEach((row, ri) => {
        if (ry > pageH - 20) {
          pdf.addPage();
          ry = 20;
          pdf.setFillColor(13, 43, 18);
          pdf.rect(margin, ry, usableW, 7, "F");
          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(7);
          pdf.setFont("helvetica", "bold");
          headers.forEach((h, i) => pdf.text(h, margin + i * colW + 2, ry + 5));
          ry += 7;
        }
        pdf.setFillColor(
          ri % 2 === 0 ? 248 : 255,
          ri % 2 === 0 ? 251 : 255,
          ri % 2 === 0 ? 248 : 255,
        );
        pdf.rect(margin, ry, usableW, 6, "F");
        pdf.setTextColor(13, 31, 16);
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "normal");
        row.forEach((cell, ci) =>
          pdf.text(
            String(cell || "—").substring(0, 30),
            margin + ci * colW + 2,
            ry + 4,
          ),
        );
        ry += 6;
      });
      // total line border
      pdf.setDrawColor(200, 230, 200);
      pdf.rect(margin, startY, usableW, ry - startY, "S");
      return ry + 4;
    }

    // Section title helper
    function sTitle(title, sy) {
      if (sy > pageH - 30) {
        pdf.addPage();
        sy = 20;
      }
      pdf.setTextColor(13, 43, 18);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text(title, margin, sy);
      pdf.setDrawColor(86, 196, 100);
      pdf.line(margin, sy + 2, margin + usableW, sy + 2);
      return sy + 8;
    }

    // Collect data from DOM
    function getTblData(tbodyId) {
      const rows = [];
      document.querySelectorAll(`#${tbodyId} tr`).forEach((tr) => {
        rows.push(
          [...tr.querySelectorAll("td")].map((td) =>
            td.innerText.replace(/\n/g, " "),
          ),
        );
      });
      return rows;
    }

    y = sTitle("Fixed Costs Table", y);
    y = addTable(
      [
        "Item",
        "Invest. Cost",
        "Lifespan",
        "Formula Dep/Yr",
        "Dep/Year",
        "Formula Dep/Cycle",
        "Dep/Cycle",
      ],
      getTblData("fixedResultTbody"),
      y,
    );

    y = sTitle("Variable Costs Table", y + 4);
    y = addTable(
      ["Item", "Formula", "Value/Cycle", "Value/Year"],
      getTallData("varResultTbody"),
      y,
    );
    function getTallData(id) {
      return getTblData(id);
    }

    y = sTitle("Total Costs Summary", y + 4);
    y = addTable(
      ["Item", "Formula", "Per Cycle", "Per Year"],
      [
        [
          "Fixed Depreciation",
          "Sum(Cost÷Yrs÷Cycles)",
          document.getElementById("s_fixDep_c").textContent,
          document.getElementById("s_fixDep_y").textContent,
        ],
        [
          "Variable Costs",
          "Sum of all items",
          document.getElementById("s_var_c").textContent,
          document.getElementById("s_var_y").textContent,
        ],
        [
          "Total Costs",
          "Fixed+Variable",
          document.getElementById("s_tot_c").textContent,
          document.getElementById("s_tot_y").textContent,
        ],
      ],
      y,
    );

    y = sTitle("Total Returns Table", y + 4);
    y = addTable(
      ["Item", "Formula / Details", "Per Cycle", "Per Year"],
      getTblData("returnTbody"),
      y,
    );

    y = sTitle(
      "Economic Analysis — Profitability Measures (All Credit Scenarios)",
      y + 4,
    );
    const econRows2 = [];
    document.querySelectorAll("#econTbody tr").forEach((tr) => {
      const cells = [...tr.querySelectorAll("td")].map((td) =>
        td.innerText.replace(/[✓✗]/g, "").trim().substring(0, 20),
      );
      econRows2.push(cells);
    });
    y = addTable(
      ["Indicator", "Formula", "No Credit", "50% Credit", "100% Credit"],
      econRows2,
      y,
    );

    // Footer
    const totalPages = pdf.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      pdf.setPage(p);
      pdf.setFillColor(13, 43, 18);
      pdf.rect(0, pageH - 8, pageW, 8, "F");
      pdf.setTextColor(200, 230, 200);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        "AgriCalc Pro  |  " + cfg.title + "  |  " + projName,
        margin,
        pageH - 3,
      );
      pdf.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - 3, {
        align: "right",
      });
    }

    pdf.save(projName.replace(/\s+/g, "_") + "_Feasibility_Study.pdf");
  } catch (err) {
    alert("PDF export error: " + err.message);
  } finally {
    el.classList.remove("show");
  }
}

// ══════════════════════════════════════════════════════
//  EXPORT POWERPOINT (XML-based PPTX)
// ══════════════════════════════════════════════════════
async function exportPPT() {
  const el = document.getElementById("exportLoading");
  document.getElementById("exportMsg").textContent = "Generating PowerPoint...";
  el.classList.add("show");
  try {
    await new Promise((r) => setTimeout(r, 100));
    const projName =
      document.getElementById("projectName").value || "Livestock Project";
    const animalType = document.getElementById("animalType").value;
    const cfg = ANIMAL_CONFIGS[animalType];
    const CUR = getCur();

    const kv = (id) => document.getElementById(id)?.textContent || "—";

    // Build simple HTML-based presentation that looks like PowerPoint slides
    // Exported as an HTML file the user can open and print/present
    const slides = [
      // Slide 1: Title
      {
        bg: "#0d2b12",
        content: `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#fff;text-align:center;padding:60px">
          <div style="font-size:80px;margin-bottom:20px">${cfg.icon}</div>
          <h1 style="font-size:42px;font-weight:900;margin-bottom:12px;color:#56c464">${cfg.title}</h1>
          <h2 style="font-size:26px;font-weight:300;opacity:0.8;margin-bottom:30px">${projName}</h2>
          <div style="background:rgba(86,196,100,0.2);border:1px solid rgba(86,196,100,0.4);border-radius:30px;padding:10px 30px;font-size:14px;letter-spacing:2px;text-transform:uppercase;color:#a8e6af">
            AgriCalc Pro — Feasibility Study Report
          </div>
          <div style="margin-top:24px;font-size:13px;opacity:0.5">${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
        </div>`,
      },
      // Slide 2: KPIs
      {
        bg: "#f0f7f1",
        content: `
        <div style="padding:40px;height:100%;background:#f0f7f1">
          <h2 style="color:#0d2b12;font-size:28px;margin-bottom:8px;font-weight:800">📊 Key Performance Indicators</h2>
          <div style="width:80px;height:4px;background:#56c464;margin-bottom:30px;border-radius:2px"></div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">
            ${[
              ["Total Cost/Cycle", kv("k_tc_cycle"), CUR, "#0d2b12"],
              ["Total Return/Cycle", kv("k_tr_cycle"), CUR, "#1a5c24"],
              ["Net Profit/Cycle", kv("k_np_cycle"), CUR, "#2e8b3a"],
              ["Total Cost/Year", kv("k_tc_year"), CUR, "#0d2b12"],
              ["Total Return/Year", kv("k_tr_year"), CUR, "#1a5c24"],
              ["Net Profit/Year", kv("k_np_year"), CUR, "#e8b923"],
            ]
              .map(
                ([lbl, val, cur, bg]) => `
              <div style="background:${bg};border-radius:16px;padding:24px;color:#fff;text-align:center">
                <div style="font-size:11px;font-weight:700;opacity:0.7;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">${lbl}</div>
                <div style="font-size:28px;font-weight:900;font-family:monospace">${val}</div>
                <div style="font-size:11px;opacity:0.6;margin-top:4px">${cur}</div>
              </div>`,
              )
              .join("")}
          </div>
        </div>`,
      },
      // Slide 3: Fixed Costs
      {
        bg: "#ffffff",
        content: `
        <div style="padding:40px;height:100%">
          <h2 style="color:#0d2b12;font-size:26px;margin-bottom:6px;font-weight:800">🏗️ Fixed Costs & Depreciation</h2>
          <div style="width:80px;height:4px;background:#56c464;margin-bottom:20px;border-radius:2px"></div>
          <div style="background:#1a1a2e;border-radius:12px;padding:16px;margin-bottom:20px;font-family:monospace;font-size:13px;color:#86efac">
            Dep/year = Investment Cost ÷ Lifespan &nbsp;|&nbsp; Dep/cycle = Dep/year ÷ Cycles
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <thead><tr style="background:#0d2b12;color:#fff">
              <th style="padding:10px;text-align:left">Item</th>
              <th style="padding:10px">Investment</th>
              <th style="padding:10px">Years</th>
              <th style="padding:10px">Dep/Year</th>
              <th style="padding:10px">Dep/Cycle</th>
            </tr></thead>
            <tbody>
              ${fixedItems
                .map((item, i) => {
                  const dY = item.cost / (item.years || 1);
                  const cy =
                    parseFloat(document.getElementById("cycles").value) || 6;
                  const dC = dY / cy;
                  return `<tr style="background:${i % 2 ? "#f5fbf5" : "#fff"}">
                  <td style="padding:9px 10px;font-weight:600">${item.name}</td>
                  <td style="padding:9px;text-align:center;font-family:monospace">${fmt(item.cost)}</td>
                  <td style="padding:9px;text-align:center">${item.years}</td>
                  <td style="padding:9px;text-align:center;font-family:monospace">${fmt(dY)}</td>
                  <td style="padding:9px;text-align:center;font-family:monospace">${fmt(dC)}</td>
                </tr>`;
                })
                .join("")}
            </tbody>
          </table>
        </div>`,
      },
      // Slide 4: Variable Costs
      {
        bg: "#ffffff",
        content: `
        <div style="padding:40px;height:100%">
          <h2 style="color:#0d2b12;font-size:26px;margin-bottom:6px;font-weight:800">📦 Variable Costs per Cycle</h2>
          <div style="width:80px;height:4px;background:#56c464;margin-bottom:20px;border-radius:2px"></div>
          <table style="width:100%;border-collapse:collapse;font-size:12px">
            <thead><tr style="background:#0d2b12;color:#fff">
              <th style="padding:9px;text-align:left">Item</th>
              <th style="padding:9px">Value/Cycle (${CUR})</th>
              <th style="padding:9px">Value/Year (${CUR})</th>
            </tr></thead>
            <tbody>
              ${varItems
                .map(
                  (
                    item,
                    i,
                  ) => `<tr style="background:${i % 2 ? "#f5fbf5" : "#fff"}">
                <td style="padding:8px 10px;font-weight:600">${item.name}</td>
                <td style="padding:8px;text-align:center;font-family:monospace">${fmt(item.valueCycle)}</td>
                <td style="padding:8px;text-align:center;font-family:monospace">${fmt(item.valueCycle * (parseFloat(document.getElementById("cycles").value) || 6))}</td>
              </tr>`,
                )
                .join("")}
            </tbody>
          </table>
        </div>`,
      },
      // Slide 5: Economic Analysis
      {
        bg: "#0d2b12",
        content: `
        <div style="padding:40px;height:100%;color:#fff">
          <h2 style="font-size:26px;margin-bottom:6px;font-weight:800;color:#56c464">📈 Economic Analysis — 3 Credit Scenarios</h2>
          <div style="width:80px;height:4px;background:#56c464;margin-bottom:20px;border-radius:2px"></div>
          <table style="width:100%;border-collapse:collapse;font-size:12px">
            <thead><tr style="background:rgba(86,196,100,0.2)">
              <th style="padding:10px;text-align:left;color:#a8e6af">Indicator</th>
              <th style="padding:10px;color:#a8e6af">No Credit</th>
              <th style="padding:10px;color:#e8b923">50% Credit</th>
              <th style="padding:10px;color:#ef5350">100% Credit</th>
            </tr></thead>
            <tbody>
              ${[...document.querySelectorAll("#econTbody tr")]
                .slice(0, 9)
                .map((tr, i) => {
                  const cells = [...tr.querySelectorAll("td")];
                  if (cells.length < 5) return "";
                  return `<tr style="border-bottom:1px solid rgba(255,255,255,0.08)">
                  <td style="padding:8px;color:#e0e0e0;font-size:11px">${cells[0]?.innerText || ""}</td>
                  <td style="padding:8px;text-align:center;color:#86efac;font-family:monospace;font-weight:700">${cells[2]?.innerText || ""}</td>
                  <td style="padding:8px;text-align:center;color:#fde27a;font-family:monospace;font-weight:700">${cells[3]?.innerText || ""}</td>
                  <td style="padding:8px;text-align:center;color:#ef9a9a;font-family:monospace;font-weight:700">${cells[4]?.innerText || ""}</td>
                </tr>`;
                })
                .join("")}
            </tbody>
          </table>
          <div id="pptVerdictSlide" style="margin-top:24px;padding:16px;border-radius:12px;font-size:16px;font-weight:700;background:rgba(86,196,100,0.15);border:2px solid #56c464;color:#a8e6af">
            ${document.getElementById("verdictDiv")?.innerText || ""}
          </div>
        </div>`,
      },
    ];

    // Build HTML slideshow
    const slideHTML = slides
      .map(
        (s, i) => `
      <div class="slide" id="slide${i}" style="display:${i === 0 ? "flex" : "none"};width:960px;height:540px;background:${s.bg};position:relative;overflow:hidden;font-family:Sora,sans-serif;box-sizing:border-box">
        ${s.content}
      </div>`,
      )
      .join("");

    const fullHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${projName} — AgriCalc Pro Presentation</title>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800;900&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#111;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:Sora,sans-serif}
.presentation{width:960px;position:relative}
.slide{width:960px;height:540px;overflow:hidden;border-radius:8px;box-shadow:0 20px 80px rgba(0,0,0,0.5)}
.controls{display:flex;align-items:center;gap:12px;margin-top:20px;justify-content:center}
.btn-ctrl{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:10px 24px;border-radius:8px;cursor:pointer;font-family:Sora,sans-serif;font-size:14px;font-weight:600;transition:all 0.2s}
.btn-ctrl:hover{background:rgba(86,196,100,0.3)}
.slide-counter{color:rgba(255,255,255,0.6);font-size:13px;min-width:80px;text-align:center}
.slide-dots{display:flex;gap:8px}
.dot-ind{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.2);cursor:pointer;transition:all 0.2s}
.dot-ind.active{background:#56c464;transform:scale(1.3)}
.btn-print-ppt{background:linear-gradient(90deg,#e8b923,#fde27a);border:none;color:#0d2b12;padding:10px 24px;border-radius:8px;cursor:pointer;font-family:Sora,sans-serif;font-size:14px;font-weight:700}
</style></head><body>
<div class="presentation">
  ${slideHTML}
</div>
<div class="controls">
  <button class="btn-ctrl" onclick="prev()">← Prev</button>
  <div class="slide-dots">${slides.map((_, i) => `<div class="dot-ind ${i === 0 ? "active" : ""}" onclick="goSlide(${i})"></div>`).join("")}</div>
  <span class="slide-counter" id="counter">1 / ${slides.length}</span>
  <button class="btn-ctrl" onclick="next()">Next →</button>
  <button class="btn-print-ppt" onclick="window.print()">🖨️ Print Slides</button>
</div>
<script>
let cur=0;const total=${slides.length};
function goSlide(n){
  document.getElementById('slide'+cur).style.display='none';
  document.querySelectorAll('.dot-ind')[cur].classList.remove('active');
  cur=n;
  document.getElementById('slide'+cur).style.display='flex';
  document.querySelectorAll('.dot-ind')[cur].classList.add('active');
  document.getElementById('counter').textContent=(cur+1)+' / '+total;
}
function next(){goSlide((cur+1)%total)}
function prev(){goSlide((cur-1+total)%total)}
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key===' ')next();if(e.key==='ArrowLeft')prev();});
<\/script>
<style>@media print{body{background:#fff}.controls{display:none}${slides.map((_, i) => `#slide${i}{display:flex!important;page-break-after:always}`).join("")}}</style>
</body></html>`;

    const blob = new Blob([fullHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = projName.replace(/\s+/g, "_") + "_Presentation.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    alert("Export error: " + err.message);
  } finally {
    document.getElementById("exportLoading").classList.remove("show");
  }
}

// ══════════════════════════════════════════════════════
//  RESET
// ══════════════════════════════════════════════════════
function resetAll() {
  document.getElementById("resultsWrap").style.display = "none";
  document.getElementById("noResults").style.display = "block";
  goSection("s1", 0);
}

// ══════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════
function init() {
  updateAnimalType();
}
init();
