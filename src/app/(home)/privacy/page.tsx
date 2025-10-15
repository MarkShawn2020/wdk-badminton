import { genPageMetadata } from '@/app/seo'

export const metadata = genPageMetadata({
  title: 'Privacy Policy - ReelVan',
  description:
    'Privacy Policy for ReelVan - Learn how we collect, use, and protect your personal information.',
})

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground text-lg">
          <strong>Last Updated:</strong> October 10, 2025
        </p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            ReelVan ("we", "us", or "our") is committed to protecting your privacy. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your information when you
            use our video enhancement service ("Service").
          </p>
          <p>
            By using the Service, you agree to the collection and use of information in accordance
            with this Privacy Policy. If you do not agree with our policies and practices, please do
            not use the Service.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <h3>2.1 Personal Information</h3>
          <p>We collect the following personal information when you create an account:</p>
          <ul>
            <li>
              <strong>Email address:</strong> Used for account creation, authentication, and
              communication
            </li>
            <li>
              <strong>Name:</strong> Optional, for personalization
            </li>
            <li>
              <strong>Password:</strong> Securely hashed and stored via Supabase Auth
            </li>
            <li>
              <strong>OAuth data:</strong> If you sign up with Google, we receive your name, email,
              and profile picture
            </li>
          </ul>

          <h3>2.2 Video Content</h3>
          <p>When you upload videos for processing:</p>
          <ul>
            <li>
              <strong>Video files:</strong> Temporarily stored in our secure cloud storage
            </li>
            <li>
              <strong>Video metadata:</strong> Filename, duration, file size, format
            </li>
            <li>
              <strong>Processing preferences:</strong> Selected enhancements (watermark removal,
              quality settings, aspect ratio)
            </li>
          </ul>

          <h3>2.3 Payment Information</h3>
          <p>
            Payment processing is handled by Stripe. We do not store your credit card information.
            We retain:
          </p>
          <ul>
            <li>Transaction history (amount, date, credits purchased)</li>
            <li>Stripe customer ID (for managing your account)</li>
            <li>Stripe payment intent ID (for support and refunds)</li>
          </ul>

          <h3>2.4 Usage Data</h3>
          <p>We automatically collect usage information:</p>
          <ul>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device type and operating system</li>
            <li>Pages visited and time spent</li>
            <li>Video processing history (timestamps, costs, status)</li>
            <li>Feature usage (which enhancements you use)</li>
          </ul>

          <h3>2.5 Cookies and Tracking Technologies</h3>
          <p>We use cookies for:</p>
          <ul>
            <li>
              <strong>Authentication:</strong> Session management via Supabase Auth
            </li>
            <li>
              <strong>Analytics:</strong> Understanding how users interact with the Service
            </li>
            <li>
              <strong>Preferences:</strong> Remembering your settings
            </li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use your information for the following purposes:</p>

          <h3>3.1 Service Delivery</h3>
          <ul>
            <li>Process and enhance your videos</li>
            <li>Manage your account and credits</li>
            <li>Provide customer support</li>
            <li>Send transactional emails (processing complete, payment receipts)</li>
          </ul>

          <h3>3.2 Service Improvement</h3>
          <ul>
            <li>Analyze usage patterns to improve features</li>
            <li>Monitor and optimize processing quality</li>
            <li>Troubleshoot technical issues</li>
            <li>Develop new features based on user needs</li>
          </ul>

          <h3>3.3 Communication</h3>
          <ul>
            <li>Respond to your inquiries and support requests</li>
            <li>Send important service updates and notifications</li>
            <li>Send marketing communications (with your consent, opt-out available)</li>
          </ul>

          <h3>3.4 Legal and Security</h3>
          <ul>
            <li>Prevent fraud and abuse</li>
            <li>Enforce our Terms of Service</li>
            <li>Comply with legal obligations</li>
            <li>Protect the security and integrity of the Service</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Retention</h2>
          <h3>4.1 Video Files</h3>
          <p>Video files are retained for limited periods:</p>
          <ul>
            <li>
              <strong>Free Tier:</strong> 7 days after processing
            </li>
            <li>
              <strong>Paid Tier:</strong> 30 days after processing
            </li>
          </ul>
          <p>After the retention period, video files are permanently deleted from our storage.</p>

          <h3>4.2 Account Information</h3>
          <p>
            Account information is retained as long as your account is active. If you delete your
            account, we will delete or anonymize your personal information within 30 days, except:
          </p>
          <ul>
            <li>Transaction records required for accounting and legal compliance (7 years)</li>
            <li>Information necessary to resolve disputes or enforce agreements</li>
          </ul>

          <h3>4.3 Usage Analytics</h3>
          <p>
            Anonymized usage analytics may be retained indefinitely for service improvement and
            research purposes.
          </p>
        </section>

        <section>
          <h2>5. Data Sharing and Disclosure</h2>
          <h3>5.1 Third-Party Service Providers</h3>
          <p>We share data with trusted third-party providers to operate our Service:</p>
          <ul>
            <li>
              <strong>Supabase:</strong> Database, authentication, and storage (
              <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
              )
            </li>
            <li>
              <strong>Stripe:</strong> Payment processing (
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
              )
            </li>
            <li>
              <strong>Vercel:</strong> Hosting and CDN (
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              )
            </li>
            <li>
              <strong>Video Processing APIs:</strong> Third-party APIs for video enhancement (data
              processed under strict confidentiality agreements)
            </li>
          </ul>

          <h3>5.2 Legal Requirements</h3>
          <p>We may disclose your information if required by law or in response to:</p>
          <ul>
            <li>Valid legal requests (subpoenas, court orders)</li>
            <li>Enforcement of our Terms of Service</li>
            <li>Protection of our rights, property, or safety</li>
            <li>Investigation of fraud or security issues</li>
          </ul>

          <h3>5.3 Business Transfers</h3>
          <p>
            In the event of a merger, acquisition, or sale of assets, your information may be
            transferred to the acquiring entity. We will notify you via email and/or prominent
            notice on our website of any change in ownership or use of your personal information.
          </p>

          <h3>5.4 We Do Not Sell Your Data</h3>
          <p>
            We do <strong>not</strong> sell, rent, or trade your personal information to third
            parties for marketing purposes.
          </p>
        </section>

        <section>
          <h2>6. Data Security</h2>
          <p>We implement industry-standard security measures to protect your information:</p>
          <ul>
            <li>
              <strong>Encryption:</strong> HTTPS/TLS encryption for all data in transit
            </li>
            <li>
              <strong>Secure Storage:</strong> Video files stored in encrypted cloud storage with
              restricted access
            </li>
            <li>
              <strong>Authentication:</strong> Secure authentication via Supabase with password
              hashing
            </li>
            <li>
              <strong>Access Controls:</strong> Limited employee access to personal data on a
              need-to-know basis
            </li>
            <li>
              <strong>Monitoring:</strong> Continuous monitoring for security threats and
              vulnerabilities
            </li>
          </ul>
          <p>
            While we strive to protect your information, no method of transmission over the internet
            or electronic storage is 100% secure. We cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2>7. Your Privacy Rights</h2>
          <h3>7.1 Access and Portability</h3>
          <p>
            You have the right to request a copy of your personal information in a structured,
            machine-readable format.
          </p>

          <h3>7.2 Correction</h3>
          <p>
            You can update your account information at any time through your dashboard settings.
          </p>

          <h3>7.3 Deletion</h3>
          <p>
            You can request deletion of your account and personal information by contacting{' '}
            <a href="mailto:privacy@reelvan.com">privacy@reelvan.com</a>. We will process your
            request within 30 days.
          </p>

          <h3>7.4 Opt-Out of Marketing</h3>
          <p>
            You can opt out of marketing emails by clicking the "unsubscribe" link in any marketing
            email or by updating your preferences in your account settings.
          </p>

          <h3>7.5 Do Not Track</h3>
          <p>
            Our Service does not respond to Do Not Track (DNT) signals. We do not track users across
            third-party websites.
          </p>

          <h3>7.6 California Residents (CCPA)</h3>
          <p>
            If you are a California resident, you have additional rights under the California
            Consumer Privacy Act (CCPA):
          </p>
          <ul>
            <li>Right to know what personal information is collected</li>
            <li>Right to know if personal information is sold or disclosed</li>
            <li>Right to say no to the sale of personal information (we do not sell data)</li>
            <li>Right to access your personal information</li>
            <li>Right to request deletion of your personal information</li>
            <li>Right to equal service and price (no discrimination for exercising rights)</li>
          </ul>
          <p>
            To exercise these rights, contact{' '}
            <a href="mailto:privacy@reelvan.com">privacy@reelvan.com</a>.
          </p>

          <h3>7.7 European Residents (GDPR)</h3>
          <p>If you are in the European Economic Area (EEA), you have rights under GDPR:</p>
          <ul>
            <li>
              <strong>Right to access:</strong> Obtain a copy of your personal data
            </li>
            <li>
              <strong>Right to rectification:</strong> Correct inaccurate personal data
            </li>
            <li>
              <strong>Right to erasure:</strong> Request deletion of your personal data
            </li>
            <li>
              <strong>Right to restrict processing:</strong> Limit how we use your data
            </li>
            <li>
              <strong>Right to data portability:</strong> Receive your data in a portable format
            </li>
            <li>
              <strong>Right to object:</strong> Object to processing based on legitimate interests
            </li>
            <li>
              <strong>Right to withdraw consent:</strong> Withdraw consent at any time
            </li>
          </ul>
          <p>
            To exercise these rights, contact{' '}
            <a href="mailto:privacy@reelvan.com">privacy@reelvan.com</a>. You also have the right to
            lodge a complaint with your local data protection authority.
          </p>
        </section>

        <section>
          <h2>8. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your
            country of residence, including the United States. These countries may have different
            data protection laws.
          </p>
          <p>
            We ensure appropriate safeguards are in place when transferring data internationally,
            including:
          </p>
          <ul>
            <li>Standard Contractual Clauses (SCCs) with third-party providers</li>
            <li>Privacy Shield frameworks (where applicable)</li>
            <li>Ensuring third-party providers comply with GDPR and other data protection laws</li>
          </ul>
        </section>

        <section>
          <h2>9. Children's Privacy</h2>
          <p>
            Our Service is not intended for children under 18 years of age. We do not knowingly
            collect personal information from children under 18. If we discover that a child under
            18 has provided us with personal information, we will delete it immediately.
          </p>
          <p>
            If you are a parent or guardian and believe your child has provided us with personal
            information, please contact us at{' '}
            <a href="mailto:privacy@reelvan.com">privacy@reelvan.com</a>.
          </p>
        </section>

        <section>
          <h2>10. Third-Party Links</h2>
          <p>
            Our Service may contain links to third-party websites or services. We are not
            responsible for the privacy practices of these third parties. We encourage you to read
            their privacy policies.
          </p>
        </section>

        <section>
          <h2>11. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material
            changes by:
          </p>
          <ul>
            <li>Posting the updated Privacy Policy on this page</li>
            <li>Updating the "Last Updated" date</li>
            <li>Sending an email notification to registered users</li>
          </ul>
          <p>
            Your continued use of the Service after changes constitutes acceptance of the updated
            Privacy Policy.
          </p>
        </section>

        <section>
          <h2>12. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or our data practices, please contact
            us:
          </p>
          <ul>
            <li>
              <strong>Email:</strong> <a href="mailto:privacy@reelvan.com">privacy@reelvan.com</a>
            </li>
            <li>
              <strong>Support:</strong> <a href="mailto:support@reelvan.com">support@reelvan.com</a>
            </li>
          </ul>
        </section>

        <section>
          <h2>13. Legal Basis for Processing (GDPR)</h2>
          <p>
            For users in the EEA, we process your personal data under the following legal bases:
          </p>
          <ul>
            <li>
              <strong>Contract:</strong> Processing necessary to provide the Service you requested
            </li>
            <li>
              <strong>Consent:</strong> You have given consent for specific purposes (e.g.,
              marketing emails)
            </li>
            <li>
              <strong>Legitimate Interests:</strong> Processing necessary for our legitimate
              interests (e.g., fraud prevention, service improvement)
            </li>
            <li>
              <strong>Legal Obligation:</strong> Processing necessary to comply with legal
              requirements
            </li>
          </ul>
        </section>

        <section>
          <h2>14. Data Protection Officer</h2>
          <p>
            For questions related to data protection, you can contact our Data Protection Officer
            at: <a href="mailto:dpo@reelvan.com">dpo@reelvan.com</a>
          </p>
        </section>
      </article>
    </div>
  )
}
