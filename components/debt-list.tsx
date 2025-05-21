"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  CreditCard,
  Home,
  GraduationCap,
  Car,
  ShoppingBag,
  MoreHorizontal,
  Pencil,
  Trash2,
  DollarSign,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/utils"
import { PaymentForm } from "@/components/payment-form"
import { Debt } from "@/types"

interface DebtListProps {
  debts: Debt[]
  onAddDebt: () => void
  onUpdateDebt: (debt: Debt) => void
  onDeleteDebt: (debtId: string) => void
  currency?: string
}

export function DebtList({ debts, onAddDebt, onUpdateDebt, onDeleteDebt, currency = "USD" }: DebtListProps) {
  const [showPaymentForm, setShowPaymentForm] = useState<string | null>(null)

  const getDebtIcon = (type) => {
    switch (type) {
      case "credit-card":
        return <CreditCard className="h-5 w-5" />
      case "mortgage":
        return <Home className="h-5 w-5" />
      case "student-loan":
        return <GraduationCap className="h-5 w-5" />
      case "auto-loan":
        return <Car className="h-5 w-5" />
      default:
        return <ShoppingBag className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">My Debts</h2>
        <Button onClick={onAddDebt} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-1" />
          Add Debt
        </Button>
      </div>

      {debts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <CreditCard className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No debts added yet</h3>
            <p className="text-gray-500 mb-4">Start tracking your debts to visualize your path to financial freedom.</p>
            <Button onClick={onAddDebt} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-1" />
              Add Your First Debt
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {debts.map((debt) => {
            const remainingAmount = debt.initialAmount - debt.paidAmount
            const progressPercentage = (debt.paidAmount / debt.initialAmount) * 100

            return (
              <Card key={debt.id} className="overflow-hidden">
                <div className="border-l-4 border-emerald-500">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        {getDebtIcon(debt.type)}
                      </div>

                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <div>
                            <h3 className="font-medium">{debt.name}</h3>
                            <p className="text-sm text-gray-500">{debt.description}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-2 md:mt-0">
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              {debt.interestRate}% APR
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setShowPaymentForm(debt.id)}>
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  Make Payment
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit Debt
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    if (confirm("Are you sure you want to delete this debt?")) {
                                      onDeleteDebt(debt.id)
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <Progress value={progressPercentage} className="h-2 mb-2" />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Initial</p>
                            <p className="font-medium">{formatCurrency(debt.initialAmount, currency)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Paid</p>
                            <p className="font-medium text-emerald-600">{formatCurrency(debt.paidAmount, currency)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Remaining</p>
                            <p className="font-medium">{formatCurrency(remainingAmount, currency)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Monthly</p>
                            <p className="font-medium">{formatCurrency(debt.monthlyPayment, currency)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>

                {showPaymentForm === debt.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <PaymentForm
                      debt={debt}
                      onSubmit={(payment) => {
                        const updatedDebt = {
                          ...debt,
                          paidAmount: debt.paidAmount + payment.amount,
                          payments: [
                            ...debt.payments,
                            {
                              id: Date.now().toString(),
                              amount: payment.amount,
                              date: new Date().toISOString(),
                              note: payment.note,
                            },
                          ],
                        }
                        onUpdateDebt(updatedDebt)
                        setShowPaymentForm(null)
                      }}
                      onCancel={() => setShowPaymentForm(null)}
                    />
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
