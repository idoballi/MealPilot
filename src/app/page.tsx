"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

type FormData = {
  fullName: string;
  email: string;
  goal: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
  activityLevel: string;
  mealsPerDay: string;
  maxCookingTime: string;
  foodLikes: string;
  foodDislikes: string;
  allergies: string;
  kosher: string;
  vegetarian: string;
  dailyBudget: string;
  preferredEmailTime: string;
  examMode: string;
  notes: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialForm: FormData = {
  fullName: "",
  email: "",
  goal: "",
  age: "",
  gender: "",
  weight: "",
  height: "",
  activityLevel: "",
  mealsPerDay: "",
  maxCookingTime: "",
  foodLikes: "",
  foodDislikes: "",
  allergies: "",
  kosher: "",
  vegetarian: "",
  dailyBudget: "",
  preferredEmailTime: "",
  examMode: "",
  notes: "",
};

const dailyBenefits = [
  { icon: "🍽️", text: "תפריט יומי מאוזן ובריא" },
  { icon: "👤", text: "מותאם למטרה, לאורח החיים ולהעדפות שלכם" },
  { icon: "⏱️", text: "חוסך זמן, כסף והתלבטויות" },
  { icon: "✉️", text: "נשלח אוטומטית למייל שלכם בכל יום בשעה שבחרתם" },
];

const iconBar = [
  { icon: "✓", label: "פשוט כבר מהיום" },
  { icon: "₪", label: "חסכוני בזמן ובכסף" },
  { icon: "⏰", label: "חוסך זמן ביום-יום" },
  { icon: "♥", label: "מותאם לכם אישית" },
];

const messageBenefits = [
  "מותאם למטרה שלך (חיטוב, עליה במסה, שמירה על משקל או ירידה)",
  "מותאם להעדפות שלך, לאלרגיות, לכשרות ולאורח החיים שלך",
  "חוסך לך זמן, כסף והתלבטויות – כל יום מחדש",
  "נשלח אוטומטית למייל שלך בשעה שבחרת",
];

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.fullName.trim()) errors.fullName = "שדה חובה";
  if (!data.email.trim()) {
    errors.email = "שדה חובה";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "אימייל לא תקין";
  }
  if (!data.goal) errors.goal = "שדה חובה";
  if (!data.weight.trim()) errors.weight = "שדה חובה";
  if (!data.mealsPerDay) errors.mealsPerDay = "שדה חובה";
  if (!data.maxCookingTime) errors.maxCookingTime = "שדה חובה";

  return errors;
}

function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image src="/logo.svg" alt="" width={36} height={36} className="h-9 w-9" />
      <span className="text-xl font-extrabold tracking-wide text-pilot-dark">
        MEAL <span className="text-pilot-500">PILOT</span>
      </span>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-pilot-dark">{label}</label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center text-pilot-dark">
          טוען...
        </main>
      }
    >
      <HomePage />
    </Suspense>
  );
}

