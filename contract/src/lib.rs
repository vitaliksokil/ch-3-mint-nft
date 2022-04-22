use near_sdk::{
    PromiseOrValue, Promise, near_bindgen, PanicOnDefault, BorshStorageKey, AccountId,
    borsh::{self, BorshDeserialize, BorshSerialize}
};
use near_contract_standards::non_fungible_token::NonFungibleToken;
use near_contract_standards::non_fungible_token::{metadata::NFTContractMetadata, Token, TokenId};
use near_contract_standards::non_fungible_token::metadata::{NFT_METADATA_SPEC, NonFungibleTokenMetadataProvider, TokenMetadata};
use near_sdk::collections::LazyOption;


#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    token: NonFungibleToken,
    metadata: LazyOption<NFTContractMetadata>,
}

#[derive(BorshSerialize, BorshStorageKey)]
pub enum StorageKey {
    NonFungibleToken,
    Metadata,
    TokenMetadata,
    Enumeration,
    Approval
}


#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(owner_id: AccountId) -> Self {
        Self {
            token: NonFungibleToken::new(
                StorageKey::NonFungibleToken,
                owner_id,
                Some(StorageKey::TokenMetadata),
                Some(StorageKey::Enumeration),
                Some(StorageKey::Approval)
            ),
            metadata: LazyOption::new(
                StorageKey::Metadata,
                Some(&NFTContractMetadata {
                    spec: NFT_METADATA_SPEC.to_string(),
                    name: "Example Name".to_string(),
                    symbol: "Example".to_string(),
                    icon: Some("ANY_SVG".to_string()),
                    base_uri: None,
                    reference: None,
                    reference_hash: None,
                })
            ),
        }
    }

    #[payable]
    pub fn nft_mint(
        &mut self,
        token_id: TokenId,
        receiver_id: AccountId,
        token_metadata: TokenMetadata,
    ) -> Token {
        self.token.internal_mint(token_id, receiver_id, Some(token_metadata))
    }
}

near_contract_standards::impl_non_fungible_token_core!(Contract, token);
near_contract_standards::impl_non_fungible_token_approval!(Contract, token);
near_contract_standards::impl_non_fungible_token_enumeration!(Contract, token);

#[near_bindgen]
impl NonFungibleTokenMetadataProvider for Contract {
    fn nft_metadata(&self) -> NFTContractMetadata {
        self.metadata.get().unwrap()
    }
}


#[cfg(test)]
mod tests {

}
