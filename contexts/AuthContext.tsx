'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUserByUid, createUser, updateLastLogin } from '@/lib/firestore/users'
import type { User, UserRole } from '@/types/crm'

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  hasPermission: (requiredRole: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const roleHierarchy: Record<UserRole, number> = {
  viewer: 1,
  operator: 2,
  manager: 3,
  admin: 4,
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser)

        // Buscar el usuario en Firestore
        let userData = await getUserByUid(firebaseUser.uid)

        // Si no existe, crear uno nuevo con rol de viewer por defecto
        if (!userData) {
          const newUser = await createUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Usuario',
            role: 'viewer', // Rol por defecto - admin debe cambiarlo
            photoURL: firebaseUser.photoURL || undefined,
            isActive: true,
          })
          userData = newUser
        } else {
          // Actualizar último login
          await updateLastLogin(userData.id)
        }

        // Verificar que el usuario esté activo
        if (!userData.isActive) {
          await firebaseSignOut(auth)
          setUser(null)
          setFirebaseUser(null)
          alert('Tu cuenta ha sido desactivada. Contacta al administrador.')
          setLoading(false)
          return
        }

        setUser(userData)
      } else {
        setUser(null)
        setFirebaseUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account',
      })
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      setFirebaseUser(null)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      throw error
    }
  }

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
  }

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    signInWithGoogle,
    signOut,
    hasPermission,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
