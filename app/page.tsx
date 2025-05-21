import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trophy, PiggyBank, TrendingUp, BarChart3 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata: Metadata = {
  title: "DebtQuest - Gamified Debt Reduction Tracker",
  description: "Track and gamify your journey to financial freedom",
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 py-4 flex justify-end">
          <ThemeToggle />
        </div>
        <div className="container mx-auto px-4 py-8 flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">DebtQuest</h1>
          <p className="mt-4 text-xl max-w-2xl">Turn your debt reduction journey into an adventure</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
              <Link href="/dashboard">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section id="features" className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Turn Debt Reduction into a Game</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<PiggyBank className="h-10 w-10 text-emerald-500" />}
                title="Track Your Debts"
                description="Easily monitor all your loans, EMIs, and debts in one place with intuitive progress tracking."
              />
              <FeatureCard
                icon={<Trophy className="h-10 w-10 text-emerald-500" />}
                title="Earn Rewards"
                description="Set goals and earn badges, points, and achievements as you make progress on your debt-free journey."
              />
              <FeatureCard
                icon={<BarChart3 className="h-10 w-10 text-emerald-500" />}
                title="Visualize Progress"
                description="See your debt reduction journey through interactive charts and a debt snowball visualizer."
              />
              <FeatureCard
                icon={<TrendingUp className="h-10 w-10 text-emerald-500" />}
                title="Strategic Planning"
                description="Use debt snowball/avalanche calculators to optimize your repayment strategy."
              />
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16 px-4 dark:bg-gray-900">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-4">Privacy-First Design</h2>
                <p className="text-lg mb-6">
                  Your financial data stays on your device with local storage. No servers, no sharing, just your
                  personal finance journey.
                </p>
                <ul className="space-y-2">
                  {[
                    "All data stored locally in your browser",
                    "Export/import options for data backup",
                    "No account required to get started",
                    "Works offline after initial load",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm">
                        ✓
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
                <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center dark:bg-gray-700">
                  <div className="text-center p-4">
                    <div className="inline-block p-3 bg-emerald-100 rounded-full mb-3 dark:bg-emerald-900">
                      <PiggyBank className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-medium">Your Data Stays With You</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Secure, private, and always under your control
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Conquer Your Debt?</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              Start your debt-free journey today with DebtQuest's gamified approach to financial freedom.
            </p>
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/dashboard">Launch DebtQuest</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12 px-4 dark:bg-gray-950">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">DebtQuest</h2>
              <p className="text-gray-400 mt-2">Gamified debt reduction tracker</p>
            </div>
            <div className="flex gap-8">
              <div>
                <h3 className="font-medium mb-2">Features</h3>
                <ul className="space-y-1 text-gray-400">
                  <li>Debt Tracking</li>
                  <li>Gamification</li>
                  <li>Visualizations</li>
                  <li>Calculators</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Privacy</h3>
                <ul className="space-y-1 text-gray-400">
                  <li>Local Storage</li>
                  <li>Data Export</li>
                  <li>No Accounts</li>
                  <li>Offline Support</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} DebtQuest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}
