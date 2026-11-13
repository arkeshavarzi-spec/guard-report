/* =========================================================
   منطق داشبورد مدیریتی (نسخه تمیز - شبیه ویندوز)
   ========================================================= */

let allReports = [];
let currentUserId = null;
let showHiddenReports = false; // وضعیت نمایش فایل‌های پنهان (پیش‌فرض: خاموش)
let selectedReportIdForModal = null;
let myChart = null;

const typeLabels = { 
  patrol: "گشت شبانه", illness: "گزارش بیماری", incident: "گزارش موردی", 
  theft: "گزارش سرقت", disciplinary: "تخلف انضباطی", ceremony: "مراسمات",
  fire: "گزارش حریق", mission: "مأموریت", gathering: "گزارش تجمع"
};

const statusLabels = { 
  unread: "خوانده نشده", 
  read: "خوانده شده", 
  follow_up: "نیازمند پیگیری" 
};

const excelLabels = {
  reportType: "نوع گزارش", reportDate: "تاریخ", reportTime: "ساعت", reporterName: "ثبت‌کننده",
  notes: "توضیحات", locationLabel: "محل", postLabel: "پست", status: "وضعیت", personnelNames: "پرسنل",
  patientName: "بیمار", patientId: "شماره دانشجویی", illnessLocation: "محل بیماری", visitReason: "علت مراجعه",
  fireLocation: "محل حریق", fireCause: "علت حریق", fireDamageLevel: "میزان خسارت", fireCasualties: "خسارت جانی",
  fireFinancialDamage: "خسارت مالی", fireInitialActions: "اقدامات", theftItemDesc: "شرح مال", theftLocation: "محل سرقت",
  theftVictimName: "مالباخته", incidentSubject: "موضوع", incidentDesc: "شرح واقعه", discName: "متخلف", discDesc: "شرح تخلف",
  cerName: "نام برنامه", cerOrganizer: "برگزارکننده", missionPersonnelName: "پرسنل", missionLocation: "محل مأموریت",
  gatheringSubject: "موضوع تجمع", gatheringLocation: "محل تجمع",
  fireDeptCalled: "تماس با آتش‌نشانی", fireDeptCallTime: "ساعت تماس", fireDeptArriveTime: "ساعت رسیدن", fireDamageDetails: "جزئیات خسارت", fireStaffNames: "نیروهای اطفاء",
  missionPost: "پست سازمانی", missionNumber: "شماره مأموریت", missionEndDate: "تاریخ پایان", missionSubject: "موضوع", missionVehicle: "وسیله", missionCategory: "نوع مأموریت", missionDuration: "مدت", missionEquipment: "تجهیزات", missionIssueDate: "تاریخ صدور", missionStartDate: "تاریخ شروع", missionTypeOfficial: "نوع (رسمی)", missionAccommodation: "محل اقامت", missionGroupStaffNames: "نیروهای گروهی"
};


// =========================================================
// منطق مدیریت پرسنل
// =========================================================
let allPersonnelData = [];

function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // حذف active از همه
      document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
      
      // فعال کردن تب کلیک شده
      tab.classList.add('active');
      const targetId = tab.dataset.tab;
      document.getElementById(targetId).classList.remove('hidden');

      // اگر تب پرسنل باز شد، داده‌ها را لود کن
      if (targetId === 'personnelTab' && allPersonnelData.length === 0) {
        fetchPersonnel();
      }
    });
  });
}

async function fetchPersonnel() {
  const tbody = document.getElementById("personnelTableBody");
  tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">در حال بارگذاری...</td></tr>`;

  const { data, error } = await supabaseClient.from('personnel').select('*');
  
  if (error) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:red;">خطا در دریافت اطلاعات</td></tr>`;
    return;
  }
  
  // مرتب‌سازی الفبایی صحیح فارسی در سمت کلاینت (دیتابیس برای فارسی دقیق نیست)
  allPersonnelData = data.sort((a, b) => a.full_name.localeCompare(b.full_name, 'fa'));
  renderPersonnelTable(allPersonnelData);
}

