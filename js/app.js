/* =========================================================
   منطق فرم گزارش حفاظت فیزیکی
   ========================================================= */

const STORAGE_KEY = "guard_reports_v1";
const $ = (sel) => document.querySelector(sel);

document.addEventListener("DOMContentLoaded", () => {
  initLocationSelect();
  initReporterSelect();
  initJalaliDatePicker();
  initReportTypeToggle();
  initIllnessConditionals();
  initPersonnelSearch();
  initStatusToggle();
  initFormReset();
  initCeremonyStaff();
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

    const labels = {
      reportDate: "تاریخ گزارش", reportTime: "ساعت گزارش", reporterName: "ثبت‌کننده", 
      locationLabel: "محل", postLabel: "پست", status: "وضعیت", personnelNames: "پرسنل حاضر", notes: "توضیحات",
      patientType: "نوع بیمار", patientOtherReason: "علت حضور", patientName: "نام بیمار",
      patientId: "شماره دانشجویی/پرسنلی", patientUnit: "دانشکده/واحد/خوابگاه",
      illnessLocation: "محل دقیق وقوع", visitReason: "علت مراجعه", companionName: "همراه", 
      companionId: "شماره همراه", companionPhone: "تلفن همراه", actionType: "نوع اقدام", 
      emergencyCalledTime: "ساعت تماس با اورژانس", emergencyArrivedTime: "ساعت رسیدن اورژانس", 
      illnessDestination: "مقصد", transportMethod: "نحوه انتقال", reportSource: "منبع اعلام",
      returnTime: "ساعت بازگشت", returnDestination: "مقصد بازگشت",
      incidentType: "نوع مورد", incidentDesc: "شرح واقعه", incidentActions: "اقدامات انجام‌شده", incidentAnalysis: "تحلیل", incidentFollowUp: "نیاز به پیگیری",
      theftItemType: "نوع مال", theftItemDesc: "شرح مال", theftAssetNo: "شماره اموال",
      theftValue: "تخمین ارزش (ریال)", theftLocation: "محل دقیق", theftDiscoverTime: "زمان کشف",
      theftProbableTime: "زمان وقوع احتمالی", theftVictimName: "مالباخته", theftVictimPhone: "تلفن مالباخته",
      theftDoorStatus: "وضعیت قفل/درب", theftEvidence: "شواهد", theftActions: "اقدامات",
      theftPoliceCase: "شماره پرونده", theftFollowUp: "نیاز به پیگیری",
      discDate: "تاریخ وقوع", discTime: "ساعت وقوع", discType: "نوع تخلف", discName: "متخلف", discId: "شماره دانشجویی/پرسنلی", discUnit: "واحد", discLocation: "محل", discDesc: "شرح تخلف", discWitness: "شاهد", discActions: "اقدامات اولیه", discRef: "ارجاع به", discCaseNo: "شماره پرونده", discFollowUp: "نیاز به پیگیری",
      cerName: "نام برنامه", cerOrganizer: "برگزارکننده", cerDate: "تاریخ برگزاری", cerLocation: "مکان", cerStartTime: "ساعت شروع", cerEndTime: "ساعت پایان", cerStaff: "نیروها",
      theftItemType: "نوع مال", theftItemDesc: "شرح مال", theftAssetNo: "شماره اموال", theftValue: "تخمین ارزش (ریال)",
      theftLocation: "محل سرقت", theftDiscoverTime: "زمان کشف", theftProbableTime: "زمان وقوع احتمالی",
      theftVictimName: "مالباخته", theftVictimPhone: "تلفن مالباخته", theftDoorStatus: "وضعیت قفل/درب",
      theftEvidence: "شواهد", theftActions: "اقدامات", theftPoliceCase: "شماره پرونده", theftFollowUp: "نیاز به پیگیری",
      discDate: "تاریخ وقوع", discTime: "ساعت وقوع", discType: "نوع تخلف", discName: "متخلف", discId: "شماره دانشجویی/پرسنلی", discUnit: "واحد", discLocation: "محل", discDesc: "شرح تخلف", discWitness: "شاهد", discActions: "اقدامات اولیه", discRef: "ارجاع به", discCaseNo: "شماره پرونده", discFollowUp: "نیاز به پیگیری",
      cerName: "نام برنامه", cerOrganizer: "برگزارکننده", cerDate: "تاریخ برگزاری", cerLocation: "مکان", cerStartTime: "ساعت شروع", cerEndTime: "ساعت پایان", cerStaff: "نیروها",
      discType: "نوع تخلف", discName: "متخلف", discId: "شماره دانشجویی/پرسنلی", discUnit: "واحد",
      discLocation: "محل", discDesc: "شرح تخلف", discWitness: "شاهد", discActions: "اقدامات اولیه", 
      discRef: "ارجاع به", discCaseNo: "شماره پرونده", discFollowUp: "نیاز به پیگیری",
      cerName: "نام برنامه", cerOrganizer: "برگزارکننده", cerDate: "تاریخ برگزاری", cerLocation: "مکان", cerStartTime: "ساعت شروع", cerEndTime: "ساعت پایان", cerStaff: "نیروها",
      cerName: "نام برنامه", cerDate: "تاریخ برگزاری", cerLocation: "مکان", cerStartTime: "ساعت شروع",
      cerEndTime: "ساعت پایان", cerOrganizer: "برگزارکننده", cerStaff: "نیروها"
    };

    const valueTranslations = {
      status: { normal: "عادی", needs_attention: "نیازمند توجه", issue: "مشکل‌دار" },
      patientType: { student: "دانشجو", professor: "استاد", employee: "کارمند", other: "سایر" },
      visitReason: { cardiac: "قلبی", respiratory: "تنفسی", digestive: "گوارشی", headache: "سردرد", injury: "آسیب دیدگی", fever: "تب", other: "سایر" },
      actionType: { clinic: "انتقال به درمانگاه", hospital: "انتقال به بیمارستان", onSiteEmergency: "درمان در محل توسط اورژانس", onSitePersonnel: "درمان در محل توسط پرسنل", other: "سایر" },
      illnessDestination: { mosleminClinic: "درمانگاه مسلمین", namaziHospital: "بیمارستان نمازی", uniClinic: "درمانگاه دانشگاه", other: "سایر" },
      transportMethod: { emergency: "اورژانس", personalCar: "خودروی شخصی", other: "سایر" },
      reportSource: { external: "از بیرون", internal: "داخلی", self: "خود بیمار" },
      returnDestination: { university: "دانشگاه", dorm: "خوابگاه", home: "منزل", other: "سایر" },
      incidentType: { fire: "کشف حریق", fight: "درگیری", vandalism: "تخریب", gathering: "تجمع", other: "سایر" },
      incidentFollowUp: { yes: "بله", no: "خیر" },
      theftItemType: { equipment: "تجهیزات", money: "پول", personal: "وسایل شخصی", other: "سایر" },
      theftDoorStatus: { intact: "سالم", broken: "شکسته", open: "باز" },
      theftActions: { police: "تماس با پلیس", security: "تماس با حراست", cctv: "بررسی دوربین", other: "سایر" },
      theftFollowUp: { yes: "بله", no: "خیر" },
      discType: { student: "تخلفات دانشجویی", employee: "تخلفات اداری" },
      discRef: { committee: "کمیته انضباطی", security: "حراست", education: "آموزش", other: "سایر" },
      discFollowUp: { yes: "بله", no: "خیر" }
    };

    const wb = XLSX.utils.book_new();
    const typesMap = { patrol: "گشت شبانه", illness: "گزارش بیماری", incident: "گزارش موردی", theft: "گزارش سرقت", disciplinary: "تخلف انضباطی", ceremony: "مراسمات" };
    let hasData = false;

    for (const type in typesMap) {
      const typeReports = reports.filter(r => r.reportType === type);
      if (typeReports.length === 0) continue;
      hasData = true;

      let cols = [];
      if (type === 'patrol') {
        cols = ['reportDate', 'reportTime', 'reporterName', 'locationLabel', 'postLabel', 'status', 'personnelNames', 'notes'];
      } else if (type === 'ceremony') {
        cols = ['reportDate', 'reportTime', 'reporterName', 'cerName', 'cerOrganizer', 'cerDate', 'cerLocation', 'cerStartTime', 'cerEndTime', 'cerStaff', 'notes'];
        
        // ساخت شیت جداگانه برای نیروهای هر مراسم
        typeReports.forEach((cer, index) => {
          if (cer.cerStaff && cer.cerStaff.length > 0) {
            const staffData = cer.cerStaff.map(s => ({
              'نام نیرو': s.name,
              'سمت': s.role || '',
              'ساعت حضور': s.hours || '',
              'کد ملی': s.nationalId || '',
              'شماره شبا': s.shaba || ''
            }));
            const staffWs = XLSX.utils.json_to_sheet(staffData);
            let baseName = cer.cerName ? cer.cerName : 'مراسم';
            let sheetName = `نیروهای ${baseName}`.substring(0, 25);
            if (index > 0) sheetName += ` (${index})`; // جلوگیری از تکراری بودن نام شیت
            XLSX.utils.book_append_sheet(wb, staffWs, sheetName);
          }
        });
      } else if (type === 'disciplinary') {
        cols = ['reportDate', 'reportTime', 'reporterName', 'discDate', 'discTime', 'discType', 'discName', 'discId', 'discUnit', 'discLocation', 'discDesc', 'discWitness', 'discActions', 'discRef', 'discCaseNo', 'discFollowUp', 'notes'];
      } else if (type === 'theft') {
        cols = ['reportDate', 'reportTime', 'reporterName', 'theftItemType', 'theftItemDesc', 'theftAssetNo', 'theftValue', 'theftLocation', 'theftDiscoverTime', 'theftProbableTime', 'theftVictimName', 'theftVictimPhone', 'theftDoorStatus', 'theftEvidence', 'theftActions', 'theftPoliceCase', 'theftFollowUp', 'notes'];
      } else if (type === 'incident') {
        cols = ['reportDate', 'reportTime', 'reporterName', 'incidentType', 'incidentDesc', 'incidentActions', 'incidentAnalysis', 'incidentFollowUp', 'notes'];
      } else if (type === 'illness') {
        cols = ['reportDate', 'reportTime', 'reporterName', 'patientType', 'patientName', 'patientId', 'patientUnit', 'patientOtherReason', 'illnessLocation', 'visitReason', 'companionName', 'companionId', 'companionPhone', 'actionType', 'emergencyCalledTime', 'emergencyArrivedTime', 'illnessDestination', 'transportMethod', 'reportSource', 'returnTime', 'returnDestination', 'notes'];
      } else {
        const keys = new Set();
        typeReports.forEach(r => Object.keys(r).forEach(k => { if (!['id','createdAt','photo','reportType'].includes(k)) keys.add(k); }));
        cols = Array.from(keys);
      }

      const data = typeReports.map(r => {
        const row = {};
        cols.forEach(c => {
          let val = r[c];
          if (Array.isArray(val)) {
            if (c === 'cerStaff') {
              val = val.map(s => `${s.name} (${s.role || 'بدون سمت'}) - ${s.hours || 0} ساعت`).join(" | ");
            } else {
              val = val.join(" | ");
            }
          }
          else if (valueTranslations[c] && valueTranslations[c][val]) val = valueTranslations[c][val];
          if (val === undefined || val === null) val = "";
          row[labels[c] || c] = val;
        });
        return row;
      });

      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, typesMap[type]);
    }

    if (!hasData) return showToast("گزارشی برای خروجی وجود ندارد", "error");

    const wbout = XLSX.write(wb, {bookType:'xlsx', type:'array'});
    const blob = new Blob([wbout], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
    const url = URL.createObjectURL(blob);
    smartDownload(url, `guard-reports-${new Date().toISOString().slice(0,10)}.xlsx`, blob);
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
    renumberSections();
  }

  statusSelect.addEventListener("change", syncDetailsVisibility);
  syncDetailsVisibility();
}




