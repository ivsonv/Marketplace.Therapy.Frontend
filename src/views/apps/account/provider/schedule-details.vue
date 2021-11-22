<template>
  <view--c permission="account.provider" :busy="isloading" class="p-1">
    <!-- details -->
    <section v-if="appointment">
      <div class="row">
        <div class="col-6">
          <strong>PACIENTE</strong>
          <p class="text-secondary">
            {{ `${appointment.customer.name}` }}
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
        <div class="col-6">
          <strong>Fuso</strong>
          <p class="text-secondary">
            Fuso Horário de
            <strong style="color: var(--danger)"> * São Paulo</strong>
          </p>
        </div>
      </div>

      <!-- ações -->
      <hr />
      <div class="row" v-if="appointment">
        <div class="col-12">
          <b-button variant="info" size="sm" @click="goInitConference">
            <!-- VideoOffIcon -->
            <feather-icon icon="VideoIcon" size="30" />
            <p class="m-0 p-0 text-white" style="font-size: 16px">
              Inicia video
            </p>
          </b-button>
          <b-button
            v-if="appointment.dsStatus === 'Confirmado'"
            @click="goCancel"
            variant="danger"
            class="ml-1"
            size="sm"
          >
            <!-- VideoOffIcon -->
            <feather-icon icon="XIcon" size="30" />
            <p class="m-0 p-0 text-white" style="font-size: 16px">Cancelar</p>
          </b-button>
          <b-button variant="warning" size="sm" class="ml-1" @click="goInvoice">
            <feather-icon icon="FileTextIcon" size="30" />
            <p class="m-0 p-0 text-white" style="font-size: 16px">
              Gerar Recibo
            </p>
          </b-button>
        </div>
      </div>
    </section>
  </view--c>
</template>

<script>
import _providerService from "@/services/account-provider-service";
import _paymentService from "@/services/payment-service";
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
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
  destroyed() {
    this.$destroy();
  },
  methods: {
    getAppointment() {
      this.isloading = true;
      _providerService
        .appointmentById(this.id)
        .then((res) => {
          this.appointment = res.content.appointment;
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    goInvoice() {
      this.$router.push({
        name: "sou-provider-agendamento-invoice",
        params: { id: this.id },
      });
    },
    goInitConference() {
      this.$router.push({
        name: "sou-provider-agendamento-video",
        params: {
          paciente: "n",
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
  },
};
</script>