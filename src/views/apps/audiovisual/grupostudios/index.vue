<template>
  <viewcard--c title="Grupo Estudios" :btnew="btnew">
    <b-row class="mb-1 d-flex justify-content-end">
      <b-col md="5">
        <b-input-group>
          <b-form-input
            placeholder="pesquise por Nome, local..."
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
    <view--c permission="permission.studiogroup.view" :busy="isloading">
      <b-table
        :items="!isloading ? list[currentePage].itens : []"
        :fields="fields"
        :busy="isloading"
        responsive
        striped
        hover
      >
        <template #cell(actions)="data">
          <div class="text-nowrap">
            <feather-icon
              :id="`details-studiogroup-row-${data.item.id}`"
              icon="TrelloIcon"
              size="16"
              class="mx-1"
              @click="onClickSelected(data.item)"
            />
            <b-tooltip
              v-if="data.index > 0"
              title="Detalhes"
              :target="`details-studiogroup-row-${data.item.id}`"
            />

            <feather-icon
              :id="`details-studios-row-${data.item.id}`"
              icon="VideoIcon"
              size="16"
              class="mx-1"
              @click="onClickDetails(data.item)"
            />
            <b-tooltip
              v-if="data.index > 0"
              title="Studios"
              :target="`details-studios-row-${data.item.id}`"
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
    </view--c>
  </viewcard--c>
</template>

<script>
import _studioGroupService from "@/services/studios-group-service";
export default {
  data() {
    return {
      btnew: {
        permission: "permission.studiogroup.create",
        to: "/audio-visual/studiogroup/0",
      },
      isloading: false,
      currentePage: 1,
      search: null,
      size: 12,
      rows: 20,
      fields: [
        { key: "name", label: "Nome" },
        { key: "place.name", label: "Local" },
        { key: "quantity", label: "Qtd. Estúdios" },
        { key: "actions", label: "Ações" },
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
      _studioGroupService
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
        path: `/audio-visual/studiogroup/${record.id}`,
      });
    },
    onClickDetails(record, _) {
      this.$router.push({
        path: `/audio-visual/studios/${record.id}`,
      });
    },
  },
};
</script>