/* =========================================================
   داده‌های ساختاریافته — برگرفته از فایل‌های اسامی پست‌ها و پرسنل
   ========================================================= */

const LOCATIONS = [
  { name: 'eram',          label: 'پردیس ارم' },
  { name: 'boy_dorm',      label: 'خوابگاه‌های پسران' },
  { name: 'humanities',    label: 'دانشکده‌های علوم انسانی' },
  { name: 'engineering',   label: 'دانشکده‌های مهندسی' },
  { name: 'science',       label: 'دانشکده علوم' },
  { name: 'art',           label: 'دانشکده هنر و معماری' },
  { name: 'international', label: 'پردیس بین‌الملل' },
  { name: 'tourism',       label: 'اماکن گردشگری، رفاهی و مشاوره‌ای' },
  { name: 'agriculture',   label: 'دانشکده کشاورزی' },
  { name: 'vet',           label: 'دانشکده دامپزشکی' }
];

const POSTS = [
  // پردیس ارم
  { name: 'eram_main_gate',         label: 'ورودی اصلی',                  location: 'eram' },
  { name: 'eram_kohsar_gate',       label: 'ورودی کوهسار',                location: 'eram' },
  { name: 'eram_reyhaneh_gate',     label: 'ورودی ریحانه',                location: 'eram' },
  { name: 'eram_arazi_gate',        label: 'ورودی اراضی',                 location: 'eram' },
  { name: 'eram_girls_dorm_gate',   label: 'ورودی خوابگاه دختران',        location: 'eram' },
  { name: 'eram_management_gate',   label: 'ورودی ساختمان مدیریت',        location: 'eram' },
  { name: 'eram_new_tech',          label: 'دانشکده فناوری‌های نوین',     location: 'eram' },
  { name: 'eram_bagh_eram_gate',    label: 'ورودی باغ ارم',               location: 'eram' },
  { name: 'eram_bagh_eram_parking', label: 'پارکینگ باغ ارم',             location: 'eram' },
  { name: 'eram_mobile_patrol',     label: 'گشت سیار',                    location: 'eram' },

  // خوابگاه‌های پسران
  { name: 'boy_dorm_mofatteh',      label: 'خوابگاه شهید مفتح',           location: 'boy_dorm' },
  { name: 'boy_dorm_dastgheib',     label: 'خوابگاه شهید دستغیب',         location: 'boy_dorm' },
  { name: 'boy_dorm_chamran',       label: 'خوابگاه شهید چمران',          location: 'boy_dorm' },
  { name: 'boy_dorm_iransara',      label: 'خوابگاه ایران‌سرا',           location: 'boy_dorm' },

  // دانشکده‌های علوم انسانی
  { name: 'humanities_faculty',     label: 'دانشکده علوم انسانی',         location: 'humanities' },
  { name: 'humanities_central_lib', label: 'کتابخانه مرکزی و مرکز اسناد', location: 'humanities' },

  // دانشکده‌های مهندسی
  { name: 'engineering_building1',  label: 'ساختمان شماره یک',            location: 'engineering' },
  { name: 'engineering_building2',  label: 'ساختمان شماره دو',            location: 'engineering' },
  { name: 'engineering_kharazmi_lib', label: 'کتابخانه خوارزمی',          location: 'engineering' },

  // دانشکده علوم
  { name: 'science_building1',      label: 'ساختمان شماره یک',            location: 'science' },
  { name: 'science_building3',      label: 'ساختمان شماره سه',            location: 'science' },
  { name: 'science_parking',        label: 'پارکینگ',                     location: 'science' },

  // دانشکده هنر و معماری
  { name: 'art_main_gate',          label: 'ورودی اصلی',                  location: 'art' },
  { name: 'art_parking',            label: 'پارکینگ',                     location: 'art' },

  // پردیس بین‌الملل
  { name: 'international_main_gate',label: 'ورودی اصلی',                  location: 'international' },

  // اماکن گردشگری، رفاهی و مشاوره‌ای
  { name: 'tourism_naranjestan',    label: 'باغ موزه نارنجستان قوام',     location: 'tourism' },
  { name: 'tourism_natural_history',label: 'موزه تاریخ طبیعی',            location: 'tourism' },
  { name: 'tourism_cultural_complex', label: 'مجتمع فرهنگی رفاهی',        location: 'tourism' },
  { name: 'tourism_counseling',     label: 'مرکز مشاوره و سبک زندگی',     location: 'tourism' },
  { name: 'tourism_mostafavi_camp', label: 'اردوگاه دکتر مصطفوی',         location: 'tourism' },
  { name: 'tourism_koushkak',       label: 'مرکز تحقیقاتی کوشکک',         location: 'tourism' },

  // دانشکده کشاورزی
  { name: 'agri_main_gate',         label: 'ورودی اصلی',                  location: 'agriculture' },
  { name: 'agri_mobile_walk',       label: 'گشت سیار پیاده',              location: 'agriculture' },
  { name: 'agri_mobile_vehicle',    label: 'گشت خودرویی',                 location: 'agriculture' },
  { name: 'agri_faculty_housing',   label: 'کوی اساتید',                  location: 'agriculture' },
  { name: 'agri_arazi_station',     label: 'ایستگاه اراضی',               location: 'agriculture' },
  { name: 'agri_aghrabei_station',  label: 'ایستگاه عقربه‌ای',            location: 'agriculture' },
  { name: 'agri_beheshti_dorm',     label: 'خوابگاه شهید بهشتی',          location: 'agriculture' },
  { name: 'agri_motahari_dorm',     label: 'خوابگاه شهید مطهری',          location: 'agriculture' },

  // دانشکده دامپزشکی
  { name: 'vet_main_gate',          label: 'ورودی اصلی',                  location: 'vet' },
  { name: 'vet_mobile',             label: 'گشت سیار',                    location: 'vet' },
  { name: 'vet_dorm',               label: 'خوابگاه',                     location: 'vet' },
  { name: 'vet_animal_husbandry',   label: 'دامپروری و اصطبل',            location: 'vet' }
];

