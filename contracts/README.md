
# SportBlocks NFT Contract

Contrato Cairo 1.0 para la plataforma SportBlocks en StarkNet Testnet (Sepolia).

## Características

- **NFT Minting**: Función `mint_nft()` para crear NFTs únicos con metadata
- **Distribución de Ingresos**: Función `distribuir_ingresos()` que divide automáticamente:
  - 40% al atleta
  - 30% al proyecto social
  - 20% a la plataforma
  - 10% al fan
- **Mapeo de NFTs**: Almacena relación `id_nft -> (owner, metadata_url)`
- **OpenZeppelin**: Usa las librerías estándar de NFT de OpenZeppelin para Cairo

## Instalación

```bash
# Instalar Scarb (Cairo package manager)
curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh

# Navegar al directorio de contratos
cd contracts

# Compilar el contrato
scarb build
```

## Compilación

```bash
# Compilar contrato
scarb build

# Los archivos compilados estarán en target/dev/
```

## Despliegue

```bash
# Configurar StarkNet CLI
export STARKNET_NETWORK=alpha-sepolia

# Desplegar contrato
starknet deploy \
  --contract target/dev/sportblocks_nft_SportBlocksNFT.sierra.json \
  --constructor-calldata \
    0x1234567890abcdef1234567890abcdef12345678 \
    "SportBlocks NFT" \
    "SPORT" \
    "https://api.sportblocks.com/metadata/" \
    0x2345678901bcdef12345678901bcdef123456789 \
    0x3456789012cdef123456789012cdef12345678a \
    0x456789013def123456789013def123456789ab \
  --network alpha-sepolia
```

## Funciones Principales

### `mint_nft(recipient, metadata_url)`
- Crea un nuevo NFT único
- Solo el owner puede llamar esta función
- Retorna el ID del token creado

### `distribuir_ingresos()`
- Distribuye el balance del contrato según los porcentajes establecidos
- Solo el owner puede llamar esta función
- Emite evento con los montos distribuidos

### Funciones de Consulta
- `get_nft_owner(token_id)`: Obtiene el propietario de un NFT
- `get_nft_metadata(token_id)`: Obtiene la URL de metadata de un NFT
- `get_total_supply()`: Obtiene el número total de NFTs creados
- `get_contract_balance()`: Obtiene el balance actual del contrato

## Eventos

- `NFTMinted`: Se emite cuando se crea un nuevo NFT
- `IngresosDistribuidos`: Se emite cuando se distribuyen los ingresos

## Seguridad

- Usa el patrón Ownable de OpenZeppelin
- Solo el owner puede mintear NFTs y distribuir ingresos
- Las transferencias de fondos usan funciones seguras de StarkNet

## Testing

```bash
# Ejecutar tests (cuando se implementen)
scarb test
```
