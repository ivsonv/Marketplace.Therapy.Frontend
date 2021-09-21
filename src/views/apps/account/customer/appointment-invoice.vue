<template>
  <view--c permission="account.customer" :busy="isloading">
    <section class="invoice-preview-wrapper">
      <b-alert variant="danger" :show="!appointment && !isloading">
        <h4 class="alert-heading">Erro ao Consultar Recibo</h4>
        <div class="alert-body">Não foi encontrado o recibo.</div>
      </b-alert>

      <b-row v-if="appointment" class="invoice-preview">
        <b-col cols="12" xl="9" md="8">
          <b-card no-body class="invoice-preview-card">
            <div
              class="
                d-flex
                justify-content-between
                flex-md-row flex-column
                invoice-spacing
                m-2
              "
            >
              <div>
                <div class="logo-wrapper m-0">
                  <h3 class="text-secondary invoice-logo mx-0">
                    {{ appointment.customer.name }}
                  </h3>
                </div>
                <p class="card-text p-0 m-0">
                  <strong>
                    {{ appointment.customer.cpf }}
                    {{ appointment.customer.cnpj }}</strong
                  >
                  <small class="text-muted">| PACIENTE</small>
                </p>
                <p class="card-text mb-25">
                  <span class="font-weight-bold">Sessão realizada em:</span>
                  <br />
                  <span class=""
                    >{{ appointment.start }} ás
                    {{ appointment.hour.substring(0, 5) }}h</span
                  >
                </p>
              </div>

              <!-- Header: Right Content -->
              <div class="mt-md-0 mt-2">
                <h4 class="invoice-title">
                  Recibo
                  <span class="invoice-number">#{{ appointment.id }}</span>
                </h4>
              </div>
            </div>

            <!-- Provider -->
            <hr class="invoice-spacing m-0 p-0" />
            <b-row class="invoice-spacing m-2">
              <b-col cols="12" xl="6" class="p-0">
                <h3 class="mb-25">
                  {{ appointment.provider.receipts[0].fantasy_name }}
                </h3>
                <p class="card-text mb-25">
                  <strong v-if="appointment.provider.receipts[0].cpf"
                    >CPF {{ appointment.provider.receipts[0].cpf }}
                  </strong>
                  <strong v-if="appointment.provider.receipts[0].cnpj"
                    >CNPJ {{ appointment.provider.receipts[0].cnpj }}
                  </strong>
                </p>
                <p class="card-text mb-25">
                  <strong v-if="appointment.provider.crp"
                    >CRP {{ appointment.provider.crp }}
                  </strong>
                  <small v-else class="text-muted"> | ... </small>
                </p>
              </b-col>
              <b-col
                xl="6"
                cols="12"
                class="p-0 mt-xl-0 mt-2 d-flex justify-content-xl-end"
              >
                <div>
                  <h6 class="mb-2">Detalhes Pagamento:</h6>
                  <table width="100%">
                    <tbody>
                      <tr>
                        <td class="pr-1">Total:</td>
                        <td class="text-right">
                          <span class="font-weight-bold"
                            >R$ {{ appointment.price.toFixed(2) }}</span
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </b-col>
            </b-row>

            <!-- Spacer -->
            <b-card class="invoice-padding pt-0">
              <div class="text-center">
                <img
                  style="width: 300px; height: 200px"
                  :src="appointment.provider.receipts[0].signature"
                />
              </div>
              <hr class="my-50" />
              <div class="text-center">
                <strong>{{ appointment.provider.receipts[0].address }}</strong>
              </div>
            </b-card>
          </b-card>
        </b-col>

        <!-- Right Col: Card -->
        <b-col cols="12" md="4" xl="3" class="invoice-actions">
          <b-button variant="info" class="mb-75" block @click="printInvoice">
            IMPRIMIR
          </b-button>
        </b-col>
      </b-row>
    </section>
  </view--c>
</template>

<script>
import _customerService from "@/services/account-customer-service";
import { BAlert } from "bootstrap-vue";
export default {
  components: {
    BAlert,
  },
  data() {
    return {
      isloading: false,
      appointment: null,
    };
  },
  created() {
    this.getAppointment();
  },
  methods: {
    getAppointment() {
      this.isloading = true;
      _customerService
        .invoice(this.$route.params.id)
        .then((res) => {
          this.appointment = res.content.appointment;
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    printInvoice() {
      window.print();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@core/scss/base/pages/app-invoice.scss";
</style>

<style lang="scss">
@media print {
  // Global Styles
  body {
    background-color: transparent !important;
  }
  nav.header-navbar {
    display: none;
  }
  .main-menu {
    display: none;
  }
  .header-navbar-shadow {
    display: none !important;
  }
  .content.app-content {
    margin-left: 0;
    padding-top: 2rem !important;
  }
  footer.footer {
    display: none;
  }
  .card {
    background-color: transparent;
    box-shadow: none;
  }
  .customizer-toggle {
    display: none !important;
  }

  // Invoice Specific Styles
  .invoice-preview-wrapper {
    .row.invoice-preview {
      .col-md-8 {
        max-width: 100%;
        flex-grow: 1;
      }

      .invoice-preview-card {
        .card-body:nth-of-type(2) {
          .row {
            > .col-12 {
              max-width: 50% !important;
            }

            .col-12:nth-child(2) {
              display: flex;
              align-items: flex-start;
              justify-content: flex-end;
              margin-top: 0 !important;
            }
          }
        }
      }
    }

    // Action Right Col
    .invoice-actions {
      display: none;
    }
  }
}
</style>