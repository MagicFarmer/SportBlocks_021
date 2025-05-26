
import { useState, useEffect } from 'react';
import { getAllNFTs, NFT } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Gallery = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    try {
      setLoading(true);
      const data = await getAllNFTs();
      setNfts(data);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los NFTs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'mítico': return 'text-purple-400 bg-purple-900/30 border-purple-500/50';
      case 'legendario': return 'text-orange-400 bg-orange-900/30 border-orange-500/50';
      case 'épico': return 'text-blue-400 bg-blue-900/30 border-blue-500/50';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500/50';
    }
  };

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'futbol': return '⚽';
      case 'basketball': return '🏀';
      case 'tennis': return '🎾';
      case 'formula1': return '🏎️';
      case 'football': return '🏈';
      default: return '🏆';
    }
  };

  const filteredNFTs = filter === 'all' ? nfts : nfts.filter(nft => nft.rarity?.toLowerCase() === filter);

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
                  src={nft.ipfs_url || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop"}
                  alt={nft.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop";
                  }}
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRarityColor(nft.rarity || 'épico')}`}>
                    {nft.rarity?.charAt(0).toUpperCase() + nft.rarity?.slice(1) || 'Épico'}
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-2 py-1 text-lg bg-black/50 rounded-full">
                    {getSportIcon(nft.sport || '')}
                  </span>
                </div>
                {nft.is_minted && (
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-500 text-white shadow-lg">
                      Minteado
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{nft.name}</h3>
                <p className="text-gray-400 mb-2">by {nft.athlete}</p>
                
                {nft.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {nft.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Precio</p>
                    <p className="text-lg font-bold text-blue-400">
                      {nft.price ? `${nft.price} ETH` : '0.1 ETH'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Estado</p>
                    <p className={`text-sm font-medium ${nft.is_minted ? 'text-green-400' : 'text-yellow-400'}`}>
                      {nft.is_minted ? 'Minteado' : 'Disponible'}
                    </p>
                  </div>
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
