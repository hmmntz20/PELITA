# Email Verification (SMTP)

PELITA requires local accounts to verify their email address before they can sign in. Verification links are single-use and expire after 24 hours.

## Environment variables

Set these in the server's `.env` file. Never commit the real `.env` or its credentials to GitHub.

```dotenv
# Base URL users will open to verify the email.
# Use http://localhost:3000 for local development.
# In production, use the real URL users access, including HTTPS if enabled.
NEXT_PUBLIC_APP_URL=http://localhost:3000

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_KEY=your-smtp-password-or-smtp-compatible-key
# Optional; defaults to SMTP_USER
SMTP_FROM=your-sender@example.com
```

The sender credential can be set as `SMTP_PASS`, `SMTP_PASSWORD`, `SMTP_KEY`, or `SMTP_API_KEY`. If several are set, the first non-empty variable in that order is used. `SMTP_USER` and `SMTP_HOST` are still required; a provider's ordinary HTTP API key will not necessarily work as an SMTP password. Use that provider's SMTP credentials. For Gmail, use an app password when SMTP access requires one.

Port 465 uses TLS immediately. Other ports use the regular STARTTLS flow supported by Nodemailer (port 587 is common).

## Expected behavior

1. Registration creates an account with `email_verified = false` and sends a verification email.
2. The account cannot sign in until the recipient opens the valid verification link.
3. The link expires after 24 hours and can only be used once.
4. Signing in with an unverified local account attempts to send a new verification email and still rejects the login.
5. In non-production environments only, a direct verification link is shown if SMTP sending fails, to help local development. It is not returned in production.
6. Google sign-in is allowed only when Google's profile confirms that the email is verified.

If mail delivery fails, check `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, the credential variable, the sender address, and `NEXT_PUBLIC_APP_URL`. Do not fix delivery failures by setting `email_verified` to `true` manually.
