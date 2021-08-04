<template>
  <viewcard--c
    :title="
      $route.params.id > 0
        ? 'Atualizar Horário de Funcionamento'
        : 'Cadastrar Horário de Funcionamento'
    "
    :btsave="$route.params.id > 0 ? btedit : btcreate"
    :btdelete="null"
    :btback="{}"
    :busy="isloading"
    @clicked-save="validationForm"
  >
    <hr class="p-0 m-0 mb-1" />
    <validation-observer ref="hoursRules">
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
          <b-col md="2">
            <b-form-group label="Data Início *">
              <validation-provider
                #default="{ errors }"
                name="Data Início"
                rules="required"
              >
                <flat-pickr
                  v-model="record.start"
                  placeholder="Data Início"
                  class="form-control"
                  :config="config"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group label="Hora Início*">
              <validation-provider
                #default="{ errors }"
                name="Hora"
                rules="required"
              >
                <flat-pickr
                  v-model="record.hour"
                  placeholder="Duração"
                  class="form-control"
                  :config="{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: 'H:i',
                    time_24hr: true,
                  }"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group label="Data Fim *">
              <validation-provider
                #default="{ errors }"
                name="Data Fim"
                rules="required"
              >
                <flat-pickr
                  v-model="record.end"
                  placeholder="Data Fim"
                  class="form-control"
                  :config="config"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group label="Hora Fim*">
              <validation-provider
                #default="{ errors }"
                name="Hora"
                rules="required"
              >
                <flat-pickr
                  v-model="record.hour_end"
                  placeholder="Duração"
                  class="form-control"
                  :config="{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: 'H:i',
                    time_24hr: true,
                  }"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="1">
            <b-card-text class="mb-0">Domingo </b-card-text>
            <b-form-checkbox
              class="custom-control-success mt-1"
              name="check-button"
              switch
              v-model="record.sunday"
            >
              <span class="switch-icon-left">
                <feather-icon icon="CheckIcon" />
              </span>
              <span class="switch-icon-right">
                <feather-icon icon="XIcon" />
              </span>
            </b-form-checkbox>
          </b-col>
          <b-col md="1">
            <b-card-text class="mb-0">Segunda-feira </b-card-text>
            <b-form-checkbox
              class="custom-control-success mt-1"
              name="check-button"
              switch
              v-model="record.monday"
            >
              <span class="switch-icon-left">
                <feather-icon icon="CheckIcon" />
              </span>
              <span class="switch-icon-right">
                <feather-icon icon="XIcon" />
              </span>
            </b-form-checkbox>
          </b-col>
          <b-col md="1">
            <b-card-text class="mb-0">Terça-feira </b-card-text>
            <b-form-checkbox
              class="custom-control-success mt-1"
              name="check-button"
              switch
              v-model="record.tuesday"
            >
              <span class="switch-icon-left">
                <feather-icon icon="CheckIcon" />
              </span>
              <span class="switch-icon-right">
                <feather-icon icon="XIcon" />
              </span>
            </b-form-checkbox>
          </b-col>
          <b-col md="1">
            <b-card-text class="mb-0">Quarta-feira </b-card-text>
            <b-form-checkbox
              class="custom-control-success mt-1"
              name="check-button"
              switch
              v-model="record.wednesday"
            >
              <span class="switch-icon-left">
                <feather-icon icon="CheckIcon" />
              </span>
              <span class="switch-icon-right">
                <feather-icon icon="XIcon" />
              </span>
            </b-form-checkbox>
          </b-col>
          <b-col md="1">
            <b-card-text class="mb-0">Quinta-feira </b-card-text>
            <b-form-checkbox
              class="custom-control-success mt-1"
              name="check-button"
              switch
              v-model="record.thursday"
            >
              <span class="switch-icon-left">
                <feather-icon icon="CheckIcon" />
              </span>
              <span class="switch-icon-right">
                <feather-icon icon="XIcon" />
              </span>
            </b-form-checkbox>
          </b-col>
          <b-col md="1">
            <b-card-text class="mb-0">Sexta-feira </b-card-text>
            <b-form-checkbox
              class="custom-control-success mt-1"
              name="check-button"
              switch
              v-model="record.friday"
            >
              <span class="switch-icon-left">
                <feather-icon icon="CheckIcon" />
              </span>
              <span class="switch-icon-right">
                <feather-icon icon="XIcon" />
              </span>
            </b-form-checkbox>
          </b-col>
          <b-col md="1">
            <b-card-text class="mb-0">Sábado </b-card-text>
            <b-form-checkbox
              class="custom-control-success mt-1"
              name="check-button"
              switch
              v-model="record.saturday"
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
        <b-row class="mt-3">
          <b-col md="2">
            <b-form-group label="Intervalo Início">
              <flat-pickr
                v-model="record.interval_start"
                placeholder="Intervalo Início"
                class="form-control"
                :config="{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: 'H:i',
                  time_24hr: true,
                }"
              />
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group label="Intervalo Fim">
              <flat-pickr
                v-model="record.interval_end"
                placeholder="Intervalo Fim"
                class="form-control"
                :config="{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: 'H:i',
                  time_24hr: true,
                }"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </viewcard--c>
