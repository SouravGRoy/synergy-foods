"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Clock, Truck, Zap } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ShippingData } from "../enhanced-checkout-page";

const shippingSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    address1: z.string().min(1, "Address is required"),
    address2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(5, "Valid postal code is required"),
    country: z.string().min(1, "Country is required"),
    shippingMethod: z.enum(["standard", "express", "overnight"]),
});

interface ShippingStepProps {
    data: Partial<ShippingData>;
    onComplete: (data: ShippingData) => void;
    onBack: () => void;
}

export function ShippingStep({ data, onComplete, onBack }: ShippingStepProps) {
    const [shippingMethod, setShippingMethod] = useState(
        data.shippingMethod || "standard"
    );

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        watch,
    } = useForm<ShippingData>({
        resolver: zodResolver(shippingSchema),
        defaultValues: {
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            phone: data.phone || "",
            address1: data.address1 || "",
            address2: data.address2 || "",
            city: data.city || "",
            state: data.state || "",
            postalCode: data.postalCode || "",
            country: data.country || "United States",
            shippingMethod: shippingMethod,
        },
        mode: "onChange",
    });

    const onSubmit = (formData: ShippingData) => {
        onComplete({ ...formData, shippingMethod });
    };

    const shippingOptions = [
        {
            id: "standard",
            name: "Standard Shipping",
            description: "5-7 business days",
            price: "Free on orders over $50",
            icon: Truck,
        },
        {
            id: "express",
            name: "Express Shipping",
            description: "2-3 business days",
            price: "$12.99",
            icon: Zap,
        },
        {
            id: "overnight",
            name: "Overnight Shipping",
            description: "Next business day",
            price: "$29.99",
            icon: Clock,
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="h-auto p-1"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    Shipping Information
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    {...register("firstName")}
                                    className={
                                        errors.firstName ? "border-red-500" : ""
                                    }
                                />
                                {errors.firstName && (
                                    <p className="text-sm text-red-500">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    {...register("lastName")}
                                    className={
                                        errors.lastName ? "border-red-500" : ""
                                    }
                                />
                                {errors.lastName && (
                                    <p className="text-sm text-red-500">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    className={
                                        errors.email ? "border-red-500" : ""
                                    }
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    {...register("phone")}
                                    className={
                                        errors.phone ? "border-red-500" : ""
                                    }
                                />
                                {errors.phone && (
                                    <p className="text-sm text-red-500">
                                        {errors.phone.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Shipping Address */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                            Shipping Address
                        </h3>
                        <div className="space-y-2">
                            <Label htmlFor="address1">Address Line 1</Label>
                            <Input
                                id="address1"
                                {...register("address1")}
                                className={
                                    errors.address1 ? "border-red-500" : ""
                                }
                            />
                            {errors.address1 && (
                                <p className="text-sm text-red-500">
                                    {errors.address1.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address2">
                                Address Line 2 (Optional)
                            </Label>
                            <Input id="address2" {...register("address2")} />
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    {...register("city")}
                                    className={
                                        errors.city ? "border-red-500" : ""
                                    }
                                />
                                {errors.city && (
                                    <p className="text-sm text-red-500">
                                        {errors.city.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input
                                    id="state"
                                    {...register("state")}
                                    className={
                                        errors.state ? "border-red-500" : ""
                                    }
                                />
                                {errors.state && (
                                    <p className="text-sm text-red-500">
                                        {errors.state.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="postalCode">Postal Code</Label>
                                <Input
                                    id="postalCode"
                                    {...register("postalCode")}
                                    className={
                                        errors.postalCode
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                                {errors.postalCode && (
                                    <p className="text-sm text-red-500">
                                        {errors.postalCode.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                {...register("country")}
                                className={
                                    errors.country ? "border-red-500" : ""
                                }
                            />
                            {errors.country && (
                                <p className="text-sm text-red-500">
                                    {errors.country.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Shipping Method */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                            Shipping Method
                        </h3>
                        <RadioGroup
                            value={shippingMethod}
                            onValueChange={(value) => {
                                setShippingMethod(
                                    value as
                                        | "standard"
                                        | "express"
                                        | "overnight"
                                );
                                setValue(
                                    "shippingMethod",
                                    value as
                                        | "standard"
                                        | "express"
                                        | "overnight"
                                );
                            }}
                            className="space-y-4"
                        >
                            {shippingOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                    <div
                                        key={option.id}
                                        className="flex items-center space-x-3 rounded-lg border p-4"
                                    >
                                        <RadioGroupItem
                                            value={option.id}
                                            id={option.id}
                                        />
                                        <Icon className="h-5 w-5 text-muted-foreground" />
                                        <div className="flex-1">
                                            <Label
                                                htmlFor={option.id}
                                                className="cursor-pointer text-base font-medium"
                                            >
                                                {option.name}
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                {option.description}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">
                                                {option.price}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </RadioGroup>
                    </div>

                    <div className="flex justify-end pt-6">
                        <Button
                            type="submit"
                            size="lg"
                            disabled={!isValid}
                            className="min-w-[200px]"
                        >
                            Continue to Payment
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
