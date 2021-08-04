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
          :items="list"
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
        </b-table>
        <hr />
        <div class="d-flex justify-content-center">
          <b-button @click="getLoadMore" variant="secondary" v-if="more" pill>
            Carregar mais
          </b-button>
        </div>
      </b-overlay>
    </b-card>
  </div>
</template>

<script>
import { VBToggle } from "bootstrap-vue";

import _service from "@/services/uptos3-service";
//import uptos3_video from "./uptos3-video";

export default {
  props: {
    company: {
      type: String,
      required: true,
    },
  },
  components: {
    //"uptos3-video-form": uptos3_video,
  },
  directives: {
    "b-toggle": VBToggle,
  },
  data() {
    return {
      more: false,
      isloading: false,
      currentePage: 1,
      search: "",
      size: 12,
      fields: [
        { key: "correct_id", label: "Número da Questão" },
        { key: "repeat", label: "Repetidas" },
      ],
      list: [],
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
        .showRepeated(_page, this.company, this.search, this.size)
        .then((res) => {
          if (res.content) {
            this.more = res.content.length >= this.size;
            res.content.forEach((element) => {
              element.repeat = `${element.lev_score}x`;
            });
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
    onClickSelected(record, _) {
      this.$router.push({
        path: `/uptos3/correct/${record.correct_id}`,
      });
    },
  },
};
</script>