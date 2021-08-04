<template>
  <b-card>
    <b-row class="mb-1 mb-sm-0">
      <b-col md="6">
        <button--c
          :variant="'gradient-info'"
          :iconsize="'20'"
          :icon="null"
          :permission="'permission.pabx.agents.create'"
          :title="'Cadastrar Agente'"
          @clicked="onClickSave(null)"
          class="mb-2"
        />
      </b-col>
      <b-col md="6">
        <b-input-group>
          <b-form-input
            placeholder="pesquise por Nome, ramal..."
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
        :items="!isloading ? list[currentePage].itens : []"
        :fields="fields"
        :busy="isloading"
        responsive
        hover
        id="table-lessons"
      >
        <template #cell(actions)="data">
          <div class="text-nowrap">
            <feather-icon
              :id="`edit-row-${data.item.id}`"
              icon="EditIcon"
              size="16"
              class="mx-1"
              @click="onClickSave(data.item, null)"
            />

            <feather-icon
              :id="`delete-row-${data.item.id}`"
              icon="DeleteIcon"
              size="16"
              class="mx-1"
              @click="confirmDelete(data.item, null)"
              v-if="$utils.isPermited('permission.pabx.agents.delete')"
            />
          </div>
        </template>
      </b-table>
      <b-pagination
        v-model="currentePage"
        @change="getLoadMore"
        :total-rows="rows"
        v-if="rows > 20"
        first-number
        last-number
        align="center"
        prev-class="prev-item"
        next-class="next-item"
      >
        <template #prev-text>
          <feather-icon icon="ChevronLeftIcon" size="18" />
        </template>
        <template #next-text>
          <feather-icon icon="ChevronRightIcon" size="18" />
        </template>
      </b-pagination>
    </b-overlay>
    <b-sidebar
      sidebar-class="sidebar-lg"
      bg-variant="white"
      v-model="isSave"
      right
      backdrop
      shadow
      no-header
    >
      <template #default="{ hide }" v-if="isSave">
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
          <h5 v-if="dto.id" class="mb-0">Editar Agente #{{ dto.id }}</h5>
          <h5 v-else class="mb-0">Cadastrar Agente</h5>
          <div>
            <feather-icon
              class="ml-1 cursor-pointer"
              icon="XIcon"
              size="16"
              @click="hide"
            />
          </div>
        </div>
        <pabx-agent-form @result="onResult" :dto="dto" />
      </template>
    </b-sidebar>
  </b-card>
</template>

<script>
import _pabxService from "@/services/pabx-service";
import pabx_agent from "./agent.vue";

export default {
  components: {
    "pabx-agent-form": pabx_agent,
  },
  data() {
    return {
      debounceMilliseconds: 300,
      timeout: null,
      isloading: false,
      currentePage: 1,
      search: "",
      size: 12,
      rows: 20,
      fields: [
        { key: "id", label: "Ramal" },
        { key: "callerid", label: "Nome" },
        { key: "actions", label: "Ações" },
      ],
      list: [
        {
          page: 0,
          itens: [],
        },
      ],
      isSave: false,
      dto: null,
    };
  },
  created() {
    this.getRecords(this.currentePage);
  },
  methods: {
    getRecords(_page) {
      this.isloading = true;
      _pabxService
        .show(_page, this.search)
        .then((res) => {
          if (res.content) {
            this.list.push({ page: _page, itens: res.content });
            if (res.content.length > 0) {
              this.rows += this.$utils.pagination(res.content, this.size);
              this.currentePage = _page;
            }
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    getLoadMore(_page) {
      if (!this.list.some((s) => s.page === _page)) {
        this.getRecords(_page);
      }
    },
    filter() {
      this.currentePage = 1;
      this.rows = 20;
      this.list = [{ page: 0, itens: [] }];
      this.getRecords(this.currentePage);
    },
    onClickSave(_record) {
      if (_record) {
        // passando dados para outro componente
        this.dto = _record;
      } else {
        // criar registro novo
        this.dto = {
          Id: "",
          Callerid: "",
          Novo: true,
        };
      }
      this.isSave = true;
    },
    onResult(_res) {
      this.isSave = false;
      this.dto = null;
      this.filter();
    },
    onClickDelete(record, _) {
      this.isloading = true;
      _pabxService
        .delete(record.id)
        .then(() => {
          this.$utils.toast("Sucesso", "Atualizado com sucesso.");
          this.$emit("result", { status: "ok" });
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => ((this.isloading = false), this.onResult()));
    },
    confirmDelete(record, _) {
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
          this.onClickDelete(record, _);
        }
      });
    },
  },
};
</script>