import { useState, useEffect } from 'react'
import {
  getClients,
  getShipments,
  getInvoices,
  getRecentActivities,
  getDashboardStats,
} from '@/lib/firestore'
import type { Client, Shipment, Invoice, CRMActivity, DashboardStats } from '@/types/crm'

// Hook para obtener clientes
export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        const data = await getClients({ isActive: true })
        setClients(data)
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching clients:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  return { clients, loading, error, refetch: () => window.location.reload() }
}

// Hook para obtener envíos
export function useShipments() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setLoading(true)
        const data = await getShipments({})
        setShipments(data)
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching shipments:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchShipments()
  }, [])

  return { shipments, loading, error, refetch: () => window.location.reload() }
}

// Hook para obtener facturas
export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true)
        const data = await getInvoices({})
        setInvoices(data)
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching invoices:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  return { invoices, loading, error, refetch: () => window.location.reload() }
}

// Hook para obtener actividades del CRM
export function useCRMActivities(limit: number = 20) {
  const [activities, setActivities] = useState<CRMActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        const data = await getRecentActivities(limit)
        setActivities(data)
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching activities:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [limit])

  return { activities, loading, error, refetch: () => window.location.reload() }
}

// Hook para obtener estadísticas del dashboard
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await getDashboardStats()
        setStats(data)
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error, refetch: () => window.location.reload() }
}
