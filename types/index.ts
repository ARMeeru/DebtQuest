export interface Debt {
  id: string;
  name: string;
  description?: string;
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
  progressBased?: boolean;
  currentProgress?: number;
  targetProgress?: number;
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

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: string;
  read: boolean;
}