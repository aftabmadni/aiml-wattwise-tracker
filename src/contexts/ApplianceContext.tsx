import React, { createContext, useContext, useState, useEffect } from "react";
import { Appliance } from "../lib/applianceTypes";
import { useAuth } from "./AuthContext";

interface ApplianceContextType {
  appliances: Appliance[];
  usageData: UsageData[];
  carbonFootprint: CarbonFootprint;
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

export const ApplianceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Carbon footprint calculation
  const calculateCarbonFootprint = (appliances: Appliance[]): CarbonFootprint => {
    // Assume 0.85 kg CO2 per kWh (India avg), randomize by ±10%
    const CO2_PER_KWH = 0.85;
    let totalKWh = 0;
    appliances.forEach(app => {
      const dailyKWh = (app.powerWatts * app.hoursPerDay) / 1000;
      totalKWh += dailyKWh * (app.daysPerMonth || 30);
    });
    const randomFactor = 0.9 + Math.random() * 0.2;
    const co2Kg = parseFloat((totalKWh * CO2_PER_KWH * randomFactor).toFixed(2));
    // Trees: 1 tree offsets ~21.77kg CO2/year, so for a month:
    const treesEquivalent = co2Kg > 0 ? parseFloat((co2Kg / (21.77/12)).toFixed(2)) : 0;
    return {
      co2Kg,
      treesEquivalent,
      comparisonText: `Equivalent to ${co2Kg > 0 ? (co2Kg * 0.4).toFixed(1) : 0} km driven by car`,
    };
  };
  const { user, updateUser } = useAuth();
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  const [carbonFootprint, setCarbonFootprint] = useState<CarbonFootprint>(calculateCarbonFootprint([]));
  useEffect(() => {
    setCarbonFootprint(calculateCarbonFootprint(appliances));
  }, [appliances]);

  // Load appliances and usageData from localStorage on mount or when user changes
  useEffect(() => {
    if (user?.id) {
      try {
        const stored = localStorage.getItem(getStorageKey(user.id));
        const onboardingComplete = localStorage.getItem(getOnboardingKey(user.id));
        const storedUsage = localStorage.getItem(`wattwise_usage_${user.id}`);

        if (stored) {
          const parsed = JSON.parse(stored);
          setAppliances(parsed);
        } else {
          setAppliances([]);
        }

        if (storedUsage) {
          setUsageData(JSON.parse(storedUsage));
        } else {
          setUsageData([]);
        }

        setHasCompletedOnboarding(onboardingComplete === "true");
      } catch (error) {
        console.error("Failed to load appliances/usage from localStorage:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setAppliances([]);
      setUsageData([]);
      setHasCompletedOnboarding(false);
      setLoading(false);
    }
  }, [user?.id]);

  // Save appliances and usageData to localStorage whenever they change
  useEffect(() => {
    if (!loading && user?.id) {
      try {
        localStorage.setItem(getStorageKey(user.id), JSON.stringify(appliances));
        localStorage.setItem(`wattwise_usage_${user.id}`, JSON.stringify(usageData));
      } catch (error) {
        console.error("Failed to save appliances/usage to localStorage:", error);
      }
    }
  }, [appliances, usageData, loading, user?.id]);

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

    // Generate random usage data for the new appliance (last 7 days)
    const costPerKWh = 8;
    const now = new Date();
    const newUsage: UsageData[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const units = ((newAppliance.powerWatts * newAppliance.hoursPerDay) / 1000) * (0.7 + Math.random() * 0.6); // randomize 70%-130%
      newUsage.push({
        timestamp: day.toISOString(),
        unitsConsumed: parseFloat(units.toFixed(2)),
        deviceId: newAppliance.id,
        cost: parseFloat((units * costPerKWh).toFixed(2)),
      });
    }
    setUsageData((prev) => [...prev, ...newUsage]);
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
    usageData,
    carbonFootprint,
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
