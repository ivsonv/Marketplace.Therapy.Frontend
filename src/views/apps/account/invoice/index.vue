<template>
  <section class="invoice-preview-wrapper">
    <b-alert variant="danger" :show="!appointment">
      <h4 class="alert-heading">Erro ao Consultar Recibo</h4>
      <div class="alert-body">Não foi encontrado o recibo.</div>
    </b-alert>
    <b-row v-if="appointment" class="invoice-preview">
      <b-col cols="12" xl="9" md="8">
        <b-card no-body class="invoice-preview-card py-5">
          <h1 class="text-center mb-3">Recibo</h1>
          <b-col cols="12">
            Recebi de {{ appointment.customer.name }}, CPF:
            {{
              appointment.customer.cpf.replace(
                /^(\d{3})(\d{3})(\d{3})(\d{2})/,
                "$1.$2.$3-$4"
              )
            }}, O VALOR DE R$ {{ appointment.price.toFixed(2) }}, correspondente
            ao pagamento de <br />atendimento psicologico, realizado nesta data.
          </b-col>

          <b-col cols="12 mt-5">
            Data {{ appointment.start }} ás
            {{ appointment.hour.substring(0, 5) }}h
          </b-col>
          <b-col cols="12 my-0">
            <img
              style="width: 300px; height: 200px"
              :src="appointment.provider.receipts[0].signature"
            />
          </b-col>
          <b-col cols="12"> Assinatura </b-col>
          <b-col cols="12">
            <strong class="d-block">{{
              appointment.provider.receipts[0].fantasy_name
            }}</strong>
            <strong class="d-block"
              >CPF ou CNPJ:
              <span v-if="appointment.provider.receipts[0].cnpj">{{
                appointment.provider.receipts[0].cnpj.replace(
                  /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                  "$1.$2.$3/$4-$5"
                )
              }}</span>

              <span v-if="appointment.provider.receipts[0].cpf">
                {{
                  appointment.provider.receipts[0].cpf.replace(
                    /^(\d{3})(\d{3})(\d{3})(\d{2})/,
                    "$1.$2.$3-$4"
                  )
                }}
              </span>
            </strong>
            <strong class="d-block">CRP: {{ appointment.provider.crp }}</strong>
            <strong class="d-block">{{
              appointment.provider.receipts[0].address
            }}</strong>
          </b-col>
        </b-card>
      </b-col>

      <!-- Right Col: Card -->
      <b-col cols="12" md="4" xl="3" class="invoice-actions mb-5">
        <b-button variant="info" class="mb-75" block @click="printInvoice">
          IMPRIMIR
        </b-button>
        <b-button
          variant="secondary"
          class="mb-75"
          block
          @click="$router.go(-1)"
        >
          VOLTAR
        </b-button>
      </b-col>
    </b-row>
  </section>
</template>
<script>
import { BAlert } from "bootstrap-vue";
export default {
  props: {
    appointment: {
      type: Object,
      required: true,
    },
  },
  components: {
    BAlert,
  },
  methods: {
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