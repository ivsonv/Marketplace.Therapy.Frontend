<template>
  <div class="container py-2">
    <div class="row justify-content-center">
      <div class="col-lg-6" id="home-start-col-section">
        <section id="home-start-section">
          <h1 class="mb-1">Psicólogos e terapia online ao seu alcance</h1>
          <strong class="mb-1"
            >Agende uma consulta online de qualquer dispositivo no conforto da
            sua casa ou onde estiver.</strong
          >
          <b-button variant="primary"> Comece Agora </b-button>
        </section>
      </div>
      <div class="col-lg-3">
        <img width="300" :src="require('@/assets/images/logo/logo.png')" />
      </div>
    </div>
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
#home-start-col-section {
  display: flex;
  align-items: center;
}

#home-start-section {
  display: flex;
  flex-direction: column;
}

#home-start-section h1 {
  color: var(--blue);
  background: var(--teal);
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 4px;
  padding-bottom: 4px;
  font-weight: 600;
}

#home-start-section strong {
  width: 380px;
  color: var(--purple);
  font-weight: 400;
}

#home-start-section button {
  max-width: 158px;
}
</style>