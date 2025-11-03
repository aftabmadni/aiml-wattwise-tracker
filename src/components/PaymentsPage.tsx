import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  CreditCard, 
  Smartphone, 
  CheckCircle, 
  Clock, 
  XCircle,
  Download,
  QrCode,
  ExternalLink
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { paymentsApi } from '../lib/mockApi';
import { PaymentHistory } from '../lib/types';
import { formatCurrency, formatDate } from '../lib/formatters';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface PaymentsPageProps {
  predictedBill: number;
  actualBill: number;
  currency: 'INR' | 'USD' | 'EUR';
}

export const PaymentsPage: React.FC<PaymentsPageProps> = ({
  predictedBill,
  actualBill,
  currency
}) => {
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi'>('razorpay');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentType, setPaymentType] = useState<'predicted' | 'actual'>('actual');
  const [upiLink, setUpiLink] = useState('');
  const [qrCode, setQrCode] = useState('');

  const [currentBill, setCurrentBill] = useState<number | null>(null);

  useEffect(() => {
    loadPaymentHistory();
    
    // Load current month bill from canonical source
    const loadCurrentBill = async () => {
      try {
        const amount = await paymentsApi.getCurrentMonthBill();
        setCurrentBill(amount);
      } catch (err) {
        console.error('Failed to load current bill:', err);
      }
    };

    loadCurrentBill();
  }, []);

  // Debug logging to help trace mismatched values seen in screenshots
  // Note: PaymentsPage relies on the `actualBill` prop passed from the parent for the canonical
  // current month bill. Parent should ensure it has loaded the aggregated usage before
  // rendering this page to avoid transient fallbacks.

  const loadPaymentHistory = async () => {
    try {
      const history = await paymentsApi.getPaymentHistory();
      setPaymentHistory(history);
    } catch (error) {
      toast.error('Failed to load payment history');
    }
  };

  const handlePayClick = (amount: number, type: 'predicted' | 'actual') => {
    setPaymentAmount(amount);
    setPaymentType(type);
    setShowPaymentDialog(true);
  };

  const processRazorpayPayment = async () => {
    setLoading(true);
    try {
      // Create order
      const order = await paymentsApi.createOrder(paymentAmount, paymentType);

      // In production, this would open Razorpay checkout
      // For demo, we'll simulate success after a delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate payment verification
      await paymentsApi.verifyPayment(
        order.id,
        'pay_mock_' + Date.now(),
        'sig_mock_' + Date.now()
      );

      toast.success('Payment successful!', {
        description: `Your bill of ${formatCurrency(paymentAmount, currency)} has been paid.`
      });

      setShowPaymentDialog(false);
      loadPaymentHistory();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const processUPIPayment = async () => {
    setLoading(true);
    try {
      const { upiLink: link, qrCode: qr } = await paymentsApi.generateUPILink(paymentAmount);
      setUpiLink(link);
      setQrCode(qr);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to generate UPI link');
      setLoading(false);
    }
  };

  const handlePaymentMethodChange = (method: 'razorpay' | 'upi') => {
    setPaymentMethod(method);
    setUpiLink('');
    setQrCode('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-700">Success</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold mb-2">Payments</h1>
        <p className="text-gray-600">
          Pay your electricity bills and view payment history
        </p>
      </div>

      {/* Pay Bills Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Actual Bill */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Current Month Bill</CardTitle>
                <CardDescription>
                  Based on actual usage this month
                </CardDescription>
              </div>
              <Badge>Actual</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Amount Due</p>
              <p className="text-4xl font-bold text-blue-600">
                {formatCurrency(currentBill ?? actualBill, currency)}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Due date: Nov 30, 2024
              </p>
            </div>
            <Button 
              onClick={() => handlePayClick(currentBill ?? actualBill, 'actual')}
              className="w-full gap-2"
              size="lg"
            >
              <CreditCard size={18} />
              Pay Actual Bill
            </Button>
          </CardContent>
        </Card>

        {/* Predicted Bill */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Predicted Next Month</CardTitle>
                <CardDescription>
                  AI-powered forecast for advance payment
                </CardDescription>
              </div>
              <Badge variant="secondary">Predicted</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Estimated Amount</p>
              <p className="text-4xl font-bold text-purple-600">
                {formatCurrency(predictedBill, currency)}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                For December 2024
              </p>
            </div>
            <Button 
              onClick={() => handlePayClick(predictedBill, 'predicted')}
              variant="outline"
              className="w-full gap-2"
              size="lg"
            >
              <CreditCard size={18} />
              Pay Predicted Bill
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            View all your past transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No payment history available
            </div>
          ) : (
            <div className="space-y-3">
              {paymentHistory.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(payment.status)}
                    <div>
                      <p className="font-medium text-sm">{payment.billMonth}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(payment.paidAt)} • {payment.method.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(payment.amount, currency)}
                      </p>
                      {getStatusBadge(payment.status)}
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Pay your {paymentType === 'actual' ? 'current' : 'predicted'} bill securely
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Amount to Pay</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(paymentAmount, currency)}
              </p>
            </div>

            <Tabs value={paymentMethod} onValueChange={(v) => handlePaymentMethodChange(v as any)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="razorpay" className="gap-2">
                  <CreditCard size={16} />
                  Razorpay
                </TabsTrigger>
                <TabsTrigger value="upi" className="gap-2">
                  <Smartphone size={16} />
                  UPI
                </TabsTrigger>
              </TabsList>

              <TabsContent value="razorpay" className="space-y-4 mt-4">
                <p className="text-sm text-gray-600">
                  Pay securely using Razorpay with Credit/Debit Card, Net Banking, or UPI
                </p>
                <Button 
                  onClick={processRazorpayPayment} 
                  disabled={loading}
                  className="w-full gap-2"
                  size="lg"
                >
                  <CreditCard size={18} />
                  {loading ? 'Processing...' : 'Pay with Razorpay'}
                </Button>
                <p className="text-xs text-center text-gray-500">
                  You will be redirected to Razorpay's secure payment gateway
                </p>
              </TabsContent>

              <TabsContent value="upi" className="space-y-4 mt-4">
                {!upiLink ? (
                  <>
                    <p className="text-sm text-gray-600">
                      Generate a UPI payment link to pay using any UPI app
                    </p>
                    <Button 
                      onClick={processUPIPayment} 
                      disabled={loading}
                      variant="outline"
                      className="w-full gap-2"
                      size="lg"
                    >
                      <QrCode size={18} />
                      {loading ? 'Generating...' : 'Generate UPI Link'}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                        <img src={qrCode} alt="UPI QR Code" className="w-48 h-48" />
                      </div>
                      <p className="text-sm text-gray-600 mt-3">
                        Scan QR code with any UPI app
                      </p>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => window.open(upiLink, '_blank')}
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <ExternalLink size={16} />
                      Open in UPI App
                    </Button>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
