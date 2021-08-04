<template>
  <div>
    <b-card>
      <b-row class="mb-1 mb-sm-0">
        <b-col md="8"></b-col>
        <b-col md="4" class="mb-1">
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
          @row-clicked="onClickSelected"
          :fields="fields"
          :busy="isloading"
          responsive
          hover
        >
          <template #cell(color)="data">
            <b-badge pill :style="`background: ${data.value}`">
              {{ data.value }}
            </b-badge>
          </template>
          <template #cell(actions)="data">
            <div class="text-nowrap">
              <feather-icon
                :id="`edit-event-row-${data.item.id}`"
                icon="TrelloIcon"
                size="16"
                class="mx-1"
                @click="onClickSave(data.item)"
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
    </b-card>
  </div>
</template>

<script>
import { VBToggle } from "bootstrap-vue";

import _service from "@/services/uptos3-service";
import uptos3_video from "./uptos3-video";

export default {
  props: {
    company: {
      type: String,
      required: true,
    },
  },
  components: {
    "uptos3-video-form": uptos3_video,
  },
  directives: {
    "b-toggle": VBToggle,
  },
  data() {
    return {
      isloading: false,
      currentePage: 1,
      search: "",
      size: 12,
      rows: 20,
      fields: [
        { key: "video_name", label: "Nome Vídeo" },
        { key: "question_id", label: "ID Sugerido" },
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
      _service
        .show(_page, this.company, this.search)
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
    onClickSelected(record, _) {
      this.$router.push({
        path: `/uptos3/questions/${record.id}`,
      });
    },
  },
};
</script>