function initFormSubmit() {
  const form = $("#guardForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const reportType = form.querySelector(`input[name="reportType"]:checked`)?.value;
    const reportDate = $("#reportDate").value.trim();
    const reportTime = $("#reportTime").value;
    const reporterId = $("#reporterId").value;
    const notes = $("#notes").value.trim();
    const photoFile = $("#photo").files[0];

    if (!reportDate) return showToast("لطفاً تاریخ را وارد کنید", "error");
    if (!reportTime) return showToast("لطفاً ساعت را وارد کنید", "error");
    if (!reporterId) return showToast("لطفاً ثبت‌کننده گزارش را انتخاب کنید", "error");

    const reporterPerson = PERSONNEL.find(p => p.id === reporterId);
    const reporterName = reporterPerson ? reporterPerson.fullName : "";

    const report = {
      id: "r_" + Date.now(),
      reportType,
      reportDate,
      reportTime,
      reporterId,
      reporterName,
      notes,
      createdAt: new Date().toISOString()
    };

    // فیلدهای اختصاصی بر اساس نوع
    if (reportType === "patrol") {
      const location = $("#location").value;
      const post = $("#post").value;
      const status = $("#status").value;
      const personnelIdsRaw = $("#personnelIds").value;
      let personnelIds = [];
      try { personnelIds = JSON.parse(personnelIdsRaw || "[]"); } catch (err) { personnelIds = []; }

      if (!location) return showToast("لطفاً محل بازدید را انتخاب کنید", "error");
      if (!post) return showToast("لطفاً نوع پست را انتخاب کنید", "error");
      if (!status) return showToast("لطفاً وضعیت پست را انتخاب کنید", "error");

      report.location = location;
      report.locationLabel = LOCATIONS.find(l => l.name === location)?.label || location;
      report.post = post;
      report.postLabel = POSTS.find(p => p.name === post)?.label || post;
      report.status = status;
      report.personnelIds = personnelIds;
      report.personnelNames = personnelIds.map(id => {
        const p = PERSONNEL.find(x => x.id === id);
        return p ? p.fullName : id;
      });
      if (status === "normal") report.notes = "";
    } else if (reportType === "illness") {
      report.patientType = $("#patientType").value;
      report.patientOtherReason = $("#patientOtherReason").value.trim();
      report.patientName = $("#patientName").value.trim();
      report.patientId = $("#patientId").value.trim();
      report.patientUnit = $("#patientUnit").value.trim();
      report.illnessLocation = $("#illnessLocation").value.trim();
      report.visitReason = $("#visitReason").value;
      report.companionName = $("#companionName").value.trim();
      report.companionId = $("#companionId").value.trim();
      report.companionPhone = $("#companionPhone").value.trim();
      report.actionType = $("#actionType").value;
      report.emergencyCalledTime = $("#emergencyCalledTime").value;
      report.emergencyArrivedTime = $("#emergencyArrivedTime").value;
      report.illnessDestination = $("#illnessDestination").value;
      report.transportMethod = $("#transportMethod").value;
      report.reportSource = $("#reportSource").value;
      report.returnTime = $("#returnTime").value;
      report.returnDestination = $("#returnDestination").value;

      if (!report.patientName) return showToast("لطفاً نام بیمار را وارد کنید", "error");
    } else if (reportType === "incident") {
      report.incidentType = $("#incidentType").value;
      report.incidentDesc = $("#incidentDesc").value.trim();
      report.incidentActions = $("#incidentActions").value.trim();
      report.incidentAnalysis = $("#incidentAnalysis").value.trim();
      report.incidentFollowUp = $("#incidentFollowUp").value;

      if (!report.incidentType) return showToast("لطفاً نوع مورد را انتخاب کنید", "error");
      if (!report.incidentDesc) return showToast("لطفاً شرح واقعه را وارد کنید", "error");
    } else if (reportType === "theft") {
      report.theftItemType = $("#theftItemType").value;
      report.theftItemDesc = $("#theftItemDesc").value.trim();
      report.theftAssetNo = $("#theftAssetNo").value.trim();
      report.theftValue = $("#theftValue").value.trim();
      report.theftLocation = $("#theftLocation").value.trim();
      report.theftDiscoverTime = $("#theftDiscoverTime").value;
      report.theftProbableTime = $("#theftProbableTime").value;
      report.theftVictimName = $("#theftVictimName").value.trim();
      report.theftVictimPhone = $("#theftVictimPhone").value.trim();
      report.theftDoorStatus = $("#theftDoorStatus").value;
      report.theftEvidence = $("#theftEvidence").value.trim();
      report.theftActions = $("#theftActions").value;
      report.theftPoliceCase = $("#theftPoliceCase").value.trim();
      report.theftFollowUp = $("#theftFollowUp").value;

      if (!report.theftItemType) return showToast("لطفاً نوع مال را انتخاب کنید", "error");
      if (!report.theftItemDesc) return showToast("لطفاً شرح مال را وارد کنید", "error");
      if (!report.theftLocation) return showToast("لطفاً محل دقیق سرقت را وارد کنید", "error");
      if (!report.theftVictimName) return showToast("لطفاً نام مالباخته را وارد کنید", "error");
    } else if (reportType === "disciplinary") {
      report.discDate = $("#discDate").value.trim();
      report.discTime = $("#discTime").value;
      report.discType = $("#discType").value;
      report.discName = $("#discName").value.trim();
      report.discId = $("#discId").value.trim();
      report.discUnit = $("#discUnit").value.trim();
      report.discLocation = $("#discLocation").value.trim();
      report.discDesc = $("#discDesc").value.trim();
      report.discWitness = $("#discWitness").value.trim();
      report.discActions = $("#discActions").value.trim();
      report.discRef = $("#discRef").value;
      report.discCaseNo = $("#discCaseNo").value.trim();
      report.discFollowUp = $("#discFollowUp").value;

      if (!report.discDate) return showToast("لطفاً تاریخ وقوع را وارد کنید", "error");
      if (!report.discType) return showToast("لطفاً نوع تخلف را انتخاب کنید", "error");
      if (!report.discName) return showToast("لطفاً نام متخلف را وارد کنید", "error");
      if (!report.discDesc) return showToast("لطفاً شرح تخلف را وارد کنید", "error");
    } else if (reportType === "ceremony") {
      report.cerName = $("#cerName").value.trim();
      report.cerOrganizer = $("#cerOrganizer").value.trim();
      report.cerDate = $("#cerDate").value.trim();
      report.cerLocation = $("#cerLocation").value.trim();
      report.cerStartTime = $("#cerStartTime").value;
      report.cerEndTime = $("#cerEndTime").value;

      if (!report.cerName) return showToast("لطفاً نام برنامه را وارد کنید", "error");
      if (!report.cerDate) return showToast("لطفاً تاریخ برگزاری را وارد کنید", "error");

      report.cerStaff = [];
      document.querySelectorAll(".staff-row").forEach(row => {
        const name = row.querySelector(".staff-search").value.trim();
        if (name) {
          report.cerStaff.push({
            name: name,
            role: row.querySelector(".staff-role").value.trim(),
            hours: row.querySelector(".staff-hours").value,
            nationalId: row.querySelector(".staff-national-id").value,
            shaba: row.querySelector(".staff-shaba").value
          });
        }
      });
    }

    if (photoFile) {
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
  $("#location").innerHTML = `<option value="">— انتخاب کنید —</option>`;
  LOCATIONS.forEach(loc => {
    const opt = document.createElement("option");
    opt.value = loc.name;
    opt.textContent = loc.label;
    $("#location").appendChild(opt);
  });
  $("#post").disabled = true;
  $("#post").innerHTML = `<option value="">ابتدا محل را انتخاب کنید</option>`;
  $("#personnelIds").value = "[]";
  $("#selectedChips").innerHTML = "";
  $("#reporterId").value = "";
  $("#reporterList").innerHTML = "";
  $("#selectedReporter").innerHTML = "";
  initReporterSelect();
  $("#photoPreview").hidden = true;
  $("#photoPlaceholder").hidden = false;
  $("#detailsSection").classList.remove("hidden");
  $("#illnessSection").classList.add("hidden");
  $("#incidentSection").classList.add("hidden");
  $("#incidentType").value = "";
  $("#incidentDesc").value = "";
  $("#incidentActions").value = "";
  $("#incidentAnalysis").value = "";
  $("#incidentFollowUp").value = "";
  $("#theftSection").classList.add("hidden");
  $("#theftItemType").value = "";
  $("#theftItemDesc").value = "";
  $("#theftAssetNo").value = "";
  $("#theftValue").value = "";
  $("#theftLocation").value = "";
  $("#theftDiscoverTime").value = "";
  $("#theftProbableTime").value = "";
  $("#theftVictimName").value = "";
  $("#theftVictimPhone").value = "";
  $("#theftDoorStatus").value = "";
  $("#theftEvidence").value = "";
  $("#theftActions").value = "";
  $("#theftPoliceCase").value = "";
  $("#theftFollowUp").value = "";
  $("#discSection").classList.add("hidden");
  $("#discDate").value = "";
  $("#discTime").value = "";
  $("#discType").value = "";
  $("#discName").value = "";
  $("#discId").value = "";
  $("#discUnit").value = "";
  $("#discLocation").value = "";
  $("#discDesc").value = "";
  $("#discWitness").value = "";
  $("#discActions").value = "";
  $("#discRef").value = "";
  $("#discCaseNo").value = "";
  $("#discFollowUp").value = "";
  $("#ceremonySection").classList.add("hidden");
  $("#cerName").value = "";
  $("#cerOrganizer").value = "";
  $("#cerDate").value = "";
  $("#cerLocation").value = "";
  $("#cerStartTime").value = "";
  $("#cerEndTime").value = "";
  $("#staffContainer").innerHTML = "";
  $("#locationSection").classList.remove("hidden");
  $("#personnelSection").classList.remove("hidden");
  if (typeof renumberSections === "function") renumberSections();
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
  const typeLabels = { 
    patrol: "گشت شبانه", illness: "گزارش بیماری", incident: "گزارش موردی", 
    theft: "گزارش سرقت", disciplinary: "تخلف انضباطی", ceremony: "مراسمات" 
  };

  list.innerHTML = reports.slice(0, 8).map(r => {
    let title = typeLabels[r.reportType] || "گزارش";
    let metaText = "";
    
    if (r.reportType === "patrol") {
      title += ` — ${r.locationLabel || "—"} / ${r.postLabel || "—"}`;
      const names = (r.personnelNames || []).map(n => `<span class="chip-mini">${n}</span>`).join("");
      metaText = `${names}`;
    } else if (r.reportType === "illness") {
      title += ` — ${r.patientName || "بدون نام"}`;
    } else if (r.reportType === "incident") {
      const incTypes = { fire: "کشف حریق", fight: "درگیری", vandalism: "تخریب", gathering: "تجمع", other: "سایر" };
      title += ` — ${incTypes[r.incidentType] || r.incidentType || "بدون نوع"}`;
    } else if (r.reportType === "theft") {
      title += ` — ${r.theftItemDesc || "بدون شرح"}`;
    } else if (r.reportType === "disciplinary") {
      title += ` — ${r.discName || "بدون نام"}`;
    } else if (r.reportType === "ceremony") {
      title += ` — ${r.cerName || "بدون نام"}`;
    } else {
      title += ` — ${r.notes ? r.notes.substring(0, 30) + "..." : "—"}`;
    }

    const statusHtml = r.status ? `<span class="status-pill status-${r.status}">${statusLabels[r.status] || r.status}</span>` : "";
    
    return `
      <div class="recent-item">
        <div class="recent-item-main">
          <div class="recent-item-title">
            ${title}
          </div>
          <div class="recent-item-meta">
            ${metaText} • ساعت ${r.reportTime || "—"} • تاریخ ${r.reportDate || "—"} ${statusHtml}
          </div>
        </div>
      </div>
    `;
  }).join("");
}


function initPersonnelSearch() {
  const searchInput = $("#personnelSearch");
  const listBox = $("#personnelList");
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
        toggleSelect(person.id);
      });
      chipsBox.appendChild(chip);
    });
  }

  function toggleSelect(id) {
    if (selected.some(s => s.id === id)) {
      selected = selected.filter(s => s.id !== id);
    } else {
      const p = PERSONNEL.find(x => x.id === id);
      if (p) selected.push(p);
    }
    updateHidden();
    renderChips();
    renderList(filterPersonnel(searchInput.value.trim().toLowerCase()));
  }

  function filterPersonnel(q) {
    return q
      ? PERSONNEL.filter(p => p.fullName.toLowerCase().includes(q))
      : PERSONNEL;
  }

  function renderList(items) {
    listBox.innerHTML = "";
    if (!items.length) {
      listBox.innerHTML = `<div class="personnel-empty">نتیجه‌ای یافت نشد</div>`;
      return;
    }
    items.forEach(p => {
      const isSelected = selected.some(s => s.id === p.id);
      const item = document.createElement("div");
      item.className = "personnel-item" + (isSelected ? " selected" : "");
      item.dataset.id = p.id;
      item.innerHTML = `<span>${p.fullName}</span><span class="check">✓</span>`;
      item.addEventListener("click", () => toggleSelect(p.id));
      listBox.appendChild(item);
    });
  }

  renderList(PERSONNEL);

  searchInput.addEventListener("input", () => {
    renderList(filterPersonnel(searchInput.value.trim().toLowerCase()));
  });
}





