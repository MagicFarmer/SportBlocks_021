
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createNFT, mintNFT } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const Mint = () => {
  const [formData, setFormData] = useState({
    name: '',
    athlete: '',
    description: '',
    sport: '',
    rarity: 'épico',
    ipfs_url: '',
    image_url: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Simular llamada al contrato (placeholder)
  const callMintContract = async (metadataUrl: string): Promise<string> => {
    // Aquí iría la llamada real al contrato de Starknet
    // Por ahora simulamos con un delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular un token_id generado por el contrato
    const tokenId = `token_${Date.now()}`;
    console.log('Contract mint called with metadata:', metadataUrl);
    console.log('Generated token_id:', tokenId);
    
    return tokenId;
  };

  const handleMintNFT = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Validaciones
      if (!formData.name || !formData.athlete || !formData.sport) {
        toast({
          title: "Campos requeridos",
          description: "Por favor completa todos los campos obligatorios",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Obtener wallet address
      const walletAddress = localStorage.getItem('starknet_wallet_address');
      
      if (!walletAddress) {
        toast({
          title: "Wallet no conectada",
          description: "Por favor conecta tu wallet primero",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      toast({
        title: "Iniciando proceso de minteo",
        description: "Subiendo metadata a Supabase...",
      });

      // Paso 1: Subir metadata a Supabase vía POST /mint
      const nftData = {
        name: formData.name,
        athlete: formData.athlete,
        ipfs_url: formData.image_url || formData.ipfs_url || undefined
      };

      const createdNFT = await mintNFT(nftData, walletAddress);
      console.log('NFT metadata uploaded:', createdNFT);

      toast({
        title: "Metadata subida",
        description: "Ejecutando contrato en blockchain...",
      });

      // Paso 2: Llamar al contrato de minteo
      try {
        const tokenId = await callMintContract(createdNFT.ipfs_url || '');
        
        toast({
          title: "¡NFT Minteado Exitosamente! 🎉",
          description: `${createdNFT.name} ha sido minteado con token ID: ${tokenId}`,
        });

        console.log('Minting completed successfully');
        console.log('NFT:', createdNFT);
        console.log('Token ID:', tokenId);

        // Paso 3: La galería se actualizará automáticamente en la próxima carga
        // Aquí podrías agregar un refresh de cache si usas React Query
        
        // Reset form
        setFormData({
          name: '',
          athlete: '',
          description: '',
          sport: '',
          rarity: 'épico',
          ipfs_url: '',
          image_url: ''
        });

      } catch (contractError) {
        console.error('Contract error:', contractError);
        toast({
          title: "Error en el contrato",
          description: "El NFT se guardó en la base de datos pero falló el minteo en blockchain",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Error durante el minteo:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Hubo un problema durante el proceso de minteo",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Mintear <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">NFT Deportivo</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Convierte momentos deportivos históricos en NFTs únicos en blockchain
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8">
            <form onSubmit={handleMintNFT} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del NFT *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400"
                  placeholder="ej. Gol Histórico - Final Mundial"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Atleta *
                </label>
                <Input
                  type="text"
                  name="athlete"
                  value={formData.athlete}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400"
                  placeholder="ej. Lionel Messi"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Deporte *
                </label>
                <select
                  name="sport"
                  value={formData.sport}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Seleccionar deporte</option>
                  <option value="futbol">Fútbol</option>
                  <option value="basketball">Basketball</option>
                  <option value="tennis">Tennis</option>
                  <option value="formula1">Fórmula 1</option>
                  <option value="football">Fútbol Americano</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rareza
                </label>
                <select
                  name="rarity"
                  value={formData.rarity}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="épico">Épico</option>
                  <option value="legendario">Legendario</option>
                  <option value="mítico">Mítico</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL de Imagen
                </label>
                <Input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                <p className="text-xs text-gray-500 mt-2">URL de la imagen del NFT (después usaremos Web3.Storage)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL de IPFS (opcional)
                </label>
                <Input
                  type="url"
                  name="ipfs_url"
                  value={formData.ipfs_url}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400"
                  placeholder="ipfs://QmExample..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400 resize-none"
                  placeholder="Describe el momento deportivo histórico..."
                />
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isProcessing ? 'animate-pulse' : 'transform hover:scale-105'
                }`}
              >
                {isProcessing ? 'Minteando NFT...' : 'Mintear NFT en Blockchain'}
              </Button>
            </form>
          </div>

          {/* Process Info & Preview */}
          <div className="space-y-8">
            {/* Process Steps */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Proceso de Minteo</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
                  <div>
                    <p className="text-white font-medium">Subir Metadata</p>
                    <p className="text-sm text-gray-400">Los datos del NFT se guardan en Supabase</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                  <div>
                    <p className="text-white font-medium">Ejecutar Contrato</p>
                    <p className="text-sm text-gray-400">Llamada al contrato en Starknet para mintear</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                  <div>
                    <p className="text-white font-medium">Actualizar Galería</p>
                    <p className="text-sm text-gray-400">El NFT aparecerá automáticamente en la galería</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mint Info */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Información de Minteo</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Costo de minteo:</span>
                  <span className="text-white font-medium">Gas fee</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Red:</span>
                  <span className="text-white font-medium">Starknet Sepolia</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Estado:</span>
                  <span className="text-green-400 font-medium">Listo para mintear</span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <p className="text-sm text-gray-400">
                    El NFT se minteará directamente en blockchain y será tuyo para siempre.
                  </p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
              <h4 className="text-blue-400 font-medium mb-2">💡 Consejos para mintear NFTs</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Asegúrate de tener fondos suficientes para gas</li>
                <li>• Verifica que tu wallet esté conectada</li>
                <li>• La URL de imagen debe ser accesible públicamente</li>
                <li>• El proceso puede tomar unos minutos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mint;
