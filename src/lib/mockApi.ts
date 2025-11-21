// Mock API layer for WattWise - simulates backend endpoints
import {
  User,
  UsageData,
  AIInsight,
  PaymentOrder,
  PaymentHistory,
  Prediction,
  AggregatedUsage,
  DeviceUsage,
  CarbonFootprint,
  SavingStreak,
  Notification,
  MonthlyReport,
} from "./types";
import {
  mockUser,
  generateUsageData,
  generateAIInsights,
  generateDeviceBreakdown,
  generatePaymentHistory,
  calculateCarbonFootprint,
  generateSavingStreak,
  generateNotifications,
  generatePrediction,
  calculateAggregatedUsage,
} from "./mockData";

// Simulate network delay
const delay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// In-memory storage (simulates database)
let currentUser: User | null = null;
let usageDataCache: UsageData[] | null = null;
let authToken: string | null = null;
let currentMonthBill: number = 3280; // Initialize with current month (November 2025) calculated amount
let users: User[] = [mockUser];

// Authentication API
export const authApi = {
  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    await delay(500);
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      authToken = "mock-jwt-token-" + Date.now();
      currentUser = found;
      return { user: found, token: authToken };
    }
    throw new Error("Invalid credentials");
  },

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<{ user: User; token: string }> {
    await delay(500);
    // Prevent duplicate registration
    if (users.find((u) => u.email === email)) {
      throw new Error("Email already registered");
    }
    const newUser: User = {
      ...mockUser,
      id: "user-" + Date.now(),
      email,
      name,
      password,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    authToken = "mock-jwt-token-" + Date.now();
    currentUser = newUser;
    return { user: newUser, token: authToken };
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    await delay(500);
    return { message: "Password reset link sent to your email" };
  },

  async logout(): Promise<void> {
    await delay(200);
    authToken = null;
    currentUser = null;
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(200);
    return currentUser;
  },
};

// User API
export const userApi = {
  async getProfile(): Promise<User> {
    await delay(300);
    if (!currentUser) throw new Error("Not authenticated");
    return currentUser;
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    await delay(400);
    if (!currentUser) throw new Error("Not authenticated");

    currentUser = { ...currentUser, ...updates };
    return currentUser;
  },

  async updatePreferences(
    preferences: Partial<User["preferences"]>
  ): Promise<User> {
    await delay(400);
    if (!currentUser) throw new Error("Not authenticated");

    currentUser = {
      ...currentUser,
      preferences: { ...currentUser.preferences, ...preferences },
    };
    return currentUser;
  },
};

// Usage Data API
export const usageApi = {
  async getUsageData(
    range: "day" | "week" | "month" | "year" | "all" = "month"
  ): Promise<UsageData[]> {
    await delay(400);

    // Get appliance IDs from currentUser (simulate real appliances added)
    let applianceIds: string[] = [];
    if (currentUser && Array.isArray(currentUser.appliances)) {
      applianceIds = currentUser.appliances.map((a: any) => a.id);
    }

    // Only use real appliances; if none, return empty data
    if (!usageDataCache) {
      usageDataCache =
        applianceIds.length > 0 ? generateUsageData(12, applianceIds) : [];
    }

    const now = new Date();
    let startDate: Date;

    switch (range) {
      case "day":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return usageDataCache;
    }

    return usageDataCache.filter((d) => new Date(d.timestamp) >= startDate);
  },

  async getAggregatedUsage(
    period: "today" | "week" | "month" | "year"
  ): Promise<AggregatedUsage> {
    await delay(300);

    let applianceIds: string[] = [];
    if (currentUser && Array.isArray(currentUser.appliances)) {
      applianceIds = currentUser.appliances.map((a: any) => a.id);
    }
    // Only use real appliances; if none, return empty data
    if (!usageDataCache) {
      usageDataCache =
        applianceIds.length > 0 ? generateUsageData(12, applianceIds) : [];
    }

    return calculateAggregatedUsage(usageDataCache, period);
  },

  async uploadUsageData(
    data: UsageData[]
  ): Promise<{ success: boolean; count: number }> {
    await delay(600);

    if (!usageDataCache) {
      usageDataCache = generateUsageData(12);
    }

    // Merge uploaded data
    usageDataCache = [...usageDataCache, ...data].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return { success: true, count: data.length };
  },
};

