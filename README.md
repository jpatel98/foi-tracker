# FOI Tracker

A comprehensive Freedom of Information request management system built for journalists, researchers, and citizens. Track deadlines, receive automated reminders, and manage your FOI requests efficiently.

## Features

- **Automated Deadline Calculation**: Automatically calculates response deadlines based on jurisdiction-specific rules
- **Smart Reminders**: Email notifications for upcoming deadlines and follow-up dates
- **Status Tracking**: Track the status of your FOI requests from submission to fulfillment
- **File Management**: Upload and organize documents related to your requests
- **Notes & Comments**: Add notes and comments to keep track of important details
- **Export Integration**: Export data to Notion and other tools
- **Multi-Jurisdiction Support**: Support for all Canadian provinces and territories
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Clerk.dev
- **Email**: SendGrid
- **Calendar Integration**: Google Calendar API
- **File Storage**: Supabase Storage
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Clerk.dev account
- SendGrid account (optional for email reminders)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/foi-tracker.git
   cd foi-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.template .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # SendGrid Email (optional)
   SENDGRID_API_KEY=your_sendgrid_api_key
   SENDGRID_FROM_EMAIL=noreply@foitracker.com

   # Google Calendar API (optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

   # Notion Integration (optional)
   NOTION_API_KEY=your_notion_api_key
   NOTION_DATABASE_ID=your_notion_database_id

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**
   
   Run the SQL schema in your Supabase SQL editor:
   ```sql
   -- Copy the contents of supabase/schema.sql
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses the following main tables:

- **users**: User accounts and authentication
- **foi_requests**: Main FOI request records
- **notes**: Notes and comments for each request
- **reminders**: Automated reminder scheduling
- **files**: File uploads and attachments

## API Endpoints

### FOI Requests
- `POST /api/foi/create` - Create a new FOI request
- `GET /api/foi/list` - List user's FOI requests with filtering
- `PATCH /api/foi/[id]/update` - Update FOI request status

### Reminders
- `POST /api/reminder/send` - Send scheduled reminders

### Export
- `POST /api/export/notion` - Export to Notion

## Jurisdiction Support

The application supports all Canadian jurisdictions with their specific deadline rules:

- **Ontario**: 30 business days
- **Federal**: 30 calendar days
- **British Columbia**: 30 business days
- **Quebec**: 20 calendar days
- **Newfoundland**: 20 business days
- **All other provinces/territories**: 30 calendar days

## Deployment

### Vercel Deployment

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy your app

### Environment Variables for Production

Make sure to update the following for production:
- `NEXT_PUBLIC_APP_URL` to your production domain
- `GOOGLE_REDIRECT_URI` to your production callback URL
- All API keys should be production keys

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@foitracker.com or create an issue in the GitHub repository.

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Team collaboration features
- [ ] Public FOI request sharing
- [ ] AI-powered request templates
- [ ] Integration with more calendar providers
- [ ] Advanced file management with OCR
- [ ] Multi-language support

## Acknowledgments

- Built for the Canadian journalism community
- Inspired by the need for better FOI request management
- Special thanks to transparency advocates and FOI researchers
