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

interface UserData {
    email: string;
    password: string;
    name: string;
    role: "admin" | "user";
}

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: UserData) => void;
    title: string;
    initialData?: Partial<UserData>;
    isLoading?: boolean;
}

export const UserModal: React.FC<UserModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    initialData,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState<UserData>({
        email: "",
        password: "",
        name: "",
        role: "user",
    });

    const [errors, setErrors] = useState<Partial<UserData>>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                email: initialData.email || "",
                password: initialData.password || "",
                name: initialData.name || "",
                role: initialData.role || "user",
            });
        } else {
            setFormData({
                email: "",
                password: "",
                name: "",
                role: "user",
            });
        }
        setErrors({});
    }, [initialData, isOpen]);

    const validateForm = (): boolean => {
        const newErrors: Partial<UserData> = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        // Only require password for new users
        if (!initialData && !formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (formData.password && formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            // Don't send password if it's empty (for updates)
            const submitData = { ...formData };
            if (!submitData.password) {
                delete submitData.password;
            }
            onSubmit(submitData as UserData);
        }
    };

    const handleInputChange = (field: keyof UserData, value: string) => {
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
                            ? "Update user information"
                            : "Add new user"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Full Name *
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    handleInputChange("name", e.target.value)
                                }
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                                    errors.name
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email *
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    handleInputChange("email", e.target.value)
                                }
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                                    errors.email
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                                required
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Password {!initialData && "*"}
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) =>
                                    handleInputChange(
                                        "password",
                                        e.target.value
                                    )
                                }
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                                    errors.password
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                                placeholder={
                                    initialData
                                        ? "Leave blank to keep current password"
                                        : "Enter password"
                                }
                                required={!initialData}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="role"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Role *
                            </label>
                            <select
                                id="role"
                                value={formData.role}
                                onChange={(e) =>
                                    handleInputChange(
                                        "role",
                                        e.target.value as "admin" | "user"
                                    )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
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
