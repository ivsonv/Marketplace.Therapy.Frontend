<template>
  <viewcard--c
    :title="$route.params.id > 0 ? 'Atualizar Destino' : 'Cadastrar Destino'"
    :btsave="$route.params.id > 0 ? btedit : btcreate"
    :btdelete="null"
    :btback="{}"
    :busy="isloading"
    @clicked-save="validationForm"
    @clicked-delete="null"
  >
    <hr class="p-0 m-0 mb-1" />
    <validation-observer ref="destinyRules">
      <b-form @submit.prevent>
        <b-row>
          <b-col md="6">
            <b-form-group label="Nome *">
              <validation-provider
                #default="{ errors }"
                name="Nome do Destino"
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
            <b-form-group label="Fila *">
              <validation-provider
                #default="{ errors }"
                name="Fila"
                rules="required"
              >
                <v-select
                  v-if="queues.length > 0"
                  v-model="queuesSelected"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="queues"
                  autocomplete="off"
                  :clearable="false"
                />

                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="1">
            <b-card-text class="mb-0">AMD </b-card-text>
            <b-form-checkbox
              class="custom-control-success mt-1"
              name="check-button"
              switch
              v-model="record.amd"
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
            <b-card-text class="mb-0">Aúdio Padrão </b-card-text>
            <b-form-checkbox
              class="custom-control-success mt-1"
              name="check-button"
              switch
              v-model="record.pattern_audio"
            >
              <span class="switch-icon-left">
                <feather-icon icon="CheckIcon" />
              </span>
              <span class="switch-icon-right">
                <feather-icon icon="XIcon" />
              </span>
            </b-form-checkbox>
          </b-col>
          <b-col md="4" v-if="record.id > 0 && !record.pattern_audio">
            <b-form-group label="Aúdio Inicial">
              <b-form-input
                v-model="record.initial_audio"
                placeholder="Aúdio Inicial"
                disabled
              />
            </b-form-group>
          </b-col>
          <b-col cols="4" v-if="!record.pattern_audio">
            <b-form-group label="Arquivo Aúdio (.mp3 ou .wav)">
              <div class="form-label-group">
                <b-form-file
                  v-model="file"
                  placeholder="Escolha um arquivo ou solte-o aqui..."
                  drop-placeholder="Solte o arquivo aqui..."
                  accept=".mp3, .wav"
                />
                <b-card-text class="my-1" v-if="file">
                  Arquivo Selecionado :
                  <strong>{{ file ? file.name : "" }}</strong>
                </b-card-text>
              </div>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </viewcard--c>
</template>
<script>
import _destinyService from "@/services/dialer/destiny-service";
import _queuesService from "@/services/pabx/queues-service";

import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import pt_br from "vee-validate/dist/locale/pt_BR.json";
import { required } from "@validations";
import { BFormFile } from "bootstrap-vue";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    BFormFile,
  },
  data() {
    return {
      btedit: { permission: `permission.dialer.destiny.edit` },
      btcreate: { permission: `permission.dialer.destiny.create` },
      btdelete: { permission: `permission.dialer.destiny.delete` },
      file: null,
      isloading: false,
      debounceMilliseconds: 300,
      timeout: null,
      record: {
        id: 0,
        amd: false,
        link_audio_initial: "",
        initial_audio: "",
        queue: "",
        name: "",
        file_audio: null,
        pattern_audio: true,
      },
      queues: [],
      queuesSelected: null,
      selectedFile: null,
    };
  },
  created() {
    this.getQueues();
    localize("pt_BR", pt_br);
  },
  mounted() {
    this.getRecord();
  },
  methods: {
    validationForm() {
      this.$refs.destinyRules.validate().then((success) => {
        if (success) {
          this.save();
        }
      });
    },
    getRecord() {
      if (this.$route.params.id > 0) {
        this.isloading = true;
        _destinyService
          .find(this.$route.params.id)
          .then((res) => {
            this.record = res.content;

            if (this.record.queue) {
              const queue_type = this.queues.filter(
                (f) => f.value === this.record.queue
              );
              if (queue_type && queue_type.length > 0) {
                this.queuesSelected = queue_type[0];
              }
            }
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.isloading = false));
      }
    },
    save() {
      this.record.queue = this.queuesSelected.value;

      if (this.record.pattern_audio) this.file = null;

      let payload = new FormData();
      if (this.file) {
        payload.append("file_audio", this.file);
      }
      payload.append("dados", JSON.stringify(this.record));

      //promisse
      const _createOrUpdate =
        this.record.id <= 0
          ? _destinyService.create(payload)
          : _destinyService.update(payload);

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
    getQueues() {
      this.isloading = true;
      _queuesService
        .show(1, "")
        .then((res) => {
          this.queues = this.$utils.populardropdown(
            res.content,
            "queueName",
            "name",
            false,
            false
          );
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