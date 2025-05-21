"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Plus, Menu } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useState } from "react"

interface DashboardHeaderProps {
  totalDebt: number
  paidOffAmount: number
  paidOffPercentage: number
  onAddDebt: () => void
  currency?: string
  children?: React.ReactNode
}

export function DashboardHeader({
  totalDebt,
  paidOffAmount,
  paidOffPercentage,
  onAddDebt,
  currency = "USD",
  children,
}: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <h1 className="text-xl font-bold">DebtQuest</h1>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>

          <div className="flex items-center gap-2">
            {children}
            <Button onClick={onAddDebt} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-1" />
              Add Debt
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-red-50 rounded-full dark:bg-red-950">
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900">
                  <span className="text-lg font-semibold">-</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Debt</p>
                <p className="text-xl font-bold">{formatCurrency(totalDebt, currency)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-green-50 rounded-full dark:bg-green-950">
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900">
                  <span className="text-lg font-semibold">+</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid Off</p>
                <p className="text-xl font-bold">{formatCurrency(paidOffAmount, currency)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-xl font-bold">{paidOffPercentage}%</p>
                </div>
                <Trophy className="h-6 w-6 text-amber-500" />
              </div>
              <Progress value={paidOffPercentage} className="h-2" />
            </CardContent>
          </Card>
        </div>
      </div>
    </header>
  )
}
