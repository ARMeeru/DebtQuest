"use client"

// Debt form component - handles both creation and editing
// Last updated: 11/14/2023 - Added validation and error handling

import { useState, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Debt } from "@/types"
// import { toast } from "@/lib/toast" // TODO: Add toast notifications in v2

interface AddDebtFormProps {
  // Callback for form submission - returns debt without the auto-generated fields
  onSubmit: (debt: Omit<Debt, "id" | "paidAmount" | "payments" | "createdAt">) => void
  onCancel: () => void
  initialData?: {
    name: string
    description: string
    type: string
    initialAmount: string
    interestRate: string
    monthlyPayment: string
  }
  isEditing?: boolean
  // maxAmount?: number // For future feature: setting debt limits
}

export function AddDebtForm({ onSubmit, onCancel, initialData, isEditing = false }: AddDebtFormProps) {
  // Initialize with either passed data or defaults
  const [formData, setFormData] = useState(initialData || {
    name: "",
    description: "", // Optional but helpful for tracking
    type: "credit-card", // Most common type as default
    initialAmount: "",
    interestRate: "", 
    monthlyPayment: "",
  })

  // Track validation errors - tried using a validation library first but this was simpler
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Got tired of writing separate handlers for each field - this works for all text inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    
    // Clear error when user starts typing in a field with an error
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      })
    }
  }

  const handleSelectChange = (name: string, value: string): void => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Spent too much time debugging a validation bug so I rewrote this from scratch
  // Basic validation to ensure we have usable data
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    const trimmedName = formData.name.trim()

    // Check name - most common error I was seeing
    if (!trimmedName) {
      newErrors.name = "C'mon, give your debt a name!"
    } else if (trimmedName.length > 50) {
      // Prevents database issues down the road
      newErrors.name = "That name is way too long, keep it under 50 chars"
    }

    // Validate the numbers
    if (!formData.initialAmount || isNaN(Number(formData.initialAmount)) || Number(formData.initialAmount) <= 0) {
      newErrors.initialAmount = "Enter the total amount you owe (> $0)"
    }

    if (!formData.interestRate || isNaN(Number(formData.interestRate))) {
      newErrors.interestRate = "What's your interest rate? (0 if none)"
    } else if (Number(formData.interestRate) > 100) {
      newErrors.interestRate = "Seriously? No interest rate is that high!"
    }

    if (!formData.monthlyPayment || isNaN(Number(formData.monthlyPayment)) || Number(formData.monthlyPayment) <= 0) {
      newErrors.monthlyPayment = "How much can you pay each month?"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Form submission handler - prevents default then validates before calling callback
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    
    // Bail early if validation fails
    if (!validateForm()) {
      // Would like to add a toast here in the future
      return;
    }
    
    try {
      // Convert string values to numbers for API consumption
      onSubmit({
        ...formData,
        description: formData.description || "", // Ensure description is never undefined
        initialAmount: Number.parseFloat(formData.initialAmount),
        interestRate: Number.parseFloat(formData.interestRate),
        monthlyPayment: Number.parseFloat(formData.monthlyPayment),
      })
    } catch (err) {
      console.error('Failed to submit debt form:', err);
      // TODO: Show error toast in v2
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {/* Name field - most important identifier */}
      <div className="space-y-2">
        <Label htmlFor="name">Debt Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Credit Card, Student Loan, etc."
          value={formData.name}
          onChange={handleChange}
          // This was causing focus issues: autoFocus={!isEditing}
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

      {/* Financial details - 3 columns on desktop, stack on mobile */}
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
            // Experimented with currency formatting here but it was a mess
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
            placeholder="5.99" // My mortgage rate :(
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
            placeholder="250" // Typical minimum payment
            value={formData.monthlyPayment}
            onChange={handleChange}
          />
          {errors.monthlyPayment && <p className="text-sm text-red-500">{errors.monthlyPayment}</p>}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-emerald-600 hover:bg-emerald-700"
          // disabled={Object.keys(errors).length > 0} // Maybe for v2?
        >
          {isEditing ? "Save Changes" : "Add Debt"}
        </Button>
      </div>
      
      {/* TODO: Maybe add a "test payment plan" feature here */}
    </form>
  )
}
