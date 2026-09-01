# 💎 StackLoot — Teen Compounding Vault & Allowance OS

> **"Lock allowance. Level up yield. Build generational wealth habits."**

**StackLoot** is an open, private, local-first financial behavioral engine designed to teach teenagers the superpower of delayed gratification through high-yield compounding, parent matching incentives, and milestone kickers.

[![Build Status](https://img.shields.io/badge/Build-Passing-emerald.svg)](https://github.com/mohit9814/StackLoot)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-indigo.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-v8.2-purple.svg)](https://vite.dev/)

---

## 🌟 Why StackLoot?

90% of modern teen fintech apps (e.g. FamPay, Junio, Step) focus on **frictionless spending** via prepaid cards and UPI, rewarding teens with fast-food coupons and gaming vouchers.

**StackLoot flips the script.** It gamifies **delayed gratification**:
* It demonstrates how deferring a ₹1,000/month allowance at **30% p.a.** with a **100% Parent Match** and **+20% Milestone Kicker** turns **₹6,000 in savings into ₹8,620 in payout**.
* It reveals the **Snowball Velocity Effect (6.39x)** — showing teens how money earned in Month 6 works over **6 times faster** than in Month 1.

---

## ✨ Key Features & Capabilities

### 1. 🎮 Teen Mission Control (The Junior Vault)
* **Real-time Vault Balances:** Instant breakdown of Principal Saved, Bank of Dad Yield, Parent Match Bonus, and Goal Progress.
* **4-Pillar Transparent Payout Card:** Full line-item clarity on every rupee earned before graduation.
* **Snowball Earning Velocity:** Visual meter explaining why Month 6 earns ₹159.69/mo vs Month 1's ₹25.00/mo.
* **Wishlist Goals Tracker:** Earmark funds towards real-world aspirations (e.g., Electric Guitar, Gaming GPU, Headphones).

### 2. ⚡ Interactive Compounding Simulator
* **Dynamic Sliders:** Test different monthly allowances, deferral percentages (0% to 100%), interest rates, and term durations (3 to 12 months).
* **1-Click Presets:**
  * 🏃 **3-Month Sprint** (30% p.a. • 100% Match • ₹500 Bonus)
  * 🎯 **6-Month Marathon** (30% p.a. • 100% Match • 20% Kicker)
  * 🎓 **12-Month Graduate** (35% p.a. • 100% Match • 25% Kicker)
* **Direct Plan Activation:** Apply simulated rules straight to the live teen ledger in 1 click.

### 3. 📉 Opportunity Loss / Cost of Inaction Calculator
* Directly compares leaving money in a traditional **Cash Piggy Bank (0% growth)** vs the **StackLoot Vault**.
* Shows the exact compounding yield lost across 6-month and 1-year horizons.

### 4. 🔄 1-Click Backdated Backlog Catch-Up
* Started late? Dad can backdate historical allowance from past months (e.g., June 2026).
* The engine automatically calculates all retroactive deposits, monthly compounding credits, and parent match transactions.

### 5. 🛑 Liquidity Escape Hatch (Emergency Withdrawal)
* Teaches realistic financial contracts: principal is **100% safe to withdraw anytime**, but breaking the lock early forfeits unvested interest and milestone kickers.

### 6. 📜 Printable Family Charter & Desk Habit Tracker
* High-resolution printable contract and desktop daily checkbox tracker to keep the agreement physical and top-of-mind.

### 7. 🔒 Parent URL Obfuscation & Security
* Root `/` and `/son` default to the secure Teen view with **zero role switches or admin buttons**.
* Parent Console is accessible only via a private tokenized route (`/parent-vault-8f3a9`).
* Includes **`🔑 Copy Secret Parent URL`** and **`🔒 Lock Parent Mode`** controls.

### 8. 💾 Authoritative Local Filesystem Database
* Zero cloud trackers. Zero KYC. Zero bank linkage.
* All data is persisted directly to `data/bank_of_dad_state.json` on disk, syncing across PC, laptop, and mobile phones on the same local Wi-Fi.

---

## 🧮 Compounding Mathematics

The engine computes monthly compounding with mid-month deposit vesting:

$$\text{Monthly Interest Rate } (r) = \frac{\text{Annual Interest Rate}}{12}$$

$$\text{Balance Subject to Yield } (B_t) = \text{Starting Balance} + \text{Monthly Deferral}$$

$$\text{Monthly Interest Earned } (I_t) = B_t \times r$$

$$\text{Monthly Parent Match } (M_t) = I_t \times \text{Match Multiplier}$$

$$\text{Snowball Acceleration Factor} = \frac{\text{Final Month Interest}}{\text{Month 1 Interest}}$$

---

## 🚀 Quick Start & Installation

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or later)
* `npm` or `pnpm`

### 1. Clone the Repository
```bash
git clone https://github.com/mohit9814/StackLoot.git
cd StackLoot
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev -- --host
```

* **Son's Portal:** `http://localhost:5173/` or `http://localhost:5173/son`
* **Secret Parent Console:** `http://localhost:5173/parent-vault-8f3a9`

---

## 📱 Multi-Device Wi-Fi Setup

To access StackLoot from your son's phone or iPad on the same home network:
1. Find your computer's local IP address (e.g. `192.168.1.12`).
2. Share the Son Link: `http://192.168.1.12:5173/son`
3. The phone connects directly to your local Vite server and syncs with `data/bank_of_dad_state.json` in real time.

---

## 🧪 Testing & Validation

Run unit tests covering the compounding engine and edge cases:
```bash
npx vitest run
```

Build for production:
```bash
npm run build
```

---

## 📄 License
MIT License. Created with ❤️ for empowering the next generation of financially savvy teens.
