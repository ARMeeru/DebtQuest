"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Lock } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Achievement, Debt } from "@/types"

export function EnhancedAchievements({ achievements, paidOffPercentage, debts, onUpdateAchievements }: {
  achievements: Achievement[];
  paidOffPercentage: number;
  debts: Debt[];
  onUpdateAchievements: (updatedAchievements: Achievement[]) => void;
}) {
  // We'll use achievements directly since all required properties are handled through type definitions
  const [activeTab, setActiveTab] = useState("all")
  const [showUnlocked, setShowUnlocked] = useState(true)
  const [showLocked, setShowLocked] = useState(true)
  const prevAchievementsRef = useRef<string | null>(null)
  const prevPaidOffPercentageRef = useRef<number | null>(null)
  const prevDebtsRef = useRef<string | null>(null)
  
  // No helper needed - we'll handle null checks inline

  // Check for newly unlocked achievements
  useEffect(() => {
    // Skip the first render or if no update callback
    if (!onUpdateAchievements || !achievements) return

    // Skip if the data hasn't changed
    if (
      prevAchievementsRef.current === JSON.stringify(achievements) &&
      prevPaidOffPercentageRef.current === paidOffPercentage &&
      prevDebtsRef.current === JSON.stringify(debts)
    ) {
      return
    }

    // Update refs with current values
    prevAchievementsRef.current = JSON.stringify(achievements)
    prevPaidOffPercentageRef.current = paidOffPercentage
    prevDebtsRef.current = JSON.stringify(debts)

    let updated = false
    const updatedAchievements = [...achievements]

    // Check for debt-free percentage milestones
    const percentageMilestones = [25, 50, 75, 100]
    percentageMilestones.forEach((milestone) => {
      const milestoneAchievement = updatedAchievements.find(
        (a) => a.category === "milestones" && a.name.includes(`${milestone}%`),
      )

      if (milestoneAchievement && !milestoneAchievement.unlocked && paidOffPercentage >= milestone) {
        milestoneAchievement.unlocked = true
        milestoneAchievement.unlockedAt = new Date().toISOString()
        if (milestoneAchievement.progressBased) {
          milestoneAchievement.currentProgress = milestone
        }
        updated = true
      } else if (milestoneAchievement && milestoneAchievement.progressBased) {
        // Update progress even if not unlocked
        const newProgress = Math.min(milestone, paidOffPercentage)
        if (milestoneAchievement.currentProgress !== newProgress) {
          milestoneAchievement.currentProgress = newProgress
          updated = true
        }
      }
    })

    // Check for first debt added
    const firstDebtAchievement = updatedAchievements.find((a) => a.name === "First Debt Added")
    if (firstDebtAchievement && !firstDebtAchievement.unlocked && debts.length > 0) {
      firstDebtAchievement.unlocked = true
      firstDebtAchievement.unlockedAt = new Date().toISOString()
      updated = true
    }

    // Check for first payment
    const hasPayments = debts.some((debt) => debt.payments && debt.payments.length > 0)
    const firstPaymentAchievement = updatedAchievements.find((a) => a.name === "First Payment")
    if (firstPaymentAchievement && !firstPaymentAchievement.unlocked && hasPayments) {
      firstPaymentAchievement.unlocked = true
      firstPaymentAchievement.unlockedAt = new Date().toISOString()
      updated = true
    }

    // Check for fully paid off debts
    const fullyPaidDebts = debts.filter((debt) => debt.paidAmount >= debt.initialAmount)
    const firstDebtConqueredAchievement = updatedAchievements.find((a) => a.name === "First Debt Conquered")
    if (firstDebtConqueredAchievement && !firstDebtConqueredAchievement.unlocked && fullyPaidDebts.length > 0) {
      firstDebtConqueredAchievement.unlocked = true
      firstDebtConqueredAchievement.unlockedAt = new Date().toISOString()
      updated = true
    }

    // Check for multiple debts paid off
    const multipleDebtsAchievement = updatedAchievements.find((a) => a.name === "Debt Destroyer")
    if (multipleDebtsAchievement && !multipleDebtsAchievement.unlocked && fullyPaidDebts.length >= 2) {
      multipleDebtsAchievement.unlocked = true
      multipleDebtsAchievement.unlockedAt = new Date().toISOString()
      updated = true
    }

    // Check for consistency achievements
    const consistencyAchievement = updatedAchievements.find((a) => a.name === "Consistency King")
    if (consistencyAchievement && consistencyAchievement.progressBased) {
      // Count consecutive months with payments
      const allPaymentDates = debts
        .flatMap((debt) => debt.payments.map((payment) => new Date(payment.date)))
        .sort((a, b) => a.getTime() - b.getTime())

      if (allPaymentDates.length > 0) {
        // Count unique months with payments
        const uniqueMonths = new Set()
        allPaymentDates.forEach((date) => {
          uniqueMonths.add(`${date.getFullYear()}-${date.getMonth()}`)
        })

        const consecutiveMonths = uniqueMonths.size

        if (consistencyAchievement.currentProgress !== consecutiveMonths) {
          consistencyAchievement.currentProgress = Math.min(consecutiveMonths, consistencyAchievement.targetProgress)
          updated = true

          if (consecutiveMonths >= consistencyAchievement.targetProgress && !consistencyAchievement.unlocked) {
            consistencyAchievement.unlocked = true
            consistencyAchievement.unlockedAt = new Date().toISOString()
          }
        }
      }
    }

    // Check for early payment achievement
    const earlyBirdAchievement = updatedAchievements.find((a) => a.name === "Early Bird")
    if (earlyBirdAchievement && !earlyBirdAchievement.unlocked) {
      // Logic to detect early payments would go here
      // For demo purposes, we'll randomly unlock this based on number of payments
      const totalPayments = debts.reduce((sum, debt) => sum + debt.payments.length, 0)
      if (totalPayments > 5 && Math.random() > 0.7) {
        earlyBirdAchievement.unlocked = true
        earlyBirdAchievement.unlockedAt = new Date().toISOString()
        updated = true
      }
    }

    // Check for extra payment achievement
    const extraMileAchievement = updatedAchievements.find((a) => a.name === "Extra Mile")
    if (extraMileAchievement && !extraMileAchievement.unlocked) {
      // Logic to detect extra payments would go here
      // For demo purposes, we'll check if any payment is larger than the monthly payment
      const hasExtraPayment = debts.some((debt) =>
        debt.payments.some((payment) => payment.amount > debt.monthlyPayment * 1.1),
      )

      if (hasExtraPayment) {
        extraMileAchievement.unlocked = true
        extraMileAchievement.unlockedAt = new Date().toISOString()
        updated = true
      }
    }

    if (updated) {
      onUpdateAchievements(updatedAchievements)
    }
  }, [achievements, paidOffPercentage, debts, onUpdateAchievements])

  // Group achievements by category
  const achievementsByCategory = achievements.reduce<Record<string, Achievement[]>>((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = []
    }
    acc[achievement.category].push(achievement)
    return acc
  }, {})

  // Filter achievements based on active tab and locked/unlocked status
  const filteredAchievements = achievements.filter((achievement) => {
    if (!showUnlocked && achievement.unlocked) return false
    if (!showLocked && !achievement.unlocked) return false

    if (activeTab === "all") return true
    return achievement.category === activeTab
  })

  // Calculate achievement stats
  const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0)
  const earnedPoints = achievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.points, 0)

  const pointsPercentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0

  // Get recently unlocked achievements
  const recentAchievements = achievements
    .filter((a) => a.unlocked && a.unlockedAt)
    .sort((a, b) => {
      const dateA = a.unlockedAt ? new Date(a.unlockedAt).getTime() : 0;
      const dateB = b.unlockedAt ? new Date(b.unlockedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Achievements</h2>
          <p className="text-sm text-muted-foreground">
            Track your progress and earn rewards on your debt-free journey
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            {achievements.filter((a) => a.unlocked).length}/{achievements.length} Unlocked
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            {earnedPoints}/{totalPoints} Points
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Achievement Progress</CardTitle>
          <CardDescription>Track your progress with these milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Achievement Points</span>
                <span className="text-sm font-medium">{pointsPercentage}%</span>
              </div>
              <Progress value={pointsPercentage} className="h-2" />
            </div>

            {recentAchievements.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Recently Unlocked</h3>
                <div className="space-y-3">
                  {recentAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-3 bg-amber-50/30 p-3 rounded-md border border-amber-100"
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{achievement.name}</h4>
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            +{achievement.points} pts
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">Unlocked {achievement.unlockedAt ? formatDate(achievement.unlockedAt) : 'recently'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:w-64 space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-medium">Categories</h3>
                <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                  <TabsList className="flex flex-col h-auto w-full bg-transparent gap-1">
                    <TabsTrigger value="all" className="justify-start w-full data-[state=active]:bg-muted">
                      All Achievements
                    </TabsTrigger>
                    {Object.keys(achievementsByCategory).map((category) => (
                      <TabsTrigger
                        key={category}
                        value={category}
                        className="justify-start w-full capitalize data-[state=active]:bg-muted"
                      >
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <div className="mt-4 pt-4 border-t">
                <h3 className="font-medium mb-2">Filter</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show Unlocked</span>
                    <Button
                      variant={showUnlocked ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowUnlocked(!showUnlocked)}
                      className="h-7 px-2"
                    >
                      {showUnlocked ? "On" : "Off"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show Locked</span>
                    <Button
                      variant={showLocked ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowLocked(!showLocked)}
                      className="h-7 px-2"
                    >
                      {showLocked ? "On" : "Off"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Achievement Levels</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-bronze flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Bronze</p>
                    <p className="text-xs text-muted-foreground">0-100 points</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-silver flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Silver</p>
                    <p className="text-xs text-muted-foreground">101-250 points</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gold flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Gold</p>
                    <p className="text-xs text-muted-foreground">251-500 points</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-platinum flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Platinum</p>
                    <p className="text-xs text-muted-foreground">501+ points</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`border ${achievement.unlocked ? "border-amber-200 bg-amber-50/30" : "border-gray-200"}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${
                        achievement.unlocked ? "bg-amber-100" : "bg-gray-100"
                      }`}
                    >
                      {achievement.unlocked ? (
                        <Trophy className={`h-6 w-6 text-amber-600`} />
                      ) : (
                        <Lock className="h-6 w-6 text-gray-400" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{achievement.name}</h4>
                        {achievement.unlocked && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            {achievement.points} pts
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>

                      {achievement.progressBased && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>
                              {achievement.currentProgress}/{achievement.targetProgress}
                            </span>
                          </div>
                          <Progress
                            value={(achievement.currentProgress / achievement.targetProgress) * 100}
                            className="h-1.5"
                          />
                        </div>
                      )}

                      {achievement.unlocked && (
                        <p className="text-xs text-gray-500 mt-2">Unlocked {achievement.unlockedAt ? formatDate(achievement.unlockedAt) : 'recently'}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAchievements.length === 0 && (
            <div className="text-center p-12 border rounded-lg">
              <Trophy className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium mb-1">No achievements found</h3>
              <p className="text-sm text-gray-500">Try changing your filters or category selection</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
