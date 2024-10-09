As a key employee at a franchised restaurant, one of my weekly tasks is to:

- Receive invoices
- Categorize each item properly
- Send them to the AP team for payment processing and weekly spending reports

Since this is a repetitive task that takes a few minutes of manual work (pen, paper, and some math), I built a simple app to help with categorizing and calculating totals. It returns the string format that the AP team needs, so they can wrap up their report and process payments on time.

## Current Version

The first version is basic—no database or data persistence. You upload a CSV file from the supplier, and it processes the data, giving you a string to copy-paste to the accounting team.

## Future Improvements

Potential features for upcoming versions:

- Save invoices, items, and suppliers to a database
- Track totals per invoice for better auditing
- Monitor spending per category over time
- User login to track who added each invoice
- Automatically send the email to the accounting team, or add a button for quick sending

## Getting Started

Keep in mind that this is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser and navigate to the Import CSV section.
