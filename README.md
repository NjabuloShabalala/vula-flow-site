# Vula Flow website

Plain HTML and CSS. No build step.

- `index.html` is the gateway that sends visitors to either page
- `buyers.html` is the corporate buyer page
- `suppliers.html` is the SME supplier page
- `styles.css` holds the shared colours and base styles
- `favicon.svg` is the browser tab icon

## Put it live on Vercel

1. Create a new repository on GitHub (for example `vula-flow-site`) and upload these files so that `index.html` sits at the top level of the repository.
2. Go to vercel.com, choose Add New, then Project, and import that repository.
3. Leave every setting as it is (no framework, no build command) and press Deploy.
4. Vercel gives you a live link. To use your own domain, open the project, go to Settings, then Domains.

Check Vercel's current terms before using the free plan for a business. Netlify and Cloudflare Pages host these same files in the same way.

## Things to fill in before launch

- The Privacy and Terms links in the footers point to `#`
- The "Join the supplier list" and "Request a pilot" buttons open an email to shabalala@bnzgroup.co.za until the sign-up page exists
- Sample data on the pages is invented and labelled as such
