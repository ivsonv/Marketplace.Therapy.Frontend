<template>
  <viewcard--c
    :title="
      $route.params.id > 0 ? 'Atualizar Psicólogo' : 'Cadastrar Psicólogo'
    "
    :btsave="$route.params.id > 0 ? btedit : btcreate"
    :btdelete="$route.params.id > 0 ? btdelete : null"
    :btback="{}"
    :busy="loading"
    @clicked-save="save"
    @clicked-delete="confirmDelete"
  >
    <hr class="p-0 m-0 mb-1" />
    <b-row>
      <b-col md="4">
        <b-form-group label="Nome *">
          <b-form-input
            v-model="record.name"
            placeholder="Nome do Usuário"
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
import _providerService from "@/services/providers-service";
export default {
  data() {
    return {
      btedit: { permission: `provider.edit` },
      btcreate: { permission: `provider.create` },
      btdelete: { permission: `provider.delete` },
      loading: false,
      groups: [],
      groupsSelected: [],
      record: {
        id: 0,
        name: "",
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
        _providerService
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

      //promisse
      const _createOrUpdate =
        this.record.id <= 0
          ? _providerService.create(payload)
          : _providerService.update(payload);

      this.loading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Tema salvo com sucesso.");
          this.$router.go(-1);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    confirmDelete() {
      this.$swal({
        title: "Tem certeza?",
        text: "Isso não pode ser revertido!",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Sim, quero excluir!",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-info",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.excluir();
        }
      });
    },
    excluir() {
      this.loading = true;
      _providerService
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