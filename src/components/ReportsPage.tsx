import React, { useState } from "react";
import Magic3DInterface from "./Magic3DInterface";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Download,
  FileText,
  FileSpreadsheet,
  Calendar,
  TrendingDown,
  Zap,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { reportsApi } from "../lib/mockApi";
import {
  downloadFile,
  getCurrentMonth,
  formatCurrency,
  formatUnits,
} from "../lib/formatters";
import { toast } from "sonner";
import { useAppliances } from "../contexts/ApplianceContext";
// ...existing code...
import { generateUsageReportPDF } from "../lib/generateBillPDF";
import { generateBillPDF } from "../lib/generateBillPDF";
import { calculateApplianceUsage } from "../lib/applianceTypes";
import { Badge } from "./ui/badge";

export const ReportsPage: React.FC = () => {
  const { appliances } = useAppliances();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [loading, setLoading] = useState(false);

  const months = [
    getCurrentMonth(),
    "October 2025",
    "September 2025",
    "August 2025",
    "July 2025",
    "June 2025",
  ];

  const handleExportPDF = async () => {
    setLoading(true);
    try {
      // Calculate usage for each appliance for the report
      const usageData: { [applianceId: string]: number } = {};
      appliances.forEach((a) => {
        const usage = calculateApplianceUsage(a);
        usageData[a.id] = usage.monthlyKWh;
      });
      generateUsageReportPDF({ appliances, month: selectedMonth, usageData });
      toast.success("PDF report downloaded successfully");
    } catch (error) {
      toast.error("Failed to generate PDF report");
    } finally {
      setLoading(false);
      // ...existing code...
      return (
        <div className="space-y-6 w-full">
          <Magic3DInterface />
          {/* ...existing reports content... */}
        </div>
      );
    }
  };

  const handleExportCSV = async (range: "month" | "year") => {
    setLoading(true);
    try {
      const blob = await reportsApi.exportToCSV(range);
      downloadFile(blob, `wattwise-usage-${range}-${Date.now()}.csv`);
      toast.success("CSV data exported successfully");
    } catch (error) {
      toast.error("Failed to export CSV data");
    } finally {
      setLoading(false);
    }
  };

  // Mock report summary data
  const reportSummary = {
    totalUnits: 301.2,
    totalCost: 2410,
    avgDaily: 10.04,
    peakDay: "Oct 15, 2025",
    savingsVsLastMonth: 12.5,
    co2Saved: 34.5,
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="w-full">
        <h1 className="text-3xl font-semibold mb-2">Reports & Exports</h1>
        <p className="text-gray-600">
          Generate detailed reports and export your usage data
        </p>
      </div>

      {/* Month Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Reporting Period</CardTitle>
          <CardDescription>
            Choose a month to generate reports and export data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-gray-500" />
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Report Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Report Summary - {selectedMonth}</CardTitle>
          <CardDescription>
            Quick overview of your monthly usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-blue-700">Total Usage</p>
              </div>
              <p className="text-2xl font-semibold text-blue-900">
                {formatUnits(reportSummary.totalUnits)}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                {formatCurrency(reportSummary.totalCost)}
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-700">Savings</p>
              </div>
              <p className="text-2xl font-semibold text-green-900">
                {reportSummary.savingsVsLastMonth}%
              </p>
              <p className="text-sm text-green-600 mt-1">vs previous month</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <p className="text-sm text-purple-700">Peak Day</p>
              </div>
              <p className="text-lg font-semibold text-purple-900">
                {reportSummary.peakDay}
              </p>
              <p className="text-sm text-purple-600 mt-1">Highest usage</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Average Daily Usage</p>
              <p className="text-lg font-semibold">
                {formatUnits(reportSummary.avgDaily)}
              </p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">CO₂ Saved</p>
              <p className="text-lg font-semibold">
                {reportSummary.co2Saved} kg
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="w-full mb-6">
        {/* PDF Report - Expanded Width */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600" />
              Monthly Report (PDF)
            </CardTitle>
            <CardDescription>
              Comprehensive report with charts, insights, and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                ✓ Usage summary and statistics
              </p>
              <p className="flex items-center gap-2">
                ✓ Interactive charts and visualizations
              </p>
              <p className="flex items-center gap-2">
                ✓ AI insights and recommendations
              </p>
              <p className="flex items-center gap-2">
                ✓ Device-level breakdown
              </p>
              <p className="flex items-center gap-2">
                ✓ Carbon footprint analysis
              </p>
            </div>
            <Button
              onClick={handleExportPDF}
              disabled={loading}
              className="w-full gap-2"
            >
              <Download size={16} />
              {loading ? "Generating..." : "Download PDF Report"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            Previously generated reports and exports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { month: "October 2025", date: "", type: "PDF" },
              {
                month: "September 2025",
                date: "",
                type: "PDF",
              },
              { month: "August 2025", date: "", type: "PDF" },
            ].map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-sm">{report.month} Report</p>
                    <p className="text-xs text-gray-500">{report.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{report.type}</Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={() => {
                      // Generate random appliances for the month
                      const applianceNames = [
                        "Air Conditioner",
                        "Refrigerator",
                        "Water Heater",
                        "Lighting",
                        "Television",
                        "Washing Machine",
                        "Microwave",
                        "Fan",
                        "Laptop",
                        "Oven",
                      ];
                      const randomAppliances = Array.from(
                        { length: 4 + Math.floor(Math.random() * 3) },
                        (_, idx) => ({
                          id: `appliance-${report.month}-${idx}`,
                          name: applianceNames[
                            Math.floor(Math.random() * applianceNames.length)
                          ],
                          powerWatts: Math.floor(Math.random() * 1500 + 100),
                          hoursPerDay: Math.floor(Math.random() * 10 + 1),
                          daysPerMonth: Math.floor(Math.random() * 30 + 1),
                          createdAt: new Date().toISOString(),
                        })
                      );
                      // Generate random usage data
                      const usageData = {};
                      randomAppliances.forEach((a) => {
                        usageData[a.id] = Math.random() * 100 + 10;
                      });
                      generateUsageReportPDF({
                        appliances: randomAppliances,
                        month: report.month,
                        usageData,
                      });
                    }}
                  >
                    <Download size={16} /> Download Report
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
