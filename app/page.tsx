'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Package,
  Truck,
  Search,
  Globe,
  MapPin,
  ArrowRight,
  Phone,
  Menu,
  X,
  Facebook,
  Instagram,
  Star
} from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [trackingId, setTrackingId] = useState("")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingId.trim()) {
      router.push(`/rastreo?id=${encodeURIComponent(trackingId.trim())}`)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-orange-100 selection:text-orange-900">
      {/* Navegación */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-2' : 'bg-transparent py-5 text-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo Oficial */}
            <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative w-12 h-12 overflow-hidden rounded-xl bg-white p-1 shadow-sm transition-transform group-hover:scale-105">
                <Image
                  src="/images/HoyMismo Logo.png"
                  alt="HoyMismo Logo"
                  width={100}
                  height={100}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className={`text-xl font-black tracking-tighter leading-none ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                  HoyMismo<span className="text-orange-600">.</span>
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${scrolled ? 'text-slate-500' : 'text-slate-400'}`}>
                  Paquetería
                </span>
              </div>
            </Link>

            {/* Links de Navegación */}
            <div className="hidden md:flex items-center space-x-10">
              <a href="#servicios" className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-orange-600 ${scrolled ? 'text-slate-600' : 'text-slate-200'}`}>Servicios</a>
              <Link href="/rastreo" className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-orange-600 ${scrolled ? 'text-slate-600' : 'text-slate-200'}`}>Rastreo</Link>
              <a href="#nosotros" className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-orange-600 ${scrolled ? 'text-slate-600' : 'text-slate-200'}`}>Nosotros</a>
              <a href="#contacto" className="bg-orange-600 text-white px-7 py-2.5 rounded-full font-black text-sm uppercase tracking-wider hover:bg-orange-700 transition-all hover:shadow-orange-500/20 shadow-lg transform hover:-translate-y-0.5">
                Contacto
              </a>
            </div>

            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu className={scrolled ? 'text-slate-900' : 'text-white'} />}
            </button>
          </div>
        </div>

        {/* Menú Móvil */}
        {isMenuOpen && (
          <div className="md:hidden bg-white text-slate-900 absolute top-full left-0 w-full border-t border-slate-100 shadow-2xl p-8 flex flex-col space-y-6 animate-in slide-in-from-top duration-300">
            <a href="#servicios" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Servicios</a>
            <Link href="/rastreo" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Rastreo</Link>
            <a href="#nosotros" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Nosotros</a>
            <Link href="/dashboard" className="bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg text-center">Acceder al Portal</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-slate-950">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2 rounded-full text-orange-400 text-xs font-black uppercase tracking-[0.2em]">
                <Globe className="w-4 h-4 animate-pulse" />
                <span>Houston • México • Centroamérica</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                Tu carga en las <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-red-600">
                  mejores manos.
                </span>
              </h1>

              <p className="text-slate-400 text-xl max-w-lg leading-relaxed font-medium">
                Logística internacional de alto nivel. Envíos seguros, rápidos y sin complicaciones desde el corazón de Texas hacia toda Latinoamérica.
              </p>

              {/* Widget de Rastreo */}
              <form onSubmit={handleTrack} className="relative group max-w-xl">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row">
                  <div className="flex-1 flex items-center px-5 py-4 md:py-0 border-b md:border-b-0 md:border-r border-slate-100">
                    <Search className="text-slate-400 mr-4 w-6 h-6" />
                    <input
                      type="text"
                      placeholder="Introduce tu No. de Guía..."
                      className="w-full focus:outline-none text-slate-800 font-bold placeholder:text-slate-300 placeholder:font-normal"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-orange-600 text-white px-10 py-5 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-300 m-1 flex items-center justify-center group/btn"
                  >
                    Rastrear
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>

              {/* Badges de Confianza */}
              <div className="flex items-center space-x-8 pt-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden">
                      <Image src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" width={40} height={40} />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-orange-600 flex items-center justify-center text-[10px] text-white font-bold">+10k</div>
                </div>
                <div className="h-10 w-px bg-slate-800"></div>
                <div className="flex flex-col">
                  <div className="flex text-orange-500 mb-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Calificación Clientes</span>
                </div>
              </div>
            </div>

            {/* Imagen Principal */}
            <div className="hidden lg:block relative">
               <div className="relative z-10 animate-float">
                  <div className="absolute -inset-4 bg-orange-600/20 blur-[100px] rounded-full"></div>
                  <div className="relative bg-slate-900 rounded-[3rem] p-4 border border-white/5 shadow-2xl overflow-hidden group">
                    <Image
                      src="/images/imagen 2.png"
                      alt="HoyMismo Envío"
                      width={600}
                      height={600}
                      className="w-full h-[600px] object-cover rounded-[2.5rem] brightness-90 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>

                    {/* Floating Info Card */}
                    <div className="absolute bottom-10 left-10 right-10 bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-3xl shadow-2xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-600/30">
                            <Truck className="text-white w-7 h-7" />
                          </div>
                          <div>
                            <p className="text-white font-black text-xl leading-tight">Envío Express</p>
                            <p className="text-slate-300 text-sm font-medium">Houston → México</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-orange-400 font-black text-2xl tracking-tighter">100%</p>
                          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Seguro Incluido</p>
                        </div>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Servicios */}
      <section id="servicios" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-24 items-end mb-24">
            <div>
              <h2 className="text-orange-600 font-black uppercase tracking-[0.3em] text-xs mb-6">Nuestra Ventaja</h2>
              <p className="text-5xl md:text-7xl font-black text-slate-950 tracking-tighter leading-none mb-8">
                Logística sin <br/> complicaciones.
              </p>
            </div>
            <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-md">
              Hemos diseñado un sistema eficiente donde tu única preocupación será qué enviar. Del resto nos encargamos nosotros.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Envíos Sin Límite",
                desc: "No importa el peso ni el tamaño, tenemos la solución logística para que todo llegue a su destino.",
                icon: Package,
                color: "text-blue-600",
                bg: "bg-blue-50"
              },
              {
                title: "Puerta a Puerta",
                desc: "Recogemos en tu ubicación en Houston y entregamos directamente en el domicilio final.",
                icon: MapPin,
                color: "text-orange-600",
                bg: "bg-orange-50"
              },
              {
                title: "Atención 24/7",
                desc: "Soporte personalizado por WhatsApp y rastreo continuo para tu total tranquilidad.",
                icon: Phone,
                color: "text-emerald-600",
                bg: "bg-emerald-50"
              }
            ].map((s, i) => (
              <div key={i} className="group p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                <div className={`w-16 h-16 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <s.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">{s.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                <div className="mt-8 flex items-center text-slate-900 font-black text-xs uppercase tracking-widest group-hover:text-orange-600 cursor-pointer">
                  Más información <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-16 mb-24">
            <div className="md:col-span-5 space-y-8">
              <div className="flex items-center space-x-4">
                <Image src="/images/HoyMismo Logo.png" alt="Logo" width={48} height={48} className="object-contain bg-white rounded-xl p-1" />
                <span className="text-3xl font-black text-white tracking-tighter">HoyMismo.</span>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                Conectando el corazón de Texas con Latinoamérica. Rapidez, seguridad y confianza en cada milla recorrida.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-orange-600 transition-all">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-orange-600 transition-all">
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="space-y-6">
                <h4 className="text-white font-black uppercase tracking-widest text-xs">Servicios</h4>
                <ul className="text-slate-500 space-y-4 font-bold text-sm">
                  <li><a href="#" className="hover:text-orange-600">Cajas Estándar</a></li>
                  <li><a href="#" className="hover:text-orange-600">Envíos Especiales</a></li>
                  <li><a href="#" className="hover:text-orange-600">Mudanzas</a></li>
                  <li><a href="#" className="hover:text-orange-600">Gestión Aduanal</a></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-white font-black uppercase tracking-widest text-xs">Soporte</h4>
                <ul className="text-slate-500 space-y-4 font-bold text-sm">
                  <li><a href="#" className="hover:text-orange-600">Preguntas Frecuentes</a></li>
                  <li><a href="#" className="hover:text-orange-600">Políticas</a></li>
                  <li><Link href="/rastreo" className="hover:text-orange-600">Rastreo</Link></li>
                  <li><Link href="/dashboard" className="hover:text-orange-600">Portal</Link></li>
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1 space-y-6">
                <h4 className="text-white font-black uppercase tracking-widest text-xs">Ubicación</h4>
                <p className="text-slate-500 font-bold text-sm leading-relaxed">
                  6540 Rupley Cir,<br/>
                  Houston, TX 77087<br/>
                  Estados Unidos
                </p>
              </div>
            </div>
          </div>

          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center space-x-2">
              <Image src="/images/HoyMismo Imagen Social.png" alt="Social" width={24} height={24} className="rounded-full grayscale opacity-50" />
              <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
                © 2025 HoyMismo Paquetería Internacional
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