function renderPersonnelTable(data) {
  const tbody = document.getElementById("personnelTableBody");
  
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">پرسنلی یافت نشد.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(p => `
    <tr>
      <td style="font-weight: 700;">${p.full_name}</td>
      <td style="font-family: monospace;">${p.national_id || '—'}</td>
      <td style="font-family: monospace; direction: ltr; text-align: right;">${p.shaba || '—'}</td>
      <td style="font-family: monospace;">${p.phone || '—'}</td>
      <td>
        ${p.can_report 
          ? `<span class="badge-reporter">✅ بله</span>` 
          : `<span class="badge-not-reporter">❌ خیر</span>`}
      </td>
      <td>
        ${p.is_active 
          ? `<span class="badge-active">فعال</span>` 
          : `<span class="badge-inactive">غیرفعال</span>`}
      </td>
      <td>
        <div class="table-actions">
          <button class="btn-table action-p-btn" data-action="edit" data-id="${p.id}" title="ویرایش">✏️</button>
          <button class="btn-table action-p-btn" data-action="toggle-active" data-id="${p.id}" title="${p.is_active ? 'غیرفعال کردن' : 'فعال کردن'}">
            ${p.is_active ? '🚫' : '✅'}
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function initPersonnelEvents() {
  const searchInput = document.getElementById("searchPersonnel");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      const filtered = allPersonnelData.filter(p => 
        p.full_name.toLowerCase().includes(q) || 
        (p.national_id && p.national_id.includes(q))
      );
      renderPersonnelTable(filtered);
    });
  }

  // Event Delegation برای دکمه‌های جدول پرسنل
  const tbody = document.getElementById("personnelTableBody");
  if (tbody) {
    tbody.addEventListener("click", async (e) => {
      const btn = e.target.closest(".action-p-btn");
      if (!btn) return;
      
      const action = btn.dataset.action;
      const id = btn.dataset.id;

      if (action === "edit") openPersonnelModal(id);
      else if (action === "toggle-active") await togglePersonnelActive(id);
    });
  }

  // دکمه افزودن پرسنل
  document.getElementById("addPersonnelBtn")?.addEventListener("click", () => openPersonnelModal(null));
  
  // دکمه خروجی اکسل پرسنل
  document.getElementById("exportPersonnelBtn")?.addEventListener("click", exportPersonnelToExcel);
  
  // دکمه بستن مودال
  document.getElementById("closePersonnelModal")?.addEventListener("click", () => {
    document.getElementById("personnelModal").classList.add("hidden");
  });

  // دکمه ذخیره
  document.getElementById("savePersonnelBtn")?.addEventListener("click", savePersonnel);
}

function openPersonnelModal(id) {
  const modal = document.getElementById("personnelModal");
  const title = document.getElementById("personnelModalTitle");
  const editId = document.getElementById("editPersonnelId");
  
  if (id) {
    // ویرایش
    const p = allPersonnelData.find(x => x.id === id);
    if (!p) return;
    title.textContent = "ویرایش پرسنل";
    editId.value = p.id;
    document.getElementById("pFullName").value = p.full_name;
    document.getElementById("pNationalId").value = p.national_id || '';
    document.getElementById("pShaba").value = p.shaba || '';
    document.getElementById("pPhone").value = p.phone || '';
    document.getElementById("pCanReport").checked = p.can_report;
  } else {
    // افزودن
    title.textContent = "افزودن پرسنل جدید";
    editId.value = "";
    document.getElementById("pFullName").value = "";
    document.getElementById("pNationalId").value = "";
    document.getElementById("pShaba").value = "";
    document.getElementById("pPhone").value = "";
    document.getElementById("pCanReport").checked = false;
  }
  modal.classList.remove("hidden");
}

async function savePersonnel() {
  const id = document.getElementById("editPersonnelId").value;
  const fullName = document.getElementById("pFullName").value.trim();
  const natId = document.getElementById("pNationalId").value.trim();
  const shaba = document.getElementById("pShaba").value.trim();
  const phone = document.getElementById("pPhone").value.trim();
  const canReport = document.getElementById("pCanReport").checked;

  if (!fullName || !natId) return showToast("نام و کد ملی الزامی است", "error");

  const payload = {
    full_name: fullName,
    national_id: natId,
    shaba: shaba,
    phone: phone,
    can_report: canReport
  };

  let error;
  if (id) {
    // ویرایش
    const { error: err } = await supabaseClient.from('personnel').update(payload).eq('id', id);
    error = err;
  } else {
    // ثبت جدید (استفاده از کد ملی به عنوان شناسه)
    const newId = `p_${natId}`;
    payload.id = newId;
    payload.is_active = true;
    const { error: err } = await supabaseClient.from('personnel').insert([payload]);
    error = err;
  }

  if (error) {
    console.error(error);
    return showToast("خطا در ذخیره‌سازی", "error");
  }

  showToast("✅ اطلاعات ذخیره شد", "success");
  document.getElementById("personnelModal").classList.add("hidden");
  
  // رفرش لیست و سینک ابری
  await fetchPersonnel();
  if (typeof fetchAndSyncPersonnel === 'function') await fetchAndSyncPersonnel();
}

