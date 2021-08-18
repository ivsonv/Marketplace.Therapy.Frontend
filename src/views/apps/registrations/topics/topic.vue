<template>
  <viewcard--c
    :title="$route.params.id > 0 ? 'Atualizar Tema' : 'Cadastrar Tema'"
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
            placeholder="Nome do Usuário"
            autocomplete="off"
          />
        </b-form-group>
      </b-col>
      <b-col md="2">
        <b-card-text class="mb-0"> Experiencia ? </b-card-text>
        <b-form-checkbox
          class="custom-control-success mt-1"
          name="check-button"
          switch
          v-model="record.experience"
        >
          <span class="switch-icon-left">
            <feather-icon icon="CheckIcon" />
          </span>
          <span class="switch-icon-right">
            <feather-icon icon="XIcon" />
          </span>
        </b-form-checkbox>
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
import _topicService from "@/services/topics-service";
export default {
  data() {
    return {
      btedit: { permission: `topic.edit` },
      btcreate: { permission: `topic.create` },
      btdelete: { permission: `topic.delete` },
      loading: false,
      record: {
        id: 0,
        name: "",
        active: true,
        experience: false,
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
        _topicService
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
          ? _topicService.create(payload)
          : _topicService.update(payload);

      this.loading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Tema salvo com sucesso.");
          this.$router.go(-1);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    onDelete() {
      this.loading = true;
      _topicService
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