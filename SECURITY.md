# Security Policy

## Supported Versions

The following versions of this project are currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of our project seriously. If you believe you have found a security vulnerability, please report it to us by following these steps:

1. **Do not open a public issue.**
2. Send an email to `security@your-domain.com` (replace with your actual email).
3. Include as much detail as possible, including steps to reproduce.

We will acknowledge your report within 48 hours and provide a timeline for a fix if necessary.

## Best Practices for Deployment

1. **Environment Variables**: Never commit `.env` files to the repository. Use the provided `.env.example` as a template.
2. **Secrets**: Use a secret manager (like AWS Secrets Manager, HashiCorp Vault, or GitHub Secrets) for production deployments.
3. **Database**: Ensure your database is not publicly accessible and use strong passwords.
4. **JWT**: Change the `JWT_SECRET` in production to a strong, unique key.
