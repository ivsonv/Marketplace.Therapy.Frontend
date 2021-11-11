<template>
  <viewcard--c title="MINHAS SESSÕES" subtitle="* Fuso horário de São Paulo">
    <view--c permission="account.customer" :busy="isloading">
      <b-table
        @row-clicked="onClickSelected"
        :busy="isloading"
        :fields="fields"
        :items="list"
        responsive
        striped
        hover
      >
        <template #cell(actions)="data">
          <feather-icon
            icon="EyeIcon"
            size="22"
            class="mr-1"
            @click="onClickSelected(data.item)"
          />
          <feather-icon
            icon="FileTextIcon"
            size="21"
            @click="onClickSelected(data.item)"
          />
          <!-- Ver Detalhes -->
        </template>
        <template #cell(data)="data">
          {{ data.item.data }} <br />
          {{ data.item.hora }}h
        </template>
        <template #cell(fuso)>
          <strong style="color: var(--danger)"> * São Paulo </strong></template
        >
      </b-table>
      <div v-if="list.length <= 0">Nenhum Registro Encontrado.</div>
      <div class="d-flex justify-content-center">
        <b-button @click="getLoadMore" variant="primary" v-if="more" pill>
          Carregar mais
        </b-button>
      </div>
    </view--c>

    <!-- Details appointment -->
    <b-sidebar
      sidebar-class="sidebar-lg"
      bg-variant="white"
      v-model="isActiveDetails"
      right
      backdrop
      shadow
      no-header
    >
      <template #default="{ hide }" v-if="isActiveDetails">
        <div
          class="
            d-flex
            justify-content-between
            align-items-center
            content-sidebar-header
            px-2
            py-1
          "
        >
          <h5 class="mb-0">Detalhes da Sessão - Cód. #{{ appointmentid }}</h5>
          <div>
            <feather-icon
              class="ml-1 cursor-pointer"
              icon="XIcon"
              size="16"
              @click="hide"
            />
          </div>
        </div>
        <v-appointment v-if="appointmentid > 0" :id="appointmentid" />
      </template>
    </b-sidebar>
  </viewcard--c>
</template>

<script>
import _customerService from "@/services/account-customer-service";
import appointmentDetails from "./appointment-details.vue";
export default {
  components: {
    "v-appointment": appointmentDetails,
  },
  data() {
    return {
      isActiveDetails: false,
      isloading: false,
      currentePage: 1,
      search: null,
      more: false,
      size: 20,
      fields: [
        { key: "actions", label: "Ações", thStyle: { width: "120px" } },
        { key: "provider_name", label: "Psicólogo" },
        { key: "data", label: "Agendado" },
        { key: "dsStatus", label: "Status" },
        { key: "fuso", label: "Fuso Horário" },
      ],
      list: [],
    };
  },
  destroyed() {
    this.$destroy();
  },
  created() {
    this.getRecords(this.currentePage);
  },
  methods: {
    getRecords(_page) {
      this.isloading = true;
      _customerService
        .appointments(_page)
        .then((res) => {
          if (res.content) {
            this.more = res.content.appointments.length >= this.size;
            this.list.push(...res.content.appointments);
            this.currentePage = _page;
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    getLoadMore() {
      this.getRecords(this.currentePage + 1);
    },
    filter() {
      this.currentePage = 1;
      this.list = [];
      this.getRecords(this.currentePage);
    },
    onClickSelected(record, _) {
      this.appointmentid = record.id;
      this.isActiveDetails = true;
    },
  },
};
</script>