<template>
  <main class="main-view">
    <div class="container my-2">
      <!-- <h1 class="text-center my-2">Buscar Contatos</h1> -->
      <div class="row justify-content-center">
        <div class="col-12 col-md-8">
          <b-input-group>
            <b-form-input
              placeholder="pesquise por nome..."
              autocomplete="off"
              v-model="search"
              size="lg"
            />
            <b-input-group-append>
              <b-button variant="primary" @click="getSearchContacts">
                <feather-icon
                  class="cursor-pointer"
                  color="var(--white)"
                  icon="SearchIcon"
                />
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
      <b-card no-body class="border mt-1">
        <b-table
          v-if="list && list.length > 0"
          :fields="[
            { key: 'name', label: 'Nome' },
            { key: 'contact', label: 'Telefone' },
          ]"
          per-page="12"
          :busy="isloading"
          :items="list"
          class="mb-0"
          responsive
          striped
        />
      </b-card>
    </div>
  </main>
</template>

<script>
export default {
  data: () => ({
    isloading: false,
    search: "",
    list: [],
  }),
  methods: {
    getSearchContacts() {
      this.list = [
        { name: "ivson", contact: "61998695451" },
        { name: "ivson", contact: "61998695451" },
        { name: "ivson", contact: "61998695451" },
        { name: "ivson", contact: "61998695451" },
        { name: "ivson", contact: "61998695451" },
        { name: "ivson", contact: "61998695451" },
        { name: "ivson", contact: "61998695451" },
        { name: "ivson", contact: "61998695451" },
        { name: "ivson", contact: "61998695451" },
        { name: "ivson", contact: "61998695451" },
        { name: "ivson", contact: "61998695451" },
        { name: "ivson", contact: "61998695451" },
        { name: "ivson", contact: "61998695451" },
        { name: "ivson", contact: "61998695451" },
        { name: "ivson", contact: "61998695451" },
      ];
    },
  },
};
</script>
<style>
</style>