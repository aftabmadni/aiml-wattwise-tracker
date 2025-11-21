// Bill PDF for Payments section
export function generateBillPDF({
  appliances,
  payment,
  currency,
}: {
  appliances: Appliance[];
  payment: any;
  currency: "INR" | "USD" | "EUR";
}) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Electricity Bill", 14, 18);
  doc.setFontSize(12);
  doc.text(`Month: ${payment.billMonth}`, 14, 28);
  doc.text(`Amount Paid: ${payment.amount} ${currency}`, 14, 36);
  doc.text(`Payment Method: ${payment.method.toUpperCase()}`, 14, 44);
  doc.text(`Status: ${payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}`, 14, 52);
  doc.text(`Paid On: ${new Date(payment.paidAt).toLocaleDateString()}`, 14, 60);

  const tableData = appliances.map((a, idx) => [
    idx + 1,
    a.name,
    `${a.powerWatts}W`,
    `${a.hoursPerDay}h/day`,
    `${a.daysPerMonth} days`,
  ]);

  autoTable(doc, {
    startY: 70,
    head: [["#", "Appliance", "Power", "Daily Usage", "Days Active"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 11 },
  });

  doc.save(`Electricity_Bill_${payment.billMonth.replace(/\s/g, "_")}.pdf`);
}
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Appliance } from "./applianceTypes";

// Usage-only report for Reports section
export function generateUsageReportPDF({
  appliances,
  month,
  usageData,
}: {
  appliances: Appliance[];
  month: string;
  usageData: { [applianceId: string]: number };
}) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Monthly Appliance Usage Report", 14, 18);
  doc.setFontSize(12);
  doc.text(`Month: ${month}`, 14, 28);
  doc.text("This report shows only appliances you have added and their total energy usage.", 14, 36);

  const tableData = appliances.map((a, idx) => [
    idx + 1,
    a.name,
    `${a.powerWatts}W`,
    `${a.hoursPerDay}h/day`,
    `${a.daysPerMonth} days`,
    `${usageData[a.id]?.toFixed(2) || "0.00"} kWh`,
  ]);

  autoTable(doc, {
    startY: 50,
    head: [["#", "Appliance", "Power", "Daily Usage", "Days Active", "Total kWh Used"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 11 },
  });

  doc.save(`Usage_Report_${month.replace(/\s/g, "_")}.pdf`);
}
