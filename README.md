# ☕ Better Coffee Syndicate — Collegiate Treat Equity & Rotation Manager

> **The Sovereign Rule**: *"Party deni hai toh sabko deni hai!"*  
> (Every fellow in the syndicate must sponsor one treat per cycle before anyone repeats. Earlier cycles are permanently preserved in historical archives).

A tailored, high-craftsmanship web application designed for the institute friend circle to manage post-class coffee and snack treats with strict rotational equity, humorous college banter, and anti-fraud ticket verification.

---

## 🏛️ The Syndicate Fellows (7 Members)
1. **Bhawesh-blue** (The Cold Brew Theorist)
2. **VyomX** (Caffeine Auditor)
3. **Devansh Hamster** (Pastry Prioritizer)
4. **Anurag-taze** (South Campus Barista)
5. **Samarth-khalifa** (Syndicate Chancellor)
6. **Kishan-denial** (Filter Coffee Loyalist)
7. **Elesh** (Syndicate Supreme Admin & Custodian 👑)

---

## ✨ Key Features

1. **Cycle Equilibrium Protocol ("Sabko Deni Hai")**:
   - Outings are tracked in strict **Cycles** (Cycle 1, Cycle 2, etc.).
   - Tracks fulfillment across all 7 fellows (e.g., `0 / 7 Fulfilled`).
   - When all 7 finish, a celebratory modal inaugurates the next cycle while permanently archiving previous cycles.

2. **Supreme Admin Jurisdiction & Anti-Fraud Ticket System**:
   - **Regular Fellows**: Can sign in with their collegiate credentials to submit a **Treat Claim Ticket** for an outing they sponsored.
   - **Admin (Elesh)**: Reviews pending tickets with full details (venue, amount, attendees, notes) to either **Accept** (enacting it officially into the cycle ledger) or **Reject** (flagging it as fraud ❌).
   - Non-admins and guests cannot add or remove members or tamper with cycle archives.

3. **Active Public Transparency**:
   - Visitors and fellows can freely browse the active ledger, next-in-line card, roster, and past archives without requiring a sign-in.
   - Sign-in is only requested when filing tickets or accessing the Admin control panel.

4. **Collegiate Group Portrait & Member Photography**:
   - Real member photography featured across hero banners, candidate cards, and the member roster.

5. **Axiom 1.1 Inquest: *UFO Cafe ≠ Better Coffee***:
   - Interactive comparative inquest settling the campus debate between UFO Cafe and Better Coffee.

6. **Deadlock Roulette / Spin the Wheel 🎡**:
   - Spin wheel with real photos to select the candidate when friends can't decide who pays.

7. **WhatsApp Collegial Dispatch Generator 📱**:
   - Formatted WhatsApp dispatches with next in line, pending defaulters, and cycle progress.

8. **Online Cloud Database (Supabase PostgreSQL)**:
   - Full real-time multi-device sync across all friends' smartphones and laptops using Supabase websockets.
   - Ready-to-run SQL schema in `src/data/supabaseSchema.sql`.
   - Offline-first fallback to local storage if disconnected.

---

## 🚀 Development & Local Run

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build
```

---

## ☁️ Online Cloud Database Setup (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. Copy the contents of [`src/data/supabaseSchema.sql`](src/data/supabaseSchema.sql) into the **SQL Editor** in Supabase and click **Run**.
3. In your website, click the **"Cloud DB"** button in the navbar, paste your **Project URL** and **`anon` public key**, and click **Connect**.

---

## 🌐 Deploy to Vercel / Netlify (Free Hosting)

### Deploying via Vercel:
1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"** $\rightarrow$ select your GitHub repo.
3. (Optional) Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Environment Variables.
4. Click **Deploy**!
