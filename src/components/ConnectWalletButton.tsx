
import { useState, useEffect } from 'react';
import { connect, disconnect } from 'starknetkit';
import { AccountInterface } from 'starknet';

const ConnectWalletButton = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [account, setAccount] = useState<AccountInterface | null>(null);

  // Cargar estado desde localStorage al montar el componente
  useEffect(() => {
    const savedAddress = localStorage.getItem('starknet_wallet_address');
    const savedConnected = localStorage.getItem('starknet_wallet_connected');
    
    if (savedAddress && savedConnected === 'true') {
      setWalletAddress(savedAddress);
      setWalletConnected(true);
    }
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    
    try {
      const connection = await connect({
        modalMode: 'canAsk',
        modalTheme: 'dark',
        webWalletUrl: 'https://web.argent.xyz',
        dappName: 'SportBlocks',
        argentMobileOptions: {
          dappName: 'SportBlocks',
          url: window.location.hostname,
        },
      });

      if (connection && connection.wallet) {
        // Access account directly from connection object
        const walletAccount = (connection as any).account as AccountInterface;
        if (walletAccount) {
          const address = walletAccount.address;
          
          setAccount(walletAccount);
          setWalletAddress(address);
          setWalletConnected(true);
          
          // Guardar en localStorage
          localStorage.setItem('starknet_wallet_address', address);
          localStorage.setItem('starknet_wallet_connected', 'true');
          
          console.log('Wallet conectada:', address);
          console.log('Chain ID:', await walletAccount.getChainId());
        }
      }
    } catch (error) {
      console.error('Error conectando wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
      
      setWalletConnected(false);
      setWalletAddress('');
      setAccount(null);
      
      // Limpiar localStorage
      localStorage.removeItem('starknet_wallet_address');
      localStorage.removeItem('starknet_wallet_connected');
      
      console.log('Wallet desconectada');
    } catch (error) {
      console.error('Error desconectando wallet:', error);
    }
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
