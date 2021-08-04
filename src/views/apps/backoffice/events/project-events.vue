<template>
  <b-card>
    <b-row class="mb-1 mb-sm-0">
      <b-col md="8"> </b-col>
      <b-col md="4" class="mb-1">
        <b-input-group>
          <b-form-input
            placeholder="pesquise por nome do evento..."
            autocomplete="off"
            v-model="search"
          />
          <b-input-group-append>
            <b-button variant="gradient-info" @click="filter">
              Pesquisar
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
    <b-overlay :show="isloading" spinner-variant="primary" spinner-type="grow">
      <b-table
        :items="list"
        :fields="fields"
        :busy="isloading"
        responsive
        hover
      >
        <template #cell(backoffice_id)="data">
          <div
            class="text-nowrap"
            v-if="data.item.backoffice_id && data.item.backoffice_id > 0"
          >
            {{ data.item.backoffice_id }}
            <feather-icon
              :id="`cancel-event-backoffice-row-${data.item.id}`"
              icon="DeleteIcon"
              size="16"
              class="mx-1"
              @click="onBlurBackoffice(data.item, true)"
              v-if="
                $utils.isPermited('permission.backoffice.edit') ||
                $utils.isPermited('permission.backoffice.delete')
              "
            />
          </div>
          <div class="text-nowrap" v-else>
            <b-form-group
              v-if="$utils.isPermited('permission.backoffice.create')"
            >
              <v-select
                v-model="data.item.backofficeSelected"
                :options="data.item.backoffices"
                searchable
                @search:blur="() => onBlurBackoffice(data.item, false)"
                @search="
                  (res) => {
                    searchBackoffice(data.item, res);
                  }
                "
                :loading="data.item.isloadingBackoffice"
              >
                <template v-slot:no-options="{ search, searching }">
                  <template v-if="searching">
                    Pesquisando ... <em>{{ search }}</em
                    >.
                  </template>
                  <em style="opacity: 0.5" v-else>Digite o Nome ou Id</em>
                </template>
              </v-select>
            </b-form-group>
          </div>
        </template>
        <!-- <template #cell(youtube_url)="data">
          <div class="text-nowrap">
            <b-form-group>
              <b-input-group>
                <b-form-input
                  placeholder="Informe url..."
                  autocomplete="off"
                  v-model="data.item.youtube_url"
                />
                <b-input-group-append>
                  <b-button
                    variant="gradient-info"
                    @click="onBlurYoutube(data.item)"
                  >
                    <feather-icon icon="SaveIcon" size="15" />
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </div>
        </template> -->
      </b-table>
      <hr />
      <div class="d-flex justify-content-center">
        <b-button @click="getLoadMore" variant="secondary" v-if="more" pill>
          Carregar mais
        </b-button>
      </div>
    </b-overlay>
  </b-card>
</template>

<script>
import { VBToggle } from "bootstrap-vue";
import _eventService from "@/services/event-service";
import _externalDataBaseService from "@/services/external-database-service";

