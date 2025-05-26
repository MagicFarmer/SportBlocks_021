
import { useState, useEffect } from 'react';

const ConnectWalletButton = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Simular conexión de wallet (starknet.js se añadirá después)
  const connectWallet = async () => {
    setIsConnecting(true);
    
    try {
      // Mock connection para testing
      setTimeout(() => {
        const mockAddress = '0x1234567890abcdef1234567890abcdef12345678';
        setWalletAddress(mockAddress);
        setWalletConnected(true);
        setIsConnecting(false);
        console.log('Wallet conectada:', mockAddress);
      }, 1500);
    } catch (error) {
      console.error('Error conectando wallet:', error);
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress('');
    console.log('Wallet desconectada');
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (walletConnected) {
    return (
      <div className="flex items-center space-x-3">
        <div className="bg-gray-800 px-3 py-2 rounded-lg border border-gray-700">
          <span className="text-sm text-gray-300">
            {truncateAddress(walletAddress)}
          </span>
        </div>
        <button
          onClick={disconnectWallet}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          Desconectar
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
        isConnecting ? 'animate-pulse' : ''
      }`}
    >
      {isConnecting ? 'Conectando...' : 'Conectar Wallet'}
    </button>
  );
};

export default ConnectWalletButton;
