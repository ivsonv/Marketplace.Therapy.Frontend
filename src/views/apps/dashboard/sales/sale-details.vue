<template>
  <viewcard--c
    :title="`DETALHES do agendamento #${$route.params.id}`"
    subtitle="* Fuso Horário SÃO PAULO"
    :btdelete="null"
    :btsave="null"
    :btback="{}"
    :busy="loading"
  >
    <hr class="p-0 m-0 mb-1" />
    <div v-if="record">
      <div class="row">
        <div class="col-6 col-lg-3">
          <b-form-group label="Código"> #{{ record.id }} </b-form-group>
        </div>
        <div class="col-6 col-lg-3">
          <b-form-group label="Status Pedido">
            {{ record.status }}
          </b-form-group>
        </div>
        <div class="col-6 col-lg-3">
          <b-form-group label="Data Agendamento">
            {{ record.booking_date }}h
          </b-form-group>
        </div>
        <div class="col-6 col-lg-3">
          <b-form-group label="Criado Em">
            {{ record.created_at }}h
          </b-form-group>
        </div>
      </div>

      <!-- pagamento -->
      <div class="row" v-if="record.payment">
        <div class="col-6 col-lg-3">
          <b-form-group label="Tipo">
            {{ record.payment.type }}
          </b-form-group>
        </div>
        <div class="col-6 col-lg-3">
          <b-form-group label="Status Pagamento">
            {{ record.payment.status }}
          </b-form-group>
        </div>
        <div class="col-12 col-lg-6">
          <b-form-group label="Código Transacão">
            {{ record.payment.transaction_code }}h
          </b-form-group>
        </div>
      </div>

      <!-- provider / customer -->
      <div class="row" v-if="record.provider">
        <div class="col-6 col-lg-3">
          <b-form-group label="Psicólogo">
            <b-link
              id="psi-details"
              :to="{
                name: 'registrations-providers-save',
                params: { id: record.provider.id },
              }"
            >
              <span>{{ record.provider.name }}</span>
            </b-link>
            <b-tooltip
              triggers="hover"
              target="psi-details"
              title="Cadastro do Psicólogo"
              :delay="{ show: 100, hide: 50 }"
            />
          </b-form-group>
        </div>
        <div class="col-6 col-lg-3">
          <b-form-group label="Paciente">
            <b-link
              id="customers-details"
              :to="{
                name: 'registrations-customers-save',
                params: { id: record.customer.id },
              }"
            >
              <span>{{ record.customer.name }}</span>
            </b-link>
            <b-tooltip
              triggers="hover"
              target="customers-details"
              title="Cadastro do Paciente"
              :delay="{ show: 100, hide: 50 }"
            />
          </b-form-group>
        </div>
      </div>
    </div>
    <div v-else>
      <h1>REGISTRO NÃO ENCONTRADO.</h1>
    </div>
  </viewcard--c>
</template>
<script>
import _dashboardService from "@/services/dashboard-service";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import { BLink } from "bootstrap-vue";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    BLink,
  },
  data() {
    return {
      loading: false,
      record: {
        id: 0,
        name: "",
        email: "",
        cpf: "",
        cnpj: "",
      },
    };
  },
  destroyed() {
    this.$destroy();
  },
  mounted() {
    this.getRecord();
  },
  methods: {
    getRecord() {
      if (this.$route.params.id > 0) {
        this.loading = true;
        _dashboardService
          .findByAppointmentId(this.$route.params.id)
          .then((res) => {
            this.record = res.content;
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.loading = false));
      }
    },
  },
};
</script>
<style>
.col-form-label {
  font-weight: bolder;
}
</style>