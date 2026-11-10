/* =========================================================
   منطق فرم گزارش حفاظت فیزیکی
   ========================================================= */

const STORAGE_KEY = "guard_reports_v1";
const $ = (sel) => document.querySelector(sel);

document.addEventListener("DOMContentLoaded", () => {
  initLocationSelect();
  initPersonnelSearch();
  initStatusToggle();
  initPhotoUploader();
  initFormSubmit();
  initRecentActions();
  renderRecentReports();
});

function initLocationSelect() {
  const sel = $("#location");
  LOCATIONS.forEach(loc => {
    const opt = document.createElement("option");
    opt.value = loc.name;
    opt.textContent = loc.label;
    sel.appendChild(opt);
  });

  sel.addEventListener("change", () => {
    const postSel = $("#post");
    postSel.innerHTML = "";
    if (!sel.value) {
      postSel.disabled = true;
      postSel.innerHTML = `<option value="">ابتدا محل را انتخاب کنید</option>`;
      return;
    }
    postSel.disabled = false;
    postSel.innerHTML = `<option value="">— انتخاب کنید —</option>`;
    POSTS.filter(p => p.location === sel.value).forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.name;
      opt.textContent = p.label;
      postSel.appendChild(opt);
    });
  });
}


function initPhotoUploader() {
  const uploader = $("#photoUploader");
  const input = $("#photo");
  const placeholder = $("#photoPlaceholder");
  const preview = $("#photoPreview");

  uploader.addEventListener("click", () => input.click());

  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) {
      preview.hidden = true;
      placeholder.hidden = false;
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.hidden = false;
      placeholder.hidden = true;
    };
    reader.readAsDataURL(file);
  });
}



function loadReports() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}


function initRecentActions() {
  $("#exportBtn").addEventListener("click", () => {
    const reports = loadReports();
    if (!reports.length) return showToast("گزارشی برای خروجی وجود ندارد", "error");

    const headers = ["نوع گزارش", "محل", "پست", "پرسنل", "ساعت", "وضعیت", "توضیحات", "تاریخ ثبت"];
    const rows = reports.map(r => [
      r.reportType, r.locationLabel, r.postLabel, (r.personnelNames || []).join(" | "),
      r.visitTime, r.status, r.notes || "", r.createdAt
    ]);

    const csv = "\uFEFF" + [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, `""`)}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guard-reports-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("📥 خروجی CSV دانلود شد", "success");
  });

  $("#clearBtn").addEventListener("click", () => {
    if (!confirm("همه گزارش‌های ذخیره‌شده محلی پاک شوند؟")) return;
    localStorage.removeItem(STORAGE_KEY);
    renderRecentReports();
    showToast("🗑️ گزارش‌ها پاک شدند", "success");
  });
}

let toastTimer;
function showToast(message, type = "success") {
  const toast = $("#toast");
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}


function initStatusToggle() {
  const statusSelect = $("#status");
  const details = $("#detailsSection");

  function syncDetailsVisibility() {
    if (statusSelect.value === "normal") {
      details.classList.add("hidden");
    } else {
      details.classList.remove("hidden");
    }
  }

  statusSelect.addEventListener("change", syncDetailsVisibility);
  syncDetailsVisibility();
}


function initPersonnelSearch() {
  const searchInput = $("#personnelSearch");
  const listBox = $("#personnel");
  const chipsBox = $("#selectedChips");
  const hiddenIds = $("#personnelIds");

  let selected = [];

  function updateHidden() {
    hiddenIds.value = JSON.stringify(selected.map(s => s.id));
  }

  function renderChips() {
    chipsBox.innerHTML = "";
    selected.forEach(person => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.innerHTML = `<span>${person.fullName}</span><button type="button" class="chip-remove" data-id="${person.id}" title="حذف">×</button>`;
      chip.querySelector(".chip-remove").addEventListener("click", () => {
        selected = selected.filter(s => s.id !== person.id);
        updateHidden();
        renderChips();
        renderPersonnelList(filterPersonnel(searchInput.value.trim().toLowerCase()));
      });
      chipsBox.appendChild(chip);
    });
  }

  function filterPersonnel(q) {
    return q
      ? PERSONNEL.filter(p => p.fullName.toLowerCase().includes(q))
      : PERSONNEL;
  }

  function renderPersonnelList(items) {
    listBox.innerHTML = "";
    items.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.fullName;
      if (selected.some(s => s.id === p.id)) {
        opt.textContent = "✓ " + p.fullName;
      }
      listBox.appendChild(opt);
    });
  }

  renderPersonnelList(PERSONNEL);

  searchInput.addEventListener("input", () => {
    renderPersonnelList(filterPersonnel(searchInput.value.trim().toLowerCase()));
  });

  listBox.addEventListener("change", () => {
    const selectedOpt = listBox.selectedOptions[0];
    if (!selectedOpt) return;
    const person = PERSONNEL.find(p => p.id === selectedOpt.value);
    if (!person) return;
    if (selected.some(s => s.id === person.id)) {
      showToast("این پرسنل قبلاً اضافه شده است", "error");
      listBox.selectedIndex = -1;
      return;
    }
    selected.push(person);
    updateHidden();
    renderChips();
    searchInput.value = "";
    renderPersonnelList(PERSONNEL);
    listBox.selectedIndex = -1;
  });
}


