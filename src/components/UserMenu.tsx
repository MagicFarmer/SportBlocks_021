
import { useState, useEffect } from 'react';
import { User, LogOut, Wallet, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { connect, disconnect } from 'starknetkit';
import { AccountInterface } from 'starknet';

const UserMenu = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [account, setAccount] = useState<AccountInterface | null>(null);
  const [isOpen, setIsOpen] = useState(false);

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
          
          // Cerrar el menú después de conectar
          setIsOpen(false);
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
      
      // Cerrar el menú después de desconectar
      setIsOpen(false);
    } catch (error) {
      console.error('Error desconectando wallet:', error);
    }
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative h-10 w-10 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700"
        >
          <User className="h-5 w-5 text-gray-300" />
          {walletConnected && (
            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-gray-900 rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 bg-gray-800 border border-gray-700" align="end">
        <DropdownMenuLabel className="text-gray-300">
          Mi Cuenta
        </DropdownMenuLabel>
        
        {walletConnected && (
          <>
            <DropdownMenuItem disabled className="text-gray-400">
              <Wallet className="mr-2 h-4 w-4" />
              {truncateAddress(walletAddress)}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
          </>
        )}

        <DropdownMenuItem 
          className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
          disabled
        >
          <Settings className="mr-2 h-4 w-4" />
          Configuración
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-700" />

        {walletConnected ? (
          <DropdownMenuItem 
            onClick={disconnectWallet}
            className="text-red-400 hover:bg-red-900/20 hover:text-red-300 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Desconectar Wallet
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem 
            onClick={connectWallet}
            disabled={isConnecting}
            className="text-blue-400 hover:bg-blue-900/20 hover:text-blue-300 cursor-pointer"
          >
            <Wallet className="mr-2 h-4 w-4" />
            {isConnecting ? 'Conectando...' : 'Conectar Wallet'}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
