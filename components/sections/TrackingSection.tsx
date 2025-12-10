'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import { Search, Package, MapPin, Truck, CheckCircle2, Clock } from 'lucide-react'

export default function TrackingSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingData, setTrackingData] = useState<any>(null)

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()

    const mockData = {
      trackingNumber,
      status: 'en-transito',
      origin: 'Houston, TX',
      destination: 'Monterrey, Mexico',
      estimatedDelivery: '25 de Octubre, 2024',
      events: [
        {
          status: 'Recibido en origen',
          location: 'Houston, TX',
          date: '20 de Octubre, 2024',
          time: '10:30 AM',
          completed: true,
        },
        {
          status: 'En tránsito',
          location: 'Centro de distribución',
          date: '22 de Octubre, 2024',
          time: '2:15 PM',
          completed: true,
        },
        {
          status: 'En aduana',
          location: 'Laredo, TX',
          date: '23 de Octubre, 2024',
          time: '8:45 AM',
          completed: true,
        },
        {
          status: 'En camino a destino',
          location: 'En ruta',
          date: '24 de Octubre, 2024',
          time: '11:00 AM',
          completed: false,
        },
        {
          status: 'Entregado',
          location: 'Monterrey, Mexico',
          date: 'Pendiente',
          time: '',
          completed: false,
        },
      ],
    }

    setTrackingData(mockData)
  }

  return (
    <section id="rastreo" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />

      <div className="container-custom relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-full text-primary-400 text-sm font-semibold inline-block mb-6">
            Rastreo en Tiempo Real
          </span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            <span className="gradient-text">Control total.</span> Visibilidad en
            tiempo real.
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Nuestro sistema de rastreo en línea te da la certeza de saber dónde
            está tu envío en cada etapa del viaje. Sin sorpresas, solo
            información clara y al momento.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="card-gradient p-8 mb-12"
          >
            <form onSubmit={handleTrack} className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Ingresa tu número de rastreo"
                    className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">
                <Search className="w-5 h-5 mr-2" />
                Rastrear
              </button>
            </form>
          </motion.div>

          {/* Tracking Results */}
          {trackingData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Header Info */}
              <div className="card-gradient p-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">
                      Número de Rastreo
                    </p>
                    <p className="font-mono font-semibold text-white">
                      {trackingData.trackingNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Estado</p>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-primary-500" />
                      <p className="font-semibold text-primary-400">
                        EN TRÁNSITO
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">
                      Entrega Estimada
                    </p>
                    <p className="font-semibold text-white">
                      {trackingData.estimatedDelivery}
                    </p>
                  </div>
                </div>
              </div>

              {/* Route Map */}
              <div className="card-gradient p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                    <p className="font-semibold text-white">
                      {trackingData.origin}
                    </p>
                    <p className="text-xs text-slate-400">Origen</p>
                  </div>
                  <div className="flex-1 mx-8">
                    <div className="relative">
                      <div className="h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-slate-700 rounded-full" />
                      <Truck className="absolute top-1/2 left-3/4 transform -translate-y-1/2 -translate-x-1/2 w-6 h-6 text-primary-400" />
                    </div>
                  </div>
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="font-semibold text-white">
                      {trackingData.destination}
                    </p>
                    <p className="text-xs text-slate-400">Destino</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  {trackingData.events.map((event: any, index: number) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {event.completed ? (
                          <div className="w-10 h-10 rounded-full bg-primary-500/20 border-2 border-primary-500 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-primary-500" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-slate-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 pb-8 border-l-2 border-slate-700 pl-6 ml-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3
                              className={`font-semibold ${
                                event.completed
                                  ? 'text-white'
                                  : 'text-slate-400'
                              }`}
                            >
                              {event.status}
                            </h3>
                            <p className="text-sm text-slate-400">
                              {event.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-400">
                              {event.date}
                            </p>
                            {event.time && (
                              <p className="text-xs text-slate-500">
                                {event.time}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="card-gradient p-6 border-l-4 border-primary-500">
                <p className="text-slate-300 mb-4">
                  ¿Tienes preguntas sobre tu envío?
                </p>
                <button className="btn-secondary">
                  Contactar Soporte
                </button>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!trackingData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="text-center py-12"
            >
              <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">
                Ingresa tu número de rastreo para ver el estado de tu envío
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
