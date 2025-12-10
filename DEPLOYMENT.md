# Guía de Deployment - HoyMismo Paquetería

Esta guía te ayudará a desplegar la plataforma HoyMismo Paquetería en producción.

## Opciones de Deployment

### 1. Vercel (Recomendado)

Vercel es la opción más sencilla para proyectos Next.js.

#### Pasos:

1. **Crear cuenta en Vercel**
   - Visita [vercel.com](https://vercel.com)
   - Regístrate con tu cuenta de GitHub/GitLab/Bitbucket

2. **Conectar repositorio**
   - Click en "New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Next.js

3. **Configurar variables de entorno**
   En la sección "Environment Variables":
   ```
   DEEPSEEK_API_KEY=tu_api_key_deepseek
   MISTRAL_API_KEY=tu_api_key_mistral
   NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
   ```

4. **Deploy**
   - Click en "Deploy"
   - Vercel construirá y desplegará automáticamente
   - Cada push a la rama principal desplegará automáticamente

#### Comandos útiles:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy desde la terminal
vercel

# Deploy a producción
vercel --prod
```

---

### 2. Firebase Hosting

Firebase Hosting es ideal si planeas usar otros servicios de Firebase.

#### Pasos:

1. **Instalar Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login a Firebase**
   ```bash
   firebase login
   ```

3. **Inicializar Firebase**
   ```bash
   firebase init hosting
   ```

   Selecciona:
   - Use an existing project (o crea uno nuevo)
   - Public directory: `.next` (después de build)
   - Configure as single-page app: Yes
   - Set up automatic builds: No

4. **Configurar firebase.json**
   ```json
   {
     "hosting": {
       "public": "out",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

5. **Actualizar next.config.js**
   Agregar para exportación estática:
   ```javascript
   module.exports = {
     output: 'export',
     images: {
       unoptimized: true
     }
   }
   ```

6. **Build y Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

#### Variables de entorno en Firebase:

```bash
firebase functions:config:set \
  deepseek.apikey="tu_api_key" \
  mistral.apikey="tu_api_key"
```

---

### 3. Netlify

Otra excelente opción para hosting estático.

#### Pasos:

1. **Conectar repositorio en Netlify**
   - Visita [netlify.com](https://netlify.com)
   - New site from Git
   - Selecciona tu repositorio

2. **Configurar build settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Environment variables**
   Site settings → Build & deploy → Environment:
   ```
   DEEPSEEK_API_KEY=tu_key
   MISTRAL_API_KEY=tu_key
   NEXT_PUBLIC_APP_URL=https://tu-sitio.netlify.app
   ```

4. **Deploy**
   - Netlify desplegará automáticamente en cada push

---

## Configuración de Dominio Personalizado

### En Vercel:
1. Project Settings → Domains
2. Agregar dominio personalizado
3. Configurar DNS según instrucciones

### En Firebase:
1. Hosting → Add custom domain
2. Verificar propiedad del dominio
3. Configurar registros DNS

### En Netlify:
1. Domain settings → Add custom domain
2. Configurar DNS con los nameservers de Netlify

---

## Variables de Entorno Requeridas

Asegúrate de configurar estas variables en tu servicio de hosting:

```env
# APIs de IA
DEEPSEEK_API_KEY=sk-181034ba355c4292ad7f149d569ce4e7
MISTRAL_API_KEY=cqrcNINDiUWdfsRkUk9BBCq52XzphD1V

# App URL (cambiar según el dominio)
NEXT_PUBLIC_APP_URL=https://hoymismopaqueteria.com

# Firebase (opcional)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## Checklist Pre-Deployment

- [ ] Todas las dependencias instaladas (`npm install`)
- [ ] Build exitoso localmente (`npm run build`)
- [ ] Variables de entorno configuradas
- [ ] Imágenes y assets optimizados
- [ ] Meta tags y SEO configurados
- [ ] Favicon y social images en /public
- [ ] Links de navegación funcionando
- [ ] Formularios validados
- [ ] Responsive design verificado
- [ ] Performance testing (Lighthouse)

---

## Post-Deployment

### 1. Verificar funcionamiento
- [ ] Homepage carga correctamente
- [ ] Portal de clientes accesible
- [ ] Dashboard principal funciona
- [ ] Formularios envían correctamente
- [ ] Rastreo de paquetes funciona
- [ ] Asistente de IA responde

### 2. Configurar Analytics
- Google Analytics
- Plausible (alternativa privada)
- Microsoft Clarity (heatmaps)

### 3. SEO
- Verificar en Google Search Console
- Enviar sitemap
- Configurar robots.txt

### 4. Monitoreo
- Configurar alertas de uptime
- Monitorear errores con Sentry
- Revisar métricas de performance

---

## Troubleshooting

### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error de build en producción
```bash
npm run build
# Revisar errores de TypeScript o imports
```

### Imágenes no cargan
- Verificar que estén en /public
- Revisar next.config.js domains
- Verificar rutas (case-sensitive en producción)

### Variables de entorno no funcionan
- Verificar que comiencen con NEXT_PUBLIC_ para uso en cliente
- Reconstruir después de cambiar variables
- Verificar sintaxis (sin espacios ni comillas extras)

---

## Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Iniciar servidor de producción localmente
npm start

# Linting
npm run lint

# Limpiar cache de Next.js
rm -rf .next

# Ver tamaño del bundle
npm run build --analyze
```

---

## Soporte

Para problemas o preguntas:
- Email: soporte@hoymismopaqueteria.com
- Tel: +1 346-580-1238

---

**Última actualización:** Diciembre 2024
