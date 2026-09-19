# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of VYBEON seriously. If you believe you have found a security vulnerability, please report it privately:

1. **Do NOT file a public issue.**
2. Email security vulnerability details directly to **security@vybeon.app** or open a private GitHub security advisory.
3. Include clear steps to reproduce, affected endpoints, and any relevant logs or proofs-of-concept.

### Response Timeline
- Initial acknowledgment within 48 hours.
- Status update and remediation estimate within 5 business days.

## Security Practices in VYBEON

- **No Secrets in Source:** All credentials, database connection strings, and JWT secrets are managed via environment variables.
- **SQL Injection Prevention:** All database access is parameterized through Prisma ORM.
- **Strict Input Validation:** All API endpoints validate schemas with Zod.
- **Password Hashing:** Passwords are encrypted using bcrypt with salt rounds of 10.
- **Session Security:** Auth.js with JWT encryption and HTTP-only cookie strategies.
- **Legal Compliance:** No copyrighted audio or lyrics are stored or scraped in this codebase.
