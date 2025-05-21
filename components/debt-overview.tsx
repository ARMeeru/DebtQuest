"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, Calendar, Award, Trophy } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { DebtSnowball } from "@/components/debt-snowball"
import { AppData } from "@/types"

interface DebtOverviewProps {
  data: AppData
  totalDebt: number
  paidOffAmount: number
  paidOffPercentage: number
  currency?: string
}

export function DebtOverview({
  data,
  totalDebt,
  paidOffAmount,
  paidOffPercentage,
  currency = "USD",
}: DebtOverviewProps) {
  // Sort debts by interest rate (highest first)
  const sortedDebts = [...data.debts].sort((a, b) => b.interestRate - a.interestRate)

  // Get highest interest debt
  const highestInterestDebt = sortedDebts[0]

  // Get smallest balance debt
  const smallestBalanceDebt = [...data.debts].sort(
    (a, b) => a.initialAmount - a.paidAmount - (b.initialAmount - b.paidAmount),
  )[0]

  // Calculate monthly payment total
  const monthlyPaymentTotal = data.debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0)

  // Get recent achievements
  const recentAchievements = data.achievements
    .filter((a) => a.unlocked)
    .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
    .slice(0, 3)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Debt Freedom Progress</CardTitle>
            <CardDescription>Track your journey to becoming debt-free</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-medium">{paidOffPercentage}%</span>
                </div>
                <Progress value={paidOffPercentage} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm text-gray-500">Total Debt</p>
                  <p className="text-lg font-bold">{formatCurrency(totalDebt, currency)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Remaining</p>
                  <p className="text-lg font-bold">{formatCurrency(totalDebt - paidOffAmount, currency)}</p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm text-gray-500 mb-2">Monthly Payment</p>
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                    {formatCurrency(monthlyPaymentTotal, currency)}/month
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Debt Snowball Visualizer</CardTitle>
            <CardDescription>See how your debts will disappear over time</CardDescription>
          </CardHeader>
          <CardContent>
            <DebtSnowball debts={data.debts} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Strategy Focus</CardTitle>
              <TrendingDown className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Avalanche Method (Highest Interest)</p>
                {highestInterestDebt ? (
                  <div className="bg-white border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{highestInterestDebt.name}</h4>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        {highestInterestDebt.interestRate}%
                      </Badge>
                    </div>
                    <Progress
                      value={(highestInterestDebt.paidAmount / highestInterestDebt.initialAmount) * 100}
                      className="h-2 mb-2"
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        {formatCurrency(highestInterestDebt.paidAmount, currency)} paid
                      </span>
                      <span className="font-medium">
                        {formatCurrency(highestInterestDebt.initialAmount - highestInterestDebt.paidAmount, currency)}{" "}
                        left
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No debts added yet</div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Snowball Method (Smallest Balance)</p>
                {smallestBalanceDebt ? (
                  <div className="bg-white border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{smallestBalanceDebt.name}</h4>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Smallest
                      </Badge>
                    </div>
                    <Progress
                      value={(smallestBalanceDebt.paidAmount / smallestBalanceDebt.initialAmount) * 100}
                      className="h-2 mb-2"
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        {formatCurrency(smallestBalanceDebt.paidAmount, currency)} paid
                      </span>
                      <span className="font-medium">
                        {formatCurrency(smallestBalanceDebt.initialAmount - smallestBalanceDebt.paidAmount, currency)}{" "}
                        left
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No debts added yet</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Achievements</CardTitle>
              <Award className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            {recentAchievements.length > 0 ? (
              <div className="space-y-3">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium">{achievement.name}</p>
                      <p className="text-xs text-gray-500">{achievement.description}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View All Achievements
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <Trophy className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Complete goals to earn achievements</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Debt-Free Forecast</CardTitle>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            {data.debts.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Estimated Debt-Free Date</p>
                  <p className="text-xl font-bold text-emerald-600">June 2026</p>
                  <p className="text-xs text-gray-500 mt-1">Based on current payment schedule</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Accelerate Your Timeline</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current monthly payment:</span>
                      <span className="font-medium">{formatCurrency(monthlyPaymentTotal, currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Add 10% more:</span>
                      <span className="font-medium text-emerald-600">-4 months</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Add 25% more:</span>
                      <span className="font-medium text-emerald-600">-9 months</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Add debts to see your debt-free date</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
