// Appliance-specific types for WattWise

export interface Appliance {
  id: string;
  name: string;
  powerWatts: number; // Power consumption in Watts
  hoursPerDay: number;
  daysPerMonth: number;
  createdAt: string;
}

export interface ApplianceUsageCalculation {
  appliance: Appliance;
  monthlyKWh: number;
  monthlyCost: number;
  dailyKWh: number;
  dailyCost: number;
}

export interface ApplianceSummary {
  totalMonthlyKWh: number;
  totalMonthlyCost: number;
  totalAppliances: number;
  topConsumer: ApplianceUsageCalculation | null;
  potentialSavingsPercent: number;
}

// Calculate energy usage for a single appliance
export const calculateApplianceUsage = (
  appliance: Appliance,
  costPerKWh: number = 8
): ApplianceUsageCalculation => {
  // Monthly kWh = (Watts / 1000) * Hours/Day * Days/Month
  const monthlyKWh =
    (appliance.powerWatts / 1000) *
    appliance.hoursPerDay *
    appliance.daysPerMonth;
  const monthlyCost = monthlyKWh * costPerKWh;

  const dailyKWh = (appliance.powerWatts / 1000) * appliance.hoursPerDay;
  const dailyCost = dailyKWh * costPerKWh;

  return {
    appliance,
    monthlyKWh: parseFloat(monthlyKWh.toFixed(2)),
    monthlyCost: parseFloat(monthlyCost.toFixed(2)),
    dailyKWh: parseFloat(dailyKWh.toFixed(2)),
    dailyCost: parseFloat(dailyCost.toFixed(2)),
  };
};

// Calculate summary for all appliances
export const calculateApplianceSummary = (
  appliances: Appliance[],
  costPerKWh: number = 8
): ApplianceSummary => {
  if (appliances.length === 0) {
    return {
      totalMonthlyKWh: 0,
      totalMonthlyCost: 0,
      totalAppliances: 0,
      topConsumer: null,
      potentialSavingsPercent: 0,
    };
  }

  const calculations = appliances.map((a) =>
    calculateApplianceUsage(a, costPerKWh)
  );

  const totalMonthlyKWh = calculations.reduce(
    (sum, calc) => sum + calc.monthlyKWh,
    0
  );
  const totalMonthlyCost = calculations.reduce(
    (sum, calc) => sum + calc.monthlyCost,
    0
  );

  // Find top consumer
  const topConsumer = calculations.reduce((max, calc) =>
    calc.monthlyKWh > (max?.monthlyKWh || 0) ? calc : max
  );

  // Calculate potential savings (simple heuristic: 10-20% based on usage patterns)
  const avgHoursPerDay =
    appliances.reduce((sum, a) => sum + a.hoursPerDay, 0) / appliances.length;
  const potentialSavingsPercent =
    avgHoursPerDay > 10 ? 20 : avgHoursPerDay > 6 ? 15 : 10;

  return {
    totalMonthlyKWh: parseFloat(totalMonthlyKWh.toFixed(2)),
    totalMonthlyCost: parseFloat(totalMonthlyCost.toFixed(2)),
    totalAppliances: appliances.length,
    topConsumer,
    potentialSavingsPercent,
  };
};

// Generate AI insights based on appliances
export const generateApplianceInsights = (
  appliances: Appliance[],
  summary: ApplianceSummary
): string[] => {
  const insights: string[] = [];

  // Only generate insights for appliances present in the user's list
  if (appliances.length === 0) {
    return [
      "Add appliances to get personalized AI-powered insights based on your usage.",
    ];
  }

  // Only generate insights for appliances present in the user's list
  if (appliances.length === 0) {
    return [
      "Add appliances to get personalized AI-powered insights based on your usage.",
    ];
  }

  // Always show top consumer insight for the user's added appliance
  if (summary.topConsumer) {
    insights.push(
      `Your ${summary.topConsumer.appliance.name} consumes the most energy at ${
        summary.topConsumer.monthlyKWh
      } kWh/month. Consider reducing usage by 1-2 hours daily to save ₹${(
        summary.topConsumer.monthlyCost * 0.15
      ).toFixed(0)}/month.`
    );
  }

  // Only show high usage insights for appliances the user has actually added
  const highUsageAppliances = appliances.filter((a) => a.hoursPerDay > 8);
  if (highUsageAppliances.length > 0) {
    const applianceNames = highUsageAppliances.map((a) => a.name).join(", ");
    const costPerKWh = 8; // ₹8 per kWh
    const totalHighUsageCost = highUsageAppliances.reduce((sum, app) => {
      const usage = calculateApplianceUsage(app, costPerKWh);
      return sum + usage.monthlyCost;
    }, 0);

    insights.push(
      `Your ${applianceNames} ${
        highUsageAppliances.length > 1 ? "are" : "is"
      } running more than 8 hours daily. At ₹8/kWh, optimizing ${
        highUsageAppliances.length > 1 ? "their" : "its"
      } usage can save up to ${summary.potentialSavingsPercent}% (₹${(
        (totalHighUsageCost * summary.potentialSavingsPercent) /
        100
      ).toFixed(0)}/month).`
    );
  }

  // Only show total consumption insight if the user's appliances exceed threshold
  if (summary.totalMonthlyKWh > 300) {
    insights.push(
      `Your total consumption is ${summary.totalMonthlyKWh} kWh/month. Switching to energy-efficient appliances could reduce this by 25-30%.`
    );
  }

  if (insights.length === 0) {
    insights.push(
      `Great job! Your appliance usage is well-optimized. You can save up to ${summary.potentialSavingsPercent}% by using appliances during off-peak hours.`
    );
  }

  return insights;
};
