"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <section className="px-4 py-16 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-4 text-4xl font-bold"
                >
                    Get in Touch
                </motion.h1>
                <p className="mx-auto max-w-2xl text-lg text-gray-600">
                    Have questions or want to collaborate? Reach out via the
                    form or the details below, and we’ll get back to you
                    shortly.
                </p>
            </section>

            {/* Contact Info Cards */}
            <section className="mx-auto mb-12 grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-3">
                {[
                    {
                        icon: Mail,
                        title: "Email",
                        detail: "support@example.com",
                    },
                    { icon: Phone, title: "Phone", detail: "+91 98765 43210" },
                    {
                        icon: MapPin,
                        title: "Address",
                        detail: "123, Park Street, Siliguri",
                    },
                ].map((info, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.2 }}
                        viewport={{ once: true }}
                    >
                        <Card className="rounded-2xl p-6 shadow-sm transition hover:shadow-md">
                            <CardContent className="flex flex-col items-center gap-3 text-center">
                                <info.icon className="h-8 w-8 text-blue-600" />
                                <h3 className="text-lg font-semibold">
                                    {info.title}
                                </h3>
                                <p className="text-gray-600">{info.detail}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </section>

            {/* Contact Form */}
            <section className="mx-auto max-w-3xl px-6 pb-16">
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="space-y-6 rounded-2xl bg-white p-8 shadow-sm"
                >
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Name
                        </label>
                        <Input placeholder="Enter your name" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Email
                        </label>
                        <Input type="email" placeholder="Enter your email" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Message
                        </label>
                        <Textarea
                            placeholder="Write your message here..."
                            rows={5}
                        />
                    </div>
                    <Button className="w-full">Send Message</Button>
                </motion.form>
            </section>
        </div>
    );
}
