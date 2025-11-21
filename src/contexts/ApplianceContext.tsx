import React, { createContext, useContext, useState, useEffect } from "react";
import { Appliance } from "../lib/applianceTypes";
import { useAuth } from "./AuthContext";

interface ApplianceContextType {
  appliances: Appliance[];
  addAppliance: (appliance: Omit<Appliance, "id" | "createdAt">) => void;
  updateAppliance: (
    id: string,
    appliance: Omit<Appliance, "id" | "createdAt">
  ) => void;
  deleteAppliance: (id: string) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  loading: boolean;
}

const ApplianceContext = createContext<ApplianceContextType | undefined>(
  undefined
);

const getStorageKey = (userId: string) => `wattwise_appliances_${userId}`;
const getOnboardingKey = (userId: string) =>
  `wattwise_onboarding_complete_${userId}`;

export const useAppliances = () => {
  const context = useContext(ApplianceContext);
  if (!context) {
    throw new Error("useAppliances must be used within ApplianceProvider");
  }
  return context;
};

export const ApplianceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, updateUser } = useAuth();
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load appliances from localStorage on mount or when user changes
  useEffect(() => {
    if (user?.id) {
      try {
        const stored = localStorage.getItem(getStorageKey(user.id));
        const onboardingComplete = localStorage.getItem(
          getOnboardingKey(user.id)
        );

        if (stored) {
          const parsed = JSON.parse(stored);
          setAppliances(parsed);
        } else {
          setAppliances([]); // Reset appliances for new user
        }

        setHasCompletedOnboarding(onboardingComplete === "true");
      } catch (error) {
        console.error("Failed to load appliances from localStorage:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setAppliances([]);
      setHasCompletedOnboarding(false);
      setLoading(false);
    }
  }, [user?.id]);

  // Save appliances to localStorage whenever they change
  useEffect(() => {
    if (!loading && user?.id) {
      try {
        localStorage.setItem(
          getStorageKey(user.id),
          JSON.stringify(appliances)
        );
      } catch (error) {
        console.error("Failed to save appliances to localStorage:", error);
      }
    }
  }, [appliances, loading, user?.id]);

  const addAppliance = (applianceData: Omit<Appliance, "id" | "createdAt">) => {
    const newAppliance: Appliance = {
      ...applianceData,
      id: `appliance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    setAppliances((prev) => {
      const updated = [...prev, newAppliance];
      if (user) updateUser({ appliances: updated });
      return updated;
    });
  };

  const updateAppliance = (
    id: string,
    applianceData: Omit<Appliance, "id" | "createdAt">
  ) => {
    setAppliances((prev) => {
      const updated = prev.map((appliance) =>
        appliance.id === id ? { ...appliance, ...applianceData } : appliance
      );
      if (user) updateUser({ appliances: updated });
      return updated;
    });
  };

  const deleteAppliance = (id: string) => {
    setAppliances((prev) => {
      const updated = prev.filter((appliance) => appliance.id !== id);
      if (user) updateUser({ appliances: updated });
      return updated;
    });
  };

  const completeOnboarding = () => {
    if (user?.id) {
      setHasCompletedOnboarding(true);
      localStorage.setItem(getOnboardingKey(user.id), "true");
    }
  };

  const value: ApplianceContextType = {
    appliances,
    addAppliance,
    updateAppliance,
    deleteAppliance,
    hasCompletedOnboarding,
    completeOnboarding,
    loading,
  };

  return (
    <ApplianceContext.Provider value={value}>
      {children}
    </ApplianceContext.Provider>
  );
};
