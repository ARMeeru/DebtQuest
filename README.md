# DebtQuest - Gamified Debt Reduction Tracker

![DebtQuest Logo](public/favicon.svg)

## Overview

DebtQuest transforms your debt reduction journey into an engaging adventure. By gamifying the process of becoming debt-free, DebtQuest motivates you to stay committed to your financial goals through achievements, visualizations, and strategic planning tools.

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Styled with Tailwind](https://img.shields.io/badge/Styled%20with-Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Built with React](https://img.shields.io/badge/Built%20with-React%2019-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)

## Features

### 📊 Comprehensive Debt Tracking
- Track all your loans, EMIs, and debts in one place
- Monitor progress with intuitive visualizations
- Support for multiple currencies

### 🏆 Gamification Elements
- Earn badges and achievements as you reach milestones
- Enhanced achievement system with customizable rewards
- Unlock rewards for consistent debt payments
- Challenge yourself with financial goals

### 📈 Powerful Visualizations
- Interactive charts and progress indicators using Recharts
- Debt snowball/avalanche visualizer
- Payment history tracking
- Printable financial reports

### 🧮 Strategic Planning
- Debt snowball/avalanche calculators
- Payment optimization suggestions
- Projected debt-free date calculator

### 🔒 Privacy-First Design
- All data stored locally in your browser
- No account required to start using the app
- Export/import options for data backup
- Works offline after initial load

## Getting Started



### Local Development

1. Clone the repository:
```
git clone https://github.com/yourusername/debtquest.git
cd debtquest
```

2. Install dependencies:
```
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
DebtQuest/
├── app/               # Next.js app directory
├── components/        # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and data
├── public/            # Static assets
├── styles/            # Global CSS and style utilities
└── types/             # TypeScript type definitions
```

## Technologies Used

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with shadcn/ui components (Radix UI)
- **State Management**: React Hooks + Local Storage
- **Data Visualization**: Recharts 2.15
- **Form Management**: React Hook Form 7.54 + Zod 3.24 validation
- **Date Handling**: date-fns 4.1
- **Notifications**: Sonner 1.7
- **UI Components**:
  - Radix UI primitives
  - Vaul for drawers
  - Embla Carousel
  - React Day Picker

## Contributing

Contributions are welcome! If you'd like to contribute, please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Special thanks to the v0.dev team for providing initial commit
- All the contributors who have helped/will help improve DebtQuest
- You, for taking control of your financial future!

## Contact

For questions, suggestions, or feedback, please [open an issue](https://github.com/ARMeeru/DebtQuest/issues/) on GitHub.

---

Take control of your debt, turn it into a game, and win your financial freedom! 🚀
