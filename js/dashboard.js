/* =========================================================
   منطق داشبورد مدیریتی (نسخه پایدار و ضدباگ)
   ========================================================= */

let allReports = [];
let currentUserRole = 'user';
let selectedReportIdForModal = null;
let myChart = null;
let currentUserId = null; // متغیر سراسری برای شناسه کاربر

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

// لیبل‌های فارسی برای خروجی اکسل
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

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // ۱. بررسی لاگین بودن
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) { window.location.href = 'index.html'; return; }
    currentUserId = session.user.id; // ذخیره شناسه کاربر برای استفاده در توابع دیگر

    // ۲. بررسی نقش مدیر
    const { data: profile, error: profileErr } = await supabaseClient
      .from('profiles')
      .select('role, email')
      .eq('id', session.user.id)
      .single();

    if (profileErr || !profile || profile.role !== 'admin') {
      alert("شما دسترسی به داشبورد ندارید.");
      window.location.href = 'index.html';
      return;
    }

    // ۳. تنظیم هدر
    document.getElementById('userEmail').textContent = profile.email;
    document.getElementById('userMenuContainer').classList.remove('hidden');
    setupHeaderEvents();

    // ۴. بارگذاری داده‌ها
    await fetchAllReports();
    populateLocationFilter();
    applyFilters();
    
    // ۵. تنظیم رویدادها
    setupTableEvents();
    setupFilterEvents();
    setupModalEvents();
    
  } catch (err) {
    console.error("Dashboard Init Error:", err);
    document.getElementById("dashboardTableBody").innerHTML = `<tr><td colspan="6" style="text-align:center; color:red; padding: 30px;">خطا در بارگذاری داشبورد. لطفاً کنسول (F12) را بررسی کنید.</td></tr>`;
  }
});

// ---------------------------------------------------------
// توابع دریافت داده و نمایش
// ---------------------------------------------------------
async function fetchAllReports() {
  const tbody = document.getElementById("dashboardTableBody");
  tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 30px;">در حال بارگذاری...</td></tr>`;

  const { data, error } = await supabaseClient.from('reports').select('*').order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red; padding: 30px;">خطا در دریافت اطلاعات</td></tr>`;
    return;
  }

  // فقط گزارش‌هایی که توسط ادمین پنهان نشده‌اند
  allReports = data
    .filter(r => {
       const hiddenBy = r.hidden_by || [];
       return !hiddenBy.includes(currentUserId);
    })
    .map(r => ({ ...r.details, _dbId: r.id, _status: r.status, _createdAt: r.created_at }));

  updateKPIs();
}

function updateKPIs() {
  const total = allReports.length;
  const unread = allReports.filter(r => r._status === 'unread').length;
  const followup = allReports.filter(r => r._status === 'follow_up').length;
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const todayCount = allReports.filter(r => new Date(r._createdAt) > oneDayAgo).length;

  document.getElementById("kpiTotal").textContent = total;
  document.getElementById("kpiUnread").textContent = unread;
  document.getElementById("kpiFollowup").textContent = followup;
  document.getElementById("kpiToday").textContent = todayCount;

  drawChart();
}

function drawChart() {
  const counts = {};
  allReports.forEach(r => { counts[r.reportType] = (counts[r.reportType] || 0) + 1; });
  const labels = Object.keys(counts).map(k => typeLabels[k] || k);
  const data = Object.values(counts);
  const ctx = document.getElementById('reportsChart').getContext('2d');
  
  if (myChart) myChart.destroy();
  myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{ data: data, backgroundColor: ['#2563eb', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#84cc16'], borderWidth: 2, borderColor: '#fff' }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { family: 'Vazirmatn' } } } } }
  });
}

// ---------------------------------------------------------
// فیلترها و رندر جدول
// ---------------------------------------------------------
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

