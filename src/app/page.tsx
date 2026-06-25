"use client";

import { FormEvent, useState } from "react";

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

const benefits = [
  "חוסך החלטות",
  "עד 10 דקות הכנה",
  "הרבה חלבון",
  "מתאים לסטודנטים",
  "תפריט יומי אוטומטי למייל",
];

const steps = [
  { num: "1", text: "ממלאים העדפות פעם אחת" },
  { num: "2", text: "ה־AI בונה תפריט אישי" },
  { num: "3", text: "מקבלים כל בוקר מייל עם מה לאכול" },
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
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

export default function Home() {
  const [form, setForm] = useState<FormData>(initialForm);
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
      return;
    }

    const webhookUrl = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL;
    if (!webhookUrl) {
      setStatus("error");
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
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Webhook failed");
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  };

  const scrollToForm = () => {
    document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="mx-auto max-w-lg px-4 pb-16">
      {/* Hero */}
      <section className="pt-10 pb-8 text-center">
        <p className="mb-3 text-sm font-semibold text-brand-600">חוסך לי אוכל</p>
        <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
          די לחשוב מה לאכול בתקופת מבחנים
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          ממלאים שאלון פעם אחת ומקבלים כל יום למייל תפריט משביע, מהיר וזול
          שמותאם אליך.
        </p>
        <button
          type="button"
          onClick={scrollToForm}
          className="mt-8 w-full rounded-2xl bg-brand-600 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 active:scale-[0.98]"
        >
          בנה לי תפריט יומי
        </button>
      </section>

      {/* Benefits */}
      <section className="py-8">
        <h2 className="mb-4 text-xl font-bold text-slate-900">למה זה בשבילך</h2>
        <ul className="grid gap-3">
          {benefits.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                ✓
              </span>
              <span className="font-medium text-slate-800">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section className="py-8">
        <h2 className="mb-4 text-xl font-bold text-slate-900">איך זה עובד</h2>
        <ol className="space-y-3">
          {steps.map((step) => (
            <li
              key={step.num}
              className="flex items-start gap-4 rounded-xl bg-white px-4 py-4 shadow-sm ring-1 ring-slate-100"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {step.num}
              </span>
              <p className="pt-1.5 font-medium text-slate-800">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Form */}
      <section id="form" className="py-8">
        <h2 className="mb-2 text-xl font-bold text-slate-900">העדפות אישיות</h2>
        <p className="mb-6 text-sm text-slate-600">
          מלא פעם אחת — ותקבל תפריט יומי למייל.
        </p>

        {status === "success" && (
          <div className="mb-6 rounded-xl bg-brand-50 px-4 py-4 text-brand-700 ring-1 ring-brand-100">
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
              className={inputClass}
              placeholder="ישראל ישראלי"
            />
          </Field>

          <Field label="אימייל *" error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClass}
              placeholder="you@email.com"
              dir="ltr"
            />
          </Field>

          <Field label="מטרה *" error={errors.goal}>
            <select
              value={form.goal}
              onChange={(e) => update("goal", e.target.value)}
              className={inputClass}
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
                className={inputClass}
                min="16"
                max="99"
              />
            </Field>

            <Field label="מין">
              <select
                value={form.gender}
                onChange={(e) => update("gender", e.target.value)}
                className={inputClass}
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
                className={inputClass}
                min="30"
                max="200"
              />
            </Field>

            <Field label="גובה (ס״מ)">
              <input
                type="number"
                value={form.height}
                onChange={(e) => update("height", e.target.value)}
                className={inputClass}
                min="120"
                max="230"
              />
            </Field>
          </div>

          <Field label="רמת פעילות">
            <select
              value={form.activityLevel}
              onChange={(e) => update("activityLevel", e.target.value)}
              className={inputClass}
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
              className={inputClass}
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
              className={inputClass}
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
              className={`${inputClass} min-h-[80px] resize-y`}
              placeholder="עוף, ביצים, אורז..."
            />
          </Field>

          <Field label="לא אוהב לאכול">
            <textarea
              value={form.foodDislikes}
              onChange={(e) => update("foodDislikes", e.target.value)}
              className={`${inputClass} min-h-[80px] resize-y`}
              placeholder="כבד, דגים..."
            />
          </Field>

          <Field label="אלרגיות">
            <input
              type="text"
              value={form.allergies}
              onChange={(e) => update("allergies", e.target.value)}
              className={inputClass}
              placeholder="אגוזים, לקטוז..."
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="כשרות">
              <select
                value={form.kosher}
                onChange={(e) => update("kosher", e.target.value)}
                className={inputClass}
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
                className={inputClass}
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
              className={inputClass}
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
              className={inputClass}
              dir="ltr"
            />
          </Field>

          <Field label="מצב מבחנים">
            <select
              value={form.examMode}
              onChange={(e) => update("examMode", e.target.value)}
              className={inputClass}
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
              className={`${inputClass} min-h-[80px] resize-y`}
              placeholder="כל דבר נוסף..."
            />
          </Field>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-2xl bg-brand-600 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? "שולח..." : "שמור לי תוכנית"}
          </button>
        </form>
      </section>

      <footer className="pt-4 text-center text-sm text-slate-400">
        חוסך לי אוכל — לסטודנטים בתקופת מבחנים
      </footer>
    </main>
  );
}
