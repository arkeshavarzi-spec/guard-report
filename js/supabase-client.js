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
  const overlay = document.getElementById('loginOverlay');
  if (!overlay) return; // اگر در داشبورد هستیم، بررسی احراز هویت را متوقف کن
  
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session && session.user) {
    currentUser = session.user;
    showApp(session.user.email, session.user.id);
  } else {
    showLogin();
  }
}

function showLogin() {
  const overlay = document.getElementById('loginOverlay');
  if (!overlay) return; // اگر در داشبورد هستیم، هیچ کاری نکن
  overlay.classList.remove('hidden');
  document.getElementById('userMenuContainer').classList.add('hidden');
  const app = document.querySelector('.app-container');
  if (app) app.style.display = 'none';
}

async function showApp(email, userId) {
  const overlay = document.getElementById('loginOverlay');
  if (!overlay) return; // اگر در داشبورد هستیم، هیچ کاری نکن
  overlay.classList.add('hidden');
  document.getElementById('userMenuContainer').classList.remove('hidden');
  document.getElementById('userEmail').textContent = email;
  const app = document.querySelector('.app-container');
  if (app) app.style.display = '';

  // بررسی نقش کاربر برای نمایش دکمه داشبورد
  if (userId) {
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
      
    if (profile && profile.role === 'admin') {
      const dashBtn = document.getElementById('goToDashboardBtn');
      if (dashBtn) dashBtn.classList.remove('hidden');
    }
  }
}

// رویداد ورود
document.addEventListener('DOMContentLoaded', () => {
  // اگر در صفحه داشبورد هستیم، منطق‌های فرم اصلی را اجرا نکن
  if (window.location.pathname.includes('dashboard.html')) return;

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
        showApp(data.user.email, data.user.id);
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


  // منطق منوی آواتار (Dropdown)
  const userMenuBtn = document.getElementById('userMenuBtn');
  const userDropdown = document.getElementById('userDropdown');
  
  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Avatar clicked! Toggling dropdown...");
      userDropdown.classList.toggle('hidden');
      userMenuBtn.classList.toggle('active');
    });

    // بستن منو وقتی روی جای دیگری کلیک شود
    document.addEventListener('click', (e) => {
      // استفاده از contains بررسی می‌کند که آیا کلیک روی خود دکمه (یا آیکون داخل آن) بوده یا خیر
      if (!userDropdown.classList.contains('hidden') && 
          !userDropdown.contains(e.target) && 
          !userMenuBtn.contains(e.target)) {
        userDropdown.classList.add('hidden');
        userMenuBtn.classList.remove('active');
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
  
  const { data, error } = await supabaseClient
    .from('reports')
    .select('*')
    .eq('auth_user_id', currentUser.id)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return data.map(r => {
    const hiddenBy = r.hidden_by || [];
    return { 
      ...r.details, 
      _dbId: r.id, 
      _isHidden: hiddenBy.includes(currentUser.id) 
    };
  });
}

// تابع جدید برای پنهان کردن گزارش در دیتابیس
async function hideReportInSupabase(localId, dbId) {
  if (!currentUser) throw new Error('کاربر وارد نشده است');
  if (!dbId) throw new Error('شناسه دیتابیس یافت نشد');

  const { data: report, error: getError } = await supabaseClient
    .from('reports')
    .select('hidden_by')
    .eq('id', dbId)
    .single();
  
  if (getError) throw getError;

  const hiddenBy = report.hidden_by || [];
  if (!hiddenBy.includes(currentUser.id)) {
    hiddenBy.push(currentUser.id);
    const { error: updateError } = await supabaseClient
      .from('reports')
      .update({ hidden_by: hiddenBy })
      .eq('id', dbId);
      
    if (updateError) throw updateError;
  }
}

// پنهان کردن دسته‌جمعی تمام گزارش‌های کاربر
async function hideAllReportsInSupabase() {
  if (!currentUser) return;
  const { error } = await supabaseClient.rpc('hide_all_my_reports');
  if (error) throw error;
}

// =========================================================
// سینک هوشمند پرسنل (ابر ← کش ← فایل پشتیبان)
// =========================================================
async function fetchAndSyncPersonnel() {
  // ۱. بارگذاری از کش (اگر وجود دارد)
  const cached = localStorage.getItem('personnel_cache_v1');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.personnel && parsed.reporters) {
        updateGlobalPersonnel(parsed.personnel, parsed.reporters);
      }
    } catch(e) { console.warn("Cache parse error", e); }
  }

  // ۲. تلاش برای دریافت از Supabase
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    try {
      const { data, error } = await supabaseClient.from('personnel').select('*').eq('is_active', true);
      
      if (!error && data && data.length > 0) {
        const newPersonnel = data.map(p => ({
          id: p.id,
          fullName: p.full_name,
          nationalId: p.national_id || '',
          shaba: p.shaba || '',
          phone: p.phone || ''
        }));
        
        const newReporters = data.filter(p => p.can_report).map(p => p.id);
        
        // ذخیره در کش برای دفعات بعد
        localStorage.setItem('personnel_cache_v1', JSON.stringify({ personnel: newPersonnel, reporters: newReporters }));
        
        // به‌روزرسانی آرایه‌های سراسری
        updateGlobalPersonnel(newPersonnel, newReporters);
      }
    } catch(e) {
      console.warn("Could not sync from cloud. Using cache/fallback.", e);
    }
  }
}

