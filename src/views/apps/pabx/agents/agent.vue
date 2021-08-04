<template>
  <b-overlay :show="isloading" spinner-variant="primary" spinner-type="grow">
    <!-- Form -->
    <validation-observer ref="agentRules">
      <b-form class="p-2" @submit.prevent v-if="record">
        <b-row>
          <b-col cols="6">
            <b-form-group label="Nome do Agente *">
              <validation-provider
                #default="{ errors }"
                name="Nome"
                rules="required"
              >
                <b-form-input
                  v-model="record.callerid"
                  placeholder="Nome"
                  autocomplete="off"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col cols="6">
            <b-form-group label="Ramal *">
              <validation-provider
                #default="{ errors }"
                name="Ramal"
                rules="required"
              >
                <b-form-input
                  v-model="record.id"
                  placeholder="Ramal"
                  type="number"
                  autocomplete="off"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-row>
        <button--c
          :variant="'info'"
          :iconsize="'20'"
          :icon="null"
          :permission="
            record.id > 0
              ? 'permission.pabx.agents.edit'
              : 'permission.pabx.agents.create'
          "
          :title="'Salvar'"
          @clicked="validationForm"
          class="mr-1"
        />
      </b-form>
    </validation-observer>
  </b-overlay>
</template>
<script>
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import _pabxService from "@/services/pabx-service";
import pt_br from "vee-validate/dist/locale/pt_BR.json";
import { required } from "@validations";
export default {
  props: {
    dto: {
      type: Object,
      required: true,
    },
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      isloading: false,
      record: {
        id: "",
        callerid: "",
      },
    };
  },
  created() {
    this.getInitials();
    localize("pt_BR", pt_br);
  },
  methods: {
    getInitials() {
      this.record = this.dto;
    },
    getRecord() {
      if (this.dto.id > 0) {
        this.isloading = true;
        _pabxService
          .find(this.dto.id)
          .then((res) => {
            this.record = res.content;
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.isloading = false));
      }
    },
    validationForm() {
      this.$refs.agentRules.validate().then((success) => {
        if (success) {
          this.save();
        }
      });
    },
    save() {
      debugger;
      const payload = { data: { ...this.record } };
      const _createOrUpdate = this.record.Novo
        ? _pabxService.create(payload)
        : _pabxService.update(payload);

      this.isloading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Sucesso", "Atualizado com sucesso.");
          this.$emit("result", { status: "ok" });
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
  },
};
</script>