"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { Metadata } from "next";
import { useState } from "react";
import { toast } from "sonner";

export default function SupportPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Thank you! We'll respond within 24 hours.");
        setFormData({
            name: "",
            email: "",
            subject: "",
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
                            Customer Support
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            We're here to help! Reach out to us and we'll
                            respond as soon as possible.
                        </p>
                    </div>

                    {/* Contact Methods */}
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-3 rounded-lg border bg-card p-6 text-center shadow-sm">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Phone className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">Call Us</h3>
                            <p className="text-muted-foreground">
                                Mon-Fri: 9 AM - 6 PM UAE
                            </p>
                            <p className="font-semibold">+971 XX XXX XXXX</p>
                        </div>

                        <div className="space-y-3 rounded-lg border bg-card p-6 text-center shadow-sm">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Mail className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">Email Us</h3>
                            <p className="text-muted-foreground">
                                We'll respond within 24 hours
                            </p>
                            <p className="font-semibold">
                                support@synergyfoodtrading.com
                            </p>
                        </div>

                        <div className="space-y-3 rounded-lg border bg-card p-6 text-center shadow-sm">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <MessageSquare className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">Live Chat</h3>
                            <p className="text-muted-foreground">
                                Available during business hours
                            </p>
                            <Button variant="outline" className="mt-2">
                                Start Chat
                            </Button>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="grid gap-8 lg:grid-cols-2">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-semibold">
                                    Send us a message
                                </h2>
                                <p className="text-muted-foreground">
                                    Fill out the form and our team will get back
                                    to you within 24 hours.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your full name"
                                    />
                                </div>

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
                                    <Label htmlFor="subject">Subject *</Label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="How can we help?"
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
                                        placeholder="Tell us more about your inquiry..."
                                        rows={6}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                >
                                    Send Message
                                </Button>
                            </form>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                                <h3 className="text-xl font-semibold">
                                    Quick Help
                                </h3>
                                <div className="space-y-3 text-sm text-muted-foreground">
                                    <div>
                                        <h4 className="mb-1 font-semibold text-foreground">
                                            Order Issues
                                        </h4>
                                        <p>
                                            Track your order, modify delivery,
                                            or report problems with your
                                            purchase.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="mb-1 font-semibold text-foreground">
                                            Product Questions
                                        </h4>
                                        <p>
                                            Get information about ingredients,
                                            certifications, or product
                                            availability.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="mb-1 font-semibold text-foreground">
                                            Returns & Refunds
                                        </h4>
                                        <p>
                                            Learn about our return policy and
                                            how to initiate a return.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="mb-1 font-semibold text-foreground">
                                            Account Help
                                        </h4>
                                        <p>
                                            Password reset, account settings, or
                                            billing information.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                                <h3 className="text-xl font-semibold">FAQs</h3>
                                <p className="text-sm text-muted-foreground">
                                    Find quick answers to common questions in
                                    our FAQ section.
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    asChild
                                >
                                    <a href="/faq">View FAQs</a>
                                </Button>
                            </div>

                            <div className="space-y-4 rounded-lg border bg-primary/5 p-6">
                                <h3 className="text-xl font-semibold">
                                    Business Hours
                                </h3>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex justify-between">
                                        <span>Sunday - Thursday</span>
                                        <span className="font-semibold">
                                            9:00 AM - 6:00 PM
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Friday - Saturday</span>
                                        <span className="font-semibold">
                                            Closed
                                        </span>
                                    </div>
                                    <p className="mt-3 text-xs">
                                        All times are in UAE (GMT+4) timezone
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
