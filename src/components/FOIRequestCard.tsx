'use client'

import { useState } from 'react'
import { CalendarIcon, DocumentTextIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { FOIRequest } from '@/types/database'
import { getDaysUntilDeadline, getDeadlineStatus, REGION_CONFIGS } from '@/lib/deadline-calculator'
import { format } from 'date-fns'

interface FOIRequestCardProps {
  request: FOIRequest
  onUpdate: () => void
}

export default function FOIRequestCard({ request, onUpdate }: FOIRequestCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'received': return 'bg-yellow-100 text-yellow-800'
      case 'fulfilled': return 'bg-green-100 text-green-800'
      case 'denied': return 'bg-red-100 text-red-800'
      case 'appealed': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDeadlineColor = (deadlineDate: string) => {
    const status = getDeadlineStatus(deadlineDate)
    switch (status) {
      case 'overdue': return 'text-red-600'
      case 'due-soon': return 'text-yellow-600'
      case 'on-track': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getDeadlineText = (deadlineDate: string) => {
    const daysUntil = getDaysUntilDeadline(deadlineDate)
    const status = getDeadlineStatus(deadlineDate)
    
    if (status === 'overdue') {
      return `${Math.abs(daysUntil)} days overdue`
    } else if (status === 'due-soon') {
      return `${daysUntil} days remaining`
    } else {
      return `${daysUntil} days remaining`
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/foi/${request.id}/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-medium text-gray-900">{request.title}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
          
          <div className="text-sm text-gray-600 mb-3">
            <p><strong>Agency:</strong> {request.agency}</p>
            <p><strong>Jurisdiction:</strong> {REGION_CONFIGS[request.region]?.name}</p>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-gray-600">Submitted: {format(new Date(request.submitted_date), 'MMM dd, yyyy')}</span>
            </div>
            
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
              <span className={`font-medium ${getDeadlineColor(request.deadline_date)}`}>
                Deadline: {format(new Date(request.deadline_date), 'MMM dd, yyyy')} ({getDeadlineText(request.deadline_date)})
              </span>
            </div>
          </div>

          {request.response_date && (
            <div className="mt-2 text-sm">
              <span className="text-gray-600">
                Response received: {format(new Date(request.response_date), 'MMM dd, yyyy')}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <DocumentTextIcon className="h-5 w-5" />
          </button>
          
          <select
            value={request.status}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            disabled={loading}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="submitted">Submitted</option>
            <option value="received">Received</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="denied">Denied</option>
            <option value="appealed">Appealed</option>
          </select>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
              {/* Notes would be fetched and displayed here */}
              <p className="text-sm text-gray-600">No notes yet</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Files</h4>
              {/* Files would be fetched and displayed here */}
              <p className="text-sm text-gray-600">No files uploaded</p>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
              <PencilIcon className="h-4 w-4 mr-1" />
              Add Note
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
              Upload File
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
              Export to Notion
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 