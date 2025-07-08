'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { PlusIcon, FunnelIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { FOIRequest } from '@/types/database'
import { getDaysUntilDeadline, getDeadlineStatus, REGION_CONFIGS } from '@/lib/deadline-calculator'
import NewFOIModal from '@/components/NewFOIModal'
import FOIRequestCard from '@/components/FOIRequestCard'

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const [foiRequests, setFoiRequests] = useState<FOIRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewModal, setShowNewModal] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    region: '',
    agency: ''
  })

  useEffect(() => {
    if (isLoaded && user) {
      fetchFOIRequests()
    }
  }, [isLoaded, user, filters])

  const fetchFOIRequests = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.region) params.append('region', filters.region)
      if (filters.agency) params.append('agency', filters.agency)

      const response = await fetch(`/api/foi/list?${params}`)
      const data = await response.json()

      if (data.success) {
        setFoiRequests(data.foi_requests)
      }
    } catch (error) {
      console.error('Error fetching FOI requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewFOI = async (foiData: any) => {
    try {
      const response = await fetch('/api/foi/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(foiData),
      })

      const data = await response.json()
      if (data.success) {
        setShowNewModal(false)
        fetchFOIRequests()
      }
    } catch (error) {
      console.error('Error creating FOI request:', error)
    }
  }

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

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to FOI Tracker</h1>
          <p className="text-gray-600 mb-8">Please sign in to manage your FOI requests</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FOI Tracker</h1>
              <p className="text-gray-600">Manage your Freedom of Information requests</p>
            </div>
            <button
              onClick={() => setShowNewModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New FOI Request
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center mb-4">
            <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="received">Received</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="denied">Denied</option>
              <option value="appealed">Appealed</option>
            </select>

            <select
              value={filters.region}
              onChange={(e) => setFilters({ ...filters, region: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Regions</option>
              {Object.entries(REGION_CONFIGS).map(([key, config]) => (
                <option key={key} value={key}>{config.name}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search by agency..."
              value={filters.agency}
              onChange={(e) => setFilters({ ...filters, agency: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-semibold text-gray-900">{foiRequests.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Due Soon</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {foiRequests.filter(req => getDeadlineStatus(req.deadline_date) === 'due-soon').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {foiRequests.filter(req => getDeadlineStatus(req.deadline_date) === 'overdue').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Fulfilled</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {foiRequests.filter(req => req.status === 'fulfilled').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOI Requests List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Your FOI Requests</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : foiRequests.length === 0 ? (
            <div className="p-6 text-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No FOI requests yet</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first FOI request</p>
              <button
                onClick={() => setShowNewModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create First Request
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {foiRequests.map((request) => (
                <FOIRequestCard
                  key={request.id}
                  request={request}
                  onUpdate={fetchFOIRequests}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New FOI Modal */}
      {showNewModal && (
        <NewFOIModal
          onClose={() => setShowNewModal(false)}
          onSubmit={handleNewFOI}
        />
      )}
    </div>
  )
} 