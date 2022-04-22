import * as nearAPI from 'near-api-js';
import getConfig from './config.js';
import {BN} from 'bn.js'

const nearConfig = getConfig(process.env.VUE_APP_NEAR_ENV || 'testnet');

async function init() {
// create a keyStore for signing transactions using the user's key
// which is located in the browser local storage after user logs in
    const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

// Initializing connection to the NEAR testnet
    const near = await nearAPI.connect({keyStore, ...nearConfig});

// Initialize wallet connection
    window.walletConnection = new nearAPI.WalletConnection(near);

    await updateNearAcc();

}

async function updateNearAcc() {
    window.nearAccount = {
        'isSignedIn': await isSignedIn(),
        'accountId': window.walletConnection.getAccountId()
    }
}

async function signIn() {
    window.walletConnection.requestSignIn(
        nearConfig.contractName,
        // '', // title. Optional, by the way
        // '', // successUrl. Optional, by the way
        // '', // failureUrl. Optional, by the way
    );
}

async function signOut() {
    await window.walletConnection.signOut();
    await updateNearAcc();
}

async function isSignedIn() {
    return window.walletConnection.isSignedIn();
}

async function mintNFT(title, description, media) {
    const tokenId = `${window.nearAccount.accountId}-` + +new Date();
    // Send the 5 NEAR prize to the logged-in winner
    let functionCallResult = await window.walletConnection.account().functionCall({
        contractId: nearConfig.contractName,
        methodName: 'nft_mint',
        args: {
            token_id: tokenId,
            receiver_id: window.nearAccount.accountId,
            token_metadata:{
                title:title,
                description:description,
                media:media,
            }
        },
        attachedDeposit: new BN("10000000000000000000000"),
        walletCallbackUrl: `http:/localhost:8080/?tokenId=${tokenId}`
    });
    if (functionCallResult && functionCallResult.transaction && functionCallResult.transaction.hash) {
        // Display a link the NEAR Explorer
        return [tokenId, functionCallResult.transaction.hash];
    }
}

export {
    mintNFT,
    init,
    signIn,
    signOut,
    isSignedIn,
}