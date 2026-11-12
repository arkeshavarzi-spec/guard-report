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
  initBackToCards();
  initIllnessConditionals();
  initPersonnelSearch();
  initStatusToggle();
  initFormReset();
  initCeremonyStaff();
  initMissionLogic();
  initMissionPersonnel();
  initMissionGroupStaff();
  initFireConditionals();
  initGatheringConditionals();
  initFireStaffSearch();
  initPhotoUploader();
  initFormSubmit();
  initRecentActions();
  initMissionWordExport();
  initGatheringStaff();
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
      incidentSubject: "موضوع گزارش", incidentDesc: "شرح واقعه", incidentActions: "اقدامات", incidentAnalysis: "تحلیل", incidentFollowUp: "پیگیری",
      fireDate: "تاریخ حریق", fireTime: "ساعت حریق", fireLocation: "محل حریق", fireCause: "علت احتمالی", fireCauseOther: "توضیح علت",
      fireDeptCalled: "تماس با آتش‌نشانی", fireDeptCallTime: "ساعت تماس", fireDeptArriveTime: "ساعت رسیدن", fireDamageLevel: "میزان خسارت",
      fireCasualties: "خسارت جانی", fireCasualtyDetails: "جزئیات صدمات", fireFinancialDamage: "خسارت مالی", fireDamageDetails: "جزئیات خسارت مالی",
      fireInitialActions: "اقدامات اولیه", fireStaffNames: "نیروهای اطفاء",
      theftItemType: "نوع مال", theftItemDesc: "شرح مال", theftAssetNo: "شماره اموال",
      theftValue: "تخمین ارزش (ریال)", theftLocation: "محل دقیق", theftDiscoverTime: "زمان کشف",
      theftProbableTime: "زمان وقوع احتمالی", theftVictimName: "مالباخته", theftVictimPhone: "تلفن مالباخته",
      theftDoorStatus: "وضعیت قفل/درب", theftEvidence: "شواهد", theftActions: "اقدامات",
      theftPoliceCase: "شماره پرونده", theftFollowUp: "نیاز به پیگیری",
      missionCategory: "نوع مأموریت", missionPersonnelName: "پرسنل", missionPost: "پست", missionLocation: "محل مأموریت", missionSubject: "موضوع", missionStartDate: "تاریخ شروع", missionEndDate: "تاریخ پایان", missionDuration: "مدت", missionNumber: "شماره", missionIssueDate: "تاریخ صدور", missionTypeOfficial: "نوع (رسمی)", missionAccommodation: "محل اقامت", missionVehicle: "وسیله", missionEquipment: "تجهیزات", missionGroupStaffNames: "نیروهای گروهی", missionCompanyName: "شرکت", missionRequestType: "نوع درخواست",
      missionCategory: "نوع مأموریت", missionPersonnelName: "پرسنل", missionPost: "پست", missionLocation: "محل مأموریت", missionSubject: "موضوع", missionStartDate: "تاریخ شروع", missionEndDate: "تاریخ پایان", missionDuration: "مدت", missionNumber: "شماره", missionIssueDate: "تاریخ صدور", missionTypeOfficial: "نوع (رسمی)", missionAccommodation: "محل اقامت", missionVehicle: "وسیله", missionEquipment: "تجهیزات", missionGroupStaffNames: "نیروهای گروهی", missionCompanyName: "شرکت", missionRequestType: "نوع درخواست",
      gatheringDate: "تاریخ تجمع", gatheringStartTime: "ساعت شروع", gatheringEndTime: "ساعت پایان", gatheringPeopleCount: "تعداد افراد", gatheringReason: "علت تجمع", gatheringSubject: "موضوع تجمع", gatheringSpeaker: "سخنران", gatheringOrganizers: "برگزارکنندگان", gatheringLocation: "محل تجمع", gatheringTension: "تنش/درگیری", gatheringTensionDetails: "جزئیات تنش", gatheringActions: "اقدامات حفاظتی",
      discDate: "تاریخ وقوع", discTime: "ساعت وقوع", discType: "نوع تخلف", discName: "متخلف", discId: "شماره دانشجویی/پرسنلی", discUnit: "واحد", discLocation: "محل", discDesc: "شرح تخلف", discWitness: "شاهد", discActions: "اقدامات اولیه", discRef: "ارجاع به", discCaseNo: "شماره پرونده", discFollowUp: "نیاز به پیگیری",
      cerName: "نام برنامه", cerOrganizer: "برگزارکننده", cerDate: "تاریخ برگزاری", cerLocation: "مکان", cerStartTime: "ساعت شروع", cerEndTime: "ساعت پایان", cerStaff: "نیروها"
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
      incidentFollowUp: { yes: "بله", no: "خیر" },
      fireCause: { electrical: "اتصال برق", negligence: "سهل‌انگاری", arson: "عمدی", other: "سایر" },
      fireDamageLevel: { none: "بدون آسیب", minor: "جزئی", moderate: "متوسط", severe: "سنگین" },
      fireDeptCalled: { yes: "بله", no: "خیر" }, fireCasualties: { yes: "بله", no: "خیر" }, fireFinancialDamage: { yes: "بله", no: "خیر" },
      theftItemType: { equipment: "تجهیزات", money: "پول", personal: "وسایل شخصی", other: "سایر" },
      theftDoorStatus: { intact: "سالم", broken: "شکسته", open: "باز" },
      theftActions: { police: "تماس با پلیس", security: "تماس با حراست", cctv: "بررسی دوربین", other: "سایر" },
      theftFollowUp: { yes: "بله", no: "خیر" },
      missionCategory: { official: "رسمی/پیمانی", corporate: "شرکتی" },
      missionTypeOfficial: { individual: "انفرادی", group: "گروهی" },
      missionAccommodation: { provided: "تامین شده", not_provided: "تامین نشده" },
      missionVehicle: { gov_car_driver: "دولتی (با راننده)", gov_car_no_driver: "دولتی (بدون راننده)", personal_car: "شخصی", plane: "هواپیما", train: "قطار", other: "سایر" },
      missionRequestType: { issue: "صدور حکم", extend: "تمدید" },
      missionCategory: { official: "رسمی/پیمانی", corporate: "شرکتی" },
      missionTypeOfficial: { individual: "انفرادی", group: "گروهی" },
      missionAccommodation: { provided: "تامین شده", not_provided: "تامین نشده" },
      missionVehicle: { gov_car_driver: "دولتی (با راننده)", gov_car_no_driver: "دولتی (بدون راننده)", personal_car: "شخصی", plane: "هواپیما", train: "قطار", other: "سایر" },
      missionRequestType: { issue: "صدور حکم", extend: "تمدید" },
      gatheringReason: { guild: "صنفی", political: "سیاسی", cultural: "فرهنگی و اجتماعی", other: "سایر" },
      gatheringTension: { yes: "بله", no: "خیر" },
      discType: { student: "تخلفات دانشجویی", employee: "تخلفات اداری" },
      discRef: { committee: "کمیته انضباطی", security: "حراست", education: "آموزش", other: "سایر" },
      discFollowUp: { yes: "بله", no: "خیر" }
    };

    const wb = XLSX.utils.book_new();
    const typesMap = { patrol: "گشت شبانه", illness: "گزارش بیماری", fire: "گزارش حریق", mission: "مأموریت", gathering: "گزارش تجمع", incident: "گزارش موردی", theft: "گزارش سرقت", disciplinary: "تخلف انضباطی", ceremony: "مراسمات" };
    let hasData = false;

    for (const type in typesMap) {
      const typeReports = reports.filter(r => r.reportType === type);
      if (typeReports.length === 0) continue;
      hasData = true;

      let cols = [];
      if (type === 'patrol') {
        cols = ['reportDate', 'reportTime', 'reporterName', 'locationLabel', 'postLabel', 'status', 'personnelNames', 'notes'];
      } else if (type === 'fire') {
        cols = ['reportDate', 'reportTime', 'reporterName', 'fireDate', 'fireTime', 'fireLocation', 'fireCause', 'fireCauseOther', 'fireDamageLevel', 'fireDeptCalled', 'fireDeptCallTime', 'fireDeptArriveTime', 'fireCasualties', 'fireCasualtyDetails', 'fireFinancialDamage', 'fireDamageDetails', 'fireInitialActions', 'fireStaffNames', 'notes'];
      } else if (type === 'incident') {
        cols = ['reportDate', 'reportTime', 'reporterName', 'incidentSubject', 'incidentDesc', 'incidentActions', 'incidentAnalysis', 'incidentFollowUp', 'notes'];
      } else if (type === 'mission') {
        cols = ['reportDate', 'reportTime', 'reporterName', 'missionCategory', 'missionPersonnelName', 'missionPost', 'missionLocation', 'missionSubject', 'missionStartDate', 'missionEndDate', 'missionDuration', 'missionNumber', 'missionIssueDate', 'missionTypeOfficial', 'missionGroupStaffNames', 'missionAccommodation', 'missionVehicle', 'missionEquipment', 'missionCompanyName', 'missionRequestType', 'notes'];
      } else if (type === 'mission') {
        cols = ['reportDate', 'reportTime', 'reporterName', 'missionCategory', 'missionPersonnelName', 'missionPost', 'missionLocation', 'missionSubject', 'missionStartDate', 'missionEndDate', 'missionDuration', 'missionNumber', 'missionIssueDate', 'missionTypeOfficial', 'missionGroupStaffNames', 'missionAccommodation', 'missionVehicle', 'missionEquipment', 'missionCompanyName', 'missionRequestType', 'notes'];
      } else if (type === 'gathering') {
        cols = ['reportDate', 'reportTime', 'reporterName', 'gatheringDate', 'gatheringStartTime', 'gatheringEndTime', 'gatheringPeopleCount', 'gatheringReason', 'gatheringSubject', 'gatheringSpeaker', 'gatheringOrganizers', 'gatheringLocation', 'gatheringTension', 'gatheringTensionDetails', 'gatheringActions', 'notes'];
        
        typeReports.forEach((gath, index) => {
          if (gath.gatheringStaff && gath.gatheringStaff.length > 0) {
            const staffData = gath.gatheringStaff.map(s => ({
              'نام نیرو': s.name,
              'کد ملی': s.nationalId || '',
              'ساعت حضور': s.hours || ''
            }));
            const staffWs = XLSX.utils.json_to_sheet(staffData);
            let baseName = gath.gatheringSubject ? gath.gatheringSubject : 'تجمع';
            let sheetName = `نفرات تجمع ${baseName}`.substring(0, 25);
            if (index > 0) sheetName += ` (${index})`;
            XLSX.utils.book_append_sheet(wb, staffWs, sheetName);
          }
        });
      } else if (type === 'theft') {
        cols = ['reportDate', 'reportTime', 'reporterName', 'theftItemType', 'theftItemDesc', 'theftAssetNo', 'theftValue', 'theftLocation', 'theftDiscoverTime', 'theftProbableTime', 'theftVictimName', 'theftVictimPhone', 'theftDoorStatus', 'theftEvidence', 'theftActions', 'theftPoliceCase', 'theftFollowUp', 'notes'];
      } else if (type === 'disciplinary') {
        cols = ['reportDate', 'reportTime', 'reporterName', 'discDate', 'discTime', 'discType', 'discName', 'discId', 'discUnit', 'discLocation', 'discDesc', 'discWitness', 'discActions', 'discRef', 'discCaseNo', 'discFollowUp', 'notes'];
      } else if (type === 'illness') {
        cols = ['reportDate', 'reportTime', 'reporterName', 'patientType', 'patientName', 'patientId', 'patientUnit', 'patientOtherReason', 'illnessLocation', 'visitReason', 'companionName', 'companionId', 'companionPhone', 'actionType', 'emergencyCalledTime', 'emergencyArrivedTime', 'illnessDestination', 'transportMethod', 'reportSource', 'returnTime', 'returnDestination', 'notes'];
      } else if (type === 'ceremony') {
        cols = ['reportDate', 'reportTime', 'reporterName', 'cerName', 'cerOrganizer', 'cerDate', 'cerLocation', 'cerStartTime', 'cerEndTime', 'cerStaff', 'notes'];
        
        typeReports.forEach((cer, index) => {
          if (cer.cerStaff && cer.cerStaff.length > 0) {
            const staffData = cer.cerStaff.map(s => ({
              'نام نیرو': s.name, 'سمت': s.role || '', 'ساعت حضور': s.hours || '', 'کد ملی': s.nationalId || '', 'شماره شبا': s.shaba || ''
            }));
            const staffWs = XLSX.utils.json_to_sheet(staffData);
            let baseName = cer.cerName ? cer.cerName : 'مراسم';
            let sheetName = `نیروهای ${baseName}`.substring(0, 25);
            if (index > 0) sheetName += ` (${index})`;
            XLSX.utils.book_append_sheet(wb, staffWs, sheetName);
          }
        });
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

  $("#recentList").addEventListener("click", (e) => {
    // --- منطق حذف ---
    const deleteBtn = e.target.closest(".btn-delete-item");
    if (deleteBtn) {
      const reportId = deleteBtn.getAttribute("data-id");
      if (!confirm("آیا از حذف این گزارش مطمئن هستید؟")) return;
      const all = loadReports();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all.filter(r => r.id !== reportId)));
      renderRecentReports();
      showToast("🗑️ گزارش با موفقیت حذف شد", "success");
      return;
    }

    // --- منطق دانلود تک‌گزارش ---
    const exportBtn = e.target.closest(".btn-export-item");
    if (exportBtn) {
      const reportId = exportBtn.getAttribute("data-id");
      const all = loadReports();
      const report = all.find(r => r.id === reportId);
      if (!report) return showToast("گزارش پیدا نشد", "error");

      // استفاده از دیکشنری‌ها و توابع موجود برای ساخت اکسل
      const typeLabels = { patrol: "گشت شبانه", illness: "گزارش بیماری", fire: "گزارش حریق", mission: "مأموریت", gathering: "گزارش تجمع", incident: "گزارش موردی", theft: "گزارش سرقت", disciplinary: "تخلف انضباطی", ceremony: "مراسمات" };
      
      const wb = XLSX.utils.book_new();
      const row = {};
      
      // تبدیل کلیدهای آبجکت گزارش به لیبل فارسی
      for (const [key, val] of Object.entries(report)) {
        if (['id', 'createdAt', 'photo', 'reportType', 'location', 'post', 'personnelIds', 'fireStaffIds'].includes(key)) continue;
        
        let finalVal = val;
        if (Array.isArray(val)) {
          if (key === 'cerStaff') finalVal = val.map(s => `${s.name} (${s.role || 'بدون سمت'}) - ${s.hours || 0} ساعت`).join(" | ");
          else if (key === 'personnelNames' || key === 'fireStaffNames') finalVal = val.join(" | ");
        }
        
        // نام ستون‌ها را با دیکشنری معادل‌سازی می‌کنیم (همان دیکشنری که در initRecentActions تعریف کردید)
        // برای جلوگیری از تکرار کد، یک نگاشت کوچک اینجا می‌سازیم
        const labelMap = { reportDate: "تاریخ گزارش", reportTime: "ساعت گزارش", reporterName: "ثبت‌کننده", notes: "توضیحات", locationLabel: "محل", postLabel: "پست", status: "وضعیت", personnelNames: "پرسنل حاضر", fireDate: "تاریخ حریق", fireTime: "ساعت حریق", fireLocation: "محل حریق", fireCause: "علت", fireDeptCalled: "تماس با آتش‌نشانی", fireDeptCallTime: "ساعت تماس", fireDeptArriveTime: "ساعت رسیدن", fireDamageLevel: "میزان خسارت", fireCasualties: "خسارت جانی", fireCasualtyDetails: "جزئیات صدمات", fireFinancialDamage: "خسارت مالی", fireDamageDetails: "جزئیات خسارت", fireInitialActions: "اقدامات اولیه", fireStaffNames: "نیروهای اطفاء", missionCategory: "نوع مأموریت", missionPersonnelName: "پرسنل", missionPost: "پست", missionLocation: "محل مأموریت", missionSubject: "موضوع", missionStartDate: "تاریخ شروع", missionEndDate: "تاریخ پایان", missionDuration: "مدت", missionNumber: "شماره", missionIssueDate: "تاریخ صدور", missionTypeOfficial: "نوع (رسمی)", missionAccommodation: "محل اقامت", missionVehicle: "وسیله", missionEquipment: "تجهیزات", missionGroupStaffNames: "نیروهای گروهی", missionCompanyName: "شرکت", missionRequestType: "نوع درخواست",
      missionCategory: "نوع مأموریت", missionPersonnelName: "پرسنل", missionPost: "پست", missionLocation: "محل مأموریت", missionSubject: "موضوع", missionStartDate: "تاریخ شروع", missionEndDate: "تاریخ پایان", missionDuration: "مدت", missionNumber: "شماره", missionIssueDate: "تاریخ صدور", missionTypeOfficial: "نوع (رسمی)", missionAccommodation: "محل اقامت", missionVehicle: "وسیله", missionEquipment: "تجهیزات", missionGroupStaffNames: "نیروهای گروهی", missionCompanyName: "شرکت", missionRequestType: "نوع درخواست",
      gatheringDate: "تاریخ تجمع", gatheringStartTime: "ساعت شروع", gatheringEndTime: "ساعت پایان", gatheringPeopleCount: "تعداد افراد", gatheringReason: "علت تجمع", gatheringSubject: "موضوع", gatheringSpeaker: "سخنران", gatheringOrganizers: "برگزارکنندگان", gatheringLocation: "محل", gatheringTension: "تنش", gatheringTensionDetails: "جزئیات تنش", gatheringActions: "اقدامات" };
        
        row[labelMap[key] || key] = finalVal !== null && finalVal !== undefined ? finalVal : "";
      }

      const ws = XLSX.utils.json_to_sheet([row]);
      XLSX.utils.book_append_sheet(wb, ws, typeLabels[report.reportType] || "گزارش");
      
      const wbout = XLSX.write(wb, {bookType:'xlsx', type:'array'});
      const blob = new Blob([wbout], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
      const url = URL.createObjectURL(blob);
      const fileName = `${typeLabels[report.reportType] || 'گزارش'}-${report.reportDate ? report.reportDate.replace(/\//g, '-') : 'بدون-تاریخ'}.xlsx`;
      
      smartDownload(url, fileName, blob);
      showToast("📥 دانلود گزارش آغاز شد", "success");
    }
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
    const selected = document.querySelector(`input[name="reportType"]:checked`);
    
    // اگر هیچ کارتی انتخاب نشده، اصلا کاری به بخش توضیحات نداشته باش
    if (!selected) return;

    // فقط اگر کارت "گشت شبانه" انتخاب شده بود، این منطق را اجرا کن
    if (selected.value === "patrol") {
      if (statusSelect.value === "normal") {
        details.classList.add("hidden");
      } else {
        details.classList.remove("hidden");
      }
    }
    
    if (typeof renumberSections === "function") renumberSections();
  }

  statusSelect.addEventListener("change", syncDetailsVisibility);
  
  // نکته کلیدی: فراخوانی اولیه حذف شد تا در زمان لود شدن صفحه، با تابع اصلی تداخل نداشته باشد.
}




function initFormSubmit() {
  const form = $("#guardForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const reportType = form.querySelector(`input[name="reportType"]:checked`)?.value;
    if (!reportType) return showToast("لطفاً ابتدا نوع گزارش را انتخاب کنید", "error");
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

    if (reportType === "patrol") {
      const location = $("#location").value;
      const post = $("#post").value;
      const status = $("#status").value;
      let personnelIds = [];
      try { personnelIds = JSON.parse($("#personnelIds").value || "[]"); } catch (err) {}
      if (!location) return showToast("لطفاً محل بازدید را انتخاب کنید", "error");
      if (!post) return showToast("لطفاً نوع پست را انتخاب کنید", "error");
      if (!status) return showToast("لطفاً وضعیت پست را انتخاب کنید", "error");
      report.location = location;
      report.locationLabel = LOCATIONS.find(l => l.name === location)?.label || location;
      report.post = post;
      report.postLabel = POSTS.find(p => p.name === post)?.label || post;
      report.status = status;
      report.personnelIds = personnelIds;
      report.personnelNames = personnelIds.map(id => PERSONNEL.find(x => x.id === id)?.fullName || id);
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
    } else if (reportType === "fire") {
      report.fireDate = $("#fireDate").value.trim();
      report.fireTime = $("#fireTime").value;
      report.fireLocation = $("#fireLocation").value.trim();
      report.fireCause = $("#fireCause").value;
      report.fireCauseOther = $("#fireCauseOther").value.trim();
      report.fireDeptCalled = $("#fireDeptCalled").value;
      report.fireDeptCallTime = $("#fireDeptCallTime").value;
      report.fireDeptArriveTime = $("#fireDeptArriveTime").value;
      report.fireDamageLevel = $("#fireDamageLevel").value;
      report.fireCasualties = $("#fireCasualties").value;
      report.fireCasualtyDetails = $("#fireCasualtyDetails").value.trim();
      report.fireFinancialDamage = $("#fireFinancialDamage").value;
      report.fireDamageDetails = $("#fireDamageDetails").value.trim();
      report.fireInitialActions = $("#fireInitialActions").value.trim();
      let fireStaffIds = [];
      try { fireStaffIds = JSON.parse($("#fireStaffIds").value || "[]"); } catch (err) {}
      report.fireStaffIds = fireStaffIds;
      report.fireStaffNames = fireStaffIds.map(id => PERSONNEL.find(x => x.id === id)?.fullName || id);
      if (!report.fireDate) return showToast("لطفاً تاریخ وقوع حریق را وارد کنید", "error");
      if (!report.fireLocation) return showToast("لطفاً محل وقوع حریق را وارد کنید", "error");
    } else if (reportType === "incident") {
      report.incidentSubject = $("#incidentSubject").value.trim();
      report.incidentDesc = $("#incidentDesc").value.trim();
      report.incidentActions = $("#incidentActions").value.trim();
      report.incidentAnalysis = $("#incidentAnalysis").value.trim();
      report.incidentFollowUp = $("#incidentFollowUp").value;
      if (!report.incidentSubject) return showToast("لطفاً موضوع گزارش را وارد کنید", "error");
      if (!report.incidentDesc) return showToast("لطفاً شرح واقعه را وارد کنید", "error");
    } else if (reportType === "gathering") {
      report.gatheringDate = $("#gatheringDate").value.trim();
      report.gatheringStartTime = $("#gatheringStartTime").value;
      report.gatheringEndTime = $("#gatheringEndTime").value;
      report.gatheringPeopleCount = $("#gatheringPeopleCount").value.trim();
      report.gatheringReason = $("#gatheringReason").value;
      report.gatheringSubject = $("#gatheringSubject").value.trim();
      report.gatheringSpeaker = $("#gatheringSpeaker").value.trim();
      report.gatheringOrganizers = $("#gatheringOrganizers").value.trim();
      report.gatheringLocation = $("#gatheringLocation").value.trim();
      report.gatheringTension = $("#gatheringTension").value;
      report.gatheringTensionDetails = $("#gatheringTensionDetails").value.trim();
      report.gatheringActions = $("#gatheringActions").value.trim();

      if (!report.gatheringDate) return showToast("لطفاً تاریخ تجمع را وارد کنید", "error");
      if (!report.gatheringReason) return showToast("لطفاً علت تجمع را انتخاب کنید", "error");
      if (!report.gatheringSubject) return showToast("لطفاً موضوع تجمع را وارد کنید", "error");
      if (!report.gatheringLocation) return showToast("لطفاً محل تجمع را وارد کنید", "error");

      report.gatheringStaff = [];
      document.querySelectorAll("#gatherStaffContainer .gather-staff-row").forEach(row => {
        const name = row.querySelector(".gather-staff-search").value.trim();
        if (name) {
          report.gatheringStaff.push({
            name: name,
            nationalId: row.querySelector(".gather-staff-national-id").value,
            hours: row.querySelector(".gather-staff-hours").value
          });
        }
      });
    } else if (reportType === "mission") {
      report.missionCategory = $("#missionCategory").value;
      report.missionPersonnelId = $("#missionPersonnelId").value;
      const p = PERSONNEL.find(x => x.id === report.missionPersonnelId);
      report.missionPersonnelName = p ? p.fullName : "";
      report.missionPost = $("#missionPost").value.trim();
      report.missionLocation = $("#missionLocation").value.trim();
      report.missionSubject = $("#missionSubject").value.trim();
      report.missionStartDate = $("#missionStartDate").value.trim();
      report.missionEndDate = $("#missionEndDate").value.trim();
      report.missionDuration = $("#missionDuration").value;
      report.missionNumber = $("#missionNumber").value.trim();
      report.missionIssueDate = $("#missionIssueDate").value.trim();

      if (!report.missionCategory) return showToast("لطفاً نوع مأموریت را انتخاب کنید", "error");
      if (!report.missionPersonnelId) return showToast("لطفاً نام پرسنل را انتخاب کنید", "error");
      if (!report.missionLocation) return showToast("لطفاً محل مأموریت را وارد کنید", "error");
      if (!report.missionStartDate || !report.missionEndDate) return showToast("لطفاً تاریخ شروع و پایان را وارد کنید", "error");
      
      if (report.missionCategory === "official") {
        report.missionTypeOfficial = $("#missionTypeOfficial").value;
        report.missionAccommodation = $("#missionAccommodation").value;
        report.missionVehicle = $("#missionVehicle").value;
        report.missionEquipment = $("#missionEquipment").value.trim();
        
        if (report.missionTypeOfficial === "group") {
          let groupIds = [];
          try { groupIds = JSON.parse($("#missionGroupStaffIds").value || "[]"); } catch(e) {}
          report.missionGroupStaffIds = groupIds;
          report.missionGroupStaffNames = groupIds.map(id => PERSONNEL.find(x => x.id === id)?.fullName || id);
        }
      } else if (report.missionCategory === "corporate") {
        report.missionCompanyName = $("#missionCompanyName").value.trim();
        report.missionRequestType = $("#missionRequestType").value;
      }
    } else if (reportType === "mission") {
      report.missionCategory = $("#missionCategory").value;
      report.missionPersonnelId = $("#missionPersonnelId").value;
      const p = PERSONNEL.find(x => x.id === report.missionPersonnelId);
      report.missionPersonnelName = p ? p.fullName : "";
      report.missionPost = $("#missionPost").value.trim();
      report.missionLocation = $("#missionLocation").value.trim();
      report.missionSubject = $("#missionSubject").value.trim();
      report.missionStartDate = $("#missionStartDate").value.trim();
      report.missionEndDate = $("#missionEndDate").value.trim();
      report.missionDuration = $("#missionDuration").value;
      report.missionNumber = $("#missionNumber").value.trim();
      report.missionIssueDate = $("#missionIssueDate").value.trim();

      if (!report.missionCategory) return showToast("لطفاً نوع مأموریت را انتخاب کنید", "error");
      if (!report.missionPersonnelId) return showToast("لطفاً نام پرسنل را انتخاب کنید", "error");
      if (!report.missionLocation) return showToast("لطفاً محل مأموریت را وارد کنید", "error");
      if (!report.missionStartDate || !report.missionEndDate) return showToast("لطفاً تاریخ شروع و پایان را وارد کنید", "error");
      
      if (report.missionCategory === "official") {
        report.missionTypeOfficial = $("#missionTypeOfficial").value;
        report.missionAccommodation = $("#missionAccommodation").value;
        report.missionVehicle = $("#missionVehicle").value;
        report.missionEquipment = $("#missionEquipment").value.trim();
        
        if (report.missionTypeOfficial === "group") {
          let groupIds = [];
          try { groupIds = JSON.parse($("#missionGroupStaffIds").value || "[]"); } catch(e) {}
          report.missionGroupStaffIds = groupIds;
          report.missionGroupStaffNames = groupIds.map(id => PERSONNEL.find(x => x.id === id)?.fullName || id);
        }
      } else if (report.missionCategory === "corporate") {
        report.missionCompanyName = $("#missionCompanyName").value.trim();
        report.missionRequestType = $("#missionRequestType").value;
      }
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
      reader.onload = (ev) => { report.photo = ev.target.result; saveReport(report); };
      reader.readAsDataURL(photoFile);
    } else {
      saveReport(report);
    }
  });
}

