"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CachedCategory, CachedSubcategory, CachedProductType } from "@/lib/validations";

interface CategorySelectProps {
    categories: CachedCategory[];
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function CategorySelect({
    categories,
    value,
    onValueChange,
    placeholder = "Select category...",
    className,
    disabled,
}: CategorySelectProps) {
    const [open, setOpen] = React.useState(false);

    const selectedCategory = categories.find((category) => category.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn("w-full justify-between", className)}
                >
                    {selectedCategory ? selectedCategory.name : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search categories..." />
                    <CommandList>
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                            {categories.map((category) => (
                                <CommandItem
                                    key={category.id}
                                    value={category.name}
                                    onSelect={() => {
                                        onValueChange?.(category.id);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === category.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span>{category.name}</span>
                                        {category.description && (
                                            <span className="text-xs text-muted-foreground line-clamp-1">
                                                {category.description}
                                            </span>
                                        )}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

interface SubcategorySelectProps {
    subcategories: CachedSubcategory[];
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function SubcategorySelect({
    subcategories,
    value,
    onValueChange,
    placeholder = "Select subcategory...",
    className,
    disabled,
}: SubcategorySelectProps) {
    const [open, setOpen] = React.useState(false);

    const selectedSubcategory = subcategories.find((subcategory) => subcategory.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn("w-full justify-between", className)}
                >
                    {selectedSubcategory ? selectedSubcategory.name : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search subcategories..." />
                    <CommandList>
                        <CommandEmpty>No subcategory found.</CommandEmpty>
                        <CommandGroup>
                            {subcategories.map((subcategory) => (
                                <CommandItem
                                    key={subcategory.id}
                                    value={subcategory.name}
                                    onSelect={() => {
                                        onValueChange?.(subcategory.id);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === subcategory.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span>{subcategory.name}</span>
                                        {subcategory.description && (
                                            <span className="text-xs text-muted-foreground line-clamp-1">
                                                {subcategory.description}
                                            </span>
                                        )}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

interface ProductTypeSelectProps {
    productTypes: CachedProductType[];
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function ProductTypeSelect({
    productTypes,
    value,
    onValueChange,
    placeholder = "Select product type...",
    className,
    disabled,
}: ProductTypeSelectProps) {
    const [open, setOpen] = React.useState(false);

    const selectedProductType = productTypes.find((productType) => productType.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn("w-full justify-between", className)}
                >
                    {selectedProductType ? selectedProductType.name : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search product types..." />
                    <CommandList>
                        <CommandEmpty>No product type found.</CommandEmpty>
                        <CommandGroup>
                            {productTypes.map((productType) => (
                                <CommandItem
                                    key={productType.id}
                                    value={productType.name}
                                    onSelect={() => {
                                        onValueChange?.(productType.id);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === productType.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span>{productType.name}</span>
                                        {productType.description && (
                                            <span className="text-xs text-muted-foreground line-clamp-1">
                                                {productType.description}
                                            </span>
                                        )}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}