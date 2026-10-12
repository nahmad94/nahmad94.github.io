/* ---------------------------------------------------------------
   EDIT THIS FILE ONLY to change links and the contact form setup.
---------------------------------------------------------------- */
window.SITE_CONFIG = {
  // Resume link. Leave empty to use assets/docs/Naveed-Ahmad-Resume.pdf from this site.
  // To use Google Drive instead, paste the "Anyone with the link can view" link here.
  resumeUrl: "",

  personalEmail: "deevan11@gmail.com",
  acgEmail: "deevan11@gmail.com",
  linkedinUrl: "https://www.linkedin.com/in/nahmad-pm",

  // ---------------- Contact form ----------------
  // provider: "sheets"  -> Google Apps Script web app (logs to a Google Sheet + emails you)  [recommended]
  //           "emailjs" -> EmailJS (emails only, 200/month on the free plan)
  //           "mailto"  -> no service; opens the visitor's email app
  form: {
    provider: "sheets",   // falls back to "mailto" until sheetsUrl is filled in

    // For "sheets": paste the Web app URL from setup/contact-form.gs
    sheetsUrl: "https://script.google.com/macros/s/AKfycbw9RoTdfekXbFv0zOUijV5Sz_9oHMZodd6nn3PDOD10Sg1vP_VSiyF-eb8-_c5FEkNLMg/exec",

    // For "emailjs": values from your EmailJS dashboard
    emailjs: {
      publicKey: "",          // Account > General > Public Key
      serviceId: "gmail",
      templateId: "template_basic"
    }
  }
};
