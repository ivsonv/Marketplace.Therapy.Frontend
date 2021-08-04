<template>
  <b-card title="Lista de Contatos">
    <b-row class="mb-1 mb-sm-0">
      <b-col md="8">
        <button--c
          :variant="'gradient-info'"
          :iconsize="'20'"
          :icon="null"
          :permission="'permission.dialer.contact.create'"
          :title="'Cadastrar Lista'"
          @clicked="openNew"
          class="mb-2"
        />
      </b-col>
      <b-col md="4">
        <b-input-group>
          <b-form-input
            placeholder="pesquise por Nome..."
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

    <b-sidebar
      sidebar-class="sidebar-lg"
      bg-variant="white"
      v-model="create_list"
      right
      backdrop
      shadow
      no-header
    >
      <template #default="{ hide }" v-if="create_list">
        <div
          class="
            d-flex
            justify-content-between
            align-items-center
            content-sidebar-header
            px-2
            py-1
          "
        >
          <h5 class="mb-0">
            {{
              recordtype.id > 0
                ? `Editar Lista #${recordtype.id}`
                : "Cadastrar Lista"
            }}
          </h5>
          <div>
            <feather-icon
              class="ml-1 cursor-pointer"
              icon="XIcon"
              size="16"
              @click="hide"
            />
          </div>
        </div>
        <b-form class="px-1 py-1">
          <b-row>
            <b-col cols="12">
              <b-form-group label="Nome da Lista">
                <b-form-input
                  placeholder="digite o nome.."
                  autocomplete="off"
                  v-model="recordtype.name"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <button--c
                :variant="'info'"
                :iconsize="'20'"
                :icon="null"
                :permission="
                  recordtype.id > 0
                    ? 'permission.dialer.contact.edit'
                    : 'permission.dialer.contact.create'
                "
                :title="'Salvar'"
                @clicked="createContact"
                class="mr-1"
              />
            </b-col>
          </b-row>
        </b-form>
      </template>
    </b-sidebar>

    <b-overlay :show="isloading" spinner-variant="primary" spinner-type="grow">
      <b-table
        :busy="isloading"
        :fields="fields"
        :items="list"
        responsive
        hover
      >
        <template #cell(actions)="data">
          <div class="text-nowrap">
            <feather-icon
              :id="`edit-row-${data.item.id}`"
              icon="EditIcon"
              size="16"
              class="mx-1"
              @click="onClickSelected(data.item, null)"
            />

            <feather-icon
              :id="`import-row-${data.item.id}`"
              icon="FileTextIcon"
              size="16"
              class="mx-1"
              @click="onClickImport(data.item)"
              v-if="$utils.isPermited('permission.dialer.contact.import')"
            />
            <b-tooltip
              v-if="
                data.index > 0 &&
                $utils.isPermited('permission.dialer.contact.import')
              "
              title="Importar Contatos"
              :target="`import-row-${data.item.id}`"
            />

            <feather-icon
              :id="`contatos-importados-row-${data.item.id}`"
              icon="UsersIcon"
              size="16"
              class="mx-1"
              @click="onClickContacts(data.item)"
              v-if="$utils.isPermited('permission.dialer.contact.import.view')"
            />
            <b-tooltip
              v-if="
                data.index > 0 &&
                $utils.isPermited('permission.dialer.contact.import.view')
              "
              title="Contatos Importados"
              :target="`contatos-importados-row-${data.item.id}`"
            />
          </div>
        </template>
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
import _contactTypeService from "@/services/dialer/contact-type-list-service";
import _contactservice from "@/services/dialer/contact-list-service";

export default {
  data() {
    return {
      isloading: false,
      currentePage: 1,
      create_list: false,
      more: false,
      search: "",
      size: 12,
      fields: [
        { key: "name", label: "Contato" },
        { key: "actions", label: "Ações" },
      ],
      list: [],
      typeslist: [],
      typesSelected: [{ label: "Selecione", value: "-1" }],
      recordtype: {
        id: 0,
        name: "",
        contact_type_list_id: 0,
      },
    };
  },
  mounted() {
    this.getRecords(this.currentePage);
  },
  methods: {
    getRecords(_page) {
      this.isloading = true;
      _contactservice
        .show(_page, this.search)
        .then((res) => {
          if (res.content) {
            this.more = res.content.length >= this.size;
            this.list.push(...res.content);
            this.currentePage = _page;
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    showContactTypes() {
      this.loading = true;
      _contactTypeService
        .showAll()
        .then((res) => {
          this.typeslist = this.$utils.populardropdown(
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
    getLoadMore() {
      this.getRecords(this.currentePage + 1);
    },
    filter() {
      this.currentePage = 1;
      this.list = [];
      this.getRecords(this.currentePage);
    },
    newRecord() {
      this.recordtype.contact_type_list_id = 0;
      this.recordtype.name = "";
      this.recordtype.id = 0;
    },
    createContact() {
      if (this.typesSelected) {
        this.recordtype.contact_type_list_id = this.typesSelected.value;
        this.recordtype.contactTypeList = null;
      }

      const payload = { data: this.recordtype };

      const _createOrUpdate =
        this.recordtype.id <= 0
          ? _contactservice.create(payload)
          : _contactservice.update(payload);

      this.isloading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Salvo com sucesso.");
          this.create_list = false;
          this.filter();
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    onClickSelected(record, _) {
      this.recordtype = record;
      this.typesSelected = this.typeslist.filter(
        (f) =>
          f.value.toString() === this.recordtype.contact_type_list_id.toString()
      )[0];
      this.create_list = true;
    },
    onClickImport(record) {
      this.$router.push({
        path: `/dialer/contacts/import/${record.id}`,
      });
    },
    onClickContacts(record) {
      this.$router.push({
        path: `/dialer/contacts/import/list/${record.id}`,
      });
    },
    openNew() {
      this.newRecord();
      this.create_list = true;
    },
  },
};
</script>