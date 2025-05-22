export interface Debt {
  id: string;
  name: string;
  description: string; // Making this required for consistency
  type: string;
  initialAmount: number;
  paidAmount: number;
  interestRate: number;
  monthlyPayment: number;
  payments: Payment[];
  startDate?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  note?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  points: number;
  unlocked: boolean;
  unlockedAt: string | null;
  progressBased: boolean;
  currentProgress: number;
  targetProgress: number;
}

export interface AppData {
  debts: Debt[];
  achievements: Achievement[];
  settings?: {
    theme?: string;
    currency?: string;
    [key: string]: any;
  };
}

// Type for category-grouped achievements
export type CategoryAchievements = Record<string, Achievement[]>;

// Type for calculation results
export interface CalculationResult {
  months: number;
  interest: number;
  payoffDate: Date;
}

export interface CalculationResults {
  standard: CalculationResult;
  withExtra: CalculationResult;
  monthsSaved: number;
  interestSaved: number;
}

// For debt calculator
export interface DebtCalculatorItem {
  id: string;
  name: string;
  balance: string;
  rate: string;
  payment: string;
  paymentSchedule?: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
  }>;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: string;
  read: boolean;
}