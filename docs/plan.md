FOI TRACKER: AI AGENT EXECUTION PLAN
✅ GOAL

Build and deploy an MVP of FOI Tracker that allows users to:

    Log FOI requests

    Track deadlines

    Receive reminders via email/calendar

    Upload files and notes

    Export data to Notion

    Run securely with minimal cost

🧩 STEP 1: INITIAL PROJECT SETUP
🎯 Tasks:

    Create a GitHub repo: foi-tracker

    Set up monorepo structure (if using Next.js)

    Create .env.template for API keys

🛠️ Stack:

    Frontend: React (Next.js), TailwindCSS, TypeScript

    Backend: Node.js (via API routes in Next.js), Express-style

    Database: PostgreSQL (Supabase)

    Auth: Clerk.dev or Firebase Auth

    Storage: Supabase Storage

    Calendar/Email: Google Calendar API, SendGrid

🧱 STEP 2: DATABASE SCHEMA CREATION
📦 Tables:
users

id UUID PK
email TEXT
created_at TIMESTAMP

foi_requests

id UUID PK
user_id UUID FK → users.id
title TEXT
agency TEXT
region TEXT -- ENUM: 'ontario', 'federal', etc.
status TEXT -- ENUM: 'submitted', 'received', 'appealed', 'fulfilled'
submitted_date DATE
deadline_date DATE
response_date DATE
created_at TIMESTAMP

notes

id UUID PK
foi_id UUID FK → foi_requests.id
text TEXT
created_at TIMESTAMP

reminders

id UUID PK
foi_id UUID FK → foi_requests.id
reminder_type TEXT -- ENUM: 'follow-up', 'appeal'
remind_at TIMESTAMP
sent BOOLEAN DEFAULT false

files

id UUID PK
foi_id UUID FK
file_url TEXT
file_name TEXT
uploaded_at TIMESTAMP

🛠️ STEP 3: API BUILD
📤 Create FOI Request

POST /api/foi/create
Body: { title, agency, submitted_date, region }
→ Save to DB
→ Calculate `deadline_date` using region config
→ Schedule reminders (via CRON or Google Calendar API)

📅 Deadline Calculation Logic

function calculateDeadline(date: string, region: string): string {
  const days = region === 'ontario' ? 30 : 20;
  return addBusinessDays(new Date(date), days); // e.g., use 'date-fns'
}

📬 Email Reminders

POST /api/reminder/send
→ Query upcoming reminders
→ Send via SendGrid
→ Mark `sent = true`

🔗 Notion Export

POST /api/export/notion
→ Sync current user’s requests to linked Notion DB
→ Use Notion SDK

🖥️ STEP 4: UI WIREFRAMES (DESKTOP + MOBILE)

    AI Agent should generate these using Figma Plugin or custom code

🗃️ Dashboard View

    List of FOI requests

    Status tags, deadline countdown

    Filter by status, agency, region

📝 New Request Form

    Title, agency, jurisdiction dropdown

    Submitted date (auto deadline)

    Notes section

    File upload

🕒 Reminder Modal

    Show upcoming reminders

    Option to snooze or adjust

📲 Mobile View

    Collapsible sidebar

    Simplified list view

    Floating + button to add FOI

🔗 STEP 5: INTEGRATIONS
✅ Google Calendar

    Use OAuth to connect account

    Auto-create calendar events for deadlines + reminders

✅ Gmail (optional)

    Parse replies or send follow-up templates

✅ Notion

    Export FOIs as rows in a Notion database

    Use @notionhq/client to push structured data

🔐 STEP 6: SECURITY & PRIVACY TASKS

    Use HTTPS only

    Encrypt sensitive data (e.g., API tokens)

    All FOI data private by default

    Add basic rate limiting

    Generate Terms of Use + Privacy Policy

🚀 STEP 7: DEPLOYMENT PLAN
Infra:

    Frontend: Vercel (free)

    Backend/API: Railway (cheap, autoscaling)

    DB: Supabase (free tier)

    Storage: Supabase

    Email: SendGrid (free up to 100/day)

Steps:

    Set up staging and production environments

    Deploy to Vercel + connect to custom domain

    Monitor logs + error tracking (e.g., Sentry)

💸 STEP 8: MONETIZATION STRATEGY
Tiers:
Tier	Price	Features
Free	$0	Up to 10 active FOIs, manual export only
Pro	$5/mo	Unlimited FOIs, auto reminders, Notion export
Newsroom	$29/mo	Team dashboard, file storage, integrations
🧪 STEP 9: BETA LAUNCH & VALIDATION
Channels:

    CAJ Slack group

    J-school listservs (Carleton, Ryerson)

    Reddit r/journalism, r/FOIA

    Twitter DMs to reporters known for FOI work

    Partner with Canadian transparency NGOs for testing

Offer: 6 months free Pro in exchange for feedback
🔮 STEP 10: POST-LAUNCH IDEAS

    AI-generated FOI templates based on story pitch

    Appeal status tracking and deadline escalation

    Shared newsroom dashboards

    Analytics: avg. response time by agency, story tags

    Public request sharing toggle (for transparency orgs)

🧠 AGENT BEHAVIOR NOTES

    Use test users and dummy data to validate flows

    Set automated health checks on backend routes

    Log error traces with user ID context

    Clean up all staging data before live launch

    Maintain versioned schema migrations (via Supabase CLI or Prisma)