// Insights & Predictions API
export const insightsApi = {
  async getLatestInsights(): Promise<AIInsight[]> {
    await delay(400);
    return generateAIInsights();
  },

  async markInsightAsRead(insightId: string): Promise<void> {
    await delay(200);
    // Mock marking as read
  },

  async getPrediction(): Promise<Prediction> {
    await delay(500);
    // Use user id/email as seed for prediction
    let seed = 1;
    if (currentUser && currentUser.email) {
      seed = currentUser.email
        .split("")
        .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    }
    return generatePrediction(seed);
  },

  async getDeviceBreakdown(): Promise<DeviceUsage[]> {
    await delay(300);
    return generateDeviceBreakdown();
  },

  async getCarbonFootprint(): Promise<CarbonFootprint> {
    await delay(300);
    let applianceIds: string[] = [];
    if (currentUser && Array.isArray(currentUser.appliances)) {
      applianceIds = currentUser.appliances.map((a: any) => a.id);
    }
    if (!usageDataCache) {
      usageDataCache =
        applianceIds.length > 0 ? generateUsageData(12, applianceIds) : [];
    }

    const monthData = await usageApi.getAggregatedUsage("month");
    return calculateCarbonFootprint(monthData.totalUnits);
  },

  async getSavingStreak(): Promise<SavingStreak> {
    await delay(300);
    return generateSavingStreak();
  },
};

