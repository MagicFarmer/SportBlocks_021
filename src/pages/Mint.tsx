
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createNFT } from '@/services/api';

const Mint = () => {
  const [formData, setFormData] = useState({
    name: '',
    athlete: '',
    description: '',
    sport: '',
    rarity: 'épico',
    ipfs_url: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      // Obtener wallet address desde localStorage
      const walletAddress = localStorage.getItem('starknet_wallet_address');
      
      if (!walletAddress) {
        toast({
          title: "Wallet no conectada",
          description: "Por favor conecta tu wallet primero",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      // Crear NFT usando la API
      const result = await createNFT({
        name: formData.name,
        athlete: formData.athlete,
        sport: formData.sport,
        description: formData.description,
        rarity: formData.rarity,
        ipfs_url: formData.ipfs_url || undefined
      }, walletAddress);

      console.log('NFT creado:', result);
      
      toast({
        title: "NFT Creado",
        description: `¡${result.name} ha sido creado exitosamente!`,
      });

      // Reset form
      setFormData({
        name: '',
        athlete: '',
        description: '',
        sport: '',
        rarity: 'épico',
        ipfs_url: ''
      });
    } catch (error) {
      console.error('Error creating NFT:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Hubo un problema al crear el NFT",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Crear <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">NFT Deportivo</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Convierte momentos deportivos históricos en NFTs únicos
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del NFT
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder="ej. Gol Histórico - Final Mundial"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Atleta
                </label>
                <input
                  type="text"
                  name="athlete"
                  value={formData.athlete}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder="ej. Lionel Messi"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Deporte
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
                  URL de IPFS (opcional)
                </label>
                <input
                  type="url"
                  name="ipfs_url"
                  value={formData.ipfs_url}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder="ej. ipfs://QmExample..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Describe el momento deportivo histórico..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isUploading ? 'animate-pulse' : 'transform hover:scale-105'
                }`}
              >
                {isUploading ? 'Creando NFT...' : 'Crear NFT'}
              </button>
            </form>
          </div>

          {/* Preview/Info */}
          <div className="space-y-8">
            {/* Upload Area */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Subir Imagen</h3>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center hover:border-blue-500 transition-colors duration-200">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-gray-400 mb-2">Arrastra una imagen aquí o</p>
                <button type="button" className="text-blue-400 hover:text-blue-300 font-medium">
                  selecciona un archivo
                </button>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF hasta 10MB</p>
              </div>
            </div>

            {/* Mint Info */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Información de Creación</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Costo de creación:</span>
                  <span className="text-white font-medium">Gratis</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Red:</span>
                  <span className="text-white font-medium">Starknet Sepolia</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Estado:</span>
                  <span className="text-blue-400 font-medium">No minteado</span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <p className="text-sm text-gray-400">
                    El NFT se creará en la base de datos y podrá ser minteado posteriormente desde el marketplace.
                  </p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
              <h4 className="text-blue-400 font-medium mb-2">💡 Consejos para crear NFTs exitosos</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Usa imágenes de alta calidad (min. 1000x1000px)</li>
                <li>• Describe el momento histórico con detalle</li>
                <li>• Incluye fecha y contexto del evento</li>
                <li>• Verifica los derechos de imagen</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mint;
