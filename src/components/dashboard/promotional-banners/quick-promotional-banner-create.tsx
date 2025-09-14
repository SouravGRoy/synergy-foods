"use client";

import { MediaSelectModal } from "@/components/globals/modals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { useMediaItem, usePromotionalBanner } from "@/lib/react-query";
import {
    CreatePromotionalBanner,
    createPromotionalBannerSchema,
    VALID_LOCATIONS,
} from "@/lib/validations/promotional-banner";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";

const BANNER_TYPES = [
    {
        value: "carousel",
        label: "Carousel (Legacy)",
        description: "Traditional banner carousel",
    },
    {
        value: "type1",
        label: "Type 1 - Three Images",
        description: "Three images side-by-side",
    },
    {
        value: "type2",
        label: "Type 2 - Large Image",
        description: "One large image with Shop Now button",
    },
    {
        value: "type3",
        label: "Type 3 - Stacked Images",
        description: "Two images stacked vertically",
    },
    {
        value: "type4",
        label: "Type 4 - Single Image",
        description: "One image with Discover More button",
    },
];

const getRequiredMediaCount = (type: string) => {
    switch (type) {
        case "type1":
            return 3;
        case "type2":
            return 1;
        case "type3":
            return 2;
        case "type4":
            return 1;
        default:
            return 0; // carousel can have any number
    }
};

const getDefaultCtaLabel = (type: string) => {
    switch (type) {
        case "type2":
            return "Shop Now";
        case "type4":
            return "Discover More";
        default:
            return "";
    }
};

const requiresCta = (type: string) => {
    return type === "type2" || type === "type4";
};

