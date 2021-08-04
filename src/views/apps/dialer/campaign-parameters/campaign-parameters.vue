<template>
  <viewcard--c
    :title="
      $route.params.id > 0
        ? 'Atualizar Parâmetro de Campanha'
        : 'Cadastrar Parâmetro de Campanha'
    "
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
                name="Nome"
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
        </b-row>
        <b-row>
          <b-col md="6">
            <b-form-group label="Destino *">
              <validation-provider
                #default="{ errors }"
                name="Destino"
                rules="required"
              >
                <vue-autosuggest
                  v-model="queryDestiny"
                  :suggestions="destiny"
                  :input-props="inputProps"
                  :section-configs="destinyConfigs"
                  @input="getDestiny"
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
          <b-col cols="6" md="6">
            <b-form-group label="Tipo">
              <v-select
                v-if="types.length > 0"
                v-model="typeSelected"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="types"
                autocomplete="off"
                :clearable="false"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="2">
            <b-form-group label="Força">
              <div class="form-label-group">
                <vue-slider-campaign
                  v-model="record.force"
                  class="mb-2 vue-slider-success"
                  :direction="direction"
                />
                <b-card-text> {{ record.force }}</b-card-text>
              </div>
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group label="Número de Tentativas">
              <div class="form-label-group">
                <vue-slider-campaign
                  v-model="record.attempts"
                  class="mb-2 vue-slider-success"
                  :direction="direction"
                />
                <b-card-text> {{ record.attempts }}</b-card-text>
              </div>
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group label="Intervalo Minimo">
              <div class="form-label-group">
                <vue-slider-campaign
                  v-model="record.interval_attempts"
                  class="mb-2 vue-slider-success"
                  :direction="direction"
                />
                <b-card-text> {{ record.interval_attempts }}</b-card-text>
              </div>
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group label="Ligações simultâneas">
              <div class="form-label-group">
                <vue-slider-campaign
                  v-model="record.simultaneous_calls"
                  class="mb-2 vue-slider-success"
                  :direction="direction"
                />
                <b-card-text> {{ record.simultaneous_calls }}</b-card-text>
              </div>
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group label="Tempo discando em segundos">
              <div class="form-label-group">
                <vue-slider-campaign
                  v-model="record.time_dialing"
                  :direction="direction"
                  class="mb-2 vue-slider-success"
                />
                <b-card-text> {{ record.time_dialing }}</b-card-text>
              </div>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </viewcard--c>
</template>
<script>
import _campaignParametersService from "@/services/dialer/campaign-parameters-service";
import _destinyService from "@/services/dialer/destiny-service";

import VueSlider from "vue-slider-component";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import pt_br from "vee-validate/dist/locale/pt_BR.json";
import { required } from "@validations";
import store from "@/store/index";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    "vue-slider-campaign": VueSlider,
  },
  data() {
    return {
      btedit: { permission: `permission.dialer.param.campaign.edit` },
      btcreate: { permission: `permission.dialer.param.campaign.create` },
      btdelete: { permission: `permission.dialer.param.campaign.delete` },
      isloading: false,
      queryDestiny: "",
      debounceMilliseconds: 300,
      destinySelected: null,
      timeout: null,
      destinyConfigs: {
        destiny: {
          limit: 20,
          label: "Filas",
          onSelected: (selected) => {
            this.destinySelected = selected.item;
          },
        },
      },
      inputProps: {
        id: "autocompanies__input_ajax",
        placeholder: "Digite o nome do destino",
        class: "form-control",
        name: "ajax",
      },
      record: {
        id: 0,
        name: "",
        destiny_id: "",
        force: 0,
        attempts: 0,
        interval_attempts: 0,
        simultaneous_calls: 0,
        time_dialing: 0,
        type: 0,
      },
      dir: "ltr",
      destiny: [],
      types: [],
      typeSelected: { value: "0", label: "Powerdialing" },
    };
  },
  computed: {
    direction() {
      if (store.state.appConfig.isRTL) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.dir = "rtl";
        return this.dir;
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.dir = "ltr";
      return this.dir;
    },
  },
  created() {
    this.getTypes();
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
        _campaignParametersService
          .find(this.$route.params.id)
          .then((res) => {
            this.record = res.content;

            if (this.record.destiny) {
              this.destinySelected = {
                id: this.record.destiny.id,
                name: this.record.destiny.name,
              };
              this.queryDestiny = this.destinySelected.name;
              this.record.destiny = null;
            }

            if (this.record.type) {
              const type_campaign = this.types.filter(
                (f) => f.value === this.record.type
              );
              if (type_campaign && type_campaign.length > 0) {
                this.typeSelected = type_campaign[0];
              }
            }
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.isloading = false));
      }
    },
    getDestiny() {
      if (this.queryDestiny && this.queryDestiny.length >= 3) {
        this.timeout = setTimeout(() => {
          if (!this.isloading) {
            this.isloading = true;
            _destinyService
              .autoComplete(this.queryDestiny)
              .then((res) => {
                this.destiny = [{ name: "destiny", data: res.content }];
              })
              .catch((error) => this.$utils.toastError("Notificação", error))
              .finally(() => (this.isloading = false));
          }
        }, this.debounceMilliseconds);
      }
    },
    save() {
      if (this.destinySelected) {
        this.record.destiny_id = this.destinySelected.id;
      }
      this.record.type = this.typeSelected.value;

      let payload = this.record;
      //promisse
      const _createOrUpdate =
        this.record.id <= 0
          ? _campaignParametersService.create(payload)
          : _campaignParametersService.update(payload);

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
      _campaignParametersService
        .showTypes()
        .then((res) => {
          this.types = this.$utils.populardropdown(
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
<style lang="scss" >
@import "@core/scss/vue/libs/vue-slider.scss";
</style>