async function saveReport(report) {
  // ذخیره محلی (پشتیبان)
  const all = loadReports();
  all.unshift(report);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

  // ارسال به Supabase (نسخه ابری)
  let cloudStatus = '';
  if (typeof sendReportToSupabase === 'function') {
    try {
      await sendReportToSupabase(report);
      cloudStatus = ' (ابری ✓)';
    } catch (err) {
      console.error('Cloud save failed:', err);
      cloudStatus = ' (فقط محلی)';
      showToast('⚠️ آفلاین ذخیره شد؛ اتصال ابری برقرار نشد.', 'error');
    }
  }

  showToast("✅ گزارش با موفقیت ثبت شد" + cloudStatus, "success");
  
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
  $("#fireStaffIds").value = "[]";
  $("#selectedFireStaff").innerHTML = "";
  if ($("#fireStaffList")) $("#fireStaffList").classList.add("hidden");
  $("#reporterId").value = "";
  $("#reporterList").innerHTML = "";
  $("#selectedReporter").innerHTML = "";
  initReporterSelect();
  $("#staffContainer").innerHTML = "";
  
  $("#photoPreview").hidden = true;
  $("#photoPlaceholder").hidden = false;
  
  $("#illnessSection").classList.add("hidden");
  $("#incidentSection").classList.add("hidden");
  $("#gatheringSection").classList.add("hidden");
  $("#missionSection").classList.add("hidden");
  $("#missionCategory").value = "";
  $("#missionSharedFields").classList.add("hidden");
  $("#missionOfficialFields").classList.add("hidden");
  $("#missionCorporateFields").classList.add("hidden");
  $("#missionPersonnelId").value = "";
  $("#missionPersonnel").value = "";
  $("#selectedMissionPersonnel").innerHTML = "";
  $("#missionPost").value = "حفاظت فیزیکی";
  $("#missionLocation").value = "";
  $("#missionSubject").value = "";
  $("#missionStartDate").value = "";
  $("#missionEndDate").value = "";
  $("#missionDuration").value = "";
  $("#missionNumber").value = "";
  $("#missionIssueDate").value = "";
  $("#missionTypeOfficial").value = "individual";
  $("#missionAccommodation").value = "provided";
  $("#missionVehicle").value = "gov_car_driver";
  $("#missionEquipment").value = "";
  $("#missionGroupStaffIds").value = "[]";
  $("#selectedMissionGroupStaff").innerHTML = "";
  $("#missionGroupStaffSearch").value = "";
  $("#missionCompanyName").value = "شرکت نیل آب فسا";
  $("#missionRequestType").value = "issue";
  $("#missionSection").classList.add("hidden");
  $("#missionCategory").value = "";
  $("#missionSharedFields").classList.add("hidden");
  $("#missionOfficialFields").classList.add("hidden");
  $("#missionCorporateFields").classList.add("hidden");
  $("#missionPersonnelId").value = "";
  $("#missionPersonnel").value = "";
  $("#selectedMissionPersonnel").innerHTML = "";
  $("#missionPost").value = "حفاظت فیزیکی";
  $("#missionLocation").value = "";
  $("#missionSubject").value = "";
  $("#missionStartDate").value = "";
  $("#missionEndDate").value = "";
  $("#missionDuration").value = "";
  $("#missionNumber").value = "";
  $("#missionIssueDate").value = "";
  $("#missionTypeOfficial").value = "individual";
  $("#missionAccommodation").value = "provided";
  $("#missionVehicle").value = "gov_car_driver";
  $("#missionEquipment").value = "";
  $("#missionGroupStaffIds").value = "[]";
  $("#selectedMissionGroupStaff").innerHTML = "";
  $("#missionGroupStaffSearch").value = "";
  $("#missionCompanyName").value = "شرکت نیل آب فسا";
  $("#missionRequestType").value = "issue";
  $("#gatheringDate").value = "";
  $("#gatheringStartTime").value = "";
  $("#gatheringEndTime").value = "";
  $("#gatheringPeopleCount").value = "";
  $("#gatheringReason").value = "";
  $("#gatheringSubject").value = "";
  $("#gatheringSpeaker").value = "";
  $("#gatheringOrganizers").value = "";
  $("#gatheringLocation").value = "";
  $("#gatheringTension").value = "";
  $("#gatheringTensionDetails").value = "";
  $("#gatheringActions").value = "";
  $("#gatheringTensionDetailsField").classList.add("hidden");
  $("#gatherStaffContainer").innerHTML = "";
  
  $("#theftSection").classList.add("hidden");
  $("#discSection").classList.add("hidden");
  $("#ceremonySection").classList.add("hidden");
  $("#fireSection").classList.add("hidden");
  $("#missionSection").classList.add("hidden");
  $("#gatheringSection").classList.add("hidden");
  $("#missionSection").classList.add("hidden");
  $("#missionCategory").value = "";
  $("#missionSharedFields").classList.add("hidden");
  $("#missionOfficialFields").classList.add("hidden");
  $("#missionCorporateFields").classList.add("hidden");
  $("#missionPersonnelId").value = "";
  $("#missionPersonnel").value = "";
  $("#selectedMissionPersonnel").innerHTML = "";
  $("#missionPost").value = "حفاظت فیزیکی";
  $("#missionLocation").value = "";
  $("#missionSubject").value = "";
  $("#missionStartDate").value = "";
  $("#missionEndDate").value = "";
  $("#missionDuration").value = "";
  $("#missionNumber").value = "";
  $("#missionIssueDate").value = "";
  $("#missionTypeOfficial").value = "individual";
  $("#missionAccommodation").value = "provided";
  $("#missionVehicle").value = "gov_car_driver";
  $("#missionEquipment").value = "";
  $("#missionGroupStaffIds").value = "[]";
  $("#selectedMissionGroupStaff").innerHTML = "";
  $("#missionGroupStaffSearch").value = "";
  $("#missionCompanyName").value = "شرکت نیل آب فسا";
  $("#missionRequestType").value = "issue";
  $("#missionSection").classList.add("hidden");
  $("#missionCategory").value = "";
  $("#missionSharedFields").classList.add("hidden");
  $("#missionOfficialFields").classList.add("hidden");
  $("#missionCorporateFields").classList.add("hidden");
  $("#missionPersonnelId").value = "";
  $("#missionPersonnel").value = "";
  $("#selectedMissionPersonnel").innerHTML = "";
  $("#missionPost").value = "حفاظت فیزیکی";
  $("#missionLocation").value = "";
  $("#missionSubject").value = "";
  $("#missionStartDate").value = "";
  $("#missionEndDate").value = "";
  $("#missionDuration").value = "";
  $("#missionNumber").value = "";
  $("#missionIssueDate").value = "";
  $("#missionTypeOfficial").value = "individual";
  $("#missionAccommodation").value = "provided";
  $("#missionVehicle").value = "gov_car_driver";
  $("#missionEquipment").value = "";
  $("#missionGroupStaffIds").value = "[]";
  $("#selectedMissionGroupStaff").innerHTML = "";
  $("#missionGroupStaffSearch").value = "";
  $("#missionCompanyName").value = "شرکت نیل آب فسا";
  $("#missionRequestType").value = "issue";
  
  $("#detailsSection").classList.remove("hidden");

  // برداشتن تیک تمام کارت‌ها
  document.querySelectorAll(`input[name="reportType"]`).forEach(r => r.checked = false);
  document.querySelector(`input[name="reportType"]`).dispatchEvent(new Event("change"));
  
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
    theft: "گزارش سرقت", disciplinary: "تخلف انضباطی", ceremony: "مراسمات",
    fire: "گزارش حریق", mission: "مأموریت", gathering: "گزارش تجمع"
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
    } else if (r.reportType === "fire") {
      title += ` — ${r.fireLocation || "بدون محل"}`;
    } else if (r.reportType === "mission") {
      title += ` — ${r.missionPersonnelName || "بدون نام"}`;
    } else if (r.reportType === "mission") {
      title += ` — ${r.missionPersonnelName || "بدون نام"}`;
    } else if (r.reportType === "gathering") {
      title += ` — ${r.gatheringSubject || "بدون موضوع"}`;
    } else if (r.reportType === "incident") {
      title += ` — ${r.incidentSubject || "بدون موضوع"}`;
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
        <div class="recent-item-actions">
          <button class="recent-item-btn btn-export-item" data-id="${r.id}" title="دانلود این گزارش">📥</button>
          <button class="recent-item-btn btn-delete-item" data-id="${r.id}" title="حذف گزارش">🗑</button>
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
  if (!searchInput) return;

  let selected = [];

  function updateHidden() { hiddenIds.value = JSON.stringify(selected.map(s => s.id)); }

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
        renderList(filterPersonnel(searchInput.value.trim().toLowerCase()));
      });
      chipsBox.appendChild(chip);
    });
  }

  function filterPersonnel(q) { return q ? PERSONNEL.filter(p => p.fullName.toLowerCase().includes(q)) : PERSONNEL; }

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
      item.innerHTML = `<span>${p.fullName}</span><span class="check">✓</span>`;
      
      // استفاده از mousedown برای انتخاب قبل از بسته شدن لیست
      item.addEventListener("mousedown", (e) => {
        e.preventDefault();
        if (selected.some(s => s.id === p.id)) {
          selected = selected.filter(s => s.id !== p.id);
        } else {
          selected.push(p);
        }
        updateHidden();
        renderChips();
        listBox.classList.add("hidden");
      });
      listBox.appendChild(item);
    });
  }

  searchInput.addEventListener("focus", () => {
    listBox.classList.remove("hidden");
    renderList(filterPersonnel(searchInput.value.trim().toLowerCase()));
  });

  searchInput.addEventListener("input", () => {
    listBox.classList.remove("hidden");
    renderList(filterPersonnel(searchInput.value.trim().toLowerCase()));
  });

  searchInput.addEventListener("blur", () => {
    setTimeout(() => listBox.classList.add("hidden"), 200);
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
  if (!searchInput) return;

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
      item.innerHTML = `<span>${p.fullName}</span><span class="check">✓</span>`;
      item.addEventListener("mousedown", (e) => {
        e.preventDefault();
        if (selected && selected.id === p.id) {
          selected = null;
        } else {
          selected = p;
        }
        renderChip();
        listBox.classList.add("hidden");
      });
      listBox.appendChild(item);
    });
  }

  function renderChip() {
    chipBox.innerHTML = "";
    if (!selected) { hiddenId.value = ""; return; }
    hiddenId.value = selected.id;
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.innerHTML = `<span>${selected.fullName}</span><button type="button" class="chip-remove" title="حذف">×</button>`;
    chip.querySelector(".chip-remove").addEventListener("click", () => {
      selected = null;
      renderChip();
      renderList(reporters.filter(p => p.fullName.toLowerCase().includes(searchInput.value.trim().toLowerCase())));
    });
    chipBox.appendChild(chip);
  }

  function filterList(q) { return q ? reporters.filter(p => p.fullName.toLowerCase().includes(q)) : reporters; }

  searchInput.addEventListener("focus", () => {
    listBox.classList.remove("hidden");
    renderList(filterList(searchInput.value.trim().toLowerCase()));
  });

  searchInput.addEventListener("input", () => {
    listBox.classList.remove("hidden");
    renderList(filterList(searchInput.value.trim().toLowerCase()));
  });

  searchInput.addEventListener("blur", () => {
    setTimeout(() => listBox.classList.add("hidden"), 200);
  });
}


