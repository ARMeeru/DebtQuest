"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddDebtFormProps {
  onSubmit: (debt: any) => void
  onCancel: () => void
  currency?: string
}

export function AddDebtForm({ onSubmit, onCancel, currency = "USD" }: AddDebtFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "credit-card",
    initialAmount: "",
    interestRate: "",
    monthlyPayment: "",
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.initialAmount || isNaN(Number(formData.initialAmount)) || Number(formData.initialAmount) <= 0) {
      newErrors.initialAmount = "Please enter a valid amount"
    }

    if (!formData.interestRate || isNaN(Number(formData.interestRate))) {
      newErrors.interestRate = "Please enter a valid interest rate"
    }

    if (!formData.monthlyPayment || isNaN(Number(formData.monthlyPayment)) || Number(formData.monthlyPayment) <= 0) {
      newErrors.monthlyPayment = "Please enter a valid monthly payment"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit({
        ...formData,
        initialAmount: Number.parseFloat(formData.initialAmount),
        interestRate: Number.parseFloat(formData.interestRate),
        monthlyPayment: Number.parseFloat(formData.monthlyPayment),
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="name">Debt Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Credit Card, Student Loan, etc."
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Add details about this debt"
          value={formData.description}
          onChange={handleChange}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Debt Type</Label>
        <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select debt type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="credit-card">Credit Card</SelectItem>
            <SelectItem value="student-loan">Student Loan</SelectItem>
            <SelectItem value="mortgage">Mortgage</SelectItem>
            <SelectItem value="auto-loan">Auto Loan</SelectItem>
            <SelectItem value="personal-loan">Personal Loan</SelectItem>
            <SelectItem value="medical">Medical Debt</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="initialAmount">Total Amount ($)</Label>
          <Input
            id="initialAmount"
            name="initialAmount"
            type="number"
            step="0.01"
            min="0"
            placeholder="10000"
            value={formData.initialAmount}
            onChange={handleChange}
          />
          {errors.initialAmount && <p className="text-sm text-red-500">{errors.initialAmount}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="interestRate">Interest Rate (%)</Label>
          <Input
            id="interestRate"
            name="interestRate"
            type="number"
            step="0.01"
            min="0"
            placeholder="5.99"
            value={formData.interestRate}
            onChange={handleChange}
          />
          {errors.interestRate && <p className="text-sm text-red-500">{errors.interestRate}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthlyPayment">Monthly Payment ($)</Label>
          <Input
            id="monthlyPayment"
            name="monthlyPayment"
            type="number"
            step="0.01"
            min="0"
            placeholder="250"
            value={formData.monthlyPayment}
            onChange={handleChange}
          />
          {errors.monthlyPayment && <p className="text-sm text-red-500">{errors.monthlyPayment}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
          Add Debt
        </Button>
      </div>
    </form>
  )
}
