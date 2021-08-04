<template>
  <viewcard--c
    :title="titleName"
    :btsave="btcreate"
    :btdelete="null"
    :btback="btback"
    :busy="loading"
    @clicked-save="saveValidate"
    @clicked-go="goBack"
  >
    <hr class="p-0 m-0 mb-1" />
    <b-overlay :show="loading" spinner-variant="primary" spinner-type="grow">
      <b-form @submit.prevent>
        <b-row>
          <b-col cols="6">
            <b-row>
              <b-col md="12">
                <b-form-group label="Nome do vídeo" label-for="name">
                  <b-form-input v-model="record.video_name" disabled />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Texto retirado do vídeo"
                  label-for="enunciado"
                >
                  <b-form-textarea
                    rows="7"
                    v-model="record.video_text"
                    disabled
                  />
                </b-form-group>
              </b-col>
              <b-col md="12" v-if="record.url_video">
                <div>
                  <b-embed
                    type="iframe"
                    aspect="16by9"
                    :src="record.url_video"
                    allowfullscreen
                  />
                </div>
              </b-col>
              <b-col md="12" class="mt-5">
                <b-form-group label="Vínculo de ID Manual" label-for="question">
                  <b-form-input type="number" v-model="record.question" />
                </b-form-group>
              </b-col>
              <b-col
                md="12"
                class="mt-5"
                v-if="listError && listError.length > 0"
              >
                <b-form-group label="Vídeo com erro">
                  <v-select
                    v-if="listError.length > 0"
                    v-model="listErrorSelected"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="listError"
                    autocomplete="off"
                    :clearable="false"
                  />
                </b-form-group>
              </b-col>
              <b-col md="12" class="mt-2" v-if="listErrorSelected">
                <b-form-group
                  label="Descrição do erro"
                  label-for="error_description"
                >
                  <b-form-textarea
                    rows="7"
                    v-model="record.uptos3editionerror_description"
                  />
                </b-form-group>
              </b-col>
            </b-row>
          </b-col>
          <b-col cols="6">
            <div
              class="media-list"
              v-for="(item, index) in record.itens"
              :key="index"
            >
              <b-media vertical-align="center" class="text-left">
                <template #aside>
                  <b-form-group>
                    <b-form-radio-group
                      v-model="record.question_selected"
                      id="radio-group-1"
                      name="radio-options"
                    >
                      <b-form-radio
                        name="item.question_id"
                        :id="item.question_id"
                        :value="item.question_id"
                      ></b-form-radio>
                    </b-form-radio-group>
                  </b-form-group>
                </template>
                <h4 class="media-heading" style="color: #18850a !important">
                  {{ item.question_id }}
                </h4>
                <h4 class="media-heading" style="color: #006b8f !important">
                  Score {{ item.lev_score }}
                </h4>
                <b-card-text class="mb-0">
                  {{ item.question_text }}
                </b-card-text>
              </b-media>
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-5">
          <b-col cols="12">
            <b-button variant="info" class="mr-1" @click="saveValidate()" v-if="$utils.isPermited('permission.question.vinculos.create')">
              Salvar
            </b-button>
            <b-button variant="secondary" @click="goBack()"> Voltar </b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-overlay>
  </viewcard--c>
</template>
<script>
import _service from "@/services/uptos3-service";

import {
  BMedia,
  BImg,
  BCardText,
  BFormGroup,
  BFormRadioGroup,
  BFormRadio,
  BEmbed,
} from "bootstrap-vue";

export default {
  components: {
    BCardText,
    BMedia,
    BImg,
    BFormRadioGroup,
    BFormRadio,
    BFormGroup,
    BEmbed,
  },
  data() {
    return {
      titleName: "Informar questão",
      btedit: { permission: `permission.question.vinculos.edit` },
      btcreate: { permission: `permission.question.vinculos.create` },
      btdelete: { permission: `permission.question.vinculos.delete` },
      btback: {
        click: true,
        permission: `permission.question.vinculos.view`,
      },
      loading: false,
      record: {
        id: 0,
        video_name: "",
        video_text: "",
        question: "",
        question_selected: 0,
        url_video: "",
        uptos3editionerror_description: "",
      },
      listErrorSelected: null,
      listError: [],
    };
  },
  created() {
    this.getRecord();
    this.getEditionError();
  },
  methods: {
    getRecord() {
      if (this.$route.params.id > 0) {
        this.loading = true;
        _service
          .getQuestions(this.$route.params.id)
          .then((res) => {
            this.record.video_name = res.content.list_videos[0].video_name;
            this.record.video_text = res.content.list_videos[0].video_text;
            this.record.itens = res.content.list_videos;
            this.record.id = this.$route.params.id;
            this.record.company_uptos3_id =
              res.content.list_videos[0].company_uptos3_id;
            this.record.url_video = res.content.urlVideo;
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.loading = false));
      }
    },
    saveValidate() {
      let editionError = 0;
      if (this.listErrorSelected) {
        editionError = this.$utils.getValueSelected(this.listErrorSelected);
      }
      if (editionError > 0) {
        this.confirmSaveEditionError();
      } else if (
        this.record.question &&
        this.record.question.replace(/\D/g, "") > 0
      ) {
        this.confirmSaveManual();
      } else {
        this.save();
      }
    },
    save() {
      let payload = new FormData();

      payload.append("id", this.record.id);

      let editionError = 0;
      if (this.listErrorSelected) {
        editionError = this.$utils.getValueSelected(this.listErrorSelected);
      }
      if (editionError > 0) {
        payload.append("uptos3editionerror_id", editionError);
        payload.append(
          "uptos3editionerror_description",
          this.record.uptos3editionerror_description
        );
      } else if (
        this.record.question &&
        this.record.question.replace(/\D/g, "") > 0
      ) {
        payload.append("correct_id", this.record.question.replace(/\D/g, ""));
      } else payload.append("correct_id", this.record.question_selected);

      //promisse
      const _update =
        editionError > 0
          ? _service.updateByEditionError(payload)
          : _service.update(payload);

      this.loading = true;
      _update
        .then(() => {
          this.$utils.toast("Notificação", "Registro salvo com sucesso.");
          this.$router.push({
            path: `/uptos3/view/for-company/${this.record.company_uptos3_id}`,
          });
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    confirmSaveManual() {
      this.$swal({
        title: "Você informou o vínculo de ID manual",
        text: "Deseja continuar ?",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Sim, quero continuar!",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-info",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.save();
        } else this.record.question = "";
      });
    },
    confirmSaveEditionError() {
      this.$swal({
        title: "Você informou um erro no vídeo.",
        text: "Deseja continuar ?",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Sim, quero continuar!",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-info",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.save();
        } else this.listErrorSelected = null;
      });
    },
    goBack() {
      this.$router.push({
        path: `/uptos3/view/for-company/${this.record.company_uptos3_id}`,
      });
    },
    getEditionError() {
      this.isloading = true;
      _service
        .getEditionError()
        .then((res) => {
          if (res.content) {
            this.listError = this.$utils.populardropdown(
              res.content,
              "title",
              "id",
              false,
              false
            );
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
  },
};
</script>
<style>
#thumbnail-youtube {
  border: 1px solid #000;
  width: 100px;
  height: 70px;
  border-radius: 10%;
}

#thumbnail-youtube:hover {
  opacity: 0.5;
}
</style>