/* لیست پرسنل — از فایل فهرست همکاران حفاظت فیزیکی */
const PERSONNEL = [
  { id: 'p_2297947186', fullName: 'فرزاد ابراهیمی', nationalId: '2297947186', shaba: 'IR210120010000000615617140' },
  { id: 'p_2430573652', fullName: 'محمدرضا ابراهیمی', nationalId: '2430573652', shaba: 'IR680120010000000634101196' },
  { id: 'p_2420968719', fullName: 'مصطفی ابراهیمی', nationalId: '2420968719', shaba: 'IR840120010000002180839337' },
  { id: 'p_2297997884', fullName: 'حامد ابوالقاسم پور زاده بیگی', nationalId: '2297997884', shaba: 'IR220120010000004351506744' },
  { id: 'p_2296992722', fullName: 'سالک اتابکی', nationalId: '2296992722', shaba: 'IR620120010000000625537368' },
  { id: 'p_2390512178', fullName: 'منصور احمدی', nationalId: '2390512178', shaba: 'IR100120020000004902391723' },
  { id: 'p_2390511929', fullName: 'یزدان بخش احمدی', nationalId: '2390511929', shaba: 'IR730120010000000624603545' },
  { id: 'p_6070003004', fullName: 'زهرا ادیب', nationalId: '6070003004', shaba: 'IR150120000000009939253236' },
  { id: 'p_2282891181', fullName: 'مهرشاد اژدری', nationalId: '2282891181', shaba: 'IR230560611828006301888701' },
  { id: 'p_1288014953', fullName: 'مسعود اژدری', nationalId: '1288014953', shaba: 'IR510180000000144989492538' },
  { id: 'p_2299954295', fullName: 'حسین اسفندیاری', nationalId: '2299954295', shaba: '' },
  { id: 'p_2299945008', fullName: 'علی اکبر اسفندیاری', nationalId: '2299945008', shaba: '' },
  { id: 'p_2299931236', fullName: 'جواد اسفندیاری بیات', nationalId: '2299931236', shaba: 'IR880120010000000626350148' },
  { id: 'p_2299935894', fullName: 'علی اسفندیاری بیات', nationalId: '2299935894', shaba: '' },
  { id: 'p_2296115810', fullName: 'محمد مهدی اسفندیاری بیات', nationalId: '2296115810', shaba: 'IR470120010000000624677830' },
  { id: 'p_2292582155', fullName: 'رضا اسفندیاری بیات', nationalId: '2292582155', shaba: 'IR690120010000000612394809' },
  { id: 'p_2300011190', fullName: 'رضا اسفندیاری بیات(الخاس)', nationalId: '2300011190', shaba: 'IR070120000000000349885857' },
  { id: 'p_2380465290', fullName: 'علیرضا اسمعیلی', nationalId: '2380465290', shaba: 'IR340120020000009948349139' },
  { id: 'p_2300733250', fullName: 'محمدعلی امامی دشتکی', nationalId: '2300733250', shaba: 'IR070120000000004436085935' },
  { id: 'p_2296098673', fullName: 'حمیدرضا امیری فرد', nationalId: '2296098673', shaba: 'IR400120010000000607543585' },
  { id: 'p_2571632329', fullName: 'جمال انسانی', nationalId: '2571632329', shaba: 'IR640600483102516761221001' },
  { id: 'p_2380385106', fullName: 'پویا انصاری', nationalId: '2380385106', shaba: 'IR180180000000279023601439' },
  { id: 'p_2391313195', fullName: 'مهدی انصاری', nationalId: '2391313195', shaba: 'IR710120010000000769446212' },
  { id: 'p_2300930749', fullName: 'صدرا ایران بان', nationalId: '2300930749', shaba: 'IR040120010000004316404223' },
  { id: 'p_2295434106', fullName: 'مرتضی ایران محبوب', nationalId: '2295434106', shaba: 'IR180120010000000621845564' },
  { id: 'p_2295394368', fullName: 'اکبر ایزدی', nationalId: '2295394368', shaba: 'IR860120010000000769648866' },
  { id: 'p_5489820047', fullName: 'رضا ایزدی', nationalId: '5489820047', shaba: 'IR770600483102516135505001' },
  { id: 'p_4250310078', fullName: 'فتح اله اردم', nationalId: '4250310078', shaba: 'IR780120010000000614039670' },
  { id: 'p_2291478656', fullName: 'علی حسین اریامنش', nationalId: '2291478656', shaba: 'IR780120010000000128481047' },
  { id: 'p_2298220255', fullName: 'امین آسایش', nationalId: '2298220255', shaba: 'IR290120010000000222559125' },
  { id: 'p_2297910975', fullName: 'فرحناز آقایی', nationalId: '2297910975', shaba: 'IR400180000000000784262413' },
  { id: 'p_2471472540', fullName: 'عظیمه آقایی بهجانی', nationalId: '2471472540', shaba: 'IR780120010000001350031826' },
  { id: 'p_2292716844', fullName: 'نظام باصری', nationalId: '2292716844', shaba: 'IR920120000000004670795305' },
  { id: 'p_2430673312', fullName: 'محمدرضا بختیاری', nationalId: '2430673312', shaba: '' },
  { id: 'p_2293109577', fullName: 'بهنام بخسکار', nationalId: '2293109577', shaba: 'IR800120000000005881679113' },
  { id: 'p_2297045220', fullName: 'محمدجواد بخشی پور', nationalId: '2297045220', shaba: 'IR080120010000002044707316' },
  { id: 'p_2432509501', fullName: 'عبدالقادر بذرگر', nationalId: '2432509501', shaba: 'IR770120010000000752368381' },
  { id: 'p_2283948029', fullName: 'حسین براتی', nationalId: '2283948029', shaba: 'IR030560611828005825747101' },
  { id: 'p_5139866684', fullName: 'حسن برزگر', nationalId: '5139866684', shaba: 'IR180120000000003865307376' },
  { id: 'p_2295313899', fullName: 'رضا برزگر', nationalId: '2295313899', shaba: 'IR750120010000000621728235' },
  { id: 'p_2298528802', fullName: 'مهدی بغدادی پور', nationalId: '2298528802', shaba: 'IR070180000000357332055493' },
  { id: 'p_2430196484', fullName: 'عباس بکرایی', nationalId: '2430196484', shaba: 'IR580120010000000739349092' },
  { id: 'p_2390109731', fullName: 'حمید بوستانی', nationalId: '2390109731', shaba: 'IR110120010000003143153110' },
  { id: 'p_2298048551', fullName: 'جمال بهبود', nationalId: '2298048551', shaba: 'IR150120010000000625440244' },
  { id: 'p_2296160700', fullName: 'محمد ابراهیم بهرامی', nationalId: '2296160700', shaba: 'IR200120010000000774621789' },
  { id: 'p_2520125276', fullName: 'حمیدرضا بیگ اینالو', nationalId: '2520125276', shaba: 'IR500120020000009916710070' },
  { id: 'p_2440425354', fullName: 'رضا پارسا', nationalId: '2440425354', shaba: 'IR640120020000005848553971' },
  { id: 'p_2296217567', fullName: 'هادی پرنیان', nationalId: '2296217567', shaba: 'IR330120020000002167036026' },
  { id: 'p_5469903907', fullName: 'علی تابع بردبار', nationalId: '5469903907', shaba: 'IR900120000000000061776127' },
  { id: 'p_2297649940', fullName: 'محمد محسن توانا باب اناری', nationalId: '2297649940', shaba: 'IR360120010000000769369339' },
  { id: 'p_2297760817', fullName: 'محمد حسین تولایی', nationalId: '2297760817', shaba: 'IR260120010000000608279194' },
  { id: 'p_5149926345', fullName: 'مجید تیرانداز', nationalId: '5149926345', shaba: '' },
  { id: 'p_4220047743', fullName: 'علی اصغر ثروتی', nationalId: '4220047743', shaba: 'IR980120020000004879757905' },
  { id: 'p_2297620209', fullName: 'حمید جعفری', nationalId: '2297620209', shaba: 'IR080120010000000622216963' },
  { id: 'p_2390102778', fullName: 'محمد جعفری', nationalId: '2390102778', shaba: 'R٨۴٠۶٠٠۴٨١3٧٠٠٠٧١٢٣٢١٨٠٠١' },
  { id: 'p_5489794070', fullName: 'رحمت اله جمالزاده', nationalId: '5489794070', shaba: 'IR700170000000111419241005' },
  { id: 'p_2297506236', fullName: 'حسنعلی جمالی', nationalId: '2297506236', shaba: '' },
  { id: 'p_2432172647', fullName: 'پرویز جمشیدی', nationalId: '2432172647', shaba: 'IR160120010000000622422750' },
  { id: 'p_2451177896', fullName: 'مهرعلی جنتی پور', nationalId: '2451177896', shaba: 'IR780120010000000607572389' },
  { id: 'p_2282784766', fullName: 'حسین جوکار', nationalId: '2282784766', shaba: 'IR670120000000009856779796' },
  { id: 'p_2430131803', fullName: 'محمد جوکار فیروزی', nationalId: '2430131803', shaba: 'IR810120010000001373497721' },
  { id: 'p_2298285497', fullName: 'مصطفی چوگانی', nationalId: '2298285497', shaba: 'IR410120010000000736759207' },
  { id: 'p_2440516643', fullName: 'علی حجتی', nationalId: '2440516643', shaba: 'IR720120000000009780816484' },
  { id: 'p_2430198533', fullName: 'جواد حسینی', nationalId: '2430198533', shaba: 'IR890120010000000738970428' },
  { id: 'p_2299497730', fullName: 'سید اکبر حسینی', nationalId: '2299497730', shaba: 'IR250120010000000625012003' },
  { id: 'p_5149912425', fullName: 'مهدی حسینی تزنگی', nationalId: '5149912425', shaba: 'IR820120010000000621569805' },
  { id: 'p_2432186745', fullName: 'مهرزاد حسینی', nationalId: '2432186745', shaba: 'IR770600483179719412198001' },
  { id: 'p_2549571878', fullName: 'بهروز حسینی سریسی', nationalId: '2549571878', shaba: 'IR070120010000000625217773' },
  { id: 'p_2431862569', fullName: 'حجت اله حق گویان', nationalId: '2431862569', shaba: 'IR810120000000001149349601' },
  { id: 'p_2432212134', fullName: 'یدالله حق گویان', nationalId: '2432212134', shaba: 'IR150120010000000607637058' },
  { id: 'p_2282941780', fullName: 'زهرا حکمت ارا', nationalId: '2282941780', shaba: 'IR400120020000009844417508' },
  { id: 'p_2450095403', fullName: 'محسن حکیم پور', nationalId: '2450095403', shaba: 'IR350120010000000746262502' },
  { id: 'p_2299055886', fullName: 'علیرضا حیدری', nationalId: '2299055886', shaba: 'IR810120010000000607769633' },
  { id: 'p_2281939804', fullName: 'مژگان خاکی هندیجانی', nationalId: '2281939804', shaba: 'IR610120020000008564698555' },
  { id: 'p_2390047440', fullName: 'امراله خداپرست کازرونیان', nationalId: '2390047440', shaba: 'IR870120010000000628857422' },
  { id: 'p_2411165617', fullName: 'محمدحسین خسروانیان', nationalId: '2411165617', shaba: 'IR810120010000000633918893' },
  { id: 'p_2432733101', fullName: 'منصور خسروانیان', nationalId: '2432733101', shaba: 'IR560120010000000754470167' },
  { id: 'p_2538989310', fullName: 'محمد صادق خسروی', nationalId: '2538989310', shaba: '' },
  { id: 'p_2372469053', fullName: 'مهراز خورشیدی', nationalId: '2372469053', shaba: 'IR800120020000003392779075' },
  { id: 'p_2296218083', fullName: 'ساسان دهقان قصراحمدی', nationalId: '2296218083', shaba: 'IR110120010000000770325336' },
  { id: 'p_6870013691', fullName: 'مهدی درخوش', nationalId: '6870013691', shaba: 'IR860570077700002493125001' },
  { id: 'p_2432544218', fullName: 'حسین ربیع زاده', nationalId: '2432544218', shaba: 'IR520120010000000606260253' },
  { id: 'p_2432563239', fullName: 'محمد ربیع زاده', nationalId: '2432563239', shaba: 'IR050120010000000754457505' },
  { id: 'p_2280688735', fullName: 'فروزان رحمانی باوریانی', nationalId: '2280688735', shaba: 'IR570120010000004936603712' },
  { id: 'p_2297977281', fullName: 'رحمان رحمان پور', nationalId: '2297977281', shaba: 'IR590120010000000623139776' },
  { id: 'p_2297963671', fullName: 'مسعود رحیمی', nationalId: '2297963671', shaba: 'IR360120000000004705987331' },
  { id: 'p_5149935387', fullName: 'امید رحیمی کوهنجانی', nationalId: '5149935387', shaba: 'IR410120010000000716003438' },
  { id: 'p_6489606331', fullName: 'هوشنگ رستمی خواجه ای', nationalId: '6489606331', shaba: '' },
  { id: 'p_5149910058', fullName: 'احد رضایی', nationalId: '5149910058', shaba: 'IR620120010000000639950307' },
  { id: 'p_6550074614', fullName: 'سید محمد رضوی', nationalId: '6550074614', shaba: 'IR130180000000279026222469' },
  { id: 'p_2420390271', fullName: 'محمدرضا رفیع زاده', nationalId: '2420390271', shaba: 'IR900120000000009848374138' },
  { id: 'p_2430458160', fullName: 'امیرعلی رفیعی سهل آبادی', nationalId: '2430458160', shaba: 'IR280120010000000222220710' },
  { id: 'p_2572469995', fullName: 'جعفر رنجبر', nationalId: '2572469995', shaba: 'IR390120000000004829154094' },
  { id: 'p_2299956506', fullName: 'حسین روستا', nationalId: '2299956506', shaba: 'IR690120020000009357865859' },
  { id: 'p_2420906985', fullName: 'عارف روشنی دوست', nationalId: '2420906985', shaba: 'IR980120020000002228321978' },
  { id: 'p_2295560111', fullName: 'مصطفی زادخو', nationalId: '2295560111', shaba: 'IR420560611828006277908601' },
  { id: 'p_229953175', fullName: 'محمد باقر زارع', nationalId: '229953175', shaba: '' },
  { id: 'p_2431978311', fullName: 'محمدرضا زارع', nationalId: '2431978311', shaba: 'IR610120010000000755273722' },
  { id: 'p_2291308246', fullName: 'مصیب زارع', nationalId: '2291308246', shaba: 'IR360120010000003133792257' },
  { id: 'p_2430212676', fullName: 'سعید زارع', nationalId: '2430212676', shaba: 'IR330180000000177026483403' },
  { id: 'p_2300167808', fullName: 'حسین زارع خلیلی', nationalId: '2300167808', shaba: 'IR430120010000000717273617' },
  { id: 'p_2301236188', fullName: 'حمید زارع قشلاقی', nationalId: '2301236188', shaba: 'IR320120020000005138586521' },
  { id: 'p_2298238571', fullName: 'مهدی زارع مویدی', nationalId: '2298238571', shaba: 'IR140120010000000184247984' },
  { id: 'p_2298910030', fullName: 'رحیم زارعی', nationalId: '2298910030', shaba: 'IR770120000000000175273248' },
  { id: 'p_2452397687', fullName: 'عیسی زارعی گنکی', nationalId: '2452397687', shaba: 'IR430160000000001061939928' },
  { id: 'p_2283203961', fullName: 'محمد هادی زازرانی', nationalId: '2283203961', shaba: 'IR630120010000000606983190' },
  { id: 'p_2292130491', fullName: 'محسن زره', nationalId: '2292130491', shaba: 'IR950120010000000623539253' },
  { id: 'p_2451150718', fullName: 'کاوه ساتیاری', nationalId: '2451150718', shaba: '' },
  { id: 'p_2298959031', fullName: 'کامران سلطان فر', nationalId: '2298959031', shaba: 'IR960120010000000614022856' },
  { id: 'p_2296252494', fullName: 'مهدی سلمان', nationalId: '2296252494', shaba: 'IR370120010000000621765682' },
  { id: 'p_2420794257', fullName: 'محسن سلمان پور', nationalId: '2420794257', shaba: 'IR260120000000009386851521' },
  { id: 'p_2300301547', fullName: 'محمدمهدی سلمانی محلی', nationalId: '2300301547', shaba: 'IR530120010000002074601518' },
  { id: 'p_2299027688', fullName: 'سعید سهامی', nationalId: '2299027688', shaba: 'IR640120010000000625149914' },
  { id: 'p_5469913120', fullName: 'محمد شاه قطبی', nationalId: '5469913120', shaba: '' },
  { id: 'p_2430252422', fullName: 'احسان شریف زاده', nationalId: '2430252422', shaba: 'IR020120010000000755236372' },
  { id: 'p_2296243746', fullName: 'نبی اله شریفی', nationalId: '2296243746', shaba: 'IR580120010000000607190278' },
  { id: 'p_2297524803', fullName: 'حمید رضا شریفی تزنگی', nationalId: '2297524803', shaba: 'IR980120010000000626109990' },
  { id: 'p_2510130099', fullName: 'مجیدرضا شفیعی زاده', nationalId: '2510130099', shaba: '' },
  { id: 'p_2298040303', fullName: 'محسن شگفت فر', nationalId: '2298040303', shaba: 'IR610170000000339510530009' },
  { id: 'p_2297044186', fullName: 'محسن شناوری', nationalId: '2297044186', shaba: 'IR370120010000000606048578' },
  { id: 'p_2431850528', fullName: 'حسین شهریاری گرایی', nationalId: '2431850528', shaba: '' },
  { id: 'p_1751324893', fullName: 'عبدالمجید شیرزادی', nationalId: '1751324893', shaba: 'IR130120010000001809762750' },
  { id: 'p_5140060035', fullName: 'عاطفه صادقی', nationalId: '5140060035', shaba: 'IR220120000000009854603926' },
  { id: 'p_2571693697', fullName: 'فخرالسادات صادقی', nationalId: '2571693697', shaba: 'IR140570077700004440094001' },
  { id: 'p_2298250251', fullName: 'اسفندیار طلاب زاده', nationalId: '2298250251', shaba: 'IR640120010000000750350336' },
  { id: 'p_2297012586', fullName: 'محمدمهدی ظریف طاش', nationalId: '2297012586', shaba: 'IR600120010000000633648156' },
  { id: 'p_2298028389', fullName: 'محمدجواد عباس زاده', nationalId: '2298028389', shaba: '' },
  { id: 'p_2293109844', fullName: 'صادق عباس نژادیان', nationalId: '2293109844', shaba: '' },
  { id: 'p_2298559880', fullName: 'مریم عباسی', nationalId: '2298559880', shaba: 'IR340180000000345266006369' },
  { id: 'p_5149964697', fullName: 'سجاد عباسی پای برجی', nationalId: '5149964697', shaba: 'IR020120010000001302730950' },
  { id: 'p_2452089281', fullName: 'جعفر عزیزی نژاد', nationalId: '2452089281', shaba: 'IR940120010000001724623034' },
  { id: 'p_2295615992', fullName: 'غلامرضا عسکری', nationalId: '2295615992', shaba: 'IR720120020000005042074972' },
  { id: 'p_1754832482', fullName: 'غلامحسین عسکری کوچی', nationalId: '1754832482', shaba: 'IR240120000000000017782577' },
  { id: 'p_2298271641', fullName: 'محمدحسین علیزاده', nationalId: '2298271641', shaba: '' },
  { id: 'p_2296171826', fullName: 'مجید غضنفری شبانکاره', nationalId: '2296171826', shaba: 'IR860170000000112761194007' },
  { id: 'p_2451387890', fullName: 'اکبر غضنفری شبانکاره', nationalId: '2451387890', shaba: 'IR340120020000005249134475' },
  { id: 'p_2420899911', fullName: 'محمدرضا غلامی', nationalId: '2420899911', shaba: 'IR290170000000356668278003' },
  { id: 'p_2298327866', fullName: 'محمد علی غلامی', nationalId: '2298327866', shaba: 'IR960180000000245799884237' },
  { id: 'p_2452091960', fullName: 'علی فاتح نژاد', nationalId: '2452091960', shaba: 'IR500120010000000635709683' },
  { id: 'p_2297864531', fullName: 'محسن فرج پور', nationalId: '2297864531', shaba: 'IR720120000000002316734675' },
  { id: 'p_2295368634', fullName: 'محمدحسین فلسفی منش', nationalId: '2295368634', shaba: 'IR660120010000008670360045' },
  { id: 'p_2432530608', fullName: 'عباس قاسم زاده', nationalId: '2432530608', shaba: 'IR930120010000001534636039' },
  { id: 'p_2297898878', fullName: 'جمشید قاسمیان', nationalId: '2297898878', shaba: 'IR790160000000000940883280' },
  { id: 'p_2298061394', fullName: 'محمدهادی قنبری', nationalId: '2298061394', shaba: 'IR920120010000000607418683' },
  { id: 'p_2295477786', fullName: 'عنایت اله کارگر', nationalId: '2295477786', shaba: 'IR600120010000000606686521' },
  { id: 'p_2281674401', fullName: 'حسین کاظمی شولی', nationalId: '2281674401', shaba: '' },
  { id: 'p_5480029827', fullName: 'الهه کاظمی', nationalId: '5480029827', shaba: '' },
  { id: 'p_2297915810', fullName: 'غلامرضا کبیری نیا', nationalId: '2297915810', shaba: 'IR840120000000003388277745' },
  { id: 'p_2283427142', fullName: 'محسن کدخدا', nationalId: '2283427142', shaba: 'IR140120020000009071614320' },
  { id: 'p_2281306031', fullName: 'علیرضا کرمی', nationalId: '2281306031', shaba: '' },
  { id: 'p_2296971423', fullName: 'علی اکبر کریمی', nationalId: '2296971423', shaba: 'IR450120010000000625230766' },
  { id: 'p_2432235908', fullName: 'غلامحسن کریمی آخورمه', nationalId: '2432235908', shaba: 'IR070120020000000818357418' },
  { id: 'p_2299962761', fullName: 'علی کسایی تبار', nationalId: '2299962761', shaba: 'IR330120010000000759601590' },
  { id: 'p_2298558779', fullName: 'علیرضا کشاورزی', nationalId: '2298558779', shaba: 'IR190120010000000621618760' },
  { id: 'p_4220302875', fullName: 'مهرزاد کوهی', nationalId: '4220302875', shaba: 'IR080120000000008824372416' },
  { id: 'p_2280765748', fullName: 'الهام گل محمدی', nationalId: '2280765748', shaba: 'IR270180000000279048009581' },
  { id: 'p_2380249741', fullName: 'عدنان گودرزی', nationalId: '2380249741', shaba: 'IR280120000000008219634383' },
  { id: 'p_2292924056', fullName: 'هادی لطفی پور', nationalId: '2292924056', shaba: 'IR650660000000200273916007' },
  { id: 'p_2451215577', fullName: 'محمد مالنجانی', nationalId: '2451215577', shaba: 'IR320120010000000755880203' },
  { id: 'p_2391462565', fullName: 'شهرام محقق زاده', nationalId: '2391462565', shaba: 'IR460120010000000633580702' },
  { id: 'p_2390973167', fullName: 'سارا محمدی', nationalId: '2390973167', shaba: 'IR690120010000004842761719' },
  { id: 'p_2298298882', fullName: 'علیرضا مرادی', nationalId: '2298298882', shaba: 'IR070120000000000233615740' },
  { id: 'p_2298865795', fullName: 'محمد حسن مردانی', nationalId: '2298865795', shaba: 'IR300120000000001783972631' },
  { id: 'p_2560304961', fullName: 'محمد مهدی مروجی', nationalId: '2560304961', shaba: 'IR150180000000279046902445' },
  { id: 'p_2430454475', fullName: 'مهدی مزارعی دشتکی', nationalId: '2430454475', shaba: 'IR700120020000001184878932' },
  { id: 'p_2297526261', fullName: 'مجتبی مستوفی', nationalId: '2297526261', shaba: 'IR040120000000000288728381' },
  { id: 'p_2297594801', fullName: 'محمد مطوس', nationalId: '2297594801', shaba: 'IR660120010000000624532667' },
  { id: 'p_2297050275', fullName: 'هادی معصومی', nationalId: '2297050275', shaba: 'IR380120020000004637985127' },
  { id: 'p_2371173207', fullName: 'کرامت اله ملک پور', nationalId: '2371173207', shaba: 'IR580120010000001186839483' },
  { id: 'p_2296895220', fullName: 'سید احمد موسوی', nationalId: '2296895220', shaba: 'IR920120010000000607452051' },
  { id: 'p_2371151149', fullName: 'مهران مهبودی', nationalId: '2371151149', shaba: 'IR650120010000000184211079' },
  { id: 'p_2293128490', fullName: 'بیژن میرخاقانی حقیقی', nationalId: '2293128490', shaba: 'IR240120010000000755420567' },
  { id: 'p_2298688230', fullName: 'عبدالرضا میرزایی', nationalId: '2298688230', shaba: 'IR870120020000009499513083' },
  { id: 'p_2295503434', fullName: 'هادی میرزایی', nationalId: '2295503434', shaba: 'R470180000000177016591479' },
  { id: 'p_2430673231', fullName: 'محسن نعمت الهی', nationalId: '2430673231', shaba: 'IR250120010000000629001128' },
  { id: 'p_2282244656', fullName: 'میلاد نوربخش', nationalId: '2282244656', shaba: 'IR110120020000005435885206' },
  { id: 'p_2300386501', fullName: 'مرتضی نیک سرشت', nationalId: '2300386501', shaba: 'IR860120000000004609826839' },
  { id: 'p_2298953724', fullName: 'جواد نیکوکلاه', nationalId: '2298953724', shaba: 'IR830120010000000725515569' },
  { id: 'p_2298227527', fullName: 'مهدی ولی تنها', nationalId: '2298227527', shaba: '' },
  { id: 'p_2283281938', fullName: 'محمدرضا همتی', nationalId: '2283281938', shaba: 'IR860120010000008091803961' },
  { id: 'p_2451161019', fullName: 'مرتضی همتی', nationalId: '2451161019', shaba: 'IR100120010000000612472889' },
  { id: 'p_5480025015', fullName: 'احمد رضا یدالهی', nationalId: '5480025015', shaba: 'IR200120010000002202087660' },
  { id: 'p_2299091998', fullName: 'علی اکبر یزدان شناس', nationalId: '2299091998', shaba: 'IR810120010000000630013285' },
];


