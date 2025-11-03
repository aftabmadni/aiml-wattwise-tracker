# ⚡ WattWise – AI-Powered Electricity Tracker

  # WattWise Electricity Tracker App
WattWise is an intelligent web application that helps users **track, analyze, and optimize electricity consumption — without needing hardware integration**.  
It offers **AI-based consumption forecasting**, **smart bill-saving suggestions**, and an **interactive dashboard with bill payment support**.

  
---

  ## Running the code
## 🚀 Features

  Run `npm i` to install the dependencies.
### 🔹 Smart Electricity Usage Tracking
- Enter or import usage data manually
- Real-time visualization with dynamic charts
- Daily, weekly, & monthly usage reports

  Run `npm run dev` to start the development server.
  
### 🤖 AI Integration
- Predicts next month’s consumption & bill
- Detects unusual usage spikes
- Provides AI-generated tips to reduce wastage

### 💸 Smart Bill Payment
- Real-time bill display based on usage
- UPI / Stripe-based payment
- Payment success alerts

### 📊 Interactive Dashboard
- AI-generated trend graphs
- Compare usage with previous months / similar homes
- Environmental CO₂ impact report

### 📬 Notifications & Alerts
- Bill-due reminders
- Alerts on excess consumption
- AI insights via email / in-app

---

## 🏗️ Tech Stack

| Layer | Tools |
|-------|-------|
| **Frontend** | React + TypeScript + Vite |
| **UI / Styling** | Tailwind CSS / ShadCN UI |
| **State Mgmt** | Context API / Redux Toolkit |
| **Charts** | Recharts / Chart.js |
| **AI Integration** | OpenAI API / TensorFlow.js |
| **Optional Backend** | Node.js / Express / Flask |
| **Database (Optional)** | MongoDB / Firebase / Supabase |
| **Payments** | Razorpay / Stripe |
| **Hosting** | Vercel / Netlify / Render |

---

## ⚙️ Installation & Setup

1️⃣ Clone the repository  
```bash
git clone https://github.com/aftabmadni/aiml-wattwise-tracker.git
cd wattwise-electricity-tracker

2️⃣ Install Dependencies

npm install


3️⃣ Run the App

npm run dev


4️⃣ Open in Browser

http://localhost:5173

🧠 AI Model (Optional Enhancement)

You can enhance WattWise with ML-based forecasting:

Train a regression model using scikit-learn or TensorFlow.js

Example Inputs:

Date

Appliance usage hours

Previous electricity usage

Unit price

Output:

Predicted energy consumption

Estimated billing amount

You can integrate the model:
✅ via REST API
✅ or directly using TensorFlow.js on the frontend

🧩 Folder Structure
src/
├── components/        # UI Components (Charts, Dashboard, Alerts)
├── contexts/          # Global State (User, Theme, Data)
├── lib/               # Utilities (API, Forecast, Payment)
├── styles/            # Tailwind / Global Styles
├── App.tsx            # Root App Component
├── main.tsx           # Entry Point
└── vite.config.ts     # Vite Configuration

💡 Future Enhancements

✅ Integration with real smart-meter APIs
✅ Carbon footprint calculator
✅ Gamified “Energy-Saving Score”
✅ AI chatbot for usage recommendations & support
  
