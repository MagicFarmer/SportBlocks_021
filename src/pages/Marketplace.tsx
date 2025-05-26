
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getAllNFTs, mintNFT, NFT } from '@/services/api';

const Marketplace = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
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

  const handleMintNFT = async (nft: NFT) => {
    try {
      // Obtener wallet address desde localStorage
      const walletAddress = localStorage.getItem('starknet_wallet_address');
      
      if (!walletAddress) {
        toast({
          title: "Wallet no conectada",
          description: "Por favor conecta tu wallet primero",
          variant: "destructive",
        });
        return;
      }

      console.log('Iniciando mint para NFT:', nft.name);
      
      toast({
        title: "Mint iniciado",
        description: `Comenzando el proceso de mint para "${nft.name}" de ${nft.athlete}`,
      });

      // Llamar a la API para mintear
      const result = await mintNFT({
        name: nft.name,
        athlete: nft.athlete,
        ipfs_url: nft.ipfs_url,
        token_id: `token_${Date.now()}` // Generar un token ID temporal
      }, walletAddress);

      toast({
        title: "NFT Minteado",
        description: `¡${result.name} ha sido minteado exitosamente!`,
      });

      // Refrescar la lista de NFTs
      fetchNFTs();

    } catch (error) {
      console.error('Error en mint:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Hubo un problema al mintear el NFT",
        variant: "destructive",
      });
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Mítico': return 'from-purple-500 to-pink-500';
      case 'Legendario': return 'from-orange-500 to-red-500';
      case 'Épico': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'Mítico': return 'border-purple-500/50';
      case 'Legendario': return 'border-orange-500/50';
      case 'Épico': return 'border-blue-500/50';
      default: return 'border-gray-500/50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Cargando NFTs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Marketplace <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">NFT</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Descubre y colecciona momentos deportivos únicos convertidos en NFTs
          </p>
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nfts.map((nft) => (
            <div
              key={nft.id}
              className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border-2 ${getRarityBorder('Épico')} overflow-hidden group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20`}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={nft.ipfs_url || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop"}
                  alt={nft.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop";
                  }}
                />
                
                {/* Rarity Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${getRarityColor('Épico')} text-white shadow-lg`}>
                    Épico
                  </span>
                </div>

                {/* Status Badge */}
                {nft.is_minted && (
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-500 text-white shadow-lg">
                      Minteado
                    </span>
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                  {nft.name}
                </h3>
                
                <p className="text-blue-400 font-medium mb-3">
                  {nft.athlete}
                </p>
                
                <div className="text-gray-400 text-sm mb-4">
                  <p>Creado: {new Date(nft.created_at).toLocaleDateString()}</p>
                  {nft.wallet_address && (
                    <p className="truncate">Wallet: {nft.wallet_address.slice(0, 10)}...</p>
                  )}
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Estado</p>
                    <p className="text-lg font-bold text-white">
                      {nft.is_minted ? 'Minteado' : 'Disponible'}
                    </p>
                  </div>
                  
                  {!nft.is_minted ? (
                    <button
                      onClick={() => handleMintNFT(nft)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                    >
                      Mintear
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-gray-600 text-gray-400 px-6 py-2 rounded-lg font-medium cursor-not-allowed"
                    >
                      Minteado
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {nfts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg">No hay NFTs disponibles en este momento</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