function initReportTypeToggle() {
  // پیدا کردن هوشمندانه بخش‌ها از روی ساختار (بدون نیاز به ID)
  const typeSelectorSection = document.querySelector('input[name="reportType"]').closest('.form-section');
  const commonInfoSection = document.querySelector('#reportDate').closest('.form-section');
  const formActions = document.querySelector('#formActions');
  const statusSelect = document.querySelector('#status');
  
  const allSections = [
    "locationSection", "personnelSection", "detailsSection", 
    "illnessSection", "incidentSection", "theftSection", 
    "discSection", "ceremonySection", "fireSection", 
    "missionSection", "gatheringSection"
  ];

  function sync() {
    const selected = document.querySelector(`input[name="reportType"]:checked`);
    
    // حالت اولیه: نمایش کارت‌ها، مخفی کردن بقیه
    if (!selected) {
      if (typeSelectorSection) typeSelectorSection.classList.remove("hidden");
      if (commonInfoSection) commonInfoSection.classList.add("hidden");
      if (formActions) formActions.classList.add("hidden");
      
      allSections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden");
      });
      
      if (typeof renumberSections === "function") renumberSections();
      return;
    }

    const type = selected.value;
    
    // حالت تمرکز: مخفی کردن کارت‌ها، نمایش فرم
    if (typeSelectorSection) typeSelectorSection.classList.add("hidden");
    if (commonInfoSection) commonInfoSection.classList.remove("hidden");
    if (formActions) formActions.classList.remove("hidden");
    
    allSections.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add("hidden");
    });

    // نمایش بخش مربوطه
    if (type === "patrol") {
      const loc = document.getElementById("locationSection");
      const pers = document.getElementById("personnelSection");
      const det = document.getElementById("detailsSection");
      
      if (loc) loc.classList.remove("hidden");
      if (pers) pers.classList.remove("hidden");
      if (statusSelect && statusSelect.value !== "normal") {
        if (det) det.classList.remove("hidden");
      }
    } else {
      const sectionMap = {
        illness: "illnessSection", incident: "incidentSection", theft: "theftSection",
        disciplinary: "discSection", ceremony: "ceremonySection", fire: "fireSection",
        mission: "missionSection", gathering: "gatheringSection"
      };
      const targetSec = document.getElementById(sectionMap[type]);
      const det = document.getElementById("detailsSection");
      
      if (targetSec) targetSec.classList.remove("hidden");
      if (det) det.classList.remove("hidden");
    }
    
    if (typeof renumberSections === "function") renumberSections();

    // اسکرول امن در موبایل (با استفاده از window.scrollTo که در موبایل پایدارتر است)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  // گوش دادن به رویداد change روی رادیوها
  document.querySelectorAll(`input[name="reportType"]`).forEach(r => {
    r.addEventListener("change", sync);
  });

  sync();
}

