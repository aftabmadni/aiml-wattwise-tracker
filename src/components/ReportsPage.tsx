import React, { useState } from "react";
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
import { Badge } from "./ui/badge";

export const ReportsPage: React.FC = () => {
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
      const blob = await reportsApi.exportToPDF(selectedMonth);
      downloadFile(
        blob,
        `wattwise-report-${selectedMonth.replace(" ", "-")}.pdf`
      );
      toast.success("PDF report downloaded successfully");
    } catch (error) {
      toast.error("Failed to generate PDF report");
    } finally {
      setLoading(false);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Report */}
        <Card>
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

        {/* CSV Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
              Raw Data (CSV)
            </CardTitle>
            <CardDescription>
              Export raw usage data for custom analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                ✓ Timestamp-level granular data
              </p>
              <p className="flex items-center gap-2">✓ Units consumed (kWh)</p>
              <p className="flex items-center gap-2">✓ Cost breakdown</p>
              <p className="flex items-center gap-2">
                ✓ Device ID and metadata
              </p>
              <p className="flex items-center gap-2">
                ✓ Compatible with Excel & tools
              </p>
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => handleExportCSV("month")}
                disabled={loading}
                variant="outline"
                className="w-full gap-2"
              >
                <Download size={16} />
                Export Month Data (CSV)
              </Button>
              <Button
                onClick={() => handleExportCSV("year")}
                disabled={loading}
                variant="outline"
                className="w-full gap-2"
              >
                <Download size={16} />
                Export Year Data (CSV)
              </Button>
            </div>
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
                type: "PDF & CSV",
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
                  <Button size="sm" variant="ghost">
                   
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
