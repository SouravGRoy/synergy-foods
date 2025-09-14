import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, XCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutCancelPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <XCircle className="mx-auto h-16 w-16 text-red-500" />
                    <h1 className="mt-4 text-3xl font-bold text-gray-900">
                        Payment Cancelled
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Your payment was cancelled. No charges have been made to
                        your account.
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    {/* Information Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <XCircle className="h-5 w-5 text-red-500" />
                                Payment Not Completed
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-600">
                                Your order has not been placed and no payment
                                has been processed. Your cart items are still
                                saved and waiting for you.
                            </p>

                            <div className="rounded-lg bg-blue-50 p-4">
                                <h3 className="font-medium text-blue-900">
                                    Why might this have happened?
                                </h3>
                                <ul className="mt-2 space-y-1 text-sm text-blue-800">
                                    <li>
                                        • You clicked the back button during
                                        payment
                                    </li>
                                    <li>
                                        • The payment process was interrupted
                                    </li>
                                    <li>
                                        • You decided not to complete the
                                        purchase
                                    </li>
                                    <li>
                                        • There was a technical issue with the
                                        payment
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button asChild className="flex-1">
                            <Link href="/checkout">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Return to Checkout
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="flex-1">
                            <Link href="/cart">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                View Cart
                            </Link>
                        </Button>
                    </div>

                    <div className="text-center">
                        <Button variant="link" asChild>
                            <Link href="/shop">Continue Shopping</Link>
                        </Button>
                    </div>

                    {/* Support Information */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <h3 className="font-medium text-gray-900">
                                    Need Assistance?
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    If you encountered an error or need help
                                    with your order, our support team is here to
                                    help.
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