function HomePage() {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email")?.trim() ?? "";
  const isUpdateMode = Boolean(emailFromUrl);

  const [form, setForm] = useState<FormData>(() => ({
    ...initialForm,
    email: emailFromUrl,
  }));
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus("idle");
      document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setStatus("loading");
    setErrors({});

    const payload = {
      ...form,
      active: true,
      source: "student-meal-coach",
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Webhook failed");
      setStatus("success");
      setForm(isUpdateMode ? { ...initialForm, email: emailFromUrl } : initialForm);
    } catch {
      setStatus("error");
    }
  };

  const scrollToForm = () => {
    document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-pilot-100/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Logo />
          <button
            type="button"
            onClick={scrollToForm}
            className="rounded-full bg-pilot-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-pilot-600"
          >
            הצטרפות
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1400&q=80"
            alt="ארוחה בריאה"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-white via-white/90 to-white/40" />
        </div>

        <div className="relative mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-2 md:items-center md:py-16">
          <div>
            <Logo className="mb-6 md:hidden" />
            <h1 className="text-4xl font-extrabold leading-tight text-pilot-dark sm:text-5xl">
              האוכל הנכון.
              <br />
              <span className="text-pilot-500">בזמן הנכון.</span>
              <br />
              בשבילך.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-pilot-dark/80">
              תפריט יומי מותאם{" "}
              <strong className="font-bold text-pilot-500">אישית</strong>, ישירות
              למייל שלך.
            </p>
            <button type="button" onClick={scrollToForm} className="pilot-btn mt-8 w-full sm:w-auto">
              להצטרפות למערכת ↓
            </button>
          </div>

          <div className="pilot-card p-6">
            <h2 className="mb-4 text-lg font-bold text-pilot-dark">
              מה תקבלו <span className="text-pilot-500">כל יום?</span>
            </h2>
            <ul className="space-y-4">
              {dailyBenefits.map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pilot-50 text-lg">
                    {item.icon}
                  </span>
                  <span className="pt-1.5 text-sm font-medium leading-relaxed text-pilot-dark">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Icon bar */}
      <section className="border-y border-pilot-100 bg-pilot-50/50">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-4 py-6 sm:grid-cols-4">
          {iconBar.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-bold text-pilot-500 shadow-sm ring-1 ring-pilot-100">
                {item.icon}
              </span>
              <span className="text-xs font-semibold text-pilot-dark sm:text-sm">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Personal message */}
      <section className="mx-auto max-w-3xl px-4 py-10">
        <div className="relative overflow-hidden rounded-3xl border-2 border-pilot-200 bg-gradient-to-b from-pilot-50/80 to-white p-6 sm:p-10">
          <div className="absolute bottom-4 left-4 text-5xl opacity-20">💌</div>

          <p className="text-lg font-bold text-pilot-500">היי חבר/ה יקר/ה, 👋</p>

          <div className="mt-4 space-y-4 text-sm leading-relaxed text-pilot-dark/90 sm:text-base">
            <p>
              בניתי לעצמי מערכת שמכינה לי כל יום תפריט מותאם אישית — בלי לחשוב, בלי
              להתלבט, ובלי לבזבז זמן.
            </p>
            <p>
              עכשיו אני רוצה לשתף את זה איתך. זו לא עוד אפליקציית דיאטה — זו דרך
              פשוטה לקבל כל בוקר למייל תפריט שמותאם בדיוק אליך.
            </p>
          </div>

          <ul className="mt-6 space-y-3">
            {messageBenefits.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm sm:text-base">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pilot-500 text-xs font-bold text-white">
                  ✓
                </span>
                <span className="text-pilot-dark">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 text-center">
            <p className="mb-4 text-lg font-bold text-pilot-dark">
              מוזמן להצטרף ולנסות – בחינם 👇
            </p>
            <button type="button" onClick={scrollToForm} className="pilot-btn w-full sm:w-auto">
              🔗 להצטרפות למערכת
            </button>
            <p className="mt-3 text-sm text-pilot-dark/60">
              (תוך פחות מדקה, ותקבל כבר מחר תפריט אישי למייל)
            </p>
          </div>

          <div className="mt-8 border-t border-pilot-100 pt-6 text-center text-sm text-pilot-dark/70">
            <p>אשמח לשמוע מה דעתך אחרי שתנסה 🙏</p>
            <p className="mt-1 font-medium">תודה שאתה חלק מהדרך!</p>
            <p className="mt-3 font-extrabold tracking-wide text-pilot-500">
              — MEAL PILOT
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="form" className="bg-pilot-50/40 px-4 py-12">
        <div className="mx-auto max-w-lg">
          <div className="mb-6 text-center">
            <Logo className="justify-center" />
            <h2 className="mt-4 text-2xl font-extrabold text-pilot-dark">
              {isUpdateMode ? "עדכון העדפות" : "הצטרפות למערכת"}
            </h2>
            <p className="mt-2 text-sm text-pilot-dark/70">
              {isUpdateMode
                ? "עדכן את ההעדפות שלך ונמשיך לשלוח תפריט מותאם."
                : "מלא פעם אחת — ותקבל תפריט יומי למייל."}
            </p>
          </div>

          <div className="pilot-card p-6">
            {status === "success" && (
              <div className="mb-6 rounded-xl bg-pilot-50 px-4 py-4 text-pilot-700 ring-1 ring-pilot-200">
                ההעדפות נשמרו! ממחר תקבל למייל תפריט יומי שחוסך לך זמן בתקופת
                מבחנים.
              </div>
            )}

            {status === "error" && (
              <div className="mb-6 rounded-xl bg-red-50 px-4 py-4 text-red-700 ring-1 ring-red-100">
                משהו השתבש. נסה שוב בעוד רגע.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Field label="שם מלא *" error={errors.fullName}>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  className="pilot-input"
                  placeholder="ישראל ישראלי"
                />
              </Field>

              <Field label="אימייל *" error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="pilot-input"
                  placeholder="you@email.com"
                  dir="ltr"
                />
              </Field>

              <Field label="מטרה *" error={errors.goal}>
                <select
                  value={form.goal}
                  onChange={(e) => update("goal", e.target.value)}
                  className="pilot-input"
                >
                  <option value="">בחר מטרה</option>
                  <option value="חיטוב">חיטוב</option>
                  <option value="שמירה">שמירה</option>
                  <option value="מסה נקייה">מסה נקייה</option>
                </select>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="גיל">
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => update("age", e.target.value)}
                    className="pilot-input"
                    min="16"
                    max="99"
                  />
                </Field>

                <Field label="מין">
                  <select
                    value={form.gender}
                    onChange={(e) => update("gender", e.target.value)}
                    className="pilot-input"
                  >
                    <option value="">בחר</option>
                    <option value="זכר">זכר</option>
                    <option value="נקבה">נקבה</option>
                    <option value="אחר">אחר</option>
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="משקל (ק״ג) *" error={errors.weight}>
                  <input
                    type="number"
                    value={form.weight}
                    onChange={(e) => update("weight", e.target.value)}
                    className="pilot-input"
                    min="30"
                    max="200"
                  />
                </Field>

                <Field label="גובה (ס״מ)">
                  <input
                    type="number"
                    value={form.height}
                    onChange={(e) => update("height", e.target.value)}
                    className="pilot-input"
                    min="120"
                    max="230"
                  />
                </Field>
              </div>

              <Field label="רמת פעילות">
                <select
                  value={form.activityLevel}
                  onChange={(e) => update("activityLevel", e.target.value)}
                  className="pilot-input"
                >
                  <option value="">בחר</option>
                  <option value="נמוכה">נמוכה</option>
                  <option value="בינונית">בינונית</option>
                  <option value="גבוהה">גבוהה</option>
                </select>
              </Field>

              <Field label="ארוחות ביום *" error={errors.mealsPerDay}>
                <select
                  value={form.mealsPerDay}
                  onChange={(e) => update("mealsPerDay", e.target.value)}
                  className="pilot-input"
                >
                  <option value="">בחר</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </Field>

              <Field label="זמן בישול מקסימלי *" error={errors.maxCookingTime}>
                <select
                  value={form.maxCookingTime}
                  onChange={(e) => update("maxCookingTime", e.target.value)}
                  className="pilot-input"
                >
                  <option value="">בחר</option>
                  <option value="5">5 דקות</option>
                  <option value="10">10 דקות</option>
                  <option value="20">20 דקות</option>
                </select>
              </Field>

              <Field label="אוהב לאכול">
                <textarea
                  value={form.foodLikes}
                  onChange={(e) => update("foodLikes", e.target.value)}
                  className="pilot-input min-h-[80px] resize-y"
                  placeholder="עוף, ביצים, אורז..."
                />
              </Field>

              <Field label="לא אוהב לאכול">
                <textarea
                  value={form.foodDislikes}
                  onChange={(e) => update("foodDislikes", e.target.value)}
                  className="pilot-input min-h-[80px] resize-y"
                  placeholder="כבד, דגים..."
                />
              </Field>

              <Field label="אלרגיות">
                <input
                  type="text"
                  value={form.allergies}
                  onChange={(e) => update("allergies", e.target.value)}
                  className="pilot-input"
                  placeholder="אגוזים, לקטוז..."
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="כשרות">
                  <select
                    value={form.kosher}
                    onChange={(e) => update("kosher", e.target.value)}
                    className="pilot-input"
                  >
                    <option value="">בחר</option>
                    <option value="כן">כן</option>
                    <option value="לא">לא</option>
                  </select>
                </Field>

                <Field label="צמחוני">
                  <select
                    value={form.vegetarian}
                    onChange={(e) => update("vegetarian", e.target.value)}
                    className="pilot-input"
                  >
                    <option value="">בחר</option>
                    <option value="כן">כן</option>
                    <option value="לא">לא</option>
                  </select>
                </Field>
              </div>

              <Field label="תקציב יומי">
                <select
                  value={form.dailyBudget}
                  onChange={(e) => update("dailyBudget", e.target.value)}
                  className="pilot-input"
                >
                  <option value="">בחר</option>
                  <option value="30">30 ₪</option>
                  <option value="50">50 ₪</option>
                  <option value="70">70 ₪</option>
                  <option value="אחר">אחר</option>
                </select>
              </Field>

              <Field label="שעה מועדפת לקבלת מייל">
                <input
                  type="time"
                  value={form.preferredEmailTime}
                  onChange={(e) => update("preferredEmailTime", e.target.value)}
                  className="pilot-input"
                  dir="ltr"
                />
              </Field>

              <Field label="מצב מבחנים">
                <select
                  value={form.examMode}
                  onChange={(e) => update("examMode", e.target.value)}
                  className="pilot-input"
                >
                  <option value="">בחר</option>
                  <option value="כן">כן</option>
                  <option value="לא">לא</option>
                </select>
              </Field>

              <Field label="הערות">
                <textarea
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  className="pilot-input min-h-[80px] resize-y"
                  placeholder="כל דבר נוסף..."
                />
              </Field>

              <button type="submit" disabled={status === "loading"} className="pilot-btn w-full">
                {status === "loading"
                  ? "שולח..."
                  : isUpdateMode
                    ? "שמור עדכונים"
                    : "שמור לי תוכנית"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="border-t border-pilot-100 py-8 text-center">
        <Logo className="justify-center" />
        <p className="mt-3 text-sm text-pilot-dark/50">
          תפריט יומי אישי — ישירות למייל שלך
        </p>
      </footer>
    </div>
  );
}
