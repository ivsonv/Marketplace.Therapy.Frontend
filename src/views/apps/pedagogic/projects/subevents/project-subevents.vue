<template>
  <div>
    <b-card>
      <b-row class="mb-1 mb-sm-0">
        <b-col md="8">
          <button--c
            :variant="'gradient-info'"
            :iconsize="'20'"
            :icon="null"
            :permission="'permission.sub.events.create'"
            :title="'Cadastrar SubEvento'"
            @clicked="onClickSave(null)"
            class="mb-2"
          />
        </b-col>
        <b-col md="4">
          <b-input-group>
            <b-form-input
              placeholder="pesquise por Nome"
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
      <b-overlay
        :show="isloading"
        spinner-variant="primary"
        spinner-type="grow"
      >
        <b-table
          :items="!isloading ? list[currentePage].itens : []"
          :fields="fields"
          :busy="isloading"
          responsive
          hover
        >
          <template #cell(actions)="data">
            <div class="text-nowrap">
              <feather-icon
                :id="`details-event-row-${data.item.id}`"
                icon="TrelloIcon"
                size="16"
                class="mx-1"
                @click="onClickSave(data.item)"
              />
              <feather-icon
                :id="`edit-event-row-${data.item.id}`"
                icon="EditIcon"
                size="16"
                class="mx-1"
                @click="onClickSave(data.item)"
              />
              <b-tooltip
                v-if="data.index > 1"
                title="Editar Evento"
                :target="`edit-event-row-${data.item.id}`"
              />
            </div>
          </template>
        </b-table>
      </b-overlay>
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

      <!-- DETALHES DO SUBEVENTO -->
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
            <h5 v-if="dto.id" class="mb-0">Editar SubEvento #{{ dto.id }}</h5>
            <h5 v-else class="mb-0">Cadastrar SubEvento</h5>
            <div>
              <feather-icon
                class="ml-1 cursor-pointer"
                icon="XIcon"
                size="16"
                @click="hide"
              />
            </div>
          </div>
          <project-subevent-form @result="onResult" :dto="dto" />
        </template>
      </b-sidebar>
    </b-card>
  </div>
</template>

<script>
import { VBToggle } from "bootstrap-vue";

import _teachersService from "@/services/teachers-service";
import _guestsService from "@/services/guests-service";
import _subeventService from "@/services/subevent-service";

import project_subevent from "./project-subevent";

export default {
  directives: {
    "b-toggle": VBToggle,
  },
  components: {
    "project-subevent-form": project_subevent,
  },
  data() {
    return {
      isloading: false,
      currentePage: 1,
      search: "",
      size: 12,
      rows: 20,
      fields: [
        { key: "name", label: "Nome" },
        { key: "event.name", label: "Evento" },
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
      _subeventService
        .show(_page, this.search, this.$route.params.id)
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
      this.dto = {
        event_id: _record ? _record.event_id : this.$route.params.id,
        id: _record ? _record.id : 0,
      };
      this.isSave = true;
    },
    onResult(_res) {
      this.isSave = false;
      this.dto = null;
      this.filter();
    },
  },
};
</script>