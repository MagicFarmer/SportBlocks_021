
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              SportBlocks
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            La primera plataforma de NFTs deportivos en Starknet. 
            Colecciona momentos históricos del deporte mundial.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-white text-xl">⚽</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Momentos Únicos</h3>
            <p className="text-gray-400">Goles históricos, jugadas épicas y momentos que marcaron la historia del deporte.</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-white text-xl">🏆</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Atletas Legendarios</h3>
            <p className="text-gray-400">Colecciona NFTs de los mejores atletas de todos los tiempos en diferentes deportes.</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-green-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-white text-xl">💎</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Blockchain Segura</h3>
            <p className="text-gray-400">Tecnología Starknet para garantizar la autenticidad y propiedad de tus NFTs.</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/gallery"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105"
          >
            Explorar Galería
          </Link>
          <Link
            to="/mint"
            className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold text-lg border border-gray-600 hover:border-gray-500 transition-all duration-200"
          >
            Crear NFT
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">1,250+</div>
            <div className="text-gray-400">NFTs Creados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">350+</div>
            <div className="text-gray-400">Coleccionistas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">50+</div>
            <div className="text-gray-400">Atletas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
