<template>
  <viewcard--c
    :title="$route.params.id > 0 ? 'Atualizar Telefone' : 'Cadastrar Telefone'"
    :btsave="$route.params.id > 0 ? btedit : btcreate"
    :btdelete="$route.params.id > 0 ? btdelete : null"
    :btback="{}"
    :busy="isloading"
    @clicked-save="validationForm"
    @clicked-delete="confirmDelete"
  >
    <hr class="p-0 m-0 mb-1" />
    <validation-observer ref="blacklistRules">
      <b-form @submit.prevent>
        <b-row>
          <b-col md="6">
            <b-form-group label="Telefone *">
              <validation-provider
                #default="{ errors }"
                name="Telefone"
                rules="required"
              >
                <b-form-input
                  v-model="record.phone"
                  placeholder="Telefone"
                  v-mask="$utils.masked.phone"
                  autocomplete="off"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="6">
            <b-form-group label="Motivo">
              <b-form-textarea
                rows="4"
                v-model="record.reason"
                placeholder="Informe uma breve descrição (opcional)"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </viewcard--c>
</template>
<script>
import _blacklistService from "@/services/dialer/blacklist-service";

import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import pt_br from "vee-validate/dist/locale/pt_BR.json";
import { required } from "@validations";
export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      btedit: { permission: `permission.dialer.blacklist.edit` },
      btcreate: { permission: `permission.dialer.blacklist.create` },
      btdelete: { permission: `permission.dialer.blacklist.delete` },
      isloading: false,
      debounceMilliseconds: 300,
      timeout: null,
      record: {
        id: 0,
        name: false,
        reason: "",
      },
    };
  },
  created() {
    this.getRecord();
    localize("pt_BR", pt_br);
  },
  methods: {
    validationForm() {
      this.$refs.blacklistRules.validate().then((success) => {
        if (success) {
          this.save();
        }
      });
    },
    getRecord() {
      if (this.$route.params.id > 0) {
        this.isloading = true;
        _blacklistService
          .find(this.$route.params.id)
          .then((res) => {
            this.record = res.content;
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.isloading = false));
      }
    },
    save() {
      const payload = this.record;
      debugger;
      //promisse
      const _createOrUpdate =
        this.record.id <= 0
          ? _blacklistService.create(payload)
          : _blacklistService.update(payload);

      this.isloading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Registro salvo com sucesso.");
          this.$router.go(-1);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
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
      _blacklistService
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
<style>
#thumbnail-youtube {
  border: 1px solid #999;
  width: 100px;
  height: 70px;
  border-radius: 10%;
}

#thumbnail-youtube:hover {
  opacity: 0.5;
}
</style>