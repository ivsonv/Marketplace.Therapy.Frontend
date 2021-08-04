<template>
  <div>
    <b-overlay :show="isloading" spinner-variant="primary" spinner-type="grow">
      <b-table
        striped
        :per-page="perPage"
        :current-page="currentPage"
        responsive
        class="mb-0"
        :items="list"
        :fields="[
          { key: 'id', label: 'Código' },
          { key: 'json', label: 'Contatos' },
        ]"
        :busy="isloading"
      />
      <hr />
      <b-pagination
        v-model="currentPage"
        :total-rows="list.length"
        :per-page="perPage"
        align="center"
        size="lg"
        class="my-2"
      />
    </b-overlay>
  </div>
</template>
<script>
import _contactservice from "@/services/dialer/contact-list-service";

import { FormWizard, TabContent } from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";

import { BListGroupItem } from "bootstrap-vue";
import draggable from "vuedraggable";

export default {
  components: {
    FormWizard,
    TabContent,
    draggable,
    BListGroupItem,
  },
  data() {
    return {
      perPage: 20,
      totalRows: 1,
      currentPage: 1,
      isloading: false,
      record: null,
      list: [],
    };
  },
  created() {
    this.showContacts();
  },
  methods: {
    showContacts() {
      if (this.$route.params.id > 0) {
        this.isloading = true;
        _contactservice
          .findContacts(this.$route.params.id)
          .then((res) => {
            this.list = res.content.contacts;
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.isloading = false));
      }
    },
  },
};
</script>