function smartDownload(url, fileName, blob) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    // ۱. تلاش برای استفاده از Web Share API (بهترین روش در موبایل)
    const file = new File([blob], fileName, { type: blob.type || "application/octet-stream" });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: "گزارش حفاظت فیزیکی" })
        .catch(err => {
          if (err.name !== "AbortError") {
            // ۲. اگر Share خطا داد (مثلا کاربر لغو کرد یا پشتیبانی نشد)، فایل را در تب جدید باز کن
            window.open(url, "_blank");
          }
        });
      return;
    }
    
    // ۳. اگر مرورگر قدیمی بود و Web Share نداشت، لینک دانلود را با target="_blank" باز کن
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    setTimeout(() => URL.revokeObjectURL(url), 10000); // زمان بیشتر برای دانلود
    return;
  }

  // دسکتاپ (دانلود مستقیم)
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast("📥 دانلود شروع شد", "success");
}

function showCsvModal(csvText, fileName) {
  const existing = document.getElementById("csvModal");
  if (existing) existing.remove();
  const cleanText = csvText.replace(/^\uFEFF/, "");
  const overlay = document.createElement("div");
  overlay.id = "csvModal";
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>خروجی CSV</h2>
        <button class="modal-close" type="button">×</button>
      </div>
      <p class="modal-hint">متن زیر را کپی کنید و در Excel یا Google Sheets پیست کنید:</p>
      <textarea class="csv-text" readonly></textarea>
      <div class="modal-actions">
        <button class="btn btn-primary csv-copy" type="button">📋 کپی متن</button>
        <button class="btn btn-secondary csv-download" type="button">📥 دانلود فایل</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  const textarea = overlay.querySelector(".csv-text");
  textarea.value = cleanText;
  overlay.querySelector(".modal-close").onclick = () => overlay.remove();
  overlay.querySelector(".csv-copy").onclick = async () => {
    try {
      await navigator.clipboard.writeText(cleanText);
      showToast("✅ متن کپی شد. در Excel پیست کنید.", "success");
    } catch (err) {
      textarea.select();
      textarea.setSelectionRange(0, 99999);
      try {
        document.execCommand("copy");
        showToast("✅ متن کپی شد.", "success");
      } catch (e) {
        showToast("⚠️ کپی نشد. دستی انتخاب کنید.", "error");
      }
    }
  };
  overlay.querySelector(".csv-download").onclick = () => {
    const blob = new Blob(["\uFEFF" + cleanText], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("📥 دانلود شروع شد", "success");
  };
}



function initJalaliDatePicker() {
  if (typeof jalaliDatepicker !== "undefined") {
    jalaliDatepicker.startWatch();
  }
}



function initReporterSelect() {
  const searchInput = $("#reporterSearch");
  const listBox = $("#reporterList");
  const chipBox = $("#selectedReporter");
  const hiddenId = $("#reporterId");

  const reporters = PERSONNEL.filter(p => REPORTERS.includes(p.id));
  let selected = null;

  function renderList(items) {
    listBox.innerHTML = "";
    if (!items.length) {
      listBox.innerHTML = `<div class="personnel-empty">نتیجه‌ای یافت نشد</div>`;
      return;
    }
    items.forEach(p => {
      const isSelected = selected && selected.id === p.id;
      const item = document.createElement("div");
      item.className = "personnel-item" + (isSelected ? " selected" : "");
      item.dataset.id = p.id;
      item.innerHTML = `<span>${p.fullName}</span><span class="check">✓</span>`;
      item.addEventListener("click", () => {
        if (selected && selected.id === p.id) {
          selected = null;
        } else {
          selected = p;
        }
        renderChip();
        renderList(filterList(searchInput.value.trim().toLowerCase()));
      });
      listBox.appendChild(item);
    });
  }

  function renderChip() {
    chipBox.innerHTML = "";
    if (!selected) {
      hiddenId.value = "";
      return;
    }
    hiddenId.value = selected.id;
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.innerHTML = `<span>${selected.fullName}</span><button type="button" class="chip-remove" title="حذف">×</button>`;
    chip.querySelector(".chip-remove").addEventListener("click", () => {
      selected = null;
      renderChip();
      renderList(filterList(searchInput.value.trim().toLowerCase()));
    });
    chipBox.appendChild(chip);
  }

  function filterList(q) {
    return q ? reporters.filter(p => p.fullName.toLowerCase().includes(q)) : reporters;
  }

  renderList(reporters);

  searchInput.addEventListener("input", () => {
    renderList(filterList(searchInput.value.trim().toLowerCase()));
  });
}


function initReportTypeToggle() {
  const locationSection = $("#locationSection");
  const personnelSection = $("#personnelSection");
  const detailsSection = $("#detailsSection");
  const illnessSection = $("#illnessSection");
  const incidentSection = $("#incidentSection");
  const theftSection = $("#theftSection");
  const discSection = $("#discSection");
  const ceremonySection = $("#ceremonySection");
  const statusSelect = $("#status");
  const radios = document.querySelectorAll(`input[name="reportType"]`);

  function sync() {
    const selected = document.querySelector(`input[name="reportType"]:checked`);
    const type = selected ? selected.value : "patrol";
    locationSection.classList.add("hidden");
    personnelSection.classList.add("hidden");
    illnessSection.classList.add("hidden");
    incidentSection.classList.add("hidden");
    theftSection.classList.add("hidden");
    discSection.classList.add("hidden");
    ceremonySection.classList.add("hidden");
    if (type === "patrol") {
      locationSection.classList.remove("hidden");
      personnelSection.classList.remove("hidden");
      if (statusSelect.value === "normal") {
        detailsSection.classList.add("hidden");
      } else {
        detailsSection.classList.remove("hidden");
      }
    } else if (type === "illness") {
      illnessSection.classList.remove("hidden");
      detailsSection.classList.remove("hidden");
    } else if (type === "incident") {
      incidentSection.classList.remove("hidden");
      detailsSection.classList.remove("hidden");
    } else if (type === "theft") {
      theftSection.classList.remove("hidden");
      detailsSection.classList.remove("hidden");
    } else if (type === "disciplinary") {
      discSection.classList.remove("hidden");
      detailsSection.classList.remove("hidden");
    } else if (type === "ceremony") {
      ceremonySection.classList.remove("hidden");
      detailsSection.classList.remove("hidden");
    } else {
      detailsSection.classList.remove("hidden");
    }
    renumberSections();
  }

  radios.forEach(r => r.addEventListener("change", sync));
  sync();
}

function initIllnessConditionals() {
  const patientType = $("#patientType");
  const otherReasonField = $("#patientOtherReasonField");
  const actionType = $("#actionType");
  const emergencyTimesField = $("#emergencyTimesField");
  const transferFields = $("#transferFields");

  function syncPatientType() {
    if (patientType && patientType.value === "other") {
      otherReasonField.classList.remove("hidden");
    } else if (otherReasonField) {
      otherReasonField.classList.add("hidden");
    }
  }

  function syncActionType() {
    if (!actionType) return;
    const val = actionType.value;
    if (val === "clinic" || val === "hospital") {
      transferFields.classList.remove("hidden");
      emergencyTimesField.classList.remove("hidden");
    } else if (val === "onSiteEmergency") {
      transferFields.classList.add("hidden");
      emergencyTimesField.classList.remove("hidden");
    } else {
      transferFields.classList.add("hidden");
      emergencyTimesField.classList.add("hidden");
    }
  }

  if (patientType) patientType.addEventListener("change", syncPatientType);
  if (actionType) actionType.addEventListener("change", syncActionType);
  syncPatientType();
  syncActionType();
}


function toPersianDigit(n) {
  const map = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(n).split("").map(d => map[+d]).join("");
}

function renumberSections() {
  const sections = document.querySelectorAll(".form-section");
  let counter = 0;
  sections.forEach(sec => {
    if (sec.classList.contains("hidden")) return;
    counter++;
    const badge = sec.querySelector(".step-badge");
    if (badge) badge.textContent = toPersianDigit(counter);
  });
}


function initCeremonyStaff() {
  const addBtn = $("#addStaffBtn");
  const container = $("#staffContainer");
  const template = $("#staffRowTemplate");

  if (!addBtn) return;

  addBtn.addEventListener("click", () => {
    const clone = template.content.cloneNode(true);
    
    const searchInput = clone.querySelector(".staff-search");
    const natIdInput = clone.querySelector(".staff-national-id");
    const shabaInput = clone.querySelector(".staff-shaba");

    // ساخت لیست کشویی سفارشی
    const listBox = document.createElement("div");
    listBox.className = "personnel-list hidden";
    listBox.style.marginTop = "4px";
    listBox.style.maxHeight = "150px";
    listBox.style.position = "absolute";
    listBox.style.width = "calc(100% - 24px)"; // با احتساب پدینگ
    listBox.style.zIndex = "100";
    searchInput.parentNode.style.position = "relative";
    searchInput.parentNode.appendChild(listBox);

    function renderList(items) {
      listBox.innerHTML = "";
      if (!items.length) {
        listBox.innerHTML = `<div class="personnel-empty" style="padding:10px;font-size:0.85rem">نتیجه‌ای یافت نشد</div>`;
        return;
      }
      items.forEach(p => {
        const item = document.createElement("div");
        item.className = "personnel-item";
        item.style.padding = "8px 12px";
        item.style.fontSize = "0.85rem";
        item.innerHTML = `<span>${p.fullName}</span>`;
        
        // استفاده از mousedown برای جلوگیری از بسته شدن لیست قبل از کلیک
        item.addEventListener("mousedown", (e) => { 
          e.preventDefault();
          searchInput.value = p.fullName;
          natIdInput.value = p.nationalId || "";
          shabaInput.value = p.shaba || "";
          listBox.classList.add("hidden");
        });
        listBox.appendChild(item);
      });
    }

    searchInput.addEventListener("focus", () => {
      listBox.classList.remove("hidden");
      const q = searchInput.value.trim().toLowerCase();
      renderList(PERSONNEL.filter(p => p.fullName.toLowerCase().includes(q)));
    });

    searchInput.addEventListener("input", (e) => {
      listBox.classList.remove("hidden");
      const q = e.target.value.trim().toLowerCase();
      renderList(PERSONNEL.filter(p => p.fullName.toLowerCase().includes(q)));
    });

    searchInput.addEventListener("blur", () => {
      setTimeout(() => { listBox.classList.add("hidden"); }, 200);
      // پر کردن خودکار در صورت تایپ دقیق
      const exactMatch = PERSONNEL.find(p => p.fullName === searchInput.value.trim());
      if (exactMatch) {
        natIdInput.value = exactMatch.nationalId || "";
        shabaInput.value = exactMatch.shaba || "";
      } else {
        natIdInput.value = "";
        shabaInput.value = "";
      }
    });

    const removeBtn = clone.querySelector(".btn-remove-staff");
    removeBtn.addEventListener("click", (e) => {
      e.target.closest(".staff-row").remove();
    });
    container.appendChild(clone);
  });
}

function initFormReset() {
  const resetBtn = $("#resetBtn");
  if (!resetBtn) return;

  resetBtn.addEventListener("click", () => {
    const confirmed = confirm("آیا از پاک‌سازی تمام اطلاعات فرم مطمئن هستید؟");
    if (!confirmed) return;

    $("#guardForm").reset();
    $("#personnelIds").value = "[]";
    $("#selectedChips").innerHTML = "";
    $("#reporterId").value = "";
    $("#reporterList").innerHTML = "";
    $("#selectedReporter").innerHTML = "";
    initReporterSelect();
    $("#photoPreview").hidden = true;
    $("#photoPlaceholder").hidden = false;
    $("#post").disabled = true;
    $("#post").innerHTML = `<option value="">ابتدا محل را انتخاب کنید</option>`;

    const patrolRadio = document.querySelector(`input[name="reportType"][value="patrol"]`);
    if (patrolRadio) {
      patrolRadio.checked = true;
      patrolRadio.dispatchEvent(new Event("change"));
    }

    if (typeof renumberSections === "function") renumberSections();
    showToast("فرم پاک‌سازی شد", "success");
  });
}

