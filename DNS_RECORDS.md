# Macaroon Garden — DNS record configurations for Email Authenticity

To prevent your emails from going to spam, ensure high email deliverability, and satisfy domain verification standards, add the following SPF and DMARC TXT records in your DNS management panel (e.g., Cloudflare, GoDaddy, Namecheap, or NIC.lv).

---

## 1. SPF (Sender Policy Framework) Record
An SPF record tells receiving mail servers which mail servers are authorized to send email on behalf of your domain.

* **Type**: `TXT`
* **Host/Name**: `@` (or leave blank depending on your DNS host)
* **Value**: `v=spf1 include:mx.supabase.co include:sendgrid.net include:mailjet.com ~all`

*(Note: Adjust the SPF record value if you use custom providers such as Google Workspace `include:_spf.google.com` or Microsoft 365. It is best to merge SPF records into a single record to prevent conflicts).*

---

## 2. DMARC (Domain-based Message Authentication, Reporting, and Conformance) Record
A DMARC record specifies how the receiver should handle emails that fail SPF or DKIM checks. It acts as an authoritative defense layer against phishing and spoofing.

* **Type**: `TXT`
* **Host/Name**: `_dmarc` (or `_dmarc.macarongarden.lv.`)
* **Value**: `v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc-reports@macarongarden.lv; aspf=r; adkim=r`

### Breakdown of the DMARC Configuration:
* `p=quarantine`: Moves failed emails directly to the recipient's spam/junk folder. (Once fully tested, you can upgrade this to `p=reject` to completely block unauthorized emails).
* `pct=100`: Applies the rule to 100% of emails sent.
* `rua=mailto:dmarc-reports@macarongarden.lv`: Instructs mail servers to send XML aggregate reports to this email address for tracking.
* `aspf=r` & `adkim=r`: Specifies relaxed SPF and DKIM alignment verification rules.

---

## 3. DKIM (DomainKeys Identified Mail) Record
If you are sending transaction emails via EmailJS or Supabase, follow their instructions to add the unique public DKIM key TXT record to authorize outgoing mail signatures. This typically looks like:

* **Type**: `TXT`
* **Host/Name**: `<selector>._domainkey`
* **Value**: `v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFADCCAQ8AMIIBCgKCAQEA...` (Your specific email provider's public key)
