# MuralPicta – Descripción general

**MuralPicta** es un servidor de presentaciones auto-alojado para paneles de pared, tabletas y pantallas. Funciona completamente en su red local — sin nube, sin suscripción, sin servicios externos. Una vez instalado, funciona completamente sin conexión (excepto la búsqueda opcional de nombres de lugares mediante GPS).

Caso de uso típico: una tableta o pantalla montada en la pared muestra un hermoso pase de diapositivas continuo de sus propias fotos y vídeos, directamente desde su NAS (Synology, QNAP, etc.) o cualquier carpeta de red compartida.

---

## Primeros pasos

1. **Fuente de medios** — configure dónde se almacenan sus fotos y vídeos (ruta NAS o carpeta compartida)
2. **Diaporama** — establezca los tiempos de visualización, el orden y el fundido
3. Abra el pase de diapositivas en **`http://<ip-de-su-servidor>:3000`** en cualquier navegador

Todo lo demás es opcional y puede ajustarse en cualquier momento.

---

## Resumen de configuración

### Fuente de medios
Define dónde MuralPicta busca imágenes y vídeos. Es la configuración más importante.

- **Ruta base de medios** — la ruta local a la carpeta (ej. `/mnt/nas/fotos` o un montaje Docker)
- **Fuentes admitidas:** unidades de red montadas (SMB/NAS), carpetas locales
- Un botón **Test** verifica la ruta e indica cuántos archivos se encontraron

→ *Ver la documentación "Fuentes de medios" para la configuración de NAS y Docker.*

---

### Pase de diapositivas
Controla el comportamiento principal del pase de diapositivas.

- **Tiempo de visualización por imagen** — cuántos segundos se muestra cada foto
- **Tiempo de visualización por vídeo** — cuántos segundos se reproduce cada vídeo
- **Orden** — aleatorio, por nombre o por fecha
- **Duración del fundido** — tiempo de transición entre diapositivas (segundos)
- **Intervalo de actualización** — con qué frecuencia se recarga la lista de archivos (minutos)

---

### Efecto Ken Burns
Añade una animación lenta de zoom y panorámica a las imágenes mientras se muestran.

- **Activar/Desactivar** — activar o desactivar el efecto
- **Factor de zoom** — nivel de zoom (ej. 1.3 = 30% de zoom)
- La dirección de la panorámica se elige aleatoriamente para un aspecto natural

---

### Superposición de información
Muestra información sobre la foto/vídeo actual encima de la imagen.

- **Activar/Desactivar** — activar o desactivar la superposición
- **Posición** — abajo-derecha, abajo-izquierda, arriba-derecha, arriba-izquierda
- **Plantilla Image Overlay** — plantilla HTML completamente personalizable; puede mostrar nombre de archivo, fecha, ubicación GPS, modelo de cámara, etc.
- **Obtener ubicación GPS** — resuelve coordenadas GPS de datos EXIF a nombre de lugar (OpenStreetMap / Nominatim)
- **Idioma de los nombres de lugar** — elegir el idioma para los nombres de lugar obtenidos del GPS (ej. español, inglés, alemán) — independiente del idioma de la interfaz de administración

→ *Ver la documentación "Overlay de imagen" para las variables disponibles y ejemplos.*

---

### Vídeo
Configuración específica para la reproducción de vídeo.

- **Volumen** — volumen de reproducción predeterminado (0 = silenciado, 1 = volumen completo)
- **Bucle** — si un vídeo se reinicia cuando termina

---

### Pantalla
Configuración visual del pase de diapositivas.

- **Ajuste de imagen** — `cover` (llena la pantalla, puede recortar), `contain` (imagen completa, puede tener bordes)
- **Mostrar barra de progreso** — fina línea de progreso en la parte inferior de la pantalla

---

### Filtros / Exclusiones
Define qué archivos y carpetas deben **excluirse** del pase de diapositivas.

- **Excluir archivos** — expresiones regulares para nombres de archivo
- **Excluir carpetas** — expresiones regulares para nombres de carpeta (ej. `^@` para ignorar carpetas de Synology)

→ *Ver la documentación "Filtros" para ejemplos de regex.*

---

### Depuración
Opciones de desarrollador — solo necesarias para solucionar problemas.

- **Modo depuración** — muestra una superposición con datos EXIF y detalles del archivo

---

### Seguridad / PIN
Protege la interfaz de administración con un código PIN.

- **Activar/Desactivar** la protección PIN
- Mínimo 4 caracteres, alfanumérico
- El pase de diapositivas (`/`) siempre es accesible sin PIN

→ *Ver la documentación "Restablecer PIN" si ha olvidado su PIN.*

---

### Sistema y estado
Muestra información del servidor y controles.

- **Versión** — versión actual de MuralPicta
- **Tiempo de actividad** — cuánto tiempo lleva en ejecución el servidor
- **Abrir pase de diapositivas** — abre el pase en una nueva pestaña
- **Ver registro** — muestra los errores recientes del servidor

---

## Control remoto via API

MuralPicta tiene una API HTTP integrada que le permite controlar el pase de diapositivas de forma remota — desde Home Assistant, un script o cualquier navegador.

Ejemplo: `http://<ip-del-servidor>:3000/api/command/pause`

→ *Ver la documentación "Referencia API" para todos los comandos disponibles.*
