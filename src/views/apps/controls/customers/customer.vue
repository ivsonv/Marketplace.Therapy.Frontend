<template>
  <viewcard--c
    title="Dados do cliente"
    :btsave="null"
    :btdelete="null"
    :btback="{}"
    :busy="loading"
    @clicked-save="save"
    @clicked-delete="onDelete"
  >
    <hr />
    <b-tabs pills id="tabs-customer" content-class="mt-2">
      <b-tab title="1. Dados Cliente">
        <b-row>
          <b-col md="6">
            <b-form-group label="Nome *">
              <b-form-input
                :state="!!record.name"
                v-model="record.name"
                placeholder="Nome do Psicólogo"
                autocomplete="off"
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
          <b-col cols="6" md="3">
            <b-form-group label="CNPJ">
              <b-form-input
                v-mask="$utils.masked.cnpj"
                v-model="record.cnpj"
                placeholder="CNPJ"
                autocomplete="off"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Email *">
              <b-form-input
                :state="!!record.email"
                v-model="record.email"
                placeholder="E-mail"
                autocomplete="off"
                type="email"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <!-- <h1 class="py-1">Endereço</h1>
        <hr class="p-0 m-0 mb-1" />
        <b-row>
          <b-col md="3">
            <b-form-group label="CEP *">
              <b-input-group>
                <b-form-input
                  :state="!!address.zipcode"
                  v-mask="$utils.masked.cep"
                  v-model="address.zipcode"
                  placeholder="cep..."
                  autocomplete="off"
                  maxlength="10"
                />
                <b-input-group-append>
                  <b-button
                    variant="gradient-info"
                    @click="getAddress(address.zipcode, address)"
                  >
                    <feather-icon
                      class="cursor-pointer"
                      color="var(--white)"
                      icon="SearchIcon"
                    />
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="UF *">
              <v-select
                :class="`${optionsUfSelected ? 'state-green' : 'state-danger'}`"
                v-model="optionsUfSelected"
                :options="optionsUf"
                autocomplete="off"
              />
            </b-form-group>
          </b-col>

          <b-col md="6"></b-col>
          <b-col md="6">
            <b-form-group label="Cidade *">
              <b-form-input
                :state="!!address.city"
                v-model="address.city"
                placeholder="cidade..."
                autocomplete="off"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Bairro *">
              <b-form-input
                :state="!!address.neighborhood"
                v-model="address.neighborhood"
                placeholder="bairro..."
                autocomplete="off"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Logradouro *">
              <b-form-input
                :state="!!address.address"
                v-model="address.address"
                placeholder="Logradouro..."
                autocomplete="off"
              />
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Complemento *">
              <b-form-input
                :state="!!address.complement"
                v-model="address.complement"
                placeholder="Complemento..."
                autocomplete="off"
              />
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group label="Número">
              <b-form-input
                :state="!!address.number"
                v-model="address.number"
                placeholder="Número..."
                autocomplete="off"
              />
            </b-form-group>
          </b-col>
        </b-row> -->
      </b-tab>
      <b-tab title="2. Agendamentos" @click="getAppointments">
        <div class="row" v-if="this.appointments.length > 0">
          <b-col md="12">
            <b-table
              :busy="loading"
              :fields="fields"
              :items="appointments"
              responsive
              striped
              hover
            >
              <template #cell(active)="data">
                <div class="text-center">
                  <b-avatar
                    :variant="data.item.active ? 'success' : 'danger'"
                    size="25"
                  >
                    <feather-icon
                      size="16"
                      :icon="data.item.active ? 'CheckIcon' : 'XIcon'"
                    />
                  </b-avatar>
                </div>
              </template>
              <template #cell(cnpj)="data">
                <div class="text-nowrap">
                  <b-form-input
                    v-model="data.item.cnpj"
                    v-mask="$utils.masked.cnpj"
                    class="d-none"
                  />
                  <b-form-input
                    v-model="data.item.cpf"
                    v-mask="$utils.masked.cpf"
                    class="d-none"
                  />
                </div>
                <div class="text-nowrap">
                  {{
                    data.item.cnpj
                      ? data.item.cnpj
                      : data.item.cpf
                      ? data.item.cpf
                      : "--"
                  }}
                </div>
              </template>
              <template #cell(actions)="data">
                <div class="text-nowrap">
                  <feather-icon
                    @click="goInvoice(data.item)"
                    icon="FileTextIcon"
                    class="mx-1"
                    size="22"
                  />
                </div>
              </template>
            </b-table>
          </b-col>
        </div>
        <div v-else>
          <h1>NENHUM AGENDAMENTO</h1>
        </div>
      </b-tab>
    </b-tabs>
  </viewcard--c>
</template>

<script>
import _customerService from "@/services/customers-service";
import _locationsService from "@/services/locations-service";

