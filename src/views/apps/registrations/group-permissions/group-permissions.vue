<template>
  <viewcard--c
    :title="
      $route.params.id > 0
        ? 'Atualizar Grupo de acesso'
        : 'Cadastrar Grupo de acesso'
    "
    :btsave="$route.params.id > 0 ? btedit : btcreate"
    :btdelete="$route.params.id > 0 ? btdelete : null"
    :btback="{}"
    :busy="loading"
    @clicked-save="validationForm"
    @clicked-delete="onDelete"
  >
    <hr class="p-0 m-0 mb-1" />
    <validation-observer ref="userRules">
      <b-form @submit.prevent>
        <b-row>
          <b-col cols="6">
            <b-form-group>
              <validation-provider
                #default="{ errors }"
                name="Nome"
                rules="required"
              >
                <b-form-input
                  v-model="record.name"
                  placeholder="Nome do Grupo de acesso..."
                  autocomplete="off"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-row>

        <h5>Vincular Permissões</h5>
        <small class="text-muted"
          >Arraste as permissões para adicionar ou remover.</small
        >
        <hr />

        <!-- Permissões -->
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
              <h5 class="font-weight-bold mb-2">Permissões Incluída(s)</h5>
              <feather-icon icon="ArrowDownCircleIcon" size="25" />
            </div>

            <!-- draggable -->
            <draggable
              :list="record.permissionsAttached"
              tag="ul"
              group="people"
              class="list-group list-group-flush cursor-move"
            >
              <b-list-group-item
                v-for="(listItem, index) in record.permissionsAttached"
                :key="index"
                tag="li"
                class="my-25"
              >
                <div class="d-flex">
                  <div class="ml-25">
                    <b-card-text class="mb-0 font-weight-bold">
                      {{ listItem.label }}
                    </b-card-text>
                  </div>
                </div>
              </b-list-group-item>
            </draggable>
            <p
              class="text-center pt-1"
              v-if="
                !record.permissionsAttached ||
                record.permissionsAttached.length <= 0
              "
            >
              Nenhuma Permissão no grupo
            </p>
          </b-col>
          <b-col md="6">
            <b-input-group>
              <b-form-input
                placeholder="filtrar disponíveis..."
                autocomplete="off"
                v-model="searchAvail"
                @keyup="filterAvails"
              />
            </b-input-group>
            <hr />
            <div class="text-center">
              <h5 class="font-weight-bold mb-2">Permissões Disponiveis</h5>
              <feather-icon icon="ArrowDownCircleIcon" size="25" />
            </div>

            <!-- draggable -->
            <draggable
              :list="permissions"
              tag="ul"
              group="people"
              class="list-group list-group-flush cursor-move"
            >
              <b-list-group-item
                v-for="(listItem, index) in permissions"
                :key="index"
                tag="li"
                class="my-25"
              >
                <div class="d-flex">
                  <div class="ml-25">
                    <b-card-text class="mb-0 font-weight-bold">
                      {{ listItem.label }}
                    </b-card-text>
                  </div>
                </div>
              </b-list-group-item>
            </draggable>
            <p
              class="text-center pt-1"
              v-if="!permissions || permissions.length <= 0"
            >
              Nenhuma Permissão no grupo
            </p>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </viewcard--c>
</template>
<script>
import _groupPermissionService from "@/services/group-permissions";

import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import pt_br from "vee-validate/dist/locale/pt_BR.json";
import { required, email } from "@validations";
import draggable from "vuedraggable";
import { BListGroupItem } from "bootstrap-vue";
export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    BListGroupItem,
    draggable,
  },
  data() {
    return {
      btedit: { permission: `group.permission.edit` },
      btcreate: { permission: `group.permission.create` },
      btdelete: { permission: `group.permission.delete` },
      loading: false,
      permissions: [],
      permissionsAux: [],
      searchIncludes: null,
      searchAvail: null,
      record: {
        id: 0,
        name: "",
        permissionsAttached: [],
        permissionsAux: [],
      },
    };
  },
  created() {
    this.getpermissions();
    localize("pt_BR", pt_br);
  },
  mounted() {
    this.getRecord();
  },
  methods: {
    validationForm() {
      this.$refs.userRules.validate().then((success) => {
        if (success) {
          this.save();
        }
      });
    },
    getRecord() {
      if (this.$route.params.id > 0) {
        this.loading = true;
        _groupPermissionService
          .find(this.$route.params.id)
          .then((res) => {
            this.record = res.content;
            this.record.permissionsAttached =
              this.record.permissionsAttached.map((m) => {
                return {
                  label: this.dsPermission(m.name),
                  value: m.name,
                };
              });

            // limpar outras
            let permissionAUX = [];
            this.permissions.forEach((_ele) => {
              if (
                !this.record.permissionsAttached.some(
                  (s) => s.value === _ele.value
                )
              ) {
                permissionAUX.push(_ele);
              }
            });
            this.permissions = permissionAUX;

            // não usar o mesmo endereço de memoria
            this.permissionsAux = this.permissions.map((m) => m);
            this.record.permissionsAux = this.record.permissionsAttached.map(
              (m) => m
            );
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.loading = false));
      }
    },
    getpermissions() {
      _groupPermissionService
        .showPermissions()
        .then((res) => {
          this.permissions = res;
          this.permissionsAux = res.map((m) => m);
        })
        .catch((error) => this.$utils.toastError("Notificação", error));
    },
    dsPermission(_permit) {
      if (this.permissions.some((s) => s.value === _permit)) {
        return this.permissions.filter((f) => f.value === _permit)[0].label;
      }
      return _permit;
    },
    save() {
      if (this.searchIncludes) {
        this.$utils.toastError(
          "OPS!!",
          "para salvar 'filtrar incluida' deve está vazio"
        );

        return;
      }

      this.record.permissionsAttached = this.record.permissionsAttached.map(
        (m) => {
          return {
            name: m.value,
          };
        }
      );

      const payload = { data: { ...this.record } };
      const _createOrUpdate =
        this.record.id <= 0
          ? _groupPermissionService.create(payload)
          : _groupPermissionService.update(payload);

      this.loading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Usuário salvo com sucesso.");
          this.$router.go(-1);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    onDelete() {
      this.loading = true;
      _groupPermissionService
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
          f.label.toLowerCase().includes(this.searchIncludes.toLowerCase())
        );
      } else {
        this.record.permissions = this.record.permissionsAux;
      }
    },
    filterAvails() {
      if (this.searchAvail) {
        this.permissions = this.permissionsAux.filter((f) =>
          f.label.toLowerCase().includes(this.searchAvail.toLowerCase())
        );
      } else {
        this.permissions = this.permissionsAux;
      }
    },
  },
};
</script>