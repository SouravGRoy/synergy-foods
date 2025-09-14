"use client";

import { MediaSelectModal } from "@/components/globals/modals/media-select";
import { Icons } from "@/components/icons";
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
import { Textarea } from "@/components/ui/textarea";
import { useBanner } from "@/lib/react-query/banner";
import { useMediaItem } from "@/lib/react-query/media-item";
import { Banner, UpdateBanner, updateBannerSchema } from "@/lib/validations";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

interface BannerEditDialogProps {
    banner: Banner;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const LOCATION_OPTIONS = [
    { value: "homepage", label: "Homepage" },
    { value: "category", label: "Category Pages" },
    { value: "product", label: "Product Pages" },
    { value: "shop", label: "Shop Page" },
    { value: "search", label: "Search Results" },
    { value: "cart", label: "Cart Page" },
    { value: "checkout", label: "Checkout Page" },
    { value: "custom", label: "Custom Location" },
];

export function BannerEditDialog({
    banner,
    open,
    onOpenChange,
}: BannerEditDialogProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);

    const { useUpdate } = useBanner();
    const updateMutation = useUpdate();
    const { userId } = useAuth();

    // Media management
    const { useScan: useMediaItemScan } = useMediaItem();
    const { data: mediaRaw, error: mediaError } = useMediaItemScan({});

    const media = useMemo(
        () => mediaRaw?.filter((m) => m.type.includes("image")) || [],
        [mediaRaw]
    );

    const form = useForm<UpdateBanner>({
        resolver: zodResolver(updateBannerSchema),
        defaultValues: {
            title: "",
            description: "",
            location: "homepage",
            imageUrl: null,
            url: "",
        },
    });

    // Reset form when banner changes
    useEffect(() => {
        if (banner) {
            form.reset({
                title: banner.title,
                description: banner.description,
                location: banner.location,
                imageUrl: banner.imageUrl,
                url: banner.url || "",
            });
        }
    }, [banner, form]);

    const onSubmit = async (values: UpdateBanner) => {
        try {
            // Validate userId exists
            if (!userId) {
                form.setError("root", {
                    message: "User authentication required",
                });
                return;
            }

            // Transform null imageUrl to undefined for the API
            const submitValues = {
                ...values,
                imageUrl:
                    values.imageUrl === null ? undefined : values.imageUrl,
            };

            await updateMutation.mutateAsync({
                id: banner.id,
                values: submitValues,
            });

            onOpenChange(false);
        } catch (error) {
            // Error is handled by the mutation
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Banner</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Banner Image *
                            </label>
                            {form.watch("imageUrl") ? (
                                <div className="relative">
                                    <div className="relative h-48 w-full overflow-hidden rounded-lg">
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

                        {/* Title */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title *</FormLabel>
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
                                            className="min-h-[80px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Location */}
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location *</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
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
                                                            key={option.value}
                                                            value={option.value}
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

                            {/* Link URL */}
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

                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    updateMutation.isPending || isUploading
                                }
                            >
                                {updateMutation.isPending
                                    ? "Saving..."
                                    : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>

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
        </Dialog>
    );
}
