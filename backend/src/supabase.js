
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

// Funciones de base de datos

// Obtener todos los NFTs
const getAllNFTs = async () => {
  try {
    const { data, error } = await supabase
      .from('nfts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching NFTs from Supabase:', error);
    throw error;
  }
};

// Obtener NFT por ID
const getNFTById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('nfts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching NFT by ID from Supabase:', error);
    throw error;
  }
};

// Crear nuevo NFT
const createNFT = async (nftData) => {
  try {
    const { data, error } = await supabase
      .from('nfts')
      .insert([nftData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating NFT in Supabase:', error);
    throw error;
  }
};

// Obtener NFTs por deporte
const getNFTsBySport = async (sport) => {
  try {
    const { data, error } = await supabase
      .from('nfts')
      .select('*')
      .eq('sport', sport)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching NFTs by sport from Supabase:', error);
    throw error;
  }
};

// Obtener NFTs por rareza
const getNFTsByRarity = async (rarity) => {
  try {
    const { data, error } = await supabase
      .from('nfts')
      .select('*')
      .eq('rarity', rarity)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching NFTs by rarity from Supabase:', error);
    throw error;
  }
};

// Actualizar NFT
const updateNFT = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('nfts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating NFT in Supabase:', error);
    throw error;
  }
};

// Eliminar NFT
const deleteNFT = async (id) => {
  try {
    const { error } = await supabase
      .from('nfts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting NFT from Supabase:', error);
    throw error;
  }
};

// Función para crear la tabla NFTs (ejecutar una vez)
const createNFTsTable = async () => {
  try {
    // Esta función se usará para crear la tabla en Supabase
    // SQL para crear la tabla:
    /*
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

    -- Índices para mejorar el rendimiento
    CREATE INDEX idx_nfts_sport ON nfts(sport);
    CREATE INDEX idx_nfts_rarity ON nfts(rarity);
    CREATE INDEX idx_nfts_athlete ON nfts(athlete);
    CREATE INDEX idx_nfts_wallet ON nfts(wallet_address);
    */
    
    console.log('Para crear la tabla NFTs, ejecuta el SQL proporcionado en Supabase Dashboard');
  } catch (error) {
    console.error('Error:', error);
  }
};

module.exports = {
  supabase,
  getAllNFTs,
  getNFTById,
  createNFT,
  getNFTsBySport,
  getNFTsByRarity,
  updateNFT,
  deleteNFT,
  createNFTsTable
};
