"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Lock, CheckCircle } from "lucide-react"

interface AchievementsProps {
  achievements: any[]
  paidOffPercentage: number
  debts: any[]
}

export function Achievements({ achievements, paidOffPercentage, debts }: AchievementsProps) {
  // Group achievements by category
  const achievementsByCategory = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = []
    }
    acc[achievement.category].push(achievement)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Achievements</h2>
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          {achievements.filter((a) => a.unlocked).length}/{achievements.length} Unlocked
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Debt-Free Journey</CardTitle>
          <CardDescription>Track your progress with these milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative pt-10 pb-4">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200 rounded-full">
              <div
                className="absolute top-0 left-0 h-2 bg-emerald-500 rounded-full"
                style={{ width: `${paidOffPercentage}%` }}
              />
              {[25, 50, 75, 100].map((milestone) => (
                <div
                  key={milestone}
                  className={`absolute top-0 w-4 h-4 rounded-full -mt-1 -ml-2 flex items-center justify-center ${
                    paidOffPercentage >= milestone ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-400"
                  }`}
                  style={{ left: `${milestone}%` }}
                >
                  {paidOffPercentage >= milestone && <CheckCircle className="h-3 w-3" />}
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4">
              {[0, 25, 50, 75, 100].map((milestone) => (
                <div
                  key={milestone}
                  className="text-center"
                  style={{ width: milestone === 0 || milestone === 100 ? "10%" : "20%" }}
                >
                  <div
                    className={`text-sm font-medium ${
                      paidOffPercentage >= milestone ? "text-emerald-600" : "text-gray-500"
                    }`}
                  >
                    {milestone}%
                  </div>
                  {milestone === 25 && <div className="text-xs mt-1">Quarter Way</div>}
                  {milestone === 50 && <div className="text-xs mt-1">Halfway There</div>}
                  {milestone === 75 && <div className="text-xs mt-1">Almost There</div>}
                  {milestone === 100 && <div className="text-xs mt-1">Debt Free!</div>}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold capitalize">{category} Achievements</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryAchievements.map((achievement) => (
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
