# nahmad94.github.io

Personal site for Naveed Ahmad and Ahmad Consulting Group (ACG). Static HTML/CSS/JS on GitHub Pages, no build step.

```
/                     index.html        Personal page (nav: Work, Experience, Resume, ACG, Contact)
/acg/                 acg/index.html    ACG page (nav: ACG, Contact only)
/contact/             contact/index.html
                      ?ctx=acg switches the nav, heading and default reason to ACG
/404.html             Not-found page
/assets/css/global.css  One stylesheet for every page
/assets/js/config.js    THE ONLY FILE YOU NEED TO EDIT: resume link, emails, LinkedIn, form provider
/assets/js/main.js      Shared behavior (links from config, ledger highlight)
/assets/js/contact.js   Contact form sending (Google Sheets, EmailJS or mailto)
/assets/fonts/          Archivo and JetBrains Mono (self-hosted, SIL OFL)
/assets/img/            naveed.jpg headshot, icons/, work/ screenshots
/assets/docs/           Naveed-Ahmad-Resume.pdf (web copy, no phone number)
/setup/contact-form.gs  Google Apps Script for logging form submissions to a Sheet
```

## Updating
- **Resume:** replace `assets/docs/Naveed-Ahmad-Resume.pdf` (same name), or point `resumeUrl` in `assets/js/config.js` at a Google Drive link.
- **Screenshots:** replace files in `assets/img/work/` with the same names (1200 x 750 px). Sample or blurred data only.
- **Headshot:** replace `assets/img/naveed.jpg` (4:5 portrait, about 800 x 1000 px).
- **Contact form:** follow the steps at the top of `setup/contact-form.gs`, then paste the Web app URL into `form.sheetsUrl` in `assets/js/config.js`. Until then the form opens the visitor's email app.

## Deploying
Push to `main`. The workflow in `.github/workflows/pages.yml` publishes the whole repo in 1 to 2 minutes.
