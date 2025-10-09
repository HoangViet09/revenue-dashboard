"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Zod schema for validation
const revenueFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  posRevenue: z.number().min(0, "POS Revenue must be non-negative"),
  eatclubRevenue: z.number().min(0, "Eatclub Revenue must be non-negative"),
  labourCosts: z.number().min(0, "Labour Costs must be non-negative"),
  covers: z.number().min(0, "Covers must be non-negative"),
});

type RevenueFormValues = z.infer<typeof revenueFormSchema>;

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
  const form = useForm<RevenueFormValues>({
    resolver: zodResolver(revenueFormSchema),
    defaultValues: {
      date: "",
      posRevenue: 0,
      eatclubRevenue: 0,
      labourCosts: 0,
      covers: 0,
    },
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        date: initialData.date || "",
        posRevenue: initialData.posRevenue || 0,
        eatclubRevenue: initialData.eatclubRevenue || 0,
        labourCosts: initialData.labourCosts || 0,
        covers: initialData.covers || 0,
      });
    } else {
      form.reset({
        date: "",
        posRevenue: 0,
        eatclubRevenue: 0,
        labourCosts: 0,
        covers: 0,
      });
    }
  }, [initialData, isOpen, form]);

  const handleSubmit = (values: RevenueFormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Enter the revenue data for the selected date. All fields are
            required.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input className="block" type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="posRevenue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>POS Revenue ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eatclubRevenue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Eatclub Revenue ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="labourCosts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Labour Costs ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="covers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Covers (Number of customers)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
