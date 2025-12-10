# 💰 White.Wallet - Sistema de Gestión de Ahorros

> Plataforma web moderna y segura para la gestión inteligente de ahorros personales con metas personalizables, seguimiento de transacciones en tiempo real y sistema multi-usuario.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características Principales](#-características-principales)
- [Tecnologías](#-tecnologías)
- [Funcionalidades Detalladas](#-funcionalidades-detalladas)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso del Sistema](#-uso-del-sistema)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Seguridad](#-seguridad)
- [API y Base de Datos](#-api-y-base-de-datos)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Descripción General

**White.Wallet** es una aplicación web progresiva (PWA-ready) diseñada para ayudar a personas y familias a gestionar sus ahorros de manera inteligente y organizada. El sistema permite crear múltiples usuarios, definir metas de ahorro personalizables, registrar transacciones detalladas y visualizar el progreso en tiempo real.

## Prueba la demo:
https://white-wallet.vercel.app/

### ¿Para quién es esta aplicación?

- 👨‍👩‍👧‍👦 **Familias** - Gestiona los ahorros de cada miembro de la familia
- 💼 **Profesionales** - Organiza ahorros para diferentes objetivos
- 🎓 **Estudiantes** - Controla tus finanzas y ahorra para metas específicas
- 🏢 **Pequeños grupos** - Comparte dispositivo para gestión colectiva

### Filosofía del Sistema

White.Wallet se enfoca en:
- **Simplicidad** - Interfaz intuitiva y fácil de usar
- **Seguridad** - Encriptación de PINs y protección de datos
- **Flexibilidad** - Múltiples métodos de ahorro adaptables
- **Transparencia** - Historial completo y auditable

---

## ✨ Características Principales

### 🔐 Sistema Multi-Usuario
- Creación de perfiles ilimitados en un solo dispositivo
- Cada usuario tiene su propio PIN de seguridad (4 dígitos)
- Acceso protegido a cada wallet personal
- Cards visuales con información de cada usuario

### 🎯 Gestión de Metas de Ahorro
- Crea metas ilimitadas con nombre y descripción
- Define montos objetivo personalizados
- Establece fechas límite (opcional)
- Agrega imágenes de motivación (URLs)
- 4 métodos de ahorro flexibles

### 💸 Sistema de Transacciones
- Registra **ingresos** a tus metas
- Realiza **retiros** controlados
- Documenta **gastos externos** sin afectar balance
- Añade notas descriptivas a cada movimiento
- Actualización automática de balances

### 📊 Dashboard Visual
- Resumen general con estadísticas clave
- Barras de progreso por meta
- Tarjetas visuales con imágenes
- Indicadores de estado (activa, completada, pausada)

### 📜 Historial Completo
- Registro detallado de todas las transacciones
- Filtrado por tipo de operación
- Resúmenes totales por categoría
- Fechas y notas de cada movimiento

### 🛡️ Seguridad Implementada
- PINs encriptados con bcrypt
- Sanitización de inputs (protección XSS)
- Validaciones robustas frontend + backend
- Logger seguro (no expone datos sensibles)
- Headers de seguridad en deployment

---

## 🚀 Tecnologías

### Frontend Stack

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18.3 | Biblioteca UI principal |
| **TypeScript** | 5.6 | Tipado estático y seguridad |
| **Vite** | 6.0 | Build tool ultra-rápido |
| **Tailwind CSS** | 3.4 | Estilos utility-first |
| **shadcn/ui** | latest | Componentes UI accesibles |
| **Radix UI** | latest | Primitivas UI sin estilos |
| **Lucide React** | latest | Iconos SVG optimizados |
| **DOMPurify** | 3.3 | Sanitización de inputs |

### Backend Stack

| Tecnología | Propósito |
|------------|-----------|
| **Supabase** | Backend as a Service |
| **PostgreSQL** | Base de datos relacional |
| **Row Level Security** | Políticas de acceso a datos |
| **Triggers** | Automatización de lógica |
| **RPC Functions** | Funciones personalizadas |
| **bcrypt** | Encriptación de PINs |

### DevOps & Tools

- **Git** - Control de versiones
- **npm** - Gestor de paquetes
- **ESLint** - Linting de código
- **PostCSS** - Procesamiento de CSS
- **Vercel** - Hosting y deployment

---

## 🎨 Funcionalidades Detalladas

### 1. Sistema de Usuarios

#### 1.1 Creación de Usuario

**Formulario de Registro:**
- **Email** - Validación de formato
- **Contraseña** - Requisitos de seguridad:
  - Mínimo 8 caracteres
  - Al menos 1 mayúscula
  - Al menos 1 minúscula
  - Al menos 1 número
  - Al menos 1 carácter especial
- **Nombre Completo** - 2-100 caracteres
- **Edad** - Entre 1 y 120 años
- **Descripción** - Opcional, máximo 500 caracteres
- **PIN de Transacciones** - 4 dígitos
  - No permite PINs débiles (0000, 1111, 1234, etc.)
  - Encriptado con bcrypt antes de guardar
- **Confirmación de PIN** - Debe coincidir

**Proceso de Creación:**
1. Validación de datos en frontend
2. Sanitización de inputs (prevención XSS)
3. Creación de cuenta en Supabase Auth
4. Creación automática de perfil vía trigger
5. Actualización de datos adicionales
6. Encriptación y guardado de PIN
7. Confirmación visual de éxito

#### 1.2 Visualización de Usuarios

**Card de Usuario Muestra:**
- Avatar (personalizable vía URL)
- Nombre completo
- Descripción breve
- **Total Ahorrado** - Suma de todas las metas
- Botón de acceso con ícono de candado

**Ordenamiento:**
- Por fecha de actualización (más reciente primero)
- Grid responsive (1-3 columnas según pantalla)

#### 1.3 Acceso al Wallet

**Verificación de PIN:**
- Modal centrado con diseño seguro
- Input de 4 dígitos con enmascaramiento
- Indicadores visuales de progreso (4 círculos)
- Validación en tiempo real
- Mensajes de error descriptivos
- Bloqueo temporal tras intentos fallidos (si RLS está configurado)

### 2. Gestión de Metas de Ahorro

#### 2.1 Creación de Metas

**Formulario Completo:**

**Información Básica:**
- **Título** - 3-100 caracteres, obligatorio
- **Monto Objetivo** - Valor positivo, máximo 999,999,999
- **URL de Imagen** - Opcional, debe ser http/https válido
- **Fecha Límite** - Opcional, selector de fecha

**Método de Ahorro:**

1. **Libre**
   - Sin restricciones
   - Aportas cuando quieras
   - No requiere monto fijo

2. **Semanal**
   - Define monto a ahorrar cada semana
   - Seguimiento de progreso semanal
   - Requiere monto fijo

3. **Mensual**
   - Define monto a ahorrar cada mes
   - Ideal para salarios mensuales
   - Requiere monto fijo

4. **Anual**
   - Define monto a ahorrar cada año
   - Para metas a largo plazo
   - Requiere monto fijo

**Validaciones:**
- Título único y descriptivo
- Monto objetivo realista
- URL de imagen válida (si se proporciona)
- Monto fijo requerido para métodos no libres
- Monto fijo no puede exceder el objetivo

#### 2.2 Visualización de Metas

**Dashboard de Metas:**

**Resumen General:**
- 💰 **Total Ahorrado** - Suma de todas las metas
- 🎯 **Metas Activas** - Cantidad en progreso
- 📊 **Total de Metas** - Todas las metas creadas

**Card de Meta Individual:**
- **Imagen de Meta** - Thumbnail visual (si hay URL)
- **Título** - Nombre de la meta
- **Progreso Visual**:
  - Barra de progreso con porcentaje
  - Color según progreso (rojo → amarillo → verde)
  - Animación suave
- **Montos**:
  - Actual / Objetivo
  - Formato de moneda ($ MXN)
- **Método de Ahorro** - Badge con ícono
- **Fecha Límite** - Si está configurada
- **Estado** - Activa, Completada, Pausada
- **Acciones**:
  - Botón "Agregar Ahorro"
  - Botón "Historial de Transacciones"

**Estados de Meta:**
- 🟢 **Activa** - En progreso, acepta transacciones
- ✅ **Completada** - Objetivo alcanzado
- ⏸️ **Pausada** - Temporalmente inactiva

#### 2.3 Progreso Automático

**Cálculo Inteligente:**
- Actualización en tiempo real
- Triggers de base de datos
- Sincronización automática
- Sin intervención manual

### 3. Sistema de Transacciones

#### 3.1 Tipos de Transacciones

**1. Ingreso 💰**
- **Propósito:** Añadir dinero a la meta
- **Efecto:** Incrementa current_amount
- **Validaciones:**
  - Monto positivo
  - No puede exceder límite (999,999,999)
- **Casos de uso:**
  - Aporte quincenal
  - Bonificación
  - Regalo en efectivo

**2. Retiro 💸**
- **Propósito:** Sacar dinero de la meta
- **Efecto:** Decrementa current_amount
- **Validaciones:**
  - Monto positivo
  - No puede exceder saldo actual
  - Verifica disponibilidad antes de procesar
- **Casos de uso:**
  - Compra del objetivo
  - Retiro parcial
  - Emergencia

**3. Gasto Externo 🛍️**
- **Propósito:** Registrar gasto sin afectar balance
- **Efecto:** Solo registro, no modifica current_amount
- **Validaciones:**
  - Monto positivo
  - Nota descriptiva recomendada
- **Casos de uso:**
  - Compra relacionada pero aparte
  - Gasto de mantenimiento
  - Tracking de gastos asociados

#### 3.2 Proceso de Transacción

**Flujo Completo:**

1. **Selección de Tipo**
   - 3 botones visualmente distintos
   - Colores según operación
   - Iconos descriptivos

2. **Captura de Datos**
   - **Monto** - Input numérico con 2 decimales
   - **Nota** - Textarea opcional (máx 500 caracteres)
   - Sanitización automática de inputs

3. **Vista Previa**
   - Muestra saldo actual
   - Calcula nuevo saldo (excepto gasto externo)
   - Indica si es válido el monto

4. **Confirmación**
   - Validación final
   - Guardado en base de datos
   - Trigger actualiza balance automáticamente
   - Confirmación visual

5. **Resultado**
   - Mensaje de éxito
   - Dashboard actualizado
   - Balance reflejado inmediatamente

#### 3.3 Restricciones de Seguridad

**Validaciones Frontend:**
- Montos solo positivos
- Retiros limitados al saldo actual
- Formato de moneda correcto
- Longitud de notas limitada

**Validaciones Backend (si se aplican scripts SQL):**
- Triggers que verifican:
  - Monto dentro de rangos permitidos
  - Saldo suficiente para retiros
  - Integridad referencial (goal_id, user_id)
- Prevención de SQL injection

### 4. Historial de Transacciones

#### 4.1 Visualización

**Modal de Historial:**

**Header:**
- Título de la meta
- Botón de cierre

**Resumen por Tipo:**
```
📈 Ingresos Totales:     $10,500.00
📉 Retiros Totales:      $2,300.00
🛍️ Gastos Externos:     $1,200.00
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Balance Neto:         $8,200.00
```

**Lista de Transacciones:**
- Ordenadas por fecha (más reciente primero)
- Cada transacción muestra:
  - **Ícono** - Según tipo (↑ ingreso, ↓ retiro, 🛍️ gasto)
  - **Tipo** - Badge con color distintivo
  - **Fecha** - Formato legible (ej: "3 dic 2025, 14:30")
  - **Nota** - Descripción (si existe)
  - **Monto** - Con formato de moneda

**Códigos de Color:**
- 🟢 Verde - Ingresos
- 🔴 Rojo - Retiros
- 🟠 Naranja - Gastos externos

#### 4.2 Funcionalidades

**Características:**
- Scroll infinito en lista larga
- Responsive en mobile y desktop
- Totales calculados en tiempo real
- Sin paginación (todas las transacciones visibles)

### 5. Perfil de Usuario

#### 5.1 Sección de Perfil

**Acceso:**
- Click en avatar del header
- Solo accesible con usuario activo

**Información Mostrada:**
- **Avatar** - Imagen de perfil (URL)
- **Nombre Completo**
- **Edad**
- **Descripción Personal**
- **Email** (solo lectura)

**Acciones:**
- **Editar Perfil** - Actualiza información
- **Cerrar Sesión** - Regresa al menú principal

#### 5.2 Edición de Perfil

**Campos Editables:**
- Nombre completo
- Edad
- Descripción
- Avatar URL

**Campos No Editables:**
- Email (vinculado a Supabase Auth)
- PIN (requiere proceso separado)

---

## 📥 Instalación

### Requisitos Previos

```bash
Node.js >= 18.0.0
npm >= 9.0.0 (o yarn >= 1.22.0)
Git
Cuenta en Supabase
```

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/white-wallet.git
cd white-wallet
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

Esto instalará:
- React y ReactDOM
- TypeScript
- Vite
- Supabase Client
- Tailwind CSS
- shadcn/ui components
- DOMPurify
- Lucide Icons
- Y todas las dependencias necesarias

### Paso 3: Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales
nano .env  # o usa tu editor favorito
```

**Contenido de .env:**
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

**⚠️ IMPORTANTE:**
- NUNCA subas el archivo `.env` al repositorio
- Ya está incluido en `.gitignore`
- Usa variables de entorno en Vercel para producción

### Paso 4: Configurar Base de Datos

1. **Crear proyecto en Supabase:**
   - Ve a [supabase.com](https://supabase.com)
   - Crea un nuevo proyecto
   - Espera a que se inicialice

2. **Ejecutar SQL Schema:**
   - Ve al SQL Editor de Supabase
   - Ejecuta los scripts en este orden:
     1. Creación de tablas (profiles, saving_goals, transactions)
     2. Funciones RPC (set_transaction_pin, verify_transaction_pin)
     3. Políticas RLS
     4. Triggers de actualización

> **Nota:** Los scripts SQL están disponibles localmente en `src/data/` para desarrollo, pero no se incluyen en el repositorio público.

### Paso 5: Iniciar Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## ⚙️ Configuración

### Estructura de .env

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Development settings
# VITE_DEV_MODE=true
```

### Obtener Credenciales de Supabase

1. **URL del Proyecto:**
   - Dashboard de Supabase
   - Settings → API
   - Copiar "Project URL"

2. **Anon Key:**
   - Misma sección API
   - Copiar "anon public" key

### Configuración de Tailwind

El proyecto ya viene configurado con:
- Colores personalizados
- Animaciones
- Dark mode ready
- Responsive breakpoints

**Archivo:** `tailwind.config.js`

### Configuración de TypeScript

**Archivo:** `tsconfig.json`

Configuración estricta:
- `strict: true`
- Path alias `@` → `./src`
- Target ES2020
- Module ESNext

---

## 🎮 Uso del Sistema

### Flujo Básico de Usuario

#### 1. Primera Vez

```
Página Principal (Sin usuarios)
    ↓
Botón "+" Flotante
    ↓
Formulario de Registro
    ↓
Ingresar datos + PIN
    ↓
Usuario creado → Card visible
```

#### 2. Acceso a Wallet

```
Click en Card de Usuario
    ↓
Modal de Verificación PIN
    ↓
Ingresar PIN de 4 dígitos
    ↓
Dashboard de Metas
```

#### 3. Crear Meta de Ahorro

```
Dashboard → Botón "Nueva Meta"
    ↓
Formulario de Meta
    ↓
Completar información
    ↓
Seleccionar método de ahorro
    ↓
Meta creada → Card visible
```

#### 4. Agregar Dinero

```
Click "Agregar Ahorro" en Meta
    ↓
Seleccionar tipo (Ingreso/Retiro/Gasto)
    ↓
Ingresar monto y nota
    ↓
Confirmar transacción
    ↓
Balance actualizado automáticamente
```

#### 5. Ver Historial

```
Click "Historial de Transacciones"
    ↓
Modal con todas las transacciones
    ↓
Ver resumen y detalles
```

### Ejemplos de Uso

#### Ejemplo 1: Ahorro para Vacaciones

```
Meta: "Vacaciones Cancún 2025"
Objetivo: $15,000
Método: Mensual ($1,250/mes)
Imagen: URL de playa
Deadline: 30/12/2025

Transacciones:
- Enero: +$1,250 (Ahorro mensual)
- Febrero: +$1,250 (Ahorro mensual)
- Marzo: +$1,250 (Ahorro mensual)
- Marzo: +$500 (Bono extra)
- Abril: -$200 (Retiro emergencia)
```

#### Ejemplo 2: Fondo de Emergencia

```
Meta: "Fondo de Emergencias"
Objetivo: $50,000
Método: Libre (sin monto fijo)
Sin imagen
Sin deadline

Transacciones:
- Cuando hay dinero extra
- Aportaciones variables
- Sin retiros (solo emergencias)
```

---

## 📁 Estructura del Proyecto

```
white-wallet/
│
├── public/                      # Archivos estáticos
│   └── (vacío por ahora)
│
├── src/
│   ├── components/              # Componentes React
│   │   ├── ui/                 # Componentes shadcn/ui
│   │   │   ├── avatar.tsx
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   └── textarea.tsx
│   │   │
│   │   ├── Header.tsx          # Header con logo y avatar
│   │   ├── EmptyState.tsx      # Estado vacío inicial
│   │   ├── FloatingAddButton.tsx # Botón "+" flotante
│   │   ├── UserCardList.tsx    # Lista de usuarios
│   │   ├── UserCard.tsx        # Card individual de usuario
│   │   ├── CreateUserDialog.tsx # Modal crear usuario
│   │   ├── PinVerificationDialog.tsx # Verificación PIN
│   │   ├── ProfileSection.tsx  # Sección de perfil
│   │   ├── WalletDashboard.tsx # Dashboard principal
│   │   ├── CreateGoalDialog.tsx # Modal crear meta
│   │   ├── AddTransactionDialog.tsx # Modal transacciones
│   │   └── TransactionHistoryDialog.tsx # Historial
│   │
│   ├── lib/                    # Utilidades
│   │   ├── supabase.ts        # Cliente Supabase
│   │   ├── utils.ts           # Helpers generales
│   │   ├── logger.ts          # Logger seguro
│   │   ├── sanitize.ts        # Sanitización inputs
│   │   └── validation.ts      # Validaciones
│   │
│   ├── types/                  # Tipos TypeScript
│   │   └── database.ts        # Tipos de BD
│   │
│   ├── App.tsx                 # Componente principal
│   ├── main.tsx                # Punto de entrada
│   ├── index.css               # Estilos globales
│   └── vite-env.d.ts          # Tipos de Vite
│
├── .env.example                # Plantilla de variables
├── .gitignore                  # Archivos ignorados
├── components.json             # Config shadcn/ui
├── index.html                  # HTML principal
├── package.json                # Dependencias
├── postcss.config.js           # Config PostCSS
├── README.md                   # Este archivo
├── tailwind.config.js          # Config Tailwind
├── tsconfig.json               # Config TypeScript
├── vercel.json                 # Config Vercel
└── vite.config.ts              # Config Vite
```

### Descripción de Componentes Clave

**App.tsx**
- Componente raíz
- Gestión de estado global
- Routing lógico (sin react-router)
- Control de sesión activa

**WalletDashboard.tsx**
- Dashboard principal después de PIN
- Grid de metas
- Resumen estadístico
- Acciones principales

**CreateUserDialog.tsx**
- Formulario completo de registro
- Validaciones en tiempo real
- Sanitización de inputs
- Encriptación de PIN

**AddTransactionDialog.tsx**
- Modal multi-propósito
- 3 tipos de transacciones
- Validación de saldos
- Preview de nuevo balance

---

## 🔒 Seguridad

### Medidas Implementadas

#### 1. Autenticación y Encriptación

**PINs Encriptados:**
```typescript
// Función en Supabase (PostgreSQL)
CREATE FUNCTION set_transaction_pin(pin_code TEXT, user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET transaction_pin = crypt(pin_code, gen_salt('bf'))
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

- Algoritmo: **bcrypt**
- Salt automático por PIN
- Verificación sin descifrar (hash comparison)
- Imposible recuperar PIN original

**Verificación Segura:**
```typescript
const { data } = await supabase.rpc('verify_transaction_pin', {
  input_pin: pin,
  user_id: userId
})
// Retorna true/false, nunca expone el hash
```

#### 2. Sanitización de Inputs (XSS Prevention)

**DOMPurify:**
```typescript
import { sanitize } from '@/lib/sanitize'

// Limpia TODO el HTML
const cleanName = sanitize.text(userInput)

// Valida URLs
const cleanUrl = sanitize.url(imageUrl)
```

**Aplicado en:**
- Nombres de usuario
- Descripciones
- Títulos de metas
- Notas de transacciones
- URLs de imágenes

#### 3. Validaciones Robustas

**Frontend:**
```typescript
import { validation } from '@/lib/validation'

// Contraseñas fuertes
validation.password(pwd)
// → Mín 8 chars, mayúscula, minúscula, número, especial

// PINs no secuenciales
validation.pin('1234')
// → Error: "PIN muy débil"

// URLs válidas
validation.url('javascript:alert()')
// → Error: "URL debe ser http/https"
```

**Backend (Triggers SQL):**
- Validación de rangos de montos
- Verificación de saldo antes de retiros
- Integridad referencial estricta
- Límites de longitud de campos

#### 4. Logger Seguro

**No Expone Datos en Producción:**
```typescript
import { logger } from '@/lib/logger'

// En desarrollo: muestra todo
logger.info('Usuario creado', { userId })

// En producción: solo mensaje
logger.sensitive('Verificando PIN')
// → Solo muestra: "Verificando PIN [DATOS SENSIBLES OCULTOS]"
```

#### 5. Row Level Security (RLS)

**Políticas en Supabase:**
```sql
-- Solo ver propias metas
CREATE POLICY "Ver propias metas"
ON saving_goals
FOR SELECT
USING (auth.uid() = user_id);

-- Solo crear propias metas
CREATE POLICY "Crear propias metas"
ON saving_goals
FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

#### 6. Headers de Seguridad (vercel.json)

```json
{
  "headers": [
    {
      "key": "X-Content-Type-Options",
      "value": "nosniff"
    },
    {
      "key": "X-Frame-Options",
      "value": "DENY"
    },
    {
      "key": "X-XSS-Protection",
      "value": "1; mode=block"
    },
    {
      "key": "Referrer-Policy",
      "value": "strict-origin-when-cross-origin"
    }
  ]
}
```

### Mejoras Adicionales Recomendadas

Para máxima seguridad (requieren scripts SQL adicionales):

1. **Rate Limiting de PINs**
   - Límite: 5 intentos cada 15 minutos
   - Bloqueo temporal automático
   - Prevención de fuerza bruta

2. **Auditoría de Acciones**
   - Tabla `audit_log`
   - Registro de todas las operaciones
   - IP address y timestamp

3. **2FA para Operaciones Críticas**
   - Email de confirmación para retiros grandes
   - Código temporal para cambios de PIN

---

## 🗄️ API y Base de Datos

### Esquema de Base de Datos

#### Tabla: `profiles`

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  age INTEGER CHECK (age BETWEEN 1 AND 120),
  avatar_url TEXT,
  description TEXT CHECK (LENGTH(description) <= 500),
  transaction_pin TEXT,  -- Hash bcrypt
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Relaciones:**
- `id` → Foreign Key a `auth.users` (Supabase Auth)
- Uno a muchos con `saving_goals`
- Uno a muchos con `transactions`

#### Tabla: `saving_goals`

```sql
CREATE TABLE saving_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (LENGTH(title) BETWEEN 3 AND 100),
  image_url TEXT,
  target_amount NUMERIC(12,2) CHECK (target_amount > 0),
  current_amount NUMERIC(12,2) DEFAULT 0,
  deadline DATE,
  method TEXT CHECK (method IN ('libre', 'semanal', 'mensual', 'anual')),
  fixed_amount NUMERIC(12,2),
  status TEXT CHECK (status IN ('activa', 'completada', 'pausada')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Relaciones:**
- `user_id` → Foreign Key a `profiles`
- Uno a muchos con `transactions`

**Índices:**
- `user_id` para consultas rápidas por usuario
- `status` para filtrar metas activas

#### Tabla: `transactions`

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES saving_goals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  type TEXT CHECK (type IN ('ingreso', 'retiro', 'gasto_externo')),
  note TEXT CHECK (LENGTH(note) <= 500),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Relaciones:**
- `goal_id` → Foreign Key a `saving_goals`
- `user_id` → Foreign Key a `profiles`

**Índices:**
- `goal_id` para historial por meta
- `user_id` para transacciones por usuario
- `created_at` para ordenamiento cronológico

### Triggers Automáticos

#### Actualización de Balance

```sql
CREATE OR REPLACE FUNCTION handle_balance_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'ingreso' THEN
    UPDATE saving_goals
    SET current_amount = current_amount + NEW.amount
    WHERE id = NEW.goal_id;
  ELSIF NEW.type = 'retiro' THEN
    UPDATE saving_goals
    SET current_amount = current_amount - NEW.amount
    WHERE id = NEW.goal_id;
  END IF;
  -- gasto_externo no afecta balance
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_balance_trigger
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION handle_balance_update();
```

### Funciones RPC

#### set_transaction_pin

```sql
CREATE FUNCTION set_transaction_pin(
  pin_code TEXT,
  user_id UUID DEFAULT NULL
) RETURNS VOID
```

**Parámetros:**
- `pin_code` - PIN en texto plano (4 dígitos)
- `user_id` - UUID del usuario (opcional)

**Funcionamiento:**
1. Genera salt único con bcrypt
2. Hashea el PIN
3. Actualiza el campo `transaction_pin`

#### verify_transaction_pin

```sql
CREATE FUNCTION verify_transaction_pin(
  input_pin TEXT,
  user_id UUID DEFAULT NULL
) RETURNS BOOLEAN
```

**Parámetros:**
- `input_pin` - PIN a verificar
- `user_id` - UUID del usuario (opcional)

**Retorno:**
- `true` - PIN correcto
- `false` - PIN incorrecto

### Consultas Comunes

#### Obtener todas las metas de un usuario

```typescript
const { data: goals } = await supabase
  .from('saving_goals')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

#### Obtener transacciones de una meta

```typescript
const { data: transactions } = await supabase
  .from('transactions')
  .select('*')
  .eq('goal_id', goalId)
  .order('created_at', { ascending: false })
```

#### Calcular total ahorrado de un usuario

```typescript
const { data: goals } = await supabase
  .from('saving_goals')
  .select('current_amount')
  .eq('user_id', userId)

const total = goals?.reduce((sum, goal) =>
  sum + goal.current_amount, 0
) || 0
```

---

## 🚀 Deployment

### Vercel (Recomendado)

#### Opción 1: Deploy desde GitHub

1. **Push a GitHub:**
```bash
git add .
git commit -m "Ready for production"
git push origin main
```

2. **Importar en Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Click "New Project"
   - Importa tu repositorio
   - Vercel detecta Vite automáticamente

3. **Configurar Variables:**
   - Agrega en Environment Variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Deploy:**
   - Click "Deploy"
   - Espera ~2 minutos
   - Tu app está en `https://white-wallet.vercel.app`

#### Opción 2: Deploy con CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Netlify

```bash
# Build
npm run build

# Deploy carpeta dist/
netlify deploy --prod --dir=dist
```

### Variables de Entorno en Producción

**⚠️ NUNCA incluyas credenciales en el código**

**En Vercel:**
1. Settings → Environment Variables
2. Agrega cada variable
3. Redeploy

**En Netlify:**
1. Site settings → Environment
2. Environment variables
3. New variable

---

## 🐛 Troubleshooting

### Problemas Comunes

#### 1. "Missing environment variables"

**Error:**
```
Error: Missing Supabase credentials
```

**Solución:**
```bash
# Verificar que .env existe
ls -la .env

# Verificar contenido
cat .env

# Debe tener:
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

# Si no existe, copiar desde ejemplo
cp .env.example .env
# Luego editar con tus credenciales
```

#### 2. "Failed to fetch" en Supabase

**Error:**
```
Error: Failed to fetch
```

**Posibles causas:**
- URL de Supabase incorrecta
- ANON_KEY incorrecta
- Proyecto de Supabase pausado
- RLS bloqueando consultas

**Solución:**
```typescript
// Verificar conexión
console.log('URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 20))

// Probar query simple
const { data, error } = await supabase.from('profiles').select('count')
console.log({ data, error })
```

#### 3. PIN no funciona

**Error:**
```
PIN incorrecto aunque sea el correcto
```

**Causa:** Función `verify_transaction_pin` no existe

**Solución:**
1. Ve a Supabase SQL Editor
2. Ejecuta script de funciones RPC
3. Verifica con:
```sql
SELECT * FROM pg_proc WHERE proname = 'verify_transaction_pin';
```

#### 4. Usuarios no aparecen

**Error:**
```
Lista de usuarios vacía
```

**Causa:** RLS bloqueando SELECT

**Solución:**
```sql
-- Verificar política
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Debe existir política permisiva para SELECT
CREATE POLICY "Ver todos los perfiles"
ON profiles FOR SELECT
USING (true);
```

#### 5. Build falla en producción

**Error:**
```
TypeScript error: TS6133
```

**Solución:**
```bash
# Verificar localmente
npm run build

# Si falla, revisar errores
# Variables no usadas, imports sin usar, etc.
```

#### 6. Balance no se actualiza

**Error:**
```
Transacción creada pero balance igual
```

**Causa:** Trigger no instalado

**Solución:**
```sql
-- Verificar trigger
SELECT * FROM pg_trigger WHERE tgname = 'update_balance_trigger';

-- Si no existe, crear función y trigger
-- (Ver sección de Triggers)
```

### Logs de Debugging

#### Habilitar modo verbose

```typescript
// src/lib/logger.ts
const isDev = true  // Forzar modo desarrollo

// Ahora verás todos los logs
```

#### Inspeccionar Base de Datos

```sql
-- Ver usuarios
SELECT id, full_name, age FROM profiles;

-- Ver metas
SELECT user_id, title, current_amount, target_amount FROM saving_goals;

-- Ver transacciones
SELECT goal_id, amount, type, created_at FROM transactions
ORDER BY created_at DESC LIMIT 10;

-- Ver total por usuario
SELECT
  p.full_name,
  SUM(sg.current_amount) as total_saved
FROM profiles p
LEFT JOIN saving_goals sg ON p.id = sg.user_id
GROUP BY p.id, p.full_name;
```

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor dev en http://localhost:5173
npm run dev -- --host    # Exponer en red local

# Producción
npm run build            # Build optimizado en /dist
npm run preview          # Preview del build (puerto 4173)

# Calidad de Código
npm run lint             # ESLint

# Utilidades
npm run type-check       # Verificar tipos TypeScript (si está configurado)
```

---

## 📄 Licencia

Este proyecto es de uso educativo y demostrativo.

---

## 👨‍💻 Créditos

**Desarrollado con:**
- ❤️ Pasión por la tecnología
- ☕ Mucho café
- 🎵 Buena música

**Tecnologías principales:**
- React + TypeScript
- Supabase
- Tailwind CSS
- shadcn/ui

---

## 📞 Soporte

Para preguntas, problemas o sugerencias:

- 📧 Email: alexismenadev09@gmail.com
- 🐛 Bugs: [GitHub Issues]
- 💡 Features: [GitHub Discussions]

---

## 🎉 ¡Gracias por usar White.Wallet!

Si este proyecto te fue útil, considera:
- ⭐ Darle una estrella en GitHub
- 🔄 Compartirlo con otros
- 🐛 Reportar bugs
- 💡 Sugerir mejoras

---

**Última actualización:** Diciembre 2025
**Versión:** 1.0.0
**Estado:** ✅ Producción Ready
