"use client"

// Debt snowball visualization inspired by Dave Ramsey's method
// Created by: John Doe - Last updated: 2023-11-15

import { useEffect, useRef } from "react"
import { formatCurrency } from "@/lib/utils"

import { Debt } from "@/types"

interface DebtSnowballProps {
  debts: Debt[]
  // TODO: Add color customization options
  // colorScheme?: 'default' | 'rainbow' | 'monochrome'
}

export function DebtSnowball({ debts }: DebtSnowballProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // const chartBuilt = useRef(false) // For future optimization

  useEffect(() => {
    // Bail early if we don't have what we need
    if (!canvasRef.current || debts.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Fix the blurry canvas issue on retina displays
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Sort debts by balance - snowball method targets smallest debts first
    // (this was a game changer for my own debt payoff strategy!)
    const sortedDebts = [...debts].sort((a, b) => {
      const balanceA = a.initialAmount - a.paidAmount
      const balanceB = b.initialAmount - b.paidAmount
      return balanceA - balanceB
    })

    // Get total remaining debt for percentage calcs
    let totalRemaining = 0
    for (let i = 0; i < sortedDebts.length; i++) {
      const debt = sortedDebts[i]
      totalRemaining += (debt.initialAmount - debt.paidAmount)
    }

    // My favorite green palette - looks better than the default blues
    const colors = [
      "#10b981", // emerald-500
      "#34d399", // emerald-400 
      "#6ee7b7", // emerald-300
      "#a7f3d0", // emerald-200
      "#d1fae5", // emerald-100
      // Fallbacks if we have more than 5 debts
      "#059669", // emerald-600
      "#047857", // emerald-700
    ]

    // Position everything from the center
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const maxRadius = Math.min(centerX, centerY) - 20 // Padding from edges

    let startAngle = 0 // We'll increment this as we draw sectors

    // Draw each debt as a pie slice
    for (let i = 0; i < sortedDebts.length; i++) {
      const debt = sortedDebts[i]
      const remainingBalance = debt.initialAmount - debt.paidAmount
      
      // Skip paid off debts
      if (remainingBalance <= 0) continue
      
      // Calculate this debt's portion of the pie
      const portion = remainingBalance / totalRemaining
      const endAngle = startAngle + portion * Math.PI * 2
      
      // Draw the slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, maxRadius, startAngle, endAngle)
      ctx.closePath()
      
      // Fill with appropriate color
      ctx.fillStyle = colors[i % colors.length]
      ctx.fill()
      
      // Only add labels for chunks big enough to be readable
      // Tried 0.03 first but was too crowded
      if (portion > 0.05) {
        const midAngle = startAngle + (endAngle - startAngle) / 2
        const labelRadius = maxRadius * 0.7
        const labelX = centerX + Math.cos(midAngle) * labelRadius
        const labelY = centerY + Math.sin(midAngle) * labelRadius
        
        // White text looks best on the colored backgrounds
        ctx.fillStyle = "#ffffff"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(debt.name, labelX, labelY)
      }
      
      // Move to the next slice
      startAngle = endAngle
    }

    // Draw a nice center circle with the total remaining debt
    // The white circle in the middle was my favorite design choice
    const centerRadius = maxRadius * 0.4
    ctx.beginPath()
    ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2)
    ctx.fillStyle = "#ffffff"
    ctx.fill()
    
    // Add a subtle shadow effect
    ctx.shadowColor = 'rgba(0,0,0,0.1)'
    ctx.shadowBlur = 5
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    
    // Add the total amount text in the center
    ctx.fillStyle = "#0f172a" // Dark slate
    ctx.font = "bold 14px system-ui, sans-serif" // System font looks more native
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(formatCurrency(totalRemaining), centerX, centerY)
    
    // Reset shadow
    ctx.shadowColor = 'transparent'
    
    // Add a legend so users can identify each slice
    const legendX = 10
    let legendY = 20
    
    // Loop through and create legend entries
    for (let i = 0; i < sortedDebts.length; i++) {
      const debt = sortedDebts[i]
      const remainingBalance = debt.initialAmount - debt.paidAmount
      
      if (remainingBalance <= 0) continue
      
      // Draw the color square
      ctx.fillStyle = colors[i % colors.length]
      ctx.fillRect(legendX, legendY, 15, 15)
      
      // Add the text label
      ctx.fillStyle = "#0f172a" // Dark color for text
      ctx.font = "12px system-ui, sans-serif"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(`${debt.name} - ${formatCurrency(remainingBalance)}`, legendX + 25, legendY + 7)
      
      // Move down for next legend item
      legendY += 25
    }
    
    // Future: add animation when values change
  }, [debts]) // Only redraw when debts change

  // Show empty state if no debts yet
  if (debts.length === 0) {
    return (
      <div className="h-60 flex items-center justify-center bg-gray-50 rounded-md border border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-gray-500">No debts to visualize yet! Add your first debt to see the snowball effect.</p>
          {/* TODO: Add a sample visualization here */}
        </div>
      </div>
    )
  }

  return (
    <div className="h-60">
      {/* The magic happens in this canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        // Future enhancement: add onClick to show detailed breakdown
      />
    </div>
  )
}