async function togglePersonnelActive(id) {
  const p = allPersonnelData.find(x => x.id === id);
  if (!p) return;
  
  const newStatus = !p.is_active;
  if (!confirm(`آیا از ${newStatus ? 'فعال کردن' : 'غیرفعال کردن'} این شخص مطمئنید؟`)) return;
  
  const { error } = await supabaseClient.from('personnel').update({ is_active: newStatus }).eq('id', id);
  if (error) return showToast("خطا در تغییر وضعیت", "error");
  
  showToast(`✅ وضعیت به ${newStatus ? 'فعال' : 'غیرفعال'} تغییر کرد`, "success");
  await fetchPersonnel();
  if (typeof fetchAndSyncPersonnel === 'function') await fetchAndSyncPersonnel();
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // سینک پرسنل
    if (typeof fetchAndSyncPersonnel === 'function') {
      await fetchAndSyncPersonnel();
    }

    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) { window.location.href = 'index.html'; return; }
    currentUserId = session.user.id;

    const { data: profile, error: profileErr } = await supabaseClient
      .from('profiles').select('role, email').eq('id', session.user.id).single();

    if (profileErr || !profile || profile.role !== 'admin') {
      alert("شما دسترسی به داشبورد ندارید.");
      window.location.href = 'index.html';
      return;
    }

    document.getElementById('userEmail').textContent = profile.email;
    document.getElementById('userMenuContainer').classList.remove('hidden');
    setupHeaderEvents();

    await fetchAllReports();
    populateLocationFilter();
    initReporterFilterSearch();
    applyFilters();
    
    setupTableEvents();
    setupFilterEvents();
    setupModalEvents();
    initTabs();
    initPersonnelEvents();
    
  } catch (err) {
    console.error("Dashboard Init Error:", err);
  }
});

async function fetchAllReports() {
  const tbody = document.getElementById("dashboardTableBody");
  tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 30px;">در حال بارگذاری...</td></tr>`;

  const { data, error } = await supabaseClient.from('reports').select('*').order('created_at', { ascending: false });

  if (error) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red; padding: 30px;">خطا در دریافت اطلاعات</td></tr>`;
    return;
  }

  allReports = data.map(r => {
     const hiddenBy = r.hidden_by || [];
     return { 
       ...r.details, 
       _dbId: r.id, 
       _status: r.status, 
       _createdAt: r.created_at,
       _isHidden: hiddenBy.includes(currentUserId) // آیا این گزارش توسط من پنهان شده؟
     };
  });

  updateKPIs();
}

function updateKPIs() {
  const activeReports = allReports.filter(r => !r._isHidden);
  const total = activeReports.length;
  const unread = activeReports.filter(r => r._status === 'unread').length;
  const followup = activeReports.filter(r => r._status === 'follow_up').length;
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const todayCount = activeReports.filter(r => new Date(r._createdAt) > oneDayAgo).length;

  document.getElementById("kpiTotal").textContent = total;
  document.getElementById("kpiUnread").textContent = unread;
  document.getElementById("kpiFollowup").textContent = followup;
  document.getElementById("kpiToday").textContent = todayCount;

  drawChart();
}

function drawChart() {
  const counts = {};
  allReports.filter(r => !r._isHidden).forEach(r => { counts[r.reportType] = (counts[r.reportType] || 0) + 1; });
  const labels = Object.keys(counts).map(k => typeLabels[k] || k);
  const data = Object.values(counts);
  
  if (myChart) myChart.destroy();
  const ctx = document.getElementById('reportsChart').getContext('2d');
  myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{ data: data, backgroundColor: ['#2563eb', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#84cc16'], borderWidth: 2, borderColor: '#fff' }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { family: 'Vazirmatn' } } } } }
  });
}

