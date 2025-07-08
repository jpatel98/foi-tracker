export interface User {
  id: string
  email: string
  created_at: string
}

export interface FOIRequest {
  id: string
  user_id: string
  title: string
  agency: string
  region: 'ontario' | 'federal' | 'alberta' | 'british_columbia' | 'manitoba' | 'new_brunswick' | 'newfoundland' | 'nova_scotia' | 'pei' | 'quebec' | 'saskatchewan' | 'northwest_territories' | 'nunavut' | 'yukon'
  status: 'submitted' | 'received' | 'appealed' | 'fulfilled' | 'denied'
  submitted_date: string
  deadline_date: string
  response_date?: string
  created_at: string
}

export interface Note {
  id: string
  foi_id: string
  text: string
  created_at: string
}

export interface Reminder {
  id: string
  foi_id: string
  reminder_type: 'follow-up' | 'appeal' | 'deadline'
  remind_at: string
  sent: boolean
  created_at: string
}

export interface File {
  id: string
  foi_id: string
  file_url: string
  file_name: string
  uploaded_at: string
}

export interface Database {
  users: User
  foi_requests: FOIRequest
  notes: Note
  reminders: Reminder
  files: File
} 