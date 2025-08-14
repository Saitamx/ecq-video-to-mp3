# Despliegue en Vercel - Ecoquerai YouTube Video to MP3

## 🚀 Configuración para Vercel

Este proyecto está configurado específicamente para funcionar en Vercel con las siguientes optimizaciones:

### 📁 Estructura de Archivos para Vercel

```
ecq-video-to-mp3/
├── api/
│   ├── index.js          # Endpoint principal
│   ├── convert.js        # Endpoint de conversión
│   ├── info.js           # Información de la API
│   └── download/
│       └── [filename].js # Descarga de archivos
├── public/
│   ├── index.html        # Interfaz web
│   └── logo_ecoquerai.png
├── vercel.json           # Configuración de Vercel
└── package.json
```

### 🔧 Configuración Especial

#### 1. **Sin FFmpeg**
- La versión de Vercel descarga directamente el audio sin conversión
- Esto evita problemas de compatibilidad con FFmpeg en entornos serverless
- Los archivos se descargan en su formato original (m4a, webm, etc.)

#### 2. **Almacenamiento Temporal**
- Los archivos se guardan en `/tmp` (directorio temporal de Vercel)
- Los archivos se eliminan automáticamente después de un tiempo
- No hay persistencia de archivos

#### 3. **Límites de Vercel**
- **Tiempo máximo de ejecución:** 10 segundos (Hobby) / 60 segundos (Pro)
- **Tamaño máximo de archivo:** 50MB
- **Memoria:** 1024MB

### 📋 Pasos para Desplegar

1. **Instalar Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Iniciar sesión en Vercel:**
   ```bash
   vercel login
   ```

3. **Desplegar el proyecto:**
   ```bash
   vercel
   ```

4. **Para producción:**
   ```bash
   vercel --prod
   ```

### 🌐 URLs de la API

Una vez desplegado, tendrás acceso a:

- **Interfaz Web:** `https://tu-proyecto.vercel.app/`
- **API Info:** `https://tu-proyecto.vercel.app/api/info`
- **Convertir:** `POST https://tu-proyecto.vercel.app/api/convert`
- **Descargar:** `GET https://tu-proyecto.vercel.app/api/download/[filename]`

### 🔍 Ejemplo de Uso

```javascript
// Convertir video
const response = await fetch('https://tu-proyecto.vercel.app/api/convert', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://www.youtube.com/watch?v=hN5X4kGhAtU',
    quality: 'highestaudio'
  })
});

const data = await response.json();
console.log(data);
```

### ⚠️ Limitaciones

1. **Videos largos:** No se recomiendan videos de más de 10 minutos
2. **Archivos grandes:** Máximo 50MB por archivo
3. **Tiempo de procesamiento:** Máximo 10-60 segundos
4. **Almacenamiento:** Los archivos se eliminan automáticamente

### 🐛 Solución de Problemas

#### Error: "Unexpected token 'T'"
- **Causa:** Vercel está devolviendo HTML en lugar de JSON
- **Solución:** Asegúrate de usar las rutas `/api/` correctas

#### Error: "Function execution timeout"
- **Causa:** El video es muy largo o la conexión es lenta
- **Solución:** Usa videos más cortos o actualiza a Vercel Pro

#### Error: "File not found"
- **Causa:** El archivo se eliminó del almacenamiento temporal
- **Solución:** Descarga el archivo inmediatamente después de la conversión

### 📞 Soporte

Para problemas específicos de Vercel:
- **Documentación:** [vercel.com/docs](https://vercel.com/docs)
- **Comunidad:** [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

**Desarrollado por Matias Troncoso Campos - Ecoquerai Team** 🚀
