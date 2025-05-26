
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
  process.env.SUPABASE_URL || 'https://your-supabase-url.supabase.co',
  process.env.SUPABASE_KEY || 'your-supabase-anon-key'
);

// Mock NFTs data
const mockNFTs = [
  {
    id: 1,
    name: "Gol Histórico - Final Mundial",
    athlete: "Lionel Messi",
    ipfs_url: "ipfs://QmexampleMessi/messi.jpg",
    sport: "futbol",
    rarity: "legendario",
    price: "0.5",
    description: "El gol que marcó la historia en la final del Mundial 2022",
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    name: "Dunk Épico - Playoffs",
    athlete: "Michael Jordan",
    ipfs_url: "ipfs://QmexampleJordan/jordan.jpg",
    sport: "basketball",
    rarity: "mítico",
    price: "0.8",
    description: "La clavada más icónica de los playoffs de 1991",
    created_at: "2024-01-16T14:30:00Z"
  },
  {
    id: 3,
    name: "Ace Perfecto - Wimbledon",
    athlete: "Serena Williams",
    ipfs_url: "ipfs://QmexampleSerena/serena.jpg",
    sport: "tennis",
    rarity: "épico",
    price: "0.3",
    description: "El ace perfecto que aseguró su victoria en Wimbledon",
    created_at: "2024-01-17T16:45:00Z"
  }
];

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SportBlocks API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Get all NFTs
app.get('/nfts', async (req, res) => {
  try {
    console.log('Fetching NFTs...');
    
    // Por ahora retornamos mock data
    // Más adelante se conectará a Supabase
    res.json({
      success: true,
      data: mockNFTs,
      count: mockNFTs.length
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
    const nft = mockNFTs.find(n => n.id === parseInt(id));
    
    if (!nft) {
      return res.status(404).json({
        success: false,
        error: 'NFT no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: nft
    });
  } catch (error) {
    console.error('Error fetching NFT:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Create new NFT (mint)
app.post('/nfts', async (req, res) => {
  try {
    const { name, athlete, sport, rarity, price, description, ipfs_url } = req.body;
    
    // Validación básica
    if (!name || !athlete || !sport) {
      return res.status(400).json({
        success: false,
        error: 'Campos obligatorios: name, athlete, sport'
      });
    }
    
    const newNFT = {
      id: mockNFTs.length + 1,
      name,
      athlete,
      sport,
      rarity: rarity || 'épico',
      price: price || '0.1',
      description: description || '',
      ipfs_url: ipfs_url || `ipfs://Qmexample${athlete.replace(' ', '')}/image.jpg`,
      created_at: new Date().toISOString()
    };
    
    mockNFTs.push(newNFT);
    
    console.log('NFT creado:', newNFT);
    
    res.status(201).json({
      success: true,
      data: newNFT,
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

// Get NFTs by sport
app.get('/nfts/sport/:sport', async (req, res) => {
  try {
    const { sport } = req.params;
    const filteredNFTs = mockNFTs.filter(nft => 
      nft.sport.toLowerCase() === sport.toLowerCase()
    );
    
    res.json({
      success: true,
      data: filteredNFTs,
      count: filteredNFTs.length
    });
  } catch (error) {
    console.error('Error fetching NFTs by sport:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Get NFTs by rarity
app.get('/nfts/rarity/:rarity', async (req, res) => {
  try {
    const { rarity } = req.params;
    const filteredNFTs = mockNFTs.filter(nft => 
      nft.rarity.toLowerCase() === rarity.toLowerCase()
    );
    
    res.json({
      success: true,
      data: filteredNFTs,
      count: filteredNFTs.length
    });
  } catch (error) {
    console.error('Error fetching NFTs by rarity:', error);
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
});

module.exports = app;
