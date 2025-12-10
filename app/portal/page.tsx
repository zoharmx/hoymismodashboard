'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock, Eye, EyeOff, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'

type LoginFormData = {
  email: string
  password: string
}

export default function PortalLogin() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log('Login:', data)
    router.push('/portal/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary-500/20 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center space-x-2 mb-6">
                <Image
                  src="/HoyMismo Logo.png"
                  alt="HoyMismo Logo"
                  width={60}
                  height={60}
                />
                <div className="text-left">
                  <span className="font-display font-bold text-2xl gradient-text">
                    HoyMismo
                  </span>
                  <p className="text-xs text-slate-400">Paquetería</p>
                </div>
              </Link>
              <h1 className="text-3xl font-bold text-white mb-2">
                Portal de Clientes
              </h1>
              <p className="text-slate-400">
                Ingresa para rastrear tus envíos y más
              </p>
            </div>

            {/* Login Form */}
            <div className="card-gradient p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      {...register('email', {
                        required: 'El correo es requerido',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Correo inválido',
                        },
                      })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', {
                        required: 'La contraseña es requerida',
                        minLength: {
                          value: 6,
                          message: 'Mínimo 6 caracteres',
                        },
                      })}
                      className="w-full pl-10 pr-12 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-400">Recordarme</span>
                  </label>
                  <a
                    href="#"
                    className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full group"
                >
                  {isLoading ? (
                    <span>Iniciando sesión...</span>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Iniciar Sesión
                    </>
                  )}
                </button>
              </form>

              {/* Register Link */}
              <div className="mt-6 text-center">
                <p className="text-slate-400 text-sm">
                  ¿No tienes una cuenta?{' '}
                  <a
                    href="#"
                    className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
                  >
                    Regístrate aquí
                  </a>
                </p>
              </div>
            </div>

            {/* Quick Track */}
            <div className="mt-6 text-center">
              <Link
                href="/#rastreo"
                className="inline-flex items-center text-slate-400 hover:text-white transition-colors"
              >
                <Package className="w-4 h-4 mr-2" />
                <span className="text-sm">Rastrear paquete sin cuenta</span>
              </Link>
            </div>

            {/* Back to Home */}
            <div className="mt-8 text-center">
              <Link
                href="/"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                ← Volver al inicio
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