function initBackToCards() {
  const backBtn = document.getElementById("backToCardsBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (confirm("آیا از بازگشت به کارت‌ها مطمئن هستید؟ اطلاعات وارد شده پاک خواهند شد.")) {
        document.querySelectorAll(`input[name="reportType"]`).forEach(r => r.checked = false);
        document.getElementById("guardForm").reset();
        
        // فراخوانی دستی رویداد change برای بازگرداندن به حالت اولیه
        const firstRadio = document.querySelector(`input[name="reportType"]`);
        if (firstRadio) firstRadio.dispatchEvent(new Event("change"));
        
        // اسکرول به بالا
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
    });
  }
}

function initBackToCards() {
  const backBtn = $("#backToCardsBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (confirm("آیا از بازگشت به کارت‌ها مطمئن هستید؟ اطلاعات وارد شده پاک خواهند شد.")) {
        // برداشتن تیک تمام رادیوها
        document.querySelectorAll(`input[name="reportType"]`).forEach(r => r.checked = false);
        // پاک کردن فرم
        $("#guardForm").reset();
        
        // فراخوانی دستی رویداد change برای بازگرداندن به حالت اولیه
        const firstRadio = document.querySelector(`input[name="reportType"]`);
        if (firstRadio) firstRadio.dispatchEvent(new Event("change"));
        
        // اسکرول به بالای کارت‌ها
        setTimeout(() => {
          const typeSelector = $("#typeSelectorSection");
          if (typeSelector) typeSelector.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    });
  }
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




function initGatheringConditionals() {
  const tensionSelect = $("#gatheringTension");
  const tensionDetails = $("#gatheringTensionDetailsField");
  if (!tensionSelect) return;

  function sync() {
    if (tensionSelect.value === "yes") {
      tensionDetails.classList.remove("hidden");
    } else {
      tensionDetails.classList.add("hidden");
    }
  }

  tensionSelect.addEventListener("change", sync);
  sync();
}


function initMissionLogic() {
  const category = $("#missionCategory");
  const sharedFields = $("#missionSharedFields");
  const officialFields = $("#missionOfficialFields");
  const corporateFields = $("#missionCorporateFields");
  const typeOfficial = $("#missionTypeOfficial");
  const groupField = $("#missionGroupStaffField");
  const startDate = $("#missionStartDate");
  const endDate = $("#missionEndDate");
  const duration = $("#missionDuration");
  const missionNum = $("#missionNumber");
  
  if (!category) return;

  function syncCategory() {
    const val = category.value;
    if (val) sharedFields.classList.remove("hidden");
    else sharedFields.classList.add("hidden");

    officialFields.classList.toggle("hidden", val !== "official");
    corporateFields.classList.toggle("hidden", val !== "corporate");
    
    if (val === "official" && !missionNum.value) {
      missionNum.value = Math.floor(Math.random() * 900 + 100) + "/1404";
    }
  }

  function syncGroup() {
    if (typeOfficial.value === "group") {
      groupField.classList.remove("hidden");
    } else {
      groupField.classList.add("hidden");
    }
  }

  function calcDuration() {
    const s = startDate.value.trim();
    const e = endDate.value.trim();
    if (!s || !e || s.length < 10 || e.length < 10) {
      duration.value = "";
      return;
    }
    const sParts = s.split("/");
    const eParts = e.split("/");
    if (sParts.length !== 3 || eParts.length !== 3) return;
    
    function jdn(jy, jm, jd) {
      jy = parseInt(jy); jm = parseInt(jm); jd = parseInt(jd);
      let gy = (jy <= 979) ? 621 : 1600;
      jy -= (jy <= 979) ? 0 : 979;
      let days = (365 * jy) + (Math.floor(jy / 33) * 8) + Math.floor(((jy % 33) + 3) / 4) + 78 + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
      return days + 365 * gy + Math.floor((gy + 3) / 4) - Math.floor((gy + 99) / 100) + Math.floor((gy + 399) / 400) - 1;
    }
    
    try {
      const sJdn = jdn(sParts[0], sParts[1], sParts[2]);
      const eJdn = jdn(eParts[0], eParts[1], eParts[2]);
      const diff = eJdn - sJdn + 1;
      if (diff > 0) {
        duration.value = diff + " روز";
      } else {
        duration.value = "تاریخ نامعتبر";
      }
    } catch(err) {
      duration.value = "";
    }
  }

  category.addEventListener("change", syncCategory);
  if (typeOfficial) typeOfficial.addEventListener("change", syncGroup);
  if (startDate) startDate.addEventListener("change", calcDuration);
  if (endDate) endDate.addEventListener("change", calcDuration);
  if (startDate) startDate.addEventListener("blur", calcDuration);
  if (endDate) endDate.addEventListener("blur", calcDuration);
  
  syncCategory();
  syncGroup();
}

function initMissionPersonnel() {
  const searchInput = $("#missionPersonnel");
  const listBox = $("#missionPersonnelList");
  const chipBox = $("#selectedMissionPersonnel");
  const hiddenId = $("#missionPersonnelId");
  if (!searchInput) return;

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
      item.innerHTML = `<span>${p.fullName}</span><span class="check">✓</span>`;
      item.addEventListener("mousedown", (e) => {
        e.preventDefault();
        if (selected && selected.id === p.id) selected = null;
        else selected = p;
        renderChip();
        listBox.classList.add("hidden");
        searchInput.value = selected ? selected.fullName : "";
      });
      listBox.appendChild(item);
    });
  }

  function renderChip() {
    chipBox.innerHTML = "";
    if (!selected) { hiddenId.value = ""; return; }
    hiddenId.value = selected.id;
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.innerHTML = `<span>${selected.fullName}</span><button type="button" class="chip-remove" title="حذف">×</button>`;
    chip.querySelector(".chip-remove").addEventListener("click", () => {
      selected = null;
      searchInput.value = "";
      renderChip();
      renderList(filterList(""));
    });
    chipBox.appendChild(chip);
  }

  function filterList(q) { return q ? PERSONNEL.filter(p => p.fullName.toLowerCase().includes(q)) : PERSONNEL; }

  searchInput.addEventListener("focus", () => {
    listBox.classList.remove("hidden");
    renderList(filterList(searchInput.value.trim().toLowerCase()));
  });

  searchInput.addEventListener("input", () => {
    listBox.classList.remove("hidden");
    renderList(filterList(searchInput.value.trim().toLowerCase()));
  });

  searchInput.addEventListener("blur", () => {
    setTimeout(() => listBox.classList.add("hidden"), 200);
  });
}

