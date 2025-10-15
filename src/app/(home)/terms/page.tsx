import { genPageMetadata } from '@/app/seo'

export const metadata = genPageMetadata({
  title: 'Terms of Service - ReelVan',
  description:
    'Terms of Service for ReelVan - AI video enhancement platform. Please read these terms carefully before using our service.',
})

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1>Terms of Service</h1>
        <p className="text-muted-foreground text-lg">
          <strong>Last Updated:</strong> October 10, 2025
        </p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using ReelVan ("Service"), you agree to be bound by these Terms of
            Service ("Terms"). If you do not agree to these Terms, please do not use the Service.
          </p>
        </section>

        <section>
          <h2>2. Service Description</h2>
          <p>ReelVan is a video enhancement platform that provides the following services:</p>
          <ul>
            <li>Watermark removal from AI-generated videos</li>
            <li>Video quality enhancement and upscaling</li>
            <li>Aspect ratio conversion</li>
            <li>Custom watermark addition</li>
          </ul>
          <p>
            The Service processes videos from AI platforms including but not limited to Sora, Veo,
            Kling, and JiMeng.
          </p>
        </section>

        <section>
          <h2>3. User Account and Eligibility</h2>
          <h3>3.1 Account Creation</h3>
          <p>
            To use the Service, you must create an account by providing accurate and complete
            information. You are responsible for maintaining the confidentiality of your account
            credentials.
          </p>
          <h3>3.2 Eligibility</h3>
          <p>
            You must be at least 18 years old to use the Service. By using the Service, you
            represent and warrant that you meet this age requirement.
          </p>
        </section>

        <section>
          <h2>4. Content Ownership and License</h2>
          <h3>4.1 Your Content</h3>
          <p>
            You retain all ownership rights to the videos you upload to the Service ("Your
            Content"). By uploading Your Content, you represent and warrant that:
          </p>
          <ul>
            <li>You own or have the necessary rights to Your Content</li>
            <li>Your Content does not violate any third-party rights</li>
            <li>You have the legal right to remove watermarks from Your Content</li>
          </ul>
          <h3>4.2 License to Process</h3>
          <p>
            You grant ReelVan a limited, non-exclusive, worldwide license to process, store, and
            deliver Your Content solely for the purpose of providing the Service to you.
          </p>
          <h3>4.3 Content Retention</h3>
          <p>We retain Your Content for the following periods:</p>
          <ul>
            <li>
              <strong>Free Tier:</strong> 7 days after processing
            </li>
            <li>
              <strong>Paid Tier:</strong> 30 days after processing
            </li>
          </ul>
          <p>
            After the retention period, Your Content will be permanently deleted from our servers.
          </p>
        </section>

        <section>
          <h2>5. Pricing and Payment</h2>
          <h3>5.1 Credits System</h3>
          <p>
            ReelVan operates on a pay-as-you-go credit system. You purchase credits in advance and
            consume them when processing videos. Credits never expire.
          </p>
          <h3>5.2 Pricing</h3>
          <p>
            Video processing costs are calculated based on video duration. Current pricing:
            approximately 8 credits per second of video. Exact pricing is displayed before
            processing begins.
          </p>
          <h3>5.3 Rate Limits</h3>
          <ul>
            <li>
              <strong>Free Tier:</strong> 3 videos per day (100 free signup credits)
            </li>
            <li>
              <strong>Paid Tier:</strong> 50 videos per day (unlocked on first purchase)
            </li>
            <li>
              <strong>Pro Tier:</strong> 200 videos per day (unlocked at $50+ lifetime purchases)
            </li>
          </ul>
          <h3>5.4 Payment Processing</h3>
          <p>
            Payments are processed securely through Stripe. By making a purchase, you agree to
            Stripe's Terms of Service.
          </p>
        </section>

        <section>
          <h2>6. Prohibited Uses</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Upload content you do not own or have rights to</li>
            <li>Remove watermarks from content you do not have permission to modify</li>
            <li>
              Upload content that violates laws or regulations, including but not limited to content
              that is illegal, harmful, threatening, abusive, harassing, defamatory, or obscene
            </li>
            <li>Attempt to circumvent rate limits or abuse the free tier</li>
            <li>Use the Service to process an unreasonable volume of videos (abuse)</li>
            <li>Reverse engineer, decompile, or attempt to extract source code from the Service</li>
            <li>Resell or redistribute the Service without authorization</li>
          </ul>
        </section>

        <section>
          <h2>7. Intellectual Property</h2>
          <h3>7.1 Watermark Removal</h3>
          <p>
            <strong>IMPORTANT:</strong> You are solely responsible for ensuring you have the legal
            right to remove watermarks from videos you upload. ReelVan does not verify ownership or
            rights. By using the watermark removal feature, you represent and warrant that you have
            the necessary permissions.
          </p>
          <h3>7.2 Third-Party Rights</h3>
          <p>
            You acknowledge that AI-generated video platforms (Sora, Veo, Kling, JiMeng, etc.) may
            have their own terms of service regarding watermark removal. You are responsible for
            complying with those terms.
          </p>
        </section>

        <section>
          <h2>8. Service Availability and Limitations</h2>
          <h3>8.1 Uptime</h3>
          <p>
            We strive to provide reliable service but do not guarantee 100% uptime. The Service may
            be temporarily unavailable due to maintenance, updates, or technical issues.
          </p>
          <h3>8.2 Technical Limitations</h3>
          <ul>
            <li>
              <strong>Max video duration:</strong> 120 seconds
            </li>
            <li>
              <strong>Max file size:</strong> 500MB
            </li>
            <li>
              <strong>Supported formats:</strong> MP4, MOV, WebM
            </li>
          </ul>
          <h3>8.3 Processing Quality</h3>
          <p>
            We use third-party APIs for video processing. While we strive for high quality, we
            cannot guarantee perfect results in all cases. Processing quality depends on the input
            video quality and characteristics.
          </p>
        </section>

        <section>
          <h2>9. Termination</h2>
          <h3>9.1 Termination by You</h3>
          <p>
            You may terminate your account at any time by contacting us at{' '}
            <a href="mailto:support@reelvan.com">support@reelvan.com</a>. Unused credits are subject
            to our Refund Policy.
          </p>
          <h3>9.2 Termination by Us</h3>
          <p>
            We reserve the right to suspend or terminate your account if you violate these Terms,
            abuse the Service, or engage in fraudulent activity. In case of termination for cause,
            no refunds will be provided.
          </p>
        </section>

        <section>
          <h2>10. Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED,
            INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
            PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p>
            WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT DEFECTS
            WILL BE CORRECTED.
          </p>
        </section>

        <section>
          <h2>11. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, REELVAN SHALL NOT BE LIABLE FOR ANY INDIRECT,
            INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO
            LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATED TO THE SERVICE.
          </p>
          <p>
            OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING FROM THE SERVICE SHALL NOT EXCEED THE
            AMOUNT YOU PAID TO REELVAN IN THE 12 MONTHS PRECEDING THE CLAIM.
          </p>
        </section>

        <section>
          <h2>12. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless ReelVan, its officers, directors, employees,
            and agents from any claims, damages, losses, liabilities, and expenses (including
            attorney fees) arising from:
          </p>
          <ul>
            <li>Your use of the Service</li>
            <li>Your violation of these Terms</li>
            <li>
              Your violation of any third-party rights, including intellectual property rights
            </li>
            <li>Your Content</li>
          </ul>
        </section>

        <section>
          <h2>13. DMCA and Copyright Policy</h2>
          <p>
            We respect intellectual property rights. If you believe content processed through our
            Service infringes your copyright, please contact us at{' '}
            <a href="mailto:legal@reelvan.com">legal@reelvan.com</a> with:
          </p>
          <ul>
            <li>Description of the copyrighted work</li>
            <li>Description of the infringing material</li>
            <li>Your contact information</li>
            <li>A statement of good faith belief</li>
            <li>A statement of accuracy under penalty of perjury</li>
            <li>Your electronic or physical signature</li>
          </ul>
        </section>

        <section>
          <h2>14. Modifications to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify users of material
            changes via email or through the Service. Continued use of the Service after changes
            constitutes acceptance of the modified Terms.
          </p>
        </section>

        <section>
          <h2>15. Governing Law and Dispute Resolution</h2>
          <h3>15.1 Governing Law</h3>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the United
            States and the State of Delaware, without regard to conflict of law principles.
          </p>
          <h3>15.2 Dispute Resolution</h3>
          <p>
            Any disputes arising from these Terms or the Service shall be resolved through binding
            arbitration in accordance with the rules of the American Arbitration Association, except
            where prohibited by law.
          </p>
        </section>

        <section>
          <h2>16. Contact Information</h2>
          <p>For questions about these Terms, please contact us at:</p>
          <ul>
            <li>
              <strong>Email:</strong> <a href="mailto:legal@reelvan.com">legal@reelvan.com</a>
            </li>
            <li>
              <strong>Support:</strong> <a href="mailto:support@reelvan.com">support@reelvan.com</a>
            </li>
          </ul>
        </section>

        <section>
          <h2>17. Severability</h2>
          <p>
            If any provision of these Terms is found to be invalid or unenforceable, the remaining
            provisions shall remain in full force and effect.
          </p>
        </section>

        <section>
          <h2>18. Entire Agreement</h2>
          <p>
            These Terms, together with our Privacy Policy and Refund Policy, constitute the entire
            agreement between you and ReelVan regarding the Service.
          </p>
        </section>
      </article>
    </div>
  )
}
