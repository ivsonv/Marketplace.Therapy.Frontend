<template>
  <viewcard--c title="Empresas" :btnew="btnew">
    <!-- list items -->
    <view--c permission="permission.company.view" :busy="isloading">
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
      </b-table>

      <!-- paginação -->
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
import _companyService from "@/services/company-service";
export default {
  data() {
    return {
      btnew: {
        permission: "permission.company.create",
        to: "/registrations/company/0",
      },

      isloading: false,
      currentePage: 1,
      size: 12,
      rows: 20,
      fields: [
        { key: "name", label: "Nome" },
        { key: "color", label: "Cor Padrão" },
        { key: "amountconcurrentevents", label: "Qtd. Eventos Simultâneos" },
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
      _companyService
        .show(_page)
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
    onClickSelected(record, _) {
      this.$router.push({
        path: `/registrations/company/${record.id}`,
      });
    },
  },
};
</script>