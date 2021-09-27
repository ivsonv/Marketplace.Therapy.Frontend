<template>
  <div class="main-view">
    <h1 v-if="loading">Aguarde, processando...<spinner--c /></h1>
  </div>
</template>

<script>
import HomeHeader from "../components/home-header";
import _paymentService from "@/services/payment-service";
export default {
  components: {
    "header--v": HomeHeader,
  },
  data() {
    return {
      loading: false,
    };
  },
  created() {
    this.payment();
  },
  methods: {
    payment() {
      const checkout = JSON.parse(localStorage.getItem("checkout"));
      if (!checkout || checkout === "null") {
        this.$router.push({
          path: `/pesquisa`,
        });
      } else {
        const auth = `${localStorage.getItem("accessToken")}`;
        if (auth && auth !== "null") {
          // realizar checkout
          const payload = {
            data: checkout,
          };

          this.loading = true;
          _paymentService
            .create(payload)
            .then((res) => {
              window.location.href = res.content.url;
            })
            .catch((error) => this.$utils.toastError("Notificação", error))
            .finally(() => (this.loading = false));
        } else {
          this.$router.push({
            path: `/pesquisa`,
          });
        }
      }
    },
  },
};
</script>

<style lang="scss">
.main-view {
  min-height: 100vh;
}
</style>