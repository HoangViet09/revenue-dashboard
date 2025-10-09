"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface RevenueData {
    date: string;
    posRevenue: number;
    eatclubRevenue: number;
    labourCosts: number;
    covers: number;
}

interface RevenueModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: RevenueData) => void;
    title: string;
    initialData?: Partial<RevenueData>;
    isLoading?: boolean;
}

export const RevenueModal: React.FC<RevenueModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    initialData,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState<RevenueData>({
        date: "",
        posRevenue: 0,
        eatclubRevenue: 0,
        labourCosts: 0,
        covers: 0,
    });

    const [errors, setErrors] = useState<Partial<RevenueData>>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                date: initialData.date || "",
                posRevenue: initialData.posRevenue || 0,
                eatclubRevenue: initialData.eatclubRevenue || 0,
                labourCosts: initialData.labourCosts || 0,
                covers: initialData.covers || 0,
            });
        } else {
            setFormData({
                date: "",
                posRevenue: 0,
                eatclubRevenue: 0,
                labourCosts: 0,
                covers: 0,
            });
        }
        setErrors({});
    }, [initialData, isOpen]);

    const validateForm = (): boolean => {
        const newErrors: Partial<RevenueData> = {};

        if (!formData.date) {
            newErrors.date = "Date is required";
        }

        if (formData.posRevenue < 0) {
            newErrors.posRevenue = "POS Revenue cannot be negative";
        }

        if (formData.eatclubRevenue < 0) {
            newErrors.eatclubRevenue = "EatClub Revenue cannot be negative";
        }

        if (formData.labourCosts < 0) {
            newErrors.labourCosts = "Labour Costs cannot be negative";
        }

        if (formData.covers < 0) {
            newErrors.covers = "Covers cannot be negative";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleInputChange = (
        field: keyof RevenueData,
        value: string | number
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>
                        {initialData
                            ? "Update revenue data"
                            : "Add new revenue data"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="date"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Date *
                            </label>
                            <input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) =>
                                    handleInputChange("date", e.target.value)
                                }
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                                    errors.date
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                                required
                            />
                            {errors.date && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.date}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="posRevenue"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                POS Revenue
                            </label>
                            <input
                                id="posRevenue"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.posRevenue}
                                onChange={(e) =>
                                    handleInputChange(
                                        "posRevenue",
                                        parseFloat(e.target.value) || 0
                                    )
                                }
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                                    errors.posRevenue
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                            />
                            {errors.posRevenue && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.posRevenue}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="eatclubRevenue"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                EatClub Revenue
                            </label>
                            <input
                                id="eatclubRevenue"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.eatclubRevenue}
                                onChange={(e) =>
                                    handleInputChange(
                                        "eatclubRevenue",
                                        parseFloat(e.target.value) || 0
                                    )
                                }
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                                    errors.eatclubRevenue
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                            />
                            {errors.eatclubRevenue && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.eatclubRevenue}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="labourCosts"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Labour Costs
                            </label>
                            <input
                                id="labourCosts"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.labourCosts}
                                onChange={(e) =>
                                    handleInputChange(
                                        "labourCosts",
                                        parseFloat(e.target.value) || 0
                                    )
                                }
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                                    errors.labourCosts
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                            />
                            {errors.labourCosts && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.labourCosts}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="covers"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Covers
                            </label>
                            <input
                                id="covers"
                                type="number"
                                min="0"
                                value={formData.covers}
                                onChange={(e) =>
                                    handleInputChange(
                                        "covers",
                                        parseInt(e.target.value) || 0
                                    )
                                }
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                                    errors.covers
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                            />
                            {errors.covers && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.covers}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading
                                    ? "Saving..."
                                    : initialData
                                    ? "Update"
                                    : "Add"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
