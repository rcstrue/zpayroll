# Z Payroll - HRMS & Payroll Management System

A comprehensive HRMS (Human Resource Management System) and Payroll software designed for Indian contractor manpower suppliers. Built with Next.js 16, TypeScript, and modern web technologies.

![Z Payroll](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

### Employee Management
- Complete employee lifecycle management
- Document management (Aadhaar, PAN, Bank details)
- Employee deployment tracking across client locations
- Quick add feature for fast employee entry

### Client & Unit Management
- Multi-client support with multiple work locations
- Client-wise unit management
- Deployment tracking per unit
- Service charge and billing management

### Attendance Management
- **Monthly Entry**: Quick attendance entry by totals (P, A, PH, H, W, P/2)
- **Day-wise Entry**: Excel-like grid with day columns (1-31)
- Configurable attendance codes with payment rules
- Overtime tracking
- Auto-calculation of paid days

### Salary Structure & Compliance
- **Gujarat Minimum Wages** (Zone A/B/C) with auto-update
- **PF Calculation**: Configurable 12% on GROSS or Basic+DA
- **State-wise PT Slabs**: Gujarat, Maharashtra, Karnataka, Tamil Nadu, Delhi, etc.
- **ESI**: 0.75% employee + 3.25% employer
- **LWF**: State-wise Labour Welfare Fund
- **Bonus**: 8.33% minimum statutory bonus
- **Gratuity**: 4.81% calculation

### Attendance Codes
| Code | Description | Payment |
|------|-------------|---------|
| P | Present | 1x Gross |
| A | Absent | 0x (No Pay) |
| PH | Present on Holiday | **2x Basic+DA** |
| H | Paid Holiday | 1x Gross |
| W | Week Off | 1x Gross |
| P/2 | Half Day | 0.5x Gross |

### Payroll Processing
- Auto-calculation of all statutory deductions
- Gross payable calculation
- Export to CSV/Excel
- Month-wise salary records

### Reports & Compliance
- Attendance reports
- Salary disbursement reports
- Statutory compliance tracking

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Database**: Prisma ORM (SQLite/MySQL compatible)
- **State Management**: Zustand + React Hooks
- **Icons**: Lucide React

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/z-payroll.git
cd z-payroll

# Install dependencies
bun install

# Setup database
bun run db:push

# Start development server
bun run dev
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./db/custom.db"
```

### State-wise PT Configuration
PT slabs are pre-configured for:
- Gujarat (GJ)
- Maharashtra (MH)
- Karnataka (KA)
- Tamil Nadu (TN)
- Delhi (DL)
- West Bengal (WB)
- And more...

## 📱 Screenshots

### Dashboard
View real-time employee count, active deployments, and compliance status.

### Attendance Entry
Excel-like grid for quick attendance entry with auto-calculations.

### Salary Structure
Configure salary structures based on minimum wages with compliance settings.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please open an issue on GitHub.

---

Built with ❤️ for Indian manpower contractors
