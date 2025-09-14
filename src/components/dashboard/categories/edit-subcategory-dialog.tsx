"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
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
import { axios } from "@/lib/axios";
import {
    updateSubcategorySchema,
    type Category,
    type Subcategory,
    type UpdateSubcategory,
} from "@/lib/validations/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditSubcategoryDialogProps {
    subcategory: Subcategory | null;
    categories: Category[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubcategoryUpdated: (subcategory: Subcategory) => void;
}

export function EditSubcategoryDialog({
    subcategory,
    categories,
    open,
    onOpenChange,
    onSubcategoryUpdated,
}: EditSubcategoryDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<UpdateSubcategory>({
        resolver: zodResolver(updateSubcategorySchema),
        defaultValues: {
            categoryId: "",
            name: "",
            description: "",
            imageUrl: "",
            isActive: true,
        },
    });

    useEffect(() => {
        if (subcategory && open) {
            form.reset({
                categoryId: subcategory.categoryId,
                name: subcategory.name,
                description: subcategory.description || "",
                imageUrl: subcategory.imageUrl || "",
                isActive: subcategory.isActive,
            });
        }
    }, [subcategory, open, form]);

    const onSubmit = async (data: UpdateSubcategory) => {
        if (!subcategory) return;

        setIsSubmitting(true);
        try {
            const response = await axios.patch(
                `/api/subcategories/${subcategory.id}`,
                data
            );

            if (response.data.success) {
                onSubcategoryUpdated(response.data.data);
                toast.success("Subcategory updated successfully");
            }
        } catch (error: any) {
            console.error("Error updating subcategory:", error);
            const message =
                error.response?.data?.message || "Failed to update subcategory";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen && !isSubmitting) {
            form.reset();
        }
        onOpenChange(newOpen);
    };

    if (!subcategory) return null;

    const activeCategories = categories.filter((cat) => cat.isActive);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Subcategory</DialogTitle>
                    <DialogDescription>
                        Update the subcategory information. Changes will be
                        reflected immediately.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={isSubmitting}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {activeCategories.map(
                                                (category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Choose the parent category for this
                                        subcategory
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter subcategory name"
                                            {...field}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter subcategory description"
                                            className="min-h-[100px]"
                                            {...field}
                                            value={field.value || ""}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="url"
                                            placeholder="https://example.com/image.jpg"
                                            {...field}
                                            value={field.value || ""}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Optional image URL for the subcategory
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Active Status
                                        </FormLabel>
                                        <FormDescription>
                                            Enable this subcategory to make it
                                            visible to customers
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Update Subcategory
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
