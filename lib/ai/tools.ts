import {
  getClients,
  getShipments,
  getInvoices,
  searchClients,
  searchShipments,
  getClientShipments,
  getClientInvoices
} from '@/lib/firestore'

// Tool definitions for AI function calling
export const tools = [
  {
    type: 'function',
    function: {
      name: 'search_clients',
      description: 'Busca clientes por nombre, email o ID. Útil para encontrar información de clientes específicos.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'El nombre, email o ID del cliente a buscar'
          }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'search_shipments',
      description: 'Busca envíos por tracking number o shipment ID. Útil para rastrear paquetes.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'El tracking number o shipment ID a buscar'
          }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_all_clients',
      description: 'Obtiene la lista completa de todos los clientes. Útil para estadísticas generales.',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_all_shipments',
      description: 'Obtiene la lista completa de todos los envíos. Útil para estadísticas de envíos.',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_all_invoices',
      description: 'Obtiene la lista completa de todas las facturas. Útil para análisis financiero.',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_client_shipments',
      description: 'Obtiene todos los envíos de un cliente específico.',
      parameters: {
        type: 'object',
        properties: {
          clientId: {
            type: 'string',
            description: 'El ID interno del cliente (no el clientId visible, sino el id de Firestore)'
          }
        },
        required: ['clientId']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_client_invoices',
      description: 'Obtiene todas las facturas de un cliente específico.',
      parameters: {
        type: 'object',
        properties: {
          clientId: {
            type: 'string',
            description: 'El ID interno del cliente (no el clientId visible, sino el id de Firestore)'
          }
        },
        required: ['clientId']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'calculate_shipping_quote',
      description: 'Calcula una cotización de envío basada en peso, dimensiones, origen y destino.',
      parameters: {
        type: 'object',
        properties: {
          weight: {
            type: 'number',
            description: 'Peso del paquete en kilogramos'
          },
          originCity: {
            type: 'string',
            description: 'Ciudad de origen'
          },
          destinationCity: {
            type: 'string',
            description: 'Ciudad de destino'
          },
          packageType: {
            type: 'string',
            enum: ['documento', 'paquete', 'caja'],
            description: 'Tipo de paquete'
          },
          urgent: {
            type: 'boolean',
            description: 'Si es envío urgente (entrega mismo día)'
          }
        },
        required: ['weight', 'originCity', 'destinationCity', 'packageType']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'calculate_total_revenue',
      description: 'Calcula el ingreso total de facturas pagadas, pendientes o vencidas.',
      parameters: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['pagada', 'pendiente', 'vencida', 'all'],
            description: 'Filtrar por estatus de factura'
          }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_shipment_statistics',
      description: 'Obtiene estadísticas de envíos por estatus, fecha o cliente.',
      parameters: {
        type: 'object',
        properties: {
          groupBy: {
            type: 'string',
            enum: ['status', 'date', 'client'],
            description: 'Agrupar estadísticas por estatus, fecha o cliente'
          }
        },
        required: ['groupBy']
      }
    }
  }
]

// Tool execution functions
export async function executeTool(toolName: string, args: any) {
  switch (toolName) {
    case 'search_clients':
      return await searchClients(args.query)

    case 'search_shipments':
      return await searchShipments(args.query)

    case 'get_all_clients':
      return await getClients()

    case 'get_all_shipments':
      return await getShipments()

    case 'get_all_invoices':
      return await getInvoices()

    case 'get_client_shipments':
      return await getClientShipments(args.clientId)

    case 'get_client_invoices':
      return await getClientInvoices(args.clientId)

    case 'calculate_shipping_quote':
      return calculateShippingQuote(args)

    case 'calculate_total_revenue':
      const invoices = await getInvoices()
      return calculateRevenue(invoices, args.status || 'all')

    case 'get_shipment_statistics':
      const shipments = await getShipments()
      return getShipmentStats(shipments, args.groupBy)

    default:
      throw new Error(`Tool ${toolName} not found`)
  }
}

