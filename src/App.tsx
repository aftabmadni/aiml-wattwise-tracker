import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ApplianceProvider, useAppliances } from "./contexts/ApplianceContext";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { OnboardingPage } from "./components/OnboardingPage";
import { AppLayout } from "./components/AppLayout";
import { DashboardPage } from "./components/DashboardPage";
import { ReportsPage } from "./components/ReportsPage";
import { PaymentsPage } from "./components/PaymentsPage";
import { SettingsPage } from "./components/SettingsPage";
import { NotificationCenter } from "./components/NotificationCenter";
import { Toaster } from "./components/ui/sonner";
import { notificationsApi, insightsApi, usageApi } from "./lib/mockApi";

type AuthScreen = "login" | "register" | "forgot-password";
type AppPage = "dashboard" | "reports" | "payments" | "settings";

function AppContent() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { hasCompletedOnboarding, loading: applianceLoading } = useAppliances();
  const [authScreen, setAuthScreen] = useState<AuthScreen>("login");
  const [currentPage, setCurrentPage] = useState<AppPage>("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<any>(null);
  const [actualBillAmount, setActualBillAmount] = useState<number | null>(null);

  // Load notifications and prediction on mount
  React.useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      loadPrediction();
      loadActualBill();
    }
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      const data = await notificationsApi.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  const loadPrediction = async () => {
    try {
      const data = await insightsApi.getPrediction();
      setPrediction(data);
    } catch (error) {
      console.error("Failed to load prediction:", error);
    }
  };

  const loadActualBill = async () => {
    try {
      const month = await usageApi.getAggregatedUsage("month");
      setActualBillAmount(month.totalCost);
    } catch (error) {
      console.error("Failed to load actual bill:", error);
    }
  };

  const handleMarkNotificationAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllNotificationsAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleNotificationNavigate = (path: string) => {
    if (path === "/dashboard") setCurrentPage("dashboard");
    else if (path === "/payments") setCurrentPage("payments");
    else if (path === "/settings") setCurrentPage("settings");
  };

  // Show loading state
  if (authLoading || applianceLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Electricity Usage Tracker...</p>
        </div>
      </div>
    );
  }

  // Show auth screens if not authenticated
  if (!isAuthenticated) {
    switch (authScreen) {
      case "register":
        return <RegisterPage onSwitchToLogin={() => setAuthScreen("login")} />;
      case "forgot-password":
        return (
          <ForgotPasswordPage onBackToLogin={() => setAuthScreen("login")} />
        );
      default:
        return (
          <LoginPage
            onSwitchToRegister={() => setAuthScreen("register")}
            onSwitchToForgotPassword={() => setAuthScreen("forgot-password")}
          />
        );
    }
  }

  // Show onboarding if user hasn't completed it
  if (!hasCompletedOnboarding) {
    return <OnboardingPage />;
  }

  // Get user preferences
  const currency = user?.preferences.currency || "INR";
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  // Render main app
  return (
    <>
      <AppLayout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        notificationCount={unreadNotifications}
        onNotificationClick={() => setShowNotifications(true)}
      >
        {currentPage === "dashboard" && <DashboardPage currency={currency} />}
        {currentPage === "reports" && <ReportsPage />}
        {currentPage === "payments" && (
          <PaymentsPage
            predictedBill={prediction?.predictedCost || 2284}
            actualBill={actualBillAmount ?? 2410}
            currency={currency}
          />
        )}
        {currentPage === "settings" && <SettingsPage />}
      </AppLayout>

      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onNavigate={handleNotificationNavigate}
      />

      <Toaster position="top-right" richColors />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ApplianceProvider>
        <AppContent />
      </ApplianceProvider>
    </AuthProvider>
  );
}
