<template>
  <div class="main-view">
    <header--v />
    <home--v />
  </div>
</template>

<script>
import HomeHeader from "./components/home-header";
import HomeStart from "./components/home-start.vue";

export default {
  components: {
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
</style>