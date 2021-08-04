<template>
  <viewcard--c
    :title="
      $route.params.id > 0 ? 'Atualizar Professor' : 'Cadastrar Professor'
    "
    :btsave="$route.params.id > 0 ? btedit : btcreate"
    :btdelete="$route.params.id > 0 ? btdelete : null"
    :btback="{}"
    :busy="loading"
    @clicked-save="save"
    @clicked-delete="confirmDelete"
  >
    <b-form @submit.prevent>
      <b-row>
        <b-col md="6">
          <b-form-group label="Nome">
            <b-form-input
              v-model="record.name"
              placeholder="Nome do Professor"
              autocomplete="off"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="E-mail">
            <div class="form-label-group">
              <b-form-input
                type="email"
                v-model="record.email"
                placeholder="Informe um e-mail"
                autocomplete="off"
              />
            </div>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group label="Telefone">
            <div class="form-label-group">
              <b-form-input
                v-model="record.phone"
                placeholder="Telefone"
                v-mask="$utils.masked.phone"
              />
            </div>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group label="Celular">
            <div class="form-label-group">
              <b-form-input
                v-model="record.mobile"
                placeholder="Celular"
                v-mask="$utils.masked.phone"
              />
            </div>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group label="Localidade">
            <v-select
              v-if="states.length > 0 && stateSelected"
              v-model="stateSelected"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="states"
              autocomplete="off"
              :clearable="false"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>
  </viewcard--c>
</template>
<script>
import _teachersService from "@/services/teachers-service";
export default {
  data() {
    return {
      btedit: { permission: `permission.teacher.edit` },
      btcreate: { permission: `permission.teacher.create` },
      btdelete: { permission: `permission.teacher.delete` },
      loading: false,
      states: [],
      stateSelected: { label: "estado....", value: "-3" },
      record: {
        id: 0,
        name: "",
        phone: "",
        mobile: "",
        uf: "",
        email: "",
      },
    };
  },
  created() {
    this.states = this.$utils.getStates();
  },
  mounted() {
    this.getRecord();
  },
  methods: {
    getRecord() {
      if (this.$route.params.id > 0) {
        this.loading = true;
        _teachersService
          .find(this.$route.params.id)
          .then((res) => {
            this.record = res.content;
            if (this.record.uf) {
              const _uf = this.states.filter((f) => f.value === this.record.uf);
              if (_uf.length > 0) {
                this.stateSelected = { ..._uf[0] };
              }
            }
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.loading = false));
      }
    },
    save() {
      this.record.uf = this.$utils.getValueSelected(this.stateSelected);

      const payload = { data: { ...this.record } };

      //promisse
      const _createOrUpdate =
        this.record.id <= 0
          ? _teachersService.create(payload)
          : _teachersService.update(payload);

      this.loading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Professor salvo com sucesso.");
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
      _teachersService
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