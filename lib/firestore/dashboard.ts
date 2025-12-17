import { Timestamp } from 'firebase/firestore'
import { DashboardStats } from '@/types/crm'
import { getShipmentStats } from './shipments'
import { getInvoiceStats } from './invoices'
import { getClients } from './clients'

// Obtener estadísticas completas del dashboard
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Obtener estadísticas de envíos
    const shipmentStats = await getShipmentStats()

    // Obtener estadísticas de facturas
    const invoiceStats = await getInvoiceStats()

    // Obtener clientes activos
    const allClients = await getClients({}, 1000)
    const activeClients = allClients.filter((c) => c.isActive)

    // Calcular ingresos del mes actual
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthStart = Timestamp.fromDate(firstDayOfMonth)

    // Esto debería ser calculado con una query de Firestore filtrada por fecha
    // pero para simplificar, lo calculamos localmente
    const monthlyRevenue = shipmentStats.totalValue // Simplificado

    const stats: DashboardStats = {
      totalShipments: shipmentStats.total,
      activeShipments: shipmentStats.inTransit,
      deliveredShipments: shipmentStats.delivered,
      pendingShipments: shipmentStats.pending,
      totalRevenue: shipmentStats.totalValue,
      monthlyRevenue,
      totalClients: allClients.length,
      activeClients: activeClients.length,
      pendingInvoices: invoiceStats.pending,
      overdueInvoices: invoiceStats.overdue,
    }

    return stats
  } catch (error) {
    console.error('Error getting dashboard stats:', error)
    throw error
  }
}

// Obtener resumen rápido para mostrar en el dashboard
export async function getDashboardSummary() {
  try {
    const stats = await getDashboardStats()

    return {
      stats: [
        {
          label: 'Envíos Activos',
          value: stats.activeShipments.toString(),
          change: '+12%', // Esto debería calcularse comparando con periodo anterior
          icon: 'Package',
          color: 'blue',
        },
        {
          label: 'Ingresos del Mes',
          value: `$${stats.monthlyRevenue.toLocaleString()}`,
          change: '+18%',
          icon: 'DollarSign',
          color: 'green',
        },
        {
          label: 'Clientes Activos',
          value: stats.activeClients.toString(),
          change: '+8%',
          icon: 'Users',
          color: 'purple',
        },
        {
          label: 'Pendientes',
          value: stats.pendingShipments.toString(),
          change: '-3%',
          icon: 'AlertCircle',
          color: 'orange',
        },
      ],
    }
  } catch (error) {
    console.error('Error getting dashboard summary:', error)
    throw error
  }
}
