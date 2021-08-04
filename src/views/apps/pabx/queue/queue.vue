<template>
  <b-overlay :show="isloading" spinner-variant="primary" spinner-type="grow">
    <!-- Form -->
    <validation-observer ref="agentRules">
      <b-form class="p-2" @submit.prevent v-if="record">
        <b-row>
          <b-col cols="12">
            <b-form-group label="Nome da Fila *">
              <validation-provider
                #default="{ errors }"
                name="Nome"
                rules="required"
              >
                <b-form-input
                  v-model="record.name"
                  placeholder="Nome"
                  autocomplete="off"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="d-flex align-items-center">
          <b-col cols="12">
            <b-form-group label="Agentes">
              <vue-autosuggest
                v-model="queryAgents"
                :suggestions="agents"
                :input-props="inputAgentsProps"
                :section-configs="agentConfigs"
                :loading="isloadingAutocomplete"
                @input="getAgents"
              >
                <template slot-scope="{ suggestion }">
                  <h5 class="text-capitalize">
                    {{ suggestion.item.callerid }}
                  </h5>
                  <small v-if="suggestion.item.id">
                    {{ suggestion.item.id }}
                  </small>
                </template>
              </vue-autosuggest>
            </b-form-group>
          </b-col>
          <!-- <b-col cols="2" sm="1">
            <b-button
              variant="info"
              class="btn-icon mt-1"
              @click="openTeacherModal()"
              style="float: right"
            >
              <feather-icon icon="PlusIcon" />
            </b-button>
          </b-col> -->

          <b-col cols="11" class="mb-2">
            <b-badge
              v-for="(tt, index) in agentsSelected"
              @click="removeAgent(tt)"
              class="mr-1 mb-1 cursor-pointer"
              :key="index"
            >
              {{ tt.name }}
              <feather-icon icon="XIcon" />
            </b-badge>
          </b-col>
        </b-row>
        <b-button variant="info" class="mr-1" @click="validationForm()">
          Salvar
        </b-button>
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
      isloadingAutocomplete: false,
      agentsSelected: [],
      queryAgents: "",
      agents: [],
      debounceMilliseconds: 300,
      inputAgentsProps: {
        id: "autoqueue__input_ajax",
        placeholder: "Digite o nome do agente",
        class: "form-control",
        name: "ajax",
      },
      agentConfigs: {
        agents: {
          limit: 20,
          label: "Agentes",
          onSelected: (selected) => {
            if (!this.agentsSelected.some((s) => s.id === selected.item.id)) {
              this.agentsSelected.push({
                name: selected.item.callerid,
                id: selected.item.id,
              });
            } else {
              this.$utils.toastError("OPS!!!", "Agente já adicionado.");
            }
            this.queryAgents = "";
          },
        },
      },
      record: {
        id: "",
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
      if (this.dto.agents) {
        this.agentsSelected = this.dto.agents.map((m) => {
          return {
            id: m.id,
            name: m.name,
          };
        });
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
      if (this.agentsSelected) {
        this.record.agents = this.agentsSelected.map((m) => {
          return {
            agent_id: m.id,
          };
        });
      }

      const payload = { data: { ...this.record } };
      console.log(payload);
      // const _createOrUpdate = this.record.new
      //   ? _pabxService.create(payload)
      //   : _pabxService.update(payload);

      // this.isloading = true;
      // _createOrUpdate
      //   .then(() => {
      //     this.$utils.toast("Sucesso", "Atualizado com sucesso.");
      //     this.$emit("result", { status: "ok" });
      //   })
      //   .catch((error) => this.$utils.toastError("Notificação", error))
      //   .finally(() => (this.isloading = false));
    },
    getAgents() {
      if (this.queryAgents && this.queryAgents.length >= 3) {
        this.timeout = setTimeout(() => {
          if (!this.isloadingAutocomplete) {
            this.isloadingAutocomplete = true;
            _pabxService
              .show(1, this.queryAgents)
              .then((res) => {
                this.agents = [{ name: "agents", data: res.content }];
              })
              .catch((error) => this.$utils.toastError("Notificação", error))
              .finally(() => (this.isloadingAutocomplete = false));
          }
        }, this.debounceMilliseconds);
      }
    },
    removeAgent(_tt) {
      this.agentsSelected = this.agentsSelected.filter((f) => f.id !== _tt.id);
      this.queryAgents = "";
    },
  },
};
</script>