# Vula Flow website

Plain HTML and CSS. No build step.

- `index.html` is the gateway that sends visitors to either page
- `buyers.html` is the corporate buyer page
- `suppliers.html` is the SME supplier page
- `signup.html` is the early access sign-up (buyers and suppliers)
- `privacy.html` is the draft privacy notice
- `styles.css` holds the shared colours and base styles
- `favicon.svg` is the browser tab icon

## Editing text

Open the file on GitHub, click the pencil icon, change the words and press Commit changes. Vercel redeploys on its own within about a minute.

## Connecting the sign-up form

Until you do this, the form opens a pre-filled email to shabalala@bnzgroup.co.za, so no sign-up is lost.

1. Create a free form on a service such as Formspree (formspree.io). It gives you an address that looks like `https://formspree.io/f/abcdwxyz`.
2. Open `signup.html`, find the line `var FORM_ENDPOINT = "";` near the bottom and paste the address between the quotes.
3. Commit. Sign-ups now arrive in your email and in the service's dashboard.

## Before you rely on the privacy notice

The highlighted brackets in `privacy.html` need filling in: the legal entity name and address, the information officer, the form service, the email provider, the storage countries and the retention period. Have a South African lawyer review it.

## Putting changes live

Every commit to the repository's main branch redeploys the site on Vercel.
