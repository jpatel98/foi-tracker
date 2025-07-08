import { addBusinessDays, format } from 'date-fns'

export interface RegionConfig {
  name: string
  businessDays: number
  description: string
}

export const REGION_CONFIGS: Record<string, RegionConfig> = {
  ontario: {
    name: 'Ontario',
    businessDays: 30,
    description: '30 business days from receipt'
  },
  federal: {
    name: 'Federal',
    businessDays: 30,
    description: '30 calendar days from receipt'
  },
  alberta: {
    name: 'Alberta',
    businessDays: 30,
    description: '30 calendar days from receipt'
  },
  british_columbia: {
    name: 'British Columbia',
    businessDays: 30,
    description: '30 business days from receipt'
  },
  manitoba: {
    name: 'Manitoba',
    businessDays: 30,
    description: '30 calendar days from receipt'
  },
  new_brunswick: {
    name: 'New Brunswick',
    businessDays: 30,
    description: '30 calendar days from receipt'
  },
  newfoundland: {
    name: 'Newfoundland and Labrador',
    businessDays: 20,
    description: '20 business days from receipt'
  },
  nova_scotia: {
    name: 'Nova Scotia',
    businessDays: 30,
    description: '30 calendar days from receipt'
  },
  pei: {
    name: 'Prince Edward Island',
    businessDays: 30,
    description: '30 calendar days from receipt'
  },
  quebec: {
    name: 'Quebec',
    businessDays: 20,
    description: '20 calendar days from receipt'
  },
  saskatchewan: {
    name: 'Saskatchewan',
    businessDays: 30,
    description: '30 calendar days from receipt'
  },
  northwest_territories: {
    name: 'Northwest Territories',
    businessDays: 30,
    description: '30 calendar days from receipt'
  },
  nunavut: {
    name: 'Nunavut',
    businessDays: 30,
    description: '30 calendar days from receipt'
  },
  yukon: {
    name: 'Yukon',
    businessDays: 30,
    description: '30 calendar days from receipt'
  }
}

export function calculateDeadline(submittedDate: string, region: string): string {
  const config = REGION_CONFIGS[region]
  if (!config) {
    throw new Error(`Unknown region: ${region}`)
  }

  const submitted = new Date(submittedDate)
  
  // For regions that use business days
  if (region === 'ontario' || region === 'british_columbia' || region === 'newfoundland') {
    return format(addBusinessDays(submitted, config.businessDays), 'yyyy-MM-dd')
  }
  
  // For regions that use calendar days
  const deadline = new Date(submitted)
  deadline.setDate(deadline.getDate() + config.businessDays)
  return format(deadline, 'yyyy-MM-dd')
}

export function getDaysUntilDeadline(deadlineDate: string): number {
  const deadline = new Date(deadlineDate)
  const today = new Date()
  const diffTime = deadline.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export function isOverdue(deadlineDate: string): boolean {
  return getDaysUntilDeadline(deadlineDate) < 0
}

export function getDeadlineStatus(deadlineDate: string): 'overdue' | 'due-soon' | 'on-track' {
  const daysUntil = getDaysUntilDeadline(deadlineDate)
  
  if (daysUntil < 0) return 'overdue'
  if (daysUntil <= 7) return 'due-soon'
  return 'on-track'
} 