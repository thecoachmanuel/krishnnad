# Krishnnad Syndicate

**Experience the Pinnacle of Dog Pedigree.**

Krishnnad Syndicate is a premium, full-stack web application designed for a luxury dog kennel. It provides a seamless experience for both high-end customers looking for purebred dogs and administrators managing a sophisticated breeding business.

## 🚀 Features

### For Customers
- **Curated Collection**: Browse high-quality dog listings with rich details on health and pedigree.
- **Wishlist**: Save favorite dogs to a personal wishlist (synced across devices).
- **Secure Reservation**: Real-time reservation system integrated with **Paystack** for secure payments.
- **Support & Enquiries**: Dedicated contact channels that route enquiries directly to the kennel management.
- **Account Management**: Self-service account with password security and personal transaction history.

### For Administrators
- **Performance Analytics**: Real-time KPI dashboard showing revenue, active listings, and growth metrics.
- **Inventory Management**: Comprehensive CRUD for dog listings, including multi-image uploads and health certification tracking.
- **Breeds Library**: Manage breed standards and historical pedigrees.
- **Logistics & Orders**: End-to-end tracking for sales and delivery status management.
- **Media Hub**: Centralized asset management for all kennel photography and documents.
- **Site Configuration**: Dynamically update homepage content and business variables (e.g., delivery fees) from the admin console.

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: Vanilla CSS with modern Design Tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Payments**: [Paystack](https://paystack.com/)
- **Charts**: [Recharts](https://recharts.org/)

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account and project

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/thecoachmanuel/krishnnad.git
   cd krishnnad
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_key
   PAYSTACK_SECRET_KEY=your_paystack_secret
   ```

4. **Initialize Database:**
   Run the SQL script provided in `supabase/schema.sql` within your Supabase SQL Editor to set up tables, triggers, and RLS policies.

5. **Run the development server:**
   ```bash
   npm run dev
   ```

## 🔒 Security
The application implements strict **Row Level Security (RLS)** in Supabase, ensuring that customer data is private and the Admin Console is accessible only to authorized personnel via custom profile roles.

## 📄 License
Internal use for Krishnnad Syndicate.
