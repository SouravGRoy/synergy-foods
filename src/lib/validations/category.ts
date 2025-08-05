import { z } from "zod";
import { convertEmptyStringToNull } from "../utils";
import { generateDateSchema } from "./general";

export const categorySchema = z.object({
    id: z
        .string({
            required_error: "ID is required",
            invalid_type_error: "ID must be a string",
        })
        .uuid("ID is invalid"),
    name: z
        .string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        })
        .min(3, "Name must be at least 3 characters long"),
    slug: z
        .string({
            required_error: "Slug is required",
            invalid_type_error: "Slug must be a string",
        })
        .min(3, "Slug must be at least 3 characters long"),
    description: z.preprocess(
        convertEmptyStringToNull,
        z
            .string({
                required_error: "Description is required",
                invalid_type_error: "Description must be a string",
            })
            .min(3, "Description must be at least 3 characters long")
            .nullable()
    ),
    commissionRate: z
        .number({
            invalid_type_error: "Commission rate must be a number",
        })
        .int("Commission rate must be an integer")
        .min(0, "Commission rate must be at least 0")
        .max(10000, "Commission rate must be at most 10000")
        .default(0),
    imageUrl: z.preprocess(
        convertEmptyStringToNull,
        z
            .string({
                invalid_type_error: "Image URL must be a string",
            })
            .url("Image URL must be a valid URL")
            .nullable()
    ),
    isActive: z
        .boolean({
            invalid_type_error: "Active status must be a boolean",
        })
        .default(true),
    createdAt: generateDateSchema({
        required_error: "Created at is required",
        invalid_type_error: "Created at must be a date",
    }),
    updatedAt: generateDateSchema({
        required_error: "Updated at is required",
        invalid_type_error: "Updated at must be a date",
    }),
});

export const subcategorySchema = z.object({
    id: z
        .string({
            required_error: "ID is required",
            invalid_type_error: "ID must be a string",
        })
        .uuid("ID is invalid"),
    categoryId: z
        .string({
            required_error: "Category ID is required",
            invalid_type_error: "Category ID must be a string",
        })
        .uuid("Category ID is invalid"),
    name: z
        .string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        })
        .min(3, "Name must be at least 3 characters long"),
    slug: z
        .string({
            required_error: "Slug is required",
            invalid_type_error: "Slug must be a string",
        })
        .min(3, "Slug must be at least 3 characters long"),
    description: z.preprocess(
        convertEmptyStringToNull,
        z
            .string({
                required_error: "Description is required",
                invalid_type_error: "Description must be a string",
            })
            .min(3, "Description must be at least 3 characters long")
            .nullable()
    ),
    imageUrl: z.preprocess(
        convertEmptyStringToNull,
        z
            .string({
                invalid_type_error: "Image URL must be a string",
            })
            .url("Image URL must be a valid URL")
            .nullable()
    ),
    isActive: z
        .boolean({
            invalid_type_error: "Active status must be a boolean",
        })
        .default(true),
    createdAt: generateDateSchema({
        required_error: "Created at is required",
        invalid_type_error: "Created at must be a date",
    }),
    updatedAt: generateDateSchema({
        required_error: "Updated at is required",
        invalid_type_error: "Updated at must be a date",
    }),
});

export const productTypeSchema = z.object({
    id: z
        .string({
            required_error: "ID is required",
            invalid_type_error: "ID must be a string",
        })
        .uuid("ID is invalid"),
    categoryId: z
        .string({
            required_error: "Category ID is required",
            invalid_type_error: "Category ID must be a string",
        })
        .uuid("Category ID is invalid"),
    subcategoryId: z
        .string({
            required_error: "Subcategory ID is required",
            invalid_type_error: "Subcategory ID must be a string",
        })
        .uuid("Subcategory ID is invalid"),
    name: z
        .string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        })
        .min(3, "Name must be at least 3 characters long"),
    slug: z
        .string({
            required_error: "Slug is required",
            invalid_type_error: "Slug must be a string",
        })
        .min(3, "Slug must be at least 3 characters long"),
    description: z.preprocess(
        convertEmptyStringToNull,
        z
            .string({
                required_error: "Description is required",
                invalid_type_error: "Description must be a string",
            })
            .min(3, "Description must be at least 3 characters long")
            .nullable()
    ),
    imageUrl: z.preprocess(
        convertEmptyStringToNull,
        z
            .string({
                invalid_type_error: "Image URL must be a string",
            })
            .url("Image URL must be a valid URL")
            .nullable()
    ),
    isActive: z
        .boolean({
            invalid_type_error: "Active status must be a boolean",
        })
        .default(true),
    createdAt: generateDateSchema({
        required_error: "Created at is required",
        invalid_type_error: "Created at must be a date",
    }),
    updatedAt: generateDateSchema({
        required_error: "Updated at is required",
        invalid_type_error: "Updated at must be a date",
    }),
});

