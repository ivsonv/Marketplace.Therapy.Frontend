<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">
      <b-card class="mb-0">
        <div class="text-center">
          <img class="" :src="logo" />
        </div>
        <b-form class="auth-login-form mt-2">
          <b-form-group label="Ramal" class="mb-2">
            <b-form-input v-model="userRamal" autofocus />
          </b-form-group>
          <b-button block variant="primary" @click="login"> ENTRAR </b-button>
        </b-form>
      </b-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logo: require("@/assets/images/logo/C4LL_logo.png"),
      userRamal: "",
      loading: false,
    };
  },
  created() {
    // buscar configurações do PABX
    console.log(this.$route.params.clientid);
  },
  methods: {
    login() {
      const loginRq = {
        ramal: this.userRamal,
        login: "",
        pass: "",
      };
      // requisição AXIOS
      // ...........

      // popular dados usuario
      const payload = {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", // token gerado dynamic
        name: "Leonardo Brandão",
        ramal: this.userRamal || "TST",
        id: "I6IkpXVCJ9",
      };
      this.$store.dispatch("setLogin", payload);

      // popular parametros PABX Clientid
      const payloadPABX = {
        configs: {
          uri: "sip:c4lldev02@dev-pabx-01.c4ll.app",
          transportOptions: {
            server: "wss://dev-pabx-01.c4ll.app:8089/ws",
          },
          authorizationUsername: "71VK0lZ3yL2NgY4ftDXbZ4LBk3rqw3w6",
          authorizationPassword: "3guTqSgfR5Hww2fWF8ZusMhjBVO24TsB",
        },
      };
      this.$store.dispatch("setPabxConfigs", payloadPABX);

      // Tela Inicial
      this.$router.push({ name: "softphone-view" });
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-auth.scss";
</style>
