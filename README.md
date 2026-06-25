# חוסך לי אוכל

תפריט יומי אוטומטי לסטודנטים בתקופת מבחנים.

## התחלה

```bash
npm install
cp .env.example .env.local
```

ערוך את `.env.local` והוסף את כתובת ה-webhook של Make.com:

```
NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.eu1.make.com/your-webhook-id
```

```bash
npm run dev
```

פתח [http://localhost:3000](http://localhost:3000).

## מה האפליקציה עושה

- דף נחיתה אחד בעברית (RTL), מותאם למובייל
- טופס העדפות שנשלח כ-JSON ל-Make.com webhook
- ללא התחברות, ללא מסד נתונים
