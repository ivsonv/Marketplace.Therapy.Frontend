<template>
  <b-button
    variant="gradient-primary"
    style="margin-right: 20px"
    to="/pesquisa"
    v-show="showScheduled"
  >
    <span class="align-middle">Escolher / agendar o profissional</span>
  </b-button>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      showScheduled: false,
    };
  },
  created() {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.roles) {
      this.showScheduled = userData.roles.some((s) => s === "account.customer");
    }
  },
};
</script>