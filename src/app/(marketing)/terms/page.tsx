import { GeneralShell } from "@/components/globals/layouts";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Terms and conditions for using our services",
};

export default function TermsPage() {
    return (
        <GeneralShell>
            <div className="mx-auto max-w-4xl space-y-8 py-12">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Terms of Service
                    </h1>
                    <p className="text-muted-foreground">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>

                <div className="prose max-w-none space-y-6 prose-gray dark:prose-invert">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">
                            1. Agreement to Terms
                        </h2>
                        <p>
                            By accessing and using {siteConfig.name}, you accept
                            and agree to be bound by the terms and provision of
                            this agreement. If you do not agree to these terms,
                            please do not use our services.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">
                            2. Use License
                        </h2>
                        <p>
                            Permission is granted to temporarily access the
                            materials on {siteConfig.name} for personal,
                            non-commercial transitory viewing only. This is the
                            grant of a license, not a transfer of title.
                        </p>
                        <p>Under this license you may not:</p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>Modify or copy the materials</li>
                            <li>
                                Use the materials for any commercial purpose
                            </li>
                            <li>
                                Attempt to decompile or reverse engineer any
                                software
                            </li>
                            <li>
                                Remove any copyright or proprietary notations
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">
                            3. Account Terms
                        </h2>
                        <p>
                            You are responsible for maintaining the security of
                            your account and password. {siteConfig.name} cannot
                            and will not be liable for any loss or damage from
                            your failure to comply with this security
                            obligation.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">
                            4. Products and Services
                        </h2>
                        <p>
                            All products and services are subject to
                            availability. We reserve the right to limit
                            quantities of any products or services we offer. All
                            descriptions of products or pricing are subject to
                            change without notice.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">
                            5. Payment Terms
                        </h2>
                        <p>
                            Payment is required at the time of purchase. We
                            accept various payment methods as displayed during
                            checkout. All prices are in USD unless otherwise
                            specified.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">
                            6. Returns and Refunds
                        </h2>
                        <p>
                            We offer a 30-day return policy on most items.
                            Products must be in their original condition and
                            packaging. Refunds will be processed within 5-10
                            business days of receiving the returned item.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">
                            7. Limitation of Liability
                        </h2>
                        <p>
                            In no event shall {siteConfig.name} or its suppliers
                            be liable for any damages arising out of the use or
                            inability to use the materials on our website.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">
                            8. Governing Law
                        </h2>
                        <p>
                            These terms and conditions are governed by and
                            construed in accordance with the laws and you
                            irrevocably submit to the exclusive jurisdiction of
                            the courts in that location.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">
                            9. Contact Information
                        </h2>
                        <p>
                            If you have any questions about these Terms, please
                            contact us through our website.
                        </p>
                    </section>
                </div>
            </div>
        </GeneralShell>
    );
}
