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
                <b-form-group label="Número da questão" label-for="number">
                  <b-form-input v-model="record.correct_id" disabled />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group label="Responsável Nome" label-for="name">
                  <b-form-input v-model="record.responsible" disabled />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group label="Responsável E-mail" label-for="name">
                  <b-form-input v-model="record.responsible_email" disabled />
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
                      v-model="record.video_selected"
                      id="radio-group-1"
                      name="radio-options"
                    >
                      <b-form-radio
                        name="item.id"
                        :id="item.id.toString()"
                        :value="item.id.toString()"
                      ></b-form-radio>
                    </b-form-radio-group>
                  </b-form-group>
                </template>
                <h4 class="media-heading" style="color: #18850a !important">
                  {{ item.video_name }}
                </h4>
                <div>
                  <b-embed
                    type="iframe"
                    aspect="16by9"
                    :src="item.urlvideo"
                    allowfullscreen
                  />
                </div>
              </b-media>
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-5">
          <b-col cols="12">
            <b-button variant="info" class="mr-1" @click="saveValidate()" v-if="$utils.isPermited('permission.question.repetidas.create')">
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
      loading: false,
      titleName: "Informar questão",
      btedit: { permission: `permission.question.repetidas.edit` },
      btcreate: { permission: `permission.question.repetidas.create` },
      btdelete: { permission: `permission.question.repetidas.delete` },
      btback: {
        click: true,
        permission: `permission.question.repetidas.view`,
      },
      record: {
        id: 0,
        correct_id: "",
        video_selected: 0,
        itens: [],
        responsible: "",
        responsible: "",
      },
    };
  },
  created() {
    this.getRecord();
  },
  methods: {
    getRecord() {
      if (this.$route.params.correct_id > 0) {
        this.loading = true;
        _service
          .getVideosQuestions(this.$route.params.correct_id)
          .then((res) => {
            if (
              res &&
              res.content &&
              res.content.list_names &&
              res.content.list_names.length > 0
            ) {
              res.content.list_names.forEach((element) => {
                element.urlvideo = `${res.content.purge_link}/${element.video_name}.mp4`;
              });

              this.record.itens = res.content.list_names;
              this.record.correct_id = res.content.correct_id;
              this.record.company_uptos3_id = res.content.company_uptos3_id;
              this.record.responsible = res.content.responsible;
              this.record.responsible_email = res.content.responsible_email;
            }
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.loading = false));
      }
    },
    saveValidate() {
      if (this.record.video_selected) {
        this.save();
      } else {
        this.$utils.toastError("Notificação", "Necessário informar a opção.");
      }
    },
    save() {
      let payload = new FormData();
      payload.append("id", this.record.video_selected);
      //promisse
      const _update = _service.updateByRepeat(payload);

      this.loading = true;
      _update
        .then(() => {
          this.$utils.toast("Notificação", "Registro salvo com sucesso.");
          this.$router.push({
            path: `/uptos3/repeated/view/for-company/${this.record.company_uptos3_id}`,
          });
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    goBack() {
      this.$router.push({
        path: `/uptos3/repeated/view/for-company/${this.record.company_uptos3_id}`,
      });
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