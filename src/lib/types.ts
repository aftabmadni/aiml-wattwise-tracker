// Core TypeScript types for WattWise application

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  currency: 'INR' | 'USD' | 'EUR';
  units: 'kWh' | 'MWh';
  monthlyBudget: number;
  notifications: {
    email: boolean;
    push: boolean;
    aiInsights: boolean;
  };
  language: 'en' | 'hi';
}

export interface UsageData {
  timestamp: string;
  unitsConsumed: number; // kWh
  deviceId?: string;
  temperature?: number;
  regionCode?: string;
  cost?: number;
}

export interface AggregatedUsage {
  period: 'today' | 'week' | 'month' | 'year';
  totalUnits: number;
  totalCost: number;
  avgDaily: number;
  peakHour: number;
  offPeakHour: number;
}

export interface Prediction {
  predictedUnits: number;
  predictedCost: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  accuracy: number; // MAE or RMSE
  generatedAt: string;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'tip' | 'achievement' | 'anomaly';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  action?: string;
  createdAt: string;
  read: boolean;
}

export interface DeviceUsage {
  deviceId: string;
  deviceName: string;
  deviceType: 'AC' | 'Refrigerator' | 'Water Heater' | 'Lights' | 'TV' | 'Washing Machine' | 'Other';
  percentage: number;
  units: number;
  cost: number;
  color: string;
}

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'failed';
  createdAt: string;
  razorpayOrderId?: string;
  currentMonthBill?: number; // Added to sync UI with current bill
}

export interface PaymentHistory {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending';
  method: 'razorpay' | 'upi' | 'card';
  transactionId?: string;
  billMonth: string;
  paidAt: string;
  receipt?: string;
}

export interface CarbonFootprint {
  co2Kg: number;
  treesEquivalent: number;
  comparisonText: string;
}

export interface SavingStreak {
  currentStreak: number;
  longestStreak: number;
  goalProgress: number; // percentage
  targetUnits: number;
  actualUnits: number;
}

export interface Notification {
  id: string;
  type: 'payment' | 'insight' | 'alert' | 'achievement';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface MonthlyReport {
  month: string;
  totalUnits: number;
  totalCost: number;
  avgDailyUnits: number;
  peakDay: string;
  savingsVsLastMonth: number;
  insights: AIInsight[];
  deviceBreakdown: DeviceUsage[];
  carbonFootprint: CarbonFootprint;
}