function populateLocationFilter() {
  const locSelect = document.getElementById("filterLocation");
  locSelect.innerHTML = '<option value="">همه</option>';
  if (typeof LOCATIONS !== 'undefined') {
    LOCATIONS.forEach(loc => {
      const opt = document.createElement("option");
      opt.value = loc.label; opt.textContent = loc.label;
      locSelect.appendChild(opt);
    });
  }
}




let uniqueReporterNames = [];

function initReporterFilterSearch() {
  const searchInput = document.getElementById("filterReporterSearch");
  const listBox = document.getElementById("filterReporterList");
  const hiddenInput = document.getElementById("filterReporter");
  
  if (!searchInput || !listBox) return;

  // استخراج نام‌های یکتا
  const namesSet = new Set();
  allReports.forEach(r => {
    if (r.reporterName && r.reporterName.trim()) namesSet.add(r.reporterName.trim());
  });
  uniqueReporterNames = Array.from(namesSet).sort((a, b) => a.localeCompare(b, 'fa'));

  function renderList(items) {
    listBox.innerHTML = "";
    if (!items.length) {
      listBox.innerHTML = `<div class="personnel-empty" style="padding:10px;font-size:0.85rem">نتیجه‌ای یافت نشد</div>`;
      return;
    }
    items.forEach(name => {
      const item = document.createElement("div");
      item.className = "personnel-item";
      item.style.padding = "8px 12px";
      item.style.fontSize = "0.85rem";
      item.innerHTML = `<span>${name}</span>`;
      
      item.addEventListener("mousedown", (e) => {
        e.preventDefault(); // جلوگیری از blur
        searchInput.value = name;
        hiddenInput.value = name;
        listBox.classList.add("hidden");
      });
      listBox.appendChild(item);
    });
  }

  searchInput.addEventListener("focus", () => {
    listBox.classList.remove("hidden");
    const q = searchInput.value.trim().toLowerCase();
    renderList(q ? uniqueReporterNames.filter(n => n.toLowerCase().includes(q)) : uniqueReporterNames);
  });

  searchInput.addEventListener("input", (e) => {
    listBox.classList.remove("hidden");
    const q = e.target.value.trim().toLowerCase();
    // اگر کاربر متن را پاک کرد، فیلتر لغو شود
    if (!q) hiddenInput.value = ""; 
    renderList(q ? uniqueReporterNames.filter(n => n.toLowerCase().includes(q)) : uniqueReporterNames);
  });

  searchInput.addEventListener("blur", () => {
    setTimeout(() => { 
      listBox.classList.add("hidden"); 
      // اگر متنی تایپ شده بود اما انتخاب نشد، متن را پاک کن
      if (!hiddenInput.value) searchInput.value = "";
    }, 200);
  });
}

function applyFilters() {
  const dateFrom = document.getElementById("filterDateFrom").value.trim();
  const dateTo = document.getElementById("filterDateTo").value.trim();
  const type = document.getElementById("filterType").value;
  const location = document.getElementById("filterLocation").value;
  const status = document.getElementById("filterStatus").value;
  const reporter = document.getElementById("filterReporter").value.trim();

  let filtered = [...allReports];

  // 🚨 فیلتر ویندوزی: اگر دکمه نمایش پنهان‌ها خاموش است، موارد پنهان را نشان نده
  if (!showHiddenReports) {
    filtered = filtered.filter(r => !r._isHidden);
  }

  if (dateFrom) filtered = filtered.filter(r => r.reportDate && r.reportDate >= dateFrom);
  if (dateTo) filtered = filtered.filter(r => r.reportDate && r.reportDate <= dateTo);
  if (type) filtered = filtered.filter(r => r.reportType === type);
  if (status) filtered = filtered.filter(r => r._status === status);
  if (reporter) filtered = filtered.filter(r => r.reporterName && r.reporterName.trim() === reporter);
  
  if (location) {
    filtered = filtered.filter(r => {
      const loc = r.locationLabel || r.fireLocation || r.theftLocation || r.gatheringLocation || r.illnessLocation || r.missionLocation || '';
      return loc.includes(location);
    });
  }

  renderTable(filtered);
  window.currentFilteredReports = filtered;
}