export default {
  props: {
    projectId: {
      type: Object,
      default: null,
    },
  },
  watch: {
    projectId() {
      this.filter();
    },
  },
  directives: {
    "b-toggle": VBToggle,
  },
  data() {
    return {
      userData: JSON.parse(localStorage.getItem("userData")),
      debounceMilliseconds: 300,
      isloading: false,
      isloadingBackoffice: false,
      currentePage: 1,
      more: false,
      search: "",
      size: 12,
      fields: [
        { key: "name", label: "Nome" },
        { key: "project.name", label: "Projeto" },
      ],
      urlImage: `${require("@/assets/images/pages/sem-foto.png")}`,
      list: [],
      isSave: false,
      dto: null,
      timeout: null,
    };
  },
  created() {
    if (!this.$route.params.project) {
      this.getRecords(this.currentePage);

      const roles = this.userData.roles;
      if (roles.some((s) => s === "admin" || s === "backoffice")) {
        this.fields.push({
          key: "backoffice_id",
          label: "BackOffice ID",
          class: "td-min-column",
        });
        // this.fields.push({
        //   key: "youtube_url",
        //   label: "Youtube Url",
        //   class: "td-min-column-youtube",
        // });
      } else {
        // if (roles.some((s) => s === "backoffice")) {
        //   this.fields.push({
        //     key: "backoffice_id",
        //     label: "BackOffice ID",
        //     class: "td-min-column",
        //   });
        // }
        // if (roles.some((s) => s === "backyoutube")) {
        //   this.fields.push({
        //     key: "youtube_url",
        //     label: "Youtube Url",
        //     class: "td-min-column-youtube",
        //   });
        // }
      }
    }
  },
  methods: {
    getRecords(_page) {
      this.isloading = true;
      _eventService
        .showBackoffice(
          _page,
          this.search,
          this.projectId ? this.projectId.id : null
        )
        .then((res) => {
          if (res.content) {
            res.content.forEach((element) => {
              element.backoffices = [];
              element.backofficeSelected = null;
              element.isloadingBackoffice = false;

              if (!element.youtube_url) {
                element.youtube_url = "";
              }
            });

            this.more = res.content.length >= this.size;
            this.list.push(...res.content);
            this.currentePage = _page;
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    getLoadMore(_page) {
      this.getRecords(this.currentePage + 1);
    },
    filter() {
      this.currentePage = 1;
      this.list = [];
      this.getRecords(this.currentePage);
    },
    onClickSave(_record) {
      this.dto = {
        id: _record ? _record.id : 0,
        project_id: _record ? _record.project_id : this.$route.params.id,
      };
      this.isSave = true;
    },
    searchBackoffice(item, _search) {
      this.fetchBackoffice(item, _search);
    },
    fetchBackoffice(item, _search) {
      if (_search && _search.length >= 3) {
        item.backoffices = [];
        this.timeout = setTimeout(() => {
          if (!item.isloadingBackoffice) {
            item.isloadingBackoffice = true;
            _externalDataBaseService
              .autoComplete(_search)
              .then((res) => {
                if (res.content && res.content.length > 0) {
                  res.content.forEach((element) => {
                    item.backoffices.push({
                      value: element.id,
                      label: `${element.id} - ${element.nome}`,
                    });
                  });
                }
              })
              .catch((error) => this.$utils.toastError("Notificação", error))
              .finally(() => (item.isloadingBackoffice = false));
          }
        }, this.debounceMilliseconds);
      }
    },
    onBlurBackoffice(item, cancel) {
      if (!cancel && !item.backofficeSelected) {
        return false;
      }

      if (cancel) {
        item.backofficeSelected = null;
      }

      let dados = {
        id: item.id,
        backoffice_id: item.backofficeSelected
          ? item.backofficeSelected.value
          : null,
      };

      let payload = new FormData();
      payload.append("dados", JSON.stringify(dados));

      //promisse
      const _createOrUpdate = _eventService.upsertBackoffice(payload);

      this.isloading = true;
      _createOrUpdate
        .then((res) => {
          if (res.content && res.content.id > 0) {
            this.$utils.toast("SUCESSO", "Backoffice ID vinculado com sucesso");
            item.backoffice_id = res.content.backoffice_id;
            item.backofficeSelected = null;
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    onBlurYoutube(item) {
      const dados = {
        youtube_url: item.youtube_url,
        id: item.id,
      };

      let payload = new FormData();
      payload.append("dados", JSON.stringify(dados));

      //promisse
      const _createOrUpdate = _eventService.upsertYoutube(payload);

      this.isloading = true;
      _createOrUpdate
        .then((res) => {
          if (res.content && res.content.id > 0) {
            this.$utils.toast(
              "SUCESSO",
              "Url do Youtube vinculado com sucesso"
            );
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
  },
};
</script>
<style >
.td-min-column {
  min-width: 400px;
}
</style>