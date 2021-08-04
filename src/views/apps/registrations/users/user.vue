<template>
  <viewcard--c
    :title="$route.params.id > 0 ? 'Atualizar Usuário' : 'Cadastrar Usuário'"
    :btsave="$route.params.id > 0 ? btedit : btcreate"
    :btdelete="$route.params.id > 0 ? btdelete : null"
    :btback="{}"
    :busy="loading"
    @clicked-save="validationForm"
    @clicked-delete="confirmDelete"
  >
    <hr class="p-0 m-0 mb-1" />
    <validation-observer ref="userRules">
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
                  placeholder="Nome do Usuário"
                  autocomplete="off"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="E-mail *">
              <validation-provider
                #default="{ errors }"
                name="E-mail"
                rules="required|email"
              >
                <div class="form-label-group">
                  <b-form-input
                    type="email"
                    v-model="record.email"
                    placeholder="Informe um e-mail"
                    autocomplete="off"
                  />
                </div>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Grupo Permissão">
              <v-select
                v-if="groups"
                v-model="groupsSelected"
                :options="groups"
                autocomplete="off"
                multiple
                :clearable="false"
              />
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Login *">
              <validation-provider
                #default="{ errors }"
                name="Login"
                rules="required"
              >
                <div class="form-label-group">
                  <b-form-input
                    v-model="record.user_name"
                    placeholder="Login"
                  />
                </div>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="1">
            <b-card-text class="mb-0"> Interno </b-card-text>
            <b-form-checkbox
              class="custom-control-success mt-1"
              name="check-button"
              switch
              v-model="record.is_staff"
              :options="checkbox_values"
            >
              <span class="switch-icon-left">
                <feather-icon icon="CheckIcon" />
              </span>
              <span class="switch-icon-right">
                <feather-icon icon="XIcon" />
              </span>
            </b-form-checkbox>
          </b-col>
          <b-col md="2">
            <b-card-text class="mb-0"> Burlar 40 minutos </b-card-text>
            <b-form-checkbox
              class="custom-control-success mt-1"
              name="check-button"
              switch
              v-model="record.is_allows_scheduling_any_time"
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
        <b-row>
          <b-col cols="12">
            <b-card no-body class="border mt-1">
              <b-card-header class="p-1">
                <b-card-title class="font-medium-2">
                  <feather-icon icon="LockIcon" size="18" />
                  <span class="align-middle ml-50">Permissões</span>
                </b-card-title>
              </b-card-header>
              <b-table
                striped
                responsive
                class="mb-0"
                :items="record.roles"
                :fields="fields"
                :busy="loading"
              >
                <template #cell(role)="data">
                  {{ dsRule(data.value) }}
                </template>
                <template #cell(read)="data">
                  <b-form-checkbox
                    v-model="data.item.read"
                    :checked="data.item.read"
                  />
                </template>
                <template #cell(create)="data">
                  <b-form-checkbox
                    v-model="data.item.create"
                    :checked="data.item.create"
                  />
                </template>
                <template #cell(update)="data">
                  <b-form-checkbox
                    v-model="data.item.update"
                    :checked="data.item.update"
                  />
                </template>
                <template #cell(delete)="data">
                  <b-form-checkbox
                    v-model="data.item.delete"
                    :checked="data.item.delete"
                  />
                </template>
              </b-table>
            </b-card>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12">
            <b-button
              v-if="record.id > 0 && !record.is_staff"
              variant="primary"
              class="mr-1"
              @click="resetPassword"
            >
              Resetar Senha
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </viewcard--c>
</template>
<script>
import _usersService from "@/services/users-service";
import _authService from "@/services/auth-service";
import _groupPermissionService from "@/services/group-permissions";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import pt_br from "vee-validate/dist/locale/pt_BR.json";
import { required, email } from "@validations";
export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      btedit: { permission: `permission.user.edit` },
      btcreate: { permission: `permission.user.create` },
      btdelete: { permission: `permission.user.delete` },
      loading: false,
      groups: [],
      groupsSelected: [],
      record: {
        id: 0,
        name: "",
        email: "",
        user_name: "",
        is_staff: true,
        roles: [],
        is_allows_scheduling_any_time: false,
      },
      checkbox_values: [true, false],
      rolesSelected: null,
      roles: [],
      fields: [
        { key: "role", label: "Papel" },
        { key: "read", label: "Leitura" },
        { key: "create", label: "Criar" },
        { key: "update", label: "ATUALIZAR" },
        { key: "delete", label: "DELETAR" },
      ],
    };
  },
  created() {
    this.getRoles();
    this.getGroups();
    localize("pt_BR", pt_br);
  },
  mounted() {
    this.getRecord();
  },
  methods: {
    dsRule(_code) {
      return this.roles.filter((f) => f.value === _code)[0].label;
    },
    validationForm() {
      this.$refs.userRules.validate().then((success) => {
        if (success) {
          this.save();
        }
      });
    },
    getGroups() {
      _groupPermissionService
        .showAll()
        .then((res) => {
          this.groups = this.$utils.populardropdown(
            res.content,
            "name",
            "id",
            false,
            false,
            false
          );
        })
        .catch((error) => this.$utils.toastError("Notificação", error));
    },
    getRecord() {
      if (this.$route.params.id > 0) {
        this.loading = true;
        _usersService
          .find(this.$route.params.id)
          .then((res) => {
            this.record = res.content;
            this.groupsSelected = this.record.groupPermissions.map((m) => {
              return {
                label: m.permissionGroup.name,
                value: m.permissionGroup.id,
              };
            });
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.loading = false));
      }
    },
    getRoles() {
      _usersService
        .showRoles()
        .then((res) => {
          if (this.$route.params.id <= 0) {
            this.record.roles = res.map((m) => {
              return {
                role: m.id,
                read: false,
                create: false,
                update: false,
                delete: false,
              };
            });
          }

          this.roles = this.$utils.populardropdown(
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
    save() {
      if (this.groupsSelected) {
        this.record.groupPermissions = this.groupsSelected.map((m) => {
          return {
            group_permission_id: m.value,
          };
        });
      }

      const payload = { data: { ...this.record } };

      //promisse
      const _createOrUpdate =
        this.record.id <= 0
          ? _usersService.create(payload)
          : _usersService.update(payload);

      this.loading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Usuário salvo com sucesso.");
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
      _usersService
        .delete(this.record.id)
        .then(() => {
          this.$utils.toast("Notificação", "Excluido com sucesso.");
          this.$router.go(-1);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    resetPassword() {
      const payload = {
        email: this.record.email,
      };
      this.loading = true;
      _authService
        .userResetPassword(payload)
        .then((res) => {
          this.loading = false;
          this.$utils.toast(
            "Notificação",
            "Solicite o usuário que verifique o e-mail."
          );
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
  },
};
</script>