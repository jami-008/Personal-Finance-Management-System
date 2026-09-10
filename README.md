# Personal Finance Management System

A modern, responsive, offline-first **Personal Finance Manager** built using only **HTML, CSS, and JavaScript**.

This project is designed to track month-wise and date-wise personal expenses, main costs, debts/loans, income records, spending analytics, backups, and monthly PDF reports — all without any backend or database.

---

## Features

### Dashboard
- Monthly finance overview
- Total Expense
- Daily Expense Total
- Main Cost Total
- Average Expense Per Day
- Total Income
- Pending Receivable
- Pending Payable
- Recent Transactions
- Highest Spending Day
- Highest Daily Amount
- Top Daily Expense Category
- Total Daily Transactions

### Daily Expense Manager
- Add daily expenses
- Edit expenses
- Delete expenses
- Date-wise expense tracking
- Category selection
- Custom category support
- Optional notes
- Search expenses
- Filter by category
- Filter by date
- Monthly daily expense total
- Top daily category

Default daily categories include:

- Food
- Transport
- Shopping
- Medicine / Health
- Entertainment
- Education
- Personal
- Mobile / Recharge
- Other
- Custom Category

### Main Cost Manager
Dedicated section for major or fixed costs such as:

- Mess Rent
- Khala Bill
- WiFi
- Pani
- Electricity
- Gas
- Semester / Credit Fee
- Tour / Event

Each main cost entry supports:

- Date
- Amount
- Note
- Edit
- Delete

### Debt / Loan Manager
Two separate sections are available:

#### Receivable
Money that other people need to pay you.

#### Payable
Money that you need to pay other people.

Each debt record includes:

- Person name
- Amount
- Date
- Note
- Pending / Settled status
- Edit
- Delete
- Mark as Settled
- Mark as Pending

### Income Manager
Income is recorded separately and does **not** affect expense calculations.

Each income entry supports:

- Date
- Source
- Amount
- Note
- Edit
- Delete

### Analytics
- Day-by-day spending bar chart
- Daily category breakdown
- Main cost breakdown
- Daily Expense vs Main Cost comparison
- Highest spending analysis
- Monthly spending insights

### Month-wise Data
Every month is stored independently.

Example:

```text
2026-09
2026-10
2026-11
```

Switching months does not mix or overwrite data from other months.

### LocalStorage
The application uses browser `localStorage`.

This means:

- No backend required
- No database required
- Works locally
- Data remains after page refresh
- Data remains after browser restart
- Selected month is remembered
- Every add/edit/delete action is saved automatically

### Backup & Restore
- Export all finance data as JSON
- Import previous JSON backup
- Backup validation
- Restore saved monthly data
- Reset current month
- Reset all data

### PDF Report
A monthly PDF report can be generated for the currently selected month.

The report includes:

- Monthly summary
- Total expenses
- Daily expenses
- Main costs
- Average daily spending
- Income
- Receivable
- Payable
- Main cost list
- Daily expense list
- Category breakdown
- Debt / Loan list
- Income history

> Note: The built-in dependency-free PDF generator uses standard PDF fonts. Bangla text may not render correctly inside exported PDFs, although Bangla text is preserved correctly inside the application and LocalStorage.

### Responsive UI
The interface is designed for:

- Mobile
- Tablet
- Laptop
- Desktop

Mobile-specific behavior includes:

- No forced desktop-width layout
- No page zoom-out requirement
- Mobile bottom navigation
- Responsive summary cards
- Full-width forms
- Mobile modal sheets
- Touch-friendly buttons
- Responsive charts
- Horizontal overflow protection

---

## Technology

```text
HTML5
CSS3
Vanilla JavaScript
LocalStorage
```

No framework, backend, database, or external CDN is required.

---

## Project Structure

```text
Personal-Finance-Management-System/
│
├── index.html
├── styles.css
├── app.js
└── README.md
```

---

## How to Run

Clone the repository:

```bash
git clone https://github.com/jami-008/Personal-Finance-Management-System.git
```

Enter the project directory:

```bash
cd Personal-Finance-Management-System
```

Then open:

```text
index.html
```

in your browser.

No installation or build command is required.

---

## GitHub Repository

```text
https://github.com/jami-008/Personal-Finance-Management-System
```

---

## Push Project to GitHub

If the repository is not cloned yet:

```bash
git clone https://github.com/jami-008/Personal-Finance-Management-System.git
cd Personal-Finance-Management-System
```

Place these files inside the repository folder:

```text
index.html
styles.css
app.js
README.md
```

Then run:

```bash
git status
git add .
git commit -m "Build personal finance management system"
git branch -M main
git push -u origin main
```

---

## If Git Is Not Initialized

Run:

```bash
git init
git remote add origin https://github.com/jami-008/Personal-Finance-Management-System.git
git add .
git commit -m "Build personal finance management system"
git branch -M main
git push -u origin main
```

---

## If Origin Already Exists

```bash
git remote set-url origin https://github.com/jami-008/Personal-Finance-Management-System.git
git push -u origin main
```

---

## If Push Is Rejected

If the GitHub repository already contains a README or another commit:

```bash
git pull origin main --rebase
git push -u origin main
```

---

## Git User Configuration

If Git asks for your username or email:

```bash
git config --global user.name "jami-008"
git config --global user.email "YOUR_GITHUB_EMAIL"
```

Replace `YOUR_GITHUB_EMAIL` with the email connected to your GitHub account.

---

## Future Updates

After changing the project later:

```bash
git add .
git commit -m "Update personal finance manager"
git push
```

---

## GitHub Pages Deployment

You can publish this project for free using GitHub Pages.

Open the repository on GitHub and go to:

```text
Settings
→ Pages
→ Build and deployment
→ Deploy from a branch
→ Branch: main
→ Folder: /root
→ Save
```

GitHub will generate a public URL for the web app.

A typical GitHub Pages URL will look like:

```text
https://jami-008.github.io/Personal-Finance-Management-System/
```

---

## Important LocalStorage Note

LocalStorage data belongs to the browser and domain where the app is running.

For example, data saved while opening the project directly from your computer may not automatically appear when you later open the GitHub Pages version.

Before changing browser, computer, or deployment URL, use:

```text
Report & Backup
→ Export Backup
```

Then restore it using:

```text
Import Backup
```

---

## Data Calculation

Monthly expense calculation:

```text
Total Monthly Expense
=
Daily Expense Total
+
Main Cost Total
```

Income is stored separately.

Therefore:

```text
Total Income
```

is **not automatically added to or subtracted from expenses**.

Debt records are also maintained independently.

---

## Privacy

This project does not send finance data to a server.

Finance records stay inside the user's browser LocalStorage unless the user manually exports a backup.

---

## License

This project is intended for personal and educational use.

You can add a dedicated open-source license later if required.

---

## Author

**jami-008**

GitHub:

```text
https://github.com/jami-008
```

---

## Project Status

Current version includes the core Personal Finance Manager functionality with responsive UI, LocalStorage-based persistence, analytics, backup/restore, debt tracking, income tracking, monthly navigation, and PDF export.
