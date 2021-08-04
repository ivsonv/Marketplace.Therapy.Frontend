<template>
  <viewcard--c
    :title="$route.params.id > 0 ? 'Atualizar Projeto' : 'Cadastrar Projeto'"
    :btsave="$route.params.id > 0 ? btedit : btcreate"
    :btdelete="$route.params.id > 0 ? btdelete : null"
    :btback="{}"
    :busy="isloading"
    @clicked-save="validationForm"
    @clicked-delete="confirmDelete"
  >
    <validation-observer ref="projectRules">
      <b-form @submit.prevent>
        <b-row>
          <b-col md="12">
            <b-form-group label="Nome *">
              <validation-provider
                #default="{ errors }"
                name="Nome do projeto"
                rules="required"
              >
                <b-form-input
                  v-model="record.name"
                  :state="errors.length > 0 ? false : null"
                  placeholder="Nome do projeto"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Empresa *">
              <validation-provider
                #default="{ errors }"
                name="Empresa"
                rules="required"
              >
                <vue-autosuggest
                  v-model="queryCompany"
                  :suggestions="companies"
                  :input-props="inputProps"
                  :section-configs="companyConfigs"
                  @input="getCompanies"
                >
                  <template slot-scope="{ suggestion }">
                    <b-badge
                      class="text-capitalize"
                      size="lg"
                      :style="`background: ${suggestion.item.color}`"
                    >
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
            <b-form-group label="Template de e-mail *">
              <validation-provider
                #default="{ errors }"
                name="Template de e-mail"
                rules="required"
                ><v-select
                  v-if="templates.length > 0"
                  v-model="templateSelected"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="templates"
                  autocomplete="off"
                  :clearable="false"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group label="Data Primeira Aula *">
              <validation-provider
                #default="{ errors }"
                name="Data Primeira Aula"
                rules="required"
              >
                <flat-pickr
                  v-model="record.first_class_date"
                  placeholder="Data Primeira Aula"
                  class="form-control"
                  :config="config"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group label="Duração *">
              <validation-provider
                #default="{ errors }"
                name="Duração"
                rules="required"
              >
                <flat-pickr
                  v-model="record.lesson_duration"
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
            <b-card-text class="mb-0">Notificar Backoffice </b-card-text>
            <b-form-checkbox
              class="custom-control-success mt-1"
              name="check-button"
              switch
              v-model="record.send_email_backoffice"
            >
              <span class="switch-icon-left">
                <feather-icon icon="CheckIcon" />
              </span>
              <span class="switch-icon-right">
                <feather-icon icon="XIcon" />
              </span>
            </b-form-checkbox>

            <!-- <b-form-group label="E-mail Backoffice"> </b-form-group> -->
          </b-col>
          <b-col md="2">
            <b-card-text class="mb-0">Notificar Marketing </b-card-text>
            <b-form-checkbox
              class="custom-control-success mt-1"
              name="check-button"
              switch
              v-model="record.send_email_marketing"
            >
              <span class="switch-icon-left">
                <feather-icon icon="CheckIcon" />
              </span>
              <span class="switch-icon-right">
                <feather-icon icon="XIcon" />
              </span>
            </b-form-checkbox>

            <!-- <b-form-group label="E-mail Backoffice"> </b-form-group> -->
          </b-col>

          <b-col cols="12" md="2">
            <b-form-group label="Youtube Imagem">
              <div class="form-label-group">
                <img
                  @click="$refs.fileInput.click()"
                  :src="urlImage"
                  id="thumbnail-youtube"
                  class="img-fluid rounded-shadow cursor-pointer"
                />
                <input
                  style="display: none"
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="onFileChange"
                />
              </div>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Google Calendar ID">
              <b-form-input
                v-model="record.google_calendar_id"
                placeholder="Google Calendar ID"
                disabled
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Jira ID">
              <b-form-input
                v-model="record.jira_project_id"
                placeholder="Jira ID"
                disabled
              />
            </b-form-group>
          </b-col>
          <b-col cols="12">
            <b-form-group label="Youtube Descrição">
              <div class="form-label-group">
                <quill-editor v-model="record.youtube_description" />
              </div>
            </b-form-group>
          </b-col>
          <b-col cols="12">
            <b-form-group label="Descrição Rodapé Google Calendar">
              <div class="form-label-group">
                <quill-editor v-model="record.calendar_description_footer" />
              </div>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </viewcard--c>
