# نظام إدارة العمال — Almothfin
> تطبيق ويب عربي لإدارة المؤسسات والعمال والحضور والصرفيات وكشوفات المستحقات، مع تخزين Firestore ومحلل نصي محلي.

## 📖 نظرة عامة

Almothfin هو تطبيق Single-Page Application بواجهة عربية من اليمين إلى اليسار. يبدأ التطبيق من `src/main.tsx` ويستخدم `src/App.tsx` لتجميع المسارات داخل `StoreProvider` و`BrowserRouter`.

الواجهة الحالية تعرض اسم التطبيق في مواضع مختلفة مثل «نظام العمال» و«إدارة الموظفين»؛ الاسم التجاري الموحد غير موثّق في المستودع.

يعمل التطبيق على بيانات المؤسسة النشطة، ثم يقرأ العمال والسجلات والسلف والتسويات من Firestore عبر `src/hooks/useStore.tsx`.

لا توجد مصادقة مستخدم أو حسابات دخول ظاهرة في الكود المفحوص؛ تفاصيل نموذج المستخدمين غير موثّقة في المستودع.

## 🎯 المشكلة والحل

- إدخال حضور عدد كبير من العمال مع الصرفة والسحبيات والتأخير يدويًا قد يسبب تكرارًا؛ توفر `src/pages/DailyEntry.tsx` نموذجًا يوميًا ويستخدم `addBulkRecords` لمنع التكرار وتسجيل نتيجة الإضافة والتعديل والتخطي.
- قد تصل البيانات كنص عربي متعدد الأسطر؛ يحلل `src/lib/fastAttendanceParser.ts` التاريخ واسم العامل والحضور والمبالغ والتأخير محليًا، ثم تعرض `src/components/SmartEntryModal.tsx` معاينة وتحذيرات قبل الحفظ.
- متابعة الراتب عبر تغييرات زمنية تحتاج إلى سجل تاريخي؛ يحفظ `src/lib/salaryHistory.ts` تاريخ السريان وتستخدمه `src/pages/Workers.tsx` و`src/pages/Statements.tsx`.
- تسوية المستحقات جزئيًا أو كليًا تحتاج إلى رصيد مرحّل؛ تنفذ `src/pages/Statements.tsx` و`src/lib/payrollLogic.ts` حساب السداد والرصيد المتبقي.

## ✨ الميزات الرئيسية

- ✅ إدارة عدة مؤسسات واختيار المؤسسة النشطة من الشريط العلوي؛ مصدر البيانات والعمليات هو `src/pages/Settings.tsx` و`src/hooks/useStore.tsx`.
- ✅ إضافة العامل وتعديله وحذفه وتفعيل حالته أو إلغاء تفعيلها، مع رقم عامل تسلسلي؛ التنفيذ في `src/pages/Workers.tsx` و`src/hooks/useStore.tsx`.
- ✅ حفظ الراتب الأساسي وتغييرات الراتب بتاريخ سريان وملاحظة؛ التنفيذ في `src/pages/Workers.tsx` و`src/lib/salaryHistory.ts`.
- ✅ إدارة سلف العاملين بمبلغ أساسي ومبلغ مسدد وتاريخ وحالة وطريقة خصم؛ التنفيذ في `src/pages/Workers.tsx` و`src/types.ts`.
- ✅ تسجيل يومية عامل نشط مع حالة حاضر أو نصف يوم أو غائب، والصرفة والسحبيات والتأخير والملاحظات؛ المصدر `src/pages/DailyEntry.tsx`.
- ✅ ترحيل جماعي لعامل واحد عبر نطاق تواريخ؛ المصدر `src/pages/BulkEntry.tsx` باستخدام `date-fns`.
- ✅ تحليل نص الحضور العربي محليًا مع مطابقة أسماء العمال النشطين، وتحويل التأخير إلى دقائق، واكتشاف السجل المكرر؛ المصدر `src/lib/fastAttendanceParser.ts`.
- ✅ مراجعة السجلات المحللة قبل اعتمادها؛ السجلات ذات التحذير أو التكرار أو الثقة المنخفضة تُعلّق في `src/components/SmartEntryModal.tsx`.
- ✅ مسار خلفي اختياري لتحليل النص عبر Google GenAI؛ endpoint `server.ts` هو `/api/parse-attendance` وملف `api/parse-attendance.ts` يقدم محللًا قاعديًا مستقلًا.
- ✅ إنشاء كشوفات حسب عامل أو جميع العمال وضمن تاريخ بداية ونهاية، مع مؤشرات المسدد والمتبقي؛ المصدر `src/pages/Statements.tsx`.
- ✅ طباعة الكشوفات وتصديرها إلى PDF باستخدام `html2canvas-pro` و`jspdf`، مع تنسيق A4 في `src/pages/Statements.tsx` و`src/index.css`.
- ✅ تصدير واستيراد بيانات المؤسسة بصيغة JSON، ونسخ احتياطي تلقائي محلي عند توفر البيانات؛ المصدران `src/pages/Settings.tsx` و`src/components/AutoBackup.tsx`.
- ✅ تخزين محلي لـ Firestore عبر IndexedDB مع مراقبة حالة الاتصال وعرض وقت المزامنة؛ المصدران `src/lib/firebase.ts` و`src/components/Layout.tsx`.
- ✅ تطبيق PWA بواجهة RTL وإشعارات اختيارية لتذكير حضور منتصف الليل؛ التهيئة في `vite.config.ts` والتنفيذ في `src/components/Layout.tsx`.

