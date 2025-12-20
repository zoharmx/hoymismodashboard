import { Timestamp } from 'firebase/firestore'

// Estados de envío
export type ShipmentStatus =
  | 'pendiente'
  | 'en-transito'
  | 'en-aduana'
  | 'en-distribucion'
  | 'entregado'
  | 'cancelado'
  | 'devuelto'

// Estados de factura
export type InvoiceStatus = 'pendiente' | 'pagada' | 'vencida' | 'cancelada'

// Tipo de cliente
export type ClientType = 'individual' | 'empresa'

// Prioridad de nota
export type NotePriority = 'baja' | 'media' | 'alta'

// Tipo de actividad del CRM
export type ActivityType =
  | 'llamada'
  | 'email'
  | 'reunion'
  | 'nota'
  | 'seguimiento'
  | 'cotizacion'

// Dirección
export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  reference?: string
}

// Cliente
export interface Client {
  id: string
  clientId: string // ID personalizado tipo CLT-001234
  name: string
  email: string
  phone: string
  type: ClientType
  company?: string
  rfc?: string // RFC para clientes de México
  address: Address
  billingAddress?: Address
  totalShipments: number
  totalSpent: number
  createdAt: Timestamp
  updatedAt: Timestamp
  lastShipmentDate?: Timestamp
  notes?: string
  tags?: string[]
  isActive: boolean
}

// Envío
export interface Shipment {
  id: string
  shipmentId: string // ID personalizado tipo HM-2024-10045
  clientId: string
  clientName: string // Desnormalizado para queries rápidas

  // Origen y destino
  origin: Address
  destination: Address

  // Detalles del paquete
  weight: number // en kg
  dimensions?: {
    length: number
    width: number
    height: number
    unit: 'cm' | 'in'
  }
  packageType: string // caja, sobre, pallet, etc.
  description: string
  declaredValue: number

  // Estado y tracking
  status: ShipmentStatus
  trackingNumber?: string
  estimatedDelivery?: Timestamp
  actualDelivery?: Timestamp

  // Costos
  shippingCost: number
  insuranceCost?: number
  additionalCosts?: number
  totalCost: number
  currency: string // MXN, USD

  // Fechas
  createdAt: Timestamp
  updatedAt: Timestamp
  pickupDate?: Timestamp

  // Información adicional
  notes?: string
  specialInstructions?: string
  requiresSignature: boolean
  invoiceId?: string

  // Tracking history
  trackingHistory?: TrackingEvent[]
}

// Evento de tracking
export interface TrackingEvent {
  date: Timestamp
  status: ShipmentStatus
  location: string
  description: string
  updatedBy?: string
}

// Factura
export interface Invoice {
  id: string
  invoiceId: string // ID personalizado tipo INV-2024-00123
  clientId: string
  clientName: string

  // Detalles de facturación
  items: InvoiceItem[]
  subtotal: number
  tax: number
  discount?: number
  total: number
  currency: string

  // Estado
  status: InvoiceStatus
  dueDate: Timestamp
  paidDate?: Timestamp

  // Fechas
  createdAt: Timestamp
  updatedAt: Timestamp

  // Información adicional
  notes?: string
  paymentMethod?: string
  paymentReference?: string
}

// Item de factura
export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
  shipmentId?: string
}

// Actividad del CRM
export interface CRMActivity {
  id: string
  clientId: string
  type: ActivityType
  title: string
  description: string
  priority: NotePriority
  createdAt: Timestamp
  updatedAt: Timestamp
  dueDate?: Timestamp
  completedAt?: Timestamp
  createdBy: string
  assignedTo?: string
  relatedShipmentId?: string
  relatedInvoiceId?: string
}

// Estadísticas del dashboard
export interface DashboardStats {
  totalShipments: number
  activeShipments: number
  deliveredShipments: number
  pendingShipments: number
  totalRevenue: number
  monthlyRevenue: number
  totalClients: number
  activeClients: number
  pendingInvoices: number
  overdueInvoices: number
}

// Filtros para búsquedas
export interface ShipmentFilters {
  status?: ShipmentStatus[]
  clientId?: string
  startDate?: Date
  endDate?: Date
  minValue?: number
  maxValue?: number
}

export interface ClientFilters {
  type?: ClientType
  isActive?: boolean
  tags?: string[]
  minShipments?: number
  minSpent?: number
}

export interface InvoiceFilters {
  status?: InvoiceStatus[]
  clientId?: string
  startDate?: Date
  endDate?: Date
  minAmount?: number
  maxAmount?: number
}

// Roles de usuario
export type UserRole = 'admin' | 'manager' | 'operator' | 'viewer'

// Usuario del sistema
export interface User {
  id: string
  uid: string // Firebase Auth UID
  email: string
  displayName: string
  role: UserRole
  phone?: string
  photoURL?: string
  department?: string
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
  lastLogin?: Timestamp
  permissions?: string[]
}

// Configuración de la empresa
export interface CompanySettings {
  id: string
  companyName: string
  legalName?: string
  rfc?: string
  address?: Address
  phone: string
  email: string
  website?: string
  logo?: string
  taxRate: number // Tasa de impuesto por defecto
  currency: string // Moneda por defecto
  timezone: string
  language: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Configuración del sistema
export interface SystemSettings {
  id: string
  emailNotifications: boolean
  smsNotifications: boolean
  autoInvoicing: boolean
  invoicePrefix: string
  shipmentPrefix: string
  clientPrefix: string
  lowStockAlert: boolean
  maintenanceMode: boolean
  apiKeys?: {
    deepseek?: string
    mistral?: string
    twillio?: string
    sendgrid?: string
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}