function initMissionGroupStaff() {
  const searchInput = $("#missionGroupStaffSearch");
  const listBox = $("#missionGroupStaffList");
  const chipsBox = $("#selectedMissionGroupStaff");
  const hiddenIds = $("#missionGroupStaffIds");
  if (!searchInput) return;

  let selected = [];

  function updateHidden() { hiddenIds.value = JSON.stringify(selected.map(s => s.id)); }

  function renderChips() {
    chipsBox.innerHTML = "";
    selected.forEach(person => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.innerHTML = `<span>${person.fullName}</span><button type="button" class="chip-remove" title="حذف">×</button>`;
      chip.querySelector(".chip-remove").addEventListener("click", () => {
        selected = selected.filter(s => s.id !== person.id);
        updateHidden();
        renderChips();
        renderList(filterList(searchInput.value.trim().toLowerCase()));
      });
      chipsBox.appendChild(chip);
    });
  }

  function filterList(q) { return q ? PERSONNEL.filter(p => p.fullName.toLowerCase().includes(q)) : PERSONNEL; }

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
      item.innerHTML = `<span>${p.fullName}</span><span class="check">✓</span>`;
      item.addEventListener("mousedown", (e) => {
        e.preventDefault();
        if (selected.some(s => s.id === p.id)) selected = selected.filter(s => s.id !== p.id);
        else selected.push(p);
        updateHidden();
        renderChips();
        listBox.classList.add("hidden");
      });
      listBox.appendChild(item);
    });
  }

  searchInput.addEventListener("focus", () => {
    listBox.classList.remove("hidden");
    renderList(filterList(searchInput.value.trim().toLowerCase()));
  });

  searchInput.addEventListener("input", () => {
    listBox.classList.remove("hidden");
    renderList(filterList(searchInput.value.trim().toLowerCase()));
  });

  searchInput.addEventListener("blur", () => {
    setTimeout(() => listBox.classList.add("hidden"), 200);
  });
}


