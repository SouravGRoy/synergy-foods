import { GeneralShell } from "@/components/globals/layouts";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal information",
};

export default function PrivacyPage() {
    return (
        <GeneralShell>
            <div className="mx-auto max-w-4xl space-y-8 py-12">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="text-muted-foreground">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>

                <div className="prose max-w-none space-y-6 prose-gray dark:prose-invert">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">
                            1. Information We Collect
                        </h2>
                        <p>
                            We collect information you provide directly to us
                            when you create an account, make a purchase, or
                            communicate with us. This includes:
                        </p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>
                                Name and contact information (email, phone
                                number, address)
                            </li>
                            <li>
                                Payment information (processed securely through
                                our payment providers)
                            </li>
                            <li>Order history and preferences</li>
                            <li>
                                Communications with our customer service team
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">
                            2. How We Use Your Information
                        </h2>
                        <p>We use the information we collect to:</p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>Process and fulfill your orders</li>
                            <li>Send you order confirmations and updates</li>
                            <li>
                                Respond to your questions and provide customer
                                support
                            </li>
                            <li>Improve our products and services</li>
                            <li>
                                Send you marketing communications (with your
                                consent)
                            </li>
                            <li>Prevent fraud and maintain security</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">
                            3. Information Sharing
                        </h2>
                        <p>
                            We do not sell your personal information. We may
                            share your information with:
                        </p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>
                                Service providers who assist with order
                                fulfillment, payment processing, and shipping
                            </li>
                            <li>
                                Analytics providers to help us understand how
                                our services are used
                            </li>
                            <li>Legal authorities when required by law</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">
                            4. Data Security
                        </h2>
                        <p>
                            We implement appropriate technical and
                            organizational measures to protect your personal
                            information against unauthorized access, alteration,
                            disclosure, or destruction. This includes:
                        </p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>Encryption of data in transit and at rest</li>
                            <li>Regular security assessments</li>
                            <li>Secure authentication systems</li>
                            <li>Limited access to personal information</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">
                            5. Cookies and Tracking
                        </h2>
                        <p>
                            We use cookies and similar tracking technologies to
                            improve your browsing experience, analyze site
                            traffic, and personalize content. You can control
                            cookies through your browser settings.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">
                            6. Your Rights
                        </h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>
                                Access the personal information we hold about
                                you
                            </li>
                            <li>
                                Request correction of inaccurate information
                            </li>
                            <li>
                                Request deletion of your personal information
                            </li>
                            <li>Opt-out of marketing communications</li>
                            <li>Export your data in a portable format</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">
                            7. Children's Privacy
                        </h2>
                        <p>
                            Our services are not directed to children under 13.
                            We do not knowingly collect personal information
                            from children under 13. If you believe we have
                            collected such information, please contact us
                            immediately.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">
                            8. Changes to This Policy
                        </h2>
                        <p>
                            We may update this privacy policy from time to time.
                            We will notify you of any changes by posting the new
                            policy on this page and updating the "Last updated"
                            date.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">
                            9. Contact Us
                        </h2>
                        <p>
                            If you have questions about this Privacy Policy or
                            how we handle your personal information, please
                            contact us through our website.
                        </p>
                    </section>
                </div>
            </div>
        </GeneralShell>
    );
}
