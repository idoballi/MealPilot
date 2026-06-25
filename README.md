# חוסך לי אוכל

תפריט יומי אוטומטי לסטודנטים בתקופת מבחנים.

## התחלה

```bash
npm install
cp .env.example .env.local
```

ערוך את `.env.local` והוסף את כתובת ה-webhook של Make.com:

```
MAKE_WEBHOOK_URL=https://hook.eu1.make.com/your-webhook-id
```

## פריסה ב-Vercel

1. ב-Vercel: **Project → Settings → Environment Variables**
2. הוסף משתנה:
   - **Name:** `MAKE_WEBHOOK_URL`
   - **Value:** כתובת ה-webhook מ-Make.com
   - **Environments:** Production, Preview, Development
3. לחץ **Save** ואז **Redeploy** (חובה אחרי הוספת משתנה!)

```bash
npm run dev
```

פתח [http://localhost:3000](http://localhost:3000).

## מה האפליקציה עושה

- דף נחיתה אחד בעברית (RTL), מותאם למובייל
- טופס העדפות שנשלח כ-JSON ל-Make.com webhook
- ללא התחברות, ללא מסד נתונים
