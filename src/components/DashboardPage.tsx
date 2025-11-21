import React, { useState, useEffect } from "react";
import { UsageSummaryCards } from "./UsageSummaryCards";
import { PowerTimelineChart } from "./PowerTimelineChart";
import { useAppliances } from "../contexts/ApplianceContext";
import { PredictionChart } from "./PredictionChart";
import { ComparisonChart } from "./ComparisonChart";
import { DeviceBreakdownChart } from "./DeviceBreakdownChart";
import { CarbonFootprintGauge } from "./CarbonFootprintGauge";
import { SavingStreakWidget } from "./SavingStreakWidget";
import { AIInsightsBox } from "./AIInsightsBox";
import { ApplianceManagementSection } from "./ApplianceManagementSection";
import { usageApi, insightsApi } from "../lib/mockApi";
import { Appliance } from "../lib/applianceTypes";
import {
  UsageData,
  AggregatedUsage,
  Prediction,
  AIInsight,
  DeviceUsage,
  CarbonFootprint,
  SavingStreak,
} from "../lib/types";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BarChart3, Zap } from "lucide-react";

interface DashboardPageProps {
  currency: "INR" | "USD" | "EUR";
  // ...existing code...
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ currency }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data state
  // usageData now comes from ApplianceContext
  const { appliances, usageData } = useAppliances();
  // Removed todayUsage and weekUsage state, now calculated from appliances
  const [monthUsage, setMonthUsage] = useState<AggregatedUsage | null>(null);
  const [previousMonthUsage, setPreviousMonthUsage] =
    useState<AggregatedUsage | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  // appliances and usageData are destructured together below
  // Get carbonFootprint from context
  const { carbonFootprint } = useAppliances();
  const [savingStreak, setSavingStreak] = useState<SavingStreak | null>(null);

  // Utility functions for time calculations
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getDaysSinceCreation = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Helper to aggregate appliance usage for a given period
  function aggregateApplianceUsage(
    appliances: Appliance[],
    period: "today" | "week" | "month"
  ): AggregatedUsage {
    const costPerKWh = 8;
    const now = new Date();
    let days = 1;
    if (period === "week") days = 7;
    if (period === "month") days = getDaysInMonth(now);

    let totalUnits = 0;
    appliances.forEach((app) => {
      // Only count usage for days since appliance was added
      const daysSinceAdded = Math.min(
        days,
        getDaysSinceCreation(app.createdAt)
      );
      const dailyKWh = (app.powerWatts * app.hoursPerDay) / 1000;
      totalUnits += dailyKWh * daysSinceAdded;
    });
    const totalCost = totalUnits * costPerKWh;
    const avgDaily = days > 0 ? totalUnits / days : 0;
    return {
      period,
      totalUnits: parseFloat(totalUnits.toFixed(2)),
      totalCost: parseFloat(totalCost.toFixed(2)),
      avgDaily: parseFloat(avgDaily.toFixed(2)),
      peakHour: 0,
      offPeakHour: 0,
    };
  }

  const todayUsage = React.useMemo(
    () => aggregateApplianceUsage(appliances, "today"),
    [appliances]
  );
  const weekUsage = React.useMemo(
    () => aggregateApplianceUsage(appliances, "week"),
    [appliances]
  );
  const computedMonthUsage = React.useMemo(
    () => aggregateApplianceUsage(appliances, "month"),
    [appliances]
  );

  // Device breakdown for charts (month-to-date)
  const currentDays = React.useMemo(() => {
    const now = new Date();
    return now.getDate();
  }, []);
  const daysInMonth = getDaysInMonth(new Date());
  const devices: DeviceUsage[] = React.useMemo(() => {
    if (appliances.length === 0) return [];
    const costPerKWh = 8;
    // Calculate current month-to-date usage
    const totalUnits = appliances.reduce((sum, app) => {
      const daysSinceAdded = Math.min(
        currentDays,
        getDaysSinceCreation(app.createdAt)
      );
      const dailyKWh = (app.powerWatts * app.hoursPerDay) / 1000;
      return sum + dailyKWh * daysSinceAdded;
    }, 0);
    return appliances
      .map((app) => {
        const daysSinceAdded = Math.min(
          currentDays,
          getDaysSinceCreation(app.createdAt)
        );
        const dailyKWh = (app.powerWatts * app.hoursPerDay) / 1000;
        const actualUnits = dailyKWh * daysSinceAdded;
        const projectedUnits = dailyKWh * daysInMonth;
        const actualCost = actualUnits * costPerKWh;
        const projectedCost = projectedUnits * costPerKWh;
        const percentage =
          totalUnits > 0 ? (actualUnits / totalUnits) * 100 : 0;
        return {
          deviceId: app.id,
          deviceName: app.name,
          deviceType: app.name as any,
          percentage,
          units: actualUnits,
          projectedUnits,
          cost: actualCost,
          projectedCost,
          dailyKWh,
          daysActive: daysSinceAdded,
          color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        };
      })
      .sort((a, b) => b.percentage - a.percentage);
  }, [appliances, currentDays, daysInMonth]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [
        allUsageData,
        todayData,
        weekData,
        monthData,
        predictionData,
        insightsData,
        carbonData,
        streakData,
      ] = await Promise.all([
        usageApi.getUsageData("month"),
        usageApi.getAggregatedUsage("today"),
        usageApi.getAggregatedUsage("week"),
        usageApi.getAggregatedUsage("month"),
        insightsApi.getPrediction(),
        insightsApi.getLatestInsights(),
        insightsApi.getCarbonFootprint(),
        insightsApi.getSavingStreak(),
      ]);

      // Calculate previous month (mock)
      const prevMonth: AggregatedUsage = {
        period: "month",
        totalUnits: monthData.totalUnits * 1.125, // 12.5% more last month
        totalCost: monthData.totalCost * 1.125,
        avgDaily: monthData.avgDaily * 1.125,
        peakHour: monthData.peakHour,
        offPeakHour: monthData.offPeakHour,
      };

      setMonthUsage(monthData);
      setPreviousMonthUsage(prevMonth);
      setPrediction(predictionData);
      setInsights(insightsData);
      setSavingStreak(streakData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkInsightAsRead = async (insightId: string) => {
    try {
      await insightsApi.markInsightAsRead(insightId);
      setInsights(
        insights.map((i) => (i.id === insightId ? { ...i, read: true } : i))
      );
    } catch (error) {
      console.error("Failed to mark insight as read:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Track your electricity usage and get AI-powered insights
        </p>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 size={16} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="appliances" className="gap-2">
            <Zap size={16} />
            My Appliances
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Usage Summary Cards */}
          {todayUsage && weekUsage && computedMonthUsage && (
            <UsageSummaryCards
              today={todayUsage}
              week={weekUsage}
              month={computedMonthUsage}
              currency={currency}
            />
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Insights */}
            <AIInsightsBox
              insights={insights}
              onMarkAsRead={handleMarkInsightAsRead}
            />
            {/* Quick Tips Card with motion and enhanced styles */}
            <div className="w-full h-full flex items-stretch">
              <div
                className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 border border-blue-200 rounded-2xl shadow-lg p-8 flex flex-col justify-center w-full animate-fade-in"
                style={{
                  minHeight: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <h2 className="text-2xl font-bold text-indigo-700 mb-4 tracking-tight motion-safe:animate-bounce">
                  ⚡ Quick Tips for Saving Electricity
                </h2>
                <ul className="list-disc list-inside text-gray-800 space-y-3 text-lg w-full max-w-lg">
                  <li className="transition-all duration-300 hover:scale-105 hover:text-blue-600">
                    Run high-power appliances (like washing machines) during
                    off-peak hours to save on costs.
                  </li>
                  <li className="transition-all duration-300 hover:scale-105 hover:text-blue-600">
                    Set your AC to 25°C for optimal efficiency and savings.
                  </li>
                  <li className="transition-all duration-300 hover:scale-105 hover:text-blue-600">
                    Switch off lights and devices when not in use.
                  </li>
                  <li className="transition-all duration-300 hover:scale-105 hover:text-blue-600">
                    Use energy-efficient LED bulbs and appliances.
                  </li>
                  <li className="transition-all duration-300 hover:scale-105 hover:text-blue-600">
                    Regularly check appliance health and maintenance.
                  </li>
                  <li className="transition-all duration-300 hover:scale-105 hover:text-blue-600">
                    Track your usage with Electricity Usage Tracker to spot
                    saving opportunities!
                  </li>
                </ul>
                <div
                  className="mt-6 flex justify-center w-full"
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 32,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Prediction Chart */}
          {prediction && computedMonthUsage && (
            <PredictionChart
              prediction={prediction}
              currentMonthUsage={computedMonthUsage.totalUnits}
              currency={currency}
            />
          )}

          {/* Comparison and Device Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Month Comparison */}
            {/* Month Comparison removed */}

            {/* Device Breakdown */}
            <DeviceBreakdownChart devices={devices} currency={currency} />
          </div>

          {/* Carbon Footprint */}
          {carbonFootprint && (
            <CarbonFootprintGauge footprint={carbonFootprint} />
          )}
        </TabsContent>

        {/* Appliances Tab */}
        <TabsContent value="appliances">
          <ApplianceManagementSection currency={currency} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// import React, { useState, useEffect, useRef } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "./ui/card";
// import {
//   Brain,
//   ChevronLeft,
//   ChevronRight,
//   Info,
//   X,
//   BarChart3,
//   Cpu,
//   Shield,
//   Calculator,
//   Zap,
//   Leaf,
//   TrendingUp,
//   AlertTriangle,
//   Lightbulb,
//   Play,
//   Pause,
//   Maximize2
// } from "lucide-react";
// import { Badge } from "./ui/badge";
// import { Button } from "./ui/button";
// import { motion, AnimatePresence } from "framer-motion";

// export const AIInsightsBox: React.FC = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [showFullScreen, setShowFullScreen] = useState(false);
//   const [autoPlay, setAutoPlay] = useState(true);
//   const [isPlaying, setIsPlaying] = useState(true);
//   const videoRef = useRef<HTMLVideoElement>(null);

//   const slides = [
//     {
//       title: "Electricity Usage Tracker – Powering a Sustainable Future",
//       icon: Brain,
//       content: (
//         <div className="space-y-4">
//           <p className="text-sm text-gray-700 leading-relaxed">
//             <strong>Electricity Usage Tracker</strong> is a smart solution that
//             helps users monitor and optimize household energy consumption.
//             Rising demand and inefficiency in electricity usage contribute to
//             global warming, high energy bills, and unnecessary load on power
//             grids.
//           </p>
//           <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
//             <li>Identifies high-energy appliances in real time</li>
//             <li>Predicts monthly usage and potential cost spikes</li>
//             <li>Suggests efficiency improvements dynamically</li>
//             <li>Reduces carbon footprint through smart analytics</li>
//           </ul>
//           <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
//             <p className="text-xs font-semibold text-blue-800 mb-2">Energy Conservation Equation:</p>
//             <code className="text-xs text-gray-800 block font-mono">
//               E<sub>saved</sub> = Σ (P<sub>i</sub> × t<sub>i</sub> × η<sub>i</sub>)
//             </code>
//             <p className="text-xs text-gray-600 mt-1">
//               Where P<sub>i</sub> = Power of appliance i, t<sub>i</sub> = Time saved, η<sub>i</sub> = Efficiency factor
//             </p>
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: "Current Challenges in Electricity Management",
//       icon: AlertTriangle,
//       content: (
//         <div className="space-y-4">
//           <p className="text-sm text-gray-700 leading-relaxed">
//             Modern society faces severe challenges related to energy usage:
//           </p>
//           <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
//             <li>Over-reliance on non-renewable energy sources</li>
//             <li>Lack of awareness of appliance-level consumption</li>
//             <li>Unoptimized peak-hour usage leading to unstable power distribution</li>
//             <li>Rising carbon footprints due to inefficient demand response</li>
//           </ul>
//           <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
//             <p className="text-xs font-semibold text-red-800 mb-2">Peak Load Problem:</p>
//             <code className="text-xs text-gray-800 block font-mono">
//               P<sub>peak</sub> = max(P<sub>t</sub>) ∀ t ∈ [0,24]
//             </code>
//             <p className="text-xs text-gray-600 mt-1">
//               Peak power demand occurs when multiple appliances run simultaneously
//             </p>
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: "Mathematical Modeling & Predictive System",
//       icon: Calculator,
//       content: (
//         <div className="space-y-4">
//           <p className="text-sm text-gray-700 leading-relaxed">
//             The system uses regression-based AI models to predict energy consumption:
//           </p>
//           <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
//             <p className="text-xs font-semibold text-purple-800 mb-2">Main Prediction Equation:</p>
//             <code className="text-xs text-gray-800 block font-mono">
//               E(t) = α × P(t) + β × U(t) + γ × C(t) + ε
//             </code>
//             <p className="text-xs text-gray-600 mt-1">
//               Where E(t) = Expected energy usage, P(t) = Power load pattern,<br/>
//               U(t) = Appliance usage probability, C(t) = Cost prediction coefficient
//             </p>
//           </div>
//           <div className="bg-gradient-to-r from-green-50 to-teal-50 p-3 rounded-lg border border-green-200">
//             <code className="text-xs text-gray-800 block font-mono">
//               Loss = (P<sub>actual</sub> − P<sub>predicted</sub>)² + λ × ||W||²
//             </code>
//             <p className="text-xs text-gray-600 mt-1">Regularized loss function for model training</p>
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: "Smart Grid Integration & IoT Sensors",
//       icon: Cpu,
//       content: (
//         <div className="space-y-4">
//           <p className="text-sm text-gray-700 leading-relaxed">
//             Real-time monitoring through IoT sensors and smart grid integration:
//           </p>
//           <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
//             <li>Smart meters with real-time data streaming</li>
//             <li>Machine learning for anomaly detection</li>
//             <li>Automated demand-response systems</li>
//             <li>Cloud-based analytics platform</li>
//           </ul>
//           <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-4 rounded-lg border border-teal-200">
//             <p className="text-xs font-semibold text-teal-800 mb-2">IoT Data Stream:</p>
//             <code className="text-xs text-gray-800 block font-mono">
//               D(t) = [P<sub>1</sub>(t), P<sub>2</sub>(t), ..., P<sub>n</sub>(t), T(t), H(t)]
//             </code>
//             <p className="text-xs text-gray-600 mt-1">
//               Real-time sensor data including power, temperature, and humidity
//             </p>
//           </div>
//         </div>
//       ),
//     }
//   ];

//   // Auto-play functionality
//   useEffect(() => {
//     if (!autoPlay || showFullScreen) return;

//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [autoPlay, showFullScreen, slides.length]);

//   const handleNext = () => {
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//   };

//   const handlePrev = () => {
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//   };

//   const toggleVideoPlayback = () => {
//     if (videoRef.current) {
//       if (isPlaying) {
//         videoRef.current.pause();
//       } else {
//         videoRef.current.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   return (
//     <>
//       {/* Main Card with Video Background */}
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className="relative w-full overflow-hidden rounded-2xl"
//       >
//         {/* Video Background */}
//         <div className="absolute inset-0 w-full h-full overflow-hidden rounded-2xl">
//           <video
//             ref={videoRef}
//             autoPlay
//             muted
//             loop
//             playsInline
//             className="w-full h-full object-cover opacity-20"
//             poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%230e7490;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%234f46e5;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='450' fill='url(%23grad)'/%3E%3C/svg%3E"
//           >
//             <source src="https://assets.mixkit.co/videos/preview/mixkit-close-up-of-an-electric-meter-42859-large.mp4" type="video/mp4" />
//             <source src="https://assets.mixkit.co/videos/preview/mixkit-smart-home-energy-monitoring-42858-large.mp4" type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//           {/* Gradient Overlay */}
//           <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/20"></div>
//         </div>

//         <Card className="relative bg-white/90 backdrop-blur-sm border-none shadow-2xl">
//           <CardHeader>
//             <div className="flex items-start justify-between">
//               <div className="flex-1">
//                 <CardTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                   <motion.div
//                     animate={{ rotate: 360 }}
//                     transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//                   >
//                     <Brain className="w-8 h-8 text-purple-600" />
//                   </motion.div>
//                   {slides[currentSlide].title}
//                 </CardTitle>
//                 <CardDescription className="text-lg mt-2 text-gray-600">
//                   Transforming energy management through AI and real-time analytics
//                 </CardDescription>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Badge variant="outline" className="gap-2 px-4 py-2 border-2">
//                   <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
//                   Live Tracking
//                 </Badge>
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={toggleVideoPlayback}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
//                 </motion.button>
//               </div>
//             </div>
//           </CardHeader>

//           <CardContent className="relative">
//             {/* Orb Animation Background */}
//             <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
//               <motion.div
//                 className="absolute w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl"
//                 animate={{
//                   x: [0, 100, 0],
//                   y: [0, 50, 0],
//                 }}
//                 transition={{
//                   duration: 8,
//                   repeat: Infinity,
//                   ease: "easeInOut"
//                 }}
//               />
//               <motion.div
//                 className="absolute w-24 h-24 bg-gradient-to-r from-green-400 to-teal-400 rounded-full opacity-20 blur-xl"
//                 animate={{
//                   x: [100, 0, 100],
//                   y: [50, 0, 50],
//                 }}
//                 transition={{
//                   duration: 6,
//                   repeat: Infinity,
//                   ease: "easeInOut"
//                 }}
//               />
//               <motion.div
//                 className="absolute w-20 h-20 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-20 blur-xl"
//                 animate={{
//                   x: [50, 100, 50],
//                   y: [100, 50, 100],
//                 }}
//                 transition={{
//                   duration: 10,
//                   repeat: Infinity,
//                   ease: "easeInOut"
//                 }}
//               />
//             </div>

//             <div className="relative z-10">
//               {/* Main Content Grid */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
//                 {/* Slide Content */}
//                 <div className="space-y-4">
//                   <AnimatePresence mode="wait">
//                     <motion.div
//                       key={currentSlide}
//                       initial={{ opacity: 0, x: 50 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       exit={{ opacity: 0, x: -50 }}
//                       transition={{ duration: 0.5 }}
//                     >
//                       {slides[currentSlide].content}
//                     </motion.div>
//                   </AnimatePresence>
//                 </div>

//                 {/* Quick Tips Card */}
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: 0.3 }}
//                   className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 border border-blue-200 rounded-2xl shadow-lg p-6 flex flex-col justify-center"
//                 >
//                   <h2 className="text-xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
//                     <Zap className="w-5 h-5" />
//                     Quick Tips for Saving Electricity
//                   </h2>
//                   <ul className="space-y-3 text-sm text-gray-800">
//                     {[
//                       "Run high-power appliances during off-peak hours",
//                       "Set AC to 25°C for optimal efficiency",
//                       "Switch off unused lights and devices",
//                       "Use energy-efficient LED bulbs",
//                       "Regular appliance maintenance",
//                       "Track usage with our AI tracker"
//                     ].map((tip, index) => (
//                       <motion.li
//                         key={index}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: 0.5 + index * 0.1 }}
//                         className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/50 transition-all duration-300"
//                         whileHover={{ scale: 1.02 }}
//                       >
//                         <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
//                         {tip}
//                       </motion.li>
//                     ))}
//                   </ul>
//                 </motion.div>
//               </div>

//               {/* Navigation Controls */}
//               <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
//                 <div className="flex items-center gap-4">
//                   <motion.button
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={handlePrev}
//                     className="p-3 rounded-full hover:bg-white border border-gray-300 transition-all shadow-sm"
//                   >
//                     <ChevronLeft className="w-5 h-5 text-gray-700" />
//                   </motion.button>

//                   <div className="flex space-x-2">
//                     {slides.map((_, index) => (
//                       <button
//                         key={index}
//                         onClick={() => setCurrentSlide(index)}
//                         className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                           index === currentSlide
//                             ? 'bg-purple-600 scale-125'
//                             : 'bg-gray-300 hover:bg-gray-400'
//                         }`}
//                       />
//                     ))}
//                   </div>

//                   <motion.button
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={handleNext}
//                     className="p-3 rounded-full hover:bg-white border border-gray-300 transition-all shadow-sm"
//                   >
//                     <ChevronRight className="w-5 h-5 text-gray-700" />
//                   </motion.button>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setAutoPlay(!autoPlay)}
//                     className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
//                   >
//                     {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
//                     Auto {autoPlay ? 'Pause' : 'Play'}
//                   </motion.button>

//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setShowFullScreen(true)}
//                     className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm rounded-lg shadow hover:shadow-lg transition-all"
//                   >
//                     <Maximize2 className="w-4 h-4" />
//                     Full Analysis
//                   </motion.button>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Full-Screen Modal with Enhanced Mathematical Equations */}
//       <AnimatePresence>
//         {showFullScreen && (
//           <motion.div
//             className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               initial={{ scale: 0.8, opacity: 0, y: 50 }}
//               animate={{ scale: 1, opacity: 1, y: 0 }}
//               exit={{ scale: 0.8, opacity: 0, y: 50 }}
//               transition={{ duration: 0.5, type: "spring" }}
//               className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden"
//             >
//               {/* Modal Header */}
//               <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <Brain className="w-8 h-8" />
//                     <div>
//                       <h2 className="text-2xl font-bold">Advanced Energy Analytics</h2>
//                       <p className="text-purple-100">Mathematical Models & System Architecture</p>
//                     </div>
//                   </div>
//                   <motion.button
//                     whileHover={{ scale: 1.1, rotate: 90 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={() => setShowFullScreen(false)}
//                     className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//                   >
//                     <X className="w-6 h-6" />
//                   </motion.button>
//                 </div>
//               </div>

//               {/* Modal Content */}
//               <div className="p-8 max-h-[70vh] overflow-y-auto">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                   {/* Mathematical Models Section */}
//                   <div className="space-y-6">
//                     <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//                       <Calculator className="w-6 h-6 text-green-600" />
//                       Mathematical Foundations
//                     </h3>

//                     <div className="space-y-4">
//                       <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
//                         <h4 className="font-semibold text-green-800 mb-2">Primary Energy Prediction</h4>
//                         <code className="text-sm text-gray-800 block font-mono bg-white/50 p-3 rounded-lg">
//                           E(t) = αP(t) + βU(t) + γC(t) + Σδ<sub>i</sub>A<sub>i</sub>(t) + ε
//                         </code>
//                         <p className="text-xs text-gray-600 mt-2">
//                           Multi-variable regression with appliance-specific coefficients
//                         </p>
//                       </div>

//                       <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
//                         <h4 className="font-semibold text-blue-800 mb-2">Cost Optimization</h4>
//                         <code className="text-sm text-gray-800 block font-mono bg-white/50 p-3 rounded-lg">
//                           min Σ(P<sub>t</sub> × C<sub>t</sub>) subject to E<sub>t</sub> ≤ E<sub>max</sub>
//                         </code>
//                         <p className="text-xs text-gray-600 mt-2">
//                           Constrained optimization for minimum cost with energy limits
//                         </p>
//                       </div>

//                       <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
//                         <h4 className="font-semibold text-purple-800 mb-2">Anomaly Detection</h4>
//                         <code className="text-sm text-gray-800 block font-mono bg-white/50 p-3 rounded-lg">
//                           A(t) = |P(t) - Ŝ(t)| / σ<sub>P</sub>
//                         </code>
//                         <p className="text-xs text-gray-600 mt-2">
//                           Z-score based anomaly detection with moving average
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* System Architecture Section */}
//                   <div className="space-y-6">
//                     <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//                       <Cpu className="w-6 h-6 text-blue-600" />
//                       System Architecture
//                     </h3>

//                     <div className="space-y-4">
//                       <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
//                         <h4 className="font-semibold text-gray-800 mb-3">Data Pipeline</h4>
//                         <div className="space-y-2 text-sm text-gray-700">
//                           <div className="flex items-center gap-2">
//                             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                             IoT Sensors → Apache Kafka → Spark Streaming
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                             TensorFlow Serving → React Frontend
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
//                             PostgreSQL → Redis Cache → Analytics API
//                           </div>
//                         </div>
//                       </div>

//                       <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
//                         <h4 className="font-semibold text-red-800 mb-2">Machine Learning Pipeline</h4>
//                         <code className="text-xs text-gray-800 block font-mono bg-white/50 p-2 rounded-lg">
//                           Data → Preprocessing → Feature Engineering → Model Training → Prediction
//                         </code>
//                         <ul className="text-xs text-gray-600 mt-2 space-y-1">
//                           <li>• LSTM Networks for time series forecasting</li>
//                           <li>• Random Forest for classification</li>
//                           <li>• K-means for usage pattern clustering</li>
//                         </ul>
//                       </div>

//                       <div className="bg-gradient-to-r from-teal-50 to-green-50 p-4 rounded-xl border border-teal-200">
//                         <h4 className="font-semibold text-teal-800 mb-2">Performance Metrics</h4>
//                         <div className="grid grid-cols-2 gap-2 text-xs">
//                           <div className="text-center p-2 bg-white/50 rounded">
//                             <div className="font-bold text-teal-600">35%</div>
//                             <div className="text-gray-600">Prediction Accuracy</div>
//                           </div>
//                           <div className="text-center p-2 bg-white/50 rounded">
//                             <div className="font-bold text-teal-600">12.5%</div>
//                             <div className="text-gray-600">Avg. Savings</div>
//                           </div>
//                           <div className="text-center p-2 bg-white/50 rounded">
//                             <div className="font-bold text-teal-600">95%</div>
//                             <div className="text-gray-600">Uptime</div>
//                           </div>
//                           <div className="text-center p-2 bg-white/50 rounded">
//                             <div className="font-bold text-teal-600">2.3s</div>
//                             <div className="text-gray-600">Response Time</div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
//                   <Button
//                     variant="outline"
//                     onClick={() => setShowFullScreen(false)}
//                     className="flex items-center gap-2"
//                   >
//                     <X className="w-4 h-4" />
//                     Close
//                   </Button>
//                   <Button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600">
//                     <BarChart3 className="w-4 h-4" />
//                     View Live Dashboard
//                   </Button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// import React, { useState, useEffect } from "react";
// import { UsageSummaryCards } from "./UsageSummaryCards";
// import { PowerTimelineChart } from "./PowerTimelineChart";
// import { useAppliances } from "../contexts/ApplianceContext";
// import { PredictionChart } from "./PredictionChart";
// import { ComparisonChart } from "./ComparisonChart";
// import { DeviceBreakdownChart } from "./DeviceBreakdownChart";
// import { CarbonFootprintGauge } from "./CarbonFootprintGauge";
// import { SavingStreakWidget } from "./SavingStreakWidget";
// import {AIInsightsBox} from "./AIInsightsBox"; // ✅ default import fixed here
// import { ApplianceManagementSection } from "./ApplianceManagementSection";
// import { usageApi, insightsApi } from "../lib/mockApi";
// import { Appliance } from "../lib/applianceTypes";
// import {
//   UsageData,
//   AggregatedUsage,
//   Prediction,
//   AIInsight,
//   DeviceUsage,
//   CarbonFootprint,
//   SavingStreak,
// } from "../lib/types";
// import { Skeleton } from "./ui/skeleton";
// import { Alert, AlertDescription } from "./ui/alert";
// import { AlertCircle, BarChart3, Zap } from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

// interface DashboardPageProps {
//   currency: "INR" | "USD" | "EUR";
// }

// export const DashboardPage: React.FC<DashboardPageProps> = ({ currency }) => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Data state
//   const [usageData, setUsageData] = useState<UsageData[]>([]);
//   const [monthUsage, setMonthUsage] = useState<AggregatedUsage | null>(null);
//   const [previousMonthUsage, setPreviousMonthUsage] =
//     useState<AggregatedUsage | null>(null);
//   const [prediction, setPrediction] = useState<Prediction | null>(null);
//   const [insights, setInsights] = useState<AIInsight[]>([]);
//   const { appliances } = useAppliances();
//   const [carbonFootprint, setCarbonFootprint] =
//     useState<CarbonFootprint | null>(null);
//   const [savingStreak, setSavingStreak] = useState<SavingStreak | null>(null);

//   // Utility functions for time calculations
//   const getDaysInMonth = (date: Date) => {
//     return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
//   };

//   const getDaysSinceCreation = (createdAt: string) => {
//     const now = new Date();
//     const created = new Date(createdAt);
//     const diffTime = Math.abs(now.getTime() - created.getTime());
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   };

//   // Helper to aggregate appliance usage for a given period
//   function aggregateApplianceUsage(
//     appliances: Appliance[],
//     period: "today" | "week" | "month"
//   ): AggregatedUsage {
//     const costPerKWh = 8;
//     const now = new Date();
//     let days = 1;
//     if (period === "week") days = 7;
//     if (period === "month") days = getDaysInMonth(now);

//     let totalUnits = 0;
//     appliances.forEach((app) => {
//       const daysSinceAdded = Math.min(
//         days,
//         getDaysSinceCreation(app.createdAt)
//       );
//       const dailyKWh = (app.powerWatts * app.hoursPerDay) / 1000;
//       totalUnits += dailyKWh * daysSinceAdded;
//     });
//     const totalCost = totalUnits * costPerKWh;
//     const avgDaily = days > 0 ? totalUnits / days : 0;
//     return {
//       period,
//       totalUnits: parseFloat(totalUnits.toFixed(2)),
//       totalCost: parseFloat(totalCost.toFixed(2)),
//       avgDaily: parseFloat(avgDaily.toFixed(2)),
//       peakHour: 0,
//       offPeakHour: 0,
//     };
//   }

//   const todayUsage = React.useMemo(
//     () => aggregateApplianceUsage(appliances, "today"),
//     [appliances]
//   );
//   const weekUsage = React.useMemo(
//     () => aggregateApplianceUsage(appliances, "week"),
//     [appliances]
//   );
//   const computedMonthUsage = React.useMemo(
//     () => aggregateApplianceUsage(appliances, "month"),
//     [appliances]
//   );

//   // Device breakdown for charts (month-to-date)
//   const currentDays = React.useMemo(() => {
//     const now = new Date();
//     return now.getDate();
//   }, []);
//   const daysInMonth = getDaysInMonth(new Date());
//   const devices: DeviceUsage[] = React.useMemo(() => {
//     if (appliances.length === 0) return [];
//     const costPerKWh = 8;
//     const totalUnits = appliances.reduce((sum, app) => {
//       const daysSinceAdded = Math.min(
//         currentDays,
//         getDaysSinceCreation(app.createdAt)
//       );
//       const dailyKWh = (app.powerWatts * app.hoursPerDay) / 1000;
//       return sum + dailyKWh * daysSinceAdded;
//     }, 0);
//     return appliances
//       .map((app) => {
//         const daysSinceAdded = Math.min(
//           currentDays,
//           getDaysSinceCreation(app.createdAt)
//         );
//         const dailyKWh = (app.powerWatts * app.hoursPerDay) / 1000;
//         const actualUnits = dailyKWh * daysSinceAdded;
//         const projectedUnits = dailyKWh * daysInMonth;
//         const actualCost = actualUnits * costPerKWh;
//         const projectedCost = projectedUnits * costPerKWh;
//         const percentage =
//           totalUnits > 0 ? (actualUnits / totalUnits) * 100 : 0;
//         return {
//           deviceId: app.id,
//           deviceName: app.name,
//           deviceType: app.name as any,
//           percentage,
//           units: actualUnits,
//           projectedUnits,
//           cost: actualCost,
//           projectedCost,
//           dailyKWh,
//           daysActive: daysSinceAdded,
//           color: `hsl(${Math.random() * 360}, 70%, 50%)`,
//         };
//       })
//       .sort((a, b) => b.percentage - a.percentage);
//   }, [appliances, currentDays, daysInMonth]);

//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   const loadDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const [
//         allUsageData,
//         todayData,
//         weekData,
//         monthData,
//         predictionData,
//         insightsData,
//         carbonData,
//         streakData,
//       ] = await Promise.all([
//         usageApi.getUsageData("month"),
//         usageApi.getAggregatedUsage("today"),
//         usageApi.getAggregatedUsage("week"),
//         usageApi.getAggregatedUsage("month"),
//         insightsApi.getPrediction(),
//         insightsApi.getLatestInsights(),
//         insightsApi.getCarbonFootprint(),
//         insightsApi.getSavingStreak(),
//       ]);

//       const prevMonth: AggregatedUsage = {
//         period: "month",
//         totalUnits: monthData.totalUnits * 1.125,
//         totalCost: monthData.totalCost * 1.125,
//         avgDaily: monthData.avgDaily * 1.125,
//         peakHour: monthData.peakHour,
//         offPeakHour: monthData.offPeakHour,
//       };

//       setUsageData(allUsageData);
//       setMonthUsage(monthData);
//       setPreviousMonthUsage(prevMonth);
//       setPrediction(predictionData);
//       setInsights(insightsData);
//       setCarbonFootprint(carbonData);
//       setSavingStreak(streakData);
//     } catch (err) {
//       setError("Failed to load dashboard data. Please try again.");
//       console.error("Dashboard load error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMarkInsightAsRead = async (insightId: string) => {
//     try {
//       await insightsApi.markInsightAsRead(insightId);
//       setInsights(
//         insights.map((i) => (i.id === insightId ? { ...i, read: true } : i))
//       );
//     } catch (error) {
//       console.error("Failed to mark insight as read:", error);
//     }
//   };

//   // ✅ Filter insights only for added appliances
//   const filteredInsights = React.useMemo(() => {
//     if (!insights || appliances.length === 0) return [];
//     const addedNames = appliances.map((a) => a.name.toLowerCase());
//     return insights.filter((insight) =>
//       addedNames.some((name) => insight.title.toLowerCase().includes(name))
//     );
//   }, [insights, appliances]);

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <Skeleton className="h-8 w-64" />
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <Skeleton className="h-32" />
//           <Skeleton className="h-32" />
//           <Skeleton className="h-32" />
//         </div>
//         <Skeleton className="h-96" />
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Skeleton className="h-96" />
//           <Skeleton className="h-96" />
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <Alert variant="destructive">
//         <AlertCircle className="h-4 w-4" />
//         <AlertDescription>{error}</AlertDescription>
//       </Alert>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
//         <p className="text-gray-600">
//           Track your electricity usage and get AI-powered insights
//         </p>
//       </div>

//       <Tabs defaultValue="overview" className="space-y-6">
//         <TabsList className="grid w-full grid-cols-2 max-w-md">
//           <TabsTrigger value="overview" className="gap-2">
//             <BarChart3 size={16} />
//             Overview
//           </TabsTrigger>
//           <TabsTrigger value="appliances" className="gap-2">
//             <Zap size={16} />
//             My Appliances
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="space-y-6">
//           {todayUsage && weekUsage && computedMonthUsage && (
//             <UsageSummaryCards
//               today={todayUsage}
//               week={weekUsage}
//               month={computedMonthUsage}
//               currency={currency}
//             />
//           )}

//           <PowerTimelineChart data={usageData} currency={currency} />

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* ✅ Show only filtered insights */}
//             <AIInsightsBox
//               insights={filteredInsights}
//               onMarkAsRead={handleMarkInsightAsRead}
//             />

//             {/* Quick Tips */}
//             <div className="w-full h-full flex items-stretch">
//               <div
//                 className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 border border-blue-200 rounded-2xl shadow-lg p-8 flex flex-col justify-center w-full animate-fade-in"
//                 style={{
//                   minHeight: "100%",
//                   width: "100%",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   position: "relative",
//                 }}
//               >
//                 <h2 className="text-2xl font-bold text-indigo-700 mb-4 tracking-tight motion-safe:animate-bounce">
//                   ⚡ Quick Tips for Saving Electricity
//                 </h2>
//                 <ul className="list-disc list-inside text-gray-800 space-y-3 text-lg w-full max-w-lg">
//                   <li>Run high-power appliances (like washing machines) during off-peak hours.</li>
//                   <li>Set your AC to 25°C for optimal efficiency and savings.</li>
//                   <li>Switch off lights and devices when not in use.</li>
//                   <li>Use energy-efficient LED bulbs and appliances.</li>
//                   <li>Regularly check appliance health and maintenance.</li>
//                   <li>Track your usage with Electricity Usage Tracker to spot saving opportunities!</li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           {prediction && computedMonthUsage && (
//             <PredictionChart
//               prediction={prediction}
//               currentMonthUsage={computedMonthUsage.totalUnits}
//               currency={currency}
//             />
//           )}

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {computedMonthUsage && previousMonthUsage && (
//               <ComparisonChart
//                 currentMonth={{
//                   units: computedMonthUsage.totalUnits,
//                   cost: computedMonthUsage.totalCost,
//                 }}
//                 previousMonth={{
//                   units: previousMonthUsage.totalUnits,
//                   cost: previousMonthUsage.totalCost,
//                 }}
//                 currency={currency}
//               />
//             )}
//             <DeviceBreakdownChart devices={devices} currency={currency} />
//           </div>

//           {carbonFootprint && (
//             <CarbonFootprintGauge footprint={carbonFootprint} />
//           )}
//         </TabsContent>

//         <TabsContent value="appliances">
//           <ApplianceManagementSection currency={currency} />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };
