<template>
  <b-button variant="gradient-info" style="margin-right: 20px" to="/pesquisa">
    <span class="align-middle">Escolher / agendar o profissional</span>

    <!-- <b-link class="nav-link" @click="toggleVerticalMenuActive">
        
      </b-link> -->
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
    // const userData = JSON.parse(localStorage.getItem("userData"));
    // if (userData && userData.roles) {
    //   this.showScheduled = userData.roles.some(
    //     (s) => s === "permission.appointment.view"
    //   );
    // }
  },
};
</script>