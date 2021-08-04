<template>
  <viewcard--c
    :title="$route.params.id > 0 ? 'Atualizar Empresa' : 'Cadastrar Empresa'"
    :btsave="$route.params.id > 0 ? btedit : btcreate"
    :btdelete="$route.params.id > 0 ? btdelete : null"
    :btback="{}"
    :busy="loading"
    @clicked-save="validationForm"
    @clicked-delete="confirmDelete"
  >
    <hr class="p-0 m-0 mb-1" />
    <validation-observer ref="companyRules">
      <b-form @submit.prevent>
        <b-tabs fill>
          <b-tab active title="Dados Básicos">
            <b-row class="pt-2">
              <b-col md="6">
                <b-form-group label="Nome *" label-for="name">
                  <validation-provider
                    #default="{ errors }"
                    name="Nome da empresa"
                    rules="required"
                  >
                    <b-form-input
                      v-model="record.name"
                      placeholder="Nome da empresa"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="E-mail Departamento Produto *">
                  <validation-provider
                    #default="{ errors }"
                    name="E-mail Departamento Produto"
                    rules="required|email"
                  >
                    <b-form-input
                      type="email"
                      name="email_department"
                      v-model="record.emaildepartmentproduct"
                      placeholder="Informe um e-mail"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="E-mail Departamento Marketing *">
                  <validation-provider
                    #default="{ errors }"
                    name="E-mail Departamento Marketing"
                    rules="required|email"
                  >
                    <div class="form-label-group">
                      <b-form-input
                        type="email"
                        name="email_marketing"
                        v-model="record.emailmarketing"
                        placeholder="Informe um e-mail"
                      />
                    </div>
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="E-mail do Google Calendar *">
                  <validation-provider
                    #default="{ errors }"
                    name="E-mail do Google Calendar"
                    rules="required|email"
                  >
                    <div class="form-label-group">
                      <b-form-input
                        id="email_marketing"
                        v-model="record.googlecalendar"
                        placeholder="Informe um e-mail"
                        name="email_calendar"
                      />
                    </div>
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col cols="6" md="2">
                <b-form-group label="Cor Padrão *">
                  <validation-provider
                    #default="{ errors }"
                    name="Cor Padrão"
                    rules="required"
                  >
                    <b-form-input v-model="record.color" type="color" />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col cols="6" md="2">
                <b-form-group label="Eventos Simultâneos *">
                  <validation-provider
                    #default="{ errors }"
                    name="Eventos Simultâneos"
                    rules="required"
                  >
                    <b-form-input
                      v-model="record.amountconcurrentevents"
                      type="number"
                      placeholder="Informe a quantidade"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col cols="6" md="2">
                <b-form-group label="Id Empresa UpToS3" label-for="uptos">
                  <b-form-input
                    v-model="record.company_uptos3_id"
                    placeholder="Id Empresa UpToS3"
                    type="number"
                  />
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Youtube Link">
                  <div class="form-label-group">
                    <b-form-input
                      v-model="record.youtubelink"
                      placeholder="Informe o link do youtube"
                    />
                  </div>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group label="Youtube Descrição">
                  <div class="form-label-group">
                    <quill-editor v-model="record.youtubedescription" />
                  </div>
                </b-form-group>
              </b-col>
              <b-col cols="2">
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
            </b-row>
          </b-tab>

          <b-tab title="Usuários">
            <b-form>
              <b-row>
                <b-col md="6">
                  <b-input-group>
                    <b-form-input
                      placeholder="filtrar incluidas..."
                      autocomplete="off"
                      v-model="searchIncludes"
                      @keyup="filterincludes"
                    />
                  </b-input-group>
                  <hr />
                  <div class="text-center">
                    <h5 class="font-weight-bold mb-2">Usuários Incluído(s)</h5>
                    <feather-icon icon="ArrowDownCircleIcon" size="25" />
                  </div>

                  <!-- draggable -->
                  <draggable
                    :list="record.users"
                    tag="ul"
                    group="people"
                    class="list-group list-group-flush cursor-move"
                  >
                    <b-list-group-item
                      v-for="(listItem, index) in record.users"
                      :key="index"
                      tag="li"
                      class="my-25"
                    >
                      <div class="d-flex">
                        <div class="ml-25">
                          <b-card-text class="mb-0 font-weight-bold">
                            {{ listItem.name }}
                          </b-card-text>
                          <small>{{ listItem.email }}</small>
                        </div>
                      </div>
                    </b-list-group-item>
                  </draggable>
                  <p
                    class="text-center pt-1"
                    v-if="!record.users || record.users.length <= 0"
                  >
                    Nenhum Usuário no grupo
                  </p>
                </b-col>
                <b-col md="6">
                  <b-input-group>
                    <b-form-input
                      placeholder="pesquise por Nome..."
                      autocomplete="off"
                      v-model="searchAvail"
                    />
                    <b-input-group-append>
                      <b-button variant="gradient-info" @click="filterAvails">
                        Pesquisar
                      </b-button>
                    </b-input-group-append>
                  </b-input-group>
                  <hr />
                  <div class="text-center">
                    <h5 class="font-weight-bold mb-2">Usuários Disponíveis</h5>
                    <feather-icon icon="ArrowDownCircleIcon" size="25" />
                  </div>

                  <!-- draggable -->
                  <draggable
                    :list="users"
                    tag="ul"
                    group="people"
                    class="list-group list-group-flush cursor-move"
                  >
                    <b-list-group-item
                      v-for="(listItem, index) in users"
                      :key="index"
                      tag="li"
                      class="my-25"
                    >
                      <div class="d-flex">
                        <div class="ml-25">
                          <b-card-text class="mb-0 font-weight-bold">
                            {{ listItem.name }}
                          </b-card-text>
                          <small>{{ listItem.email }}</small>
                        </div>
                      </div>
                    </b-list-group-item>
                  </draggable>
                  <p
                    class="text-center pt-1"
                    v-if="!users || users.length <= 0"
                  >
                    Nenhum Usuário disponivel
                  </p>
                </b-col>
              </b-row>
            </b-form>
          </b-tab>
        </b-tabs>
      </b-form>
    </validation-observer>
  </viewcard--c>