// Payments API
export const paymentsApi = {
  // Get current month's bill amount (single source of truth)
  async getCurrentMonthBill(): Promise<number> {
    await delay(200);
    return currentMonthBill;
  },

  // Update current month's bill (called when appliance totals change)
  async updateCurrentMonthBill(newAmount: number): Promise<void> {
    await delay(200);
    currentMonthBill = newAmount;
  },

  async createOrder(
    amount: number,
    billType: "predicted" | "actual"
  ): Promise<PaymentOrder> {
    await delay(500);

    // For actual bills, always use the canonical current month bill
    const orderAmount = billType === "actual" ? currentMonthBill : amount;

    // Mock Razorpay order creation
    const order: PaymentOrder = {
      id: "order_" + Date.now(),
      amount: orderAmount,
      currency: "INR",
      status: "created",
      createdAt: new Date().toISOString(),
      razorpayOrderId: "order_razorpay_" + Date.now(),
      currentMonthBill, // Include for UI sync
    };

    return order;
  },

  async verifyPayment(
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<{ success: boolean; transactionId: string }> {
    await delay(600);

    // Mock payment verification
    return {
      success: true,
      transactionId: "txn_" + Date.now(),
    };
  },

  async getPaymentHistory(): Promise<PaymentHistory[]> {
    await delay(400);
    return generatePaymentHistory();
  },

  async generateUPILink(
    amount: number
  ): Promise<{ upiLink: string; qrCode: string }> {
    await delay(300);

    // Mock UPI deep link
    const upiId = "wattwise@paytm";
    const upiLink = `upi://pay?pa=${upiId}&pn=WattWise&am=${amount}&cu=INR&tn=Electricity Bill Payment`;

    return {
      upiLink,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        upiLink
      )}`,
    };
  },
};

// Notifications API
export const notificationsApi = {
  async getNotifications(): Promise<Notification[]> {
    await delay(300);
    return generateNotifications();
  },

  async markAsRead(notificationId: string): Promise<void> {
    await delay(200);
    // Mock marking as read
  },

  async markAllAsRead(): Promise<void> {
    await delay(300);
    // Mock marking all as read
  },
};

// Reports API
export const reportsApi = {
  async generateMonthlyReport(month: string): Promise<MonthlyReport> {
    await delay(800);

    if (!usageDataCache) {
      usageDataCache = generateUsageData(12);
    }

    const monthData = await usageApi.getAggregatedUsage("month");

    return {
      month,
      totalUnits: monthData.totalUnits,
      totalCost: monthData.totalCost,
      avgDailyUnits: monthData.avgDaily,
      peakDay: "Oct 15, 2024",
      savingsVsLastMonth: 12.5,
      insights: generateAIInsights(),
      deviceBreakdown: generateDeviceBreakdown(),
      carbonFootprint: calculateCarbonFootprint(monthData.totalUnits),
    };
  },

  async exportToPDF(month: string): Promise<Blob> {
    await delay(1000);

    const report = await this.generateMonthlyReport(month);
    const devices = await insightsApi.getDeviceBreakdown();

    // Create base64-encoded minimal PDF content
    const pdfContent = `
  %PDF-1.7
  1 0 obj
  << /Type /Catalog
    /Pages 2 0 R
  >>
  endobj

  2 0 obj
  << /Type /Pages
    /Kids [3 0 R]
    /Count 1
  >>
  endobj

  3 0 obj
  << /Type /Page
    /Parent 2 0 R
    /Resources << /Font << /F1 4 0 R >> >>
    /MediaBox [0 0 612 792]
    /Contents 6 0 R
  >>
  endobj

  4 0 obj
  << /Type /Font
    /Subtype /Type1
    /BaseFont /Helvetica
  >>
  endobj

  6 0 obj
  << /Length 1000 >>
  stream
  BT
  /F1 12 Tf
  36 700 Td
  (WattWise Monthly Energy Report - ${month}) Tj
  0 -20 Td
  (Generated on: ${new Date().toLocaleDateString()}) Tj
  0 -40 Td
  (SUMMARY) Tj
  0 -20 Td
  (Total Usage: ${report.totalUnits} kWh) Tj
  0 -15 Td
  (Total Cost: ₹${report.totalCost}) Tj
  0 -15 Td
  (Average Daily Usage: ${report.avgDailyUnits} kWh) Tj
  0 -15 Td
  (Peak Day: ${report.peakDay}) Tj
  0 -15 Td
  (Savings vs Last Month: ${report.savingsVsLastMonth}%) Tj
  0 -40 Td
  (DEVICE BREAKDOWN) Tj
  ${devices
    .map(
      (device, i) => `
  0 -20 Td
  (${device.deviceName}) Tj
  0 -15 Td
  (Usage: ${device.units} kWh (${device.percentage}%)) Tj
  0 -15 Td
  (Cost: ₹${device.cost} @ ₹8/kWh) Tj`
    )
    .join("\n")}
  0 -40 Td
  (CARBON FOOTPRINT) Tj
  0 -20 Td
  (CO2 Emissions: ${report.carbonFootprint.co2Kg} kg) Tj
  0 -15 Td
  (Trees Required: ${report.carbonFootprint.treesEquivalent}) Tj
  ET
  endstream
  endobj

  xref
  0 7
  0000000000 65535 f
  0000000009 00000 n
  0000000058 00000 n
  0000000115 00000 n
  0000000216 00000 n
  0000000289 00000 n
  trailer
  << /Size 6
    /Root 1 0 R
  >>
  startxref
  1592
  %%EOF
  `;

    // Convert string to ArrayBuffer
    const bytes = new TextEncoder().encode(pdfContent);

    return new Blob([bytes], {
      type: "application/pdf",
    });
  },

  async exportToCSV(range: "month" | "year"): Promise<Blob> {
    await delay(800);

    const data = await usageApi.getUsageData(range);

    // Generate CSV
    const headers =
      "Timestamp,Units (kWh),Cost (INR),Device ID,Temperature,Region\n";
    const rows = data
      .map(
        (d) =>
          `${d.timestamp},${d.unitsConsumed},${d.cost},${d.deviceId},${d.temperature},${d.regionCode}`
      )
      .join("\n");

    return new Blob([headers + rows], { type: "text/csv" });
  },
};

// Health check
export const healthApi = {
  async checkHealth(): Promise<{
    status: "ok" | "degraded";
    timestamp: string;
  }> {
    await delay(100);
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  },
};

// Initialize with demo user logged in
currentUser = mockUser;
authToken = "mock-jwt-token-initial";
