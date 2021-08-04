<template>
  <div>
    <viewcard--c title="Operadores" :btnew="btnew">
      <b-row class="mb-1 d-flex justify-content-end">
        <b-col md="5">
          <b-input-group>
            <b-form-input
              placeholder="pesquise por Nome, cargo, turno..."
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
      <view--c :permission="'permission.operators.view'" :busy="isloading">
        <b-table
          :items="!isloading ? list[currentePage].itens : []"
          @row-clicked="onClickSelected"
          :fields="fields"
          :busy="isloading"
          responsive
          hover
          class="mt-1"
        >
          <template #cell(color)="data">
            <b-badge pill :style="`background: ${data.value}`">
              {{ data.value }}
            </b-badge>
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
      </view--c>
    </viewcard--c>
  </div>
</template>

<script>
import _operatorsService from "@/services/operators-service";
export default {
  data() {
    return {
      btnew: {
        permission: "permission.operators.create",
        to: "/audio-visual/operator/0",
      },
      isloading: false,
      currentePage: 1,
      search: null,
      size: 12,
      rows: 20,
      fields: [
        { key: "name", label: "Nome" },
        { key: "career.name", label: "Carreira" },
        { key: "scale.name", label: "Turno" },
      ],
      list: [
        {
          page: 0,
          itens: [],
        },
      ],
    };
  },
  created() {
    this.getRecords(this.currentePage);
  },
  methods: {
    getRecords(_page) {
      this.isloading = true;
      _operatorsService
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
    onClickSelected(record, _) {
      this.$router.push({
        path: `/audio-visual/operator/${record.id}`,
      });
    },
  },
};
</script>