-- =====================================================
--  ساخت جدول اماکن و پست‌های حفاظتی
-- =====================================================

-- ۱. جدول دانشکده/واحدها
CREATE TABLE IF NOT EXISTS public.locations (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ۲. جدول پست‌های حفاظتی (با کلید خارجی به locations)
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  location_id TEXT NOT NULL REFERENCES public.locations(id),
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ۳. فعال‌سازی RLS
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- ۴. سیاست‌های خواندن (همه کاربران لاگین‌کرده)
DROP POLICY IF EXISTS "Auth read locations" ON public.locations;
CREATE POLICY "Auth read locations" ON public.locations
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Auth read posts" ON public.posts;
CREATE POLICY "Auth read posts" ON public.posts
FOR SELECT TO authenticated USING (true);

-- ۵. سیاست‌های تغییر (فقط ادمین‌ها)
DROP POLICY IF EXISTS "Admin write locations" ON public.locations;
CREATE POLICY "Admin write locations" ON public.locations
FOR ALL TO authenticated
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin')
WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admin write posts" ON public.posts;
CREATE POLICY "Admin write posts" ON public.posts
FOR ALL TO authenticated
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin')
WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- ۶. انتقال 10 دانشکده/واحد فعلی
INSERT INTO public.locations (id, label, sort_order, is_active) VALUES

  ('eram', 'پردیس ارم', 1, true),
  ('boy_dorm', 'خوابگاه‌های پسران', 2, true),
  ('humanities', 'دانشکده‌های علوم انسانی', 3, true),
  ('engineering', 'دانشکده‌های مهندسی', 4, true),
  ('science', 'دانشکده علوم', 5, true),
  ('art', 'دانشکده هنر و معماری', 6, true),
  ('international', 'پردیس بین‌الملل', 7, true),
  ('tourism', 'اماکن گردشگری، رفاهی و مشاوره‌ای', 8, true),
  ('agriculture', 'دانشکده کشاورزی', 9, true),
  ('vet', 'دانشکده دامپزشکی', 10, true)
ON CONFLICT (id) DO NOTHING;

-- ۷. انتقال 41 پست حفاظتی فعلی
INSERT INTO public.posts (id, location_id, label, sort_order, is_active) VALUES

  ('eram_main_gate', 'eram', 'ورودی اصلی', 1, true),
  ('eram_kohsar_gate', 'eram', 'ورودی کوهسار', 2, true),
  ('eram_reyhaneh_gate', 'eram', 'ورودی ریحانه', 3, true),
  ('eram_arazi_gate', 'eram', 'ورودی اراضی', 4, true),
  ('eram_girls_dorm_gate', 'eram', 'ورودی خوابگاه دختران', 5, true),
  ('eram_management_gate', 'eram', 'ورودی ساختمان مدیریت', 6, true),
  ('eram_new_tech', 'eram', 'دانشکده فناوری‌های نوین', 7, true),
  ('eram_bagh_eram_gate', 'eram', 'ورودی باغ ارم', 8, true),
  ('eram_bagh_eram_parking', 'eram', 'پارکینگ باغ ارم', 9, true),
  ('eram_mobile_patrol', 'eram', 'گشت سیار', 10, true),
  ('boy_dorm_mofatteh', 'boy_dorm', 'خوابگاه شهید مفتح', 11, true),
  ('boy_dorm_dastgheib', 'boy_dorm', 'خوابگاه شهید دستغیب', 12, true),
  ('boy_dorm_chamran', 'boy_dorm', 'خوابگاه شهید چمران', 13, true),
  ('boy_dorm_iransara', 'boy_dorm', 'خوابگاه ایران‌سرا', 14, true),
  ('humanities_faculty', 'humanities', 'دانشکده علوم انسانی', 15, true),
  ('humanities_central_lib', 'humanities', 'کتابخانه مرکزی و مرکز اسناد', 16, true),
  ('engineering_building1', 'engineering', 'ساختمان شماره یک', 17, true),
  ('engineering_building2', 'engineering', 'ساختمان شماره دو', 18, true),
  ('engineering_kharazmi_lib', 'engineering', 'کتابخانه خوارزمی', 19, true),
  ('science_building1', 'science', 'ساختمان شماره یک', 20, true),
  ('science_building3', 'science', 'ساختمان شماره سه', 21, true),
  ('science_parking', 'science', 'پارکینگ', 22, true),
  ('art_main_gate', 'art', 'ورودی اصلی', 23, true),
  ('art_parking', 'art', 'پارکینگ', 24, true),
  ('tourism_naranjestan', 'tourism', 'باغ موزه نارنجستان قوام', 25, true),
  ('tourism_cultural_complex', 'tourism', 'مجتمع فرهنگی رفاهی', 26, true),
  ('tourism_counseling', 'tourism', 'مرکز مشاوره و سبک زندگی', 27, true),
  ('tourism_mostafavi_camp', 'tourism', 'اردوگاه دکتر مصطفوی', 28, true),
  ('tourism_koushkak', 'tourism', 'مرکز تحقیقاتی کوشکک', 29, true),
  ('agri_main_gate', 'agriculture', 'ورودی اصلی', 30, true),
  ('agri_mobile_walk', 'agriculture', 'گشت سیار پیاده', 31, true),
  ('agri_mobile_vehicle', 'agriculture', 'گشت خودرویی', 32, true),
  ('agri_faculty_housing', 'agriculture', 'کوی اساتید', 33, true),
  ('agri_arazi_station', 'agriculture', 'ایستگاه اراضی', 34, true),
  ('agri_aghrabei_station', 'agriculture', 'ایستگاه عقربه‌ای', 35, true),
  ('agri_beheshti_dorm', 'agriculture', 'خوابگاه شهید بهشتی', 36, true),
  ('agri_motahari_dorm', 'agriculture', 'خوابگاه شهید مطهری', 37, true),
  ('vet_main_gate', 'vet', 'ورودی اصلی', 38, true),
  ('vet_mobile', 'vet', 'گشت سیار', 39, true),
  ('vet_dorm', 'vet', 'خوابگاه', 40, true),
  ('vet_animal_husbandry', 'vet', 'دامپروری و اصطبل', 41, true)
ON CONFLICT (id) DO NOTHING;
