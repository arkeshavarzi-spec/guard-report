/* =========================================================
   اتصال به Supabase — احراز هویت و ذخیره داده
   ========================================================= */

const SUPABASE_URL = 'https://flhfnpjrcisgoghvwbyd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_WmrUwWR3TpCTrIildF37_w_VcfAgXXs';

// مقداردهی اولیه با تنظیمات پایدار برای دور زدن خطای QUIC
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
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
          err.textContent = (error.message === 'Invalid login credentials' ? 'ایمیل یا رمز عبور اشتباه است.' : error.message);
          return;
        }

        currentUser = data.user;
        showApp(data.user.email);
        showToast('✅ خوش آمدید', 'success');
      } catch (e) {
        console.error("Network Error:", e);
        err.textContent = 'خطای شبکه: لطفاً اتصال اینترنت خود را بررسی کنید.';
      } finally {
        btn.disabled = false;
        btn.textContent = 'ورود به سامانه';
      }
    });
  }

  // دکمه خروج
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
      details: report,
      notes: report.notes || '',
      status: 'unread'
    }])
    .select();

  if (error) throw error;
  return data;
}

// آپلود عکس به باکس Supabase و دریافت لینک عمومی
async function uploadImageToSupabase(file) {
  if (!file) return null;
  
  // ساخت یک نام یکتا برای فایل
  const fileExt = file.name.split('.').pop();
  const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
  
  // آپلود فایل به باکس report-images
  const { data, error } = await supabaseClient.storage
    .from('report-images')
    .upload(fileName, file);

  if (error) throw error;

  // دریافت لینک عمومی (Public URL)
  const { data: urlData } = supabaseClient.storage
    .from('report-images')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}
