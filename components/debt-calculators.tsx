"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, TrendingDown, TrendingUp, Calendar, DollarSign } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

// Update the DebtCalculators component to accept currency prop
export function DebtCalculators({ currency = "USD" }: { currency?: string }) {
  const [activeTab, setActiveTab] = useState("snowball")
  const [debts, setDebts] = useState<Array<{
    id: string;
    name: string;
    balance: number;
    rate: number;
    payment: number;
    monthsToPayoff?: number;
    totalInterest?: number;
    payoffDate?: Date;
    paymentSchedule?: Array<{
      month: number;
      payment: number;
      principal: number;
      interest: number;
      remainingBalance: number;
    }>;
  }>>([
    { id: "1", name: "Credit Card", balance: 5000, rate: 18.99, payment: 150 },
    { id: "2", name: "Car Loan", balance: 12000, rate: 4.5, payment: 300 },
    { id: "3", name: "Student Loan", balance: 25000, rate: 5.8, payment: 400 },
  ])
  const [extraPayment, setExtraPayment] = useState<number>(200)
  const [results, setResults] = useState<{
    standard: {
      months: number;
      interest: number;
      payoffDate: Date;
    };
    withExtra: {
      months: number;
      interest: number;
      payoffDate: Date;
      monthlyResults: Array<{
        month: number;
        debts: Array<{
          name: string;
          balance: number;
        }>;
      }>;
    };
    monthsSaved: number;
    interestSaved: number;
  } | null>(null)

  const handleDebtChange = (id: string, field: string, value: string | number): void => {
    const parsedValue = typeof value === 'string' && field !== 'name' ? parseFloat(value) || 0 : value;
    setDebts(debts.map((debt) => (debt.id === id ? { ...debt, [field]: parsedValue } : debt)));
  }

  const addDebt = () => {
    setDebts([
      ...debts,
      {
        id: Date.now().toString(),
        name: "New Debt",
        balance: 0,
        rate: 0,
        payment: 0,
      },
    ])
  }

  const removeDebt = (id: string): void => {
    setDebts(debts.filter((debt) => debt.id !== id))
  }

  const calculatePayoff = () => {
    // Clone debts for calculation
    const debtsCopy = debts.map((debt) => ({
      ...debt,
      balance: debt.balance,
      rate: debt.rate,
      payment: debt.payment,
      monthsToPayoff: 0,
      totalInterest: 0,
      payoffDate: new Date(),
      paymentSchedule: [] as Array<{
        month: number;
        payment: number;
        principal: number;
        interest: number;
        remainingBalance: number;
      }>,
    }))

    // Sort by balance (snowball) or interest rate (avalanche)
    const sortedDebts = [...debtsCopy].sort((a, b) => {
      if (activeTab === "snowball") {
        return a.balance - b.balance
      } else {
        return b.rate - a.rate
      }
    })

    const currentDate = new Date()
    let totalMonths = 0
    let totalInterestPaid = 0
    const monthlyExtra = extraPayment

    // Calculate minimum payment months and interest
    sortedDebts.forEach((debt) => {
      if (debt.balance <= 0 || debt.payment <= 0) return

      let balance = debt.balance
      const monthlyRate = debt.rate / 100 / 12
      let monthCount = 0
      let interestPaid = 0

      while (balance > 0) {
        const interestAmount = balance * monthlyRate
        let principalAmount = debt.payment - interestAmount

        if (principalAmount > balance) {
          principalAmount = balance
        }

        interestPaid += interestAmount
        balance -= principalAmount
        monthCount++

        if (!debt.paymentSchedule) {
          debt.paymentSchedule = [];
        }
        debt.paymentSchedule.push({
          month: monthCount,
          payment: debt.payment,
          principal: principalAmount,
          interest: interestAmount,
          remainingBalance: balance,
        })
      }

      debt.monthsToPayoff = monthCount
      debt.totalInterest = interestPaid

      // Set payoff date
      const payoffDate = new Date(currentDate)
      payoffDate.setMonth(payoffDate.getMonth() + monthCount)
      debt.payoffDate = payoffDate

      if (monthCount > totalMonths) {
        totalMonths = monthCount
      }

      totalInterestPaid += interestPaid
    })

    // Calculate with extra payment (snowball or avalanche)
    const extraPaymentResults = []
    let remainingDebts = [...sortedDebts]
    let currentMonth = 0
    let extraInterestPaid = 0

    while (remainingDebts.length > 0) {
      currentMonth++
      let extraRemaining = monthlyExtra

      // Apply regular payments and calculate interest
      remainingDebts.forEach((debt) => {
        const interestAmount = debt.balance * (debt.rate / 100 / 12)
        let principalAmount = debt.payment - interestAmount

        if (principalAmount > debt.balance) {
          principalAmount = debt.balance
        }

        extraInterestPaid += interestAmount
        debt.balance -= principalAmount
      })

      // Apply extra payment to first debt
      while (extraRemaining > 0 && remainingDebts.length > 0) {
        const targetDebt = remainingDebts[0]

        if (targetDebt.balance <= extraRemaining) {
          extraRemaining -= targetDebt.balance
          targetDebt.balance = 0
        } else {
          targetDebt.balance -= extraRemaining
          extraRemaining = 0
        }

        // Remove paid off debts
        remainingDebts = remainingDebts.filter((debt) => debt.balance > 0)
      }

      // Record monthly state
      extraPaymentResults.push({
        month: currentMonth,
        debts: remainingDebts.map((debt) => ({
          name: debt.name,
          balance: debt.balance,
        })),
      })

      // Break if taking too long (safety)
      if (currentMonth > 600) break
    }

    // Calculate extra payment results
    const extraPayoffDate = new Date(currentDate)
    extraPayoffDate.setMonth(extraPayoffDate.getMonth() + currentMonth)

    setResults({
      standard: {
        months: totalMonths,
        interest: totalInterestPaid,
        payoffDate: new Date(currentDate.setMonth(currentDate.getMonth() + totalMonths)),
      },
      withExtra: {
        months: currentMonth,
        interest: extraInterestPaid,
        payoffDate: extraPayoffDate,
        monthlyResults: extraPaymentResults,
      },
      monthsSaved: totalMonths - currentMonth,
      interestSaved: totalInterestPaid - extraInterestPaid,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Debt Payoff Calculators</CardTitle>
              <CardDescription>Compare different debt payoff strategies</CardDescription>
            </div>
            <Calculator className="h-6 w-6 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="snowball">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  <span>Debt Snowball</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="avalanche">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Debt Avalanche</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="snowball" className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Debt Snowball Method</h3>
                <p className="text-sm text-gray-600">
                  Pay minimum payments on all debts, then put extra money toward the smallest balance first. When that&apos;s
                  paid off, roll that payment into the next smallest debt.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="avalanche" className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Debt Avalanche Method</h3>
                <p className="text-sm text-gray-600">
                  Pay minimum payments on all debts, then put extra money toward the highest interest rate debt first.
                  This saves the most money in interest over time.
                </p>
              </div>
            </TabsContent>

            <div className="space-y-4">
              <div>
                <Label>Your Debts</Label>
                <div className="mt-2 space-y-3">
                  {debts.map((debt) => (
                    <div key={debt.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-3">
                        <Input
                          placeholder="Debt name"
                          value={debt.name}
                          onChange={(e) => handleDebtChange(debt.id, "name", e.target.value)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          placeholder="Balance"
                          value={debt.balance.toString()}
                          onChange={(e) => handleDebtChange(debt.id, "balance", e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="Rate %"
                          value={debt.rate.toString()}
                          onChange={(e) => handleDebtChange(debt.id, "rate", e.target.value)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          placeholder="Min Payment"
                          value={debt.payment.toString()}
                          onChange={(e) => handleDebtChange(debt.id, "payment", e.target.value)}
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDebt(debt.id)}
                          className="text-red-500"
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" size="sm" onClick={addDebt} className="mt-2">
                  + Add Another Debt
                </Button>
              </div>

              <div>
                <Label htmlFor="extra-payment">Extra Monthly Payment</Label>
                <div className="flex items-center gap-2 mt-2">
                    <Input
                      id="extra-payment"
                      type="number"
                      value={extraPayment.toString()}
                      onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
                    />
                  <Button onClick={calculatePayoff} className="bg-emerald-600 hover:bg-emerald-700">
                    Calculate
                  </Button>
                </div>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Payoff Results</CardTitle>
            <CardDescription>
              {activeTab === "snowball" ? "Debt Snowball" : "Debt Avalanche"} with Extra Payment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Standard Payoff (Minimum Payments)</h3>
                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Months to pay off:</span>
                    <span className="font-medium">{results.standard.months} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total interest paid:</span>
                    <span className="font-medium">{formatCurrency(results.standard.interest, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payoff date:</span>
                    <span className="font-medium">{results.standard.payoffDate.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">With Extra Payment</h3>
                <div className="bg-emerald-50 p-4 rounded-md space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Months to pay off:</span>
                    <span className="font-medium">{results.withExtra.months} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total interest paid:</span>
                    <span className="font-medium">{formatCurrency(results.withExtra.interest, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payoff date:</span>
                    <span className="font-medium">{results.withExtra.payoffDate.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h3 className="font-medium mb-2">Your Savings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time Saved</p>
                    <p className="font-medium">{results.monthsSaved} months</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Interest Saved</p>
                    <p className="font-medium">{formatCurrency(results.interestSaved, currency)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
