<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <div class="collapse navbar-collapse d-flex justify-content-end">
        <form class="form-inline my-2 my-lg-0 d-flex">
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit" @click.prevent="login">
            {{isSignedIn ? accountId : "Login with NEAR"}}
          </button>
          <button class="btn btn-outline-danger my-2 my-sm-0 mx-2" type="submit" @click.prevent="signOut"
                  v-if="isSignedIn">
            Sign Out
          </button>
        </form>
      </div>
    </div>
  </nav>
</template>

<script>
import {signIn, signOut} from "@/utils";

export default {
  name: "HeaderComp",
  props:["accountId", "isSignedIn"],
  methods:{
    async login(){
      if(!this.isSignedIn){
        await signIn();
      }
    },
    async signOut(){
      await signOut();
      this.$parent.updateInfo();
    },
  },
}
</script>

<style scoped>

</style>