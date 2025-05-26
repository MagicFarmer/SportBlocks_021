
use starknet::{ContractAddress, contract_address_const};

// Direcciones ejemplo para testnet Sepolia
const OWNER_ADDRESS: felt252 = 0x1234567890abcdef1234567890abcdef12345678;
const ATLETA_ADDRESS: felt252 = 0x2345678901bcdef12345678901bcdef123456789;
const PROYECTO_SOCIAL_ADDRESS: felt252 = 0x3456789012cdef123456789012cdef12345678a;
const PLATAFORMA_ADDRESS: felt252 = 0x456789013def123456789013def123456789ab;

fn main() {
    println!("Desplegando SportBlocks NFT Contract...");
    println!("Owner: {}", OWNER_ADDRESS);
    println!("Atleta: {}", ATLETA_ADDRESS);
    println!("Proyecto Social: {}", PROYECTO_SOCIAL_ADDRESS);
    println!("Plataforma: {}", PLATAFORMA_ADDRESS);
    
    // Comando para desplegar:
    // starknet deploy --contract target/dev/sportblocks_nft_SportBlocksNFT.sierra.json \
    //   --constructor-calldata OWNER_ADDRESS "SportBlocks NFT" "SPORT" "https://api.sportblocks.com/metadata/" ATLETA_ADDRESS PROYECTO_SOCIAL_ADDRESS PLATAFORMA_ADDRESS \
    //   --network alpha-sepolia
}
