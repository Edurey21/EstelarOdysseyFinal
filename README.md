# Estelar Odyssey

## Descripción

**Estelar Odyssey** es una plataforma de ciencia ficción interactiva donde los usuarios pueden crear, explorar y colaborar en historias épicas situadas en el vasto universo. Los usuarios pueden asumir roles personalizados y completar misiones en planetas fantásticos, uniendo sus esfuerzos con otros usuarios en una experiencia colaborativa.

## Características

- Creación de historias: Los usuarios pueden crear plantillas de historias con roles, misiones y planetas personalizados.
- Colaboración en historias: Los usuarios pueden unirse a historias existentes y colaborar con otros en misiones.
- Panel de administración: El administrador tiene acceso a un panel exclusivo para gestionar la plataforma.
- Explorar plantillas: Los usuarios pueden explorar plantillas de historias creadas por otros usuarios y unirse a ellas.
- Chat colaborativo: Los usuarios pueden comentar y chatear en las historias en tiempo real.
- Carrusel interactivo de imágenes: Un carrusel visual para mejorar la experiencia de navegación.
- Sistema de roles dinámico: Los usuarios pueden seleccionar roles personalizados en cada historia.
- Notificaciones dinámicas para los usuarios registrados.

## Tecnologías utilizadas

- **Frontend**: React
- **Backend**: Supabase (API REST y base de datos)
- **Routing**: React Router
- **Estilos**: CSS con enfoque en temas espaciales y de ciencia ficción
- **Autenticación**: Sistema de autenticación basado en Supabase
- **Base de Datos**: Supabase (PostgreSQL)
- **Iconos**: React Icons (FaRocket, FaStar, etc.)
  
## Requisitos del sistema

Antes de comenzar, asegúrate de tener las siguientes herramientas instaladas en tu sistema:

- **Node.js** (versión 14 o superior)
- **npm** (administrador de paquetes de Node.js)
- **Supabase** (configuración de proyecto)

## Instalación

### Clonar el repositorio

```bash
git clone https://github.com/Edurey21/EstelarOdysseyFinal.git
cd estelar-odyssey
```

## Instalación de dependencias

Asegúrate de estar en el directorio del proyecto, luego instala las dependencias necesarias ejecutando:

```bash
npm install
```

## Configuración de Supabase
1. Crea un proyecto en Supabase. 
2. Configura las variables de entorno necesarias para conectar con Supabase.
3. En el archivo supabaseClient.js, asegúrate de ingresar las credenciales correctas de Supabase:

```bash
const supabaseUrl = 'https://your-supabase-url';
const supabaseAnonKey = 'your-anon-key';
```

## Iniciar la aplicación
Una vez instaladas las dependencias y configurado Supabase, puedes iniciar la aplicación localmente con:

```bash
npm start
```

La aplicación estará disponible en http://localhost:3000.

## Uso
### Roles de usuario
- **Usuarios normales**:
  - Crear y explorar historias.
  - Colaborar con otros usuarios en misiones.
  - Comentar y participar en chats dentro de cada historia.
- **Administrador**:
  - Acceso exclusivo al panel de administración para gestionar las estadísticas de la plataforma.

## Funcionalidades clave
- **Crear Historia**: En el menú de navegación, selecciona "Nueva Historia" para crear una plantilla con un rol, misión y planeta de tu elección.
- **Explorar Plantillas**: En "Explorar Plantillas" puedes ver historias creadas por otros usuarios y unirte a ellas.
- **Participar en Colaboraciones**: Después de unirte a una historia, puedes participar comentando o interactuando con otros usuarios.

## Panel de administración
El administrador tiene acceso a un panel que permite ver estadísticas de la plataforma, como el número de usuarios registrados, historias creadas y colaboraciones realizadas.


## Contacto
Si tienes alguna duda o comentario, no dudes en contactarme a través de:

- Correo: avila.milanes.eduardo@gmail.com
- GitHub: Edurey21
