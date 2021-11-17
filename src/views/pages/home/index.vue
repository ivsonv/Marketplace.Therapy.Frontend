<template>
  <div class="main-view">
    <header--v />
    <home--v />
    <footer--v />
  </div>
</template>

<script>
import HomeHeader from "./components/home-header.vue";
import HomeFooter from "./components/home-footer.vue";
import HomeStart from "./components/home-start.vue";

export default {
  components: {
    "footer--v": HomeFooter,
    "header--v": HomeHeader,
    "home--v": HomeStart,
  },
  data() {
    return {
      loading: false,
    };
  },
  created() {
    localStorage.removeItem("checkout");
  },
  methods: {
    goSearch() {
      this.$router.push({ name: "merchants-view" });
    },
  },
};
</script>

<style lang="scss">
.main-view {
  min-height: 100vh;
}
#main-page {
  max-width: 1300px;
}
@media screen and (max-width: 1500px) {
  #main-page {
    max-width: 1200px;
  }
}
@media screen and (max-width: 1400px) {
  #main-page {
    max-width: 1000px;
  }
}
</style>