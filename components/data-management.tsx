"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Upload, AlertTriangle } from "lucide-react"

import { AppData } from "@/types"

interface DataManagementProps {
  data: AppData
  onDataImport: (data: AppData) => void
}

export function DataManagement({ data, onDataImport }: DataManagementProps) {
  const [resetConfirm, setResetConfirm] = useState(false)

  const handleExport = () => {
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `debtquest-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const importedData = JSON.parse((e.target?.result as string) || '{}')
        onDataImport(importedData)
      } catch (error) {
        alert("Error importing data. Please check the file format.")
        console.error(error)
      }
    }
    reader.readAsText(file)

    // Reset the input
    event.target.value = ""
  }

  const handleReset = () => {
    if (resetConfirm) {
      // Reset to initial data
      onDataImport({
        debts: [],
        achievements: [
          {
            id: "1",
            name: "First Debt Added",
            description: "Added your first debt to track",
            category: "getting started",
            points: 10,
            unlocked: false,
            unlockedAt: null,
            progressBased: false,
            currentProgress: 0,
            targetProgress: 0,
          },
          {
            id: "2",
            name: "First Payment",
            description: "Made your first debt payment",
            category: "payments",
            points: 15,
            unlocked: false,
            unlockedAt: null,
            progressBased: false,
            currentProgress: 0,
            targetProgress: 0,
          },
          {
            id: "3",
            name: "25% Debt-Free",
            description: "Paid off 25% of your total debt",
            category: "milestones",
            points: 25,
            unlocked: false,
            unlockedAt: null,
            progressBased: true,
            currentProgress: 0,
            targetProgress: 25,
          },
          {
            id: "4",
            name: "Halfway There",
            description: "Paid off 50% of your total debt",
            category: "milestones",
            points: 50,
            unlocked: false,
            unlockedAt: null,
            progressBased: true,
            currentProgress: 0,
            targetProgress: 50,
          },
          {
            id: "5",
            name: "Almost There",
            description: "Paid off 75% of your total debt",
            category: "milestones",
            points: 75,
            unlocked: false,
            unlockedAt: null,
            progressBased: true,
            currentProgress: 0,
            targetProgress: 75,
          },
          {
            id: "6",
            name: "Debt Freedom",
            description: "Paid off 100% of your debt. Congratulations!",
            category: "milestones",
            points: 100,
            unlocked: false,
            unlockedAt: null,
            progressBased: true,
            currentProgress: 0,
            targetProgress: 100,
          },
          {
            id: "7",
            name: "Consistency King",
            description: "Made payments for 3 consecutive months",
            category: "consistency",
            points: 30,
            unlocked: false,
            unlockedAt: null,
            progressBased: true,
            currentProgress: 0,
            targetProgress: 3,
          },
          {
            id: "8",
            name: "Early Bird",
            description: "Made an early payment on a debt",
            category: "payments",
            points: 20,
            unlocked: false,
            unlockedAt: null,
            progressBased: false,
            currentProgress: 0,
            targetProgress: 0,
          },
          {
            id: "9",
            name: "Extra Mile",
            description: "Made an extra payment beyond the minimum",
            category: "payments",
            points: 25,
            unlocked: false,
            unlockedAt: null,
            progressBased: false,
            currentProgress: 0,
            targetProgress: 0,
          },
          {
            id: "10",
            name: "First Debt Conquered",
            description: "Completely paid off your first debt",
            category: "milestones",
            points: 50,
            unlocked: false,
            unlockedAt: null,
            progressBased: false,
            currentProgress: 0,
            targetProgress: 0,
          },
        ],
      })
      setResetConfirm(false)
    } else {
      setResetConfirm(true)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Backup and restore your financial data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Data
              </h3>
              <p className="text-sm text-gray-600 mb-4">Download a backup of all your debt tracking data</p>
              <Button onClick={handleExport} variant="outline">
                Download JSON Backup
              </Button>
            </div>

            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Import Data
              </h3>
              <p className="text-sm text-gray-600 mb-4">Restore from a previously exported backup file</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                  Select Backup File
                </Button>
                <input id="file-upload" type="file" accept=".json" onChange={handleImport} className="hidden" />
              </div>
            </div>
          </div>

          <div className="p-4 border border-red-200 bg-red-50 rounded-md">
            <h3 className="font-medium mb-2 flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Reset All Data
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This will delete all your debt tracking data and reset the application to its initial state. This action
              cannot be undone.
            </p>
            <Button variant="destructive" onClick={handleReset}>
              {resetConfirm ? "Confirm Reset" : "Reset All Data"}
            </Button>
            {resetConfirm && (
              <Button variant="outline" className="ml-2" onClick={() => setResetConfirm(false)}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
