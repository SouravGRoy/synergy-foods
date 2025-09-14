"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FullProduct } from "@/lib/validations";
import {
    CheckCircle,
    Clock,
    FileText,
    Package,
    Settings,
    Shield,
    Star,
    Truck,
    XCircle,
} from "lucide-react";

interface ProductTabsProps {
    product: FullProduct;
}

export function ProductTabs({ product }: ProductTabsProps) {
    return (
        <div className="w-full">
            <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid h-14 w-full grid-cols-4 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 p-1 shadow-sm">
                    <TabsTrigger
                        value="description"
                        className="flex items-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition-all duration-200 hover:text-slate-800 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md"
                    >
                        <FileText className="h-4 w-4" />
                        Description
                    </TabsTrigger>
                    <TabsTrigger
                        value="specifications"
                        className="flex items-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition-all duration-200 hover:text-slate-800 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md"
                    >
                        <Settings className="h-4 w-4" />
                        Specs
                    </TabsTrigger>
                    <TabsTrigger
                        value="reviews"
                        className="flex items-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition-all duration-200 hover:text-slate-800 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md"
                    >
                        <Star className="h-4 w-4" />
                        Reviews
                    </TabsTrigger>
                    <TabsTrigger
                        value="shipping"
                        className="flex items-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition-all duration-200 hover:text-slate-800 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md"
                    >
                        <Truck className="h-4 w-4" />
                        Shipping
                    </TabsTrigger>
                </TabsList>

                {/* Description Tab */}
                <TabsContent
                    value="description"
                    className="mt-8 focus:outline-none"
                >
                    <Card className="border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg">
                        <CardContent className="p-8">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="rounded-lg bg-blue-100 p-2">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    Product Description
                                </h3>
                            </div>
                            <div className="space-y-4">
                                {product.description ? (
                                    <div
                                        className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-strong:text-slate-900 prose-ol:text-slate-700 prose-ul:text-slate-700 prose-li:text-slate-700"
                                        dangerouslySetInnerHTML={{
                                            __html: product.description,
                                        }}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="mb-4 rounded-full bg-slate-100 p-4">
                                            <FileText className="h-8 w-8 text-slate-400" />
                                        </div>
                                        <p className="text-lg font-medium text-slate-500">
                                            No description available
                                        </p>
                                        <p className="mt-1 text-sm text-slate-400">
                                            Product details will be added soon
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Specifications Tab */}
                <TabsContent
                    value="specifications"
                    className="mt-8 focus:outline-none"
                >
                    <Card className="border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg">
                        <CardContent className="p-8">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="rounded-lg bg-green-100 p-2">
                                    <Settings className="h-5 w-5 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    Product Specifications
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between rounded-lg border bg-slate-50 p-4">
                                        <span className="font-medium text-slate-700">
                                            SKU
                                        </span>
                                        <span className="font-mono text-sm font-semibold text-slate-900">
                                            {product.sku || "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border bg-slate-50 p-4">
                                        <span className="font-medium text-slate-700">
                                            Category
                                        </span>
                                        <span className="font-semibold text-slate-900">
                                            {product.category?.name || "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border bg-slate-50 p-4">
                                        <span className="font-medium text-slate-700">
                                            Subcategory
                                        </span>
                                        <span className="font-semibold text-slate-900">
                                            {product.subcategory?.name || "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border bg-slate-50 p-4">
                                        <span className="font-medium text-slate-700">
                                            Product Type
                                        </span>
                                        <span className="font-semibold text-slate-900">
                                            {product.productType?.name || "N/A"}
                                        </span>
                                    </div>
                                    {product.length && (
                                        <div className="flex items-center justify-between rounded-lg border bg-slate-50 p-4">
                                            <span className="font-medium text-slate-700">
                                                Length
                                            </span>
                                            <span className="font-semibold text-slate-900">
                                                {product.length} units
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between rounded-lg border bg-slate-50 p-4">
                                        <span className="font-medium text-slate-700">
                                            Availability
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {product.isAvailable ? (
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-500" />
                                            )}
                                            <span
                                                className={`rounded-full px-3 py-1 text-sm font-medium ${
                                                    product.isAvailable
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {product.isAvailable
                                                    ? "In Stock"
                                                    : "Out of Stock"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border bg-slate-50 p-4">
                                        <span className="font-medium text-slate-700">
                                            Status
                                        </span>
                                        <span
                                            className={`rounded-full px-3 py-1 text-sm font-medium ${
                                                product.isActive
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-slate-100 text-slate-800"
                                            }`}
                                        >
                                            {product.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border bg-slate-50 p-4">
                                        <span className="font-medium text-slate-700">
                                            Created
                                        </span>
                                        <span className="font-medium text-slate-900">
                                            {new Date(
                                                product.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Product Options */}
                            {product.options && product.options.length > 0 && (
                                <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-6">
                                    <h4 className="mb-4 text-lg font-semibold text-blue-900">
                                        Available Options
                                    </h4>
                                    <div className="space-y-4">
                                        {product.options.map((option) => (
                                            <div
                                                key={option.id}
                                                className="space-y-2"
                                            >
                                                <p className="font-medium text-blue-800">
                                                    {option.name}:
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {option.values.map(
                                                        (value) => (
                                                            <span
                                                                key={value.id}
                                                                className="rounded-lg border border-blue-200 bg-white px-3 py-1 text-sm font-medium text-blue-700"
                                                            >
                                                                {value.name}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent
                    value="reviews"
                    className="mt-8 focus:outline-none"
                >
                    <Card className="border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg">
                        <CardContent className="p-8">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="rounded-lg bg-yellow-100 p-2">
                                    <Star className="h-5 w-5 text-yellow-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    Customer Reviews
                                </h3>
                            </div>
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="mb-6 rounded-full bg-slate-100 p-6">
                                    <Star className="h-12 w-12 text-slate-400" />
                                </div>
                                <h4 className="mb-2 text-xl font-semibold text-slate-700">
                                    No reviews yet
                                </h4>
                                <p className="mb-6 max-w-md text-base text-slate-500">
                                    Be the first to review this product and help
                                    other customers make informed decisions.
                                </p>
                                <button className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-md transition-colors duration-200 hover:bg-blue-700 hover:shadow-lg">
                                    Write a Review
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Shipping Tab */}
                <TabsContent
                    value="shipping"
                    className="mt-8 focus:outline-none"
                >
                    <Card className="border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg">
                        <CardContent className="p-8">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="rounded-lg bg-purple-100 p-2">
                                    <Truck className="h-5 w-5 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    Shipping Information
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                {/* Left Column - Shipping Options */}
                                <div className="space-y-6">
                                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-6">
                                        <div className="mb-4 flex items-center gap-3">
                                            <Package className="h-5 w-5 text-blue-600" />
                                            <h4 className="font-semibold text-blue-900">
                                                Standard Shipping
                                            </h4>
                                        </div>
                                        <p className="mb-2 font-medium text-blue-700">
                                            Free shipping on orders over $50
                                        </p>
                                        <p className="text-sm text-blue-600">
                                            Delivery: 5-7 business days
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-green-100 bg-green-50 p-6">
                                        <div className="mb-4 flex items-center gap-3">
                                            <Clock className="h-5 w-5 text-green-600" />
                                            <h4 className="font-semibold text-green-900">
                                                Express Shipping
                                            </h4>
                                        </div>
                                        <p className="mb-2 font-medium text-green-700">
                                            $12.99 flat rate
                                        </p>
                                        <p className="text-sm text-green-600">
                                            Delivery: 2-3 business days
                                        </p>
                                    </div>
                                </div>

                                {/* Right Column - Policies */}
                                <div className="space-y-6">
                                    <div className="rounded-xl border border-orange-100 bg-orange-50 p-6">
                                        <div className="mb-4 flex items-center gap-3">
                                            <Shield className="h-5 w-5 text-orange-600" />
                                            <h4 className="font-semibold text-orange-900">
                                                Return Policy
                                            </h4>
                                        </div>
                                        <p className="mb-2 font-medium text-orange-700">
                                            30-day return policy
                                        </p>
                                        <p className="mb-2 text-sm text-orange-600">
                                            Items must be in original condition
                                        </p>
                                        <p className="text-sm text-orange-600">
                                            Free returns for defective items
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                                        <h4 className="mb-3 font-semibold text-slate-900">
                                            Important Notes
                                        </h4>
                                        <ul className="space-y-2 text-sm text-slate-600">
                                            <li className="flex items-start gap-2">
                                                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400"></span>
                                                Available for domestic shipping
                                                only
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400"></span>
                                                Remote areas may have extended
                                                delivery times
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400"></span>
                                                Large items require special
                                                delivery arrangements
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
