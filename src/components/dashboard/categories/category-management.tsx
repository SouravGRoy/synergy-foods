"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Category, ProductType, Subcategory } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CategoriesTable } from "./categories-table";
import { CreateCategoryDialog } from "./create-category-dialog";
import { CreateProductTypeDialog } from "./create-product-type-dialog";
import { CreateSubcategoryDialog } from "./create-subcategory-dialog";
import { ProductTypesTable } from "./product-types-table";
import { SubcategoriesTable } from "./subcategories-table";

interface CategoryManagementProps {
    initialCategories: Category[];
    initialSubcategories: Subcategory[];
    initialProductTypes: ProductType[];
}

export function CategoryManagement({
    initialCategories,
    initialSubcategories,
    initialProductTypes,
}: CategoryManagementProps) {
    const [categories, setCategories] = useState(initialCategories);
    const [subcategories, setSubcategories] = useState(initialSubcategories);
    const [productTypes, setProductTypes] = useState(initialProductTypes);
    const [activeTab, setActiveTab] = useState("categories");

    const [showCreateCategory, setShowCreateCategory] = useState(false);
    const [showCreateSubcategory, setShowCreateSubcategory] = useState(false);
    const [showCreateProductType, setShowCreateProductType] = useState(false);

    const handleCategoryCreated = (newCategory: Category) => {
        setCategories((prev) => [newCategory, ...prev]);
        setShowCreateCategory(false);
    };

    const handleSubcategoryCreated = (newSubcategory: Subcategory) => {
        setSubcategories((prev) => [newSubcategory, ...prev]);
        setShowCreateSubcategory(false);
    };

    const handleProductTypeCreated = (newProductType: ProductType) => {
        setProductTypes((prev) => [newProductType, ...prev]);
        setShowCreateProductType(false);
    };

    const handleCategoryUpdated = (updatedCategory: Category) => {
        setCategories((prev) =>
            prev.map((cat) =>
                cat.id === updatedCategory.id ? updatedCategory : cat
            )
        );
    };

    const handleSubcategoryUpdated = (updatedSubcategory: Subcategory) => {
        setSubcategories((prev) =>
            prev.map((sub) =>
                sub.id === updatedSubcategory.id ? updatedSubcategory : sub
            )
        );
    };

    const handleProductTypeUpdated = (updatedProductType: ProductType) => {
        setProductTypes((prev) =>
            prev.map((pt) =>
                pt.id === updatedProductType.id ? updatedProductType : pt
            )
        );
    };

    const handleCategoryDeleted = (categoryId: string) => {
        setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    };

    const handleSubcategoryDeleted = (subcategoryId: string) => {
        setSubcategories((prev) =>
            prev.filter((sub) => sub.id !== subcategoryId)
        );
    };

    const handleProductTypeDeleted = (productTypeId: string) => {
        setProductTypes((prev) => prev.filter((pt) => pt.id !== productTypeId));
    };

    return (
        <div className="space-y-6">
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <div className="flex items-center justify-between">
                    <TabsList className="grid w-full max-w-md grid-cols-3">
                        <TabsTrigger value="categories">Categories</TabsTrigger>
                        <TabsTrigger value="subcategories">
                            Subcategories
                        </TabsTrigger>
                        <TabsTrigger value="product-types">
                            Product Types
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2">
                        {activeTab === "categories" && (
                            <Button onClick={() => setShowCreateCategory(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Category
                            </Button>
                        )}
                        {activeTab === "subcategories" && (
                            <Button
                                onClick={() => setShowCreateSubcategory(true)}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Subcategory
                            </Button>
                        )}
                        {activeTab === "product-types" && (
                            <Button
                                onClick={() => setShowCreateProductType(true)}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Product Type
                            </Button>
                        )}
                    </div>
                </div>

                <TabsContent value="categories" className="space-y-4">
                    <CategoriesTable
                        categories={categories}
                        onCategoryUpdated={handleCategoryUpdated}
                        onCategoryDeleted={handleCategoryDeleted}
                    />
                </TabsContent>

                <TabsContent value="subcategories" className="space-y-4">
                    <SubcategoriesTable
                        subcategories={subcategories}
                        categories={categories}
                        onSubcategoryUpdated={handleSubcategoryUpdated}
                        onSubcategoryDeleted={handleSubcategoryDeleted}
                    />
                </TabsContent>

                <TabsContent value="product-types" className="space-y-4">
                    <ProductTypesTable
                        productTypes={productTypes}
                        subcategories={subcategories}
                        onProductTypeUpdated={handleProductTypeUpdated}
                        onProductTypeDeleted={handleProductTypeDeleted}
                    />
                </TabsContent>
            </Tabs>

            {/* Create Dialogs */}
            <CreateCategoryDialog
                open={showCreateCategory}
                onOpenChange={setShowCreateCategory}
                onCategoryCreated={handleCategoryCreated}
            />

            <CreateSubcategoryDialog
                open={showCreateSubcategory}
                onOpenChange={setShowCreateSubcategory}
                categories={categories}
                onSubcategoryCreated={handleSubcategoryCreated}
            />

            <CreateProductTypeDialog
                open={showCreateProductType}
                onOpenChange={setShowCreateProductType}
                subcategories={subcategories}
                onProductTypeCreated={handleProductTypeCreated}
            />
        </div>
    );
}
