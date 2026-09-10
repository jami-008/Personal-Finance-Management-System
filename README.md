# Personal Finance Manager

A responsive, dependency-free Personal Finance Manager built with plain HTML, CSS and JavaScript.

## Run
Open `index.html` in any modern browser. No server, build step, account or internet connection is required.

## Included
- Month-wise LocalStorage persistence
- Daily expenses with categories, search and filters
- Main cost categories (Mess Rent, Khala Bill, WiFi, Pani, Electricity, Gas, Semester/Credit Fee, Tour/Event)
- Receivable and payable debt/loan tracking with pending/settled status
- Separate income records (income does not alter expense totals)
- Responsive dashboard and mobile bottom navigation
- Plain-canvas bar and doughnut analytics
- Monthly PDF export generated directly in JavaScript
- JSON backup/import
- Current-month reset and full reset safeguards

## Data safety
All finance data is stored only in the browser under the LocalStorage key `pfm_data_v1`. Use Export Backup regularly if the data is important, because clearing browser site data can remove LocalStorage.
