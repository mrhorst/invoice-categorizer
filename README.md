# INVOICE CATEGORIZER

As a key employee at a franchised restaurant, one of my weekly tasks is to:

- Receive invoices
- Categorize each item properly
- Send them to the AP team for payment processing and weekly spending reports

Since this is a repetitive task that takes a few minutes of manual work (pen, paper, and some math), I built a simple app to help with categorizing and calculating totals. It returns the string format that the AP team needs, so they can wrap up their report and process payments on time.

## Current Version

- You can upload a CSV file from the supplier (GFS), and the app will process the data into a formatted string you can copy and send to the accounting team.
- Saving invoice information to a database is possible, but the feature isn’t fully polished yet.
- The app tracks totals per invoice, but some details are still missing—this will be improved soon.
- If there’s a small difference due to tax calculations, you can manually adjust category totals.

## Future Improvements

Potential features for upcoming versions:

- Refactor how some data is being passed to allow proper invoice storage in db;
- Monitor spending per category over time (May be overkill, since we can do this through accounting and inventory management software..);
- User login to track who added each invoice
- Automatically send the email to the accounting team, or add a button for quick sending

## Getting Started

Keep in mind that this is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser and navigate to the Import CSV section.
