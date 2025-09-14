import { z } from "zod";
import { convertEmptyStringToNull } from "../utils";
import { generateDateSchema, generateIdSchema } from "./general";

// Valid location options - centralized list to prevent typos
const VALID_LOCATIONS = [
    "home",
    "home-hero", 
    "shop",
    "category",
    "product",
    "cart",
    "checkout",
    "about",
    "contact",
    "search",
    "global" // For banners that appear everywhere
] as const;

export type ValidLocation = typeof VALID_LOCATIONS[number];

// Media item for promotional banners
export const promotionalBannerMediaSchema = z.object({
    url: z.string().url("Please provide a valid image URL"),
    altText: z.string().optional(),
});

export const promotionalBannerSchema = z.object({
    id: generateIdSchema(),
    title: z
        .string({
            required_error: "Title is required",
            invalid_type_error: "Title must be a string",
        })
        .min(3, "Title must be at least 3 characters long"),
    description: z
        .string({
            required_error: "Description is required", 
            invalid_type_error: "Description must be a string",
        })
        .min(3, "Description must be at least 3 characters long"),
    type: z.enum(["carousel", "type1", "type2", "type3", "type4"], {
        required_error: "Banner type is required",
    }),
    media: z.array(promotionalBannerMediaSchema).default([]),
    ctaLabel: z.string().optional(),
    ctaLink: z.preprocess(
        (val) => val === "" ? undefined : val,
        z.string().url().optional()
    ),
    location: z.enum(VALID_LOCATIONS, {
        required_error: "Location is required",
        invalid_type_error: "Invalid location. Must be one of: " + VALID_LOCATIONS.join(", ")
    }).optional(), // Made optional - banners can work without specific location
    isActive: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
    createdAt: generateDateSchema({
        required_error: "Created at is required",
        invalid_type_error: "Created at must be a date",
    }),
    updatedAt: generateDateSchema({
        required_error: "Updated at is required",
        invalid_type_error: "Updated at must be a date",
    }),
});

export const basePromotionalBannerSchema = promotionalBannerSchema
    .omit({
        id: true,
        createdAt: true,
        updatedAt: true,
    });

export const createPromotionalBannerSchema = basePromotionalBannerSchema
    .superRefine((data, ctx) => {
        // Validation based on banner type
        switch (data.type) {
            case "type1":
                if (data.media.length !== 3) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Type 1 banners require exactly 3 images",
                        path: ["media"],
                    });
                }
                break;
            case "type2":
                if (data.media.length !== 1) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Type 2 banners require exactly 1 image",
                        path: ["media"],
                    });
                }
                if (!data.ctaLink) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Type 2 banners require a CTA link",
                        path: ["ctaLink"],
                    });
                }
                break;
            case "type3":
                if (data.media.length !== 2) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Type 3 banners require exactly 2 images",
                        path: ["media"],
                    });
                }
                break;
            case "type4":
                if (data.media.length !== 1) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Type 4 banners require exactly 1 image", 
                        path: ["media"],
                    });
                }
                if (!data.ctaLink) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Type 4 banners require a CTA link",
                        path: ["ctaLink"],
                    });
                }
                break;
            case "carousel":
                if (data.media.length === 0) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Carousel banners require at least 1 image",
                        path: ["media"],
                    });
                }
                break;
        }
    });

export const updatePromotionalBannerSchema = basePromotionalBannerSchema.partial();

export type PromotionalBanner = z.infer<typeof promotionalBannerSchema>;
export type CreatePromotionalBanner = z.infer<typeof createPromotionalBannerSchema>;
export type UpdatePromotionalBanner = z.infer<typeof updatePromotionalBannerSchema>;
export type PromotionalBannerMedia = z.infer<typeof promotionalBannerMediaSchema>;

// Export valid locations for use in components
export { VALID_LOCATIONS };