// Helper function: Calculate shipping quote
function calculateShippingQuote(params: {
  weight: number
  originCity: string
  destinationCity: string
  packageType: string
  urgent?: boolean
}) {
  const { weight, originCity, destinationCity, packageType, urgent } = params

  // Base rate per kg
  let baseRate = 50

  // Package type multiplier
  const typeMultipliers: Record<string, number> = {
    'documento': 0.8,
    'paquete': 1.0,
    'caja': 1.2
  }

  // Distance calculation (simplified - in real app would use actual distance)
  const cities = [originCity.toLowerCase(), destinationCity.toLowerCase()]
  const majorCities = ['ciudad de méxico', 'guadalajara', 'monterrey', 'puebla', 'tijuana']
  const isMajorRoute = cities.every(city => majorCities.some(major => city.includes(major)))

  const distanceMultiplier = isMajorRoute ? 1.0 : 1.3

  // Calculate base cost
  let cost = baseRate * weight * (typeMultipliers[packageType] || 1.0) * distanceMultiplier

  // Urgent delivery surcharge
  if (urgent) {
    cost *= 1.5
  }

  // Insurance (2% of shipment value, estimated at $500 per kg)
  const insurance = weight * 500 * 0.02

  // Tax (16% IVA)
  const subtotal = cost + insurance
  const tax = subtotal * 0.16
  const total = subtotal + tax

  return {
    breakdown: {
      baseCost: Math.round(cost * 100) / 100,
      insurance: Math.round(insurance * 100) / 100,
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100
    },
    details: {
      weight: `${weight} kg`,
      route: `${originCity} → ${destinationCity}`,
      packageType,
      urgent: urgent || false,
      estimatedDays: urgent ? '1 día' : isMajorRoute ? '2-3 días' : '3-5 días'
    }
  }
}

// Helper function: Calculate revenue
function calculateRevenue(invoices: any[], status: string) {
  let filtered = invoices

  if (status !== 'all') {
    filtered = invoices.filter(inv => inv.status === status)
  }

  const total = filtered.reduce((sum, inv) => sum + inv.total, 0)
  const count = filtered.length

  return {
    total: Math.round(total * 100) / 100,
    count,
    average: count > 0 ? Math.round((total / count) * 100) / 100 : 0,
    status: status === 'all' ? 'todas' : status
  }
}

// Helper function: Shipment statistics
function getShipmentStats(shipments: any[], groupBy: string) {
  if (groupBy === 'status') {
    const statusCount: Record<string, number> = {}
    shipments.forEach(ship => {
      statusCount[ship.status] = (statusCount[ship.status] || 0) + 1
    })
    return {
      total: shipments.length,
      byStatus: statusCount,
      groupedBy: 'status'
    }
  }

  if (groupBy === 'date') {
    const today = new Date()
    const thisMonth = shipments.filter(ship => {
      const shipDate = ship.createdAt.toDate()
      return shipDate.getMonth() === today.getMonth() &&
             shipDate.getFullYear() === today.getFullYear()
    })
    const lastMonth = shipments.filter(ship => {
      const shipDate = ship.createdAt.toDate()
      const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1)
      return shipDate.getMonth() === lastMonthDate.getMonth() &&
             shipDate.getFullYear() === lastMonthDate.getFullYear()
    })

    return {
      total: shipments.length,
      thisMonth: thisMonth.length,
      lastMonth: lastMonth.length,
      groupedBy: 'date'
    }
  }

  if (groupBy === 'client') {
    const clientCount: Record<string, number> = {}
    shipments.forEach(ship => {
      const clientId = ship.clientId
      clientCount[clientId] = (clientCount[clientId] || 0) + 1
    })

    const topClients = Object.entries(clientCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([clientId, count]) => ({ clientId, shipments: count }))

    return {
      total: shipments.length,
      uniqueClients: Object.keys(clientCount).length,
      topClients,
      groupedBy: 'client'
    }
  }

  return { error: 'Invalid groupBy parameter' }
}
