
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
import { useToast } from '@/hooks/use-toast';

const UserMenu = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [account, setAccount] = useState<AccountInterface | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Cargar estado desde localStorage al montar el componente
  useEffect(() => {
    const savedAddress = localStorage.getItem('starknet_wallet_address');
    const savedConnected = localStorage.getItem('starknet_wallet_connected');
    
    console.log('Loading saved wallet state:', { savedAddress, savedConnected });
    
    if (savedAddress && savedConnected === 'true') {
      setWalletAddress(savedAddress);
      setWalletConnected(true);
    }
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    console.log('Iniciando conexión de wallet...');
    
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

      console.log('Conexión recibida:', connection);

      if (connection && connection.wallet) {
        console.log('Wallet encontrado:', connection.wallet);
        
        // Verificar si la conexión tiene cuenta
        if (connection.account) {
          const walletAccount = connection.account as AccountInterface;
          const address = walletAccount.address;
          
          console.log('Cuenta encontrada:', address);
          
          setAccount(walletAccount);
          setWalletAddress(address);
          setWalletConnected(true);
          
          // Guardar en localStorage
          localStorage.setItem('starknet_wallet_address', address);
          localStorage.setItem('starknet_wallet_connected', 'true');
          
          console.log('Wallet conectada exitosamente:', address);
          
          // Obtener información adicional
          try {
            const chainId = await walletAccount.getChainId();
            console.log('Chain ID:', chainId);
          } catch (chainError) {
            console.log('No se pudo obtener Chain ID:', chainError);
          }
          
          toast({
            title: "Wallet Conectada",
            description: `Dirección: ${address.slice(0, 6)}...${address.slice(-4)}`,
          });
          
          // Cerrar el menú después de conectar
          setIsOpen(false);
        } else {
          console.error('No se encontró cuenta en la conexión');
          toast({
            title: "Error de Conexión",
            description: "No se pudo obtener la cuenta del wallet",
            variant: "destructive",
          });
        }
      } else {
        console.error('No se pudo establecer conexión con el wallet');
        toast({
          title: "Error de Conexión",
          description: "No se pudo conectar al wallet",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error conectando wallet:', error);
      toast({
        title: "Error de Conexión",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      console.log('Desconectando wallet...');
      await disconnect();
      
      setWalletConnected(false);
      setWalletAddress('');
      setAccount(null);
      
      // Limpiar localStorage
      localStorage.removeItem('starknet_wallet_address');
      localStorage.removeItem('starknet_wallet_connected');
      
      console.log('Wallet desconectada exitosamente');
      
      toast({
        title: "Wallet Desconectada",
        description: "Tu wallet ha sido desconectada exitosamente",
      });
      
      // Cerrar el menú después de desconectar
      setIsOpen(false);
    } catch (error) {
      console.error('Error desconectando wallet:', error);
      toast({
        title: "Error al Desconectar",
        description: "Hubo un problema al desconectar el wallet",
        variant: "destructive",
      });
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
