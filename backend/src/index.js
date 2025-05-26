
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://jgjfowqydeivwhhviwok.supabase.co',
  process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnamZvd3F5ZGVpdndoaHZpd29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyMjQ2MTksImV4cCI6MjA2MzgwMDYxOX0.AAaFYorcsWSLpo8T9qxtwjLJGJhcG-iQjmYYK594j6c'
);

// Middleware de autenticación con wallet address
const walletAuth = (req, res, next) => {
  const walletAddress = req.headers['x-wallet-address'];
  
  if (!walletAddress || walletAddress.length < 10) {
    return res.status(401).json({
      success: false,
      error: 'Wallet address requerida en header x-wallet-address'
    });
  }
  
  req.walletAddress = walletAddress;
  next();
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SportBlocks API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Get all NFTs - endpoint público
app.get('/nfts', async (req, res) => {
  try {
    console.log('Fetching NFTs from Supabase...');
    
    const { data, error } = await supabase
      .from('nfts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching NFTs:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener NFTs'
      });
    }
    
    res.json({
      success: true,
      data: data || [],
      count: data ? data.length : 0
    });
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Get NFT by ID
app.get('/nfts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('nfts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      return res.status(404).json({
        success: false,
        error: 'NFT no encontrado'
      });
    }
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching NFT:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Mint NFT - requiere autenticación con wallet
app.post('/mint', walletAuth, async (req, res) => {
  try {
    const { name, athlete, ipfs_url, token_id } = req.body;
    const walletAddress = req.walletAddress;
    
    // Validación básica
    if (!name || !athlete) {
      return res.status(400).json({
        success: false,
        error: 'Campos obligatorios: name, athlete'
      });
    }
    
    const nftData = {
      name,
      athlete,
      ipfs_url: ipfs_url || null,
      wallet_address: walletAddress,
      token_id: token_id || null,
      is_minted: true
    };
    
    const { data, error } = await supabase
      .from('nfts')
      .insert([nftData])
      .select()
      .single();
    
    if (error) {
      console.error('Error minting NFT:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al mintear NFT'
      });
    }
    
    console.log('NFT minteado:', data);
    
    res.status(201).json({
      success: true,
      data,
      message: 'NFT minteado exitosamente'
    });
  } catch (error) {
    console.error('Error minting NFT:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Create NFT (sin mintear) - requiere autenticación con wallet
app.post('/nfts', walletAuth, async (req, res) => {
  try {
    const { name, athlete, ipfs_url, sport, rarity, price, description } = req.body;
    const walletAddress = req.walletAddress;
    
    // Validación básica
    if (!name || !athlete || !sport) {
      return res.status(400).json({
        success: false,
        error: 'Campos obligatorios: name, athlete, sport'
      });
    }
    
    const nftData = {
      name,
      athlete,
      ipfs_url: ipfs_url || null,
      wallet_address: walletAddress,
      is_minted: false
    };
    
    const { data, error } = await supabase
      .from('nfts')
      .insert([nftData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating NFT:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al crear NFT'
      });
    }
    
    console.log('NFT creado:', data);
    
    res.status(201).json({
      success: true,
      data,
      message: 'NFT creado exitosamente'
    });
  } catch (error) {
    console.error('Error creating NFT:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Get NFTs by wallet address - requiere autenticación
app.get('/nfts/wallet/:address', walletAuth, async (req, res) => {
  try {
    const { address } = req.params;
    
    // Solo permitir que vean sus propios NFTs
    if (address !== req.walletAddress) {
      return res.status(403).json({
        success: false,
        error: 'No autorizado para ver NFTs de otra wallet'
      });
    }
    
    const { data, error } = await supabase
      .from('nfts')
      .select('*')
      .eq('wallet_address', address)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching NFTs by wallet:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener NFTs'
      });
    }
    
    res.json({
      success: true,
      data: data || [],
      count: data ? data.length : 0
    });
  } catch (error) {
    console.error('Error fetching NFTs by wallet:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 SportBlocks API ejecutándose en puerto ${port}`);
  console.log(`📋 Health check: http://localhost:${port}/health`);
  console.log(`🎨 NFTs endpoint: http://localhost:${port}/nfts`);
  console.log(`⛏️ Mint endpoint: http://localhost:${port}/mint`);
});

module.exports = app;
