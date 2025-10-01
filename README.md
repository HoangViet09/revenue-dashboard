# Revenue Dashboard

A modern, interactive revenue trend dashboard built with Next.js, TypeScript, and Tailwind CSS. This dashboard visualizes daily revenue data with comparison capabilities and real-time filtering.

## 🚀 Features

- **Interactive Revenue Chart**: Stacked column chart showing POS Revenue, Eatclub Revenue, and Labour Costs
- **Period Comparison**: Toggle between current week and previous week data
- **Real-time Filtering**: Show/hide different revenue streams and costs
- **KPI Cards**: Summary metrics with percentage change indicators
- **Event Impact Indicators**: Visual indicators for positive and negative events
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, professional design using shadcn/ui components

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, React 18
- **Styling**: Tailwind CSS, shadcn/ui components
- **Charts**: Recharts (React charting library)
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React hooks (useState, useEffect, useMemo)

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd revenue-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/
│   ├── dashboard/           # Dashboard components
│   │   ├── RevenueTrendDashboard.tsx
│   │   ├── HeaderSection.tsx
│   │   ├── KPICards.tsx
│   │   ├── RevenueChart.tsx
│   │   └── ChartLegend.tsx
│   └── ui/                  # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       └── checkbox.tsx
├── data/
│   └── mockData.ts          # Mock data for development
├── lib/
│   ├── types.ts             # TypeScript interfaces
│   └── utils.ts             # Utility functions
```

## 🎯 Key Components

### RevenueTrendDashboard

Main dashboard component that orchestrates all sub-components and manages state.

### HeaderSection

Contains the dashboard title, filter controls, and action buttons.

### KPICards

Displays summary metrics (Total Revenue, Average per Day, Total Covers) with comparison data.

### RevenueChart

Interactive stacked column chart built with Recharts, supporting:

- Current and previous period data
- Filtering by revenue type
- Event impact indicators
- Custom tooltips

### ChartLegend

Dynamic legend that updates based on active filters and comparison mode.

## 📊 Data Structure

The dashboard expects data in the following format:

```typescript
interface WeekData {
  weekStart: string;
  weekEnd: string;
  dailyData: DailyRevenueData[];
  summary: WeeklySummary;
}

interface DailyRevenueData {
  date: string;
  dayOfWeek: string;
  posRevenue: number;
  eatclubRevenue: number;
  labourCosts: number;
  covers: number;
  events?: EventImpact[];
}
```

## 🔌 Backend Integration

The dashboard is designed to work with a Node.js/Express backend. See `API_SPECIFICATION.md` for detailed API requirements.

### Required Endpoints:

- `GET /api/revenue/current-week` - Current week data
- `GET /api/revenue/previous-week` - Previous week data
- `GET /api/revenue/dashboard` - Combined dashboard data

## 🎨 Customization

### Colors

The dashboard uses a consistent color scheme:

- **POS Revenue**: `#1f2937` (Dark gray)
- **Eatclub Revenue**: `#3b82f6` (Blue)
- **Labour Costs**: `#f97316` (Orange)
- **Previous Period**: Lighter shades of the same colors

### Styling

All styles are defined using Tailwind CSS classes. You can customize the appearance by modifying the component files.

## 📱 Responsive Design

The dashboard is fully responsive and adapts to different screen sizes:

- **Desktop**: Full layout with all components visible
- **Tablet**: Adjusted spacing and component sizing
- **Mobile**: Stacked layout with optimized touch targets

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. **New Chart Types**: Extend the `RevenueChart` component
2. **Additional Filters**: Add new filter options in `HeaderSection`
3. **New KPIs**: Extend the `KPICards` component
4. **Custom Events**: Add new event types in the data structure

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📄 API Documentation

For detailed API specifications and backend integration requirements, see `API_SPECIFICATION.md`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the API documentation
2. Review the component structure
3. Open an issue on GitHub

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
