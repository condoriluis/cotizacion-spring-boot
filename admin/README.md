# 🚀 Quotation System Admin - Panel de Control

Bienvenido al sistema de gestión de cotizaciones más moderno y eficiente. Este panel administrativo ha sido diseñado para ofrecer una experiencia premium con un enfoque en analíticas, seguridad y facilidad de uso.

## ✨ Características Principales

- **📊 Dashboard Analítico**: Visualización de ingresos y demanda de productos mediante gráficos de área y barras dinámicos (Recharts).
- **📋 Gestión de Cotizaciones (CRUD)**: Creación, visualización, impresión y eliminación de cotizaciones en tiempo real.
- **📄 Generación de PDFs**: Motor integrado para crear documentos de cotización profesionales con un solo clic.
- **📦 Control de Inventario**: Descuento automático de stock al marcar cotizaciones como "Aceptadas".
- **🛡️ Seguridad Avanzada**: Protección de rutas, sistema de login con JWT y Auth Guard para navegación segura.
- **💅 Interfaz Premium**: Diseño moderno en color Verde Esmeralda (Emerald), totalmente responsivo y compatible con Modo Oscuro/Claro.
- **🔔 Notificaciones Elegantes**: Feedback instantáneo mediante el sistema de toasts de Sonner.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 16+ (App Router), TypeScript, Tailwind CSS.
- **Gráficos**: Recharts.
- **Iconografía**: Lucide React.
- **Comunicación**: Axios con interceptores de seguridad.
- **Estilos**: Framer Motion & Tailwind.

## 🚀 Instalación y Ejecución

1. **Configurar Variables de Entorno**:
   Crea un archivo `.env.local` en la raíz de la carpeta `admin/`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
   ```

2. **Instalar Dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar Servidor de Desarrollo**:
   ```bash
   npm run dev
   ```

4. **Acceder**:
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

- `src/app/dashboard`: Módulos principales (Clientes, Productos, Cotizaciones).
- `src/components`: Componentes reutilizables de UI y Layout.
- `src/services`: Configuración de la API y lógica de autenticación.

---
