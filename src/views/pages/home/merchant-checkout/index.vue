<template>
  <div class="main-view">
    <h1 v-if="loading">Aguarde, processando...<spinner--c /></h1>
    <!-- <div class="browser_payment" v-if="payment_url">
      <b-embed
        type="iframe"
        aspect="16by9"
        :src="payment_url"
        allowfullscreen
      />
    </div> -->
  </div>
</template>

<script>
import HomeHeader from "../components/home-header";
import _paymentService from "@/services/payment-service";
import { BEmbed } from "bootstrap-vue";
export default {
  components: {
    "header--v": HomeHeader,
    BEmbed,
  },
  data() {
    return {
      loading: false,
      payment_url: "",
    };
  },
  created() {
    this.payment();
  },
  methods: {
    payment() {
      if (!this.payment_url) {
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
                this.payment_url = res.content.url;
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
      }
    },
  },
};
</script>

<style lang="scss">
.main-view {
  min-height: 100vh;
}

.browser_payment {
  margin: 0 0 10px;
  padding-top: 5%;
}
</style>