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
    <b-modal
      id="modal-warning"
      ok-variant="warning"
      ok-title="Confirmar"
      @ok="reeschedule"
      modal-class="modal-warning"
      centered
      title="Remarcação de consulta"
    >
      <b-row>
        <b-col>
          <b-form-group label="Informe uma nova data">
            <b-form-datepicker
              :date-format-options="{ day: '2-digit' }"
              v-model="start"
              placeholder="Data"
            />
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group label="Novo horário">
            <b-form-input v-model="time" type="time" />
          </b-form-group>
        </b-col>
      </b-row>
    </b-modal>
    <div v-if="record">
      <b-tabs pills id="tabs-customer" content-class="mt-2">
        <b-tab title="1. Dados Gerais">
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
                <b-button
                  v-b-modal.modal-warning
                  variant="outline-warning"
                  size="sm"
                >
                  Remarcar
                </b-button>
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
                {{ record.payment.transaction_code }}
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
            <div class="col-6 col-lg-3">
              <b-form-group label="Comprovante">
                <b-link
                  id="psi-invoice-details"
                  :to="{
                    name: 'dashboard-sales-invoice',
                    params: { id: record.id },
                  }"
                >
                  <feather-icon icon="FileTextIcon" size="30" />
                </b-link>
                <b-tooltip
                  triggers="hover"
                  target="psi-invoice-details"
                  title="Comprovante"
                  :delay="{ show: 100, hide: 50 }"
                />
              </b-form-group>
            </div>
          </div>
        </b-tab>
        <b-tab title="2. LOGS" v-if="record.logs">
          <div class="row">
            <div class="col-12">
              <b-table
                :items="record.logs"
                :fields="fields_logs"
                responsive
                striped
                hover
              />
            </div>
          </div>
        </b-tab>
      </b-tabs>
    </div>
    <div v-else>
      <h1>REGISTRO NÃO ENCONTRADO.</h1>
    </div>
  </viewcard--c>
</template>
<script>
import _dashboardService from "@/services/dashboard-service";
import { BLink, BFormDatepicker } from "bootstrap-vue";

export default {
  components: {
    BFormDatepicker,
    BLink,
  },
  data() {
    return {
      loading: false,
      record: {},
      start: null,
      time: null,
      fields_logs: [
        { key: "description", label: "Descrição" },
        { key: "created_at", label: "Data" },
      ],
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
            this.start = res.content.start;
            this.time = res.content.time;
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.loading = false));
      }
    },

    reeschedule() {
      if (this.$route.params.id > 0) {
        this.loading = true;

        const payload = {
          data: {
            id: this.$route.params.id,
            start: `${this.start}T${this.time}:00`,
          },
        };
        _dashboardService
          .updateAppointment(payload)
          .then((res) => {
            this.$utils.toast("Reagendamento", "Reagendamento confirmado.");

            this.getRecord();
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