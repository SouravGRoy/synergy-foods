"use client";

import { MediaSelectModal } from "@/components/globals/modals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { usePromotionalBanner } from "@/lib/react-query/promotional-banner";
import {
    PromotionalBanner,
    UpdatePromotionalBanner,
    updatePromotionalBannerSchema,
    VALID_LOCATIONS,
} from "@/lib/validations/promotional-banner";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface PromotionalBannerEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    banner: PromotionalBanner | null;
    onSuccess: () => void;
}

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

export function PromotionalBannerEditDialog({
    open,
    onOpenChange,
    banner,
    onSuccess,
}: PromotionalBannerEditDialogProps) {
    const { user } = useUser();
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(
        null
    );
    const { useUpdate } = usePromotionalBanner();
    const updateMutation = useUpdate();

    const form = useForm<UpdatePromotionalBanner>({
        resolver: zodResolver(updatePromotionalBannerSchema),
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
    const watchedMedia = form.watch("media") || [];
    const requiredMediaCount = getRequiredMediaCount(watchedType || "carousel");
    const showCtaFields = requiresCta(watchedType || "carousel");

    useEffect(() => {
        if (banner && open) {
            form.reset({
                title: banner.title,
                description: banner.description,
                type: banner.type,
                media: banner.media || [],
                ctaLabel: banner.ctaLabel || "",
                ctaLink: banner.ctaLink || "",
                location: banner.location,
                isActive: banner.isActive,
                order: banner.order,
            });
        }
    }, [banner, open, form]);

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

        // Adjust media array based on requirements
        const currentMedia = form.getValues("media") || [];
        if (requiredMediaCount > 0) {
            const newMedia = Array(requiredMediaCount)
                .fill(null)
                .map(
                    (_, index) =>
                        currentMedia[index] || { url: "", altText: "" }
                );
            form.setValue("media", newMedia);
        }
    };

    const handleMediaSelect = (url: string) => {
        if (selectedMediaIndex !== null) {
            const currentMedia = [...watchedMedia];
            currentMedia[selectedMediaIndex] = {
                url,
                altText: currentMedia[selectedMediaIndex]?.altText || "",
            };
            form.setValue("media", currentMedia);
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

    const onSubmit = (data: UpdatePromotionalBanner) => {
        if (!banner) return;

        updateMutation.mutate(
            { id: banner.id, data },
            {
                onSuccess: () => {
                    onSuccess();
                },
            }
        );
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Edit Promotional Banner</DialogTitle>
                    </DialogHeader>

                    {banner && (
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
                                                        onValueChange={(
                                                            value
                                                        ) => {
                                                            // Convert "none" back to undefined for form
                                                            field.onChange(
                                                                value === "none"
                                                                    ? undefined
                                                                    : value
                                                            );
                                                        }}
                                                        value={
                                                            field.value ||
                                                            "none"
                                                        }
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
                                                                        key={
                                                                            location
                                                                        }
                                                                        value={
                                                                            location
                                                                        }
                                                                    >
                                                                        {location
                                                                            .charAt(
                                                                                0
                                                                            )
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
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select banner type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {BANNER_TYPES.map(
                                                        (type) => (
                                                            <SelectItem
                                                                key={type.value}
                                                                value={
                                                                    type.value
                                                                }
                                                            >
                                                                <div>
                                                                    <div className="font-medium">
                                                                        {
                                                                            type.label
                                                                        }
                                                                    </div>
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {
                                                                            type.description
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </SelectItem>
                                                        )
                                                    )}
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
                                                    Required:{" "}
                                                    {requiredMediaCount}
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
                                                                {watchedMedia[
                                                                    index
                                                                ]?.url
                                                                    ? "Change Image"
                                                                    : "Select Image"}
                                                            </Button>
                                                        </div>
                                                        {watchedMedia[index]
                                                            ?.url && (
                                                            <div className="space-y-2">
                                                                <Image
                                                                    fill
                                                                    src={
                                                                        watchedMedia[
                                                                            index
                                                                        ].url
                                                                    }
                                                                    alt="Preview"
                                                                    className="h-32 w-full rounded object-cover"
                                                                />
                                                                <Input
                                                                    placeholder="Alt text (optional)"
                                                                    value={
                                                                        watchedMedia[
                                                                            index
                                                                        ]
                                                                            ?.altText ||
                                                                        ""
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateAltText(
                                                                            index,
                                                                            e
                                                                                .target
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
                                            {watchedMedia.map(
                                                (media: any, index: number) => (
                                                    <div
                                                        key={index}
                                                        className="rounded-lg border p-4"
                                                    >
                                                        <div className="mb-2 flex items-center justify-between">
                                                            <span className="font-medium">
                                                                Image{" "}
                                                                {index + 1}
                                                            </span>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    removeMediaSlot(
                                                                        index
                                                                    )
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
                                                                    <Image
                                                                        fill
                                                                        src={
                                                                            media.url
                                                                        }
                                                                        alt="Preview"
                                                                        className="h-32 w-full rounded object-cover"
                                                                    />
                                                                    <Input
                                                                        placeholder="Alt text (optional)"
                                                                        value={
                                                                            media.altText ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            updateAltText(
                                                                                index,
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            )}
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
                                                        <FormLabel>
                                                            CTA Label
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder={`Default: ${getDefaultCtaLabel(watchedType || "")}`}
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
                                                        <FormLabel>
                                                            CTA Link
                                                        </FormLabel>
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

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <FormField
                                        control={form.control}
                                        name="order"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Display Order
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                ) || 0
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="isActive"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                                <div className="space-y-0.5">
                                                    <FormLabel>
                                                        Active Status
                                                    </FormLabel>
                                                    <div className="text-sm text-muted-foreground">
                                                        Enable or disable this
                                                        banner
                                                    </div>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex justify-end space-x-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => onOpenChange(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={updateMutation.isPending}
                                    >
                                        {updateMutation.isPending
                                            ? "Updating..."
                                            : "Update Banner"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}
                </DialogContent>
            </Dialog>

            <MediaSelectModal
                isOpen={showMediaModal}
                setIsOpen={setShowMediaModal}
                selected={[]}
                data={[]}
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
        </>
    );
}
