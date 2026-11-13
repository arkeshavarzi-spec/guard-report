/* =========================================================
   اتصال به Supabase — احراز هویت و ذخیره داده
   ========================================================= */

const SUPABASE_URL = 'https://flhfnpjrcisgoghvwbyd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_WmrUwWR3TpCTrIildF37_w_VcfAgXXs';

// ۱. تعریف یک fetch سفارشی با قابلیت تلاش مجدد
const customFetch = async (url, options = {}) => {
  const maxRetries = 3;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      // اگر خطای 5xx بود، دوباره تلاش کن
      if (response.status >= 500) throw new Error(`Server error: ${response.status}`);
      return response;
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      // صبر کوتاه قبل از تلاش مجدد (Exponential Backoff)
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
};

// ۲. مقداردهی اولیه کلاینت با fetch سفارشی
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  global: {
    fetch: customFetch // استفاده از fetch سفارشی برای تمام درخواست‌ها
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
});

let currentUser = null;

// بررسی وضعیت ورود هنگام بارگذاری
async function checkAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session && session.user) {
    currentUser = session.user;
    showApp(session.user.email);
  } else {
    showLogin();
  }
}

function showLogin() {
  document.getElementById('loginOverlay').classList.remove('hidden');
  document.getElementById('userInfo').classList.add('hidden');
  const app = document.querySelector('.app-container');
  if (app) app.style.display = 'none';
}

function showApp(email) {
  document.getElementById('loginOverlay').classList.add('hidden');
  document.getElementById('userInfo').classList.remove('hidden');
  document.getElementById('userEmail').textContent = email;
  const app = document.querySelector('.app-container');
  if (app) app.style.display = '';
}

// رویداد ورود
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const btn = document.getElementById('loginBtn');
      const err = document.getElementById('loginError');

      btn.disabled = true;
      btn.textContent = 'در حال ورود...';
      err.textContent = '';

      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) {
          err.textContent = 'خطا: ' + (error.message === 'Invalid login credentials' ? 'ایمیل یا رمز عبور اشتباه است.' : error.message);
          return;
        }
        currentUser = data.user;
        showApp(data.user.email);
        showToast('✅ خوش آمدید', 'success');
  if (typeof renderRecentReports === 'function') renderRecentReports();
      } catch (e) {
        console.error("Network Error:", e);
        err.textContent = 'خطای شبکه: لطفاً اتصال اینترنت خود را بررسی کنید.';
      } finally {
        btn.disabled = false;
        btn.textContent = 'ورود به سامانه';
      }
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await supabaseClient.auth.signOut();
      currentUser = null;
      showLogin();
      document.getElementById('loginPassword').value = '';
    });
  }

  checkAuth();
});

// --- آپلود عکس به Supabase Storage با روش ArrayBuffer ---
async function uploadImageToSupabase(file) {
  if (!file) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

  // ۱. تبدیل فایل به ArrayBuffer (مطمئن‌ترین روش برای آپلود)
  const arrayBuffer = await file.arrayBuffer();

  // ۲. آپلود با استفاده از ArrayBuffer
  const { data, error } = await supabaseClient.storage
    .from('report-images')
    .upload(fileName, arrayBuffer, {
      contentType: file.type,
      upsert: false
    });

  if (error) throw error;

  // ۳. دریافت لینک عمومی
  const { data: urlData } = supabaseClient.storage
    .from('report-images')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

// ارسال گزارش به Supabase
async function sendReportToSupabase(report) {
  if (!currentUser) throw new Error('کاربر وارد نشده است');
  const { data, error } = await supabaseClient
    .from('reports')
    .insert([{
      report_type: report.reportType,
      report_date: report.reportDate,
      report_time: report.reportTime,
      reporter_id: report.reporterId || '',
      reporter_name: report.reporterName || '',
      auth_user_id: currentUser.id,
      details: report,
      notes: report.notes || '',
      status: 'unread'
    }])
    .select();
  if (error) throw error;
  return data;
}

// دریافت گزارش‌های کاربر فعلی از Supabase
async function fetchMyReportsFromSupabase() {
  if (!currentUser) return [];
  
  // گرفتن لیست گزارش‌هایی که این کاربر پنهان کرده است
  const { data: hiddenData } = await supabaseClient
    .from('hidden_reports')
    .select('report_id')
    .eq('user_id', currentUser.id);
    
  const hiddenIds = hiddenData ? hiddenData.map(h => h.report_id) : [];

  // گرفتن گزارش‌های کاربر
  const { data, error } = await supabaseClient
    .from('reports')
    .select('*')
    .eq('auth_user_id', currentUser.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
  
  // فیلتر کردن و اضافه کردن شناسه دیتابیس به آبجکت
  return data
    .filter(r => !hiddenIds.includes(r.id))
    .map(r => ({
       ...r.details,
       _dbId: r.id // ذخیره شناسه اصلی دیتابیس
    }));
}

// تابع جدید برای پنهان کردن گزارش در دیتابیس
async function hideReportInSupabase(localId, dbId) {
  if (!currentUser) return;
  let targetId = dbId;

  // اگر شناسه دیتابیس را نداشتیم، با شناسه محلی آن را پیدا می‌کنیم
  if (!targetId) {
     console.log("شناسه دیتابیس یافت نشد، جستجو بر اساس شناسه محلی:", localId);
     const { data, error } = await supabaseClient
       .from('reports')
       .select('id')
       .eq('details->>id', localId)
       .single();
       
     if (error) console.error("خطا در جستجوی گزارش:", error);
     if (data) targetId = data.id;
  }

  if (targetId) {
     const { error } = await supabaseClient
       .from('hidden_reports')
       .insert([{ user_id: currentUser.id, report_id: targetId }]);
       
     if (error) {
       console.error("خطا در پنهان‌سازی ابری:", error);
       throw error;
     } else {
       console.log("گزارش با موفقیت در ابر پنهان شد:", targetId);
     }
  } else {
     console.error("گزارش در دیتابیس پیدا نشد.");
     throw new Error("گزارش در دیتابیس پیدا نشد");
  }
}
