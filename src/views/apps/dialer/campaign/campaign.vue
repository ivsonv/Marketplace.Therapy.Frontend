<template>
  <viewcard--c
    :title="$route.params.id > 0 ? 'Atualizar Campanha' : 'Cadastrar Campanha'"
    :btsave="$route.params.id > 0 ? btedit : btcreate"
    :btdelete="null"
    :btback="{}"
    :busy="isloading"
    @clicked-save="validationForm"
  >
    <validation-observer ref="campaignRules">
      <b-form @submit.prevent>
        <b-row>
          <b-col md="6">
            <b-form-group label="Nome *">
              <validation-provider
                #default="{ errors }"
                name="Nome da Campanha"
                rules="required"
              >
                <b-form-input
                  v-model="record.name"
                  :state="errors.length > 0 ? false : null"
                  placeholder="Nome"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col cols="6" md="6">
            <b-form-group label="Status">
              <v-select
                v-if="status.length > 0"
                v-model="statusSelected"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="status"
                autocomplete="off"
                :clearable="false"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
            <b-form-group label="Parâmetros de Campanha *">
              <validation-provider
                #default="{ errors }"
                name="Parâmetros de Campanha"
                rules="required"
              >
                <v-select
                  v-if="campaignParameters.length > 0"
                  v-model="campaignParametersSelected"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="campaignParameters"
                  autocomplete="off"
                  :clearable="false"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Horário de Funcionamento *">
              <validation-provider
                #default="{ errors }"
                name="Horário de Funcionamento"
                rules="required"
              >
                <v-select
                  v-if="hours.length > 0"
                  v-model="hoursSelected"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="hours"
                  autocomplete="off"
                  :clearable="false"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Lista de Contato *">
              <validation-provider
                #default="{ errors }"
                name="Lista de Contato"
                rules="required"
              >
                <vue-autosuggest
                  v-model="queryContact"
                  :suggestions="contact"
                  :input-props="inputPropsC"
                  :section-configs="contactConfigs"
                  @input="getContact"
                >
                  <template slot-scope="{ suggestion }">
                    <b-badge class="text-capitalize" size="lg">
                      {{ getinitials(suggestion.item) }}
                    </b-badge>
                    {{ suggestion.item.name }}
                  </template>
                </vue-autosuggest>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </viewcard--c>
</template>
<script>
import _campaignService from "@/services/dialer/campaign-service";
import _campaignParametersService from "@/services/dialer/campaign-parameters-service";
import _openingHoursService from "@/services/dialer/opening-hours-service";
import _contactListService from "@/services/dialer/contact-list-service";

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
      btedit: { permission: `permission.dialer.campaign.edit` },
      btcreate: { permission: `permission.dialer.campaign.create` },
      btdelete: { permission: `permission.dialer.campaign.delete` },
      isloading: false,
      queryHours: "",
      queryContact: "",
      debounceMilliseconds: 300,
      hoursSelected: null,
      contactSelected: null,
      timeout: null,
      contactConfigs: {
        contact: {
          limit: 20,
          label: "Contato",
          onSelected: (selected) => {
            this.contactSelected = selected.item;
          },
        },
      },
      inputPropsH: {
        id: "autocompanies__input_ajax",
        placeholder: "Digite o nome do horário",
        class: "form-control",
        name: "ajax",
      },
      inputPropsC: {
        id: "autocompanies__input_ajax",
        placeholder: "Digite o nome da lista de Contato",
        class: "form-control",
        name: "ajax",
      },
      record: {
        id: 0,
        campaign_parameters_id: "",
        opening_hours_id: "",
        contact_list_id: "",
        name: "",
        status: 0,
      },
      hours: [],
      contact: [],
      status: [],
      statusSelected: { value: "0", label: "ATIVA" },
      campaignParameters: [],
      campaignParametersSelected: null,
    };
  },
  created() {
    this.getTypes();
    this.getCampaignParameters();
    this.getHours();
    localize("pt_BR", pt_br);
  },
  mounted() {
    this.getRecord();
  },
  methods: {
    validationForm() {
      this.$refs.campaignRules.validate().then((success) => {
        if (success) {
          this.save();
        }
      });
    },
    getRecord() {
      if (this.$route.params.id > 0) {
        this.isloading = true;
        _campaignService
          .find(this.$route.params.id)
          .then((res) => {
            this.record = res.content;
            if (this.record.campaign_parameters_id) {
              const campaign_Parameters = this.campaignParameters.filter(
                (f) => f.value === this.record.campaign_parameters_id
              );
              if (campaign_Parameters && campaign_Parameters.length > 0) {
                this.campaignParametersSelected = { value: "", label: "" };
                this.campaignParametersSelected = campaign_Parameters[0];
              }
            }

            if (this.record.contactList) {
              this.contactSelected = {
                id: this.record.contactList.id,
                name: this.record.contactList.name,
              };
              this.queryContact = this.contactSelected.name;
              this.record.contactList = null;
            }

            if (this.record.opening_hours_id) {
              const opening_hours = this.hours.filter(
                (f) => f.value === this.record.opening_hours_id
              );
              if (opening_hours && opening_hours.length > 0) {
                this.hoursSelected = { value: "", label: "" };
                this.hoursSelected = opening_hours[0];
              }
            }

            if (this.record.status) {
              const status_campaign = this.status.filter(
                (f) => f.value === this.record.status
              );
              if (status_campaign && status_campaign.length > 0) {
                this.statusSelected = status_campaign[0];
              }
            }
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.isloading = false));
      }
    },
    getContact() {
      if (this.queryContact && this.queryContact.length >= 3) {
        this.timeout = setTimeout(() => {
          if (!this.isloading) {
            this.isloading = true;
            _contactListService
              .autoComplete(this.queryContact)
              .then((res) => {
                this.contact = [{ name: "contact", data: res.content }];
              })
              .catch((error) => this.$utils.toastError("Notificação", error))
              .finally(() => (this.isloading = false));
          }
        }, this.debounceMilliseconds);
      }
    },
    save() {
      if (this.contactSelected) {
        this.record.contact_list_id = this.contactSelected.id;
      }

      this.record.status = this.statusSelected.value;
      this.record.campaign_parameters_id =
        this.campaignParametersSelected.value;
      this.record.opening_hours_id = this.hoursSelected.value;

      let payload = this.record;

      //promisse
      const _createOrUpdate =
        this.record.id <= 0
          ? _campaignService.create(payload)
          : _campaignService.update(payload);

      this.isloading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Registro salvo com sucesso.");
          this.$router.go(-1);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    getinitials(_item) {
      const ii = _item.name.split(" ");
      if (ii.length >= 2) {
        return ii[0].substring(0, 1) + ii[1].substring(0, 1);
      } else {
        return ii[0].substring(0, 2);
      }
    },
    getTypes() {
      _campaignService
        .showTypes()
        .then((res) => {
          this.status = this.$utils.populardropdown(
            res,
            "name",
            "id",
            false,
            false
          );
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    getCampaignParameters() {
      _campaignParametersService
        .show()
        .then((res) => {
          this.campaignParameters = this.$utils.populardropdown(
            res.content,
            "name",
            "id",
            false,
            false
          );
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    getHours() {
      _openingHoursService
        .show()
        .then((res) => {
          this.hours = this.$utils.populardropdown(
            res.content,
            "name",
            "id",
            false,
            false
          );
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