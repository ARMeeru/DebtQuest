"use client"

import { useEffect, useRef } from "react"
import { formatCurrency } from "@/lib/utils"

import { Debt } from "@/types"

interface DebtSnowballProps {
  debts: Debt[]
}

export function DebtSnowball({ debts }: DebtSnowballProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || debts.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Sort debts by balance (smallest first for snowball method)
    const sortedDebts = [...debts].sort((a, b) => {
      const balanceA = a.initialAmount - a.paidAmount
      const balanceB = b.initialAmount - b.paidAmount
      return balanceA - balanceB
    })

    // Calculate total remaining debt
    const totalRemaining = sortedDebts.reduce((sum, debt) => {
      return sum + (debt.initialAmount - debt.paidAmount)
    }, 0)

    // Define colors
    const colors = [
      "#10b981", // emerald-500
      "#34d399", // emerald-400
      "#6ee7b7", // emerald-300
      "#a7f3d0", // emerald-200
      "#d1fae5", // emerald-100
    ]

    // Draw the snowball visualization
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const maxRadius = Math.min(centerX, centerY) - 20

    let startAngle = 0

    sortedDebts.forEach((debt, index) => {
      const remainingBalance = debt.initialAmount - debt.paidAmount
      if (remainingBalance <= 0) return

      const portion = remainingBalance / totalRemaining
      const endAngle = startAngle + portion * Math.PI * 2

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, maxRadius, startAngle, endAngle)
      ctx.closePath()

      ctx.fillStyle = colors[index % colors.length]
      ctx.fill()

      // Add label if segment is large enough
      if (portion > 0.05) {
        const midAngle = startAngle + (endAngle - startAngle) / 2
        const labelRadius = maxRadius * 0.7
        const labelX = centerX + Math.cos(midAngle) * labelRadius
        const labelY = centerY + Math.sin(midAngle) * labelRadius

        ctx.fillStyle = "#ffffff"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(debt.name, labelX, labelY)
      }

      startAngle = endAngle
    })

    // Draw center circle with total remaining
    ctx.beginPath()
    ctx.arc(centerX, centerY, maxRadius * 0.4, 0, Math.PI * 2)
    ctx.fillStyle = "#ffffff"
    ctx.fill()

    ctx.fillStyle = "#0f172a"
    ctx.font = "bold 14px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(formatCurrency(totalRemaining), centerX, centerY)

    // Draw legend
    const legendX = 10
    let legendY = 20

    sortedDebts.forEach((debt, index) => {
      const remainingBalance = debt.initialAmount - debt.paidAmount
      if (remainingBalance <= 0) return

      ctx.fillStyle = colors[index % colors.length]
      ctx.fillRect(legendX, legendY, 15, 15)

      ctx.fillStyle = "#0f172a"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(`${debt.name} - ${formatCurrency(remainingBalance)}`, legendX + 25, legendY + 7)

      legendY += 25
    })
  }, [debts])

  if (debts.length === 0) {
    return (
      <div className="h-60 flex items-center justify-center bg-gray-50 rounded-md border border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-gray-500">Add debts to see your snowball visualization</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-60">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
