<template>
  <viewcard--c
    :title="$route.params.id > 0 ? 'Atualizar Template' : 'Cadastrar Template'"
    :btsave="$route.params.id > 0 ? btedit : btcreate"
    :btdelete="$route.params.id > 0 ? btdelete : null"
    :btback="{}"
    :busy="loading"
    @clicked-save="save"
    @clicked-delete="confirmDelete"
  >
    <hr class="p-0 m-0 mb-1" />
    <b-form @submit.prevent>
      <b-row>
        <b-col md="6">
          <b-row>
            <b-col cols="12" md="12" v-if="record.id > 0">
              <b-form-group label="Nome" label-for="name">
                <b-form-input
                  v-model="record.name"
                  placeholder="Nome para Template"
                  disabled
                />
              </b-form-group>
            </b-col>
            <b-col cols="12" md="12" v-else>
              <b-form-group label="Nome" label-for="name">
                <b-form-input
                  v-model="record.name"
                  placeholder="Nome para Template"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12" md="12">
              <b-form-group label="Assunto" label-for="subject">
                <b-form-input
                  v-model="record.subject"
                  placeholder="Assunto do e-mail"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12" md="12">
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
            <b-col cols="12" md="12">
              <b-card-text class="mb-0">Notificação do Sistema</b-card-text>
              <b-form-checkbox
                class="custom-control-success mt-0 mb-1"
                name="check-button"
                switch
                v-model="record.is_system"
              >
                <span class="switch-icon-left">
                  <feather-icon icon="CheckIcon" />
                </span>
                <span class="switch-icon-right">
                  <feather-icon icon="XIcon" />
                </span>
              </b-form-checkbox>
            </b-col>
            <b-col cols="12" md="12">
              <b-form-group label="Mensagem">
                <quill-editor v-model="record.content" />
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col md="6" v-if="list && list.itens && list.itens.length > 0">
          <b-row>
            <b-col cols="12" md="12">
              <h5>Variáveis disponíveis</h5>
              <b-overlay
                :show="isloading"
                spinner-variant="primary"
                spinner-type="grow"
              >
                <b-table
                  :items="!isloading ? list.itens : []"
                  @row-clicked="onClickSelected"
                  :fields="fields"
                  :busy="isloading"
                  responsive
                  hover
                  bordered
                >
                  <template #cell(color)="data">
                    <b-badge pill :style="`background: ${data.value}`">
                      {{ data.value }}
                    </b-badge>
                  </template>
                  <template #cell(tag)="data">
                    <div class="d-flex align-items-center">
                      <span class="align-middle mr-75">{{
                        data.item.tag
                      }}</span>
                      <feather-icon
                        icon="CopyIcon"
                        size="18"
                        class="mr-75 text-success"
                      />
                    </div>
                  </template>
                </b-table>
              </b-overlay>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-form>
  </viewcard--c>
</template>
<script>
import _notificationService from "@/services/notification-template-service";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

export default {
  components: {
    quillEditor,
  },
  data() {
    return {
      btedit: { permission: `permission.notification.edit` },
      btcreate: { permission: `permission.notification.create` },
      btdelete: { permission: `permission.notification.delete` },
      loading: false,
      isloading: false,
      record: {
        id: 0,
        name: "",
        content: "",
        type_template: 0,
        is_system: false,
      },
      fields: [
        { key: "tag", label: "Tag" },
        { key: "title", label: "Título" },
      ],
      list: {
        itens: [],
      },
      types: [],
      typeSelected: { value: "0", label: "Projeto" },
    };
  },
  created() {
    this.getTypes();
  },
  mounted() {
    this.getRecord();
  },
  methods: {
    getRecord() {
      if (this.$route.params.id > 0) {
        this.loading = true;
        _notificationService
          .find(this.$route.params.id)
          .then((res) => {
            this.record = res.content;
            if (this.record.parameters) {
              try {
                let parameters = JSON.parse(this.record.parameters);
                parameters = parameters.slice().sort(function (a, b) {
                  return a.variable > b.variable ? 1 : -1;
                });
                parameters.forEach((element) => {
                  let params = {
                    tag: `{{${element.variable}}}`,
                    title: element.description,
                  };
                  this.list.itens.push(params);
                });
              } catch (ex) {}
            }

            if (this.record.type_template) {
              const type_template = this.types.filter(
                (f) => f.value === this.record.type_template
              );
              if (type_template && type_template.length > 0) {
                this.typeSelected = type_template[0];
              }
            }
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.loading = false));
      }
    },
    save() {
      this.record.type_template = this.typeSelected.value;
      const payload = { data: { ...this.record } };
      //promisse
      const _createOrUpdate =
        this.record.id <= 0
          ? _notificationService.create(payload)
          : _notificationService.update(payload);

      this.loading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Template salvo com sucesso.");
          this.$router.go(-1);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    confirmDelete() {
      this.$swal({
        title: "Tem certeza?",
        text: "Isso não pode ser revertido!",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Sim, quero excluir!",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-info",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.excluir();
        }
      });
    },
    excluir() {
      this.loading = true;
      _notificationService
        .delete(this.record.id)
        .then(() => {
          this.$utils.toast("Notificação", "Template excluido com sucesso.");
          this.$router.go(-1);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    onClickSelected(record, _) {
      const el = document.createElement("textarea");
      el.value = record.tag;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      const selected =
        document.getSelection().rangeCount > 0
          ? document.getSelection().getRangeAt(0)
          : false;
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
      }
    },
    getTypes() {
      _notificationService
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