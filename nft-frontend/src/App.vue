<template>
  <div>
    <header-comp :is-signed-in="isSignedIn" :account-id="accountId"></header-comp>
    <div class="container py-4" >
      <div class="row" v-if="!isSignedIn">
        <div class="alert alert-danger my-5 text-center" role="alert">
          Please sign in with NEAR to continue!
        </div>
      </div>
      <div class="row" v-else>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Mint your NFT</h5>
            <form @submit.prevent="mintNFT">
              <div class="mb-3">
                <label for="title" class="form-label">Title</label>
                <input type="text" class="form-control" id="title" required v-model="formData.title">
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <input type="text" class="form-control" id="description" required v-model="formData.description">
              </div>
              <div class="mb-3">
                <label for="media" class="form-label">Media</label>
                <input type="file" class="form-control" id="media" @change="fileOnChange" required>
                <img class="my-4" width="350" :src="formData.media"/>
              </div>
              <button type="submit" class="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
        <div class="card my-5" v-if="lastCreatedNftId && lastTransactionHash">
          <div class="card-body">
            <h5 class="card-title">Your last NFT and Transaction</h5>
            <p class="card-text"><a :href='"https://wallet.testnet.near.org/nft-detail/" + window.nearAccount.accountId + "/" + lastCreatedNftId' target="_blank">See your last created NFT</a></p>
            <p class="card-text"> <a :href='"https://explorer.testnet.near.org/transactions/" + lastTransactionHash' target="_blank">See your last transaction</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComp from './components/HeaderComp.vue'
import { NFTStorage } from 'nft.storage'
import {mintNFT} from "@/utils";

export default {
  name: 'App',
  data(){
    return {
      accountId: '',
      isSignedIn: false,
      formData:{
        title:'',
        description:'',
        media:''
      },
      lastTransactionHash:'',
      lastCreatedNftId:'',
    }
  },
  methods:{
    updateInfo(){
      this.accountId = window.nearAccount.accountId;
      this.isSignedIn = window.nearAccount.isSignedIn;
    },
    async fileOnChange(e){
      let loader = this.$loading.show();
      /* upload image to IPFS */
      const file = e.target.files[0];
      const client = new NFTStorage({ token: process.env.VUE_APP_NFT_STORAGE_TOKEN });
      const metadataCid = await client.storeBlob(file)
      const metadataUrl = "https://ipfs.io/ipfs/" + metadataCid;
      this.formData.media = metadataUrl;
      loader.hide();
    },
    async mintNFT(){
      let loader = this.$loading.show();
      const [nftId, transactionHash] = await mintNFT(this.formData.title,this.formData.description,this.formData.media)
      loader.hide();
      this.formData = {
        title:'',
        description:'',
        media:''
      };
      this.lastTransactionHash = transactionHash;
      this.lastCreatedNftId = nftId;
      this.$swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Your NFT has been created!',
        footer: `<div class="d-flex justify-content-between w-100"><a href="https://wallet.testnet.near.org/nft-detail/${window.nearAccount.accountId}/${nftId}" target="_blank">See your NFT</a> <a href='https://explorer.testnet.near.org/transactions/${transactionHash}' target="_blank">See your transaction</a></div>`,
      })
    }
  },
  async mounted(){
    this.updateInfo();
  },
  components: {
    'header-comp':HeaderComp,
  },
}
</script>

<style>

</style>
