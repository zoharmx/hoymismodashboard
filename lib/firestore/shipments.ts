import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore'
import { db } from '../firebase'
import { Shipment, ShipmentFilters, ShipmentStatus, TrackingEvent } from '@/types/crm'
import { incrementClientShipments } from './clients'

const COLLECTION_NAME = 'shipments'

// Helper: Eliminar valores undefined de un objeto
function removeUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleaned: any = {}
  for (const key in obj) {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key]
    }
  }
  return cleaned
}

// Generar ID personalizado para envío
export function generateShipmentId(): string {
  const year = new Date().getFullYear()
  const timestamp = Date.now().toString().slice(-5)
  const random = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, '0')
  return `HM-${year}-${timestamp}${random}`
}

// Crear nuevo envío
export async function createShipment(
  shipmentData: Omit<
    Shipment,
    'id' | 'shipmentId' | 'createdAt' | 'updatedAt' | 'trackingHistory'
  >
): Promise<Shipment> {
  try {
    const now = Timestamp.now()
    const shipmentId = generateShipmentId()

    // Crear evento inicial de tracking
    const initialEvent: TrackingEvent = {
      date: now,
      status: shipmentData.status,
      location: shipmentData.origin.city,
      description: 'Envío registrado en el sistema',
    }

    const newShipment: Omit<Shipment, 'id'> = {
      ...shipmentData,
      shipmentId,
      createdAt: now,
      updatedAt: now,
      trackingHistory: [initialEvent],
    }

    // Limpiar valores undefined antes de guardar en Firestore
    const cleanedShipment = removeUndefined(newShipment)

    const docRef = await addDoc(collection(db, COLLECTION_NAME), cleanedShipment)

    // Actualizar contador del cliente
    await incrementClientShipments(shipmentData.clientId, shipmentData.totalCost)

    return {
      id: docRef.id,
      ...newShipment,
    }
  } catch (error) {
    console.error('Error creating shipment:', error)
    throw error
  }
}

// Obtener envío por ID
export async function getShipment(id: string): Promise<Shipment | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Shipment
    }

    return null
  } catch (error) {
    console.error('Error getting shipment:', error)
    throw error
  }
}

// Obtener envíos con filtros
export async function getShipments(
  filters?: ShipmentFilters,
  limitCount: number = 50
): Promise<Shipment[]> {
  try {
    const constraints: QueryConstraint[] = []

    if (filters?.status && filters.status.length > 0) {
      constraints.push(where('status', 'in', filters.status))
    }

    if (filters?.clientId) {
      constraints.push(where('clientId', '==', filters.clientId))
    }

    if (filters?.startDate) {
      constraints.push(
        where('createdAt', '>=', Timestamp.fromDate(filters.startDate))
      )
    }

    if (filters?.endDate) {
      constraints.push(
        where('createdAt', '<=', Timestamp.fromDate(filters.endDate))
      )
    }

    if (filters?.minValue) {
      constraints.push(where('totalCost', '>=', filters.minValue))
    }

    if (filters?.maxValue) {
      constraints.push(where('totalCost', '<=', filters.maxValue))
    }

    constraints.push(orderBy('createdAt', 'desc'))
    constraints.push(limit(limitCount))

    const q = query(collection(db, COLLECTION_NAME), ...constraints)
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Shipment
    )
  } catch (error) {
    console.error('Error getting shipments:', error)
    throw error
  }
}

// Actualizar envío
export async function updateShipment(
  id: string,
  updates: Partial<Omit<Shipment, 'id' | 'shipmentId' | 'createdAt'>>
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    }
    // Limpiar valores undefined antes de actualizar
    const cleanedData = removeUndefined(updateData)
    await updateDoc(docRef, cleanedData)
  } catch (error) {
    console.error('Error updating shipment:', error)
    throw error
  }
}

// Actualizar estado del envío y agregar evento de tracking
export async function updateShipmentStatus(
  id: string,
  status: ShipmentStatus,
  location: string,
  description: string,
  updatedBy?: string
): Promise<void> {
  try {
    const shipment = await getShipment(id)
    if (!shipment) {
      throw new Error('Shipment not found')
    }

    const newEvent: TrackingEvent = {
      date: Timestamp.now(),
      status,
      location,
      description,
      updatedBy,
    }

    const updatedHistory = [...(shipment.trackingHistory || []), newEvent]

    const updates: Partial<Shipment> = {
      status,
      trackingHistory: updatedHistory,
      updatedAt: Timestamp.now(),
    }

    // Si se entregó, guardar fecha de entrega
    if (status === 'entregado') {
      updates.actualDelivery = Timestamp.now()
    }

    await updateShipment(id, updates)
  } catch (error) {
    console.error('Error updating shipment status:', error)
    throw error
  }
}

// Eliminar envío
export async function deleteShipment(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting shipment:', error)
    throw error
  }
}

// Buscar envíos por tracking number o ID
export async function searchShipments(searchTerm: string): Promise<Shipment[]> {
  try {
    const shipments = await getShipments({}, 100)

    const searchLower = searchTerm.toLowerCase()

    return shipments.filter(
      (shipment) =>
        shipment.shipmentId.toLowerCase().includes(searchLower) ||
        shipment.trackingNumber?.toLowerCase().includes(searchLower) ||
        shipment.clientName.toLowerCase().includes(searchLower)
    )
  } catch (error) {
    console.error('Error searching shipments:', error)
    throw error
  }
}

// Obtener envíos recientes
export async function getRecentShipments(count: number = 10): Promise<Shipment[]> {
  try {
    return await getShipments({}, count)
  } catch (error) {
    console.error('Error getting recent shipments:', error)
    throw error
  }
}

// Obtener envíos por cliente
export async function getClientShipments(clientId: string): Promise<Shipment[]> {
  try {
    return await getShipments({ clientId }, 100)
  } catch (error) {
    console.error('Error getting client shipments:', error)
    throw error
  }
}

// Obtener estadísticas de envíos
export async function getShipmentStats() {
  try {
    const allShipments = await getShipments({}, 1000)

    const stats = {
      total: allShipments.length,
      pending: allShipments.filter((s) => s.status === 'pendiente').length,
      inTransit: allShipments.filter(
        (s) => s.status === 'en-transito' || s.status === 'en-distribucion'
      ).length,
      delivered: allShipments.filter((s) => s.status === 'entregado').length,
      totalValue: allShipments.reduce((sum, s) => sum + s.totalCost, 0),
    }

    return stats
  } catch (error) {
    console.error('Error getting shipment stats:', error)
    throw error
  }
}
