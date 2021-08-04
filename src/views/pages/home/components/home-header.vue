<template>
  <header id="header-main" class="position-absolute mt-1" style="z-index: 1">
    <div class="container">
      <!-- MENU DESKTOP -->
      <div class="d-none d-sm-block">
        <b-row class="row-header">
          <b-col cols="6" class="d-flex align-items-center ml-1">
            <img :src="require('@/assets/images/home/Logo.png')" />
          </b-col>
          <b-col cols="6"> </b-col>
        </b-row>
      </div>

      <!-- MOBILE -->
      <div class="d-block d-sm-none">
        <div class="header-mobile-menu">
          <div style="padding-left: 2vw">
            <img :src="require('@/assets/images/home/Logo.png')" />
          </div>
        </div>
        <div class="footer fixed-bottom">
          <div class="p-1 shadow" style="background: #fafafa">
            <b-row>
              <b-col class="d-flex justify-content-center">
                <feather-icon
                  class="cursor-pointer"
                  icon="HomeIcon"
                  color="var(--warning)"
                  size="25"
                />
              </b-col>
              <b-col class="d-flex justify-content-center">
                <feather-icon
                  class="cursor-pointer"
                  icon="UserIcon"
                  color="var(--warning)"
                  size="25"
                />
              </b-col>
              <b-col class="d-flex justify-content-center">
                <feather-icon
                  class="cursor-pointer"
                  icon="HeartIcon"
                  color="var(--warning)"
                  size="25"
                  badge="2"
                  badge-classes="badge-success"
                />
              </b-col>
              <!-- <b-col class="d-flex justify-content-center">
                <feather-icon
                  icon="ShoppingCartIcon"
                  color="var(--warning)"
                  size="25"
                  badge="2"
                  badge-classes="badge-success"
                />
              </b-col> -->
              <b-col class="d-flex justify-content-center">
                <feather-icon
                  class="cursor-pointer"
                  @click="onClickToggle"
                  icon="MenuIcon"
                  color="var(--warning)"
                  size="25"
                />
              </b-col>
            </b-row>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- <nav class="navBarMobile">
      <div class="device">
        <div>
          <button @click="expandirmenu()" id="burger" class="open-main-nav">
            <span class="burger"></span>
            <span class="burger-text">Menu</span>
          </button>
          <nav class="main-nav" id="main-nav">
            <ul>
              <li>
                <a @click="GoConsultor()">Sou Psicólogo</a>
              </li>
              <li>
                <a @click="goEntrar()">Sou Paciente</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </nav> -->
  <!-- <header class="header col-lg-12">
      <div class="row">
        <div class="col-lg-4">
          <a href="/" class="logoDesktop">
            <img :src="require('@/assets/images/home/Logo.png')" />
          </a>
          <a href="/" class="logoMobile">
            <img :src="require('@/assets/images/home/LogoMobile.png')" />
          </a>
        </div>
        <div class="col-lg-8 navBar" style="cursor: pointer !important">
          <div class="btnEntrar">
            <button>Sou Psicólogo</button>
          </div>
          <div class="btnEntrar ml-3">
            <button>Sou Paciente</button>
          </div>
        </div>
      </div>
    </header> -->
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