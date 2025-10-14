import { genPageMetadata } from '@/app/seo'

export const metadata = genPageMetadata({
  title: 'Refund Policy - ReelVan',
  description:
    'Refund Policy for ReelVan - Learn about our refund conditions and how to request a refund.',
})

export default function RefundPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1>Refund Policy</h1>
        <p className="text-muted-foreground text-lg">
          <strong>Last Updated:</strong> October 10, 2025
        </p>

        <section>
          <h2>1. Overview</h2>
          <p>
            At ReelVan, we strive to provide high-quality video enhancement services. This Refund
            Policy outlines the conditions under which refunds are granted. By purchasing credits or
            using our Service, you agree to this policy.
          </p>
          <p>
            <strong>Note:</strong> Due to the nature of our service (video processing consumes
            third-party API resources immediately), refunds are limited to specific circumstances
            outlined below.
          </p>
        </section>

        <section>
          <h2>2. Credit Purchase Refunds</h2>
          <h3>2.1 Unused Credits</h3>
          <p>
            If you purchase credits and have <strong>not yet used them</strong>, you may request a
            full refund within <strong>14 days</strong> of purchase.
          </p>
          <p>
            <strong>Conditions:</strong>
          </p>
          <ul>
            <li>No videos have been processed using the purchased credits</li>
            <li>Request made within 14 days of purchase</li>
            <li>Proof of purchase (transaction ID or email receipt)</li>
          </ul>

          <h3>2.2 Partially Used Credits</h3>
          <p>
            If you have used some credits but encountered significant technical issues, we may offer
            a <strong>partial refund</strong> at our discretion:
          </p>
          <ul>
            <li>
              <strong>Refund amount:</strong> Cost of unused credits minus a processing fee (10% or
              $1, whichever is greater)
            </li>
            <li>
              <strong>Eligibility:</strong> Must be requested within 30 days of purchase
            </li>
            <li>
              <strong>Technical issues:</strong> Must be documented and unresolved after contacting
              support
            </li>
          </ul>

          <h3>2.3 Fully Used Credits</h3>
          <p>
            If you have consumed all purchased credits by processing videos,{' '}
            <strong>no refund is available</strong> unless there were significant processing
            failures (see Section 3).
          </p>
        </section>

        <section>
          <h2>3. Processing Failure Refunds</h2>
          <h3>3.1 Eligible Processing Failures</h3>
          <p>
            You are eligible for a credit refund or reprocessing if your video processing fails due
            to:
          </p>
          <ul>
            <li>
              <strong>Technical errors:</strong> Server errors, API failures not caused by invalid
              input
            </li>
            <li>
              <strong>Quality issues:</strong> Processed video is significantly worse than original
              (corruption, artifacts not present in source)
            </li>
            <li>
              <strong>Service unavailability:</strong> Service downtime exceeding 24 hours
            </li>
          </ul>
          <p>
            <strong>Remedy:</strong> We will either:
          </p>
          <ul>
            <li>Refund the credits consumed for the failed processing, or</li>
            <li>Reprocess the video at no additional charge</li>
          </ul>

          <h3>3.2 Non-Eligible Processing Issues</h3>
          <p>
            Refunds are <strong>not available</strong> for:
          </p>
          <ul>
            <li>
              <strong>Subjective quality:</strong> "Not as good as expected" when processing
              completed successfully
            </li>
            <li>
              <strong>Source limitations:</strong> Poor results due to low-quality input video
            </li>
            <li>
              <strong>User error:</strong> Wrong settings selected, wrong file uploaded
            </li>
            <li>
              <strong>Format incompatibility:</strong> Uploading unsupported file types (you'll be
              notified before processing)
            </li>
            <li>
              <strong>Exceeded limits:</strong> Videos exceeding duration (120s) or file size
              (500MB) limits
            </li>
          </ul>

          <h3>3.3 Filing a Processing Failure Claim</h3>
          <p>To request a refund for processing failure:</p>
          <ol>
            <li>
              Contact support at <a href="mailto:support@reelvan.com">support@reelvan.com</a> within{' '}
              <strong>7 days</strong> of processing
            </li>
            <li>Provide your video ID and description of the issue</li>
            <li>Attach screenshots or video examples if applicable</li>
            <li>Our team will investigate and respond within 3 business days</li>
          </ol>
        </section>

        <section>
          <h2>4. Subscription Refunds (Future Feature)</h2>
          <p>
            <strong>Note:</strong> ReelVan currently operates on a pay-as-you-go model without
            subscriptions. If we introduce subscription plans in the future, this section will
            apply:
          </p>
          <ul>
            <li>
              <strong>Monthly subscriptions:</strong> Non-refundable after the first 7 days of
              initial subscription
            </li>
            <li>
              <strong>Annual subscriptions:</strong> Prorated refund available within 30 days of
              purchase
            </li>
            <li>
              <strong>Cancellation:</strong> You can cancel at any time; access continues until the
              end of the billing period
            </li>
          </ul>
        </section>

        <section>
          <h2>5. Chargeback Policy</h2>
          <h3>5.1 Dispute Resolution</h3>
          <p>
            <strong>Before filing a chargeback</strong>, please contact us at{' '}
            <a href="mailto:support@reelvan.com">support@reelvan.com</a>. We are committed to
            resolving billing disputes quickly and fairly.
          </p>

          <h3>5.2 Chargeback Consequences</h3>
          <p>If you file a chargeback without contacting us first:</p>
          <ul>
            <li>Your account will be immediately suspended pending investigation</li>
            <li>
              If the chargeback is found to be invalid, your account may be permanently terminated
            </li>
            <li>You will be responsible for chargeback fees ($15-$25)</li>
          </ul>

          <h3>5.3 Fraudulent Chargebacks</h3>
          <p>
            Fraudulent chargebacks (e.g., claiming "did not receive service" after successfully
            processing videos) may result in:
          </p>
          <ul>
            <li>Permanent account termination</li>
            <li>Legal action to recover damages</li>
            <li>Reporting to credit bureaus and fraud prevention agencies</li>
          </ul>
        </section>

        <section>
          <h2>6. Refund Process</h2>
          <h3>6.1 How to Request a Refund</h3>
          <ol>
            <li>
              Email <a href="mailto:support@reelvan.com">support@reelvan.com</a> with subject line:
              "Refund Request - [Your Email]"
            </li>
            <li>
              Include:
              <ul>
                <li>Your account email</li>
                <li>Transaction ID or payment receipt</li>
                <li>Reason for refund request</li>
                <li>Supporting documentation (if applicable)</li>
              </ul>
            </li>
            <li>Our team will review your request within 3 business days</li>
            <li>If approved, refund will be processed within 5-10 business days</li>
          </ol>

          <h3>6.2 Refund Method</h3>
          <p>
            Refunds are issued to the <strong>original payment method</strong> used for purchase:
          </p>
          <ul>
            <li>
              <strong>Credit/Debit Card:</strong> Refund processed via Stripe, appears in 5-10
              business days
            </li>
            <li>
              <strong>PayPal:</strong> Refund appears in PayPal account within 3-5 business days
            </li>
          </ul>
          <p>We cannot refund to a different payment method or provide cash refunds.</p>

          <h3>6.3 Refund Currency</h3>
          <p>
            Refunds are issued in the <strong>original currency</strong> of purchase. Exchange rate
            fluctuations are not compensated.
          </p>
        </section>

        <section>
          <h2>7. Special Circumstances</h2>
          <h3>7.1 Service Discontinuation</h3>
          <p>
            If ReelVan discontinues the Service, users with unused credits purchased within the last
            90 days will receive a full refund.
          </p>

          <h3>7.2 Account Termination by ReelVan</h3>
          <p>If we terminate your account for violating our Terms of Service:</p>
          <ul>
            <li>
              <strong>No refund</strong> for unused credits
            </li>
            <li>Credits are forfeited upon termination</li>
          </ul>
          <p>
            If we terminate your account due to our error or technical issues, you will receive a
            full refund for unused credits.
          </p>

          <h3>7.3 Free Tier and Promotional Credits</h3>
          <ul>
            <li>
              <strong>Signup bonus credits:</strong> Not refundable (they were free)
            </li>
            <li>
              <strong>Promotional credits:</strong> Not refundable or transferable
            </li>
            <li>
              <strong>Referral credits:</strong> Not refundable
            </li>
          </ul>
        </section>

        <section>
          <h2>8. Money-Back Guarantee (New Users)</h2>
          <h3>8.1 First Purchase Guarantee</h3>
          <p>
            For <strong>first-time purchasers</strong>, we offer a satisfaction guarantee:
          </p>
          <ul>
            <li>
              If you process your first video and are not satisfied with the quality, contact us
              within <strong>48 hours</strong>
            </li>
            <li>
              We will either reprocess the video with adjusted settings or refund the credits used
            </li>
            <li>This guarantee applies only to your first processed video</li>
          </ul>

          <h3>8.2 Guarantee Exclusions</h3>
          <p>The money-back guarantee does not apply if:</p>
          <ul>
            <li>The input video was of very low quality or corrupted</li>
            <li>You selected inappropriate settings for your video</li>
            <li>You violated our Terms of Service</li>
          </ul>
        </section>

        <section>
          <h2>9. Credit Expiration</h2>
          <p>
            <strong>Credits never expire.</strong> You can use purchased credits at any time, and
            they remain in your account indefinitely.
          </p>
          <p>
            However, if your account is inactive for <strong>2+ years</strong>, we may send a
            reminder to use your credits. If still inactive after 3 years, we reserve the right to
            close dormant accounts after providing 60 days' notice via email.
          </p>
        </section>

        <section>
          <h2>10. Tax and Fees</h2>
          <p>
            Refunds are processed for the amount paid <strong>excluding any processing fees</strong>{' '}
            charged by payment processors (Stripe, PayPal). ReelVan is not responsible for these
            third-party fees.
          </p>
          <p>
            If taxes were charged on your purchase, tax refunds are processed according to local tax
            regulations. Contact your local tax authority for questions about tax refunds.
          </p>
        </section>

        <section>
          <h2>11. Exceptions and Final Decisions</h2>
          <p>
            ReelVan reserves the right to make exceptions to this policy on a case-by-case basis.
            All refund decisions are final and at the sole discretion of ReelVan management.
          </p>
          <p>
            We may update this Refund Policy from time to time. Material changes will be announced
            via email and on our website.
          </p>
        </section>

        <section>
          <h2>12. Contact Us</h2>
          <p>For refund requests or questions about this policy:</p>
          <ul>
            <li>
              <strong>Email:</strong> <a href="mailto:support@reelvan.com">support@reelvan.com</a>
            </li>
            <li>
              <strong>Subject Line:</strong> "Refund Request" or "Refund Policy Question"
            </li>
            <li>
              <strong>Response Time:</strong> We respond to all refund requests within 3 business
              days
            </li>
          </ul>
        </section>

        <section>
          <h2>13. Summary of Refund Eligibility</h2>
          <div className="not-prose overflow-x-auto">
            <table className="border-border min-w-full border">
              <thead>
                <tr className="bg-secondary">
                  <th className="border-border border px-4 py-2 text-left">Scenario</th>
                  <th className="border-border border px-4 py-2 text-left">Refund Eligibility</th>
                  <th className="border-border border px-4 py-2 text-left">Time Limit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-border border px-4 py-2">
                    Unused credits (no videos processed)
                  </td>
                  <td className="border-border border px-4 py-2">✅ Full refund</td>
                  <td className="border-border border px-4 py-2">14 days</td>
                </tr>
                <tr className="bg-secondary/50">
                  <td className="border-border border px-4 py-2">
                    Partially used credits (with technical issues)
                  </td>
                  <td className="border-border border px-4 py-2">
                    ⚠️ Partial refund (at discretion)
                  </td>
                  <td className="border-border border px-4 py-2">30 days</td>
                </tr>
                <tr>
                  <td className="border-border border px-4 py-2">
                    Fully used credits (successful processing)
                  </td>
                  <td className="border-border border px-4 py-2">❌ No refund</td>
                  <td className="border-border border px-4 py-2">N/A</td>
                </tr>
                <tr className="bg-secondary/50">
                  <td className="border-border border px-4 py-2">
                    Processing failure (server error)
                  </td>
                  <td className="border-border border px-4 py-2">✅ Full credit refund</td>
                  <td className="border-border border px-4 py-2">7 days</td>
                </tr>
                <tr>
                  <td className="border-border border px-4 py-2">
                    First video (money-back guarantee)
                  </td>
                  <td className="border-border border px-4 py-2">✅ Credit refund or reprocess</td>
                  <td className="border-border border px-4 py-2">48 hours</td>
                </tr>
                <tr className="bg-secondary/50">
                  <td className="border-border border px-4 py-2">Free/promotional credits</td>
                  <td className="border-border border px-4 py-2">❌ Not refundable</td>
                  <td className="border-border border px-4 py-2">N/A</td>
                </tr>
                <tr>
                  <td className="border-border border px-4 py-2">
                    Account terminated (Terms violation)
                  </td>
                  <td className="border-border border px-4 py-2">❌ No refund</td>
                  <td className="border-border border px-4 py-2">N/A</td>
                </tr>
                <tr className="bg-secondary/50">
                  <td className="border-border border px-4 py-2">
                    Service discontinued by ReelVan
                  </td>
                  <td className="border-border border px-4 py-2">
                    ✅ Full refund (credits purchased within 90 days)
                  </td>
                  <td className="border-border border px-4 py-2">90 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>14. Relationship to Terms of Service</h2>
          <p>
            This Refund Policy is part of our Terms of Service. In case of conflict between this
            policy and the Terms of Service, the Terms of Service shall prevail.
          </p>
        </section>
      </article>
    </div>
  )
}
