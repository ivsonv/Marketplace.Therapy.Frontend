<template>
  <viewcard--c
    title="Vincular Usuários"
    subtitle="Arraste os usuários para adicionar ou remover."
    :btsave="btedit"
    :btback="{}"
    :busy="loading"
    @clicked-save="validationForm"
  >
    <hr class="p-0 m-0 mb-1" />
    <validation-observer ref="userRules">
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
            <p class="text-center pt-1" v-if="!users || users.length <= 0">
              Nenhum Usuário disponivel
            </p>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </viewcard--c>
</template>
<script>
import _usersService from "@/services/users-service";
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
      btedit: { permission: `permission.permissiongroup.edit` },
      loading: false,
      users: [],
      usersAux: [],
      searchIncludes: null,
      searchAvail: null,
      record: {
        id: 0,
        name: "",
        users: [],
        usersAux: [],
      },
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
            this.record.users = res.content.userGroupPermissions.map((m) => {
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
      this.record.userGroupPermissions = this.record.users.map((m) => {
        return {
          user_id: m.id,
        };
      });

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
  },
};
</script>