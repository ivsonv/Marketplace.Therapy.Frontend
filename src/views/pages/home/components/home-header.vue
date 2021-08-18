<template>
  <div class="container position-absolute" style="z-index: 1">
    <div class="d-none d-sm-block">
      <div class="row">
        <div class="col-6 my-1">
          <img :src="require('@/assets/images/home/Logo.png')" />
        </div>
        <div class="col-6 d-flex align-items-center justify-content-end">
          <b-button
            @click="goMerchant"
            size="lg"
            variant="warning"
            class="rounded mr-1"
            pill
          >
            Sou Psicólogo
          </b-button>
          <b-button size="lg" variant="warning" class="rounded" pill>
            Sou Paciente
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: true,
    };
  },
  created() {},
  methods: {
    onClickToggle() {
      this.show = !this.show;
    },
    goMerchant() {
      this.$router.push({ name: "auth-login-psicologo" });
    },
  },
};
</script>
<style>
.header-mobile-search {
  background: #fe9a2c 0% 0% no-repeat padding-box;
  border-radius: 3px;
  opacity: 0.8;
  height: 32px;
  width: 42px;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>