export default {
  data() {
    return {
      btedit: { permission: `customer.edit` },
      btcreate: { permission: `customer.create` },
      btdelete: { permission: `customer.delete` },
      loading: false,
      isLoadingBank: false,
      optionsUf: [],
      optionsUfSelected: null,
      fields: [
        { key: "provider.name", label: "Psicologo" },
        { key: "payment.ds", label: "Pagamento" },
        { key: "price", label: "Valor" },
        { key: "booking_date", label: "Data Agendamento" },
        { key: "created_at", label: "Criado Em" },
        { key: "actions", label: "Ações", thClass: "text-center" },
      ],
      appointments: [],
      record: {
        id: 0,
        name: "",
        cpf: "",
        cnpj: "",
        email: "",
      },
      address: {
        address: "",
        city: "",
        complement: "",
        neighborhood: "",
        number: "",
        uf: "",
        zipcode: "",
      },
    };
  },
  created() {
    this.getLoadInit();
  },
  methods: {
    async getLoadInit() {
      this.optionsUf = this.$utils.getStates();
      this.getRecord();
    },

    save() {
      if (this.optionsUfSelected) {
        this.address.uf = this.optionsUfSelected.value;
      }

      this.record.address = [];
      this.record.address.push(this.address);

      let _topics = [];
      if (this.optionsTopicsSelectd && this.optionsTopicsSelectd.length > 0) {
        _topics.push(...this.optionsTopicsSelectd);
      }

      if (
        this.optionsTopicsExperienceSelectd &&
        this.optionsTopicsExperienceSelectd.length > 0
      ) {
        _topics.push(...this.optionsTopicsExperienceSelectd);
      }

      this.record.topics = _topics.map((m) => {
        return {
          experience: m.experience,
          topic_id: m.id,
        };
      });

      // Experience 8 opções
      if (this.record.topics) {
        if (this.record.topics.filter((f) => !f.experience).length > 3) {
          this.$utils.toastError(
            "Notificação",
            "São pemitidos 3 especilidade."
          );
          return;
        }

        if (this.record.topics.filter((f) => f.experience).length > 8) {
          this.$utils.toastError(
            "Notificação",
            "São Pemitidos 8 experiências."
          );
          return;
        }
      }

      if (this.optionsLanguages) {
        this.record.languages = this.optionsLanguages
          .filter((f) => f.selected)
          .map((m) => {
            return {
              language_id: m.id,
            };
          });
      }

      this.record.bankAccounts.forEach((_bank) => {
        if (this.optionsTypeAccountSelected)
          _bank.account_bank_type = this.optionsTypeAccountSelected.value;

        if (this.optionsBankSelected)
          _bank.bank_code = this.optionsBankSelected.value;
      });
      if (this.record.price) {
        this.record.price = this.record.price.toString().replace(",", ".");
      }

      // let payload = new FormData();
      // if (this.fileImageSelected) {
      //   payload.append("profile", this.fileImageSelected);
      // }
      // if (this.fileSignatureSelected) {
      //   payload.append("sig", this.fileSignatureSelected);
      // }
      // payload.append("data", JSON.stringify(this.record));
      //this.$utils.toast("Notificação", "Função de atualizar não disponivel.");

      const payload = {
        data: this.record,
      };

      const _createOrUpdate = _providerService.update(payload);
      this.loading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Salvo com sucesso.");
          this.getRecord();
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    getRecord() {
      this.loading = true;
      _customerService
        .find(this.$route.params.id)
        .then((res) => {
          this.record = res.content.customer[0];

          // caso não tenha endereço.
          // if (!this.record.address || this.record.address.length <= 0) {
          //   this.record.address = [];
          //   this.address.optionsUfSelected = null;
          // } else {
          //   this.address = this.record.address[0];
          //   this.optionsUfSelected = this.optionsUf.filter(
          //     (f) => f.value === this.address.uf
          //   )[0];
          // }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    getAddress(zipcode, item) {
      this.loading = true;
      _locationsService
        .findZipCode(zipcode)
        .then((res) => {
          if (res.content && res.content.address) {
            item.neighborhood = res.content.address.neighborhood;
            item.address = res.content.address.address;
            item.city = res.content.address.city;
            item.uf = res.content.address.uf;
            if (item.uf) item.uf = item.uf.toUpperCase().trim();

            //
            if (this.optionsUf.some((s) => s.value === item.uf)) {
              this.optionsUfSelected = this.optionsUf.filter(
                (f) => f.value === item.uf
              )[0];
            }
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    onDelete() {
      this.$utils.toast("Notificação", "Função não disponivel.");
    },
    getAppointments() {
      if (this.appointments.length <= 0) {
        this.loading = true;
        _customerService
          .showAppointments(this.$route.params.id)
          .then((res) => {
            this.appointments = res.content;
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.loading = false));
      }
    },
    goInvoice(item) {
      // this.$router.push({
      //   name: "sou-provider-agendamento-invoice",
      //   params: { id: item.id },
      // });
    },
  },
};
</script>
<style>
#tabs-customer__BV_tab_controls_ li {
  font-size: 20px;
}

.state-green .vs__dropdown-toggle {
  border-color: var(--success);
}

.state-danger .vs__dropdown-toggle {
  border-color: var(--danger);
}
</style>