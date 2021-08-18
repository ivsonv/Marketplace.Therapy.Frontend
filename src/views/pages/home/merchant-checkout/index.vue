<template>
  <div class="main-view">
    <!-- HEADER -->
    <header--v />
  </div>
</template>

<script>
import HomeHeader from "../components/home-header";
export default {
  components: {
    "header--v": HomeHeader,
  },
  data() {
    return {
      loading: false,
    };
  },
  created() {},
  methods: {},
};
</script>

<style lang="scss">
.main-view {
  min-height: 100vh;
}
</style>