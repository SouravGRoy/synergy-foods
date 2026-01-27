"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function WholesalePage() {
    const [formData, setFormData] = useState({
        businessName: "",
        contactName: "",
        email: "",
        phone: "",
        businessType: "",
        location: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, this would send data to your API
        toast.success("Thank you! We'll contact you within 24 hours.");
        setFormData({
            businessName: "",
            contactName: "",
            email: "",
            phone: "",
            businessType: "",
            location: "",
            message: "",
        });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
                <div className="space-y-12">
                    {/* Header */}
                    <div className="space-y-4 text-center">
                        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                            Wholesale Inquiries
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            Partner with us for premium quality food products at
                            competitive wholesale prices. We supply to
                            restaurants, retailers, distributors, and businesses
                            worldwide.
                        </p>
                    </div>

                    {/* Benefits Section */}
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-3 rounded-lg border bg-card p-6 shadow-sm">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Check className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">
                                Competitive Pricing
                            </h3>
                            <p className="text-muted-foreground">
                                Volume-based discounts and flexible payment
                                terms for wholesale partners
                            </p>
                        </div>
                        <div className="space-y-3 rounded-lg border bg-card p-6 shadow-sm">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Check className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">
                                Quality Assurance
                            </h3>
                            <p className="text-muted-foreground">
                                All products meet international food safety
                                standards with full traceability
                            </p>
                        </div>
                        <div className="space-y-3 rounded-lg border bg-card p-6 shadow-sm">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Check className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">
                                Reliable Supply
                            </h3>
                            <p className="text-muted-foreground">
                                Consistent inventory, timely deliveries, and
                                dedicated account management
                            </p>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Left Column - Info */}
                        <div className="space-y-6">
                            <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                                <h2 className="text-2xl font-semibold">
                                    Why Choose Us?
                                </h2>
                                <ul className="space-y-3 text-muted-foreground">
                                    <li className="flex items-start gap-3">
                                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                        <span>
                                            <strong>Premium Quality:</strong>{" "}
                                            Certified organic and conventional
                                            products sourced from trusted
                                            suppliers
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                        <span>
                                            <strong>Wide Selection:</strong>{" "}
                                            Extensive range of rice, oils,
                                            pickles, spices, and specialty foods
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                        <span>
                                            <strong>Flexible MOQ:</strong>{" "}
                                            Minimum order quantities tailored to
                                            your business needs
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                        <span>
                                            <strong>Global Shipping:</strong>{" "}
                                            Efficient logistics and
                                            international delivery capabilities
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                        <span>
                                            <strong>Private Labeling:</strong>{" "}
                                            Custom packaging and branding
                                            options available
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                                <h2 className="text-2xl font-semibold">
                                    Who We Serve
                                </h2>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li>• Restaurants & Hotels</li>
                                    <li>• Retail Stores & Supermarkets</li>
                                    <li>• Food Distributors & Importers</li>
                                    <li>• Catering Companies</li>
                                    <li>• Online Retailers & E-commerce</li>
                                    <li>• Food Service Providers</li>
                                </ul>
                            </div>
                        </div>

                        {/* Right Column - Contact Form */}
                        <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-semibold">
                                    Get in Touch
                                </h2>
                                <p className="text-muted-foreground">
                                    Fill out the form below and our wholesale
                                    team will contact you within 24 hours.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="businessName">
                                        Business Name *
                                    </Label>
                                    <Input
                                        id="businessName"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your company name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contactName">
                                        Contact Name *
                                    </Label>
                                    <Input
                                        id="contactName"
                                        name="contactName"
                                        value={formData.contactName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your full name"
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">
                                            Phone Number *
                                        </Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="+971 XX XXX XXXX"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="businessType">
                                        Business Type *
                                    </Label>
                                    <Input
                                        id="businessType"
                                        name="businessType"
                                        value={formData.businessType}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., Restaurant, Retailer, Distributor"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Location *</Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                        placeholder="City, Country"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message *</Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        placeholder="Tell us about your business needs, estimated order volumes, and products of interest..."
                                        rows={5}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                >
                                    Submit Inquiry
                                </Button>

                                <p className="text-xs text-muted-foreground">
                                    By submitting this form, you agree to our
                                    Privacy Policy and consent to be contacted
                                    by our wholesale team.
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Additional Contact Info */}
                    <div className="space-y-4 rounded-lg border bg-primary/5 p-6 text-center">
                        <h2 className="text-2xl font-semibold">
                            Need Immediate Assistance?
                        </h2>
                        <p className="text-muted-foreground">
                            Our wholesale team is available to discuss your
                            specific requirements
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <div>
                                <strong>Phone:</strong> +971 XX XXX XXXX
                            </div>
                            <div>
                                <strong>Email:</strong>{" "}
                                wholesale@synergyfoodtrading.com
                            </div>
                            <div>
                                <strong>Hours:</strong> Sun-Thu, 9 AM - 6 PM UAE
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
