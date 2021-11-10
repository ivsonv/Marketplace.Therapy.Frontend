<template>
  <div class="container-fluid shadow">
    <div class="container">
      <div class="row d-flex align-items-center justify-content-center">
        <div class="col-lg-4 my-1" id="header-logo">
          <b-button variant="transparent" :to="{ name: 'home-view' }">
            <img :src="require('@/assets/images/logo/logo4.png')" />
          </b-button>
        </div>
        <div class="col-lg-4 d-flex justify-content-start">
          <b-link class="mr-2" :to="{ name: 'merchants-view' }">
            <strong>Buscar Profissionais</strong>
          </b-link>
          <b-link class="mr-2" :to="{ name: 'auth-login-psicologo' }">
            <strong>Para Psicólogos</strong>
          </b-link>
        </div>
        <!-- d-flex justify-content-center -->
        <div class="col-lg-4 mb-1 mb-lg-0">
          <b-button
            :to="{ name: 'auth-login-paciente' }"
            class="mx-1"
            variant="outline-primary"
          >
            Entrar
          </b-button>
          <b-button
            :to="{ name: 'auth-quero-cadastrar-paciente' }"
            variant="primary"
          >
            Cadastra-se grátis
          </b-button>
        </div>
      </div>
    </div>

    <!-- <div class="d-none d-sm-block">
      <div class="row">
        <div class="col-6 my-1">
          <img :src="require('@/assets/images/logo/logo4.png')" />
        </div>
        <div class="col-6 d-flex align-items-center justify-content-end">
          <b-button
            @click="goMerchant"
            size="lg"
            variant="warning"
            class="rounded mr-1"
            pill
          >
            Sou Psicólogo
          </b-button>
          <b-button
            @click="goCustomer"
            size="lg"
            variant="warning"
            class="rounded"
            pill
          >
            Sou Paciente
          </b-button>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script>
import { BLink } from "bootstrap-vue";
export default {
  components: {
    BLink,
  },
  data() {
    return {
      show: true,
    };
  },
  created() {},
  methods: {
    // onClickToggle() {
    //   this.show = !this.show;
    // },
    // goMerchant() {
    //   this.$router.push({ name: "auth-login-psicologo" });
    // },
    // goCustomer() {
    //   const auth = `${localStorage.getItem("accessToken")}`;
    //   if (auth && auth !== "null") {
    //     this.$router.push({ name: "sou-paciente-appointments" });
    //   } else {
    //     this.$router.push({ name: "auth-login-paciente" });
    //   }
    // },
  },
};
</script>
<style>
#header-logo {
  max-width: 335px;
}

#header-logo img {
  width: 250px;
}
</style>