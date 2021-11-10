<template>
  <div class="container-fluid shadow">
    <div class="container">
      <div class="row d-flex align-items-center justify-content-center">
        <div class="col-lg-4 my-1" id="header-logo">
          <img :src="require('@/assets/images/logo/logo4.png')" />
        </div>
        <div class="col-lg-4 d-flex justify-content-start">
          <strong class="mr-2">Buscar Profissionais</strong>
          <strong>Para Psicólogos</strong>
        </div>
        <!-- d-flex justify-content-center -->
        <div class="col-lg-4">
          <b-button class="mx-1" variant="outline-primary"> Entrar </b-button>
          <b-button variant="primary"> Cadastra-se grátis </b-button>
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
export default {
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
  width: 300px;
  height: 60px;
}
</style>