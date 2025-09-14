import { z } from "zod";
import { convertEmptyStringToNull } from "../utils";
import { generateDateSchema, generateIdSchema } from "./general";

export const bannerSchema = z.object({
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
    imageUrl: z
        .string({
            required_error: "Image URL is required",
            invalid_type_error: "Image URL must be a string",
        })
        .url("Image URL is invalid"),
    url: z.string().nullable().optional(),
    location: z.preprocess(
        convertEmptyStringToNull,
        z
            .string({
                invalid_type_error: "Location must be a string",
            })
            .min(1, "Location is required")
    ),
    createdAt: generateDateSchema({
        required_error: "Created at is required",
        invalid_type_error: "Created at must be a date",
    }),
    updatedAt: generateDateSchema({
        required_error: "Updated at is required",
        invalid_type_error: "Updated at must be a date",
    }),
});

export const createBannerSchema = bannerSchema
    .omit({
        id: true,
        createdAt: true,
        updatedAt: true,
    })
    .extend({
        imageUrl: z
            .string({
                required_error: "Image URL is required",
                invalid_type_error: "Image URL must be a string",
            })
            .nullable(),
    });

export const updateBannerSchema = createBannerSchema.partial();

export const cachedBannerSchema = bannerSchema;

export type Banner = z.infer<typeof bannerSchema>;
export type CreateBanner = z.infer<typeof createBannerSchema>;
export type CachedBanner = z.infer<typeof cachedBannerSchema>;
export type UpdateBanner = z.infer<typeof updateBannerSchema>;