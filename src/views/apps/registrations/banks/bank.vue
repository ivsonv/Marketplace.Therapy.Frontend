<template>
  <viewcard--c
    :title="$route.params.id > 0 ? 'Atualizar Banco' : 'Cadastrar Banco'"
    :btsave="$route.params.id > 0 ? btedit : btcreate"
    :btdelete="$route.params.id > 0 ? btdelete : null"
    :btback="{}"
    :busy="loading"
    @clicked-save="save"
    @clicked-delete="onDelete"
  >
    <hr class="p-0 m-0 mb-1" />
    <b-row>
      <b-col md="6">
        <b-form-group label="Nome *">
          <b-form-input
            v-model="record.name"
            placeholder="Nome do banco"
            autocomplete="off"
          />
        </b-form-group>
      </b-col>
      <b-col md="4">
        <b-form-group label="Codigo do Banco *">
          <b-form-input
            v-model="record.code"
            placeholder="Codigo do banco"
            autocomplete="off"
          />
        </b-form-group>
      </b-col>
      <b-col md="2">
        <b-card-text class="mb-0"> Ativo </b-card-text>
        <b-form-checkbox
          class="custom-control-success mt-1"
          name="check-button"
          switch
          v-model="record.active"
        >
          <span class="switch-icon-left">
            <feather-icon icon="CheckIcon" />
          </span>
          <span class="switch-icon-right">
            <feather-icon icon="XIcon" />
          </span>
        </b-form-checkbox>
      </b-col>
    </b-row>
  </viewcard--c>
</template>
<script>
import _bankService from "@/services/bank-service";
export default {
  data() {
    return {
      btedit: { permission: `bank.edit` },
      btcreate: { permission: `bank.create` },
      btdelete: { permission: `bank.delete` },
      loading: false,
      record: {
        id: 0,
        name: "",
        code: "",
        active: true,
      },
    };
  },
  mounted() {
    this.getRecord();
  },
  methods: {
    getRecord() {
      if (this.$route.params.id > 0) {
        this.loading = true;
        _bankService
          .find(this.$route.params.id)
          .then((res) => {
            this.record = res.content;
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.loading = false));
      }
    },
    save() {
      const payload = { data: { ...this.record } };

      const _createOrUpdate =
        this.record.id <= 0
          ? _bankService.create(payload)
          : _bankService.update(payload);

      this.loading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Salvo com sucesso.");
          this.$router.go(-1);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    onDelete() {
      this.loading = true;
      _bankService
        .delete(this.record.id)
        .then(() => {
          this.$utils.toast("Notificação", "Excluido com sucesso.");
          this.$router.go(-1);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
  },
};
</script>