## 🛠️ التقنيات

| المجال | التقنية | دليلها |
|---|---|---|
| واجهة المستخدم | React `^19.0.1` وReact DOM | `package.json`، `src/main.tsx` |
| اللغة | TypeScript | امتدادات `src/**/*.tsx` و`src/**/*.ts`، و`typescript` في `package.json` |
| التوجيه | `react-router-dom` `^7.18.1` | `src/App.tsx` و`src/components/Layout.tsx` |
| البناء | Vite `^6.2.3` | `vite.config.ts` و`package.json` |
| التنسيق | Tailwind CSS `^4.1.14` | `src/index.css` و`vite.config.ts` و`package.json` |
| PWA | `vite-plugin-pwa` `^1.3.0` | `vite.config.ts` و`public/manifest.webmanifest` |
| البيانات | Firebase Firestore `^12.16.0` | `src/lib/firebase.ts` و`src/hooks/useStore.tsx` |
| التخزين غير المتصل | Firestore `persistentLocalCache` و`persistentMultipleTabManager` | `src/lib/firebase.ts` |
| الخادم المحلي | Express `^4.21.2` و`tsx` `^4.21.0` | `server.ts` و`package.json` |
| التحليل الذكي | `@google/genai` `^2.4.0` | `server.ts` و`package.json` |
| التحليل المحلي | TypeScript وRegular Expressions | `src/lib/fastAttendanceParser.ts` |
| الحسابات الزمنية | `date-fns` `^4.4.0` | `src/pages/BulkEntry.tsx` و`src/pages/Statements.tsx` |
| التقارير | `html2canvas-pro` `^2.4.4` و`jspdf` `^4.2.1` | `src/pages/Statements.tsx` و`package.json` |
| الأيقونات والحركة | `lucide-react` و`motion` | `src/components/Layout.tsx` وملفات الصفحات |
| التوجيه السحابي | Vercel rewrites | `vercel.json` |

## 🏗️ هيكل المشروع

```text
.
├── package.json                 # scripts والاعتمادات
├── package-lock.json            # قفل npm
├── bun.lock                     # قفل Bun
├── vite.config.ts               # Vite وTailwind وPWA
├── tsconfig.json                # إعداد TypeScript
├── vercel.json                  # rewrites للـ SPA وAPI
├── .env.example                 # اسم متغير البيئة المعلن
├── firestore.rules              # قواعد Firestore الحالية
├── firebase-applet-config.json  # إعداد Firebase المستخدم في التطبيق
├── server.ts                    # Express وendpoint Gemini
├── api/parse-attendance.ts      # محلل حضور بأسلوب Vercel handler
├── public/
│   ├── manifest.webmanifest     # تعريف PWA
│   ├── icon-192.png
│   ├── icon-512.png
│   └── logo.png
├── scripts/
│   ├── test_fast_parser.ts
│   ├── test_payroll_logic.ts
│   └── prepare_android_assets.py
└── src/
    ├── App.tsx                  # المسارات الرئيسية
    ├── main.tsx                 # نقطة تشغيل React
    ├── types.ts                 # النماذج والأنواع
    ├── hooks/useStore.tsx       # الحالة وعمليات Firestore
    ├── components/              # Layout وSmartEntryModal والتقارير
    ├── lib/                     # Firebase والحساب والتحليل
    └── pages/                   # Dashboard وWorkers وDaily/Bulk وStatements وSettings
```

## 🚀 التشغيل المحلي

### المتطلبات المثبتة في المستودع

- يعتمد المشروع على JavaScript/TypeScript؛ وجود Node.js وnpm أو Bun لازم لتشغيل scripts، لكن إصدار Node المطلوب غير موثّق في المستودع.
- يحتوي الجذر على `package-lock.json` و`bun.lock`؛ أمر تثبيت الاعتمادات غير موثّق في المستودع.
- يجب توفير `GEMINI_API_KEY` فقط إذا استُخدم مسار التحليل الخلفي في `server.ts`؛ اسم المتغير مأخوذ من `.env.example`.

### أوامر التشغيل المثبتة