</template>
<script>
import _openinghoursService from "@/services/dialer/opening-hours-service";

import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import pt_br from "vee-validate/dist/locale/pt_BR.json";
import { required } from "@validations";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      btedit: { permission: `permission.dialer.hour.fun.edit` },
      btcreate: { permission: `permission.dialer.hour.fun.create` },
      btdelete: { permission: `permission.dialer.hour.fun.delete` },
      isloading: false,
      debounceMilliseconds: 300,
      timeout: null,
      record: {
        id: 0,
        name: "",
        interval_end: "",
        interval_start: "",
        start: "",
        end: "",
        hour: "",
        hour_end: "",
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
      },
      config: {
        dateFormat: "d-m-Y",
        altFormat: "d/m/Y",
        minDate: "today",
        locale: Portuguese,
      },
    };
  },
  created() {
    this.getRecord();
    localize("pt_BR", pt_br);
  },
  methods: {
    validationForm() {
      this.$refs.hoursRules.validate().then((success) => {
        if (success) {
          this.save();
        }
      });
    },
    getRecord() {
      if (this.$route.params.id > 0) {
        this.isloading = true;
        _openinghoursService
          .find(this.$route.params.id)
          .then((res) => {
            this.record = res.content;

            if (this.record.start) {
              let separate_date = this.record.start.split("T")[0];
              let separate_hour = this.record.start.split("T")[1];
              let dates = separate_date.split("-");
              this.record.start = `${dates[2]}-${dates[1]}-${dates[0]}`;

              let hours = separate_hour.split(":");
              this.record.hour = `${hours[0]}:${hours[1]}`;
            }

            if (this.record.end) {
              let separate_date = this.record.end.split("T")[0];
              let separate_hour = this.record.end.split("T")[1];
              let dates = separate_date.split("-");
              this.record.end = `${dates[2]}-${dates[1]}-${dates[0]}`;

              let hours = separate_hour.split(":");
              this.record.hour_end = `${hours[0]}:${hours[1]}`;
            }
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.isloading = false));
      }
    },
    save() {
      const payload = this.record;

      let dates = payload.start.split("-");
      payload.start = `${dates[2]}-${dates[1]}-${dates[0]}T${payload.hour}:00`;

      dates = payload.end.split("-");
      payload.end = `${dates[2]}-${dates[1]}-${dates[0]}T${payload.hour_end}:00`;

      //promisse
      const _createOrUpdate =
        this.record.id <= 0
          ? _openinghoursService.create(payload)
          : _openinghoursService.update(payload);

      this.isloading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Registro salvo com sucesso.");
          this.$router.go(-1);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
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