/* لیست مسئولین گشت و شیفت — مجاز به ثبت گزارش */
const REPORTERS = [
  "p_2298558779",  // علی‌رضا کشاورزی
  "p_2300733250",  // محمدعلی امامی دشتکی
  "p_2300301547",  // محمد مهدی سلمانی محلی
  "p_2299497730",  // سید اکبر حسینی
  "p_2298298882",  // علیرضا مرادی
  "p_2299962761",  // علی کسایی تبار
  "p_2298910030",  // رحیم زارعی
  "p_2297050275",  // هادی معصومی
  "p_5149935387",  // امید رحیمی کوهنجانی
  "p_4220302875",  // مهرزاد کوهی
  "p_2296218083",  // ساسان دهقان قصر احمدی
  "p_2390047440",  // امراله خداپرست کازرونیان
  "p_2420794257",  // محسن سلمان پور
  "p_2282244656",  // میلاد نوربخش
  "p_2296252494",  // مهدی سلمان
  "p_2296171826",  // مجید غضنفری
  "p_2390109731",  // حمید بوستانی
  "p_2298048551",  // جمال بهبود
  "p_2432733101",  // منصور خسروانیان
  "p_2432212134",  // یدالله حق گویان
  "p_2292582155",  // رضا اسفندیاری بیات (اسکندر)
  "p_2380249741"   // عدنان گودرزی
];