</template>
<script>
import _projectsService from "@/services/projects-service";
import _companyService from "@/services/company-service";
import _templateService from "@/services/notification-template-service";
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
      btedit: { permission: `permission.project.edit` },
      btcreate: { permission: `permission.project.create` },
      btdelete: { permission: `permission.project.delete` },
      isloading: false,
      queryCompany: "",
      queryTemplate: "",
      debounceMilliseconds: 300,
      companySelected: null,
      timeout: null,
      companyConfigs: {
        companies: {
          limit: 20,
          label: "Empresas",
          onSelected: (selected) => {
            this.companySelected = selected.item;
          },
        },
      },
      inputProps: {
        id: "autocompanies__input_ajax",
        placeholder: "Digite o nome da empresa",
        class: "form-control",
        name: "ajax",
      },
      record: {
        id: 0,
        name: "",
        lesson_duration: "",
        first_class_date: null,
        youtube_image: "",
        youtube_description: "",
        calendar_description_footer: "",
        company_id: "",
        notificationtemplate_id: "",
        google_calendar_id: "",
        jira_project_id: "",
        send_email_backoffice: false,
        send_email_marketing: false,
      },
      companies: [],
      templates: [],
      selectedFile: null,
      urlImage: `${require("@/assets/images/pages/sem-foto.png")}`,
      config: {
        dateFormat: "d-m-Y",
        altFormat: "d/m/Y",
        minDate: "today",
        locale: Portuguese,
      },
      templates: [],
      templateSelected: null,
    };
  },
  created() {
    this.getNotification();
    this.getRecord();
    localize("pt_BR", pt_br);
  },
  methods: {
    validationForm() {
      this.$refs.projectRules.validate().then((success) => {
        if (success) {
          this.save();
        }
      });
    },
    getRecord() {
      if (this.$route.params.id > 0) {
        this.isloading = true;
        _projectsService
          .find(this.$route.params.id)
          .then((res) => {
            this.record = res.content;

            if (this.record.company) {
              this.companySelected = {
                id: this.record.company.id,
                name: this.record.company.name,
                color: this.record.company.color,
              };
              this.queryCompany = this.companySelected.name;
              this.record.company = null;
            }

            if (this.record.notificationTemplate) {
              this.templateSelected = {
                value: this.record.notificationTemplate.id,
                label: this.record.notificationTemplate.name,
              };
            }

            if (this.record.youtube_image) {
              this.urlImage = `${res.pathimage}/${this.record.youtube_image}`;
            }

            if (this.record.first_class_date) {
              let separate_date = this.record.first_class_date.split("T")[0];
              let dates = separate_date.split("-");
              this.record.first_class_date = `${dates[2]}-${dates[1]}-${dates[0]}`;
            }
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.isloading = false));
      }
    },
    getCompanies() {
      if (this.queryCompany && this.queryCompany.length >= 3) {
        this.timeout = setTimeout(() => {
          if (!this.isloading) {
            this.isloading = true;
            _companyService
              .autoComplete(this.queryCompany)
              .then((res) => {
                this.companies = [{ name: "companies", data: res.content }];
              })
              .catch((error) => this.$utils.toastError("Notificação", error))
              .finally(() => (this.isloading = false));
          }
        }, this.debounceMilliseconds);
      }
    },
    getTemplates() {
      if (this.queryTemplate && this.queryTemplate.length >= 3) {
        this.timeout = setTimeout(() => {
          if (!this.isloading) {
            this.isloading = true;
            _templateService
              .autoComplete(this.queryTemplate)
              .then((res) => {
                this.templates = [{ name: "templates", data: res.content }];
              })
              .catch((error) => this.$utils.toastError("Notificação", error))
              .finally(() => (this.isloading = false));
          }
        }, this.debounceMilliseconds);
      }
    },
    save() {
      if (this.companySelected) {
        this.record.company_id = this.companySelected.id;
      }

      if (this.templateSelected) {
        this.record.notificationtemplate_id = this.templateSelected.value;
      }

      let payload = new FormData();

      if (this.record.first_class_date) {
        let dates = this.record.first_class_date.split("-");
        this.record.first_class_date = `${dates[2]}-${dates[1]}-${dates[0]}`;
      }
      if (this.selectedFile) {
        payload.append("thumbnail", this.selectedFile);
      }
      payload.append("dados", JSON.stringify(this.record));

      //promisse
      const _createOrUpdate =
        this.record.id <= 0
          ? _projectsService.create(payload)
          : _projectsService.update(payload);

      this.isloading = true;
      _createOrUpdate
        .then((res) => {
          this.$utils.toast("Notificação", "Registro salvo com sucesso.");
          this.$router.push({
            path: `/pedagogic/project-view/${res.content.id}`,
          });
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
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
      this.isloading = true;
      _projectsService
        .delete(this.record.id)
        .then(() => {
          this.$utils.toast("Notificação", "Excluido com sucesso.");
          this.$router.push({
            path: `/pedagogic/projects`,
          });
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
    onFileChange(e) {
      e.preventDefault();
      this.selectedFile = e.target.files[0];
      this.urlImage = URL.createObjectURL(e.target.files[0]);
    },
    getNotification() {
      _templateService
        .showForType(0)
        .then((res) => {
          console.log(res);
          this.templates = this.$utils.populardropdown(
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