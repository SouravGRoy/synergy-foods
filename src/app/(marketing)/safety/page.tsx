import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Food Safety Policy",
    description: "Our commitment to food safety and quality standards",
};

export default function FoodSafetyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="space-y-4 text-center">
                        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                            Food Safety Policy
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Our unwavering commitment to quality, safety, and
                            excellence
                        </p>
                    </div>

                    {/* Content */}
                    <div className="prose max-w-none space-y-8 prose-slate dark:prose-invert">
                        <section className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold">
                                Our Food Safety Commitment
                            </h2>
                            <p className="text-muted-foreground">
                                At Synergy Foods, food safety is our top
                                priority. We are committed to providing our
                                customers with the highest quality, safe, and
                                wholesome food products. Our comprehensive food
                                safety program ensures that every product meets
                                or exceeds international food safety standards.
                            </p>
                        </section>

                        <section className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold">
                                Quality Assurance Standards
                            </h2>
                            <div className="space-y-4 text-muted-foreground">
                                <div>
                                    <h3 className="mb-2 font-semibold text-foreground">
                                        Certifications & Compliance
                                    </h3>
                                    <ul className="ml-6 space-y-2">
                                        <li>
                                            ISO 22000 Food Safety Management
                                            System certified
                                        </li>
                                        <li>
                                            HACCP (Hazard Analysis Critical
                                            Control Points) compliant
                                        </li>
                                        <li>
                                            FDA regulations compliance for food
                                            handling and distribution
                                        </li>
                                        <li>
                                            Local and international food safety
                                            authority approvals
                                        </li>
                                        <li>
                                            Organic certification for applicable
                                            products
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold">
                                Supplier Selection & Verification
                            </h2>
                            <p className="text-muted-foreground">
                                We carefully vet all our suppliers to ensure
                                they meet our stringent standards:
                            </p>
                            <ul className="ml-6 space-y-2 text-muted-foreground">
                                <li>
                                    Regular audits and inspections of supplier
                                    facilities
                                </li>
                                <li>
                                    Verification of food safety certifications
                                    and licenses
                                </li>
                                <li>
                                    Assessment of quality control procedures
                                </li>
                                <li>Traceability systems for all products</li>
                                <li>
                                    Ongoing performance monitoring and
                                    evaluation
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold">
                                Storage & Handling Procedures
                            </h2>
                            <div className="space-y-4 text-muted-foreground">
                                <div>
                                    <h3 className="mb-2 font-semibold text-foreground">
                                        Temperature Control
                                    </h3>
                                    <ul className="ml-6 space-y-2">
                                        <li>
                                            Climate-controlled storage
                                            facilities
                                        </li>
                                        <li>
                                            24/7 temperature monitoring systems
                                        </li>
                                        <li>
                                            Cold chain management for perishable
                                            items
                                        </li>
                                        <li>
                                            Regular equipment maintenance and
                                            calibration
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="mb-2 font-semibold text-foreground">
                                        Hygiene Standards
                                    </h3>
                                    <ul className="ml-6 space-y-2">
                                        <li>
                                            Strict sanitation protocols for all
                                            storage areas
                                        </li>
                                        <li>
                                            Pest control management programs
                                        </li>
                                        <li>
                                            Personal hygiene requirements for
                                            all staff
                                        </li>
                                        <li>
                                            Regular cleaning and sanitization
                                            schedules
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold">
                                Product Testing & Quality Control
                            </h2>
                            <ul className="ml-6 space-y-2 text-muted-foreground">
                                <li>
                                    Laboratory testing for contaminants and
                                    pathogens
                                </li>
                                <li>
                                    Microbiological analysis of food samples
                                </li>
                                <li>Chemical and pesticide residue testing</li>
                                <li>Allergen testing and verification</li>
                                <li>
                                    Shelf-life studies and expiration date
                                    validation
                                </li>
                                <li>
                                    Organoleptic evaluation (taste, appearance,
                                    texture)
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold">
                                Packaging & Labeling
                            </h2>
                            <p className="text-muted-foreground">
                                All products meet strict packaging and labeling
                                requirements:
                            </p>
                            <ul className="ml-6 space-y-2 text-muted-foreground">
                                <li>Food-grade packaging materials only</li>
                                <li>
                                    Clear ingredient lists and nutritional
                                    information
                                </li>
                                <li>Allergen warnings and declarations</li>
                                <li>Production and expiration date labeling</li>
                                <li>Storage instruction guidelines</li>
                                <li>Batch and lot number traceability</li>
                            </ul>
                        </section>

                        <section className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold">
                                Transportation & Delivery
                            </h2>
                            <ul className="ml-6 space-y-2 text-muted-foreground">
                                <li>
                                    Temperature-controlled vehicles for
                                    perishable goods
                                </li>
                                <li>GPS tracking for real-time monitoring</li>
                                <li>
                                    Trained delivery personnel in food safety
                                    protocols
                                </li>
                                <li>
                                    Regular vehicle inspection and sanitization
                                </li>
                                <li>
                                    Time-sensitive delivery schedules to
                                    maintain freshness
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold">
                                Incident Response & Recall Procedures
                            </h2>
                            <p className="text-muted-foreground">
                                We maintain comprehensive procedures for
                                addressing food safety concerns:
                            </p>
                            <ul className="ml-6 space-y-2 text-muted-foreground">
                                <li>
                                    24/7 food safety incident reporting system
                                </li>
                                <li>
                                    Rapid response team for quality concerns
                                </li>
                                <li>
                                    Product recall procedures compliant with
                                    regulations
                                </li>
                                <li>
                                    Root cause analysis and corrective actions
                                </li>
                                <li>Customer notification protocols</li>
                                <li>
                                    Continuous improvement based on incidents
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold">
                                Staff Training & Education
                            </h2>
                            <ul className="ml-6 space-y-2 text-muted-foreground">
                                <li>
                                    Mandatory food safety training for all
                                    employees
                                </li>
                                <li>
                                    Regular refresher courses and certifications
                                </li>
                                <li>
                                    Personal hygiene and cross-contamination
                                    prevention
                                </li>
                                <li>
                                    Allergen awareness and handling procedures
                                </li>
                                <li>
                                    Emergency response and incident reporting
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold">
                                Continuous Improvement
                            </h2>
                            <p className="text-muted-foreground">
                                We are committed to ongoing enhancement of our
                                food safety programs through:
                            </p>
                            <ul className="ml-6 space-y-2 text-muted-foreground">
                                <li>Regular internal and external audits</li>
                                <li>
                                    Management review of food safety performance
                                </li>
                                <li>
                                    Investment in latest food safety
                                    technologies
                                </li>
                                <li>
                                    Participation in industry food safety
                                    initiatives
                                </li>
                                <li>Customer feedback integration</li>
                                <li>Regulatory compliance updates</li>
                            </ul>
                        </section>

                        <section className="space-y-4 rounded-lg border bg-primary/5 p-6">
                            <h2 className="text-2xl font-semibold">
                                Report a Food Safety Concern
                            </h2>
                            <p className="text-muted-foreground">
                                Your safety is our priority. If you have any
                                food safety concerns, please contact us
                                immediately:
                            </p>
                            <div className="space-y-1 text-muted-foreground">
                                <p>
                                    <strong>Food Safety Hotline:</strong> +971
                                    XX XXX XXXX (24/7)
                                </p>
                                <p>
                                    <strong>Email:</strong>{" "}
                                    foodsafety@synergyfoodtrading.com
                                </p>
                                <p>
                                    <strong>Quality Assurance Team:</strong>{" "}
                                    qa@synergyfoodtrading.com
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
