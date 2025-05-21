"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff, Calendar, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { formatDate, timeUntil } from "@/lib/utils"
import { useLocalStorage } from "@/hooks/use-local-storage"

export function NotificationCenter({ debts }) {
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage("notifications-enabled", true)
  const [notifications, setNotifications] = useLocalStorage("debt-quest-notifications", [])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Generate notifications based on debts
  useEffect(() => {
    if (!notificationsEnabled || !debts || debts.length === 0) return

    const today = new Date()
    const newNotifications = []

    // Check for upcoming payments
    debts.forEach((debt) => {
      // Calculate next payment date based on the last payment
      let nextPaymentDate = new Date()
      if (debt.payments && debt.payments.length > 0) {
        const lastPayment = debt.payments[debt.payments.length - 1]
        const lastPaymentDate = new Date(lastPayment.date)
        nextPaymentDate = new Date(lastPaymentDate)
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1)
      } else {
        // If no payments yet, set next payment to 1 month from creation date
        nextPaymentDate = new Date(debt.createdAt)
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1)
      }

      // If next payment is within 7 days, create a notification
      const daysUntilPayment = Math.ceil((nextPaymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      if (daysUntilPayment <= 7 && daysUntilPayment >= 0) {
        newNotifications.push({
          id: `payment-${debt.id}-${nextPaymentDate.toISOString()}`,
          type: "payment-due",
          title: `Payment Due Soon: ${debt.name}`,
          message: `Your payment of ${debt.monthlyPayment} for ${debt.name} is due in ${daysUntilPayment} days.`,
          date: nextPaymentDate.toISOString(),
          read: false,
          debtId: debt.id,
        })
      }
    })

    // Check for achievements that are close to being unlocked
    const achievementThreshold = 0.9 // 90% progress toward achievement

    // Add notifications for debts that are close to being paid off
    debts.forEach((debt) => {
      const payoffPercentage = debt.paidAmount / debt.initialAmount
      if (payoffPercentage >= 0.9 && payoffPercentage < 1) {
        newNotifications.push({
          id: `payoff-${debt.id}`,
          type: "achievement",
          title: `Almost There: ${debt.name}`,
          message: `You're ${Math.round(payoffPercentage * 100)}% of the way to paying off ${debt.name}!`,
          date: today.toISOString(),
          read: false,
          debtId: debt.id,
        })
      }
    })

    // Merge with existing notifications, avoiding duplicates
    const existingIds = notifications.map((n) => n.id)
    const uniqueNewNotifications = newNotifications.filter((n) => !existingIds.includes(n.id))

    if (uniqueNewNotifications.length > 0) {
      setNotifications([...uniqueNewNotifications, ...notifications].slice(0, 50)) // Keep only the 50 most recent
    }
  }, [debts, notificationsEnabled])

  // Count unread notifications
  useEffect(() => {
    const count = notifications.filter((n) => !n.read).length
    setUnreadCount(count)
  }, [notifications])

  const markAsRead = (id) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setShowNotifications(!showNotifications)} className="relative">
        {notificationsEnabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {showNotifications && (
        <Card className="absolute right-0 mt-2 w-80 md:w-96 z-50 shadow-lg">
          <CardContent className="p-0">
            <div className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <h3 className="font-medium">Notifications</h3>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 px-2">
                  <Check className="h-3 w-3 mr-1" />
                  <span className="text-xs">Read all</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={clearAllNotifications} className="h-8 px-2">
                  <X className="h-3 w-3 mr-1" />
                  <span className="text-xs">Clear</span>
                </Button>
              </div>
            </div>

            <div className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                <Label htmlFor="notifications">Enable notifications</Label>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b flex gap-3 ${notification.read ? "opacity-70" : "bg-muted/30"}`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {notification.type === "payment-due" ? (
                          <Calendar className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Bell className="h-5 w-5 text-amber-500" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-muted-foreground">{formatDate(notification.date)}</span>
                          {notification.type === "payment-due" && (
                            <Badge variant="outline" className="text-xs">
                              {timeUntil(notification.date)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