// تابع کمکی برای به‌روزرسانی آرایه‌های سراسری
function updateGlobalPersonnel(newPersonnel, newReporters) {
  if (typeof PERSONNEL !== 'undefined' && Array.isArray(PERSONNEL)) {
    PERSONNEL.length = 0;
    PERSONNEL.push(...newPersonnel);
  }
  if (typeof REPORTERS !== 'undefined' && Array.isArray(REPORTERS)) {
    REPORTERS.length = 0;
    REPORTERS.push(...newReporters);
  }
}

// =========================================================
// سینک هوشمند اماکن و پست‌ها (ابر ← کش ← فالبک)
// =========================================================
async function fetchAndSyncLocations() {
  // ۱. بارگذاری از کش
  const cached = localStorage.getItem('locations_cache_v1');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.locations && parsed.posts) {
        updateGlobalLocations(parsed.locations, parsed.posts);
      }
    } catch(e) { console.warn("Locations cache parse error", e); }
  }

  // ۲. تلاش برای دریافت از Supabase
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    try {
      // دریافت همزمان دانشکده‌ها و پست‌ها
      const [locRes, postRes] = await Promise.all([
        supabaseClient.from('locations').select('*').eq('is_active', true).order('sort_order'),
        supabaseClient.from('posts').select('*').eq('is_active', true).order('sort_order')
      ]);

      if (!locRes.error && !postRes.error && locRes.data && postRes.data) {
        const newLocations = locRes.data.map(l => ({
          name: l.id,
          label: l.label
        }));
        
        // فقط پست‌هایی را نگه می‌داریم که دانشکده‌شان فعال است
        const activeLocIds = new Set(newLocations.map(l => l.name));
        const newPosts = postRes.data
          .filter(p => activeLocIds.has(p.location_id))
          .map(p => ({
            name: p.id,
            label: p.label,
            location: p.location_id
          }));

        // ذخیره در کش
        localStorage.setItem('locations_cache_v1', JSON.stringify({ locations: newLocations, posts: newPosts }));
        
        // به‌روزرسانی آرایه‌های سراسری
        updateGlobalLocations(newLocations, newPosts);
      }
    } catch(e) {
      console.warn("Could not sync locations from cloud. Using cache/fallback.", e);
    }
  }
}

// تابع کمکی برای به‌روزرسانی آرایه‌های LOCATIONS و POSTS
function updateGlobalLocations(newLocations, newPosts) {
  if (typeof LOCATIONS !== 'undefined' && Array.isArray(LOCATIONS)) {
    LOCATIONS.length = 0;
    LOCATIONS.push(...newLocations);
  }
  if (typeof POSTS !== 'undefined' && Array.isArray(POSTS)) {
    POSTS.length = 0;
    POSTS.push(...newPosts);
  }
}
