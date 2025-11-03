import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { paymentsApi } from '../lib/mockApi';
import { Button } from './ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Plus, Zap, DollarSign, TrendingUp, Lightbulb, Edit, Trash2 } from 'lucide-react';
import { useAppliances } from '../contexts/ApplianceContext';
import { calculateApplianceUsage, calculateApplianceSummary, generateApplianceInsights } from '../lib/applianceTypes';
import { formatCurrency, formatUnits } from '../lib/formatters';
import { Badge } from './ui/badge';
import { AddApplianceModal } from './AddApplianceModal';
import { EditApplianceModal } from './EditApplianceModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { toast } from 'sonner';

interface ApplianceManagementSectionProps {
  currency: 'INR' | 'USD' | 'EUR';
}

export const ApplianceManagementSection: React.FC<ApplianceManagementSectionProps> = ({ currency }) => {
  const { appliances, deleteAppliance } = useAppliances();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApplianceId, setEditingApplianceId] = useState<string | null>(null);
  const [deletingApplianceId, setDeletingApplianceId] = useState<string | null>(null);

  const costPerKWh = 8; // ₹8 per kWh
  const summary = calculateApplianceSummary(appliances, costPerKWh);
  const insights = generateApplianceInsights(appliances, summary);

  // Update canonical current month bill whenever appliance summary changes
  useEffect(() => {
    if (summary.totalMonthlyCost > 0) {
      paymentsApi.updateCurrentMonthBill(summary.totalMonthlyCost)
        .catch(console.error);
    }
  }, [summary.totalMonthlyCost]);

  // Prepare chart data
  const chartData = appliances.map(appliance => {
    const calc = calculateApplianceUsage(appliance, costPerKWh);
    return {
      name: appliance.name.length > 15 ? appliance.name.substring(0, 15) + '...' : appliance.name,
      kWh: calc.monthlyKWh,
      cost: calc.monthlyCost,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    };
  }).sort((a, b) => b.kWh - a.kWh);

  const handleDelete = async () => {
    if (!deletingApplianceId) return;
    
    deleteAppliance(deletingApplianceId);
    toast.success('Appliance deleted successfully');
    setDeletingApplianceId(null);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-sm mb-1">{payload[0].payload.name}</p>
          <p className="text-sm text-blue-600">
            Energy: {formatUnits(payload[0].value)}
          </p>
          <p className="text-sm text-green-600">
            Cost: {formatCurrency(payload[1].value, currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (appliances.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Appliances Added Yet</h3>
            <p className="text-gray-600 mb-4">
              Start tracking your energy consumption by adding your appliances
            </p>
            <Button onClick={() => setShowAddModal(true)} className="gap-2">
              <Plus size={18} />
              Add Your First Appliance
            </Button>
          </div>
        </CardContent>
        <AddApplianceModal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)} 
        />
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Consumption</p>
                  <p className="text-3xl font-semibold text-blue-600">
                    {formatUnits(summary.totalMonthlyKWh)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">per month</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Estimated Bill</p>
                  <p className="text-3xl font-semibold text-green-600">
                    {formatCurrency(summary.totalMonthlyCost, currency)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">per month</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Potential Savings</p>
                  <p className="text-3xl font-semibold text-orange-600">
                    {summary.potentialSavingsPercent}%
                  </p>
                  <p className="text-sm text-gray-500 mt-1">optimization possible</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-purple-600" />
              AI-Powered Insights
            </CardTitle>
            <CardDescription>
              Based on your appliance usage patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg border border-purple-200"
                >
                  <p className="text-sm text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Energy Usage Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Energy Usage by Appliance</CardTitle>
              <CardDescription>Monthly consumption in kWh</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                      label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="kWh" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Cost Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Cost by Appliance</CardTitle>
              <CardDescription>Monthly cost in {currency}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                      label={{ value: currency, angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="cost" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appliance List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Appliances</CardTitle>
                <CardDescription>
                  Manage your tracked appliances
                </CardDescription>
              </div>
              <Button onClick={() => setShowAddModal(true)} className="gap-2">
                <Plus size={18} />
                Add Appliance
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appliances.map(appliance => {
                const calc = calculateApplianceUsage(appliance, costPerKWh);
                const isTopConsumer = summary.topConsumer?.appliance.id === appliance.id;

                return (
                  <div
                    key={appliance.id}
                    className={`p-4 rounded-lg border transition-all ${
                      isTopConsumer 
                        ? 'border-orange-200 bg-orange-50' 
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{appliance.name}</h4>
                          {isTopConsumer && (
                            <Badge variant="destructive" className="text-xs">
                              Top Consumer
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-gray-600">Power</p>
                            <p className="font-medium">{appliance.powerWatts}W</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Daily Usage</p>
                            <p className="font-medium">{appliance.hoursPerDay}h/day</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Monthly Energy</p>
                            <p className="font-medium text-blue-600">
                              {formatUnits(calc.monthlyKWh)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Monthly Cost</p>
                            <p className="font-medium text-green-600">
                              {formatCurrency(calc.monthlyCost, currency)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingApplianceId(appliance.id)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingApplianceId(appliance.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <AddApplianceModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />

      {editingApplianceId && (
        <EditApplianceModal
          applianceId={editingApplianceId}
          isOpen={true}
          onClose={() => setEditingApplianceId(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingApplianceId} onOpenChange={() => setDeletingApplianceId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Appliance</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this appliance? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
