<template>
  <viewcard--c
    :title="$route.params.id > 0 ? 'Atualizar FAQ' : 'Cadastrar FAQ'"
    :btsave="$route.params.id > 0 ? btedit : btcreate"
    :btdelete="$route.params.id > 0 ? btdelete : null"
    :btback="{}"
    :busy="loading"
    @clicked-save="save"
    @clicked-delete="onDelete"
  >
    <b-modal
      ref="modal-artigos"
      hide-footer
      :title="`${question && question.id > 0 ? 'ALTERAR' : 'NOVO'} ARTIGO`"
      @hide="onHideTransfer"
      centered
    >
      <div class="row" v-if="question">
        <div class="col-12">
          <b-form-group label="Pergunta / Dúvida ?">
            <b-form-input
              v-model="question.question"
              placeholder="Digite uma pergunta"
              autocomplete="off"
            />
          </b-form-group>
        </div>
        <div class="col-12">
          <b-form-group label="Resposta *">
            <b-form-input
              v-model="question.ans"
              placeholder="Digite a resposta"
              autocomplete="off"
            />
          </b-form-group>
        </div>
      </div>

      <div class="d-block">
        <b-button @click="saveQuestion" variant="info" class="mr-1" size="lg">
          Salvar
        </b-button>
      </div>
    </b-modal>

    <hr class="p-0 m-0 mb-1" />
    <b-tabs pills content-class="mt-2">
      <b-tab title="1. DADOS BÁSICOS">
        <b-row>
          <b-col md="6">
            <b-form-group label="Titulo *">
              <b-form-input
                v-model="record.title"
                placeholder="Titulo"
                autocomplete="off"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Sub Titulo">
              <b-form-input
                v-model="record.sub_title"
                placeholder="Opcional"
                autocomplete="off"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-tab>
      <b-tab title="2. ARTIGOS" v-if="$route.params.id > 0">
        <b-row>
          <b-col cols="12" class="ml-md-2">
            <b-button type="submit" variant="info" pill @click="newQuestion">
              Cadastrar Artigo
            </b-button>
          </b-col>
          <b-col cols="12" v-if="list && list.length > 0">
            <b-table
              :busy="isloading"
              :fields="fields"
              :items="list"
              responsive
              striped
              hover
            >
              <template #cell(actions)="data">
                <div class="text-nowrap">
                  <feather-icon
                    icon="EditIcon"
                    size="22"
                    class="mx-1"
                    @click="onClickSelected(data.item)"
                  />
                </div>
              </template>
            </b-table>
          </b-col>
          <b-col v-else>
            <h1 class="ml-md-2">Nenhum artigo cadastrado.</h1>
          </b-col>
        </b-row>
      </b-tab>
    </b-tabs>
  </viewcard--c>
</template>
<script>
import _faqService from "@/services/faq-service";
import _faqQuestionService from "@/services/faq-question-service";
export default {
  data() {
    return {
      btedit: { permission: `faq.edit` },
      btcreate: { permission: `faq.create` },
      btdelete: { permission: `faq.delete` },
      loading: false,
      record: {
        id: 0,
        title: "",
        sub_title: "",
      },
      question: null,
      fields: [
        { key: "question", label: "Questão" },
        { key: "ans", label: "Resposta" },
        { key: "actions", label: "Ações" },
      ],
      list: [],
    };
  },
  mounted() {
    this.getRecord();
  },
  methods: {
    getRecord() {
      if (this.$route.params.id > 0) {
        this.loading = true;
        _faqService
          .find(this.$route.params.id)
          .then((res) => {
            this.record = res.content;
            this.list = res.content.question;
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.loading = false));
      }
    },
    save() {
      this.record.question = null;
      const payload = { data: { ...this.record } };

      const _createOrUpdate =
        this.record.id <= 0
          ? _faqService.create(payload)
          : _faqService.update(payload);

      this.loading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Salvo com sucesso.");
          this.$router.go(-1);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    onDelete() {
      this.loading = true;
      _faqService
        .delete(this.record.id)
        .then(() => {
          this.$utils.toast("Notificação", "Excluido com sucesso.");
          this.$router.go(-1);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    newQuestion(id) {
      this.question = {
        faq_id: this.$route.params.id,
        question: "",
        ans: "",
      };

      if (id > 0) {
        this.question.id = id;
      }
      this.$refs["modal-artigos"].show();
    },
    saveQuestion() {
      const payload = { data: { ...this.question } };

      const _createOrUpdate =
        this.record.id <= 0
          ? _faqQuestionService.create(payload)
          : _faqQuestionService.update(payload);

      this.loading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Salvo com sucesso.");
          this.$refs["modal-artigos"].hide();
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    onHideTransfer(evt) {
      if (evt.trigger === "backdrop") {
        evt.preventDefault();
      }
    },
  },
};
</script>