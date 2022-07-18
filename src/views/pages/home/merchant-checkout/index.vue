<template>
  <div class="main-view">
    <header--v />
    <section class="container my-5" style="max-width: 600px">
      <view-card title="1. Confira seu agendamento">
        <div class="row text-center text-lg-left" v-if="provider">
          <div class="col-12 col-md-3">
            <img
              class="image-profile"
              :src="provider.image"
              :alt="`Imagem de perfil ${provider.name}`"
              style="width: 100px; height: 100px; border-radius: 50%"
            />
          </div>
          <div class="col-12 col-md-8">
            <p>{{ provider.name }}</p>
            <strong class="text-center" v-if="provider.crp"
              >CRP – {{ provider.crp }}</strong
            >
            <span class="text-center text-lg-left" v-if="provider.state">
              | {{ provider.state }}</span
            >
          </div>
        </div>
        <div class="row mt-2" v-if="provider">
          <div class="col-6 pb-1">
            <feather-icon icon="CalendarIcon" size="25" />
            <!-- <strong class="ml-75"
              >{{ date.substring(9, 10) }} /{{ date.substring(5, 7) }}</strong
            > -->
            <strong class="ml-75">{{ ds_date }}</strong>
          </div>
          <div class="col-6 pb-1">
            <feather-icon icon="ClockIcon" size="25" />
            <strong class="ml-75">{{ hour.substring(0, 5) }}</strong>
          </div>
          <div class="col-6 pb-1">
            <feather-icon icon="DollarSignIcon" size="25" />
            <strong class="ml-75">{{ provider.price.toFixed(0) }}</strong>
          </div>
          <div class="col-6 pb-1">
            <feather-icon icon="VideoIcon" size="25" />
            <strong class="ml-75">Video Online</strong>
          </div>
        </div>
      </view-card>
      <view-card title="2. Forma de Pagamento">
        <div class="row">
          <div class="col-12">
            <h6>Cartão de Crédito</h6>
          </div>
        </div>
        <div class="row my-1">
          <div class="col-12 mb-1">
            <b-form-input
              placeholder="Número do cartão"
              autocomplete="off"
              v-mask="$utils.masked.card"
              v-model="card.number"
            />
          </div>
          <div class="col-12 col-lg-6 mb-1">
            <b-form-input
              placeholder="Validade"
              autocomplete="off"
              v-mask="$utils.masked.expire"
              v-model="card.expire"
            />
          </div>
          <div class="col-12 col-lg-6 mb-1">
            <b-form-input
              placeholder="Cód. de segurança (CVV)"
              autocomplete="off"
              v-mask="$utils.masked.cvv"
              v-model="card.cvv"
            />
          </div>
          <div class="col-12 col-lg-6 mb-1">
            <b-form-input
              placeholder="Nome impresso no cartão"
              autocomplete="off"
              v-model="card.holder"
            />
          </div>
          <div class="col-12 col-lg-6 mb-1">
            <b-form-input
              placeholder="CPF do titular do cartão"
              autocomplete="off"
              v-mask="$utils.masked.cpf"
              v-model="card.holder_cpf"
            />
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-12">
            <div class="d-flex justify-content-center">
              <b-button
                @click="payment()"
                variant="primary"
                pill
                size="lg"
                v-if="!loading"
              >
                Confirmar Pagamento
              </b-button>
              <spinner--c v-else />
            </div>
          </div>
        </div>
      </view-card>
    </section>
    <footer--v />
  </div>
</template>

<script>
import HomeHeader from "../components/home-header";
import HomeFooter from "../components/home-footer.vue";
import _paymentService from "@/services/payment-service";
import ViewCard from "@/components/view-card.vue";
export default {
  components: {
    "header--v": HomeHeader,
    "footer--v": HomeFooter,
    ViewCard,
  },
  data() {
    return {
      loading: false,
      payment_url: "",
      provider: null,
      ds_date: "",
      date: "",
      hour: "",
      card: {
        number: "",
        expire: "",
        holder: "",
        holder_cpf: "",
        cvv: "",
      },
    };
  },
  destroyed() {
    this.$destroy();
  },
  created() {
    const checkout = JSON.parse(localStorage.getItem("checkout"));
    if (!checkout || checkout === "null") {
      this.$router.push({
        path: `/pesquisa`,
      });
    } else {
      const auth = `${localStorage.getItem("accessToken")}`;
      if (!(auth && auth !== "null")) {
        this.$router.push({
          path: `/pesquisa`,
        });
      }
    }
  },
  mounted() {
    const checkout = JSON.parse(localStorage.getItem("checkout"));
    this.provider = checkout.provider;
    this.ds_date = checkout.ds_date;
    this.hour = checkout.hour;
    this.date = checkout.date;
  },

  methods: {
    payment() {
      if (!this.card.number) {
        this.$utils.toastError("Informe o número do cartão.");
        return;
      }

      if (!this.card.holder) {
        this.$utils.toastError("Informe o nome impresso no cartão.");
        return;
      }

      if (!this.card.holder_cpf) {
        this.$utils.toastError("Informe o cpf impresso no cartão.");
        return;
      }

      if (!this.card.cvv) {
        this.$utils.toastError("Informe o Código de seguranção (CVV).");
        return;
      }

      if (!this.card.expire) {
        this.$utils.toastError("Informe a validade do cartão.");
        return;
      }

      const checkout = JSON.parse(localStorage.getItem("checkout"));
      const payload = {
        data: {
          ...checkout,
          ...this.card,
        },
      };

      this.loading = true;
      _paymentService
        .create(payload)
        .then((res) => {
          this.$swal({
            title: "Pagamento Confirmado Sucesso.",
            text: "Você sera redirecionado para sua conta.",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "btn btn-primary",
            },
            buttonsStyling: false,
          }).then((result) => {
            this.loading = true;
            this.$router.push({ name: "sou-paciente-appointments" });
          });
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
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