function renderTable(reports) {
  const tbody = document.getElementById("dashboardTableBody");
  if (!reports.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 30px;">گزارشی یافت نشد.</td></tr>`;
    return;
  }

  tbody.innerHTML = reports.map(r => {
    // استایل اختصاصی برای موارد پنهان‌شده (شبیه ویندوز - کمی محو)
    const rowStyle = r._isHidden ? 'opacity: 0.5; background: #f8fafc;' : '';
    const typeTitle = typeLabels[r.reportType] || "گزارش";
    let subject = r.incidentSubject || r.notes || '—';
    
    if (r.reportType === 'patrol') subject = `${r.locationLabel} / ${r.postLabel}`;
    else if (r.reportType === 'illness') subject = r.patientName || '—';
    else if (r.reportType === 'fire') subject = r.fireLocation || '—';
    else if (r.reportType === 'theft') subject = r.theftItemDesc || '—';
    else if (r.reportType === 'ceremony') subject = r.cerName || '—';
    else if (r.reportType === 'mission') subject = `${r.missionPersonnelName} - ${r.missionLocation}`;
    else if (r.reportType === 'gathering') subject = r.gatheringSubject || '—';
    else if (r.reportType === 'disciplinary') subject = r.discName || '—';

    return `
      <tr style="${rowStyle}">
        <td><span class="dash-status ${r._status}">${statusLabels[r._status] || r._status}</span></td>
        <td style="font-weight: 600;">${typeTitle}</td>
        <td>${subject}</td>
        <td>${r.reporterName || '—'}</td>
        <td style="direction: ltr; text-align: right; font-family: monospace;">${r.reportDate || '—'} - ${r.reportTime || ''}</td>
        <td>
          <div class="table-actions">
            ${r.photoUrl ? `<a href="${r.photoUrl}" target="_blank" class="btn-table" title="عکس">📷</a>` : ''}
            <button class="btn-table action-btn" data-action="view" data-id="${r._dbId}" title="مشاهده">👁</button>
            <button class="btn-table action-btn" data-action="download" data-id="${r._dbId}" title="دانلود">📥</button>
            
            ${r._isHidden 
              ? `<button class="btn-table action-btn" data-action="unhide" data-id="${r._dbId}" title="نمایش مجدد">👁️‍🗨️</button>`
              : `<button class="btn-table action-btn btn-hide-row" data-action="hide" data-id="${r._dbId}" title="پنهان کردن">🙈</button>`
            }
            
            <button class="btn-table action-btn btn-delete-row" data-action="delete" data-id="${r._dbId}" title="حذف کامل">🗑</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function setupTableEvents() {
  const tbody = document.getElementById("dashboardTableBody");
  tbody.addEventListener("click", async (e) => {
    const btn = e.target.closest(".action-btn");
    if (!btn) return;
    
    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === "view") openModal(id);
    else if (action === "download") downloadSingleReport(id);
    else if (action === "hide") await toggleVisibility(id, true);
    else if (action === "unhide") await toggleVisibility(id, false);
    else if (action === "delete") await deleteReportPermanently(id);
  });
}

// ---------------------------------------------------------
// توابع اصلی (پنهان کردن و نمایش)
// ---------------------------------------------------------
async function toggleVisibility(dbId, shouldHide) {
  const { data: report, error: getErr } = await supabaseClient.from('reports').select('hidden_by').eq('id', dbId).single();
  if (getErr) return showToast("خطا در ارتباط با سرور", "error");
  
  let hidden = report.hidden_by || [];
  
  if (shouldHide) {
    if (!hidden.includes(currentUserId)) hidden.push(currentUserId);
  } else {
    hidden = hidden.filter(id => id !== currentUserId);
  }
  
  const { error } = await supabaseClient.from('reports').update({ hidden_by: hidden }).eq('id', dbId);
  if (error) return showToast("خطا در تغییر وضعیت", "error");
  
  const rep = allReports.find(r => r._dbId === dbId);
  if (rep) rep._isHidden = shouldHide;
  
  updateKPIs(); 
  applyFilters();
  
  showToast(shouldHide ? "🙈 گزارش پنهان شد" : "👁️‍🗨️ گزارش نمایش داده شد", "success");
}

function downloadSingleReport(dbId) {
  const r = allReports.find(rep => rep._dbId === dbId);
  if (!r) return showToast("گزارش پیدا نشد", "error");

  const row = { 'وضعیت': statusLabels[r._status] || r._status, 'نوع گزارش': typeLabels[r.reportType] || r.reportType };
  for (const [k, v] of Object.entries(r)) {
    if (k.startsWith('_') || ['id', 'createdAt', 'photoUrl', 'photo', 'reportType', 'reporterId', 'location', 'post', 'personnelIds', 'fireStaffIds', 'missionPersonnelId', 'missionGroupStaffIds'].includes(k)) continue;
    if (!v || (Array.isArray(v) && v.length === 0)) continue;
    row[excelLabels[k] || k] = Array.isArray(v) ? v.join(' | ') : v;
  }

  const ws = XLSX.utils.json_to_sheet([row]);
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "گزارش");
  const wbout = XLSX.write(wb, {bookType:'xlsx', type:'array'});
  const blob = new Blob([wbout], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
  const url = URL.createObjectURL(blob);
  const safeDate = r.reportDate || r.fireDate || r.missionStartDate || r.gatheringDate || 'بدون-تاریخ';
  
  const a = document.createElement("a");
  a.href = url; a.download = `Report-${safeDate.replace(/\//g, '-')}.xlsx`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  showToast("📥 دانلود شد", "success");
}

async function deleteReportPermanently(dbId) {
  if (!confirm("⚠️ هشدار: حذف کامل از دیتابیس! مطمئنید؟")) return;
  const { error } = await supabaseClient.from('reports').delete().eq('id', dbId);
  if (error) return showToast("خطا در حذف", "error");
  
  allReports = allReports.filter(r => r._dbId !== dbId);
  updateKPIs(); applyFilters();
  showToast("🗑️ حذف شد", "success");
}

// ---------------------------------------------------------
// تنظیمات فیلترها و هدر
// ---------------------------------------------------------
function setupHeaderEvents() {
  const userMenuBtn = document.getElementById('userMenuBtn');
  const userDropdown = document.getElementById('userDropdown');
  
  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      userDropdown.classList.toggle('hidden');
      userMenuBtn.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (!userDropdown.classList.contains('hidden') && !userDropdown.contains(e.target) && !userMenuBtn.contains(e.target)) {
        userDropdown.classList.add('hidden');
        userMenuBtn.classList.remove('active');
      }
    });
  }
  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
    window.location.href = 'index.html';
  });
}

