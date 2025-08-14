# Ecoquerai YouTube Video to MP3

Un servicio web para convertir videos de YouTube a formato MP3 usando Node.js, desarrollado por **Matias Troncoso Campos** del equipo **Ecoquerai**.

## 🚀 Características

- ✅ Conversión de videos de YouTube a MP3
- ✅ Interfaz web moderna y responsive
- ✅ Múltiples calidades de audio
- ✅ Limpieza automática de archivos antiguos
- ✅ API RESTful
- ✅ Soporte para CORS

## 📋 Requisitos Previos

### 1. Node.js
Asegúrate de tener Node.js instalado (versión 16 o superior):
```bash
node --version
```

### 2. FFmpeg
FFmpeg es necesario para la conversión de audio. Instálalo según tu sistema operativo:

#### Windows:
1. Descarga FFmpeg desde [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)
2. Extrae el archivo y añade la carpeta `bin` al PATH del sistema
3. Verifica la instalación:
```bash
ffmpeg -version
```

#### macOS (con Homebrew):
```bash
brew install ffmpeg
```

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install ffmpeg
```

## 🛠️ Instalación

1. **Clona o descarga el proyecto:**
```bash
cd ecq-video-to-mp3
```

2. **Instala las dependencias:**
```bash
npm install
```

3. **Inicia el servidor:**
```bash
npm start
```

Para desarrollo con recarga automática:
```bash
npm run dev
```

## 🌐 Uso

### Interfaz Web
Una vez iniciado el servidor, abre tu navegador en:
```
http://localhost:3000
```

### API REST

#### Convertir video a MP3
```bash
POST /convert
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "quality": "highestaudio"
}
```

**Parámetros:**
- `url` (requerido): URL del video de YouTube
- `quality` (opcional): Calidad de audio (`highestaudio` o `lowestaudio`)

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Video converted to MP3 successfully",
  "filename": "Video_Title_1234567890.mp3",
  "downloadUrl": "/downloads/Video_Title_1234567890.mp3",
  "videoTitle": "Video Title",
  "duration": 180
}
```

#### Descargar archivo
```bash
GET /downloads/{filename}
```

#### Limpiar archivos antiguos
```bash
POST /cleanup
```

## 📁 Estructura del Proyecto

```
ecq-video-to-mp3/
├── index.js              # Servidor principal
├── start.js              # Script de inicio
├── config.js             # Configuración
├── package.json          # Dependencias y scripts
├── README.md            # Documentación
├── AUTHOR.md            # Información del autor
├── CHANGELOG.md         # Historial de cambios
├── test.js              # Pruebas de componentes
├── test-api.js          # Pruebas de API
├── public/              # Archivos estáticos
│   └── index.html       # Interfaz web
├── downloads/           # Archivos MP3 convertidos
└── temp/               # Archivos temporales
```

## 🔧 Configuración

### Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
NODE_ENV=development
```

### Personalización
Puedes modificar las siguientes configuraciones en `index.js`:

- **Puerto del servidor:** Cambia `PORT` en la línea 8
- **Calidad de audio:** Modifica `audioBitrate` en la línea 58
- **Tiempo de limpieza:** Cambia `oneDay` en la línea 108

## 🚨 Limitaciones y Consideraciones

### Legales
- Este servicio es solo para uso personal y educativo
- Respeta los derechos de autor y términos de servicio de YouTube
- No uses para contenido protegido por derechos de autor

### Técnicas
- Los videos muy largos pueden tardar más en convertirse
- El tamaño del archivo dependerá de la calidad seleccionada
- Los archivos se eliminan automáticamente después de 24 horas

## 🐛 Solución de Problemas

### Error: "FFmpeg not found"
Asegúrate de que FFmpeg esté instalado y en el PATH del sistema.

### Error: "Invalid YouTube URL"
Verifica que la URL sea válida y accesible.

### Error: "Could not extract functions" o "Conversion failed"
- **Causa:** YouTube cambia frecuentemente su API
- **Solución:** El proyecto usa `@distube/ytdl-core` que se mantiene actualizado
- **Alternativa:** Si persiste, intenta con un video diferente o espera a que se actualice la librería

### Error: "Video unavailable" o "restricted"
- El video puede ser privado, restringido por edad o región
- Intenta con un video público diferente
- Verifica que el video no tenga restricciones geográficas

### Error: "Server error" o "500 Internal Server Error"
- Verifica que FFmpeg esté instalado correctamente
- Revisa los logs del servidor para más detalles
- Asegúrate de que tienes permisos de escritura en el directorio del proyecto

### Puerto ocupado
Cambia el puerto en la variable `PORT` o detén otros servicios que usen el puerto 3000.

### Error de Node.js version
El proyecto requiere Node.js 16+ pero `@distube/ytdl-core` requiere Node.js 20.18.1+. 
Si tienes problemas, actualiza Node.js a la versión más reciente.

## 📝 Logs

El servidor muestra logs detallados en la consola:
- Información del video que se está convirtiendo
- Progreso de la conversión
- Errores y advertencias
- Archivos eliminados durante la limpieza

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## ⚠️ Disclaimer

Este software se proporciona "tal como está" sin garantías. El uso de este software es responsabilidad del usuario. Asegúrate de cumplir con todas las leyes y términos de servicio aplicables.

---

**Desarrollado por Matias Troncoso Campos - Ecoquerai Team** 🚀