</template>
<script>
import _companyService from "@/services/company-service";
import _usersService from "@/services/users-service";
import { required } from "@validations";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import pt_br from "vee-validate/dist/locale/pt_BR.json";

import draggable from "vuedraggable";
import { BListGroupItem } from "bootstrap-vue";
export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    draggable,
    BListGroupItem,
  },
  data() {
    return {
      btedit: { permission: `permission.company.edit` },
      btcreate: { permission: `permission.company.create` },
      btdelete: { permission: `permission.company.delete` },
      loading: false,
      users: [],
      usersSelected: null,
      searchIncludes: null,
      searchAvail: null,
      record: {
        id: 0,
        name: "",
        amountconcurrentevents: null,
        googlecalendar: "",
        youtubeimage: "",
        youtubedescription: "",
        youtubelink: "",
        emaildepartmentproduct: "",
        color: "#000000",
        company_uptos3_id: null,
        users: [],
      },
      selectedFile: null,
      urlImage: `${require("@/assets/images/pages/sem-foto.png")}`,
    };
  },
  created() {
    localize("pt_BR", pt_br);
  },
  mounted() {
    this.getRecord();
  },
  methods: {
    validationForm() {
      this.$refs.companyRules.validate().then((success) => {
        if (success) {
          this.save();
        }
      });
    },
    getRecord() {
      if (this.$route.params.id > 0) {
        this.loading = true;
        _companyService
          .find(this.$route.params.id)
          .then((res) => {
            this.record = res.content;
            if (this.record.youtubeimage) {
              this.urlImage = `${res.pathimage}/${this.record.youtubeimage}`;
            }
            this.record.users = res.content.companyUsers.map((m) => {
              return {
                name: m.user.name,
                email: m.user.email,
                id: m.user.id,
              };
            });
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.loading = false));
      }
    },
    save() {
      this.record.companyUsers = this.record.users.map((m) => {
        return {
          user_id: m.id,
        };
      });

      let payload = new FormData();

      if (this.selectedFile) {
        payload.append("capa", this.selectedFile);
      }
      payload.append("dados", JSON.stringify(this.record));

      //promisse
      const _createOrUpdate =
        this.record.id <= 0
          ? _companyService.create(payload)
          : _companyService.update(payload);

      this.loading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Registro salvo com sucesso.");
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
      _companyService
        .delete(this.record.id)
        .then(() => {
          this.$utils.toast("Notificação", "Excluido com sucesso.");
          this.$router.go(-1);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    filterincludes() {
      if (this.searchIncludes) {
        this.record.permissions = this.record.permissionsAux.filter((f) =>
          f.value.toLowerCase().includes(this.searchIncludes.toLowerCase())
        );
      } else {
        this.record.permissions = this.record.permissionsAux;
      }
    },
    filterAvails() {
      this.loading = true;
      _usersService
        .show(1, this.searchAvail)
        .then((res) => {
          if (res.content) {
            this.users = res.content.map((m) => {
              return {
                name: m.name,
                email: m.email,
                id: m.id,
              };
            });
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    onFileChange(e) {
      e.preventDefault();
      this.selectedFile = e.target.files[0];
      this.urlImage = URL.createObjectURL(e.target.files[0]);
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