function initMissionLogic() {
  const category = $("#missionCategory");
  const sharedFields = $("#missionSharedFields");
  const officialFields = $("#missionOfficialFields");
  const corporateFields = $("#missionCorporateFields");
  const typeOfficial = $("#missionTypeOfficial");
  const groupField = $("#missionGroupStaffField");
  const startDate = $("#missionStartDate");
  const endDate = $("#missionEndDate");
  const duration = $("#missionDuration");
  const missionNum = $("#missionNumber");
  
  if (!category) return;

  function syncCategory() {
    const val = category.value;
    if (val) sharedFields.classList.remove("hidden");
    else sharedFields.classList.add("hidden");

    officialFields.classList.toggle("hidden", val !== "official");
    corporateFields.classList.toggle("hidden", val !== "corporate");
    
    if (val === "official" && !missionNum.value) {
      missionNum.value = Math.floor(Math.random() * 900 + 100) + "/1404";
    }
  }

  function syncGroup() {
    if (typeOfficial.value === "group") {
      groupField.classList.remove("hidden");
    } else {
      groupField.classList.add("hidden");
    }
  }

  function calcDuration() {
    const s = startDate.value.trim();
    const e = endDate.value.trim();
    if (!s || !e || s.length < 10 || e.length < 10) {
      duration.value = "";
      return;
    }
    const sParts = s.split("/");
    const eParts = e.split("/");
    if (sParts.length !== 3 || eParts.length !== 3) return;
    
    function jdn(jy, jm, jd) {
      jy = parseInt(jy); jm = parseInt(jm); jd = parseInt(jd);
      let gy = (jy <= 979) ? 621 : 1600;
      jy -= (jy <= 979) ? 0 : 979;
      let days = (365 * jy) + (Math.floor(jy / 33) * 8) + Math.floor(((jy % 33) + 3) / 4) + 78 + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
      return days + 365 * gy + Math.floor((gy + 3) / 4) - Math.floor((gy + 99) / 100) + Math.floor((gy + 399) / 400) - 1;
    }
    
    try {
      const sJdn = jdn(sParts[0], sParts[1], sParts[2]);
      const eJdn = jdn(eParts[0], eParts[1], eParts[2]);
      const diff = eJdn - sJdn + 1;
      if (diff > 0) {
        duration.value = diff + " روز";
      } else {
        duration.value = "تاریخ نامعتبر";
      }
    } catch(err) {
      duration.value = "";
    }
  }

  category.addEventListener("change", syncCategory);
  if (typeOfficial) typeOfficial.addEventListener("change", syncGroup);
  if (startDate) startDate.addEventListener("change", calcDuration);
  if (endDate) endDate.addEventListener("change", calcDuration);
  if (startDate) startDate.addEventListener("blur", calcDuration);
  if (endDate) endDate.addEventListener("blur", calcDuration);
  
  syncCategory();
  syncGroup();
}

function initMissionPersonnel() {
  const searchInput = $("#missionPersonnel");
  const listBox = $("#missionPersonnelList");
  const chipBox = $("#selectedMissionPersonnel");
  const hiddenId = $("#missionPersonnelId");
  if (!searchInput) return;

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
      item.innerHTML = `<span>${p.fullName}</span><span class="check">✓</span>`;
      item.addEventListener("mousedown", (e) => {
        e.preventDefault();
        if (selected && selected.id === p.id) selected = null;
        else selected = p;
        renderChip();
        listBox.classList.add("hidden");
        searchInput.value = selected ? selected.fullName : "";
      });
      listBox.appendChild(item);
    });
  }

  function renderChip() {
    chipBox.innerHTML = "";
    if (!selected) { hiddenId.value = ""; return; }
    hiddenId.value = selected.id;
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.innerHTML = `<span>${selected.fullName}</span><button type="button" class="chip-remove" title="حذف">×</button>`;
    chip.querySelector(".chip-remove").addEventListener("click", () => {
      selected = null;
      searchInput.value = "";
      renderChip();
      renderList(filterList(""));
    });
    chipBox.appendChild(chip);
  }

  function filterList(q) { return q ? PERSONNEL.filter(p => p.fullName.toLowerCase().includes(q)) : PERSONNEL; }

  searchInput.addEventListener("focus", () => {
    listBox.classList.remove("hidden");
    renderList(filterList(searchInput.value.trim().toLowerCase()));
  });

  searchInput.addEventListener("input", () => {
    listBox.classList.remove("hidden");
    renderList(filterList(searchInput.value.trim().toLowerCase()));
  });

  searchInput.addEventListener("blur", () => {
    setTimeout(() => listBox.classList.add("hidden"), 200);
  });
}