function setupFilterEvents() {
  document.getElementById("applyFilterBtn").addEventListener("click", applyFilters);
  document.getElementById("resetFilterBtn").addEventListener("click", () => {
    document.getElementById("filterDateFrom").value = ""; document.getElementById("filterDateTo").value = "";
    document.getElementById("filterType").value = ""; document.getElementById("filterLocation").value = "";
    document.getElementById("filterStatus").value = ""; document.getElementById("filterReporter").value = "";
    applyFilters();
  });

  // دکمه نمایش/عدم نمایش موارد پنهان (شبیه ویندوز)
  const toggleBtn = document.getElementById("toggleHiddenBtn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      showHiddenReports = !showHiddenReports;
      if (showHiddenReports) {
        toggleBtn.innerHTML = "🙈 مخفی کردن موارد پنهان";
        toggleBtn.style.color = "var(--primary)";
        toggleBtn.style.borderColor = "var(--primary)";
      } else {
        toggleBtn.innerHTML = "👁️ نمایش موارد پنهان";
        toggleBtn.style.color = "var(--warning)";
        toggleBtn.style.borderColor = "var(--warning)";
      }
      applyFilters();
    });
  }

  document.getElementById("exportFullExcelBtn").addEventListener("click", () => {
    const reports = window.currentFilteredReports || allReports.filter(r => !r._isHidden);
    if (!reports.length) return showToast("گزارشی نیست", "error");
    
    const exportData = reports.map(r => {
      const row = { 'وضعیت': statusLabels[r._status] || r._status, 'نوع': typeLabels[r.reportType] || r.reportType };
      for (const [k, v] of Object.entries(r)) {
        if (k.startsWith('_') || ['id', 'createdAt', 'photoUrl', 'photo', 'reportType', 'reporterId', 'location', 'post', 'personnelIds', 'fireStaffIds'].includes(k)) continue;
        if (!v || (Array.isArray(v) && v.length === 0)) continue;
        row[excelLabels[k] || k] = Array.isArray(v) ? v.join(' | ') : v;
      }
      return row;
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "گزارش‌ها");
    XLSX.writeFile(wb, `Dashboard-${new Date().toISOString().slice(0,10)}.xlsx`);
    showToast("📥 خروجی اکسل دانلود شد", "success");
  });
}

