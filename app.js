/* =====================================================================
   VectorFlow — Day Wise Coverage
   ===================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Config
     ------------------------------------------------------------------ */

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const COLUMNS = [
    { key: "orderType",    label: "Order\nType",       width: 96,  align: "center" },
    { key: "releaseDate",  label: "Release\nDate",     width: 104, align: "center" },
    { key: "group",        label: "Group",             width: 150, align: "group",  filter: false },
    { key: "priority",     label: "Color\nPriority",   width: 92,  align: "center" },
    { key: "orderNumber",  label: "Order\nNumber",     width: 98,  align: "center" },
    { key: "receiveDate",  label: "Order Receive\nDate", width: 112, align: "center" },
    { key: "dueDate",      label: "Order Due\nDate",   width: 104, align: "center" },
    { key: "quantity",     label: "Order\nQuantity",   width: 96,  align: "center" },
    { key: "customerName", label: "Customer\nName",    width: 112, align: "center" },
    { key: "customerCode", label: "Customer\nCode",    width: 104, align: "center" },
    { key: "itemCode",     label: "Item\nCode",        width: 118, align: "center" },
    { key: "itemDescp",    label: "Item Descp",        width: 150, align: "center" }
  ];

  const RM_COLUMNS = [
    { key: "missingQty", label: "Missing RM Qty" },
    { key: "rmCode",     label: "RM Code" },
    { key: "rmDescp",    label: "RM Descp" },
    { key: "reqQty",     label: "RM ReqQty" },
    { key: "available",  label: "RM Availble" },
    { key: "allocated",  label: "RM Allocated" }
  ];

  const MONTHS_FULL = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  /* Week starts Monday */
  const DOW = ["M", "T", "W", "T", "F", "S", "S"];

  /* Coverage buckets, low → high. Fills live in styles.css as --cov-1..5;
     the ramp's lightness is monotone so the order survives colour blindness. */
  const BUCKETS = [
    { max: 20,  cls: "b1", label: "0–20" },
    { max: 40,  cls: "b2", label: "21–40" },
    { max: 60,  cls: "b3", label: "41–60" },
    { max: 80,  cls: "b4", label: "61–80" },
    { max: 100, cls: "b5", label: "81–100" }
  ];

  /* A day counts as "green" in the month header summary from here up */
  const GREEN_AT = 61;

  /* The window is 1–3 months wide; 3 is both the default and the hard cap */
  const MONTHS_SHOWN = 3;
  const MAX_MONTHS = 3;

  /* ------------------------------------------------------------------
     Data
     ------------------------------------------------------------------ */

  const GROUPS = [
    {
      id: "no-kit",
      title: "No Kit Orders",
      open: true,
      rows: [
        {
          id: "r1", orderType: "Regular", releaseDate: "23-Jul-13",
          priority: "Black", orderNumber: "BMN1231", receiveDate: "23-Jul-13", dueDate: "23-Jul-13",
          quantity: 66, customerName: "Pareek Amit", customerCode: "5466788",
          itemCode: "AREB5092381", itemDescp: "SB2-NOTCH-KOTH-ABC-11", expanded: true,
          rm: [
            { missingQty: 33, rmCode: "AREB5092381", rmDescp: "SB2-NOTCH-KOTH-ABC-11", reqQty: 33, available: 0, allocated: 0 },
            { missingQty: 66, rmCode: "AREB5092382", rmDescp: "SB2-NOTCH-KOTH-ABC-11", reqQty: 66, available: 0, allocated: 0 }
          ]
        },
        {
          id: "r2", orderType: "Export", releaseDate: "26-Jul-13",
          priority: "Black", orderNumber: "BMN1244", receiveDate: "24-Jul-13", dueDate: "02-Aug-13",
          quantity: 120, customerName: "Sharma Ravi", customerCode: "5466792",
          itemCode: "AREB5092390", itemDescp: "SB2-NOTCH-KOTH-ABC-14", expanded: false,
          rm: [
            { missingQty: 48, rmCode: "AREB5092390", rmDescp: "SB2-NOTCH-KOTH-ABC-14", reqQty: 120, available: 72, allocated: 72 }
          ]
        },
        {
          id: "r3", orderType: "Regular", releaseDate: "29-Jul-13",
          priority: "Red", orderNumber: "BMN1258", receiveDate: "26-Jul-13", dueDate: "09-Aug-13",
          quantity: 45, customerName: "Iyer Meena", customerCode: "5466801",
          itemCode: "AREB5092404", itemDescp: "SB2-NOTCH-KOTH-ABC-21", expanded: false,
          rm: [
            { missingQty: 45, rmCode: "AREB5092404", rmDescp: "SB2-NOTCH-KOTH-ABC-21", reqQty: 45, available: 0, allocated: 0 }
          ]
        }
      ],
      count: 11
    },
    {
      id: "partial-kit",
      title: "Partial Kit Orders",
      open: false,
      rows: [
        {
          id: "r4", orderType: "Urgent", releaseDate: "31-Jul-13",
          priority: "Red", orderNumber: "BMN1302", receiveDate: "28-Jul-13", dueDate: "12-Aug-13",
          quantity: 88, customerName: "Deshmukh Kiran", customerCode: "5466814",
          itemCode: "AREB5092419", itemDescp: "SB2-NOTCH-KOTH-ABC-32", expanded: false,
          rm: [
            { missingQty: 22, rmCode: "AREB5092419", rmDescp: "SB2-NOTCH-KOTH-ABC-32", reqQty: 88, available: 66, allocated: 66 }
          ]
        },
        {
          id: "r5", orderType: "Export", releaseDate: "02-Aug-13",
          priority: "Yellow", orderNumber: "BMN1315", receiveDate: "30-Jul-13", dueDate: "18-Aug-13",
          quantity: 210, customerName: "Nair Anjali", customerCode: "5466827",
          itemCode: "AREB5092428", itemDescp: "SB2-NOTCH-KOTH-ABC-45", expanded: false,
          rm: [
            { missingQty: 30, rmCode: "AREB5092428", rmDescp: "SB2-NOTCH-KOTH-ABC-45", reqQty: 210, available: 180, allocated: 180 },
            { missingQty: 15, rmCode: "AREB5092429", rmDescp: "SB2-NOTCH-KOTH-ABD-46", reqQty: 105, available: 90, allocated: 90 }
          ]
        }
      ],
      count: 45
    },
    { id: "full-kit", title: "Full Kit Orders", open: false, rows: [], count: 0 }
  ];

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */

  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
  }

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  /* Monday-first column index for a JS day-of-week (0 = Sunday) */
  const dowIndex = (jsDay) => (jsDay + 6) % 7;

  /* Stable pseudo-random so the calendar looks the same on every reload.
     Swap dayCoverage() for the real feed when the API lands — everything
     downstream only reads { orders, fullKit, coverage }. */
  function hash32(n) {
    let h = n >>> 0;
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^ (h >>> 16)) >>> 0;
  }

  function dayCoverage(year, month, day) {
    const dow = new Date(year, month, day).getDay();
    /* Sat and Sun both run, on a lighter order book than the working week */
    const weekend = dow === 0 || dow === 6;

    const h = hash32(year * 10000 + (month + 1) * 100 + day);
    const orders = (weekend ? 3 : 9) + (h % (weekend ? 9 : 24));
    /* Best of two draws — skews coverage high, so shortfall days stand out
       against a mostly-covered month instead of the whole grid running warm */
    const pct = Math.max((h >>> 8) % 101, (h >>> 18) % 101);
    const fullKit = Math.round((orders * pct) / 100);

    /* Whatever isn't full kit splits between partial and no kit */
    const short = orders - fullKit;
    const partialKit = Math.round((short * (60 + ((h >>> 24) % 36))) / 100);

    return {
      orders: orders,
      fullKit: fullKit,
      partialKit: partialKit,
      noKit: short - partialKit,
      coverage: Math.round((fullKit / orders) * 100)
    };
  }

  /* Two-digit readout for the hover card — matches "07" in the spec */
  const pad2 = (n) => (n < 10 ? "0" + n : String(n));

  const bucketFor = (coverage) => BUCKETS.find((b) => coverage <= b.max) || BUCKETS[BUCKETS.length - 1];

  /* ==================================================================
     1. Sidebar — open / close
     ================================================================== */

  const sidenav = $("#sidenav");
  const navToggle = $("#navToggle");

  function setNavCollapsed(collapsed) {
    sidenav.classList.toggle("is-collapsed", collapsed);
    navToggle.setAttribute("aria-expanded", String(!collapsed));
    navToggle.setAttribute("aria-label", collapsed ? "Expand navigation" : "Collapse navigation");
    try { localStorage.setItem("dwc.navCollapsed", collapsed ? "1" : "0"); } catch (e) {}
    /* Calendar / table widths are percentage-based; nudge them after the transition */
    window.setTimeout(() => window.dispatchEvent(new Event("resize")), 280);
  }

  navToggle.addEventListener("click", () => {
    setNavCollapsed(!sidenav.classList.contains("is-collapsed"));
  });

  try {
    if (localStorage.getItem("dwc.navCollapsed") === "1") setNavCollapsed(true);
  } catch (e) {}

  /* Tree accordions ------------------------------------------------- */

  $$("[data-tree-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const open = btn.classList.toggle("is-open");
      const panel = btn.nextElementSibling;
      if (panel && panel.classList.contains("tree__children")) {
        panel.classList.toggle("is-hidden", !open);
      }
    });
  });

  /* Tree selection -------------------------------------------------- */

  $$(".tree__item").forEach((item) => {
    item.addEventListener("click", () => {
      $$(".tree__item").forEach((other) => {
        other.classList.remove("is-active");
        other.removeAttribute("aria-current");
      });
      item.classList.add("is-active");
      item.setAttribute("aria-current", "page");
      const label = $("span", item);
      if (label) $(".breadcrumb__item--current").textContent = label.textContent.trim();
    });
  });

  /* Rail selection -------------------------------------------------- */

  $$(".rail__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".rail__btn").forEach((other) => {
        other.classList.remove("is-active");
        other.removeAttribute("aria-current");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-current", "page");
    });
  });

  /* ==================================================================
     2. Calendar — three months, tinted by kit coverage
     ================================================================== */

  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const calRoot   = $(".cal");
  const calMonths = $("#calMonths");
  const calRange  = $("#calRange");
  const scaleRamp = $("#scaleRamp");
  const daytip    = $("#daytip");
  const calValues = $("#calValues");
  const calPrev   = $("#calPrev");
  const calNext   = $("#calNext");
  const calToday  = $("#calToday");

  const today = new Date();
  const THIS_MONTH = new Date(today.getFullYear(), today.getMonth(), 1);

  /* Sortable YYYYMMDD key — days past today are out of scope and render greyed */
  const dayKey = (year, month, day) => year * 10000 + month * 100 + day;
  const TODAY_KEY = dayKey(today.getFullYear(), today.getMonth(), today.getDate());
  const isFuture = (year, month, day) => dayKey(year, month, day) > TODAY_KEY;

  /* Absolute month index — makes "is this within 3 months of that?" one subtraction */
  const absMonth = (year, month) => year * 12 + month;
  const THIS_ABS = absMonth(THIS_MONTH.getFullYear(), THIS_MONTH.getMonth());

  /* The window's last (right-most) month; the months before it fill in behind */
  let anchor = new Date(THIS_MONTH);
  let monthSpan = MONTHS_SHOWN;
  let selectedDay = null;

  const sameDay = (a, y, m, d) => a && a.year === y && a.month === m && a.day === d;

  /* Legend ----------------------------------------------------------- */

  (function renderScale() {
    BUCKETS.forEach((bucket, i) => {
      const step = el("div", "scale__step");
      const swatch = el("i", "scale__swatch");
      swatch.style.background = "var(--cov-" + (i + 1) + ")";
      swatch.style.setProperty("--ring", "var(--cov-" + (i + 1) + "-ring)");
      step.appendChild(swatch);
      step.appendChild(el("span", "scale__label", bucket.label + (i === BUCKETS.length - 1 ? "%" : "")));
      scaleRamp.appendChild(step);
    });
  })();

  /* Tooltip ---------------------------------------------------------- */

  function buildTip(cell) {
    const year  = Number(cell.dataset.year);
    const month = Number(cell.dataset.month);
    const day   = Number(cell.dataset.day);
    const data  = dayCoverage(year, month, day);

    daytip.textContent = "";
    daytip.className = "daytip";
    daytip.appendChild(el("div", "daytip__title", "Details"));

    if (!data.orders) {
      daytip.appendChild(el("p", "daytip__empty", "No orders due."));
      return;
    }

    [["No Of Orders", data.orders],
     ["Full Kit", data.fullKit],
     ["Partial Kit", data.partialKit],
     ["No Kit", data.noKit]].forEach((pair) => {
      const row = el("div", "daytip__row");
      row.appendChild(el("span", null, pair[0]));
      row.appendChild(el("b", null, pad2(pair[1])));
      daytip.appendChild(row);
    });
  }

  function showTip(cell) {
    buildTip(cell);
    daytip.hidden = false;

    const body = daytip.offsetParent || calRoot;
    const area = body.getBoundingClientRect();
    const box  = cell.getBoundingClientRect();

    const center = box.left - area.left + box.width / 2;
    let left = center - daytip.offsetWidth / 2;
    left = Math.max(4, Math.min(left, area.width - daytip.offsetWidth - 4));

    /* Prefer above the cell; drop below when it would clip the card top */
    const above = box.top - area.top - daytip.offsetHeight - 9;
    const below = above < 0;
    const top = below ? box.bottom - area.top + 9 : above;

    daytip.classList.toggle("daytip--below", below);
    /* Keep the pointer on the cell even when the card is clamped to an edge */
    daytip.style.setProperty("--arrow-x", (center - left) + "px");
    daytip.style.left = left + "px";
    daytip.style.top = top + "px";
  }

  function hideTip() { daytip.hidden = true; }

  /* Month grids ------------------------------------------------------ */

  function buildMonth(year, month) {
    const card = el("article", "mon");
    if (year === THIS_MONTH.getFullYear() && month === THIS_MONTH.getMonth()) {
      card.classList.add("is-current");
    }

    const head = el("header", "mon__head");
    head.appendChild(el("h3", "mon__name", MONTHS_FULL[month]));
    head.appendChild(el("span", "mon__year", String(year)));
    const avg = el("span", "mon__avg");
    head.appendChild(avg);
    card.appendChild(head);

    const dow = el("div", "mon__dow");
    dow.setAttribute("aria-hidden", "true");
    DOW.forEach((letter) => dow.appendChild(el("span", null, letter)));
    card.appendChild(dow);

    const grid = el("div", "mon__grid");
    const total = daysInMonth(year, month);
    const lead = dowIndex(new Date(year, month, 1).getDay());

    for (let i = 0; i < lead; i++) {
      const pad = el("div", "mon__pad");
      pad.setAttribute("aria-hidden", "true");
      grid.appendChild(pad);
    }

    let green = 0;
    let red = 0;

    for (let d = 1; d <= total; d++) {
      const data = dayCoverage(year, month, d);
      const cell = el("button", "day");
      cell.type = "button";
      cell.dataset.year = String(year);
      cell.dataset.month = String(month);
      cell.dataset.day = String(d);

      cell.appendChild(el("span", "day__n", String(d)));

      if (isFuture(year, month, d)) {
        /* Beyond today: no coverage to report yet, so the cell is inert */
        cell.classList.add("day--future");
        cell.disabled = true;
        cell.setAttribute("aria-label", d + " " + MONTHS[month] + " " + year + " — upcoming, no coverage yet");
        grid.appendChild(cell);
        continue;
      }

      if (!data.orders) {
        cell.classList.add("day--none");
        cell.setAttribute("aria-label", d + " " + MONTHS[month] + " " + year + " — no orders due");
      } else {
        const bucket = bucketFor(data.coverage);
        cell.classList.add("day--" + bucket.cls);
        cell.appendChild(el("span", "day__v", data.coverage + "%"));
        cell.setAttribute("aria-label",
          d + " " + MONTHS[month] + " " + year + " — " + data.coverage + "% kit coverage, " +
          data.fullKit + " of " + data.orders + " orders full kit");

        if (data.coverage >= GREEN_AT) green++; else red++;
      }

      if (year === today.getFullYear() && month === today.getMonth() && d === today.getDate()) {
        cell.classList.add("is-today");
      }
      if (sameDay(selectedDay, year, month, d)) {
        cell.classList.add("is-selected");
        cell.setAttribute("aria-pressed", "true");
      }

      grid.appendChild(cell);
    }

    card.appendChild(grid);

    const rated = green + red;
    avg.textContent = rated ? Math.round((green / rated) * 100) + "% green days" : "—";
    avg.title = green + " of " + rated + " days at " + GREEN_AT + "% coverage or better";

    return { node: card, green: green, red: red, month: month, year: year };
  }

  function renderCalendar() {
    hideTip();
    calMonths.textContent = "";
    /* Column count follows the span so a 1- or 2-month window doesn't stretch */
    calMonths.dataset.cols = String(monthSpan);

    const stats = [];
    for (let i = monthSpan - 1; i >= 0; i--) {
      const cursor = new Date(anchor.getFullYear(), anchor.getMonth() - i, 1);
      const built = buildMonth(cursor.getFullYear(), cursor.getMonth());
      calMonths.appendChild(built.node);
      stats.push(built);
    }

    const first = stats[0];
    const last = stats[stats.length - 1];
    calRange.textContent = first.year === last.year && first.month === last.month
      ? MONTHS[first.month] + " " + first.year
      : first.year === last.year
        ? MONTHS[first.month] + " – " + MONTHS[last.month] + " " + last.year
        : MONTHS[first.month] + " " + first.year + " – " + MONTHS[last.month] + " " + last.year;

    const atToday = anchor.getFullYear() === THIS_MONTH.getFullYear() &&
                    anchor.getMonth() === THIS_MONTH.getMonth();
    calNext.disabled = atToday;
    calToday.disabled = atToday && monthSpan === MONTHS_SHOWN;

    renderMonthPick();
  }

  /* Events ----------------------------------------------------------- */

  /* The picked day drives the orders table below; null means "nothing picked",
     which is what puts that card in its empty state. */
  function selectDay(day) {
    selectedDay = day;

    $$(".day.is-selected").forEach((other) => {
      other.classList.remove("is-selected");
      other.removeAttribute("aria-pressed");
    });

    if (day) {
      const cell = $('.day[data-year="' + day.year + '"][data-month="' + day.month +
        '"][data-day="' + day.day + '"]');
      if (cell) {
        cell.classList.add("is-selected");
        cell.setAttribute("aria-pressed", "true");
      }
    }

    syncOrders();
  }

  calMonths.addEventListener("click", (event) => {
    const cell = event.target.closest(".day");
    if (!cell || cell.classList.contains("day--none") || cell.classList.contains("day--future")) return;

    selectDay({
      year: Number(cell.dataset.year),
      month: Number(cell.dataset.month),
      day: Number(cell.dataset.day)
    });
  });

  const tippable = (cell) => cell && !cell.classList.contains("day--future");

  calMonths.addEventListener("pointerover", (event) => {
    const cell = event.target.closest(".day");
    if (tippable(cell)) showTip(cell);
  });

  calMonths.addEventListener("pointerout", (event) => {
    const cell = event.target.closest(".day");
    if (cell && !cell.contains(event.relatedTarget)) hideTip();
  });

  /* Keyboard gets the same readout as the pointer */
  calMonths.addEventListener("focusin", (event) => {
    const cell = event.target.closest(".day");
    if (tippable(cell)) showTip(cell);
  });
  calMonths.addEventListener("focusout", hideTip);

  function shift(months) {
    anchor = new Date(anchor.getFullYear(), anchor.getMonth() + months, 1);
    if (anchor > THIS_MONTH) anchor = new Date(THIS_MONTH);
    renderCalendar();
  }

  calPrev.addEventListener("click", () => shift(-1));
  calNext.addEventListener("click", () => shift(1));

  /* "Today" is the way back to the default view: this month, full 3-month span */
  calToday.addEventListener("click", () => {
    anchor = new Date(THIS_MONTH);
    monthSpan = MONTHS_SHOWN;
    renderCalendar();
  });

  calValues.addEventListener("change", () => {
    calRoot.classList.toggle("is-values", calValues.checked);
  });

  window.addEventListener("scroll", hideTip, true);

  /* ==================================================================
     3. Month picker — choose the window outright, 1 to 3 months
     ================================================================== */

  const monthPick      = $("#monthPick");
  const monthPickBtn   = $("#monthPickBtn");
  const monthPickPanel = $("#monthPickPanel");
  const monthPickGrid  = $("#monthPickGrid");
  const monthPickText  = $("#monthPickText");
  const monthPickYear  = $("#monthPickYear");
  const monthPickPrev  = $("#monthPickPrev");
  const monthPickNext  = $("#monthPickNext");
  const monthPickHint  = $("#monthPickHint");

  /* Year on show in the grid, and the first month of a range mid-pick */
  let pickYear = anchor.getFullYear();
  let pickStart = null;

  const windowEnd = () => absMonth(anchor.getFullYear(), anchor.getMonth());

  function setWindow(endAbs, span) {
    monthSpan = Math.max(1, Math.min(MAX_MONTHS, span));
    anchor = new Date(Math.floor(endAbs / 12), endAbs % 12, 1);
    renderCalendar();
  }

  /* Called from renderCalendar, so the label and grid never drift from the view */
  function renderMonthPick() {
    monthPickText.textContent = calRange.textContent;
    if (monthPickPanel.hidden) return;

    const endAbs = windowEnd();
    const startAbs = endAbs - (monthSpan - 1);

    monthPickYear.textContent = String(pickYear);
    monthPickNext.disabled = pickYear >= THIS_MONTH.getFullYear();

    monthPickGrid.textContent = "";
    MONTHS.forEach((name, m) => {
      const abs = absMonth(pickYear, m);
      const btn = el("button", "mpick", name);
      btn.type = "button";
      btn.dataset.abs = String(abs);

      if (abs > THIS_ABS) {
        /* Same rule as the day cells: nothing past the current month */
        btn.disabled = true;
        btn.title = "Upcoming — no coverage yet";
      } else if (abs >= startAbs && abs <= endAbs) {
        btn.classList.add("is-in");
        if (abs === startAbs) btn.classList.add("is-first");
        if (abs === endAbs) btn.classList.add("is-last");
        btn.setAttribute("aria-pressed", "true");
      }
      if (pickStart !== null && abs === pickStart) btn.classList.add("is-anchor");

      monthPickGrid.appendChild(btn);
    });

    monthPickHint.textContent = pickStart === null
      ? "Pick a month, then a second one to widen — " + MAX_MONTHS + " months max."
      : "Pick the other end within " + MAX_MONTHS + " months, or keep this single month.";
  }

  function setMonthPickOpen(open) {
    monthPickPanel.hidden = !open;
    monthPickBtn.setAttribute("aria-expanded", String(open));
    if (open) {
      pickStart = null;
      pickYear = anchor.getFullYear();
    }
    renderMonthPick();
  }

  monthPickGrid.addEventListener("click", (event) => {
    const btn = event.target.closest(".mpick");
    if (!btn || btn.disabled) return;
    const abs = Number(btn.dataset.abs);

    /* First click narrows to that one month and applies straight away; a second
       click within the cap widens the window. Anything further afield is read
       as the start of a fresh range rather than a mis-click to be rejected. */
    if (pickStart === null || Math.abs(abs - pickStart) > MAX_MONTHS - 1) {
      pickStart = abs;
      setWindow(abs, 1);
      return;
    }

    const lo = Math.min(pickStart, abs);
    const hi = Math.max(pickStart, abs);
    pickStart = null;
    setWindow(hi, hi - lo + 1);
    setMonthPickOpen(false);
    monthPickBtn.focus();
  });

  monthPickBtn.addEventListener("click", () => setMonthPickOpen(monthPickPanel.hidden));

  monthPickPrev.addEventListener("click", () => { pickYear--; renderMonthPick(); });
  monthPickNext.addEventListener("click", () => {
    if (pickYear < THIS_MONTH.getFullYear()) { pickYear++; renderMonthPick(); }
  });

  /* mousedown, not click: picking a month rebuilds the grid, so by the time a
     click reaches the document its target is detached and would read as
     "outside" — closing the panel mid-pick. */
  document.addEventListener("mousedown", (event) => {
    if (monthPickPanel.hidden) return;
    if (monthPick.contains(event.target)) return;
    setMonthPickOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !monthPickPanel.hidden) {
      setMonthPickOpen(false);
      monthPickBtn.focus();
    }
  });

  renderCalendar();
  /* ==================================================================
     4. Orders table
     ================================================================== */

  const ordersCard  = $("#orders");
  const ordersDate  = $("#ordersDate");
  const ordersClear = $("#ordersClear");

  const table    = $("#ordersTable");
  const headRow  = $("#ordersHead");
  const filterRow = $("#ordersFilters");
  const bodyEl   = $("#ordersBody");

  const hiddenCols = new Set();
  const filters = {};

  const visibleColumns = () => COLUMNS.filter((col) => !hiddenCols.has(col.key));

  function syncTemplate() {
    const cols = visibleColumns();
    const total = cols.reduce((sum, col) => sum + col.width, 0);
    /* Last column stretches so a narrow table never leaves a dead gap on the right */
    const tpl = cols.map((col, i) =>
      i === cols.length - 1 ? "minmax(" + col.width + "px, 1fr)" : col.width + "px"
    ).join(" ");
    table.style.setProperty("--tpl", tpl);
    table.style.setProperty("--table-w", total + "px");
  }

  function renderHead() {
    headRow.textContent = "";
    filterRow.textContent = "";

    visibleColumns().forEach((col) => {
      const cell = el("div", "ohead" + (col.align === "center" || col.align === "group" ? " ohead--center" : ""));
      col.label.split("\n").forEach((line, i) => {
        if (i) cell.appendChild(document.createElement("br"));
        cell.appendChild(document.createTextNode(line));
      });
      headRow.appendChild(cell);

      const wrap = el("div", "ofilter");
      if (col.filter !== false) {
        const input = document.createElement("input");
        input.type = "text";
        input.setAttribute("aria-label", "Filter " + col.label.replace(/\n/g, " "));
        input.value = filters[col.key] || "";
        input.addEventListener("input", () => {
          filters[col.key] = input.value.trim().toLowerCase();
          renderBody();
        });
        wrap.appendChild(input);
      }
      filterRow.appendChild(wrap);
    });
  }

  function rowMatches(row) {
    return Object.keys(filters).every((key) => {
      const needle = filters[key];
      if (!needle) return true;
      return String(row[key] == null ? "" : row[key]).toLowerCase().indexOf(needle) > -1;
    });
  }

  function buildRmPanel(row) {
    const panel = el("div", "rmpanel");
    panel.appendChild(el("h3", "rmpanel__title", "Raw Material Details"));

    if (!row.rm || !row.rm.length) {
      panel.appendChild(el("p", "rmempty", "No raw material shortage recorded for this order."));
      return panel;
    }

    const tableEl = el("table", "rmtable");
    const thead = el("thead");
    const headTr = el("tr");
    RM_COLUMNS.forEach((col) => {
      const th = el("th", null, col.label);
      th.scope = "col";
      headTr.appendChild(th);
    });
    thead.appendChild(headTr);
    tableEl.appendChild(thead);

    const tbody = el("tbody");
    row.rm.forEach((item) => {
      const tr = el("tr");
      RM_COLUMNS.forEach((col) => {
        const td = el("td");
        if (col.key === "missingQty") {
          const badge = el("span", "qtybadge" + (Number(item.missingQty) === 0 ? " qtybadge--ok" : ""), String(item.missingQty));
          td.appendChild(badge);
        } else {
          td.textContent = String(item[col.key]);
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    tableEl.appendChild(tbody);
    panel.appendChild(tableEl);
    return panel;
  }

  function buildDataRow(row) {
    const rowEl = el("div", "orow orow--data" + (row.expanded ? " is-expanded" : ""));

    visibleColumns().forEach((col) => {
      const cell = el("div", "ocell" + (col.align === "center" ? " ocell--center" : col.align === "group" ? " ocell--group" : ""));

      if (col.key === "group") {
        const btn = el("button", "expander");
        btn.type = "button";
        btn.setAttribute("aria-expanded", String(!!row.expanded));
        btn.setAttribute("aria-label", (row.expanded ? "Collapse" : "Expand") + " raw material details for " + row.orderNumber);
        btn.innerHTML = row.expanded
          ? '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M8 12h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
        btn.addEventListener("click", () => {
          row.expanded = !row.expanded;
          renderBody();
        });
        cell.appendChild(btn);
      } else if (col.key === "priority") {
        cell.appendChild(el("span", "priority priority--" + String(row.priority).toLowerCase(), row.priority));
      } else {
        cell.textContent = String(row[col.key] == null ? "" : row[col.key]);
        cell.title = cell.textContent;
      }

      rowEl.appendChild(cell);
    });

    if (row.expanded) rowEl.appendChild(buildRmPanel(row));
    return rowEl;
  }

  function renderBody() {
    bodyEl.textContent = "";
    if (!selectedDay) return;

    GROUPS.forEach((group) => {
      const btn = el("button", "ogroup" + (group.open ? " is-open" : ""));
      btn.type = "button";
      btn.setAttribute("aria-expanded", String(!!group.open));

      const caret = el("span", "ogroup__caret");
      caret.setAttribute("aria-hidden", "true");
      caret.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M6 9.5l6 6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

      const title = el("span", "ogroup__title", group.title + " ");
      title.appendChild(el("span", "ogroup__count", "(" + group.count + ")"));

      /* Caret sits after the label for collapsed groups in the original layout;
         keeping it leading everywhere reads cleaner and stays aligned. */
      btn.appendChild(title);
      btn.appendChild(caret);

      btn.addEventListener("click", () => {
        group.open = !group.open;
        renderBody();
      });

      bodyEl.appendChild(btn);

      if (!group.open) return;

      const panel = el("div", "ogroup__panel");
      const rows = group.rows.filter(rowMatches);

      if (!rows.length) {
        const empty = el("div", "ocell", group.rows.length ? "No orders match the current column filters." : "No orders in this group.");
        empty.style.color = "var(--text-3)";
        empty.style.paddingLeft = "14px";
        panel.appendChild(empty);
      } else {
        rows.forEach((row) => panel.appendChild(buildDataRow(row)));
      }

      bodyEl.appendChild(panel);
    });
  }

  /* Empty state ------------------------------------------------------ */

  /* No day picked → the card shows the prompt instead of the grid. Rows are
     only built for a picked day, so the real feed can be fetched here. */
  function syncOrders() {
    const day = selectedDay;

    ordersCard.classList.toggle("is-empty", !day);
    ordersClear.hidden = !day;

    ordersDate.textContent = day
      ? "Orders due — " + DAY_NAMES[new Date(day.year, day.month, day.day).getDay()] +
        ", " + day.day + " " + MONTHS[day.month] + " " + day.year
      : "No date selected";

    renderBody();
  }

  ordersClear.addEventListener("click", () => selectDay(null));

  /* Columns panel ---------------------------------------------------- */

  const columnsTab   = $("#columnsTab");
  const columnsPanel = $("#columnsPanel");
  const columnsList  = $("#columnsList");

  function renderColumnsList() {
    columnsList.textContent = "";
    COLUMNS.forEach((col) => {
      const label = el("label", "colopt");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = !hiddenCols.has(col.key);
      input.disabled = col.key === "group";
      input.addEventListener("change", () => {
        if (input.checked) hiddenCols.delete(col.key);
        else hiddenCols.add(col.key);
        syncTemplate();
        renderHead();
        renderBody();
      });
      label.appendChild(input);
      label.appendChild(document.createTextNode(col.label.replace(/\n/g, " ")));
      columnsList.appendChild(label);
    });
  }

  function setColumnsOpen(open) {
    columnsPanel.hidden = !open;
    columnsTab.setAttribute("aria-expanded", String(open));
  }

  columnsTab.addEventListener("click", () => setColumnsOpen(columnsPanel.hidden));
  $("#columnsClose").addEventListener("click", () => setColumnsOpen(false));

  document.addEventListener("click", (event) => {
    if (columnsPanel.hidden) return;
    if (columnsPanel.contains(event.target) || columnsTab.contains(event.target)) return;
    setColumnsOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !columnsPanel.hidden) setColumnsOpen(false);
  });

  /* Chips ------------------------------------------------------------ */

  $("#chipset").addEventListener("click", (event) => {
    const btn = event.target.closest(".chip__x");
    if (!btn) return;
    const chip = btn.closest(".chip");
    const values = $$(".chip__val", chip);
    if (values.length > 1) {
      /* Multi-value chip: drop just this value and its separator */
      const index = $$(".chip__x", chip).indexOf(btn);
      const value = values[index];
      const pipe = value.previousElementSibling && value.previousElementSibling.classList.contains("chip__pipe")
        ? value.previousElementSibling
        : btn.nextElementSibling && btn.nextElementSibling.classList.contains("chip__pipe")
          ? btn.nextElementSibling
          : null;
      if (pipe) pipe.remove();
      value.remove();
      btn.remove();
    } else {
      chip.remove();
    }
  });

  $("#matReq").addEventListener("click", (event) => event.preventDefault());

  /* Boot ------------------------------------------------------------- */

  syncTemplate();
  renderHead();
  renderColumnsList();
  syncOrders();
})();