export default function QuickPromotionalBannerCreate() {
    const { user } = useUser();
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(
        null
    );
    const { useCreate } = usePromotionalBanner();
    const createMutation = useCreate();

    // Load media items for the modal
    const { useScan: useMediaItemScan } = useMediaItem();
    const { data: mediaRaw, error: mediaError } = useMediaItemScan({});

    // Memoize filtered media to prevent unnecessary re-renders
    const media = useMemo(
        () => mediaRaw?.filter((m) => m.type.includes("image")) || [],
        [mediaRaw]
    );

    const form: UseFormReturn<CreatePromotionalBanner> =
        useForm<CreatePromotionalBanner>({
            resolver: zodResolver(createPromotionalBannerSchema),
            mode: "onChange",
            defaultValues: {
                title: "",
                description: "",
                type: "carousel",
                media: [],
                ctaLabel: "",
                ctaLink: "",
                location: undefined,
                isActive: true,
                order: 0,
            },
        });

    const watchedType = form.watch("type");
    const watchedMedia = form.watch("media");
    const requiredMediaCount = getRequiredMediaCount(watchedType);
    const showCtaFields = requiresCta(watchedType);

    // Auto-set default CTA label when type changes
    const handleTypeChange = (type: string) => {
        form.setValue("type", type as any);
        if (requiresCta(type)) {
            const currentCtaLabel = form.getValues("ctaLabel");
            if (!currentCtaLabel) {
                form.setValue("ctaLabel", getDefaultCtaLabel(type));
            }
        } else {
            form.setValue("ctaLabel", "");
            form.setValue("ctaLink", "");
        }

        // Reset media array based on requirements
        const newRequiredCount = getRequiredMediaCount(type);
        const currentMedia = form.getValues("media");

        if (newRequiredCount > 0) {
            const newMedia = Array(newRequiredCount)
                .fill(null)
                .map(
                    (_, index) =>
                        currentMedia[index] || { url: "", altText: "" }
                );
            form.setValue("media", newMedia);
            console.log(`Set media array for ${type}:`, newMedia);
        } else {
            // For carousel, keep existing media or start with empty array
            if (currentMedia.length === 0) {
                form.setValue("media", []);
            }
        }
    };

    const handleMediaSelect = (url: string) => {
        if (selectedMediaIndex !== null) {
            const currentMedia = [...watchedMedia];

            // Ensure we have enough slots for the required media count
            while (currentMedia.length <= selectedMediaIndex) {
                currentMedia.push({ url: "", altText: "" });
            }

            currentMedia[selectedMediaIndex] = {
                url,
                altText: currentMedia[selectedMediaIndex]?.altText || "",
            };
            form.setValue("media", currentMedia);
            console.log("Updated media array:", currentMedia);
        }
        setShowMediaModal(false);
        setSelectedMediaIndex(null);
    };

    const addMediaSlot = () => {
        const currentMedia = [...watchedMedia];
        currentMedia.push({ url: "", altText: "" });
        form.setValue("media", currentMedia);
    };

    const removeMediaSlot = (index: number) => {
        const currentMedia = [...watchedMedia];
        currentMedia.splice(index, 1);
        form.setValue("media", currentMedia);
    };

    const updateAltText = (index: number, altText: string) => {
        const currentMedia = [...watchedMedia];
        currentMedia[index] = { ...currentMedia[index], altText };
        form.setValue("media", currentMedia);
    };

    const onSubmit = (data: CreatePromotionalBanner) => {
        console.log("=== FORM SUBMISSION DEBUG ===");
        console.log("Submitting promotional banner data:", data);
        console.log("Form is valid:", form.formState.isValid);
        console.log("Form errors:", form.formState.errors);
        console.log("Form state:", form.formState);
        console.log("Media array:", data.media);
        console.log("CTA fields:", {
            ctaLabel: data.ctaLabel,
            ctaLink: data.ctaLink,
        });

        // Check required fields
        console.log("Required field checks:");
        console.log("- Title:", data.title, data.title?.length >= 3);
        console.log(
            "- Description:",
            data.description,
            data.description?.length >= 3
        );
        console.log(
            "- Location:",
            data.location,
            data.location ? data.location.length >= 1 : "undefined"
        );
        console.log("- Type:", data.type);
        console.log("- Media count:", data.media?.length || 0);

        // Check media URLs
        const mediaValid = data.media.every(
            (item) => item.url && item.url.trim().length > 0
        );
        console.log("- Media URLs valid:", mediaValid);

        // Check CTA requirements for type2 and type4
        if (data.type === "type2" || data.type === "type4") {
            console.log("- CTA Link required:", !!data.ctaLink);
        }

        console.log("=== END DEBUG ===");

        // Validate media array manually
        if (data.media.some((item) => !item.url || item.url.trim() === "")) {
            console.error("Invalid media detected - empty URLs found");
            alert("Please select valid images for all media slots");
            return;
        }

        // Validate required fields manually
        if (!data.title || data.title.length < 3) {
            console.error("Title validation failed");
            alert("Title must be at least 3 characters long");
            return;
        }

        if (!data.description || data.description.length < 3) {
            console.error("Description validation failed");
            alert("Description must be at least 3 characters long");
            return;
        }

        if (!data.location || data.location.length < 1) {
            console.log("No location provided - using default behavior");
        } else if (!VALID_LOCATIONS.includes(data.location)) {
            console.error("Invalid location provided");
            alert(
                `Invalid location. Please select from: ${VALID_LOCATIONS.join(", ")}`
            );
            return;
        }

        if ((data.type === "type2" || data.type === "type4") && !data.ctaLink) {
            console.error("CTA Link validation failed");
            alert("CTA Link is required for this banner type");
            return;
        }

        console.log("=== STARTING MUTATION ===");
        createMutation.mutate(data, {
            onSuccess: (result) => {
                console.log("Successfully created promotional banner:", result);
                alert("Promotional banner created successfully!");
                form.reset();
            },
            onError: (error) => {
                console.error("Error creating promotional banner:", error);
                console.error("Error details:", JSON.stringify(error, null, 2));

                // More detailed error logging
                if (error.response) {
                    console.error("Response status:", error.response.status);
                    console.error("Response data:", error.response.data);
                }

                alert(
                    `Error creating banner: ${error.message || "Unknown error"}`
                );
            },
        });
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Create Promotional Banner</CardTitle>
                <CardDescription>
                    Create a new promotional banner with different layout types
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter banner title"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Location (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={(value) => {
                                                    // Convert "none" back to undefined for form
                                                    field.onChange(
                                                        value === "none"
                                                            ? undefined
                                                            : value
                                                    );
                                                }}
                                                value={field.value || "none"}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a location (optional)" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">
                                                        None
                                                    </SelectItem>
                                                    {VALID_LOCATIONS.map(
                                                        (location) => (
                                                            <SelectItem
                                                                key={location}
                                                                value={location}
                                                            >
                                                                {location
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                    location
                                                                        .slice(
                                                                            1
                                                                        )
                                                                        .replace(
                                                                            /-/g,
                                                                            " "
                                                                        )}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter banner description"
                                            className="min-h-[80px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Banner Type</FormLabel>
                                    <Select
                                        onValueChange={handleTypeChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select banner type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {BANNER_TYPES.map((type) => (
                                                <SelectItem
                                                    key={type.value}
                                                    value={type.value}
                                                >
                                                    <div>
                                                        <div className="font-medium">
                                                            {type.label}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {type.description}
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Media Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <FormLabel className="text-base">
                                    Media Images
                                    {requiredMediaCount > 0 && (
                                        <Badge
                                            variant="secondary"
                                            className="ml-2"
                                        >
                                            Required: {requiredMediaCount}
                                        </Badge>
                                    )}
                                </FormLabel>
                                {watchedType === "carousel" && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addMediaSlot}
                                    >
                                        <Plus className="mr-1 h-4 w-4" />
                                        Add Image
                                    </Button>
                                )}
                            </div>

                            {mediaError && (
                                <p className="text-sm text-red-600">
                                    Error loading media: {mediaError.message}
                                </p>
                            )}

                            {requiredMediaCount > 0 ? (
                                // Fixed slots for specific types
                                Array(requiredMediaCount)
                                    .fill(null)
                                    .map((_, index) => (
                                        <div
                                            key={index}
                                            className="rounded-lg border p-4"
                                        >
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="font-medium">
                                                    Image {index + 1}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setSelectedMediaIndex(
                                                                index
                                                            );
                                                            setShowMediaModal(
                                                                true
                                                            );
                                                        }}
                                                        className="flex-1"
                                                    >
                                                        {watchedMedia[index]
                                                            ?.url
                                                            ? "Change Image"
                                                            : "Select Image"}
                                                    </Button>
                                                </div>
                                                {watchedMedia[index]?.url && (
                                                    <div className="space-y-2">
                                                        <div className="relative h-32 w-full overflow-hidden rounded-lg">
                                                            <Image
                                                                src={
                                                                    watchedMedia[
                                                                        index
                                                                    ].url
                                                                }
                                                                alt="Preview"
                                                                fill
                                                                className="object-cover"
                                                                onError={(
                                                                    e
                                                                ) => {
                                                                    console.error(
                                                                        "Image load error:",
                                                                        e
                                                                    );
                                                                    e.currentTarget.style.display =
                                                                        "none";
                                                                }}
                                                                unoptimized={watchedMedia[
                                                                    index
                                                                ].url.includes(
                                                                    "utfs.io"
                                                                )}
                                                            />
                                                        </div>
                                                        <Input
                                                            placeholder="Alt text (optional)"
                                                            value={
                                                                watchedMedia[
                                                                    index
                                                                ]?.altText || ""
                                                            }
                                                            onChange={(e) =>
                                                                updateAltText(
                                                                    index,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                // Dynamic slots for carousel
                                <>
                                    {watchedMedia.map((media, index) => (
                                        <div
                                            key={index}
                                            className="rounded-lg border p-4"
                                        >
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="font-medium">
                                                    Image {index + 1}
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        removeMediaSlot(index)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setSelectedMediaIndex(
                                                                index
                                                            );
                                                            setShowMediaModal(
                                                                true
                                                            );
                                                        }}
                                                        className="flex-1"
                                                    >
                                                        {media.url
                                                            ? "Change Image"
                                                            : "Select Image"}
                                                    </Button>
                                                </div>
                                                {media.url && (
                                                    <div className="space-y-2">
                                                        <div className="relative h-32 w-full overflow-hidden rounded-lg">
                                                            <Image
                                                                src={media.url}
                                                                alt="Preview"
                                                                fill
                                                                className="object-cover"
                                                                onError={(
                                                                    e
                                                                ) => {
                                                                    console.error(
                                                                        "Image load error:",
                                                                        e
                                                                    );
                                                                    e.currentTarget.style.display =
                                                                        "none";
                                                                }}
                                                                unoptimized={media.url.includes(
                                                                    "utfs.io"
                                                                )}
                                                            />
                                                        </div>
                                                        <Input
                                                            placeholder="Alt text (optional)"
                                                            value={
                                                                media.altText ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                updateAltText(
                                                                    index,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {watchedMedia.length === 0 && (
                                        <div className="rounded-lg border-2 border-dashed p-8 text-center">
                                            <p className="mb-4 text-muted-foreground">
                                                No images added yet
                                            </p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={addMediaSlot}
                                            >
                                                <Plus className="mr-1 h-4 w-4" />
                                                Add First Image
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* CTA Fields */}
                        {showCtaFields && (
                            <div className="space-y-4 border-t pt-4">
                                <FormLabel className="text-base">
                                    Call to Action
                                </FormLabel>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="ctaLabel"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>CTA Label</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder={`Default: ${getDefaultCtaLabel(watchedType)}`}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="ctaLink"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>CTA Link</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="https://example.com/shop"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="order"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Display Order</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={createMutation.isPending}
                            onClick={() => {
                                console.log("Button clicked!");
                                console.log("Form state:", form.formState);
                                console.log("Form values:", form.getValues());
                                console.log(
                                    "Form errors:",
                                    form.formState.errors
                                );
                                console.log(
                                    "Form isValid:",
                                    form.formState.isValid
                                );
                                console.log(
                                    "Form isSubmitting:",
                                    form.formState.isSubmitting
                                );
                                console.log(
                                    "Mutation pending:",
                                    createMutation.isPending
                                );
                            }}
                        >
                            {createMutation.isPending
                                ? "Creating..."
                                : "Create Promotional Banner"}
                        </Button>

                        {/* Manual test button for debugging */}
                        {process.env.NODE_ENV === "development" && (
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={async () => {
                                    console.log(
                                        "=== MANUAL TEST SUBMISSION ==="
                                    );
                                    const formData = form.getValues();
                                    console.log("Raw form data:", formData);

                                    try {
                                        // Try to validate manually
                                        const validatedData =
                                            createPromotionalBannerSchema.parse(
                                                formData
                                            );
                                        console.log(
                                            "Validation successful:",
                                            validatedData
                                        );

                                        // Try to submit
                                        const result =
                                            await createMutation.mutateAsync(
                                                validatedData
                                            );
                                        console.log(
                                            "Manual submission successful:",
                                            result
                                        );
                                        alert("Manual submission worked!");
                                    } catch (error: any) {
                                        console.error(
                                            "Manual submission error:",
                                            error
                                        );
                                        if (error.name === "ZodError") {
                                            console.error(
                                                "Validation errors:",
                                                error.errors
                                            );
                                            alert(
                                                `Validation error: ${error.errors.map((e: any) => e.message).join(", ")}`
                                            );
                                        } else {
                                            alert(
                                                `Submission error: ${error.message}`
                                            );
                                        }
                                    }
                                }}
                            >
                                🧪 Manual Test Submit
                            </Button>
                        )}

                        {/* Show mutation error if any */}
                        {createMutation.error && (
                            <div className="mt-2 text-sm text-red-600">
                                <strong>Error:</strong>{" "}
                                {createMutation.error instanceof Error
                                    ? createMutation.error.message
                                    : "Unknown error occurred"}
                            </div>
                        )}

                        {/* Debug form state */}
                        {process.env.NODE_ENV === "development" && (
                            <details className="mt-4">
                                <summary className="cursor-pointer text-sm text-muted-foreground">
                                    Debug Form Stat
                                </summary>
                                <pre className="mt-2 max-h-40 overflow-auto rounded bg-gray-100 p-2 text-xs">
                                    {JSON.stringify(form.watch(), null, 2)}
                                </pre>
                                <div className="mt-2 text-xs text-red-600">
                                    <strong>Form Errors:</strong>
                                    <pre>
                                        {JSON.stringify(
                                            form.formState.errors,
                                            null,
                                            2
                                        )}
                                    </pre>
                                </div>
                            </details>
                        )}
                    </form>
                </Form>

                <MediaSelectModal
                    isOpen={showMediaModal}
                    setIsOpen={setShowMediaModal}
                    selected={[]}
                    data={media}
                    multiple={false}
                    uploaderId={user?.id || ""}
                    onSelectionComplete={(items) => {
                        if (items.length > 0 && selectedMediaIndex !== null) {
                            handleMediaSelect(items[0].url);
                        }
                        setShowMediaModal(false);
                        setSelectedMediaIndex(null);
                    }}
                />
            </CardContent>
        </Card>
    );
}
