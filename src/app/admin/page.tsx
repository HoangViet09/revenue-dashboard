"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useAdminDashboard,
  useAdminRevenueData,
  useSaveRevenueData,
  useUpdateRevenueData,
  useDeleteRevenueData,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from "@/hooks/api/useAdmin";
import { useEventsList } from "@/hooks/api/useEvents";
import { useUsers } from "@/hooks/api/useAuth";
import { RevenueModal } from "@/components/modals/RevenueModal";
import { EventModal } from "@/components/modals/EventModal";
import { UserModal } from "@/components/modals/UserModal";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { useToast } from "@/hooks/use-toast";
import { queryClient, queryKeys } from "@/lib/react-query";

export default function AdminPage() {
  const {
    isAuthenticated,
    isAdmin,
    user,
    logout,
    isLoading: authLoading,
  } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"revenue" | "events" | "users">(
    "revenue"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  // Modal states
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState<any>(null);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deletingRevenue, setDeletingRevenue] = useState<string | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<string | null>(null);

  // API hooks
  const { data: dashboardData, isLoading: dashboardLoading } =
    useAdminDashboard();
  const { data: revenueData, isLoading: revenueLoading } = useAdminRevenueData({
    page: currentPage,
    limit,
  });
  const { data: eventsData, isLoading: eventsLoading } = useEventsList({
    page: currentPage,
    limit,
  });
  const { data: usersData, isLoading: usersLoading } = useUsers({
    page: currentPage,
    limit,
  });

  // Mutation hooks
  const saveRevenueMutation = useSaveRevenueData();
  const updateRevenueMutation = useUpdateRevenueData();
  const deleteRevenueMutation = useDeleteRevenueData();
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  // Toast hook
  const { toast } = useToast();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!isAdmin) {
      router.push("/");
      return;
    }
  }, [isAuthenticated, isAdmin, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleSaveRevenueData = async (data: {
    date: string;
    posRevenue: number;
    eatclubRevenue: number;
    labourCosts: number;
    covers: number;
  }) => {
    try {
      await saveRevenueMutation.mutateAsync(data);
      setIsRevenueModalOpen(false);
      setEditingRevenue(null);

      // Revalidate all related data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.revenue.all }),
        queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] }),
        queryClient.invalidateQueries({
          queryKey: [
            "admin",
            "revenue",
            {
              page: revenueData?.pagination?.page,
              limit: revenueData?.pagination?.limit,
            },
          ],
        }),
        queryClient.refetchQueries({ queryKey: queryKeys.revenue.dashboard() }),
      ]);

      toast({
        title: "Success",
        description: "Revenue data has been saved successfully.",
        variant: "success",
      });
    } catch (error: any) {
      console.error("Error saving revenue data:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Failed to save revenue data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRevenueData = async (data: {
    date: string;
    posRevenue: number;
    eatclubRevenue: number;
    labourCosts: number;
    covers: number;
  }) => {
    try {
      await updateRevenueMutation.mutateAsync({
        date: editingRevenue?.date || data.date,
        data,
      });
      setIsRevenueModalOpen(false);
      setEditingRevenue(null);

      // Revalidate all related data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.revenue.all }),
        queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] }),
        queryClient.invalidateQueries({
          queryKey: [
            "admin",
            "revenue",
            {
              page: revenueData?.pagination?.page,
              limit: revenueData?.pagination?.limit,
            },
          ],
        }),
        queryClient.refetchQueries({ queryKey: queryKeys.revenue.dashboard() }),
      ]);

      toast({
        title: "Success",
        description: "Revenue data has been updated successfully.",
        variant: "success",
      });
    } catch (error: any) {
      console.error("Error updating revenue data:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Failed to update revenue data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRevenueData = async () => {
    if (deletingRevenue) {
      try {
        await deleteRevenueMutation.mutateAsync(deletingRevenue);
        setIsDeleteModalOpen(false);
        setDeletingRevenue(null);

        // Revalidate all related data
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: queryKeys.revenue.all }),
          queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] }),
          queryClient.invalidateQueries({ queryKey: ["admin", "revenue"] }),
          queryClient.refetchQueries({
            queryKey: queryKeys.revenue.dashboard(),
          }),
        ]);

        toast({
          title: "Success",
          description: "Revenue data has been deleted successfully.",
          variant: "success",
        });
      } catch (error: any) {
        console.error("Error deleting revenue data:", error);
        toast({
          title: "Error",
          description:
            error?.response?.data?.message ||
            "Failed to delete revenue data. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const openAddRevenueModal = () => {
    setEditingRevenue(null);
    setIsRevenueModalOpen(true);
  };

  const openEditRevenueModal = (revenue: any) => {
    setEditingRevenue(revenue);
    setIsRevenueModalOpen(true);
  };

  const openDeleteRevenueModal = (date: string) => {
    setDeletingRevenue(date);
    setIsDeleteModalOpen(true);
  };

  const handleCreateEvent = async (data: {
    date: string;
    type: "positive" | "negative";
    impact: number;
    description: string;
  }) => {
    try {
      await createEventMutation.mutateAsync(data);
      setIsEventModalOpen(false);
      setEditingEvent(null);

      // Revalidate all related data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.events.all }),
        queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] }),
        queryClient.refetchQueries({ queryKey: queryKeys.events.list() }),
      ]);

      toast({
        title: "Success",
        description: "Event has been created successfully.",
        variant: "success",
      });
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Failed to create event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateEvent = async (data: {
    date: string;
    type: "positive" | "negative";
    impact: number;
    description: string;
  }) => {
    try {
      await updateEventMutation.mutateAsync({
        eventId: editingEvent?.id || "",
        data,
      });
      setIsEventModalOpen(false);
      setEditingEvent(null);

      // Revalidate all related data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.events.all }),
        queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] }),
        queryClient.refetchQueries({ queryKey: queryKeys.events.list() }),
      ]);

      toast({
        title: "Success",
        description: "Event has been updated successfully.",
        variant: "success",
      });
    } catch (error: any) {
      console.error("Error updating event:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Failed to update event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async () => {
    if (deletingEvent) {
      try {
        await deleteEventMutation.mutateAsync(deletingEvent);
        setIsDeleteModalOpen(false);
        setDeletingEvent(null);

        // Revalidate all related data
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: queryKeys.events.all }),
          queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] }),
          queryClient.refetchQueries({ queryKey: queryKeys.events.list() }),
        ]);

        toast({
          title: "Success",
          description: "Event has been deleted successfully.",
          variant: "success",
        });
      } catch (error: any) {
        console.error("Error deleting event:", error);
        toast({
          title: "Error",
          description:
            error?.response?.data?.message ||
            "Failed to delete event. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const openAddEventModal = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  const openEditEventModal = (event: any) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const openDeleteEventModal = (id: string) => {
    setDeletingEvent(id);
    setIsDeleteModalOpen(true);
  };

  // User management handlers
  const handleCreateUser = async (data: {
    email: string;
    password: string;
    name: string;
    role: "admin" | "user";
  }) => {
    try {
      // This would call the register API
      console.log("Creating user:", data);
      setIsUserModalOpen(false);
      setEditingUser(null);

      // Revalidate all related data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.all }),
        queryClient.refetchQueries({ queryKey: queryKeys.auth.users() }),
      ]);

      toast({
        title: "Success",
        description: "User has been created successfully.",
        variant: "success",
      });
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Failed to create user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (data: {
    email: string;
    password?: string;
    name: string;
    role: "admin" | "user";
  }) => {
    try {
      // This would call the update user API
      console.log("Updating user:", editingUser?.id, data);
      setIsUserModalOpen(false);
      setEditingUser(null);

      // Revalidate all related data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.all }),
        queryClient.refetchQueries({ queryKey: queryKeys.auth.users() }),
      ]);

      toast({
        title: "Success",
        description: "User has been updated successfully.",
        variant: "success",
      });
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Failed to update user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (deletingUser) {
      try {
        // This would call the delete user API
        console.log("Deleting user:", deletingUser);
        setIsDeleteModalOpen(false);
        setDeletingUser(null);

        // Revalidate all related data
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: queryKeys.auth.all }),
          queryClient.refetchQueries({ queryKey: queryKeys.auth.users() }),
        ]);

        toast({
          title: "Success",
          description: "User has been deleted successfully.",
          variant: "success",
        });
      } catch (error: any) {
        console.error("Error deleting user:", error);
        toast({
          title: "Error",
          description:
            error?.response?.data?.message ||
            "Failed to delete user. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const openAddUserModal = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (user: any) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const openDeleteUserModal = (id: string) => {
    setDeletingUser(id);
    setIsDeleteModalOpen(true);
  };

  // Show loading while auth is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name} ({user?.role})
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Dashboard Overview */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Admin Dashboard Overview</CardTitle>
              <CardDescription>
                Key metrics and analytics for the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-gray-50 p-4 rounded-lg animate-pulse"
                    >
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : dashboardData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-600">
                      Total Revenue
                    </h3>
                    <p className="text-2xl font-bold text-blue-900">
                      ${dashboardData.revenue?.totalRevenue?.toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-600">
                      {dashboardData.revenue?.totalDays} days
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-green-600">
                      Average per Day
                    </h3>
                    <p className="text-2xl font-bold text-green-900">
                      ${dashboardData.revenue?.averagePerDay.toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600">
                      {dashboardData.revenue?.totalCovers} total covers
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-purple-600">
                      Total Events
                    </h3>
                    <p className="text-2xl font-bold text-purple-900">
                      {dashboardData.events?.totalEvents}
                    </p>
                    <p className="text-sm text-purple-600">
                      {dashboardData.events?.positiveEvents} positive,{" "}
                      {dashboardData.events?.negativeEvents} negative
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-orange-600">
                      Best Day
                    </h3>
                    <p className="text-2xl font-bold text-orange-900">
                      $
                      {dashboardData.revenue?.highestDay.revenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-orange-600">
                      {dashboardData.revenue?.highestDay.date}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No dashboard data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("revenue")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "revenue"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Revenue Data
            </button>
            {/* <button
              onClick={() => setActiveTab("events")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "events"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "users"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              User Management
            </button> */}
          </nav>
        </div>

        {/* Revenue Data Tab */}
        {activeTab === "revenue" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Data Management</CardTitle>
                <CardDescription>
                  Manage daily revenue data for the dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">
                      Current Revenue Data
                    </h3>
                    <div className="flex space-x-2">
                      <Button
                        onClick={openAddRevenueModal}
                        disabled={saveRevenueMutation.isPending}
                      >
                        {saveRevenueMutation.isPending
                          ? "Saving..."
                          : "Add New Revenue Data"}
                      </Button>
                    </div>
                  </div>

                  {revenueLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">
                        Loading revenue data...
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              POS Revenue
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              EatClub Revenue
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Labour Costs
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Covers
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total Revenue
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Net Revenue
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {revenueData?.data?.map((row) => (
                            <tr key={row.date}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {row.date}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ${row.posRevenue.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ${row.eatclubRevenue.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ${row.labourCosts.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {row.covers}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ${row.totalRevenue.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ${row.netRevenue.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditRevenueModal(row)}
                                    disabled={updateRevenueMutation.isPending}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      openDeleteRevenueModal(row.date)
                                    }
                                    disabled={deleteRevenueMutation.isPending}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )) || []}
                        </tbody>
                      </table>

                      {revenueData?.pagination && (
                        <div className="mt-4 flex justify-between items-center">
                          <p className="text-sm text-gray-700">
                            Showing{" "}
                            {(revenueData.pagination.page - 1) *
                              revenueData.pagination.limit +
                              1}{" "}
                            to{" "}
                            {Math.min(
                              revenueData.pagination.page *
                                revenueData.pagination.limit,
                              revenueData.pagination.total
                            )}{" "}
                            of {revenueData.pagination.total} results
                          </p>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                              }
                              disabled={!revenueData.pagination.hasPrev}
                            >
                              Previous
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage((prev) => prev + 1)}
                              disabled={!revenueData.pagination.hasNext}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Management</CardTitle>
                <CardDescription>
                  Manage events that impact revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Current Events</h3>
                    <Button
                      onClick={openAddEventModal}
                      disabled={createEventMutation.isPending}
                    >
                      {createEventMutation.isPending
                        ? "Creating..."
                        : "Create Event"}
                    </Button>
                  </div>

                  {eventsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">
                        Loading events...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {eventsData?.events?.map((event) => (
                        <div key={event._id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {event.description}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Date: {event.date} | Impact: {event.impact}%
                              </p>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  event.type === "positive"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {event.type}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditEventModal(event)}
                                disabled={updateEventMutation.isPending}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openDeleteEventModal(event._id)}
                                disabled={deleteEventMutation.isPending}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      )) || []}

                      {eventsData?.pagination && (
                        <div className="mt-4 flex justify-between items-center">
                          <p className="text-sm text-gray-700">
                            Showing{" "}
                            {(eventsData.pagination.page - 1) *
                              eventsData.pagination.limit +
                              1}{" "}
                            to{" "}
                            {Math.min(
                              eventsData.pagination.page *
                                eventsData.pagination.limit,
                              eventsData.pagination.total
                            )}{" "}
                            of {eventsData.pagination.total} results
                          </p>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                              }
                              disabled={!eventsData.pagination.hasPrev}
                            >
                              Previous
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage((prev) => prev + 1)}
                              disabled={!eventsData.pagination.hasNext}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage system users and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">System Users</h3>
                    <Button onClick={openAddUserModal} disabled={usersLoading}>
                      {usersLoading ? "Loading..." : "Add User"}
                    </Button>
                  </div>

                  {usersLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">
                        Loading users...
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Created At
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {usersData?.users?.map((user) => (
                            <tr key={user._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {user.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {user.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    user.role === "admin"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditUserModal(user)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      openDeleteUserModal(user._id)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )) || []}
                        </tbody>
                      </table>

                      {usersData?.pagination && (
                        <div className="mt-4 flex justify-between items-center">
                          <p className="text-sm text-gray-700">
                            Showing{" "}
                            {(usersData.pagination.page - 1) *
                              usersData.pagination.limit +
                              1}{" "}
                            to{" "}
                            {Math.min(
                              usersData.pagination.page *
                                usersData.pagination.limit,
                              usersData.pagination.total
                            )}{" "}
                            of {usersData.pagination.total} results
                          </p>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                              }
                              disabled={!usersData.pagination.hasPrev}
                            >
                              Previous
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage((prev) => prev + 1)}
                              disabled={!usersData.pagination.hasNext}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Revenue Modal */}
      <RevenueModal
        isOpen={isRevenueModalOpen}
        onClose={() => {
          setIsRevenueModalOpen(false);
          setEditingRevenue(null);
        }}
        onSubmit={
          editingRevenue ? handleUpdateRevenueData : handleSaveRevenueData
        }
        title={editingRevenue ? "Edit Revenue Data" : "Add Revenue Data"}
        initialData={editingRevenue}
        isLoading={
          editingRevenue
            ? updateRevenueMutation.isPending
            : saveRevenueMutation.isPending
        }
      />

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
        title={editingEvent ? "Edit Event" : "Add Event"}
        initialData={editingEvent}
        isLoading={
          editingEvent
            ? updateEventMutation.isPending
            : createEventMutation.isPending
        }
      />

      {/* User Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
        title={editingUser ? "Edit User" : "Add User"}
        initialData={editingUser}
        isLoading={false} // No loading state for user operations yet
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingRevenue(null);
          setDeletingEvent(null);
          setDeletingUser(null);
        }}
        onConfirm={() => {
          if (deletingRevenue) {
            handleDeleteRevenueData();
          } else if (deletingEvent) {
            handleDeleteEvent();
          } else if (deletingUser) {
            handleDeleteUser();
          }
        }}
        title={
          deletingRevenue
            ? "Delete Revenue Data"
            : deletingEvent
            ? "Delete Event"
            : deletingUser
            ? "Delete User"
            : "Confirm Delete"
        }
        message={
          deletingRevenue
            ? `Are you sure you want to delete revenue data for ${deletingRevenue}? This action cannot be undone.`
            : deletingEvent
            ? "Are you sure you want to delete this event? This action cannot be undone."
            : deletingUser
            ? "Are you sure you want to delete this user? This action cannot be undone."
            : "Are you sure you want to delete this item? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        isLoading={
          deleteRevenueMutation.isPending || deleteEventMutation.isPending
        }
      />
    </div>
  );
}
