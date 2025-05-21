"use client"

import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  PiggyBank,
  Trophy,
  BarChart3,
  Calculator,
  Settings,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { DebtOverview } from "@/components/debt-overview"
import { DebtList } from "@/components/debt-list"
import { AddDebtForm } from "@/components/add-debt-form"
import { EnhancedAchievements } from "@/components/enhanced-achievements"
import { DebtCalculators } from "@/components/debt-calculators"
import { DataManagement } from "@/components/data-management"
import { DashboardHeader } from "@/components/dashboard-header"
import { initialData } from "@/lib/initial-data"
import { NotificationCenter } from "@/components/notifications"
import Link from "next/link"
import { PrintReports } from "@/components/print-reports"
import { ThemeToggle } from "@/components/theme-toggle"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAvailableCurrencies } from "@/lib/utils"

export default function Dashboard() {
  const [data, setData] = useLocalStorage("debt-quest-data", initialData)
  const [showAddDebt, setShowAddDebt] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currency, setCurrency] = useLocalStorage("debt-quest-currency", "USD")

  // Calculate total debt and paid off amounts
  const totalDebt = data.debts.reduce((sum, debt) => sum + debt.initialAmount, 0)
  const paidOffAmount = data.debts.reduce((sum, debt) => sum + debt.paidAmount, 0)
  const paidOffPercentage = totalDebt > 0 ? Math.round((paidOffAmount / totalDebt) * 100) : 0

  // Get next milestone
  const getNextMilestone = () => {
    const milestones = [25, 50, 75, 100]
    const nextMilestone = milestones.find((m) => m > paidOffPercentage) || 100
    return nextMilestone
  }

  const nextMilestone = getNextMilestone()

  // Memoize the update achievements callback to prevent it from changing on every render
  const handleUpdateAchievements = useCallback(
    (updatedAchievements) => {
      setData((prevData) => ({
        ...prevData,
        achievements: updatedAchievements,
      }))
    },
    [setData],
  )

  // Add new achievements if they don't exist
  useEffect(() => {
    const newAchievements = [
      {
        id: "11",
        name: "Debt Destroyer",
        description: "Completely paid off two or more debts",
        category: "milestones",
        points: 75,
        unlocked: false,
        unlockedAt: null,
      },
      {
        id: "12",
        name: "Budget Master",
        description: "Maintained consistent payments for 6 months",
        category: "consistency",
        points: 50,
        unlocked: false,
        unlockedAt: null,
        progressBased: true,
        currentProgress: 0,
        targetProgress: 6,
      },
      {
        id: "13",
        name: "Interest Slayer",
        description: "Paid off a high-interest debt (>15%)",
        category: "strategy",
        points: 40,
        unlocked: false,
        unlockedAt: null,
      },
      {
        id: "14",
        name: "Financial Planner",
        description: "Created a debt payoff strategy using calculators",
        category: "strategy",
        points: 20,
        unlocked: false,
        unlockedAt: null,
      },
      {
        id: "15",
        name: "Data Analyst",
        description: "Generated your first financial report",
        category: "reports",
        points: 15,
        unlocked: false,
        unlockedAt: null,
      },
    ]

    // Check if these achievements already exist
    const existingIds = data.achievements.map((a) => a.id)
    const missingAchievements = newAchievements.filter((a) => !existingIds.includes(a.id))

    if (missingAchievements.length > 0) {
      setData({
        ...data,
        achievements: [...data.achievements, ...missingAchievements],
      })
    }
  }, [data, setData]) // Include data and setData as dependencies

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } hidden md:flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out`}
      >
        <div className={`flex items-center gap-2 p-4 ${sidebarCollapsed ? "justify-center" : "mb-4"}`}>
          <PiggyBank className="h-6 w-6 text-emerald-600 flex-shrink-0" />
          {!sidebarCollapsed && <h1 className="text-xl font-bold"><Link href="/">DebtQuest</Link></h1>}
        </div>

        <nav className="space-y-1 flex-1 px-2">
          <NavItem
            icon={<Home className="h-5 w-5" />}
            label="Overview"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            collapsed={sidebarCollapsed}
          />
          <NavItem
            icon={<TrendingDown className="h-5 w-5" />}
            label="My Debts"
            active={activeTab === "debts"}
            onClick={() => setActiveTab("debts")}
            collapsed={sidebarCollapsed}
          />
          <NavItem
            icon={<Trophy className="h-5 w-5" />}
            label="Achievements"
            active={activeTab === "achievements"}
            onClick={() => setActiveTab("achievements")}
            collapsed={sidebarCollapsed}
          />
          <NavItem
            icon={<BarChart3 className="h-5 w-5" />}
            label="Reports"
            active={activeTab === "reports"}
            onClick={() => setActiveTab("reports")}
            collapsed={sidebarCollapsed}
          />
          <NavItem
            icon={<Calculator className="h-5 w-5" />}
            label="Calculators"
            active={activeTab === "calculators"}
            onClick={() => setActiveTab("calculators")}
            collapsed={sidebarCollapsed}
          />
          <NavItem
            icon={<Bell className="h-5 w-5" />}
            label="Notifications"
            active={activeTab === "notifications"}
            onClick={() => setActiveTab("notifications")}
            collapsed={sidebarCollapsed}
          />
          <NavItem
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
            collapsed={sidebarCollapsed}
          />
        </nav>

        <div className="pt-4 border-t border-border p-2">
          <Card className="overflow-hidden">
            <CardContent className={`p-3 ${sidebarCollapsed ? "text-center" : ""}`}>
              <div className={`flex items-center justify-between mb-2 ${sidebarCollapsed ? "flex-col gap-2" : ""}`}>
                {!sidebarCollapsed && <h3 className="font-medium text-sm">Debt Freedom</h3>}
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  {paidOffPercentage}%
                </Badge>
              </div>
              <Progress value={paidOffPercentage} className="h-2 mb-2" />
              {!sidebarCollapsed && <p className="text-xs text-muted-foreground">Next milestone: {nextMilestone}%</p>}
            </CardContent>
          </Card>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full h-8 mt-2"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <DashboardHeader
          totalDebt={totalDebt}
          paidOffAmount={paidOffAmount}
          paidOffPercentage={paidOffPercentage}
          onAddDebt={() => setShowAddDebt(true)}
          currency={currency}
        >
          <div className="flex items-center gap-2">
            <NotificationCenter debts={data.debts} />
            <ThemeToggle />
          </div>
        </DashboardHeader>

        <main className="p-4 md:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="md:hidden grid grid-cols-3 h-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="debts">Debts</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <DebtOverview
                data={data}
                totalDebt={totalDebt}
                paidOffAmount={paidOffAmount}
                paidOffPercentage={paidOffPercentage}
                currency={currency}
              />
            </TabsContent>

            <TabsContent value="debts" className="space-y-4">
              <DebtList
                debts={data.debts}
                onAddDebt={() => setShowAddDebt(true)}
                onUpdateDebt={(updatedDebt) => {
                  setData({
                    ...data,
                    debts: data.debts.map((debt) => (debt.id === updatedDebt.id ? updatedDebt : debt)),
                  })
                }}
                onDeleteDebt={(debtId) => {
                  setData({
                    ...data,
                    debts: data.debts.filter((debt) => debt.id !== debtId),
                  })
                }}
                currency={currency}
              />
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              <EnhancedAchievements
                achievements={data.achievements}
                paidOffPercentage={paidOffPercentage}
                debts={data.debts}
                onUpdateAchievements={handleUpdateAchievements}
              />
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <PrintReports data={data} currency={currency} />
            </TabsContent>

            <TabsContent value="calculators" className="space-y-4">
              <DebtCalculators currency={currency} />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how and when you receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Payment Reminders</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Upcoming Payments</h4>
                                <p className="text-sm text-muted-foreground">Get notified about upcoming payments</p>
                              </div>
                              <Button variant="outline" size="sm">
                                Configure
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Payment Due Dates</h4>
                                <p className="text-sm text-muted-foreground">Get notified when payments are due</p>
                              </div>
                              <Button variant="outline" size="sm">
                                Configure
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Achievement Alerts</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">New Achievements</h4>
                                <p className="text-sm text-muted-foreground">
                                  Get notified when you unlock achievements
                                </p>
                              </div>
                              <Button variant="outline" size="sm">
                                Configure
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Milestone Progress</h4>
                                <p className="text-sm text-muted-foreground">
                                  Get notified about progress toward milestones
                                </p>
                              </div>
                              <Button variant="outline" size="sm">
                                Configure
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Notification History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <NotificationCenter debts={data.debts} />
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Application Settings</CardTitle>
                    <CardDescription>Customize your DebtQuest experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Currency</h3>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableCurrencies().map((curr) => (
                            <SelectItem key={curr.code} value={curr.code}>
                              {curr.symbol} - {curr.name} ({curr.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Theme</h3>
                      <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <span className="text-sm text-muted-foreground">Toggle between light and dark mode</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <DataManagement data={data} onDataImport={(newData) => setData(newData)} />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Add Debt Modal */}
      {showAddDebt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold">Add New Debt</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowAddDebt(false)}>
                ✕
              </Button>
            </div>
            <AddDebtForm
              onSubmit={(newDebt) => {
                setData({
                  ...data,
                  debts: [
                    ...data.debts,
                    {
                      ...newDebt,
                      id: Date.now().toString(),
                      paidAmount: 0,
                      payments: [],
                      createdAt: new Date().toISOString(),
                    },
                  ],
                })
                setShowAddDebt(false)
              }}
              onCancel={() => setShowAddDebt(false)}
              currency={currency}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function NavItem({ icon, label, active, onClick, collapsed }) {
  return (
    <button
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm ${
        active
          ? "bg-emerald-50 text-emerald-700 font-medium dark:bg-emerald-950 dark:text-emerald-400"
          : "text-foreground hover:bg-muted"
      } ${collapsed ? "justify-center" : ""}`}
      onClick={onClick}
      title={collapsed ? label : undefined}
    >
      {icon}
      {!collapsed && label}
    </button>
  )
}
