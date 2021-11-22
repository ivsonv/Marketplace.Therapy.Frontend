<template>
  <viewcard--c title="MINHA CONTA" :busy="loading">
    <b-row>
      <b-col md="6">
        <b-form-group label="Nome *">
          <b-form-input
            v-model="record.name"
            placeholder="seu nome completo..."
            autocomplete="off"
            :state="!!record.name"
          />
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="E-mail *">
          <b-form-input
            v-model="record.email"
            placeholder="seu e-mail"
            autocomplete="off"
            :state="!!record.email"
          />
        </b-form-group>
      </b-col>
      <b-col cols="6" md="3">
        <b-form-group label="CPF *">
          <b-form-input
            :state="!!record.cpf"
            v-mask="$utils.masked.cpf"
            v-model="record.cpf"
            placeholder="cpf..."
            autocomplete="off"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <hr />
    <b-row>
      <b-col cols="12">
        <b-button @click="save" variant="gradient-info">
          Salvar Alterações
        </b-button>
      </b-col>
    </b-row>
  </viewcard--c>
</template>

<script>
import _account from "@/services/account-customer-service";
export default {
  data() {
    return {
      loading: false,
      record: {
        id: 0,
        name: "",
        cpf: "",
        email: "",
      },
    };
  },
  destroyed() {
    this.$destroy();
  },
  created() {
    this.getLoadInit();
  },
  methods: {
    async getLoadInit() {
      this.loading = true;
      this.getRecord();
    },
    save() {
      this.loading = true;
      _account
        .update(this.record)
        .then(() => {
          this.$utils.toast("Notificação", "Dados alterados com sucesso.");
          this.getRecord();
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    getRecord() {
      this.loading = true;
      _account
        .find()
        .then((res) => {
          this.record = res.content.customer.customer[0];
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
  },
};
</script>