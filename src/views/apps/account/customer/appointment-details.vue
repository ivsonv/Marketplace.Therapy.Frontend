<template>
  <view--c permission="account.customer" :busy="isloading" class="p-1">
    <!-- details -->
    <div class="row">
      <div class="col-6">
        <strong>PSICÓLOGO</strong>
        <p>IVSON VITAL DE SOUSA</p>
      </div>
      <div class="col-6">
        <strong>Status</strong>
        <p>Confirmado</p>
      </div>
      <div class="col-6">
        <strong>Data/Hora</strong>
        <p>20/08/2021 ás 10:30h</p>
      </div>
      <div class="col-6">
        <strong>Fuso</strong>
        <p>
          Fuso Horário de
          <strong style="color: var(--danger)"> * São Paulo</strong>
        </p>
      </div>
    </div>

    <!-- ações -->
    <hr />
    <div class="row">
      <div class="col-12">
        <b-button variant="info" size="sm">
          <!-- VideoOffIcon -->
          <feather-icon icon="VideoIcon" size="30" />
          <p class="m-0 p-0 text-white" style="font-size: 16px">Inicia video</p>
        </b-button>
        <b-button variant="danger" size="sm" class="ml-1">
          <!-- VideoOffIcon -->
          <feather-icon icon="XIcon" size="30" />
          <p class="m-0 p-0 text-white" style="font-size: 16px">Cancelar</p>
        </b-button>
        <b-button variant="primary" size="sm" class="ml-1">
          <!-- VideoOffIcon -->
          <feather-icon icon="FileTextIcon" size="30" />
          <p class="m-0 p-0 text-white" style="font-size: 16px">Recibo</p>
        </b-button>
      </div>
    </div>
  </view--c>
</template>

<script>
import _customerService from "@/services/account-customer-service";
export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isloading: false,
    };
  },
  methods: {
    getAppointment() {},
    // getRecords(_page) {
    //   this.isloading = true;
    //   _customerService
    //     .appointments(_page)
    //     .then((res) => {
    //       if (res.content) {
    //         this.more = res.content.appointments.length >= this.size;
    //         this.list.push(...res.content.appointments);
    //         this.currentePage = _page;
    //       }
    //     })
    //     .catch((error) => this.$utils.toastError("Notificação", error))
    //     .finally(() => (this.isloading = false));
    // },
  },
};
</script>