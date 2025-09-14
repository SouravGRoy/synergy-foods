import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Mail, Package, Truck } from "lucide-react";
import Link from "next/link";

interface CheckoutSuccessPageProps {
    searchParams: Promise<{
        session_id?: string;
    }>;
}

export default async function CheckoutSuccessPage({
    searchParams,
}: CheckoutSuccessPageProps) {
    const { session_id: sessionId } = await searchParams;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                    <h1 className="mt-4 text-3xl font-bold text-gray-900">
                        Payment Successful!
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Thank you for your order. Your payment has been
                        processed successfully.
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    {/* Order Confirmation */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Order Confirmed
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <h3 className="font-medium text-gray-900">
                                        Order Number
                                    </h3>
                                    <p className="text-gray-600">
                                        {sessionId
                                            ? `#${sessionId.slice(-8).toUpperCase()}`
                                            : "Processing..."}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">
                                        Estimated Delivery
                                    </h3>
                                    <p className="text-gray-600">
                                        3-5 business days
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* What Happens Next */}
                    <Card>
                        <CardHeader>
                            <CardTitle>What happens next?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="mt-1 h-5 w-5 text-blue-500" />
                                    <div>
                                        <h4 className="font-medium">
                                            Order Confirmation Email
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            We've sent a confirmation email with
                                            your order details and receipt.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Package className="mt-1 h-5 w-5 text-orange-500" />
                                    <div>
                                        <h4 className="font-medium">
                                            Order Processing
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Your order will be processed and
                                            prepared for shipping within 1-2
                                            business days.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Truck className="mt-1 h-5 w-5 text-green-500" />
                                    <div>
                                        <h4 className="font-medium">
                                            Shipping & Delivery
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Once shipped, you'll receive a
                                            tracking number to monitor your
                                            delivery progress.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button asChild className="flex-1">
                            <Link href="/account?tab=orders">
                                View Order Details
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="flex-1">
                            <Link href="/shop">Continue Shopping</Link>
                        </Button>
                    </div>

                    {/* Support Information */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <h3 className="font-medium text-gray-900">
                                    Need Help?
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    If you have any questions about your order,
                                    please contact our support team.
                                </p>
                                <Button variant="link" className="mt-2">
                                    Contact Support
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