function applyFilters() {
  const dateFrom = document.getElementById("filterDateFrom").value.trim();
  const dateTo = document.getElementById("filterDateTo").value.trim();
  const type = document.getElementById("filterType").value;
  const location = document.getElementById("filterLocation").value;
  const status = document.getElementById("filterStatus").value;
  const reporter = document.getElementById("filterReporter").value.trim().toLowerCase();

  let filtered = [...allReports];

  if (dateFrom) filtered = filtered.filter(r => r.reportDate && r.reportDate >= dateFrom);
  if (dateTo) filtered = filtered.filter(r => r.reportDate && r.reportDate <= dateTo);
  if (type) filtered = filtered.filter(r => r.reportType === type);
  if (status) filtered = filtered.filter(r => r._status === status);
  if (reporter) filtered = filtered.filter(r => r.reporterName && r.reporterName.toLowerCase().includes(reporter));
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
      <tr>
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
            <button class="btn-table action-btn btn-hide-row" data-action="hide" data-id="${r._dbId}" title="پنهان">🙈</button>
            <button class="btn-table action-btn btn-delete-row" data-action="delete" data-id="${r._dbId}" title="حذف">🗑</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// ---------------------------------------------------------
// Event Delegation (راه‌حل قطعی برای فعال بودن دکمه‌ها)
// ---------------------------------------------------------
function setupTableEvents() {
  const tbody = document.getElementById("dashboardTableBody");
  tbody.addEventListener("click", async (e) => {
    const btn = e.target.closest(".action-btn");
    if (!btn) return;
    
    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === "view") openModal(id);
    else if (action === "download") downloadSingleReport(id);
    else if (action === "hide") await hideReportFromDashboard(id);
    else if (action === "delete") await deleteReportPermanently(id);
  });
}

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

// ---------------------------------------------------------
// عملیات روی گزارش‌ها (دانلود، پنهان، حذف)
// ---------------------------------------------------------
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

async function hideReportFromDashboard(dbId) {
  if (!confirm("این گزارش از دید شما پنهان شود؟")) return;
  const { data: report, error: getErr } = await supabaseClient.from('reports').select('hidden_by').eq('id', dbId).single();
  if (getErr) return showToast("خطا در خواندن", "error");
  
  const hidden = report.hidden_by || [];
  if (!hidden.includes(currentUserId)) {
    hidden.push(currentUserId);
    const { error } = await supabaseClient.from('reports').update({ hidden_by: hidden }).eq('id', dbId);
    if (error) return showToast("خطا در پنهان‌سازی", "error");
    
    allReports = allReports.filter(r => r._dbId !== dbId);
    updateKPIs(); applyFilters();
    showToast("🙈 پنهان شد", "success");
  }
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
// مودال و تنظیمات فیلتر
// ---------------------------------------------------------
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

function closeModal() {
  document.getElementById("detailsModal").classList.add("hidden");
  selectedReportIdForModal = null;
}

async function updateReportStatus(newStatus) {
  if (!selectedReportIdForModal) return;
  const { error } = await supabaseClient.from('reports').update({ status: newStatus }).eq('id', selectedReportIdForModal);
  if (error) return showToast("خطا", "error");
  
  const rep = allReports.find(r => r._dbId === selectedReportIdForModal);
  if (rep) rep._status = newStatus;
  
  showToast("✅ وضعیت تغییر کرد", "success");
  closeModal(); updateKPIs(); applyFilters();
}

function setupFilterEvents() {
  document.getElementById("applyFilterBtn").addEventListener("click", applyFilters);
  document.getElementById("resetFilterBtn").addEventListener("click", () => {
    document.getElementById("filterDateFrom").value = ""; document.getElementById("filterDateTo").value = "";
    document.getElementById("filterType").value = ""; document.getElementById("filterLocation").value = "";
    document.getElementById("filterStatus").value = ""; document.getElementById("filterReporter").value = "";
    applyFilters();
  });
  document.getElementById("exportFullExcelBtn").addEventListener("click", () => {
    const reports = window.currentFilteredReports || allReports;
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
  document.getElementById("closeModalBtn").addEventListener("click", closeModal);
  document.getElementById("markAsReadBtn").addEventListener("click", () => updateReportStatus('read'));
  document.getElementById("markAsFollowUpBtn").addEventListener("click", () => updateReportStatus('follow_up'));
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