function initMissionGroupStaff() {
  const searchInput = $("#missionGroupStaffSearch");
  const listBox = $("#missionGroupStaffList");
  const chipsBox = $("#selectedMissionGroupStaff");
  const hiddenIds = $("#missionGroupStaffIds");
  if (!searchInput) return;

  let selected = [];

  function updateHidden() { hiddenIds.value = JSON.stringify(selected.map(s => s.id)); }

  function renderChips() {
    chipsBox.innerHTML = "";
    selected.forEach(person => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.innerHTML = `<span>${person.fullName}</span><button type="button" class="chip-remove" title="حذف">×</button>`;
      chip.querySelector(".chip-remove").addEventListener("click", () => {
        selected = selected.filter(s => s.id !== person.id);
        updateHidden();
        renderChips();
        renderList(filterList(searchInput.value.trim().toLowerCase()));
      });
      chipsBox.appendChild(chip);
    });
  }

  function filterList(q) { return q ? PERSONNEL.filter(p => p.fullName.toLowerCase().includes(q)) : PERSONNEL; }

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
      item.innerHTML = `<span>${p.fullName}</span><span class="check">✓</span>`;
      item.addEventListener("mousedown", (e) => {
        e.preventDefault();
        if (selected.some(s => s.id === p.id)) selected = selected.filter(s => s.id !== p.id);
        else selected.push(p);
        updateHidden();
        renderChips();
        listBox.classList.add("hidden");
      });
      listBox.appendChild(item);
    });
  }

  searchInput.addEventListener("focus", () => {
    listBox.classList.remove("hidden");
    renderList(filterList(searchInput.value.trim().toLowerCase()));
  });

  searchInput.addEventListener("input", () => {
    listBox.classList.remove("hidden");
    renderList(filterList(searchInput.value.trim().toLowerCase()));
  });

  searchInput.addEventListener("blur", () => {
    setTimeout(() => listBox.classList.add("hidden"), 200);
  });
}

function initGatheringStaff() {
  const addBtn = $("#addGatherStaffBtn");
  const container = $("#gatherStaffContainer");
  const template = $("#gatheringStaffRowTemplate");
  if (!addBtn) return;

  addBtn.addEventListener("click", () => {
    const clone = template.content.cloneNode(true);
    const searchInput = clone.querySelector(".gather-staff-search");
    const natIdInput = clone.querySelector(".gather-staff-national-id");

    const listBox = document.createElement("div");
    listBox.className = "personnel-list hidden";
    listBox.style.marginTop = "4px";
    listBox.style.maxHeight = "150px";
    listBox.style.position = "absolute";
    listBox.style.width = "calc(100% - 24px)";
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
        item.addEventListener("mousedown", (e) => {
          e.preventDefault();
          searchInput.value = p.fullName;
          natIdInput.value = p.nationalId || "";
          listBox.classList.add("hidden");
        });
        listBox.appendChild(item);
      });
    }

    searchInput.addEventListener("focus", () => {
      listBox.classList.remove("hidden");
      renderList(PERSONNEL.filter(p => p.fullName.includes(searchInput.value)));
    });

    searchInput.addEventListener("input", (e) => {
      listBox.classList.remove("hidden");
      const q = e.target.value.trim().toLowerCase();
      renderList(PERSONNEL.filter(p => p.fullName.toLowerCase().includes(q)));
    });

    searchInput.addEventListener("blur", () => {
      setTimeout(() => { listBox.classList.add("hidden"); }, 200);
      const exactMatch = PERSONNEL.find(p => p.fullName === searchInput.value.trim());
      if (exactMatch) natIdInput.value = exactMatch.nationalId || "";
      else natIdInput.value = "";
    });

    const removeBtn = clone.querySelector(".btn-remove-gather-staff");
    removeBtn.addEventListener("click", (e) => {
      e.target.closest(".gather-staff-row").remove();
    });
    container.appendChild(clone);
  });
}

