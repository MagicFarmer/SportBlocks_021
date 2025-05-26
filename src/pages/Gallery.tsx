
import { useState, useEffect } from 'react';

interface NFT {
  id: number;
  name: string;
  athlete: string;
  ipfs_url: string;
  price: string;
  rarity: string;
}

const Gallery = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    try {
      // Mock data por ahora - luego se conectará al backend
      setTimeout(() => {
        const mockNFTs: NFT[] = [
          {
            id: 1,
            name: "Gol Histórico - Final Mundial",
            athlete: "Lionel Messi",
            ipfs_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop",
            price: "0.5 ETH",
            rarity: "Legendario"
          },
          {
            id: 2,
            name: "Dunk Épico - Playoffs",
            athlete: "Michael Jordan",
            ipfs_url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop",
            price: "0.8 ETH",
            rarity: "Mítico"
          },
          {
            id: 3,
            name: "Ace Perfecto - Wimbledon",
            athlete: "Serena Williams",
            ipfs_url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=400&fit=crop",
            price: "0.3 ETH",
            rarity: "Épico"
          },
          {
            id: 4,
            name: "Carrera Legendaria - F1",
            athlete: "Lewis Hamilton",
            ipfs_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
            price: "0.6 ETH",
            rarity: "Legendario"
          },
          {
            id: 5,
            name: "Touchdown Decisivo - Super Bowl",
            athlete: "Tom Brady",
            ipfs_url: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=400&fit=crop",
            price: "0.7 ETH",
            rarity: "Mítico"
          },
          {
            id: 6,
            name: "Anotación Final - NBA Finals",
            athlete: "LeBron James",
            ipfs_url: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=400&h=400&fit=crop",
            price: "0.4 ETH",
            rarity: "Épico"
          }
        ];
        setNfts(mockNFTs);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Mítico': return 'text-purple-400 bg-purple-900/30 border-purple-500/50';
      case 'Legendario': return 'text-orange-400 bg-orange-900/30 border-orange-500/50';
      case 'Épico': return 'text-blue-400 bg-blue-900/30 border-blue-500/50';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500/50';
    }
  };

  const filteredNFTs = filter === 'all' ? nfts : nfts.filter(nft => nft.rarity.toLowerCase() === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Cargando NFTs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Galería de <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">NFTs Deportivos</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Descubre y colecciona momentos históricos del deporte mundial
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['all', 'mítico', 'legendario', 'épico'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                filter === filterOption
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {filterOption === 'all' ? 'Todos' : filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNFTs.map((nft) => (
            <div key={nft.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 overflow-hidden group hover:transform hover:scale-105">
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={nft.ipfs_url}
                  alt={nft.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRarityColor(nft.rarity)}`}>
                    {nft.rarity}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{nft.name}</h3>
                <p className="text-gray-400 mb-4">by {nft.athlete}</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Precio</p>
                    <p className="text-lg font-bold text-blue-400">{nft.price}</p>
                  </div>
                  <button 
                    disabled
                    className="bg-gray-600 text-gray-400 px-6 py-2 rounded-lg font-medium cursor-not-allowed"
                  >
                    Próximamente
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNFTs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No se encontraron NFTs para este filtro</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
