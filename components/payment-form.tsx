"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/utils"
import { Debt, Payment } from "@/types"

interface PaymentFormProps {
  debt: Debt
  onSubmit: (payment: Omit<Payment, "id" | "date">) => void
  onCancel: () => void
}

export function PaymentForm({ debt, onSubmit, onCancel }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    amount: debt.monthlyPayment,
    note: `Regular payment for ${debt.name}`,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
    }

    if (Number(formData.amount) > debt.initialAmount - debt.paidAmount) {
      newErrors.amount = "Payment cannot exceed remaining balance"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit({
        ...formData,
        amount: Number.parseFloat(formData.amount.toString()),
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">Make a Payment</h3>
        <div className="text-sm text-gray-500">Remaining: {formatCurrency(debt.initialAmount - debt.paidAmount)}</div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Payment Amount ($)</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          max={debt.initialAmount - debt.paidAmount}
          value={formData.amount}
          onChange={handleChange}
        />
        {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Note (Optional)</Label>
        <Textarea
          id="note"
          name="note"
          placeholder="Add a note about this payment"
          value={formData.note}
          onChange={handleChange}
          rows={2}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
          Submit Payment
        </Button>
      </div>
    </form>
  )
}
