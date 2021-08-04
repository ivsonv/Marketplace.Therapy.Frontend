<template>
  <b-button
    variant="gradient-info"
    style="margin-right: 20px"
    to="/pedagogic/appointment/0"
    v-if="showScheduled"
  >
    <feather-icon icon="PlusIcon" class="mr-50" />
    <span class="align-middle">Agendamento</span>
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
      this.showScheduled = userData.roles.some(
        (s) => s === "permission.appointment.view"
      );
    }
  },
};
</script>