function initFormSubmit() {
  const form = $("#guardForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const reportType = form.querySelector(`input[name="reportType"]:checked`)?.value;
    const location = $("#location").value;
    const post = $("#post").value;
    const personnelIdsRaw = $("#personnelIds").value;
    const visitTime = $("#visitTime").value;
    const status = $("#status").value;
    const notes = $("#notes").value.trim();
    const photoFile = $("#photo").files[0];

    let personnelIds = [];
    try {
      personnelIds = JSON.parse(personnelIdsRaw || "[]");
    } catch (err) {
      personnelIds = [];
    }

    if (!location) return showToast("لطفاً محل بازدید را انتخاب کنید", "error");
    if (!post) return showToast("لطفاً نوع پست را انتخاب کنید", "error");
    if (!personnelIds.length) return showToast("لطفاً حداقل یک پرسنل انتخاب کنید", "error");
    if (!visitTime) return showToast("لطفاً ساعت بازدید را وارد کنید", "error");
    if (!status) return showToast("لطفاً وضعیت پست را انتخاب کنید", "error");

    const personnelNames = personnelIds.map(id => {
      const p = PERSONNEL.find(x => x.id === id);
      return p ? p.fullName : id;
    });

    const locationLabel = LOCATIONS.find(l => l.name === location)?.label || location;
    const postLabel = POSTS.find(p => p.name === post)?.label || post;

    const report = {
      id: "r_" + Date.now(),
      reportType,
      location,
      locationLabel,
      post,
      postLabel,
      personnelIds,
      personnelNames,
      visitTime,
      status,
      notes: status === "normal" ? "" : notes,
      createdAt: new Date().toISOString()
    };

    if (photoFile && status !== "normal") {
      const reader = new FileReader();
      reader.onload = (ev) => {
        report.photo = ev.target.result;
        saveReport(report);
      };
      reader.readAsDataURL(photoFile);
    } else {
      saveReport(report);
    }
  });
}


function saveReport(report) {
  const all = loadReports();
  all.unshift(report);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  showToast("✅ گزارش با موفقیت ثبت شد", "success");
  $("#guardForm").reset();
  $("#post").disabled = true;
  $("#post").innerHTML = `<option value="">ابتدا محل را انتخاب کنید</option>`;
  $("#personnelIds").value = "[]";
  $("#selectedChips").innerHTML = "";
  $("#photoPreview").hidden = true;
  $("#photoPlaceholder").hidden = false;
  $("#detailsSection").classList.remove("hidden");
  renderRecentReports();
}

function renderRecentReports() {
  const list = $("#recentList");
  const reports = loadReports();

  if (!reports.length) {
    list.innerHTML = `<p class="empty-state">هنوز گزارشی ثبت نشده است.</p>`;
    return;
  }

  const statusLabels = { normal: "عادی", needs_attention: "نیازمند توجه", issue: "مشکل‌دار" };
  const typeLabels = { patrol: "گشت شبانه", incident: "گزارش موردی", illness: "گزارش بیماری" };

  list.innerHTML = reports.slice(0, 8).map(r => {
    const names = (r.personnelNames || []).map(n => `<span class="chip-mini">${n}</span>`).join("");
    return `
      <div class="recent-item">
        <div class="recent-item-main">
          <div class="recent-item-title">
            ${typeLabels[r.reportType] || "—"} — ${r.locationLabel} / ${r.postLabel}
          </div>
          <div class="recent-item-meta">
            ${names} • ساعت ${r.visitTime}
            <span class="status-pill status-${r.status}">${statusLabels[r.status] || r.status}</span>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

