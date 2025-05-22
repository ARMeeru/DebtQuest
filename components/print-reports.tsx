"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Printer, FileText, BarChart, Calendar } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

import { AppData, Debt, Achievement, Payment } from "@/types"

interface PaymentWithDebt extends Payment {
  debtName: string;
  debtId: string;
}

export function PrintReports({ data, currency }: { data: AppData; currency?: string }) {
  const [reportType, setReportType] = useState("summary")
  const [includeOptions, setIncludeOptions] = useState({
    overview: true,
    debtDetails: true,
    paymentHistory: true,
    achievements: true,
    projections: true,
  })

  const toggleOption = (option: keyof typeof includeOptions) => {
    setIncludeOptions({
      ...includeOptions,
      [option]: !includeOptions[option],
    })
  }

  const generateReport = () => {
    // Create a new window for the report
    const reportWindow = window.open("", "_blank")
    if (!reportWindow) {
      console.error("Failed to open report window");
      return;
    }

    // Calculate some summary data
    const totalDebt = data.debts.reduce((sum: number, debt: Debt) => sum + debt.initialAmount, 0)
    const paidOffAmount = data.debts.reduce((sum: number, debt: Debt) => sum + debt.paidAmount, 0)
    const remainingAmount = totalDebt - paidOffAmount
    const paidOffPercentage = totalDebt > 0 ? Math.round((paidOffAmount / totalDebt) * 100) : 0

    // Get all payments across all debts, sorted by date
    const allPayments = data.debts
      .flatMap((debt: Debt) =>
        debt.payments.map((payment: Payment) => ({
          ...payment,
          debtName: debt.name,
          debtId: debt.id,
        })),
      )
      .sort((a: PaymentWithDebt, b: PaymentWithDebt) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Count unlocked achievements
    const unlockedAchievements = data.achievements.filter((a: Achievement) => a.unlocked)

    // Generate HTML content for the report
    let reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>DebtQuest Financial Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1, h2, h3 {
            color: #2d3748;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e2e8f0;
          }
          .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #e2e8f0;
            padding: 8px 12px;
            text-align: left;
          }
          th {
            background-color: #f7fafc;
          }
          .progress-container {
            background-color: #edf2f7;
            height: 20px;
            border-radius: 10px;
            margin: 10px 0;
          }
          .progress-bar {
            background-color: #10b981;
            height: 20px;
            border-radius: 10px;
          }
          .summary-box {
            display: inline-block;
            width: 30%;
            margin: 0 1%;
            padding: 15px;
            border: 1px solid #e2e8f0;
            border-radius: 5px;
            text-align: center;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 0.8em;
            color: #718096;
          }
          @media print {
            body {
              padding: 0;
            }
            button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>DebtQuest Financial Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
    `

    // Overview Section
    if (includeOptions.overview) {
      reportContent += `
        <div class="section">
          <h2>Debt Overview</h2>
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <div class="summary-box">
              <h3>Total Debt</h3>
              <p style="font-size: 1.5em; font-weight: bold;">${formatCurrency(totalDebt, currency)}</p>
            </div>
            <div class="summary-box">
              <h3>Paid Off</h3>
              <p style="font-size: 1.5em; font-weight: bold; color: #10b981;">${formatCurrency(paidOffAmount, currency)}</p>
            </div>
            <div class="summary-box">
              <h3>Remaining</h3>
              <p style="font-size: 1.5em; font-weight: bold;">${formatCurrency(remainingAmount, currency)}</p>
            </div>
          </div>
          
          <h3>Progress: ${paidOffPercentage}% Complete</h3>
          <div class="progress-container">
            <div class="progress-bar" style="width: ${paidOffPercentage}%;"></div>
          </div>
        </div>
      `
    }

    // Debt Details Section
    if (includeOptions.debtDetails) {
      reportContent += `
        <div class="section">
          <h2>Debt Details</h2>
          <table>
            <thead>
              <tr>
                <th>Debt Name</th>
                <th>Initial Amount</th>
                <th>Paid Amount</th>
                <th>Remaining</th>
                <th>Interest Rate</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
      `

      data.debts.forEach((debt: Debt) => {
        const debtProgress = Math.round((debt.paidAmount / debt.initialAmount) * 100)
        reportContent += `
          <tr>
            <td>${debt.name}</td>
            <td>${formatCurrency(debt.initialAmount, currency)}</td>
            <td>${formatCurrency(debt.paidAmount, currency)}</td>
            <td>${formatCurrency(debt.initialAmount - debt.paidAmount, currency)}</td>
            <td>${debt.interestRate}%</td>
            <td>${debtProgress}%</td>
          </tr>
        `
      })

      reportContent += `
            </tbody>
          </table>
        </div>
      `
    }

    // Payment History Section
    if (includeOptions.paymentHistory && allPayments.length > 0) {
      reportContent += `
        <div class="section">
          <h2>Payment History</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Debt</th>
                <th>Amount</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
      `

      allPayments.forEach((payment: PaymentWithDebt) => {
        reportContent += `
          <tr>
            <td>${formatDate(payment.date)}</td>
            <td>${payment.debtName}</td>
            <td>${formatCurrency(payment.amount, currency)}</td>
            <td>${payment.note || ""}</td>
          </tr>
        `
      })

      reportContent += `
            </tbody>
          </table>
        </div>
      `
    }

    // Achievements Section
    if (includeOptions.achievements) {
      reportContent += `
        <div class="section">
          <h2>Achievements</h2>
          <p>You've unlocked ${unlockedAchievements.length} out of ${data.achievements.length} achievements.</p>
          <table>
            <thead>
              <tr>
                <th>Achievement</th>
                <th>Description</th>
                <th>Status</th>
                <th>Date Unlocked</th>
              </tr>
            </thead>
            <tbody>
      `

      data.achievements.forEach((achievement: Achievement) => {
        reportContent += `
          <tr>
            <td>${achievement.name}</td>
            <td>${achievement.description}</td>
            <td>${achievement.unlocked ? "Unlocked" : "Locked"}</td>
            <td>${achievement.unlocked && achievement.unlockedAt ? formatDate(achievement.unlockedAt) : "-"}</td>
          </tr>
        `
      })

      reportContent += `
            </tbody>
          </table>
        </div>
      `
    }

    // Projections Section
    if (includeOptions.projections) {
      // Calculate projected payoff date based on current monthly payments
      const monthlyPaymentTotal = data.debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0)
      const remainingDebt = totalDebt - paidOffAmount

      // Simple projection (not accounting for interest accrual)
      const monthsToPayoff = monthlyPaymentTotal > 0 ? Math.ceil(remainingDebt / monthlyPaymentTotal) : 0
      const projectedPayoffDate = new Date()
      projectedPayoffDate.setMonth(projectedPayoffDate.getMonth() + monthsToPayoff)

      reportContent += `
        <div class="section">
          <h2>Debt Payoff Projections</h2>
          <table>
            <tr>
              <td><strong>Total Monthly Payment:</strong></td>
              <td>${formatCurrency(monthlyPaymentTotal, currency)}</td>
            </tr>
            <tr>
              <td><strong>Estimated Months to Debt Freedom:</strong></td>
              <td>${monthsToPayoff} months</td>
            </tr>
            <tr>
              <td><strong>Projected Debt-Free Date:</strong></td>
              <td>${formatDate(projectedPayoffDate)}</td>
            </tr>
          </table>
          
          <h3>Acceleration Scenarios</h3>
          <table>
            <thead>
              <tr>
                <th>Additional Monthly Payment</th>
                <th>New Payoff Timeline</th>
                <th>Months Saved</th>
              </tr>
            </thead>
            <tbody>
      `

      // Calculate acceleration scenarios
      const scenarios = [
        { percent: 10, amount: monthlyPaymentTotal * 0.1 },
        { percent: 25, amount: monthlyPaymentTotal * 0.25 },
        { percent: 50, amount: monthlyPaymentTotal * 0.5 },
      ]

      scenarios.forEach((scenario) => {
        const acceleratedMonthly = monthlyPaymentTotal + scenario.amount
        const acceleratedMonths = acceleratedMonthly > 0 ? Math.ceil(remainingDebt / acceleratedMonthly) : 0
        const monthsSaved = monthsToPayoff - acceleratedMonths

        reportContent += `
          <tr>
            <td>+${scenario.percent}% (${formatCurrency(scenario.amount, currency)})</td>
            <td>${acceleratedMonths} months</td>
            <td>${monthsSaved} months</td>
          </tr>
        `
      })

      reportContent += `
            </tbody>
          </table>
        </div>
      `
    }

    // Footer
    reportContent += `
        <div class="footer">
          <p>Generated by DebtQuest - Gamified Debt Reduction Tracker</p>
          <button onclick="window.print()">Print Report</button>
        </div>
      </body>
      </html>
    `

    // Write the content to the new window and trigger print
    reportWindow.document.open()
    reportWindow.document.write(reportContent)
    reportWindow.document.close()

    // Auto-print after a short delay to ensure content is loaded
    setTimeout(() => {
      reportWindow.print()
    }, 500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Print Reports
        </CardTitle>
        <CardDescription>Generate and print financial reports</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={reportType} onValueChange={setReportType}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Summary</span>
            </TabsTrigger>
            <TabsTrigger value="detailed" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Detailed</span>
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Monthly</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              A summary report includes your overall debt status, progress, and key metrics.
            </p>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              A detailed report includes comprehensive information about each debt, payment history, and projections.
            </p>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              A monthly report shows your progress over the past month, including payments made and milestones reached.
            </p>
          </TabsContent>
        </Tabs>

        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-3">Include in Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="overview"
                checked={includeOptions.overview}
                onCheckedChange={() => toggleOption("overview")}
              />
              <Label htmlFor="overview">Debt Overview</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="debtDetails"
                checked={includeOptions.debtDetails}
                onCheckedChange={() => toggleOption("debtDetails")}
              />
              <Label htmlFor="debtDetails">Debt Details</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="paymentHistory"
                checked={includeOptions.paymentHistory}
                onCheckedChange={() => toggleOption("paymentHistory")}
              />
              <Label htmlFor="paymentHistory">Payment History</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="achievements"
                checked={includeOptions.achievements}
                onCheckedChange={() => toggleOption("achievements")}
              />
              <Label htmlFor="achievements">Achievements</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="projections"
                checked={includeOptions.projections}
                onCheckedChange={() => toggleOption("projections")}
              />
              <Label htmlFor="projections">Payoff Projections</Label>
            </div>
          </div>
        </div>

        <Button onClick={generateReport} className="w-full">
          <Printer className="h-4 w-4 mr-2" />
          Generate & Print Report
        </Button>
      </CardContent>
    </Card>
  )
}
