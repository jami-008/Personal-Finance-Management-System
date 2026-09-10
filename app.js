/* =========================================================
   PERSONAL FINANCE MANAGER
   app.js

   Features:
   - Month-wise LocalStorage
   - Daily Expense CRUD
   - Main Cost CRUD
   - Debt / Loan CRUD
   - Income CRUD
   - Search / Filters
   - Monthly Analytics
   - Responsive navigation
   - JSON Backup / Restore
   - Monthly PDF export
   - Reset month / Reset all
   - Custom category
========================================================= */

(() => {
  "use strict";

  /* =========================================================
     CONFIG
  ========================================================= */

  const STORAGE_KEY = "personalFinanceManager_v2";
  const STORAGE_VERSION = 2;

  const DEFAULT_DAILY_CATEGORIES = [
    "Food",
    "Transport",
    "Shopping",
    "Medicine/Health",
    "Entertainment",
    "Education",
    "Personal",
    "Mobile/Recharge",
    "Other"
  ];

  const PAGE_TITLES = {
    dashboard: "Dashboard",
    daily: "Daily Expense",
    "main-cost": "Main Cost",
    debt: "Debt / Loan",
    income: "Income",
    analytics: "Analytics",
    report: "Report & Backup"
  };


  /* =========================================================
     DOM HELPERS
  ========================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


  /* =========================================================
     DOM REFERENCES
  ========================================================= */

  const dom = {
    pageTitle: $("#pageTitle"),

    monthPicker: $("#monthPicker"),
    previousMonthBtn: $("#previousMonthBtn"),
    nextMonthBtn: $("#nextMonthBtn"),

    topQuickAddBtn: $("#topQuickAddBtn"),
    mobileQuickAddBtn: $("#mobileQuickAddBtn"),

    mobileMoreBtn: $("#mobileMoreBtn"),
    mobileMoreMenu: $("#mobileMoreMenu"),
    closeMobileMoreBtn: $("#closeMobileMoreBtn"),

    dashboardMonthTitle: $("#dashboardMonthTitle"),
    dashboardPdfBtn: $("#dashboardPdfBtn"),

    summaryTotalExpense: $("#summaryTotalExpense"),
    summaryDailyExpense: $("#summaryDailyExpense"),
    summaryMainCost: $("#summaryMainCost"),
    summaryAverageDaily: $("#summaryAverageDaily"),
    summaryIncome: $("#summaryIncome"),
    summaryReceivable: $("#summaryReceivable"),
    summaryPayable: $("#summaryPayable"),

    dailyChartTotalBadge: $("#dailyChartTotalBadge"),
    dashboardDailyChart: $("#dashboardDailyChart"),

    highestSpendDay: $("#highestSpendDay"),
    highestSpendAmount: $("#highestSpendAmount"),
    topDailyCategory: $("#topDailyCategory"),
    totalTransactionCount: $("#totalTransactionCount"),

    dashboardRecentTransactions: $("#dashboardRecentTransactions"),
    dashboardRecentEmpty: $("#dashboardRecentEmpty"),

    openDailyExpenseModalBtn: $("#openDailyExpenseModalBtn"),
    dailyPageTotal: $("#dailyPageTotal"),
    dailyPageCount: $("#dailyPageCount"),
    dailyPageTopCategory: $("#dailyPageTopCategory"),

    dailySearchInput: $("#dailySearchInput"),
    dailyCategoryFilter: $("#dailyCategoryFilter"),
    dailyDateFilter: $("#dailyDateFilter"),
    clearDailyFiltersBtn: $("#clearDailyFiltersBtn"),

    dailyExpenseList: $("#dailyExpenseList"),
    dailyExpenseEmpty: $("#dailyExpenseEmpty"),

    openMainCostModalBtn: $("#openMainCostModalBtn"),
    mainCostPageTotal: $("#mainCostPageTotal"),
    mainCostPageCount: $("#mainCostPageCount"),
    highestMainCost: $("#highestMainCost"),
    mainCostList: $("#mainCostList"),
    mainCostEmpty: $("#mainCostEmpty"),

    openDebtModalBtn: $("#openDebtModalBtn"),
    debtReceivableTotal: $("#debtReceivableTotal"),
    debtPayableTotal: $("#debtPayableTotal"),
    receivableList: $("#receivableList"),
    receivableEmpty: $("#receivableEmpty"),
    payableList: $("#payableList"),
    payableEmpty: $("#payableEmpty"),

    openIncomeModalBtn: $("#openIncomeModalBtn"),
    incomePageTotal: $("#incomePageTotal"),
    incomeList: $("#incomeList"),
    incomeEmpty: $("#incomeEmpty"),

    analyticsDailyChart: $("#analyticsDailyChart"),
    mainVsDailyChart: $("#mainVsDailyChart"),
    categoryAnalysisList: $("#categoryAnalysisList"),
    mainCostAnalysisList: $("#mainCostAnalysisList"),

    downloadPdfBtn: $("#downloadPdfBtn"),
    exportBackupBtn: $("#exportBackupBtn"),
    importBackupBtn: $("#importBackupBtn"),
    importBackupInput: $("#importBackupInput"),
    resetCurrentMonthBtn: $("#resetCurrentMonthBtn"),
    resetAllDataBtn: $("#resetAllDataBtn"),

    dailyExpenseModal: $("#dailyExpenseModal"),
    dailyExpenseModalTitle: $("#dailyExpenseModalTitle"),
    dailyExpenseForm: $("#dailyExpenseForm"),
    dailyExpenseEditId: $("#dailyExpenseEditId"),
    dailyExpenseDate: $("#dailyExpenseDate"),
    dailyExpenseAmount: $("#dailyExpenseAmount"),
    dailyExpenseCategory: $("#dailyExpenseCategory"),
    customDailyCategoryWrap: $("#customDailyCategoryWrap"),
    customDailyCategory: $("#customDailyCategory"),
    dailyExpenseNote: $("#dailyExpenseNote"),

    mainCostModal: $("#mainCostModal"),
    mainCostModalTitle: $("#mainCostModalTitle"),
    mainCostForm: $("#mainCostForm"),
    mainCostEditId: $("#mainCostEditId"),
    mainCostCategory: $("#mainCostCategory"),
    mainCostDate: $("#mainCostDate"),
    mainCostAmount: $("#mainCostAmount"),
    mainCostNote: $("#mainCostNote"),

    debtModal: $("#debtModal"),
    debtModalTitle: $("#debtModalTitle"),
    debtForm: $("#debtForm"),
    debtEditId: $("#debtEditId"),
    debtType: $("#debtType"),
    debtPerson: $("#debtPerson"),
    debtDate: $("#debtDate"),
    debtAmount: $("#debtAmount"),
    debtStatus: $("#debtStatus"),
    debtNote: $("#debtNote"),

    incomeModal: $("#incomeModal"),
    incomeModalTitle: $("#incomeModalTitle"),
    incomeForm: $("#incomeForm"),
    incomeEditId: $("#incomeEditId"),
    incomeDate: $("#incomeDate"),
    incomeAmount: $("#incomeAmount"),
    incomeSource: $("#incomeSource"),
    incomeNote: $("#incomeNote"),

    confirmModal: $("#confirmModal"),
    confirmTitle: $("#confirmTitle"),
    confirmMessage: $("#confirmMessage"),
    confirmCancelBtn: $("#confirmCancelBtn"),
    confirmActionBtn: $("#confirmActionBtn"),

    toastContainer: $("#toastContainer")
  };


  /* =========================================================
     BASIC UTILITIES
  ========================================================= */

  function createId() {
    if (
      window.crypto &&
      typeof window.crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }

    return (
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 10)
    );
  }


  function getTodayString() {
    const date = new Date();

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }


  function getCurrentMonthKey() {
    return getTodayString().slice(0, 7);
  }


  function getMonthName(monthKey) {
    if (!monthKey) return "";

    const [year, month] =
      monthKey.split("-").map(Number);

    const date =
      new Date(year, month - 1, 1);

    return date.toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric"
      }
    );
  }


  function getDaysInMonth(monthKey) {
    const [year, month] =
      monthKey.split("-").map(Number);

    return new Date(
      year,
      month,
      0
    ).getDate();
  }


  function getMonthBounds(monthKey) {
    const days =
      getDaysInMonth(monthKey);

    return {
      min: `${monthKey}-01`,
      max: `${monthKey}-${String(days).padStart(2, "0")}`
    };
  }


  function getDefaultDateForSelectedMonth() {
    const today =
      getTodayString();

    if (
      today.startsWith(
        state.selectedMonth
      )
    ) {
      return today;
    }

    return `${state.selectedMonth}-01`;
  }


  function formatDate(dateString) {
    if (!dateString) return "—";

    const date =
      new Date(
        `${dateString}T00:00:00`
      );

    if (
      Number.isNaN(date.getTime())
    ) {
      return dateString;
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  }


  function formatShortDate(dateString) {
    if (!dateString) return "—";

    const date =
      new Date(
        `${dateString}T00:00:00`
      );

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short"
      }
    );
  }


  function formatMoney(value) {
    const amount =
      Number(value) || 0;

    return (
      "৳" +
      amount.toLocaleString(
        "en-BD",
        {
          minimumFractionDigits:
            Number.isInteger(amount)
              ? 0
              : 2,

          maximumFractionDigits: 2
        }
      )
    );
  }


  function sumAmounts(items) {
    return items.reduce(
      (total, item) =>
        total +
        (Number(item.amount) || 0),
      0
    );
  }


  function escapeHTML(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }


  function sortByNewest(items) {
    return [...items].sort(
      (a, b) => {
        const dateCompare =
          String(b.date || "")
            .localeCompare(
              String(a.date || "")
            );

        if (dateCompare !== 0) {
          return dateCompare;
        }

        return String(
          b.createdAt || ""
        ).localeCompare(
          String(a.createdAt || "")
        );
      }
    );
  }


  function isValidPositiveAmount(value) {
    const number =
      Number(value);

    return (
      Number.isFinite(number) &&
      number > 0
    );
  }


  function ensureDateInsideMonth(
    dateString
  ) {
    return Boolean(
      dateString &&
      dateString.startsWith(
        `${state.selectedMonth}-`
      )
    );
  }


  /* =========================================================
     DATA STRUCTURE
  ========================================================= */

  function createEmptyMonth() {
    return {
      dailyExpenses: [],
      mainCosts: [],
      debts: [],
      incomes: []
    };
  }


  function createDefaultStore() {
    return {
      version: STORAGE_VERSION,
      selectedMonth:
        getCurrentMonthKey(),
      months: {}
    };
  }


  function normalizeMonthData(month) {
    const input =
      month &&
      typeof month === "object"
        ? month
        : {};

    return {
      dailyExpenses:
        Array.isArray(
          input.dailyExpenses
        )
          ? input.dailyExpenses
          : [],

      mainCosts:
        Array.isArray(
          input.mainCosts
        )
          ? input.mainCosts
          : [],

      debts:
        Array.isArray(
          input.debts
        )
          ? input.debts
          : [],

      incomes:
        Array.isArray(
          input.incomes
        )
          ? input.incomes
          : []
    };
  }


  function normalizeStore(raw) {
    const fallback =
      createDefaultStore();

    if (
      !raw ||
      typeof raw !== "object"
    ) {
      return fallback;
    }

    const normalized = {
      version: STORAGE_VERSION,

      selectedMonth:
        /^\d{4}-\d{2}$/.test(
          raw.selectedMonth || ""
        )
          ? raw.selectedMonth
          : getCurrentMonthKey(),

      months: {}
    };

    if (
      raw.months &&
      typeof raw.months === "object"
    ) {
      Object.entries(
        raw.months
      ).forEach(
        ([monthKey, monthData]) => {
          if (
            /^\d{4}-\d{2}$/.test(
              monthKey
            )
          ) {
            normalized.months[
              monthKey
            ] =
              normalizeMonthData(
                monthData
              );
          }
        }
      );
    }

    return normalized;
  }


  function loadStore() {
    try {
      const saved =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (!saved) {
        return createDefaultStore();
      }

      return normalizeStore(
        JSON.parse(saved)
      );
    } catch (error) {
      console.error(
        "Storage load failed:",
        error
      );

      return createDefaultStore();
    }
  }


  let state = loadStore();


  function saveStore() {
    try {
      state.version =
        STORAGE_VERSION;

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
      );

      return true;
    } catch (error) {
      console.error(
        "Storage save failed:",
        error
      );

      showToast(
        "Could not save data. Browser storage may be full.",
        "error"
      );

      return false;
    }
  }


  function getCurrentMonthData() {
    if (
      !state.months[
        state.selectedMonth
      ]
    ) {
      state.months[
        state.selectedMonth
      ] = createEmptyMonth();
    }

    return state.months[
      state.selectedMonth
    ];
  }


  /* =========================================================
     TOAST
  ========================================================= */

  function showToast(
    message,
    type = "success"
  ) {
    if (!dom.toastContainer) return;

    const toast =
      document.createElement("div");

    toast.className =
      `toast ${type}`;

    toast.textContent =
      message;

    dom.toastContainer.appendChild(
      toast
    );

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform =
        "translateY(-8px)";
    }, 2800);

    setTimeout(() => {
      toast.remove();
    }, 3200);
  }


  /* =========================================================
     MODALS
  ========================================================= */

  function updateBodyLock() {
    const hasOpenModal =
      Boolean(
        document.querySelector(
          ".modal.open"
        )
      );

    const moreOpen =
      dom.mobileMoreMenu?.classList
        .contains("open");

    document.body.classList.toggle(
      "modal-open",
      hasOpenModal || moreOpen
    );
  }


  function openModal(modal) {
    if (!modal) return;

    modal.classList.add("open");
    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    updateBodyLock();
  }


  function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute(
      "aria-hidden",
      "true"
    );

    updateBodyLock();
  }


  $$("[data-close-modal]").forEach(
    button => {
      button.addEventListener(
        "click",
        () => {
          const modal =
            button.closest(".modal");

          closeModal(modal);
        }
      );
    }
  );


  document.addEventListener(
    "keydown",
    event => {
      if (event.key !== "Escape") {
        return;
      }

      const openModalElement =
        document.querySelector(
          ".modal.open"
        );

      if (openModalElement) {
        closeModal(
          openModalElement
        );
      }

      closeMobileMoreMenu();
    }
  );


  /* =========================================================
     CONFIRM DIALOG
  ========================================================= */

  let confirmCallback = null;


  function askConfirmation({
    title = "Are you sure?",
    message =
      "This action cannot be undone.",
    confirmText = "Confirm",
    onConfirm
  }) {
    dom.confirmTitle.textContent =
      title;

    dom.confirmMessage.textContent =
      message;

    dom.confirmActionBtn.textContent =
      confirmText;

    confirmCallback =
      typeof onConfirm === "function"
        ? onConfirm
        : null;

    openModal(dom.confirmModal);
  }


  dom.confirmCancelBtn.addEventListener(
    "click",
    () => {
      confirmCallback = null;
      closeModal(dom.confirmModal);
    }
  );


  dom.confirmActionBtn.addEventListener(
    "click",
    () => {
      const callback =
        confirmCallback;

      confirmCallback = null;

      closeModal(dom.confirmModal);

      if (callback) {
        callback();
      }
    }
  );


  /* =========================================================
     NAVIGATION
  ========================================================= */

  function navigateTo(page) {
    if (!PAGE_TITLES[page]) {
      page = "dashboard";
    }

    $$(".page-section").forEach(
      section => {
        section.classList.toggle(
          "active",
          section.dataset.page === page
        );
      }
    );

    $$("[data-page-target]").forEach(
      button => {
        button.classList.toggle(
          "active",
          button.dataset.pageTarget ===
            page
        );
      }
    );

    dom.pageTitle.textContent =
      PAGE_TITLES[page];

    closeMobileMoreMenu();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    if (page === "analytics") {
      renderAnalytics();
    }
  }


  $$("[data-page-target]").forEach(
    button => {
      button.addEventListener(
        "click",
        () => {
          navigateTo(
            button.dataset.pageTarget
          );
        }
      );
    }
  );


  /* =========================================================
     MOBILE MORE MENU
  ========================================================= */

  function openMobileMoreMenu() {
    dom.mobileMoreMenu.classList.add(
      "open"
    );

    dom.mobileMoreMenu.setAttribute(
      "aria-hidden",
      "false"
    );

    updateBodyLock();
  }


  function closeMobileMoreMenu() {
    if (!dom.mobileMoreMenu) {
      return;
    }

    dom.mobileMoreMenu.classList.remove(
      "open"
    );

    dom.mobileMoreMenu.setAttribute(
      "aria-hidden",
      "true"
    );

    updateBodyLock();
  }


  dom.mobileMoreBtn.addEventListener(
    "click",
    openMobileMoreMenu
  );


  dom.closeMobileMoreBtn.addEventListener(
    "click",
    closeMobileMoreMenu
  );


  dom.mobileMoreMenu.addEventListener(
    "click",
    event => {
      if (
        event.target ===
        dom.mobileMoreMenu
      ) {
        closeMobileMoreMenu();
      }
    }
  );


  /* =========================================================
     MONTH SWITCHING
  ========================================================= */

  function setSelectedMonth(
    monthKey
  ) {
    if (
      !/^\d{4}-\d{2}$/.test(
        monthKey || ""
      )
    ) {
      return;
    }

    state.selectedMonth =
      monthKey;

    state.months[monthKey] =
      state.months[monthKey] ||
      createEmptyMonth();

    dom.monthPicker.value =
      monthKey;

    state.selectedMonth =
      monthKey;

    dom.dailyDateFilter.value = "";

    updateDateInputLimits();

    saveStore();
    renderAll();
  }


  function shiftMonth(amount) {
    const [year, month] =
      state.selectedMonth
        .split("-")
        .map(Number);

    const date =
      new Date(
        year,
        month - 1 + amount,
        1
      );

    const newKey =
      `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

    setSelectedMonth(newKey);
  }


  dom.monthPicker.addEventListener(
    "change",
    () => {
      if (
        dom.monthPicker.value
      ) {
        setSelectedMonth(
          dom.monthPicker.value
        );
      }
    }
  );


  dom.previousMonthBtn.addEventListener(
    "click",
    () => shiftMonth(-1)
  );


  dom.nextMonthBtn.addEventListener(
    "click",
    () => shiftMonth(1)
  );


  /* =========================================================
     DATE INPUT LIMITS
  ========================================================= */

  function updateDateInputLimits() {
    const bounds =
      getMonthBounds(
        state.selectedMonth
      );

    [
      dom.dailyExpenseDate,
      dom.mainCostDate,
      dom.debtDate,
      dom.incomeDate
    ].forEach(input => {
      input.min = bounds.min;
      input.max = bounds.max;
    });

    dom.dailyDateFilter.min =
      bounds.min;

    dom.dailyDateFilter.max =
      bounds.max;
  }


  /* =========================================================
     DAILY EXPENSE FORM
  ========================================================= */

  function resetDailyExpenseForm() {
    dom.dailyExpenseForm.reset();

    dom.dailyExpenseEditId.value =
      "";

    dom.dailyExpenseDate.value =
      getDefaultDateForSelectedMonth();

    dom.customDailyCategoryWrap.classList.add(
      "hidden"
    );

    dom.customDailyCategory.value =
      "";

    dom.dailyExpenseModalTitle.textContent =
      "Add Expense";
  }


  function openDailyExpenseForm(
    expense = null
  ) {
    resetDailyExpenseForm();

    if (expense) {
      dom.dailyExpenseEditId.value =
        expense.id;

      dom.dailyExpenseDate.value =
        expense.date;

      dom.dailyExpenseAmount.value =
        expense.amount;

      const defaultExists =
        DEFAULT_DAILY_CATEGORIES.includes(
          expense.category
        );

      if (defaultExists) {
        dom.dailyExpenseCategory.value =
          expense.category;
      } else {
        dom.dailyExpenseCategory.value =
          "__custom__";

        dom.customDailyCategoryWrap.classList.remove(
          "hidden"
        );

        dom.customDailyCategory.value =
          expense.category || "";
      }

      dom.dailyExpenseNote.value =
        expense.note || "";

      dom.dailyExpenseModalTitle.textContent =
        "Edit Expense";
    }

    openModal(
      dom.dailyExpenseModal
    );

    setTimeout(() => {
      dom.dailyExpenseAmount.focus();
    }, 100);
  }


  dom.openDailyExpenseModalBtn.addEventListener(
    "click",
    () => openDailyExpenseForm()
  );


  dom.topQuickAddBtn.addEventListener(
    "click",
    () => openDailyExpenseForm()
  );


  dom.mobileQuickAddBtn.addEventListener(
    "click",
    () => openDailyExpenseForm()
  );


  dom.dailyExpenseCategory.addEventListener(
    "change",
    () => {
      const custom =
        dom.dailyExpenseCategory.value ===
        "__custom__";

      dom.customDailyCategoryWrap.classList.toggle(
        "hidden",
        !custom
      );

      if (custom) {
        dom.customDailyCategory.focus();
      }
    }
  );


  dom.dailyExpenseForm.addEventListener(
    "submit",
    event => {
      event.preventDefault();

      const amount =
        Number(
          dom.dailyExpenseAmount.value
        );

      const date =
        dom.dailyExpenseDate.value;

      let category =
        dom.dailyExpenseCategory.value;

      if (
        category === "__custom__"
      ) {
        category =
          dom.customDailyCategory
            .value.trim();

        if (!category) {
          showToast(
            "Please enter a custom category.",
            "error"
          );

          dom.customDailyCategory.focus();
          return;
        }
      }

      if (
        !isValidPositiveAmount(
          amount
        )
      ) {
        showToast(
          "Please enter a valid amount.",
          "error"
        );

        return;
      }

      if (
        !ensureDateInsideMonth(
          date
        )
      ) {
        showToast(
          `Date must be inside ${getMonthName(
            state.selectedMonth
          )}.`,
          "error"
        );

        return;
      }

      if (!category) {
        showToast(
          "Please select a category.",
          "error"
        );

        return;
      }

      const monthData =
        getCurrentMonthData();

      const editId =
        dom.dailyExpenseEditId.value;

      if (editId) {
        const index =
          monthData.dailyExpenses
            .findIndex(
              item =>
                item.id === editId
            );

        if (index !== -1) {
          monthData.dailyExpenses[
            index
          ] = {
            ...monthData
              .dailyExpenses[index],

            date,
            amount,
            category,
            note:
              dom.dailyExpenseNote
                .value.trim(),

            updatedAt:
              new Date().toISOString()
          };
        }

        showToast(
          "Expense updated successfully."
        );
      } else {
        monthData.dailyExpenses.push({
          id: createId(),
          date,
          amount,
          category,
          note:
            dom.dailyExpenseNote
              .value.trim(),
          createdAt:
            new Date().toISOString()
        });

        showToast(
          "Expense saved successfully."
        );
      }

      saveStore();
      closeModal(
        dom.dailyExpenseModal
      );

      renderAll();
    }
  );


  /* =========================================================
     MAIN COST FORM
  ========================================================= */

  function resetMainCostForm() {
    dom.mainCostForm.reset();

    dom.mainCostEditId.value =
      "";

    dom.mainCostDate.value =
      getDefaultDateForSelectedMonth();

    dom.mainCostModalTitle.textContent =
      "Add Main Cost";
  }


  function openMainCostForm(
    item = null
  ) {
    resetMainCostForm();

    if (item) {
      dom.mainCostEditId.value =
        item.id;

      dom.mainCostCategory.value =
        item.category;

      dom.mainCostDate.value =
        item.date;

      dom.mainCostAmount.value =
        item.amount;

      dom.mainCostNote.value =
        item.note || "";

      dom.mainCostModalTitle.textContent =
        "Edit Main Cost";
    }

    openModal(dom.mainCostModal);

    setTimeout(() => {
      if (item) {
        dom.mainCostAmount.focus();
      } else {
        dom.mainCostCategory.focus();
      }
    }, 100);
  }


  dom.openMainCostModalBtn.addEventListener(
    "click",
    () => openMainCostForm()
  );


  dom.mainCostForm.addEventListener(
    "submit",
    event => {
      event.preventDefault();

      const amount =
        Number(
          dom.mainCostAmount.value
        );

      const category =
        dom.mainCostCategory.value;

      const date =
        dom.mainCostDate.value;

      if (
        !isValidPositiveAmount(
          amount
        )
      ) {
        showToast(
          "Please enter a valid amount.",
          "error"
        );

        return;
      }

      if (!category) {
        showToast(
          "Please select a cost type.",
          "error"
        );

        return;
      }

      if (
        !ensureDateInsideMonth(
          date
        )
      ) {
        showToast(
          `Date must be inside ${getMonthName(
            state.selectedMonth
          )}.`,
          "error"
        );

        return;
      }

      const monthData =
        getCurrentMonthData();

      const editId =
        dom.mainCostEditId.value;

      if (editId) {
        const index =
          monthData.mainCosts
            .findIndex(
              item =>
                item.id === editId
            );

        if (index !== -1) {
          monthData.mainCosts[
            index
          ] = {
            ...monthData.mainCosts[
              index
            ],
            category,
            date,
            amount,
            note:
              dom.mainCostNote
                .value.trim(),
            updatedAt:
              new Date().toISOString()
          };
        }

        showToast(
          "Main cost updated."
        );
      } else {
        monthData.mainCosts.push({
          id: createId(),
          category,
          date,
          amount,
          note:
            dom.mainCostNote
              .value.trim(),
          createdAt:
            new Date().toISOString()
        });

        showToast(
          "Main cost saved."
        );
      }

      saveStore();

      closeModal(
        dom.mainCostModal
      );

      renderAll();
    }
  );


  /* =========================================================
     DEBT FORM
  ========================================================= */

  function resetDebtForm() {
    dom.debtForm.reset();

    dom.debtEditId.value = "";

    dom.debtType.value =
      "receivable";

    dom.debtStatus.value =
      "pending";

    dom.debtDate.value =
      getDefaultDateForSelectedMonth();

    dom.debtModalTitle.textContent =
      "Add Debt";
  }


  function openDebtForm(
    debt = null
  ) {
    resetDebtForm();

    if (debt) {
      dom.debtEditId.value =
        debt.id;

      dom.debtType.value =
        debt.type;

      dom.debtPerson.value =
        debt.person;

      dom.debtDate.value =
        debt.date;

      dom.debtAmount.value =
        debt.amount;

      dom.debtStatus.value =
        debt.status || "pending";

      dom.debtNote.value =
        debt.note || "";

      dom.debtModalTitle.textContent =
        "Edit Debt";
    }

    openModal(dom.debtModal);

    setTimeout(() => {
      dom.debtPerson.focus();
    }, 100);
  }


  dom.openDebtModalBtn.addEventListener(
    "click",
    () => openDebtForm()
  );


  dom.debtForm.addEventListener(
    "submit",
    event => {
      event.preventDefault();

      const person =
        dom.debtPerson.value.trim();

      const amount =
        Number(dom.debtAmount.value);

      const date =
        dom.debtDate.value;

      const type =
        dom.debtType.value;

      const status =
        dom.debtStatus.value;

      if (!person) {
        showToast(
          "Please enter the person's name.",
          "error"
        );

        return;
      }

      if (
        !isValidPositiveAmount(
          amount
        )
      ) {
        showToast(
          "Please enter a valid amount.",
          "error"
        );

        return;
      }

      if (
        !ensureDateInsideMonth(
          date
        )
      ) {
        showToast(
          `Date must be inside ${getMonthName(
            state.selectedMonth
          )}.`,
          "error"
        );

        return;
      }

      const monthData =
        getCurrentMonthData();

      const editId =
        dom.debtEditId.value;

      if (editId) {
        const index =
          monthData.debts
            .findIndex(
              item =>
                item.id === editId
            );

        if (index !== -1) {
          monthData.debts[
            index
          ] = {
            ...monthData.debts[
              index
            ],

            person,
            amount,
            date,
            type,
            status,

            note:
              dom.debtNote
                .value.trim(),

            updatedAt:
              new Date().toISOString()
          };
        }

        showToast(
          "Debt entry updated."
        );
      } else {
        monthData.debts.push({
          id: createId(),
          person,
          amount,
          date,
          type,
          status,
          note:
            dom.debtNote
              .value.trim(),
          createdAt:
            new Date().toISOString()
        });

        showToast(
          "Debt entry saved."
        );
      }

      saveStore();

      closeModal(dom.debtModal);

      renderAll();
    }
  );


  /* =========================================================
     INCOME FORM
  ========================================================= */

  function resetIncomeForm() {
    dom.incomeForm.reset();

    dom.incomeEditId.value =
      "";

    dom.incomeDate.value =
      getDefaultDateForSelectedMonth();

    dom.incomeModalTitle.textContent =
      "Add Income";
  }


  function openIncomeForm(
    income = null
  ) {
    resetIncomeForm();

    if (income) {
      dom.incomeEditId.value =
        income.id;

      dom.incomeDate.value =
        income.date;

      dom.incomeAmount.value =
        income.amount;

      dom.incomeSource.value =
        income.source;

      dom.incomeNote.value =
        income.note || "";

      dom.incomeModalTitle.textContent =
        "Edit Income";
    }

    openModal(dom.incomeModal);

    setTimeout(() => {
      dom.incomeAmount.focus();
    }, 100);
  }


  dom.openIncomeModalBtn.addEventListener(
    "click",
    () => openIncomeForm()
  );


  dom.incomeForm.addEventListener(
    "submit",
    event => {
      event.preventDefault();

      const amount =
        Number(
          dom.incomeAmount.value
        );

      const source =
        dom.incomeSource
          .value.trim();

      const date =
        dom.incomeDate.value;

      if (
        !isValidPositiveAmount(
          amount
        )
      ) {
        showToast(
          "Please enter a valid income amount.",
          "error"
        );

        return;
      }

      if (!source) {
        showToast(
          "Please enter an income source.",
          "error"
        );

        return;
      }

      if (
        !ensureDateInsideMonth(
          date
        )
      ) {
        showToast(
          `Date must be inside ${getMonthName(
            state.selectedMonth
          )}.`,
          "error"
        );

        return;
      }

      const monthData =
        getCurrentMonthData();

      const editId =
        dom.incomeEditId.value;

      if (editId) {
        const index =
          monthData.incomes
            .findIndex(
              item =>
                item.id === editId
            );

        if (index !== -1) {
          monthData.incomes[
            index
          ] = {
            ...monthData.incomes[
              index
            ],
            amount,
            source,
            date,
            note:
              dom.incomeNote
                .value.trim(),

            updatedAt:
              new Date().toISOString()
          };
        }

        showToast(
          "Income updated."
        );
      } else {
        monthData.incomes.push({
          id: createId(),
          amount,
          source,
          date,
          note:
            dom.incomeNote
              .value.trim(),
          createdAt:
            new Date().toISOString()
        });

        showToast(
          "Income saved."
        );
      }

      saveStore();

      closeModal(
        dom.incomeModal
      );

      renderAll();
    }
  );


  /* =========================================================
     DAILY FILTERS
  ========================================================= */

  function updateCategoryFilter() {
    const monthData =
      getCurrentMonthData();

    const customCategories =
      monthData.dailyExpenses
        .map(item => item.category)
        .filter(Boolean);

    const categories =
      [
        ...new Set([
          ...DEFAULT_DAILY_CATEGORIES,
          ...customCategories
        ])
      ].sort();

    const currentValue =
      dom.dailyCategoryFilter.value;

    dom.dailyCategoryFilter.innerHTML =
      `
        <option value="all">
          All Categories
        </option>
      ` +
      categories
        .map(
          category => `
            <option value="${escapeHTML(
              category
            )}">
              ${escapeHTML(category)}
            </option>
          `
        )
        .join("");

    if (
      categories.includes(
        currentValue
      )
    ) {
      dom.dailyCategoryFilter.value =
        currentValue;
    } else {
      dom.dailyCategoryFilter.value =
        "all";
    }
  }


  function getFilteredDailyExpenses() {
    const monthData =
      getCurrentMonthData();

    const search =
      dom.dailySearchInput.value
        .trim()
        .toLowerCase();

    const category =
      dom.dailyCategoryFilter.value;

    const date =
      dom.dailyDateFilter.value;

    return sortByNewest(
      monthData.dailyExpenses.filter(
        item => {
          const searchText =
            `${item.category || ""} ${item.note || ""}`
              .toLowerCase();

          const matchesSearch =
            !search ||
            searchText.includes(search);

          const matchesCategory =
            category === "all" ||
            item.category === category;

          const matchesDate =
            !date ||
            item.date === date;

          return (
            matchesSearch &&
            matchesCategory &&
            matchesDate
          );
        }
      )
    );
  }


  [
    dom.dailySearchInput,
    dom.dailyCategoryFilter,
    dom.dailyDateFilter
  ].forEach(control => {
    control.addEventListener(
      control.tagName === "INPUT"
        ? "input"
        : "change",
      renderDailyExpenseList
    );
  });


  dom.dailyDateFilter.addEventListener(
    "change",
    renderDailyExpenseList
  );


  dom.clearDailyFiltersBtn.addEventListener(
    "click",
    () => {
      dom.dailySearchInput.value =
        "";

      dom.dailyCategoryFilter.value =
        "all";

      dom.dailyDateFilter.value =
        "";

      renderDailyExpenseList();
    }
  );


  /* =========================================================
     CALCULATIONS
  ========================================================= */

  function getDailyCategoryTotals(
    expenses
  ) {
    const totals = {};

    expenses.forEach(item => {
      const category =
        item.category || "Other";

      totals[category] =
        (totals[category] || 0) +
        (Number(item.amount) || 0);
    });

    return totals;
  }


  function getMainCostCategoryTotals(
    costs
  ) {
    const totals = {};

    costs.forEach(item => {
      const category =
        item.category || "Other";

      totals[category] =
        (totals[category] || 0) +
        (Number(item.amount) || 0);
    });

    return totals;
  }


  function getTopEntry(totals) {
    const entries =
      Object.entries(totals);

    if (!entries.length) {
      return null;
    }

    return entries.sort(
      (a, b) => b[1] - a[1]
    )[0];
  }


  function getDailyTotalsByDate(
    expenses
  ) {
    const totals = {};

    expenses.forEach(item => {
      totals[item.date] =
        (totals[item.date] || 0) +
        (Number(item.amount) || 0);
    });

    return totals;
  }


  function calculateAveragePerDay(
    totalExpense
  ) {
    const selected =
      state.selectedMonth;

    const current =
      getCurrentMonthKey();

    let divisor =
      getDaysInMonth(selected);

    if (selected === current) {
      divisor =
        new Date().getDate();
    }

    if (selected > current) {
      divisor = 0;
    }

    return divisor > 0
      ? totalExpense / divisor
      : 0;
  }


  /* =========================================================
     SUMMARY
  ========================================================= */

  function renderSummary() {
    const monthData =
      getCurrentMonthData();

    const dailyTotal =
      sumAmounts(
        monthData.dailyExpenses
      );

    const mainTotal =
      sumAmounts(
        monthData.mainCosts
      );

    const totalExpense =
      dailyTotal + mainTotal;

    const incomeTotal =
      sumAmounts(
        monthData.incomes
      );

    const pendingReceivable =
      sumAmounts(
        monthData.debts.filter(
          debt =>
            debt.type ===
              "receivable" &&
            debt.status !==
              "settled"
        )
      );

    const pendingPayable =
      sumAmounts(
        monthData.debts.filter(
          debt =>
            debt.type ===
              "payable" &&
            debt.status !==
              "settled"
        )
      );

    dom.summaryTotalExpense.textContent =
      formatMoney(totalExpense);

    dom.summaryDailyExpense.textContent =
      formatMoney(dailyTotal);

    dom.summaryMainCost.textContent =
      formatMoney(mainTotal);

    dom.summaryAverageDaily.textContent =
      formatMoney(
        calculateAveragePerDay(
          totalExpense
        )
      );

    dom.summaryIncome.textContent =
      formatMoney(incomeTotal);

    dom.summaryReceivable.textContent =
      formatMoney(
        pendingReceivable
      );

    dom.summaryPayable.textContent =
      formatMoney(pendingPayable);

    dom.dailyChartTotalBadge.textContent =
      formatMoney(dailyTotal);

    dom.dashboardMonthTitle.textContent =
      `${getMonthName(
        state.selectedMonth
      )} Finance Overview`;
  }


  /* =========================================================
     DASHBOARD INSIGHTS
  ========================================================= */

  function renderDashboardInsights() {
    const monthData =
      getCurrentMonthData();

    const dailyTotals =
      getDailyTotalsByDate(
        monthData.dailyExpenses
      );

    const entries =
      Object.entries(dailyTotals);

    let highest = null;

    if (entries.length) {
      highest =
        entries.sort(
          (a, b) =>
            b[1] - a[1]
        )[0];
    }

    if (highest) {
      dom.highestSpendDay.textContent =
        formatShortDate(
          highest[0]
        );

      dom.highestSpendAmount.textContent =
        formatMoney(
          highest[1]
        );
    } else {
      dom.highestSpendDay.textContent =
        "—";

      dom.highestSpendAmount.textContent =
        formatMoney(0);
    }

    const categoryTotals =
      getDailyCategoryTotals(
        monthData.dailyExpenses
      );

    const topCategory =
      getTopEntry(categoryTotals);

    dom.topDailyCategory.textContent =
      topCategory
        ? topCategory[0]
        : "—";

    dom.totalTransactionCount.textContent =
      String(
        monthData.dailyExpenses.length
      );
  }


  /* =========================================================
     TRANSACTION MARKUP
  ========================================================= */

  function getCategoryInitial(
    category
  ) {
    if (!category) return "৳";

    return category
      .trim()
      .charAt(0)
      .toUpperCase();
  }


  function dailyTransactionMarkup(
    item,
    includeActions = true
  ) {
    return `
      <div
        class="transaction-item"
        data-id="${escapeHTML(item.id)}"
      >

        <div class="transaction-icon">
          ${escapeHTML(
            getCategoryInitial(
              item.category
            )
          )}
        </div>

        <div class="transaction-content">

          <p class="transaction-title">
            ${escapeHTML(
              item.category ||
              "Expense"
            )}
          </p>

          <div class="transaction-meta">

            <span>
              ${escapeHTML(
                formatShortDate(
                  item.date
                )
              )}
            </span>

            ${
              item.note
                ? `
                  <span>•</span>
                  <span>
                    ${escapeHTML(
                      item.note
                    )}
                  </span>
                `
                : ""
            }

          </div>

        </div>

        <div class="transaction-amount">
          ${formatMoney(
            item.amount
          )}
        </div>

        ${
          includeActions
            ? `
              <div class="transaction-actions">

                <button
                  class="edit-action"
                  type="button"
                  data-action="edit-daily"
                  data-id="${escapeHTML(
                    item.id
                  )}"
                >
                  Edit
                </button>

                <button
                  class="delete-action"
                  type="button"
                  data-action="delete-daily"
                  data-id="${escapeHTML(
                    item.id
                  )}"
                >
                  Delete
                </button>

              </div>
            `
            : ""
        }

      </div>
    `;
  }


  /* =========================================================
     DASHBOARD RECENT
  ========================================================= */

  function renderDashboardRecent() {
    const monthData =
      getCurrentMonthData();

    const items =
      sortByNewest(
        monthData.dailyExpenses
      ).slice(0, 5);

    dom.dashboardRecentTransactions.innerHTML =
      items
        .map(item =>
          dailyTransactionMarkup(
            item,
            false
          )
        )
        .join("");

    dom.dashboardRecentEmpty.hidden =
      items.length > 0;

    dom.dashboardRecentTransactions.hidden =
      items.length === 0;
  }


  /* =========================================================
     DAILY EXPENSE LIST
  ========================================================= */

  function renderDailyExpenseList() {
    const monthData =
      getCurrentMonthData();

    const filtered =
      getFilteredDailyExpenses();

    dom.dailyExpenseList.innerHTML =
      filtered
        .map(item =>
          dailyTransactionMarkup(
            item,
            true
          )
        )
        .join("");

    dom.dailyExpenseEmpty.hidden =
      filtered.length > 0;

    dom.dailyExpenseList.hidden =
      filtered.length === 0;

    const total =
      sumAmounts(
        monthData.dailyExpenses
      );

    const categoryTotals =
      getDailyCategoryTotals(
        monthData.dailyExpenses
      );

    const topCategory =
      getTopEntry(categoryTotals);

    dom.dailyPageTotal.textContent =
      formatMoney(total);

    dom.dailyPageCount.textContent =
      String(
        monthData.dailyExpenses.length
      );

    dom.dailyPageTopCategory.textContent =
      topCategory
        ? topCategory[0]
        : "—";
  }


  /* =========================================================
     DAILY ACTION HANDLER
  ========================================================= */

  function handleDailyAction(
    action,
    id
  ) {
    const monthData =
      getCurrentMonthData();

    const item =
      monthData.dailyExpenses.find(
        expense =>
          expense.id === id
      );

    if (!item) return;

    if (action === "edit-daily") {
      openDailyExpenseForm(item);
      return;
    }

    if (
      action === "delete-daily"
    ) {
      askConfirmation({
        title: "Delete expense?",
        message:
          `${item.category} - ${formatMoney(
            item.amount
          )} will be permanently deleted.`,

        confirmText: "Delete",

        onConfirm: () => {
          monthData.dailyExpenses =
            monthData.dailyExpenses.filter(
              expense =>
                expense.id !== id
            );

          saveStore();
          renderAll();

          showToast(
            "Expense deleted.",
            "success"
          );
        }
      });
    }
  }


  dom.dailyExpenseList.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          "[data-action]"
        );

      if (!button) return;

      handleDailyAction(
        button.dataset.action,
        button.dataset.id
      );
    }
  );


  /* =========================================================
     MAIN COST LIST
  ========================================================= */

  function renderMainCosts() {
    const monthData =
      getCurrentMonthData();

    const items =
      sortByNewest(
        monthData.mainCosts
      );

    const total =
      sumAmounts(items);

    const highest =
      items.length
        ? Math.max(
            ...items.map(
              item =>
                Number(
                  item.amount
                ) || 0
            )
          )
        : 0;

    dom.mainCostPageTotal.textContent =
      formatMoney(total);

    dom.mainCostPageCount.textContent =
      String(items.length);

    dom.highestMainCost.textContent =
      formatMoney(highest);

    dom.mainCostList.innerHTML =
      items
        .map(
          item => `
            <article
              class="cost-card"
              data-id="${escapeHTML(
                item.id
              )}"
            >

              <div class="cost-card-top">

                <div>
                  <p class="cost-card-title">
                    ${escapeHTML(
                      item.category
                    )}
                  </p>

                  <div class="cost-card-meta">
                    ${escapeHTML(
                      formatDate(
                        item.date
                      )
                    )}
                  </div>
                </div>

                <strong class="cost-card-amount">
                  ${formatMoney(
                    item.amount
                  )}
                </strong>

              </div>

              ${
                item.note
                  ? `
                    <p class="cost-card-note">
                      ${escapeHTML(
                        item.note
                      )}
                    </p>
                  `
                  : ""
              }

              <div class="cost-card-actions">

                <button
                  class="edit-action"
                  type="button"
                  data-action="edit-main"
                  data-id="${escapeHTML(
                    item.id
                  )}"
                >
                  Edit
                </button>

                <button
                  class="delete-action"
                  type="button"
                  data-action="delete-main"
                  data-id="${escapeHTML(
                    item.id
                  )}"
                >
                  Delete
                </button>

              </div>

            </article>
          `
        )
        .join("");

    dom.mainCostEmpty.hidden =
      items.length > 0;

    dom.mainCostList.hidden =
      items.length === 0;
  }


  dom.mainCostList.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          "[data-action]"
        );

      if (!button) return;

      const monthData =
        getCurrentMonthData();

      const item =
        monthData.mainCosts.find(
          cost =>
            cost.id ===
            button.dataset.id
        );

      if (!item) return;

      if (
        button.dataset.action ===
        "edit-main"
      ) {
        openMainCostForm(item);
      }

      if (
        button.dataset.action ===
        "delete-main"
      ) {
        askConfirmation({
          title: "Delete main cost?",

          message:
            `${item.category} - ${formatMoney(
              item.amount
            )} will be deleted.`,

          confirmText: "Delete",

          onConfirm: () => {
            monthData.mainCosts =
              monthData.mainCosts.filter(
                cost =>
                  cost.id !==
                  item.id
              );

            saveStore();
            renderAll();

            showToast(
              "Main cost deleted."
            );
          }
        });
      }
    }
  );


  /* =========================================================
     DEBT LIST
  ========================================================= */

  function debtMarkup(item) {
    const settled =
      item.status === "settled";

    return `
      <div
        class="debt-item"
        data-id="${escapeHTML(item.id)}"
      >

        <div class="debt-item-head">

          <div class="debt-person">

            <strong>
              ${escapeHTML(
                item.person
              )}
            </strong>

            <small>
              ${escapeHTML(
                formatDate(
                  item.date
                )
              )}
            </small>

          </div>

          <div class="debt-amount">
            ${formatMoney(
              item.amount
            )}
          </div>

        </div>

        <span
          class="status-badge ${
            settled
              ? "settled"
              : "pending"
          }"
        >
          ${
            settled
              ? "Settled"
              : "Pending"
          }
        </span>

        ${
          item.note
            ? `
              <p class="cost-card-note">
                ${escapeHTML(
                  item.note
                )}
              </p>
            `
            : ""
        }

        <div class="cost-card-actions">

          ${
            !settled
              ? `
                <button
                  class="settle-action"
                  type="button"
                  data-action="settle-debt"
                  data-id="${escapeHTML(
                    item.id
                  )}"
                >
                  Mark Settled
                </button>
              `
              : `
                <button
                  class="settle-action"
                  type="button"
                  data-action="pending-debt"
                  data-id="${escapeHTML(
                    item.id
                  )}"
                >
                  Mark Pending
                </button>
              `
          }

          <button
            class="edit-action"
            type="button"
            data-action="edit-debt"
            data-id="${escapeHTML(
              item.id
            )}"
          >
            Edit
          </button>

          <button
            class="delete-action"
            type="button"
            data-action="delete-debt"
            data-id="${escapeHTML(
              item.id
            )}"
          >
            Delete
          </button>

        </div>

      </div>
    `;
  }


  function renderDebts() {
    const monthData =
      getCurrentMonthData();

    const receivables =
      sortByNewest(
        monthData.debts.filter(
          item =>
            item.type ===
            "receivable"
        )
      );

    const payables =
      sortByNewest(
        monthData.debts.filter(
          item =>
            item.type ===
            "payable"
        )
      );

    const pendingReceivable =
      sumAmounts(
        receivables.filter(
          item =>
            item.status !==
            "settled"
        )
      );

    const pendingPayable =
      sumAmounts(
        payables.filter(
          item =>
            item.status !==
            "settled"
        )
      );

    dom.debtReceivableTotal.textContent =
      formatMoney(
        pendingReceivable
      );

    dom.debtPayableTotal.textContent =
      formatMoney(
        pendingPayable
      );

    dom.receivableList.innerHTML =
      receivables
        .map(debtMarkup)
        .join("");

    dom.payableList.innerHTML =
      payables
        .map(debtMarkup)
        .join("");

    dom.receivableEmpty.hidden =
      receivables.length > 0;

    dom.receivableList.hidden =
      receivables.length === 0;

    dom.payableEmpty.hidden =
      payables.length > 0;

    dom.payableList.hidden =
      payables.length === 0;
  }


  function handleDebtAction(
    action,
    id
  ) {
    const monthData =
      getCurrentMonthData();

    const item =
      monthData.debts.find(
        debt => debt.id === id
      );

    if (!item) return;

    if (action === "edit-debt") {
      openDebtForm(item);
      return;
    }

    if (
      action === "settle-debt" ||
      action === "pending-debt"
    ) {
      item.status =
        action === "settle-debt"
          ? "settled"
          : "pending";

      item.updatedAt =
        new Date().toISOString();

      saveStore();
      renderAll();

      showToast(
        item.status === "settled"
          ? "Debt marked as settled."
          : "Debt marked as pending."
      );

      return;
    }

    if (
      action === "delete-debt"
    ) {
      askConfirmation({
        title: "Delete debt entry?",

        message:
          `${item.person} - ${formatMoney(
            item.amount
          )} will be permanently deleted.`,

        confirmText: "Delete",

        onConfirm: () => {
          monthData.debts =
            monthData.debts.filter(
              debt =>
                debt.id !== id
            );

          saveStore();
          renderAll();

          showToast(
            "Debt entry deleted."
          );
        }
      });
    }
  }


  [
    dom.receivableList,
    dom.payableList
  ].forEach(list => {
    list.addEventListener(
      "click",
      event => {
        const button =
          event.target.closest(
            "[data-action]"
          );

        if (!button) return;

        handleDebtAction(
          button.dataset.action,
          button.dataset.id
        );
      }
    );
  });


  /* =========================================================
     INCOME LIST
  ========================================================= */

  function renderIncomes() {
    const monthData =
      getCurrentMonthData();

    const items =
      sortByNewest(
        monthData.incomes
      );

    const total =
      sumAmounts(items);

    dom.incomePageTotal.textContent =
      formatMoney(total);

    dom.incomeList.innerHTML =
      items
        .map(
          item => `
            <div
              class="transaction-item"
              data-id="${escapeHTML(
                item.id
              )}"
            >

              <div
                class="transaction-icon"
                style="
                  color: var(--success);
                  background: var(--success-soft);
                "
              >
                +
              </div>

              <div class="transaction-content">

                <p class="transaction-title">
                  ${escapeHTML(
                    item.source
                  )}
                </p>

                <div class="transaction-meta">

                  <span>
                    ${escapeHTML(
                      formatShortDate(
                        item.date
                      )
                    )}
                  </span>

                  ${
                    item.note
                      ? `
                        <span>•</span>

                        <span>
                          ${escapeHTML(
                            item.note
                          )}
                        </span>
                      `
                      : ""
                  }

                </div>

              </div>

              <div
                class="transaction-amount"
                style="color: var(--success);"
              >
                ${formatMoney(
                  item.amount
                )}
              </div>

              <div class="transaction-actions">

                <button
                  class="edit-action"
                  type="button"
                  data-action="edit-income"
                  data-id="${escapeHTML(
                    item.id
                  )}"
                >
                  Edit
                </button>

                <button
                  class="delete-action"
                  type="button"
                  data-action="delete-income"
                  data-id="${escapeHTML(
                    item.id
                  )}"
                >
                  Delete
                </button>

              </div>

            </div>
          `
        )
        .join("");

    dom.incomeEmpty.hidden =
      items.length > 0;

    dom.incomeList.hidden =
      items.length === 0;
  }


  dom.incomeList.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          "[data-action]"
        );

      if (!button) return;

      const monthData =
        getCurrentMonthData();

      const item =
        monthData.incomes.find(
          income =>
            income.id ===
            button.dataset.id
        );

      if (!item) return;

      if (
        button.dataset.action ===
        "edit-income"
      ) {
        openIncomeForm(item);
        return;
      }

      if (
        button.dataset.action ===
        "delete-income"
      ) {
        askConfirmation({
          title: "Delete income?",

          message:
            `${item.source} - ${formatMoney(
              item.amount
            )} will be deleted.`,

          confirmText: "Delete",

          onConfirm: () => {
            monthData.incomes =
              monthData.incomes.filter(
                income =>
                  income.id !==
                  item.id
              );

            saveStore();
            renderAll();

            showToast(
              "Income deleted."
            );
          }
        });
      }
    }
  );


  /* =========================================================
     DAILY BAR CHART
  ========================================================= */

  function renderDailyBarChart(
    container
  ) {
    if (!container) return;

    const monthData =
      getCurrentMonthData();

    const totals =
      getDailyTotalsByDate(
        monthData.dailyExpenses
      );

    const days =
      getDaysInMonth(
        state.selectedMonth
      );

    const values =
      Array.from(
        { length: days },
        (_, index) => {
          const day =
            index + 1;

          const date =
            `${state.selectedMonth}-${String(
              day
            ).padStart(2, "0")}`;

          return {
            day,
            date,
            amount:
              totals[date] || 0
          };
        }
      );

    const maxValue =
      Math.max(
        ...values.map(
          item => item.amount
        ),
        0
      );

    if (maxValue <= 0) {
      container.innerHTML = `
        <div class="chart-empty-state">
          <span>▥</span>
          <p>No daily expenses yet.</p>
        </div>
      `;

      return;
    }

    const chart =
      document.createElement("div");

    chart.style.display = "flex";
    chart.style.alignItems =
      "flex-end";

    chart.style.gap = "7px";

    chart.style.height = "260px";

    chart.style.minWidth =
      `${Math.max(
        days * 31,
        container.clientWidth || 300
      )}px`;

    chart.style.padding =
      "12px 6px 0";

    chart.style.borderBottom =
      "1px solid var(--border)";

    values.forEach(item => {
      const column =
        document.createElement("div");

      column.style.display =
        "flex";

      column.style.flexDirection =
        "column";

      column.style.justifyContent =
        "flex-end";

      column.style.alignItems =
        "center";

      column.style.width =
        "24px";

      column.style.flex =
        "0 0 24px";

      column.style.height =
        "100%";

      const valueLabel =
        document.createElement(
          "span"
        );

      valueLabel.textContent =
        item.amount > 0
          ? Math.round(item.amount)
          : "";

      valueLabel.title =
        formatMoney(item.amount);

      valueLabel.style.fontSize =
        "8px";

      valueLabel.style.fontWeight =
        "700";

      valueLabel.style.color =
        "var(--text-muted)";

      valueLabel.style.marginBottom =
        "5px";

      valueLabel.style.maxWidth =
        "36px";

      valueLabel.style.overflow =
        "hidden";

      const bar =
        document.createElement("div");

      const barHeight =
        item.amount > 0
          ? Math.max(
              5,
              (item.amount /
                maxValue) *
                185
            )
          : 2;

      bar.style.width = "15px";

      bar.style.height =
        `${barHeight}px`;

      bar.style.borderRadius =
        "5px 5px 2px 2px";

      bar.style.background =
        item.amount > 0
          ? "linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)"
          : "var(--surface-2)";

      bar.style.boxShadow =
        item.amount > 0
          ? "0 4px 10px rgba(37,99,235,.12)"
          : "none";

      bar.title =
        `Day ${item.day}: ${formatMoney(
          item.amount
        )}`;

      const dayLabel =
        document.createElement(
          "span"
        );

      dayLabel.textContent =
        item.day;

      dayLabel.style.marginTop =
        "7px";

      dayLabel.style.fontSize =
        "9px";

      dayLabel.style.fontWeight =
        "700";

      dayLabel.style.color =
        "var(--text-muted)";

      column.append(
        valueLabel,
        bar,
        dayLabel
      );

      chart.appendChild(column);
    });

    container.innerHTML = "";
    container.appendChild(chart);
  }


  /* =========================================================
     ANALYTICS
  ========================================================= */

  function renderProgressAnalysis(
    container,
    totals,
    emptyText
  ) {
    const entries =
      Object.entries(totals)
        .sort(
          (a, b) =>
            b[1] - a[1]
        );

    if (!entries.length) {
      container.innerHTML = `
        <div class="empty-state compact">
          <span>▥</span>
          <h4>${escapeHTML(
            emptyText
          )}</h4>
        </div>
      `;

      return;
    }

    const max =
      Math.max(
        ...entries.map(
          entry => entry[1]
        )
      );

    container.innerHTML =
      entries
        .map(
          ([name, amount]) => {
            const width =
              max > 0
                ? Math.max(
                    3,
                    (amount / max) *
                      100
                  )
                : 0;

            return `
              <div class="category-analysis-item">

                <div class="category-analysis-top">

                  <span>
                    ${escapeHTML(
                      name
                    )}
                  </span>

                  <strong>
                    ${formatMoney(
                      amount
                    )}
                  </strong>

                </div>

                <div class="progress-track">

                  <div
                    class="progress-fill"
                    style="width:${width}%"
                  ></div>

                </div>

              </div>
            `;
          }
        )
        .join("");
  }


  function renderMainVsDaily() {
    const monthData =
      getCurrentMonthData();

    const daily =
      sumAmounts(
        monthData.dailyExpenses
      );

    const main =
      sumAmounts(
        monthData.mainCosts
      );

    const max =
      Math.max(
        daily,
        main,
        1
      );

    const dailyWidth =
      daily > 0
        ? Math.max(
            3,
            (daily / max) * 100
          )
        : 0;

    const mainWidth =
      main > 0
        ? Math.max(
            3,
            (main / max) * 100
          )
        : 0;

    dom.mainVsDailyChart.innerHTML =
      `
        <div class="comparison-bars">

          <div class="comparison-item">

            <div class="comparison-label-row">

              <span>Daily Expense</span>

              <strong>
                ${formatMoney(daily)}
              </strong>

            </div>

            <div class="progress-track">

              <div
                class="progress-fill"
                style="width:${dailyWidth}%"
              ></div>

            </div>

          </div>

          <div class="comparison-item">

            <div class="comparison-label-row">

              <span>Main Cost</span>

              <strong>
                ${formatMoney(main)}
              </strong>

            </div>

            <div class="progress-track">

              <div
                class="progress-fill"
                style="
                  width:${mainWidth}%;
                  background:
                    linear-gradient(
                      90deg,
                      #7c3aed,
                      #a78bfa
                    );
                "
              ></div>

            </div>

          </div>

        </div>
      `;
  }


  function renderAnalytics() {
    const monthData =
      getCurrentMonthData();

    renderDailyBarChart(
      dom.analyticsDailyChart
    );

    renderMainVsDaily();

    renderProgressAnalysis(
      dom.categoryAnalysisList,

      getDailyCategoryTotals(
        monthData.dailyExpenses
      ),

      "No daily category data"
    );

    renderProgressAnalysis(
      dom.mainCostAnalysisList,

      getMainCostCategoryTotals(
        monthData.mainCosts
      ),

      "No main cost data"
    );
  }


  /* =========================================================
     BACKUP EXPORT
  ========================================================= */

  function downloadBlob(
    blob,
    filename
  ) {
    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();
    link.remove();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 500);
  }


  dom.exportBackupBtn.addEventListener(
    "click",
    () => {
      const backup = {
        ...state,

        exportedAt:
          new Date().toISOString()
      };

      const blob =
        new Blob(
          [
            JSON.stringify(
              backup,
              null,
              2
            )
          ],
          {
            type:
              "application/json"
          }
        );

      downloadBlob(
        blob,
        `personal-finance-backup-${getTodayString()}.json`
      );

      showToast(
        "Backup exported."
      );
    }
  );


  /* =========================================================
     BACKUP IMPORT
  ========================================================= */

  dom.importBackupBtn.addEventListener(
    "click",
    () => {
      dom.importBackupInput.value =
        "";

      dom.importBackupInput.click();
    }
  );


  dom.importBackupInput.addEventListener(
    "change",
    async () => {
      const file =
        dom.importBackupInput
          .files?.[0];

      if (!file) return;

      try {
        const text =
          await file.text();

        const parsed =
          JSON.parse(text);

        if (
          !parsed ||
          typeof parsed !==
            "object" ||
          !parsed.months ||
          typeof parsed.months !==
            "object"
        ) {
          throw new Error(
            "Invalid backup structure"
          );
        }

        const imported =
          normalizeStore(parsed);

        askConfirmation({
          title: "Restore backup?",

          message:
            "Current saved data will be replaced by the imported backup.",

          confirmText:
            "Restore",

          onConfirm: () => {
            state = imported;

            if (
              !state.selectedMonth
            ) {
              state.selectedMonth =
                getCurrentMonthKey();
            }

            dom.monthPicker.value =
              state.selectedMonth;

            updateDateInputLimits();

            saveStore();
            renderAll();

            showToast(
              "Backup restored successfully."
            );
          }
        });
      } catch (error) {
        console.error(error);

        showToast(
          "Invalid or corrupted backup file.",
          "error"
        );
      }
    }
  );


  /* =========================================================
     RESET CURRENT MONTH
  ========================================================= */

  dom.resetCurrentMonthBtn.addEventListener(
    "click",
    () => {
      askConfirmation({
        title:
          "Reset current month?",

        message:
          `All data for ${getMonthName(
            state.selectedMonth
          )} will be permanently deleted.`,

        confirmText:
          "Reset Month",

        onConfirm: () => {
          state.months[
            state.selectedMonth
          ] = createEmptyMonth();

          saveStore();
          renderAll();

          showToast(
            "Current month reset."
          );
        }
      });
    }
  );


  /* =========================================================
     RESET ALL
  ========================================================= */

  dom.resetAllDataBtn.addEventListener(
    "click",
    () => {
      askConfirmation({
        title:
          "Delete all finance data?",

        message:
          "Every saved month, expense, debt and income entry will be permanently deleted.",

        confirmText:
          "Delete Everything",

        onConfirm: () => {
          const selected =
            getCurrentMonthKey();

          state =
            createDefaultStore();

          state.selectedMonth =
            selected;

          state.months[selected] =
            createEmptyMonth();

          saveStore();

          dom.monthPicker.value =
            selected;

          updateDateInputLimits();

          renderAll();

          showToast(
            "All data deleted."
          );
        }
      });
    }
  );


  /* =========================================================
     SIMPLE PDF GENERATOR
     No external dependency
  ========================================================= */

  function pdfSafeText(
    value
  ) {
    return String(value ?? "")
      .replace(/[^\x20-\x7E]/g, "?")
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");
  }


  function pdfMoney(value) {
    const number =
      Number(value) || 0;

    return (
      "BDT " +
      number.toLocaleString(
        "en-US",
        {
          maximumFractionDigits: 2
        }
      )
    );
  }


  function wrapPdfText(
    text,
    maxLength = 82
  ) {
    const words =
      String(text).split(/\s+/);

    const lines = [];

    let current = "";

    words.forEach(word => {
      const next =
        current
          ? `${current} ${word}`
          : word;

      if (
        next.length >
          maxLength &&
        current
      ) {
        lines.push(current);
        current = word;
      } else {
        current = next;
      }
    });

    if (current) {
      lines.push(current);
    }

    return lines.length
      ? lines
      : [""];
  }


  function buildPdfReportLines() {
    const data =
      getCurrentMonthData();

    const dailyTotal =
      sumAmounts(
        data.dailyExpenses
      );

    const mainTotal =
      sumAmounts(
        data.mainCosts
      );

    const expenseTotal =
      dailyTotal + mainTotal;

    const incomeTotal =
      sumAmounts(
        data.incomes
      );

    const receivable =
      sumAmounts(
        data.debts.filter(
          item =>
            item.type ===
              "receivable" &&
            item.status !==
              "settled"
        )
      );

    const payable =
      sumAmounts(
        data.debts.filter(
          item =>
            item.type ===
              "payable" &&
            item.status !==
              "settled"
        )
      );

    const lines = [];

    const heading =
      text =>
        lines.push({
          text,
          size: 12,
          bold: true,
          gap: 18
        });

    const normal =
      text =>
        wrapPdfText(text).forEach(
          line =>
            lines.push({
              text: line,
              size: 9,
              bold: false,
              gap: 13
            })
        );

    const spacer = () =>
      lines.push({
        text: "",
        size: 8,
        gap: 8
      });

    lines.push({
      text:
        "PERSONAL FINANCE MANAGER",
      size: 18,
      bold: true,
      gap: 24
    });

    lines.push({
      text:
        getMonthName(
          state.selectedMonth
        ),
      size: 13,
      bold: true,
      gap: 20
    });

    normal(
      `Generated: ${new Date().toLocaleString(
        "en-GB"
      )}`
    );

    spacer();

    heading("MONTHLY SUMMARY");

    normal(
      `Total Expense: ${pdfMoney(
        expenseTotal
      )}`
    );

    normal(
      `Daily Expense: ${pdfMoney(
        dailyTotal
      )}`
    );

    normal(
      `Main Cost: ${pdfMoney(
        mainTotal
      )}`
    );

    normal(
      `Average Per Day: ${pdfMoney(
        calculateAveragePerDay(
          expenseTotal
        )
      )}`
    );

    normal(
      `Total Income: ${pdfMoney(
        incomeTotal
      )}`
    );

    normal(
      `Pending Receivable: ${pdfMoney(
        receivable
      )}`
    );

    normal(
      `Pending Payable: ${pdfMoney(
        payable
      )}`
    );

    spacer();

    heading("MAIN COSTS");

    if (!data.mainCosts.length) {
      normal(
        "No main costs recorded."
      );
    } else {
      sortByNewest(
        data.mainCosts
      ).forEach(
        (item, index) => {
          normal(
            `${index + 1}. ${item.date} | ${item.category} | ${pdfMoney(
              item.amount
            )}${
              item.note
                ? ` | ${item.note}`
                : ""
            }`
          );
        }
      );
    }

    spacer();

    heading("DAILY EXPENSES");

    if (
      !data.dailyExpenses.length
    ) {
      normal(
        "No daily expenses recorded."
      );
    } else {
      sortByNewest(
        data.dailyExpenses
      ).forEach(
        (item, index) => {
          normal(
            `${index + 1}. ${item.date} | ${item.category} | ${pdfMoney(
              item.amount
            )}${
              item.note
                ? ` | ${item.note}`
                : ""
            }`
          );
        }
      );
    }

    spacer();

    heading(
      "DAILY CATEGORY BREAKDOWN"
    );

    const categoryTotals =
      getDailyCategoryTotals(
        data.dailyExpenses
      );

    const categoryEntries =
      Object.entries(
        categoryTotals
      ).sort(
        (a, b) =>
          b[1] - a[1]
      );

    if (!categoryEntries.length) {
      normal(
        "No category data."
      );
    } else {
      categoryEntries.forEach(
        ([category, amount]) => {
          normal(
            `${category}: ${pdfMoney(
              amount
            )}`
          );
        }
      );
    }

    spacer();

    heading("DEBT / LOAN");

    if (!data.debts.length) {
      normal(
        "No debt records."
      );
    } else {
      sortByNewest(
        data.debts
      ).forEach(
        (item, index) => {
          normal(
            `${index + 1}. ${item.date} | ${
              item.type ===
              "receivable"
                ? "Receive From"
                : "Pay To"
            }: ${item.person} | ${pdfMoney(
              item.amount
            )} | ${
              item.status ===
              "settled"
                ? "Settled"
                : "Pending"
            }${
              item.note
                ? ` | ${item.note}`
                : ""
            }`
          );
        }
      );
    }

    spacer();

    heading("INCOME");

    if (!data.incomes.length) {
      normal(
        "No income recorded."
      );
    } else {
      sortByNewest(
        data.incomes
      ).forEach(
        (item, index) => {
          normal(
            `${index + 1}. ${item.date} | ${item.source} | ${pdfMoney(
              item.amount
            )}${
              item.note
                ? ` | ${item.note}`
                : ""
            }`
          );
        }
      );
    }

    return lines;
  }


  function paginatePdfLines(
    lines
  ) {
    const pages = [];

    let page = [];
    let currentY = 790;

    lines.forEach(line => {
      const requiredSpace =
        line.gap || 13;

      if (
        currentY -
          requiredSpace <
        55
      ) {
        pages.push(page);
        page = [];
        currentY = 790;
      }

      page.push({
        ...line,
        y: currentY
      });

      currentY -=
        requiredSpace;
    });

    if (page.length) {
      pages.push(page);
    }

    return pages;
  }


  function createPdfBlob() {
    const lines =
      buildPdfReportLines();

    const pages =
      paginatePdfLines(lines);

    const objects = [null];

    const addObject =
      content => {
        objects.push(content);
        return objects.length - 1;
      };

    const catalogId =
      addObject("");

    const pagesId =
      addObject("");

    const regularFontId =
      addObject(
        `<<
          /Type /Font
          /Subtype /Type1
          /BaseFont /Helvetica
        >>`
      );

    const boldFontId =
      addObject(
        `<<
          /Type /Font
          /Subtype /Type1
          /BaseFont /Helvetica-Bold
        >>`
      );

    const pageIds = [];

    pages.forEach(page => {
      let stream = "";

      page.forEach(line => {
        const fontName =
          line.bold
            ? "F2"
            : "F1";

        stream +=
          `BT\n` +
          `/${fontName} ${line.size || 9} Tf\n` +
          `1 0 0 1 50 ${line.y} Tm\n` +
          `(${pdfSafeText(
            line.text
          )}) Tj\n` +
          `ET\n`;
      });

      const contentId =
        addObject(
          `<<
            /Length ${stream.length}
          >>
          stream
          ${stream}
          endstream`
        );

      const pageId =
        addObject(
          `<<
            /Type /Page
            /Parent ${pagesId} 0 R
            /MediaBox [0 0 595 842]
            /Resources <<
              /Font <<
                /F1 ${regularFontId} 0 R
                /F2 ${boldFontId} 0 R
              >>
            >>
            /Contents ${contentId} 0 R
          >>`
        );

      pageIds.push(pageId);
    });

    objects[catalogId] =
      `<<
        /Type /Catalog
        /Pages ${pagesId} 0 R
      >>`;

    objects[pagesId] =
      `<<
        /Type /Pages
        /Count ${pageIds.length}
        /Kids [
          ${pageIds
            .map(
              id =>
                `${id} 0 R`
            )
            .join(" ")}
        ]
      >>`;

    let pdf =
      "%PDF-1.4\n";

    const offsets =
      [0];

    for (
      let i = 1;
      i < objects.length;
      i++
    ) {
      offsets[i] =
        pdf.length;

      pdf +=
        `${i} 0 obj\n` +
        `${objects[i]}\n` +
        `endobj\n`;
    }

    const xrefOffset =
      pdf.length;

    pdf +=
      `xref\n` +
      `0 ${objects.length}\n` +
      `0000000000 65535 f \n`;

    for (
      let i = 1;
      i < objects.length;
      i++
    ) {
      pdf +=
        `${String(
          offsets[i]
        ).padStart(
          10,
          "0"
        )} 00000 n \n`;
    }

    pdf +=
      `trailer\n` +
      `<<
        /Size ${objects.length}
        /Root ${catalogId} 0 R
      >>\n` +
      `startxref\n` +
      `${xrefOffset}\n` +
      `%%EOF`;

    return new Blob(
      [pdf],
      {
        type: "application/pdf"
      }
    );
  }


  function downloadMonthlyPdf() {
    try {
      const blob =
        createPdfBlob();

      downloadBlob(
        blob,
        `finance-report-${state.selectedMonth}.pdf`
      );

      showToast(
        "Monthly PDF downloaded."
      );
    } catch (error) {
      console.error(
        "PDF error:",
        error
      );

      showToast(
        "Could not generate PDF.",
        "error"
      );
    }
  }


  dom.downloadPdfBtn.addEventListener(
    "click",
    downloadMonthlyPdf
  );


  dom.dashboardPdfBtn.addEventListener(
    "click",
    downloadMonthlyPdf
  );


  /* =========================================================
     RENDER ALL
  ========================================================= */

  function renderAll() {
    const monthData =
      getCurrentMonthData();

    if (
      !dom.monthPicker.value
    ) {
      dom.monthPicker.value =
        state.selectedMonth;
    }

    renderSummary();
    renderDashboardInsights();
    renderDashboardRecent();

    updateCategoryFilter();

    renderDailyExpenseList();
    renderMainCosts();
    renderDebts();
    renderIncomes();

    renderDailyBarChart(
      dom.dashboardDailyChart
    );

    renderAnalytics();

    saveStore();
  }


  /* =========================================================
     WINDOW RESIZE
     Rebuild chart without page zooming
  ========================================================= */

  let resizeTimer = null;

  window.addEventListener(
    "resize",
    () => {
      clearTimeout(
        resizeTimer
      );

      resizeTimer =
        setTimeout(() => {
          renderDailyBarChart(
            dom.dashboardDailyChart
          );

          renderDailyBarChart(
            dom.analyticsDailyChart
          );
        }, 180);
    }
  );


  /* =========================================================
     INITIALIZE
  ========================================================= */

  function init() {
    state =
      normalizeStore(state);

    state.months[
      state.selectedMonth
    ] =
      state.months[
        state.selectedMonth
      ] ||
      createEmptyMonth();

    dom.monthPicker.value =
      state.selectedMonth;

    updateDateInputLimits();

    resetDailyExpenseForm();
    resetMainCostForm();
    resetDebtForm();
    resetIncomeForm();

    navigateTo("dashboard");

    renderAll();

    saveStore();
  }


  init();

})();