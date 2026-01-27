import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Frequently Asked Questions",
    description:
        "Find answers to common questions about our products and services",
};

const faqs = [
    {
        category: "Orders & Payment",
        questions: [
            {
                q: "How do I place an order?",
                a: "Simply browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or sign in, provide shipping information, and complete payment. You'll receive an order confirmation email once your order is placed.",
            },
            {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and other secure payment methods. All transactions are encrypted and processed securely through our payment gateway.",
            },
            {
                q: "Can I modify or cancel my order?",
                a: "You can modify or cancel your order within 1 hour of placing it by contacting our customer support. Once your order is being prepared or shipped, changes may not be possible.",
            },
            {
                q: "Do you offer bulk or wholesale pricing?",
                a: "Yes! We offer special pricing for bulk orders and wholesale customers. Please visit our Wholesale Inquiries page or contact our sales team for more information.",
            },
        ],
    },
    {
        category: "Shipping & Delivery",
        questions: [
            {
                q: "What are your shipping options?",
                a: "We offer standard shipping (5-7 business days) and express shipping (2-3 business days) within the UAE. International shipping is available for select products with delivery times varying by location.",
            },
            {
                q: "How can I track my order?",
                a: "Once your order ships, you'll receive a tracking number via email. You can also track your order status by logging into your account and viewing order history.",
            },
            {
                q: "Do you ship internationally?",
                a: "Yes, we ship to select international destinations. Shipping costs and delivery times vary by location. Please note that customs fees and import duties may apply and are the responsibility of the customer.",
            },
            {
                q: "What if my order is damaged or incorrect?",
                a: "If you receive a damaged or incorrect item, please contact us within 48 hours of delivery with photos. We'll arrange for a replacement or refund immediately.",
            },
        ],
    },
    {
        category: "Products & Quality",
        questions: [
            {
                q: "Are your products organic?",
                a: "Many of our products are certified organic. Look for the organic certification badge on product pages. We source from certified suppliers and maintain strict quality standards for all our products.",
            },
            {
                q: "How do you ensure food safety?",
                a: "We follow stringent food safety protocols including temperature-controlled storage, regular quality testing, HACCP compliance, and ISO 22000 certification. Visit our Food Safety Policy page for detailed information.",
            },
            {
                q: "What is the shelf life of your products?",
                a: "Shelf life varies by product and is clearly indicated on each item's packaging. We ensure all products have adequate shelf life remaining when shipped. Typically, dry goods have 6-12 months, while perishables are shipped fresh.",
            },
            {
                q: "Do you offer product samples?",
                a: "For wholesale customers, we can provide samples upon request. Please contact our sales team to discuss sample availability for specific products.",
            },
        ],
    },
    {
        category: "Returns & Refunds",
        questions: [
            {
                q: "What is your return policy?",
                a: "Non-perishable items can be returned within 14 days of delivery if unopened and in original packaging. Perishable food items cannot be returned unless defective or damaged. Refunds are processed within 7-10 business days.",
            },
            {
                q: "How do I initiate a return?",
                a: "Log into your account, go to Order History, select the order, and click 'Request Return'. Follow the instructions to complete the return request. Our team will review and approve eligible returns within 24 hours.",
            },
            {
                q: "Who pays for return shipping?",
                a: "For defective or incorrect items, we cover return shipping costs. For other returns (change of mind, etc.), return shipping is the customer's responsibility.",
            },
            {
                q: "When will I receive my refund?",
                a: "Refunds are processed within 7-10 business days after we receive and inspect the returned item. The refund will be credited to your original payment method.",
            },
        ],
    },
    {
        category: "Account & Support",
        questions: [
            {
                q: "How do I create an account?",
                a: "Click 'Sign Up' at the top of any page, enter your email and create a password. You can also sign up using your Google or social media accounts for faster registration.",
            },
            {
                q: "I forgot my password. What should I do?",
                a: "Click 'Forgot Password' on the login page, enter your email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password.",
            },
            {
                q: "How can I contact customer support?",
                a: "You can reach us via email at support@synergyfoodtrading.com, call our hotline at +971 XX XXX XXXX (9 AM - 6 PM UAE time), or use the live chat feature on our website.",
            },
            {
                q: "Do you have a loyalty or rewards program?",
                a: "Yes! We offer a rewards program where you earn points on every purchase. Points can be redeemed for discounts on future orders. Sign up for our newsletter to stay informed about exclusive offers.",
            },
        ],
    },
];

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="space-y-4 text-center">
                        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Find answers to common questions about our products,
                            orders, and services
                        </p>
                    </div>

                    {/* FAQ Categories */}
                    <div className="space-y-8">
                        {faqs.map((category, categoryIndex) => (
                            <div
                                key={categoryIndex}
                                className="space-y-4 rounded-lg border bg-card p-6 shadow-sm"
                            >
                                <h2 className="text-2xl font-semibold">
                                    {category.category}
                                </h2>
                                <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full"
                                >
                                    {category.questions.map((faq, faqIndex) => (
                                        <AccordionItem
                                            key={faqIndex}
                                            value={`item-${categoryIndex}-${faqIndex}`}
                                        >
                                            <AccordionTrigger className="text-left">
                                                {faq.q}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground">
                                                {faq.a}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        ))}
                    </div>

                    {/* Contact Section */}
                    <div className="space-y-4 rounded-lg border bg-primary/5 p-6">
                        <h2 className="text-2xl font-semibold">
                            Still have questions?
                        </h2>
                        <p className="text-muted-foreground">
                            Can't find the answer you're looking for? Our
                            customer support team is here to help.
                        </p>
                        <div className="space-y-2 text-muted-foreground">
                            <p>
                                <strong>Email:</strong>{" "}
                                support@synergyfoodtrading.com
                            </p>
                            <p>
                                <strong>Phone:</strong> +971 XX XXX XXXX (9 AM -
                                6 PM UAE time)
                            </p>
                            <p>
                                <strong>Live Chat:</strong> Available on our
                                website during business hours
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