export const createCategorySchema = categorySchema.omit({
    id: true,
    slug: true,
    createdAt: true,
    updatedAt: true,
});
export const createSubcategorySchema = subcategorySchema.omit({
    id: true,
    slug: true,
    createdAt: true,
    updatedAt: true,
});
export const createProductTypeSchema = productTypeSchema.omit({
    id: true,
    slug: true,
    createdAt: true,
    updatedAt: true,
});

export const updateCategorySchema = createCategorySchema.partial();
export const updateSubcategorySchema = createSubcategorySchema.partial();
export const updateProductTypeSchema = createProductTypeSchema.partial();

export const categoryRequestSchema = z.object({
    id: z
        .string({
            required_error: "ID is required",
            invalid_type_error: "ID must be a string",
        })
        .uuid("ID is invalid"),
    requesterId: z
        .string({
            required_error: "Requester ID is required",
            invalid_type_error: "Requester ID must be a string",
        }),
    type: z.enum(["category", "subcategory", "product_type"], {
        required_error: "Type is required",
    }),
    name: z
        .string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        })
        .min(3, "Name must be at least 3 characters long"),
    description: z.preprocess(
        convertEmptyStringToNull,
        z
            .string({
                invalid_type_error: "Description must be a string",
            })
            .min(3, "Description must be at least 3 characters long")
            .nullable()
    ),
    parentCategoryId: z
        .string({
            invalid_type_error: "Parent category ID must be a string",
        })
        .uuid("Parent category ID is invalid")
        .nullable(),
    parentSubcategoryId: z
        .string({
            invalid_type_error: "Parent subcategory ID must be a string",
        })
        .uuid("Parent subcategory ID is invalid")
        .nullable(),
    status: z
        .enum(["pending", "approved", "rejected"], {
            invalid_type_error: "Status must be pending, approved, or rejected",
        })
        .default("pending"),
    reviewerId: z
        .string({
            invalid_type_error: "Reviewer ID must be a string",
        })
        .nullable(),
    reviewedAt: z
        .string({
            invalid_type_error: "Reviewed at must be a string",
        })
        .nullable(),
    reviewNote: z.preprocess(
        convertEmptyStringToNull,
        z
            .string({
                invalid_type_error: "Review note must be a string",
            })
            .nullable()
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

export const createCategoryRequestSchema = categoryRequestSchema.omit({
    id: true,
    status: true,
    reviewerId: true,
    reviewedAt: true,
    reviewNote: true,
    createdAt: true,
    updatedAt: true,
});

export const updateCategoryRequestSchema = z.object({
    status: z.enum(["pending", "approved", "rejected"]),
    reviewNote: z.preprocess(
        convertEmptyStringToNull,
        z
            .string({
                invalid_type_error: "Review note must be a string",
            })
            .nullable()
    ),
});

export const cachedCategorySchema = categorySchema.extend({
    subcategories: z.number({
        required_error: "Subcategories is required",
        invalid_type_error: "Subcategories must be a number",
    }),
});
export const cachedSubcategorySchema = subcategorySchema.extend({
    productTypes: z.number({
        required_error: "Product types is required",
        invalid_type_error: "Product types must be a number",
    }),
});
export const cachedProductTypeSchema = productTypeSchema;

export type Category = z.infer<typeof categorySchema>;
export type Subcategory = z.infer<typeof subcategorySchema>;
export type ProductType = z.infer<typeof productTypeSchema>;
export type CategoryRequest = z.infer<typeof categoryRequestSchema>;

export type CreateCategory = z.infer<typeof createCategorySchema>;
export type CreateSubcategory = z.infer<typeof createSubcategorySchema>;
export type CreateProductType = z.infer<typeof createProductTypeSchema>;
export type CreateCategoryRequest = z.infer<typeof createCategoryRequestSchema>;

export type UpdateCategory = z.infer<typeof updateCategorySchema>;
export type UpdateSubcategory = z.infer<typeof updateSubcategorySchema>;
export type UpdateProductType = z.infer<typeof updateProductTypeSchema>;
export type UpdateCategoryRequest = z.infer<typeof updateCategoryRequestSchema>;

export type CachedCategory = z.infer<typeof cachedCategorySchema>;
export type CachedSubcategory = z.infer<typeof cachedSubcategorySchema>;
export type CachedProductType = z.infer<typeof cachedProductTypeSchema>;
