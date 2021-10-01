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
            {{ appointment.start }} ás {{ appointment.hour.substring(0, 5) }}h
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
      <div class="row">
        <div class="col-12">
          <b-button variant="info" size="sm" @click="goInitConference">
            <!-- VideoOffIcon -->
            <feather-icon icon="VideoIcon" size="30" />
            <p class="m-0 p-0 text-white" style="font-size: 16px">
              Inicia video
            </p>
          </b-button>
          <b-button variant="danger" size="sm" class="ml-1">
            <!-- VideoOffIcon -->
            <feather-icon icon="XIcon" size="30" />
            <p class="m-0 p-0 text-white" style="font-size: 16px">Cancelar</p>
          </b-button>
          <b-button variant="warning" size="sm" class="ml-1" @click="goInvoice">
            <!-- VideoOffIcon -->
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
  },
};
</script>