```bash
npm run dev
```

يشغّل `tsx server.ts`. يثبت `server.ts` الخادم على `0.0.0.0:3000` ويعرض الواجهة عبر Vite في الوضع غير الإنتاج.

```bash
npm run preview
```

يشغّل الأمر المعرّف حرفيًا باسم `vite preview` لمعاينة مخرجات Vite الموجودة.

لا توجد في المستودع خطوات موثقة لإنشاء بيانات أولية أو إنشاء حساب مستخدم؛ لذلك هذه التفاصيل: «غير موثّق في المستودع».

## 🔐 متغيرات البيئة

| الاسم | الغرض المثبت | مطلوب/اختياري |
|---|---|---|
| `GEMINI_API_KEY` | يقرأه `server.ts` لإنشاء `GoogleGenAI`، ويرفض endpoint التحليل الخلفي الطلب إذا لم يكن موجودًا | مطلوب لمسار `/api/parse-attendance`؛ غير مطلوب للمحلل المحلي بحسب الكود |

يحتوي `.env.example` على الاسم أعلاه فقط، وقد قُرئ دون قيم. يقرأ `server.ts` أيضًا `GEMINI_MODEL` لاختيار النموذج مع قيمة افتراضية، لكنه غير موجود في `.env.example`؛ تعريف الغرض الإضافي خارج هذا الاستخدام غير موثّق في المستودع.

## 📜 الأوامر المتاحة

| الأمر | ما يفعله وفق التعريف |
|---|---|
| `npm run dev` | يشغّل `tsx server.ts` |
| `npm run build` | ينفذ `vite build` ثم يحزم `server.ts` عبر `esbuild` إلى `dist/server.cjs` |
| `npm run preview` | ينفذ `vite preview` |
| `npm run clean` | يحذف `dist` و`server.js` عبر `rm -rf` |
| `npm run lint` | ينفذ `tsc --noEmit` |

لا يوجد script باسم `test` في `package.json`. توجد ملفات اختبار مثل `scripts/test_fast_parser.ts` و`scripts/test_payroll_logic.ts` و`test_firestore.ts`، لكن أمر تشغيلها غير موثّق في المستودع.

## 🌐 النشر

- يعرّف `vercel.json` إعادة كتابة `/api/(.*)` إلى `/api/$1` وإعادة كتابة بقية المسارات إلى `/index.html` لدعم SPA.
- عند `NODE_ENV=production`، يخدم `server.ts` الملفات الثابتة من `dist` ويعيد `dist/index.html` للمسارات العامة.
- يوجد endpoint باسم `/api/parse-attendance` في `server.ts`، كما يوجد handler مستقل في `api/parse-attendance.ts`.
- يظهر رابط Vercel فعلي داخل `test_vercel.cjs`: [almothfin-seven.vercel.app](https://almothfin-seven.vercel.app/). لا يثبت الملف وحده حالة النشر الحالية أو إعدادات الحساب.
- إعدادات المشروع السحابية الأخرى، مثل مشروع Vercel المرتبط أو خطوات الربط، غير موثّقة في المستودع.

## 🔒 الأمان

- `firestore.rules` يسمح حاليًا بالقراءة والكتابة دون شرط (`if true`) لمسارات `companies` و`workers` و`records`؛ لا توجد في الملف آلية مصادقة أو تفويض.
- يستخدم التطبيق بنية بيانات متداخلة تحت `companies/{activeCompanyId}` للعمال والسجلات والسلف والتسويات؛ مصدر القراءة والكتابة هو `src/hooks/useStore.tsx`.
- لا يستورد التطبيق Firebase Auth ولا توجد مسارات تسجيل دخول أو `middleware` أو RLS في الملفات المفحوصة؛ هذه الآليات غير موثّقة في المستودع.
- يتحقق `server.ts` من طريقة HTTP ووجود نص الإدخال ووجود `GEMINI_API_KEY` قبل استدعاء GenAI، لكنه لا يحتوي على تحقق هوية أو صلاحيات ظاهر.
- يعتمد `src/components/SmartEntryModal.tsx` على معاينة المستخدم، ويستبعد السجل المكرر أو العامل غير المعروف أو الثقة الأقل من `0.85` من الحفظ التلقائي.
- لا تُعرض في هذه الوثيقة قيم مفاتيح Firebase أو أي قيمة سرية؛ ملفات الأسرار الحقيقية لم تُفتح.

## 📄 الترخيص

- لا يوجد ملف `LICENSE` أو `LICENSE.md` أو `COPYING` أو `NOTICE` في جذر المستودع.
- يحتوي `src/App.tsx` على رأس ترخيص يعلن `SPDX-License-Identifier: Apache-2.0`؛ نطاق تطبيق هذا الإعلان على المستودع كله غير موثّق في المستودع.
