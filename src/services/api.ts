
const API_BASE_URL = 'http://localhost:3001';

// Tipos para las respuestas de la API
export interface NFT {
  id: string;
  name: string;
  athlete: string;
  ipfs_url?: string;
  wallet_address?: string;
  token_id?: string;
  is_minted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
  error?: string;
}

// Obtener todos los NFTs
export const getAllNFTs = async (): Promise<NFT[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/nfts`);
    const result: ApiResponse<NFT[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Error al obtener NFTs');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    throw error;
  }
};

// Obtener NFT por ID
export const getNFTById = async (id: string): Promise<NFT> => {
  try {
    const response = await fetch(`${API_BASE_URL}/nfts/${id}`);
    const result: ApiResponse<NFT> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'NFT no encontrado');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching NFT:', error);
    throw error;
  }
};

// Mintear NFT
export const mintNFT = async (
  nftData: {
    name: string;
    athlete: string;
    ipfs_url?: string;
    token_id?: string;
  },
  walletAddress: string
): Promise<NFT> => {
  try {
    const response = await fetch(`${API_BASE_URL}/mint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-wallet-address': walletAddress,
      },
      body: JSON.stringify(nftData),
    });
    
    const result: ApiResponse<NFT> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Error al mintear NFT');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw error;
  }
};

// Crear NFT (sin mintear)
export const createNFT = async (
  nftData: {
    name: string;
    athlete: string;
    ipfs_url?: string;
    sport: string;
    rarity?: string;
    price?: string;
    description?: string;
  },
  walletAddress: string
): Promise<NFT> => {
  try {
    const response = await fetch(`${API_BASE_URL}/nfts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-wallet-address': walletAddress,
      },
      body: JSON.stringify(nftData),
    });
    
    const result: ApiResponse<NFT> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Error al crear NFT');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error creating NFT:', error);
    throw error;
  }
};

// Obtener NFTs por wallet address
export const getNFTsByWallet = async (walletAddress: string): Promise<NFT[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/nfts/wallet/${walletAddress}`, {
      headers: {
        'x-wallet-address': walletAddress,
      },
    });
    
    const result: ApiResponse<NFT[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Error al obtener NFTs');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching NFTs by wallet:', error);
    throw error;
  }
};
