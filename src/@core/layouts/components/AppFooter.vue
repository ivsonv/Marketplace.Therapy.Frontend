<template>
  <p class="clearfix mb-0">
    <span class="float-md-left d-block d-md-inline-block mt-25">
      Copyright © {{ new Date().getFullYear() }}
      <span class="d-none d-sm-inline-block">
        - Todos os direitos reservados</span
      >
    </span>
  </p>
</template>

<script>
import { BLink } from "bootstrap-vue";

export default {
  components: {
    BLink,
  },
  created() {
    this.enviromentAPP = process.env.VUE_APP_ENVIROMENT;
  },
  data() {
    return {
      enviromentAPP: "",
    };
  },
};
</script>
