
# SportBlocks MVP 🏆

Una plataforma revolucionaria de NFTs deportivos construida en Starknet. Colecciona, intercambia y posee momentos históricos del deporte mundial.

## 🚀 Características

- **NFTs Deportivos Únicos**: Momentos históricos de atletas legendarios
- **Blockchain Starknet**: Tecnología de vanguardia para transacciones seguras y eficientes
- **Interfaz Moderna**: Diseño elegante con tema oscuro y animaciones fluidas
- **Múltiples Deportes**: Fútbol, Basketball, Tennis, F1, Fútbol Americano y más
- **Sistema de Rareza**: Épico, Legendario y Mítico
- **Wallet Integration**: Compatible con ArgentX y Braavos

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Librería principal
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **TailwindCSS** - Estilos y diseño
- **React Router** - Navegación
- **Starknet.js** - Interacción con blockchain

### Backend
- **Node.js** - Runtime
- **Express** - Framework web
- **Supabase** - Base de datos y autenticación
- **CORS** - Configuración de CORS

## 📁 Estructura del Proyecto

```
sportblocks-mvp/
├── contracts/                 # Contratos Cairo (futuro)
├── frontend/                  # Aplicación React
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   │   ├── Navbar.tsx
│   │   │   └── ConnectWalletButton.tsx
│   │   ├── pages/           # Páginas principales
│   │   │   ├── Home.tsx
│   │   │   ├── Gallery.tsx
│   │   │   └── Mint.tsx
│   │   └── App.tsx          # Router principal
│   ├── index.html
│   ├── package.json
│   └── tailwind.config.ts
├── backend/                  # API Node.js
│   ├── src/
│   │   ├── index.js         # Servidor Express
│   │   └── supabase.js      # Configuración Supabase
│   ├── package.json
│   └── .env
└── README.md
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn
- Cuenta de Supabase (opcional para desarrollo inicial)

### Configuración del Frontend

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
# Crear archivo .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STARKNET_NETWORK=sepolia
```

3. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Configuración del Backend

1. **Navegar al directorio backend:**
```bash
cd backend
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
```bash
# Editar archivo .env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
PORT=3001
```

4. **Iniciar servidor:**
```bash
npm run server
```

El API estará disponible en `http://localhost:3001`

## 📋 Configuración de Supabase

### Crear tabla NFTs:

```sql
CREATE TABLE nfts (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  athlete VARCHAR(255) NOT NULL,
  sport VARCHAR(100) NOT NULL,
  rarity VARCHAR(50) DEFAULT 'épico',
  price DECIMAL(10,4) DEFAULT 0.1,
  description TEXT,
  ipfs_url VARCHAR(500),
  wallet_address VARCHAR(66),
  token_id VARCHAR(100),
  is_minted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX idx_nfts_sport ON nfts(sport);
CREATE INDEX idx_nfts_rarity ON nfts(rarity);
CREATE INDEX idx_nfts_athlete ON nfts(athlete);
```

## 🔗 Endpoints de la API

### Base URL: `http://localhost:3001`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/nfts` | Obtener todos los NFTs |
| GET | `/nfts/:id` | Obtener NFT por ID |
| POST | `/nfts` | Crear nuevo NFT |
| GET | `/nfts/sport/:sport` | NFTs por deporte |
| GET | `/nfts/rarity/:rarity` | NFTs por rareza |

### Ejemplo de NFT:

```json
{
  "id": 1,
  "name": "Gol Histórico - Final Mundial",
  "athlete": "Lionel Messi",
  "sport": "futbol",
  "rarity": "legendario",
  "price": "0.5",
  "description": "El gol que marcó la historia en la final del Mundial 2022",
  "ipfs_url": "ipfs://QmexampleMessi/messi.jpg",
  "created_at": "2024-01-15T10:00:00Z"
}
```

## 🎮 Funcionalidades Actuales

### ✅ Implementado
- [x] Diseño responsivo con tema oscuro
- [x] Navegación entre páginas (Home, Gallery, Mint)
- [x] Conexión de wallet (mock - ArgentX/Braavos)
- [x] Galería de NFTs con filtros por rareza
- [x] API RESTful con endpoints básicos
- [x] Mock data de NFTs deportivos
- [x] Formulario de creación de NFTs

### 🔄 En Desarrollo
- [ ] Integración real con Starknet.js
- [ ] Smart contracts en Cairo
- [ ] Upload de imágenes a IPFS
- [ ] Sistema de pagos y mint real
- [ ] Autenticación de usuarios

### 🎯 Próximas Funcionalidades
- [ ] Marketplace de NFTs
- [ ] Sistema de subastas
- [ ] Perfil de usuario
- [ ] Historial de transacciones
- [ ] Notificaciones en tiempo real

## 💻 Scripts Disponibles

### Frontend
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linting del código
```

### Backend
```bash
npm run server       # Servidor de desarrollo
npm start           # Servidor de producción
npm run dev         # Servidor con nodemon
```

## 🔧 Configuración de Wallet

### Testnet Sepolia
- **Red**: Starknet Sepolia Testnet
- **RPC**: `https://starknet-sepolia.public.blastapi.io`
- **Chain ID**: `0x534e5f5345504f4c4941`

### Wallets Compatibles
1. **ArgentX** - Wallet principal recomendada
2. **Braavos** - Wallet alternativa

## 🎨 Diseño y UX

- **Tema Oscuro**: Diseño moderno con gradientes
- **Animaciones**: Transiciones suaves y hover effects
- **Responsive**: Optimizado para mobile y desktop
- **Accesibilidad**: Contraste adecuado y navegación por teclado

## 🔒 Seguridad

- Variables de entorno para datos sensibles
- Validación de entrada en formularios
- Rate limiting en API endpoints
- CORS configurado correctamente

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid System**: Layout adaptable con CSS Grid y Flexbox

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Equipo

- **Frontend**: React + TypeScript + TailwindCSS
- **Backend**: Node.js + Express + Supabase
- **Blockchain**: Starknet + Cairo (próximamente)

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en Issues existentes
3. Crea un nuevo Issue con detalles
4. Únete a nuestro Discord (próximamente)

---

**SportBlocks** - Revolucionando los NFTs deportivos en Starknet 🚀
