import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import React, { KeyboardEvent, useState } from "react";

export interface Tag {
    id: string;
    text: string;
}

interface TagInputProps {
    tags: Tag[];
    onTagsChange: (tags: Tag[]) => void;
    placeholder?: string;
    disabled?: boolean;
}

export function TagInput({
    tags,
    onTagsChange,
    placeholder = "Add tag...",
    disabled = false,
}: TagInputProps) {
    const [inputValue, setInputValue] = useState("");

    const addTag = (text: string) => {
        const trimmed = text.trim();
        if (
            trimmed &&
            !tags.some(
                (tag) => tag.text.toLowerCase() === trimmed.toLowerCase()
            )
        ) {
            const newTag: Tag = {
                id: Math.random().toString(36).substr(2, 9),
                text: trimmed,
            };
            onTagsChange([...tags, newTag]);
        }
        setInputValue("");
    };

    const removeTag = (tagId: string) => {
        onTagsChange(tags.filter((tag) => tag.id !== tagId));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(inputValue);
        } else if (
            e.key === "Backspace" &&
            inputValue === "" &&
            tags.length > 0
        ) {
            removeTag(tags[tags.length - 1].id);
        }
    };

    return (
        <div className="flex min-h-[40px] flex-wrap gap-2 rounded-md border border-gray-200 p-2 focus-within:border-transparent focus-within:ring-2 focus-within:ring-ring">
            {tags.map((tag) => (
                <Badge
                    key={tag.id}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1"
                >
                    {tag.text}
                    {!disabled && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeTag(tag.id)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </Badge>
            ))}
            {!disabled && (
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => {
                        if (inputValue.trim()) {
                            addTag(inputValue);
                        }
                    }}
                    className="min-w-[120px] flex-1 border-none p-0 shadow-none outline-none focus-visible:ring-0"
                />
            )}
        </div>
    );
}
