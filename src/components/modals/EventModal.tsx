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

interface EventData {
    date: string;
    type: "positive" | "negative";
    impact: number;
    description: string;
}

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: EventData) => void;
    title: string;
    initialData?: Partial<EventData>;
    isLoading?: boolean;
}

export const EventModal: React.FC<EventModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    initialData,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState<EventData>({
        date: "",
        type: "positive",
        impact: 0,
        description: "",
    });

    const [errors, setErrors] = useState<Partial<EventData>>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                date: initialData.date || "",
                type: initialData.type || "positive",
                impact: initialData.impact || 0,
                description: initialData.description || "",
            });
        } else {
            setFormData({
                date: "",
                type: "positive",
                impact: 0,
                description: "",
            });
        }
        setErrors({});
    }, [initialData, isOpen]);

    const validateForm = (): boolean => {
        const newErrors: Partial<EventData> = {};

        if (!formData.date) {
            newErrors.date = "Date is required";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        }

        if (formData.impact < 0) {
            newErrors.impact = "Impact cannot be negative";
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
        field: keyof EventData,
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
                            ? "Update event data"
                            : "Add new event data"}
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
                                htmlFor="type"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Event Type *
                            </label>
                            <select
                                id="type"
                                value={formData.type}
                                onChange={(e) =>
                                    handleInputChange(
                                        "type",
                                        e.target.value as
                                            | "positive"
                                            | "negative"
                                    )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            >
                                <option value="positive">Positive</option>
                                <option value="negative">Negative</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="impact"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Impact ($)
                            </label>
                            <input
                                id="impact"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.impact}
                                onChange={(e) =>
                                    handleInputChange(
                                        "impact",
                                        parseFloat(e.target.value) || 0
                                    )
                                }
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                                    errors.impact
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                            />
                            {errors.impact && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.impact}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Description *
                            </label>
                            <textarea
                                id="description"
                                rows={3}
                                value={formData.description}
                                onChange={(e) =>
                                    handleInputChange(
                                        "description",
                                        e.target.value
                                    )
                                }
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                                    errors.description
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                                placeholder="Describe the event..."
                                required
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.description}
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
