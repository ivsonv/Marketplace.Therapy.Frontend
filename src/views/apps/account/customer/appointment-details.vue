<template>
  <view--c permission="account.customer" :busy="isloading" class="p-1">
    <!-- details -->
    <section v-if="appointment">
      <b-modal
        v-if="appointment.provider"
        ref="modal-primary"
        ok-only
        ok-title="Confirmar novo hórario"
        modal-class="modal-primary"
        hide-footer
        centered
        :title="`REMARCAR HORÁRIO COM ${appointment.provider.fantasy_name} ${appointment.provider.company_name} ?`"
      >
        <div class="row">
          <div id="box-hours" class="col-12 text-center shadow p-0">
            <!-- horários -->
            <h2 v-if="loadinghours">Processando horários... <spinner--c /></h2>
            <hours--v
              v-if="!loadinghours"
              :qtdDisplayDates="qtdDisplayDates"
              :contents="contents"
              :dates="dates"
              :provider="appointment.provider"
              @previushours="previushours"
              @previushoursMobile="previushoursMobile"
              @nexthours="nexthours"
              @nexthoursMobile="nexthoursMobile"
              @confirmSelected="reschedule"
            />
          </div>
        </div>
      </b-modal>

      <div class="row">
        <div class="col-12">
          <strong>PSICÓLOGO</strong>
          <p class="text-secondary">
            {{
              `${appointment.provider.fantasy_name} 
               ${appointment.provider.company_name}`
            }}
          </p>
        </div>
        <div class="col-6">
          <strong>Status</strong>
          <p class="text-secondary">{{ appointment.dsStatus }}</p>
        </div>
        <div class="col-6">
          <strong>Data/Hora</strong>
          <p class="text-secondary">
            {{ appointment.start }} às {{ appointment.hour.substring(0, 5) }}h
          </p>
        </div>
        <div class="col-12 col-lg-6">
          <strong>Fuso</strong>
          <p class="text-secondary">
            Fuso Horário de
            <strong style="color: var(--danger)"> * São Paulo</strong>
          </p>
        </div>
      </div>

      <hr />
      <div class="row">
        <div
          class="col-lg-12 d-flex"
          v-if="appointment.dsStatus === 'Confirmado'"
        >
          <b-button variant="info" size="sm" @click="goInitConference">
            <!-- VideoOffIcon -->
            <feather-icon icon="VideoIcon" size="30" />
            <p class="m-0 p-0 text-white" style="font-size: 16px">
              Iniciar video
            </p>
          </b-button>
          <b-button variant="warning" size="sm" class="ml-1" @click="goInvoice">
            <feather-icon icon="FileTextIcon" size="30" />
            <p class="m-0 p-0 text-white" style="font-size: 16px">
              Gerar Recibo
            </p>
          </b-button>
          <b-button
            variant="primary"
            class="ml-1"
            size="sm"
            @click="openModalRes"
          >
            <feather-icon icon="CalendarIcon" size="30" />
            <p class="m-0 p-0 text-white" style="font-size: 16px">Remarcar</p>
          </b-button>
        </div>
        <!-- <div class="col-6 col-lg-12" v-if="appointment.dsStatus === 'Pendente'">
          <b-button variant="primary" class="ml-1" size="sm" @click="buy">
            <feather-icon icon="CreditCardIcon" size="30" />
            <p class="m-0 p-0 text-white" style="font-size: 16px">Pagar</p>
          </b-button>
        </div> -->
      </div>
    </section>
  </view--c>
</template>

<script>
import _customerService from "@/services/account-customer-service";
import _paymentService from "@/services/payment-service";
import _ecommerce from "@/services/ecommerce-service";
import BoxHours from "../../../pages/home/components/box-hours.vue";

export default {
  components: {
    "hours--v": BoxHours,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isloading: false,
      appointment: null,

      loadinghours: false,
      dates: null,
      horasp: null,
      qtdDisplayDates: 0,
      contents: [],
    };
  },
  destroyed() {
    this.$destroy();
  },
  created() {
    this.getAppointment();
  },
  methods: {
    getAppointment() {
      this.isloading = true;
      _customerService
        .appointmentById(this.id)
        .then((res) => {
          this.appointment = res.content.appointment;
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    goInvoice() {
      this.$router.push({
        name: "sou-paciente-agendamento-invoice",
        params: { id: this.id },
      });
    },
    goInitConference() {
      this.$router.push({
        name: "sou-paciente-agendamento-video",
        params: {
          paciente: "sim",
          id: this.id,
        },
      });
    },
    goCancel() {
      this.$swal({
        title: "Tem certeza deseja cancelar agendamento?",
        text: "Isso não pode ser revertido!",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sim, quero cancelar!",
        cancelButtonText: "Não",
        customClass: {
          confirmButton: "btn btn-info",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.confirmCancel();
        }
      });
    },
    confirmCancel() {
      const payload = {
        code: this.id,
        pacient: true,
      };

      this.isloading = true;
      _paymentService
        .cancel(payload)
        .then(() => {
          this.getAppointment();
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    nexthours() {
      const _date = this.dates[3].date;

      // já buscou antes
      const _cm = this.contents.filter((f) => f.dates[0].date === _date)[0];
      if (_cm) {
        this.qtdDisplayDates = _cm.displayDates;
        this.dates = _cm.dates;
      } else {
        this.getProviderHours(_date);
      }
    },
    nexthoursMobile() {
      const _date = this.dates[1].date;

      // já buscou antes
      const _cm = this.contents.filter((f) => f.dates[0].date === _date)[0];
      if (_cm) {
        this.qtdDisplayDates = _cm.displayDates;
        this.dates = _cm.dates;
      } else {
        this.getProviderHours(_date);
      }
    },
    previushours() {
      const _date = this.dates[0].date;
      const _cm = this.contents.filter((f) => f.dates[3].date === _date)[0];
      if (_cm) {
        this.qtdDisplayDates = _cm.displayDates;
        this.dates = _cm.dates;
      }
    },
    previushoursMobile() {
      const _date = this.dates[0].date;
      const _cm = this.contents.filter((f) => f.dates[1].date === _date)[0];
      if (_cm) {
        this.qtdDisplayDates = _cm.displayDates;
        this.dates = _cm.dates;
      }
    },

    getProviderHours(dt_start) {
      this.loadinghours = true;
      _ecommerce
        .showProviderHours(this.appointment.provider.link, dt_start)
        .then((_res) => {
          this.contents.push(_res.content);
          this.qtdDisplayDates = _res.content.displayDates;

          _res.content.dates.forEach((_datee) => {
            _datee.date = _datee.date.substr(0, 10);
          });
          this.dates = _res.content.dates;
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loadinghours = false));
    },

    reschedule(payload) {
      const _req = {
        data: {
          start: `${payload.date}T${payload.hour}`,
          id: this.id,
        },
      };

      this.loadinghours = true;
      _customerService
        .reeschedule(_req)
        .then((_res) => {
          this.$refs["modal-primary"].hide();

          this.$utils.toast("Notificação", "Reagendado com sucesso.");
          this.getAppointment();
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loadinghours = false));
    },
    openModalRes() {
      this.getProviderHours(null);
      this.$refs["modal-primary"].show();
    },
  },
};
</script>