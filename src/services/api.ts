
import { supabase } from '@/integrations/supabase/client';

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
  price?: number;
  sport?: string;
  rarity?: string;
  description?: string;
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
    console.log('Fetching NFTs from Supabase...');
    const { data, error } = await supabase
      .from('nfts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message || 'Error al obtener NFTs');
    }
    
    console.log('NFTs fetched successfully:', data);
    return data || [];
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    throw error;
  }
};

// Obtener NFT por ID
export const getNFTById = async (id: string): Promise<NFT> => {
  try {
    console.log('Fetching NFT by ID:', id);
    const { data, error } = await supabase
      .from('nfts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message || 'NFT no encontrado');
    }
    
    console.log('NFT fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching NFT:', error);
    throw error;
  }
};

// Mintear NFT (actualizar NFT existente como minteado)
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
    console.log('Minting NFT:', nftData, 'for wallet:', walletAddress);
    
    // Buscar si ya existe un NFT con el mismo nombre
    const { data: existingNFT, error: searchError } = await supabase
      .from('nfts')
      .select('*')
      .eq('name', nftData.name)
      .single();

    if (searchError && searchError.code !== 'PGRST116') {
      throw new Error(searchError.message);
    }

    if (existingNFT) {
      // Actualizar NFT existente
      const { data, error } = await supabase
        .from('nfts')
        .update({
          is_minted: true,
          wallet_address: walletAddress,
          token_id: nftData.token_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingNFT.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      console.log('NFT minted successfully:', data);
      return data;
    } else {
      // Crear nuevo NFT ya minteado
      const { data, error } = await supabase
        .from('nfts')
        .insert([{
          ...nftData,
          wallet_address: walletAddress,
          is_minted: true,
          price: 0.1,
          sport: 'general',
          rarity: 'épico'
        }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      console.log('New NFT created and minted:', data);
      return data;
    }
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
    console.log('Creating NFT:', nftData, 'for wallet:', walletAddress);
    
    const { data, error } = await supabase
      .from('nfts')
      .insert([{
        name: nftData.name,
        athlete: nftData.athlete,
        ipfs_url: nftData.ipfs_url,
        sport: nftData.sport,
        rarity: nftData.rarity || 'épico',
        price: nftData.price ? parseFloat(nftData.price) : 0.1,
        description: nftData.description,
        wallet_address: walletAddress,
        is_minted: false
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message || 'Error al crear NFT');
    }

    console.log('NFT created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating NFT:', error);
    throw error;
  }
};

// Obtener NFTs por wallet address
export const getNFTsByWallet = async (walletAddress: string): Promise<NFT[]> => {
  try {
    console.log('Fetching NFTs for wallet:', walletAddress);
    
    const { data, error } = await supabase
      .from('nfts')
      .select('*')
      .eq('wallet_address', walletAddress)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message || 'Error al obtener NFTs');
    }

    console.log('Wallet NFTs fetched successfully:', data);
    return data || [];
  } catch (error) {
    console.error('Error fetching NFTs by wallet:', error);
    throw error;
  }
};
