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
import { Client, ClientFilters } from '@/types/crm'

const COLLECTION_NAME = 'clients'

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

// Generar ID personalizado para cliente
export function generateClientId(): string {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')
  return `CLT-${timestamp}${random}`
}

// Crear nuevo cliente
export async function createClient(
  clientData: Omit<Client, 'id' | 'clientId' | 'createdAt' | 'updatedAt'>
): Promise<Client> {
  try {
    const now = Timestamp.now()
    const clientId = generateClientId()

    const newClient: Omit<Client, 'id'> = {
      ...clientData,
      clientId,
      createdAt: now,
      updatedAt: now,
    }

    // Limpiar valores undefined antes de guardar en Firestore
    const cleanedClient = removeUndefined(newClient)

    const docRef = await addDoc(collection(db, COLLECTION_NAME), cleanedClient)

    return {
      id: docRef.id,
      ...newClient,
    }
  } catch (error) {
    console.error('Error creating client:', error)
    throw error
  }
}

// Obtener cliente por ID
export async function getClient(id: string): Promise<Client | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Client
    }

    return null
  } catch (error) {
    console.error('Error getting client:', error)
    throw error
  }
}

// Obtener todos los clientes con filtros
export async function getClients(
  filters?: ClientFilters,
  limitCount: number = 50
): Promise<Client[]> {
  try {
    const constraints: QueryConstraint[] = []

    if (filters?.type) {
      constraints.push(where('type', '==', filters.type))
    }

    if (filters?.isActive !== undefined) {
      constraints.push(where('isActive', '==', filters.isActive))
    }

    if (filters?.tags && filters.tags.length > 0) {
      constraints.push(where('tags', 'array-contains-any', filters.tags))
    }

    if (filters?.minShipments) {
      constraints.push(where('totalShipments', '>=', filters.minShipments))
    }

    if (filters?.minSpent) {
      constraints.push(where('totalSpent', '>=', filters.minSpent))
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
        }) as Client
    )
  } catch (error) {
    console.error('Error getting clients:', error)
    throw error
  }
}

// Actualizar cliente
export async function updateClient(
  id: string,
  updates: Partial<Omit<Client, 'id' | 'clientId' | 'createdAt'>>
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
    console.error('Error updating client:', error)
    throw error
  }
}

// Eliminar cliente (soft delete - marcar como inactivo)
export async function deleteClient(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, {
      isActive: false,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error deleting client:', error)
    throw error
  }
}

// Eliminar cliente permanentemente
export async function permanentDeleteClient(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error permanently deleting client:', error)
    throw error
  }
}

// Buscar clientes por nombre o email
export async function searchClients(searchTerm: string): Promise<Client[]> {
  try {
    // Nota: Firestore no tiene búsqueda full-text nativa
    // Esta es una búsqueda básica. Para búsqueda avanzada considerar Algolia o ElasticSearch
    const clients = await getClients({}, 100)

    const searchLower = searchTerm.toLowerCase()

    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.clientId.toLowerCase().includes(searchLower) ||
        (client.company && client.company.toLowerCase().includes(searchLower))
    )
  } catch (error) {
    console.error('Error searching clients:', error)
    throw error
  }
}

// Incrementar contador de envíos del cliente
export async function incrementClientShipments(
  clientId: string,
  amount: number
): Promise<void> {
  try {
    const client = await getClient(clientId)
    if (client) {
      await updateClient(clientId, {
        totalShipments: client.totalShipments + 1,
        totalSpent: client.totalSpent + amount,
        lastShipmentDate: Timestamp.now(),
      })
    }
  } catch (error) {
    console.error('Error incrementing client shipments:', error)
    throw error
  }
}
