"use client";

import { MediaSelectModal } from "@/components/globals/modals";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMediaItem } from "@/lib/react-query";
import { useBanner } from "@/lib/react-query/banner";
import { CreateBanner, createBannerSchema } from "@/lib/validations";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const LOCATION_OPTIONS: { value: string; label: string }[] = [
    { value: "homepage", label: "Homepage" },
    { value: "category", label: "Category Pages" },
    { value: "product", label: "Product Pages" },
    { value: "shop", label: "Shop Page" },
    { value: "search", label: "Search Results" },
    { value: "cart", label: "Cart Page" },
    { value: "checkout", label: "Checkout Page" },
    { value: "custom", label: "Custom Location" },
];
export function QuickBannerCreate() {
    const [isCreating, setIsCreating] = useState(false);
    const { useCreate } = useBanner();
    const createMutation = useCreate();
    const { userId } = useAuth();

    const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
    const { useScan: useMediaItemScan } = useMediaItem();
    const { data: mediaRaw, error: mediaError } = useMediaItemScan({});

    // Memoize filtered media to prevent unnecessary re-renders
    const media = useMemo(
        () => mediaRaw?.filter((m) => m.type.includes("image")) || [],
        [mediaRaw]
    );

    const form = useForm<CreateBanner>({
        resolver: zodResolver(createBannerSchema),
        defaultValues: {
            title: "",
            description: "",
            url: "",
            location: "",
            imageUrl: null,
        },
    });

    function onSubmit(values: CreateBanner) {
        setIsCreating(true);

        // Validate userId exists
        if (!userId) {
            form.setError("root", {
                message: "User authentication required",
            });
            setIsCreating(false);
            return;
        }

        // Ensure imageUrl is a string
        if (!values.imageUrl || typeof values.imageUrl !== "string") {
            form.setError("imageUrl", {
                message: "Please provide a valid image URL",
            });
            setIsCreating(false);
            return;
        }

        createMutation.mutate(
            { ...values, imageUrl: values.imageUrl as string },
            {
                onSettled: () => setIsCreating(false),
            }
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Create Quick Banner</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            {/* Title */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Banner title"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter banner description"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Location + URL */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location *</FormLabel>
                                            <Select
                                                value={field.value ?? ""}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select location" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {LOCATION_OPTIONS.map(
                                                        (option) => (
                                                            <SelectItem
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
                                                            >
                                                                {option.label}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Link URL</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://example.com"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <FormLabel>Banner Image *</FormLabel>
                                {mediaError && (
                                    <p className="text-sm text-red-600">
                                        Error loading media:{" "}
                                        {mediaError.message}
                                    </p>
                                )}
                                {form.watch("imageUrl") ? (
                                    <div className="relative">
                                        <div className="relative h-32 w-full overflow-hidden rounded-lg">
                                            <Image
                                                src={form.watch("imageUrl")!}
                                                alt="Banner preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() =>
                                                form.setValue("imageUrl", null)
                                            }
                                        >
                                            Change Image
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex min-h-40 items-center justify-center rounded-md border border-dashed border-foreground/40 p-5">
                                        <Button
                                            type="button"
                                            size="sm"
                                            className="text-xs"
                                            onClick={() =>
                                                setIsMediaSelectorOpen(true)
                                            }
                                        >
                                            <Icons.CloudUpload />
                                            Upload Media
                                        </Button>
                                    </div>
                                )}
                                {form.formState.errors.imageUrl && (
                                    <p className="text-sm text-red-600">
                                        {form.formState.errors.imageUrl.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={
                                    isCreating || createMutation.isPending
                                }
                                className="w-full"
                            >
                                {isCreating || createMutation.isPending
                                    ? "Creating..."
                                    : "Create Banner"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <MediaSelectModal
                data={media}
                selected={[]}
                uploaderId={userId || ""}
                isOpen={isMediaSelectorOpen}
                setIsOpen={setIsMediaSelectorOpen}
                accept="image/*"
                multiple={false}
                onSelectionComplete={(items) => {
                    if (items && items.length > 0 && items[0]) {
                        form.setValue("imageUrl", items[0].url, {
                            shouldDirty: true,
                        });
                    }
                }}
            />
        </>
    );
}