function setupModalEvents() {
  document.getElementById("closeModalBtn").addEventListener("click", () => {
    document.getElementById("detailsModal").classList.add("hidden");
    selectedReportIdForModal = null;
  });
  document.getElementById("markAsReadBtn").addEventListener("click", () => updateReportStatus('read'));
  document.getElementById("markAsFollowUpBtn").addEventListener("click", () => updateReportStatus('follow_up'));
}

function openModal(dbId) {
  const r = allReports.find(rep => rep._dbId === dbId);
  if (!r) return;
  selectedReportIdForModal = dbId;

  document.getElementById("markAsReadBtn").style.display = r._status === 'read' ? 'none' : 'flex';
  document.getElementById("markAsFollowUpBtn").style.display = r._status === 'follow_up' ? 'none' : 'flex';

  let html = '';
  const labels = { reportType: "نوع گزارش", reportDate: "تاریخ", reportTime: "ساعت", reporterName: "ثبت‌کننده", notes: "توضیحات", locationLabel: "محل", postLabel: "پست", status: "وضعیت", personnelNames: "پرسنل", patientName: "بیمار", fireLocation: "محل حریق", incidentSubject: "موضوع", incidentDesc: "شرح", missionLocation: "محل", gatheringSubject: "موضوع تجمع" };

  for (const [k, v] of Object.entries(r)) {
    if (k.startsWith('_') || ['id', 'createdAt', 'photoUrl', 'photo', 'reportType', 'reporterId', 'location', 'post', 'personnelIds', 'fireStaffIds'].includes(k)) continue;
    if (!v || (Array.isArray(v) && v.length === 0)) continue;
    
    let val = Array.isArray(v) ? v.join(' | ') : v;
    if (k === 'reportType') val = typeLabels[v] || v;
    if (k === 'status') val = { normal: "عادی", needs_attention: "نیازمند توجه", issue: "مشکل‌دار" }[v] || v;
    
    html += `<div class="detail-row"><span class="detail-label">${labels[k] || k}</span><span class="detail-value">${val}</span></div>`;
  }
  document.getElementById("modalBody").innerHTML = html;
  document.getElementById("detailsModal").classList.remove("hidden");
}

async function updateReportStatus(newStatus) {
  if (!selectedReportIdForModal) return;
  const { error } = await supabaseClient.from('reports').update({ status: newStatus }).eq('id', selectedReportIdForModal);
  if (error) return showToast("خطا", "error");
  
  const rep = allReports.find(r => r._dbId === selectedReportIdForModal);
  if (rep) rep._status = newStatus;
  
  showToast("✅ وضعیت تغییر کرد", "success");
  document.getElementById("detailsModal").classList.add("hidden");
  updateKPIs(); applyFilters();
}

let toastTimer;
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

function exportPersonnelToExcel() {
  if (!allPersonnelData || allPersonnelData.length === 0) {
    return showToast("لیست پرسنل خالی است", "error");
  }

  // مرتب‌سازی الفبایی قبل از خروجی
  const sorted = [...allPersonnelData].sort((a, b) => a.full_name.localeCompare(b.full_name, 'fa'));

  const exportData = sorted.map((p, idx) => ({
    'ردیف': idx + 1,
    'نام و نام خانوادگی': p.full_name,
    'کد ملی': p.national_id || '',
    'شماره شبا': p.shaba || '',
    'شماره تلفن': p.phone || '',
    'مسئول ثبت گزارش': p.can_report ? 'بله' : 'خیر',
    'وضعیت': p.is_active ? 'فعال' : 'غیرفعال'
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  // تنظیم عرض ستون‌ها
  ws['!cols'] = [
    { wch: 6 },  // ردیف
    { wch: 30 }, // نام
    { wch: 15 }, // کد ملی
    { wch: 30 }, // شبا
    { wch: 15 }, // تلفن
    { wch: 18 }, // مسئول ثبت
    { wch: 10 }  // وضعیت
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "لیست پرسنل");

  const today = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Personnel-List-${today}.xlsx`);
  showToast("📥 لیست پرسنل دانلود شد", "success");
}
