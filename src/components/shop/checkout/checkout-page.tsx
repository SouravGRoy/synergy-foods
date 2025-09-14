"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Price } from "@/components/ui/price";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function CheckoutPage() {
    const router = useRouter();
    const { items, subtotal } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [shippingMethod, setShippingMethod] = useState("standard");

    // Calculate totals
    const shippingCost =
        shippingMethod === "express" ? 1299 : subtotal >= 5000 ? 0 : 599;
    const tax = Math.round(subtotal * 0.085); // 8.5% tax
    const total = subtotal + shippingCost + tax;

    const [formData, setFormData] = useState({
        // Shipping Information
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "US",

        // Billing Information (same as shipping by default)
        sameAsShipping: true,
        billingFirstName: "",
        billingLastName: "",
        billingAddress1: "",
        billingAddress2: "",
        billingCity: "",
        billingState: "",
        billingZipCode: "",
        billingCountry: "US",

        // Order Notes
        orderNotes: "",
    });

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);

        try {
            // Here you would integrate with your payment processor
            // For now, we'll simulate the process
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Create order object
            const orderData = {
                items,
                subtotal,
                shippingCost,
                tax,
                total,
                shippingMethod,
                shippingAddress: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    address1: formData.address1,
                    address2: formData.address2,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                    country: formData.country,
                },
                billingAddress: formData.sameAsShipping
                    ? {
                          firstName: formData.firstName,
                          lastName: formData.lastName,
                          address1: formData.address1,
                          address2: formData.address2,
                          city: formData.city,
                          state: formData.state,
                          zipCode: formData.zipCode,
                          country: formData.country,
                      }
                    : {
                          firstName: formData.billingFirstName,
                          lastName: formData.billingLastName,
                          address1: formData.billingAddress1,
                          address2: formData.billingAddress2,
                          city: formData.billingCity,
                          state: formData.billingState,
                          zipCode: formData.billingZipCode,
                          country: formData.billingCountry,
                      },
                orderNotes: formData.orderNotes,
            };

            // TODO: Send to your order processing API
            console.log("Order data:", orderData);

            toast.success("Order placed successfully!");
            router.push("/order-confirmation?orderId=123456"); // Replace with actual order ID
        } catch (error) {
            toast.error("Failed to place order. Please try again.");
            console.error("Checkout error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <Icons.ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                    <h1 className="mb-2 text-2xl font-bold">
                        Your cart is empty
                    </h1>
                    <p className="mb-6 text-muted-foreground">
                        Add some items to proceed with checkout.
                    </p>
                    <Button asChild>
                        <a href="/shop">Continue Shopping</a>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Checkout</h1>
                <p className="mt-2 text-muted-foreground">
                    Complete your purchase
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Checkout Form */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="shipping" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="shipping">Shipping</TabsTrigger>
                            <TabsTrigger value="payment">Payment</TabsTrigger>
                            <TabsTrigger value="review">Review</TabsTrigger>
                        </TabsList>

                        <TabsContent value="shipping" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Shipping Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <Label htmlFor="firstName">
                                                First Name *
                                            </Label>
                                            <Input
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "firstName",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="lastName">
                                                Last Name *
                                            </Label>
                                            <Input
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "lastName",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <Label htmlFor="email">
                                                Email *
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">Phone</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "phone",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="address1">
                                            Address Line 1 *
                                        </Label>
                                        <Input
                                            id="address1"
                                            value={formData.address1}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "address1",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="address2">
                                            Address Line 2
                                        </Label>
                                        <Input
                                            id="address2"
                                            value={formData.address2}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "address2",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div>
                                            <Label htmlFor="city">City *</Label>
                                            <Input
                                                id="city"
                                                value={formData.city}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "city",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="state">
                                                State *
                                            </Label>
                                            <Input
                                                id="state"
                                                value={formData.state}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "state",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="zipCode">
                                                ZIP Code *
                                            </Label>
                                            <Input
                                                id="zipCode"
                                                value={formData.zipCode}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "zipCode",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Shipping Method</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup
                                        value={shippingMethod}
                                        onValueChange={setShippingMethod}
                                    >
                                        <div className="flex items-center justify-between rounded-lg border p-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="standard"
                                                    id="standard"
                                                />
                                                <Label htmlFor="standard">
                                                    <div>
                                                        <p className="font-medium">
                                                            Standard Shipping
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            5-7 business days
                                                        </p>
                                                    </div>
                                                </Label>
                                            </div>
                                            <span className="font-medium">
                                                {subtotal >= 5000
                                                    ? "Free"
                                                    : "$5.99"}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between rounded-lg border p-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="express"
                                                    id="express"
                                                />
                                                <Label htmlFor="express">
                                                    <div>
                                                        <p className="font-medium">
                                                            Express Shipping
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            2-3 business days
                                                        </p>
                                                    </div>
                                                </Label>
                                            </div>
                                            <span className="font-medium">
                                                $12.99
                                            </span>
                                        </div>
                                    </RadioGroup>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="payment" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment Method</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="rounded-lg border p-6 text-center">
                                            <Icons.CreditCard className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                            <h3 className="mb-2 text-lg font-semibold">
                                                Payment Integration Coming Soon
                                            </h3>
                                            <p className="text-muted-foreground">
                                                Stripe, PayPal, and other
                                                payment methods will be
                                                integrated here.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="review" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Notes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        placeholder="Special instructions for your order..."
                                        value={formData.orderNotes}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "orderNotes",
                                                e.target.value
                                            )
                                        }
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Place Order</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        onClick={handlePlaceOrder}
                                        disabled={isProcessing}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Icons.Loader className="mr-2 h-4 w-4 animate-spin" />
                                                Processing Order...
                                            </>
                                        ) : (
                                            <>
                                                <Icons.CreditCard className="mr-2 h-4 w-4" />
                                                Place Order -{" "}
                                                <Price value={total} />
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Order Items */}
                            <div className="space-y-3">
                                {items.map((item) => {
                                    const itemPrice =
                                        item.variant?.price ||
                                        item.product.price;
                                    return (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="relative h-12 w-12 rounded border">
                                                {/* You can add product image here */}
                                                <div className="h-full w-full rounded bg-muted" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="line-clamp-1 text-sm font-medium">
                                                    {item.product.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                            <Price
                                                value={
                                                    (itemPrice ?? 0) *
                                                    item.quantity
                                                }
                                                className="text-sm"
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            <Separator />

                            {/* Totals */}
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <Price value={subtotal} />
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    {shippingCost === 0 ? (
                                        <span className="text-green-600">
                                            Free
                                        </span>
                                    ) : (
                                        <Price value={shippingCost} />
                                    )}
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax</span>
                                    <Price value={tax} />
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total</span>
                                    <Price value={total} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