function initMissionWordExport() {
  const btn = $("#exportMissionWordBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const category = $("#missionCategory").value;
    if (!category) return showToast("لطفاً ابتدا نوع مأموریت را انتخاب کنید", "error");

    const location = $("#missionLocation").value.trim();
    const subject = $("#missionSubject").value.trim();
    const start = $("#missionStartDate").value.trim();
    const end = $("#missionEndDate").value.trim();
    const duration = $("#missionDuration").value;
    const number = $("#missionNumber").value.trim();
    const issueDate = $("#missionIssueDate").value.trim();
    const post = $("#missionPost").value.trim();

    if (!location || !start || !end) return showToast("لطفاً محل و تاریخ‌های مأموریت را کامل کنید", "error");

    let personnelList = [];
    if (category === "official" && $("#missionTypeOfficial").value === "group") {
      const mainId = $("#missionPersonnelId").value;
      const mainPerson = PERSONNEL.find(x => x.id === mainId);
      if (mainPerson) personnelList.push(mainPerson.fullName);
      
      let groupIds = [];
      try { groupIds = JSON.parse($("#missionGroupStaffIds").value || "[]"); } catch(e) {}
      groupIds.forEach(id => {
        const p = PERSONNEL.find(x => x.id === id);
        if (p) personnelList.push(p.fullName);
      });
    } else {
      const mainId = $("#missionPersonnelId").value;
      const mainPerson = PERSONNEL.find(x => x.id === mainId);
      if (mainPerson) personnelList.push(mainPerson.fullName);
    }

    if (personnelList.length === 0) return showToast("لطفاً نام پرسنل را انتخاب کنید", "error");

    showToast("در حال ساخت فایل Word...", "success");

    // گرفتن لوگو با Promise (بدون async/await)
    const baseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname.replace('index.html', '');
    
    fetch(baseUrl + 'img/logo.png')
      .then(res => res.ok ? res.blob() : null)
      .then(blob => {
        if (!blob) return "";
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      })
      .catch(() => "")
      .then(logoBase64 => {
        // این بخش پس از لود شدن لوگو اجرا می‌شود
        const headerStyle = `
          <style>
            @page { size: A4; margin: 1cm; }
            body { font-family: 'B Nazanin', 'Nazanin', Tahoma, sans-serif; direction: rtl; font-size: 15px; color: #000; }
            table { border-collapse: collapse; width: 100%; table-layout: fixed; margin-bottom: 0; }
            td, th { border: 1px solid #000; padding: 6px 8px; vertical-align: middle; word-wrap: break-word; }
            .header-table { border: none; margin-bottom: 15px; }
            .header-table td { border: none; padding: 0; }
            .logo { width: 80px; height: auto; }
            .title { font-family: 'B Titr', 'Titr', Tahoma; font-size: 20px; font-weight: bold; margin: 5px 0; }
            .page-break { page-break-after: always; }
            .center { text-align: center; }
          </style>
        `;

        let htmlContent = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8">${headerStyle}</head><body>`;
        const imgTag = logoBase64 ? `<img src="${logoBase64}" class="logo" alt="لوگو">` : ``;

        personnelList.forEach((personName, index) => {
          if (category === "official") {
            const typeOfficial = $("#missionTypeOfficial").value === "group" ? "☑ گروهی &nbsp;&nbsp; ☐ انفرادی" : "☐ گروهی &nbsp;&nbsp; ☑ انفرادی";
            const acc = $("#missionAccommodation").value === "provided" ? "☑ تامین شده است &nbsp; ☐ تامین نشده است" : "☐ تامین شده است &nbsp; ☑ تامین نشده است";
            const vehicle = $("#missionVehicle").value;
            let vGov = "☐", vPersonal = "☐", vPlane = "☐", vTrain = "☐";
            if(vehicle.includes("gov")) vGov = "☑";
            else if(vehicle === "personal_car") vPersonal = "☑";
            else if(vehicle === "plane") vPlane = "☑";
            else if(vehicle === "train") vTrain = "☑";
            const equipment = $("#missionEquipment").value.trim();

            htmlContent += `
              <div class="${index < personnelList.length - 1 ? 'page-break' : ''}">
                <table class="header-table">
                  <tr>
                    <td style="width: 25%; text-align: left;">${imgTag}</td>
                    <td style="width: 50%; text-align: center;">
                      <div style="font-size: 16px;">بسمه تعالی</div>
                      <div style="font-size: 15px; margin: 5px 0;">جمهوری اسلامی ایران</div>
                      <div class="title">برگ ماموریت اداری</div>
                      <div style="font-size: 14px;">« موضوع بند الف ماده 11 قانون استخدام »</div>
                      <div style="font-size: 14px;">فرم ع - 119</div>
                      <div style="font-size: 12px; color: #555;">(70-11) سازمان امور اداری استخدامی کشور</div>
                    </td>
                    <td style="width: 25%;"></td>
                  </tr>
                </table>

                <table>
                  <tr>
                    <td colspan="2">1- وزارت / موسسه: دانشگاه شیراز</td>
                    <td colspan="2">2- واحد اعزام کننده: حفاظت فیزیکی دانشگاه شیراز</td>
                  </tr>
                  <tr>
                    <td colspan="2">3- نام و نام خانوادگی: <b>${personName}</b></td>
                    <td colspan="2">4- عنوان پست سازمانی: ${post}</td>
                  </tr>
                  <tr>
                    <td colspan="2">5- نوع درخواست: ☑ صدور حکم ماموریت &nbsp; ☐ تمدید</td>
                    <td colspan="2">6- نوع ماموریت: ${typeOfficial}</td>
                  </tr>
                  <tr>
                    <td colspan="2">7- محل ماموریت: ${location}</td>
                    <td colspan="2">8- موضوع ماموریت: ${subject}</td>
                  </tr>
                  <tr>
                    <td colspan="2">9- مدت: ${duration}</td>
                    <td colspan="2">10- تاریخ ماموریت: از تاریخ ${start} تا تاریخ ${end}</td>
                  </tr>
                  <tr>
                    <td colspan="2">11- مدت تمدید ماموریت: ......................</td>
                    <td colspan="2">12- مجوز تمدید ماموریت: ......................</td>
                  </tr>
                  <tr>
                    <td colspan="2">13- محل اقامت: ${acc}</td>
                    <td colspan="2">14- نوع وسیله رفت و برگشت:<br>${vGov} وسیله نقلیه دولتی &nbsp; ${vPersonal} وسیله شخصی &nbsp; ${vPlane} هواپیما &nbsp; ${vTrain} قطار</td>
                  </tr>
                  <tr>
                    <td colspan="4">15- وسائل و تجهیزات مورد نیاز در ماموریت: ${equipment}</td>
                  </tr>
                  
                  <tr>
                    <td colspan="2" class="center" style="height: 120px;">
                      16- نام و نام خانوادگی مسئول اعزام کننده:<br><br>
                      <b>علیرضا کشاورزی</b><br>
                      عنوان پست سازمانی: رئیس اداره حفاظت فیزیکی مدیریت حراست<br><br>
                      امضاء
                    </td>
                    <td colspan="2" class="center" style="height: 120px;">
                      18- نام و نام خانوادگی مقام موافقت کننده:<br><br>
                      <b>مهدی همتی</b><br>
                      عنوان پست سازمانی: مدیر حراست دانشگاه شیراز<br><br>
                      امضاء
                    </td>
                  </tr>
                  
                  <tr>
                    <td colspan="2">17- شماره درخواست: ${number}</td>
                    <td colspan="1">19- شماره: ${number}</td>
                    <td colspan="1">تاریخ: ${issueDate}</td>
                  </tr>
                  <tr>
                    <td colspan="4" style="padding: 12px;">20- فوق العاده روزانه و سایر هزینه ها از محل: ...................... تامین گردیده و پس از ...................... قابل پرداخت است.</td>
                  </tr>
                </table>

                <div style="margin-top: 25px;"></div>
                
                <table>
                  <tr>
                    <td colspan="2" class="center" style="height: 100px; width: 50%;">
                      21- نام و نام خانوادگی مسئول امور مالی:<br><br>
                      عنوان پست سازمانی:<br><br>
                      امضاء
                    </td>
                    <td colspan="2" class="center" style="height: 100px; width: 50%;">
                      22- شماره:<br><br>
                      تاریخ:<br><br>
                      امضاء
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" class="center" style="height: 100px; width: 50%;">
                      23- نام و نام خانوادگی مسئول امور اداری:<br><br>
                      عنوان پست سازمانی:<br><br>
                      امضاء
                    </td>
                    <td colspan="2" class="center" style="height: 100px; width: 50%;">
                      24- شماره:<br>
                      تاریخ صدور حکم:<br><br>
                      امضاء
                    </td>
                  </tr>
                  <tr>
                    <td colspan="4" style="height: 300px; vertical-align: top; padding: 15px;">25- گزارش مختصر ماموریت:<br><br><br><br><br><br><br><br>تاریخ:<br>امضاء</td>
                  </tr>
                  <tr>
                    <td colspan="4" style="padding: 15px; line-height: 1.8;">
                      26- تائید ماموریت: انجام ماموریت فوق الذکر از تاریخ ${start} به مدت ${duration} مورد تائید می باشد.<br><br>
                      نام و نام خانوادگی مسئول واحد اعزام کننده: علیرضا کشاورزی<br>
                      عنوان پست سازمانی: رئیس اداره حفاظت فیزیکی مدیریت حراست<br><br>
                      امضاء
                    </td>
                  </tr>
                </table>
              </div>
            `;
          } 
          else if (category === "corporate") {
            const company = $("#missionCompanyName").value.trim();
            const requestType = $("#missionRequestType").value === "issue" ? "صدور حکم ماموریت" : "تمدید";

            htmlContent += `
              <div class="${index < personnelList.length - 1 ? 'page-break' : ''}">
                <table class="header-table">
                  <tr>
                    <td style="width: 25%; text-align: left;">${imgTag}</td>
                    <td style="width: 50%; text-align: center;">
                      <div style="font-size: 16px;">بسمه تعالی</div>
                      <div class="title" style="margin-top: 10px;">کارکنان شرکتی طرف قرارداد دانشگاه شیراز</div>
                      <div style="font-size: 15px;">(${company})</div>
                    </td>
                    <td style="width: 25%;"></td>
                  </tr>
                </table>

                <table>
                  <tr>
                    <td colspan="2">1- وزارت / موسسه درخواست کننده: دانشگاه شیراز</td>
                    <td colspan="2">2- واحد اعزام کننده: حفاظت فیزیکی دانشگاه شیراز</td>
                  </tr>
                  <tr>
                    <td colspan="2">3- نام و نام خانوادگی: <b>${personName}</b></td>
                    <td colspan="2">4- عنوان پست سازمانی: ${post}</td>
                  </tr>
                  <tr>
                    <td colspan="2">5- نوع درخواست: ${requestType}</td>
                    <td colspan="2">6- (خالی)</td>
                  </tr>
                  <tr>
                    <td colspan="2">7- محل ماموریت: ${location}</td>
                    <td colspan="2">8- موضوع ماموریت: ${subject}</td>
                  </tr>
                  <tr>
                    <td colspan="2">9- مدت ماموریت: ${duration}</td>
                    <td colspan="2">10- تاریخ ماموریت: از تاریخ ${start} تا تاریخ ${end}</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="height: 100px;">11- نام و نام خانوادگی مدیرعامل شرکت:<br><br>امضاء</td>
                    <td colspan="1">12- شماره: ${number}</td>
                    <td colspan="1">تاریخ: ${issueDate}</td>
                  </tr>
                  <tr>
                    <td colspan="2" class="center" style="padding: 25px; height: 150px;">
                      13- نام و نام خانوادگی مسئول واحد اعزام کننده:<br><br>
                      <b>علیرضا کشاورزی</b><br>
                      عنوان پست سازمانی: رئیس اداره حفاظت فیزیکی مدیریت حراست<br><br>
                      امضاء
                    </td>
                    <td colspan="2" class="center" style="padding: 25px; height: 150px;">
                      14- نام و نام خانوادگی مقام موافقت کننده:<br><br>
                      <b>مهدی همتی</b><br>
                      عنوان پست سازمانی: مدیر حراست دانشگاه شیراز<br><br>
                      امضاء
                    </td>
                  </tr>
                </table>
              </div>
            `;
          }
        });

        htmlContent += "</body></html>";

        const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Mission-${number.replace(/\//g, '-') || 'Draft'}.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        
        showToast("📄 فایل Word دانلود شد", "success");
      });
  });
}

function initFireConditionals() {
  const deptCalled = $("#fireDeptCalled");
  const deptTime = $("#fireDeptTimeField");
  const casualties = $("#fireCasualties");
  const casualtyDetails = $("#fireCasualtyDetailsField");
  const finDamage = $("#fireFinancialDamage");
  const damageDetails = $("#fireDamageDetailsField");

  function sync() {
    if (deptCalled) deptTime.classList.toggle("hidden", deptCalled.value !== "yes");
    if (casualties) casualtyDetails.classList.toggle("hidden", casualties.value !== "yes");
    if (finDamage) damageDetails.classList.toggle("hidden", finDamage.value !== "yes");
  }

  [deptCalled, casualties, finDamage].forEach(el => {
    if (el) el.addEventListener("change", sync);
  });
  sync();
}


function initFireStaffSearch() {
  const searchInput = $("#fireStaffSearch");
  const listBox = $("#fireStaffList");
  const chipsBox = $("#selectedFireStaff");
  const hiddenIds = $("#fireStaffIds");
  if (!searchInput) return;

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
        renderList(filterList(searchInput.value.trim().toLowerCase()));
      });
      chipsBox.appendChild(chip);
    });
  }

  function filterList(q) {
    return q ? PERSONNEL.filter(p => p.fullName.toLowerCase().includes(q)) : PERSONNEL;
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
      item.addEventListener("click", () => {
        if (selected.some(s => s.id === p.id)) {
          selected = selected.filter(s => s.id !== p.id);
        } else {
          selected.push(p);
        }
        updateHidden();
        renderChips();
        renderList(filterList(searchInput.value.trim().toLowerCase()));
      });
      listBox.appendChild(item);
    });
  }

  renderList(PERSONNEL);

  searchInput.addEventListener("focus", () => {
    listBox.classList.remove("hidden");
    renderList(filterList(searchInput.value.trim().toLowerCase()));
  });

  searchInput.addEventListener("input", () => {
    renderList(filterList(searchInput.value.trim().toLowerCase()));
  });

  searchInput.addEventListener("blur", () => {
    setTimeout(() => listBox.classList.add("hidden"), 200);
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

    // برداشتن تیک تمام کارت‌ها
    document.querySelectorAll(`input[name="reportType"]`).forEach(r => r.checked = false);
    document.querySelector(`input[name="reportType"]`).dispatchEvent(new Event("change"));

    if (typeof renumberSections === "function") renumberSections();
    showToast("فرم پاک‌سازی شد", "success");
  });
}

