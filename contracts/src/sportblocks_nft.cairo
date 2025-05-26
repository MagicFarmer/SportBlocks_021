
use starknet::ContractAddress;

#[starknet::interface]
trait ISportBlocksNFT<TContractState> {
    fn mint_nft(ref self: TContractState, recipient: ContractAddress, metadata_url: felt252) -> u256;
    fn distribuir_ingresos(ref self: TContractState);
    fn get_nft_owner(self: @TContractState, token_id: u256) -> ContractAddress;
    fn get_nft_metadata(self: @TContractState, token_id: u256) -> felt252;
    fn get_total_supply(self: @TContractState) -> u256;
    fn set_atleta_address(ref self: TContractState, atleta: ContractAddress);
    fn set_proyecto_social_address(ref self: TContractState, proyecto_social: ContractAddress);
    fn set_plataforma_address(ref self: TContractState, plataforma: ContractAddress);
    fn get_contract_balance(self: @TContractState) -> u256;
}

#[starknet::contract]
mod SportBlocksNFT {
    use openzeppelin::token::erc721::ERC721Component;
    use openzeppelin::token::erc721::ERC721HooksEmptyImpl;
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::access::ownable::OwnableComponent;
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map
    };

    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    // ERC721 Mixin
    #[abi(embed_v0)]
    impl ERC721MixinImpl = ERC721Component::ERC721MixinImpl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;

    // Ownable
    #[abi(embed_v0)]
    impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        
        // Mapeo personalizado para metadata
        nft_metadata: Map<u256, felt252>,
        
        // Contador de tokens
        next_token_id: u256,
        
        // Direcciones para distribución de ingresos
        atleta_address: ContractAddress,
        proyecto_social_address: ContractAddress,
        plataforma_address: ContractAddress,
        fan_address: ContractAddress,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC721Event: ERC721Component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        
        NFTMinted: NFTMinted,
        IngresosDistribuidos: IngresosDistribuidos,
    }

    #[derive(Drop, starknet::Event)]
    struct NFTMinted {
        #[key]
        token_id: u256,
        #[key]
        recipient: ContractAddress,
        metadata_url: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct IngresosDistribuidos {
        total_amount: u256,
        atleta_amount: u256,
        proyecto_social_amount: u256,
        plataforma_amount: u256,
        fan_amount: u256,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        name: ByteArray,
        symbol: ByteArray,
        base_uri: ByteArray,
        atleta: ContractAddress,
        proyecto_social: ContractAddress,
        plataforma: ContractAddress
    ) {
        self.erc721.initializer(name, symbol, base_uri);
        self.ownable.initializer(owner);
        self.next_token_id.write(1);
        self.atleta_address.write(atleta);
        self.proyecto_social_address.write(proyecto_social);
        self.plataforma_address.write(plataforma);
    }

    #[abi(embed_v0)]
    impl SportBlocksNFTImpl of super::ISportBlocksNFT<ContractState> {
        fn mint_nft(ref self: ContractState, recipient: ContractAddress, metadata_url: felt252) -> u256 {
            self.ownable.assert_only_owner();
            
            let token_id = self.next_token_id.read();
            
            // Mint del NFT usando OpenZeppelin
            self.erc721.mint(recipient, token_id);
            
            // Guardar metadata
            self.nft_metadata.entry(token_id).write(metadata_url);
            
            // Incrementar contador
            self.next_token_id.write(token_id + 1);
            
            // Emitir evento
            self.emit(NFTMinted {
                token_id,
                recipient,
                metadata_url
            });
            
            token_id
        }

        fn distribuir_ingresos(ref self: ContractState) {
            self.ownable.assert_only_owner();
            
            let contract_address = get_contract_address();
            let balance = starknet::syscalls::get_balance(contract_address).unwrap_syscall();
            
            if balance == 0 {
                return;
            }
            
            // Calcular distribución
            let atleta_amount = balance * 40 / 100;  // 40%
            let proyecto_social_amount = balance * 30 / 100;  // 30%
            let plataforma_amount = balance * 20 / 100;  // 20%
            let fan_amount = balance * 10 / 100;  // 10%
            
            // Transferir fondos
            if atleta_amount > 0 {
                starknet::syscalls::send_message_to_l1(
                    self.atleta_address.read().into(),
                    array![atleta_amount.low.into(), atleta_amount.high.into()].span()
                ).unwrap_syscall();
            }
            
            if proyecto_social_amount > 0 {
                starknet::syscalls::send_message_to_l1(
                    self.proyecto_social_address.read().into(),
                    array![proyecto_social_amount.low.into(), proyecto_social_amount.high.into()].span()
                ).unwrap_syscall();
            }
            
            if plataforma_amount > 0 {
                starknet::syscalls::send_message_to_l1(
                    self.plataforma_address.read().into(),
                    array![plataforma_amount.low.into(), plataforma_amount.high.into()].span()
                ).unwrap_syscall();
            }
            
            if fan_amount > 0 && self.fan_address.read().is_non_zero() {
                starknet::syscalls::send_message_to_l1(
                    self.fan_address.read().into(),
                    array![fan_amount.low.into(), fan_amount.high.into()].span()
                ).unwrap_syscall();
            }
            
            // Emitir evento
            self.emit(IngresosDistribuidos {
                total_amount: balance,
                atleta_amount,
                proyecto_social_amount,
                plataforma_amount,
                fan_amount
            });
        }

        fn get_nft_owner(self: @ContractState, token_id: u256) -> ContractAddress {
            self.erc721.owner_of(token_id)
        }

        fn get_nft_metadata(self: @ContractState, token_id: u256) -> felt252 {
            self.nft_metadata.entry(token_id).read()
        }

        fn get_total_supply(self: @ContractState) -> u256 {
            self.next_token_id.read() - 1
        }

        fn set_atleta_address(ref self: ContractState, atleta: ContractAddress) {
            self.ownable.assert_only_owner();
            self.atleta_address.write(atleta);
        }

        fn set_proyecto_social_address(ref self: ContractState, proyecto_social: ContractAddress) {
            self.ownable.assert_only_owner();
            self.proyecto_social_address.write(proyecto_social);
        }

        fn set_plataforma_address(ref self: ContractState, plataforma: ContractAddress) {
            self.ownable.assert_only_owner();
            self.plataforma_address.write(plataforma);
        }

        fn get_contract_balance(self: @ContractState) -> u256 {
            let contract_address = get_contract_address();
            starknet::syscalls::get_balance(contract_address).unwrap_syscall()
        }
    }

    // Función para recibir pagos
    #[l1_handler]
    fn receive_payment(ref self: ContractState, from_address: felt252, amount: u256) {
        // Los pagos se acumulan automáticamente en el contrato
        // y serán distribuidos cuando se llame a distribuir_ingresos()
    }
}
