<template>
  <div class="container-fluid shadow">
    <div class="container" id="main-page">
      <div id="home-header">
        <div id="header-logo">
          <b-button
            class="pl-0"
            variant="transparent"
            :to="{ name: 'home-view' }"
          >
            <img :src="require('@/assets/images/logo/logo4.png')" />
          </b-button>
          <div id="home-header-links">
            <b-link
              class="mr-2 b-link-destaque"
              :to="{ name: 'merchants-view' }"
            >
              <strong>Buscar Profissionais</strong>
            </b-link>
            <b-link class="mr-2" :to="{ name: 'auth-login-psicologo' }">
              <strong>Para Psicólogos</strong>
            </b-link>
          </div>
        </div>
        <div class="home-header-customer">
          <b-button
            :to="{ name: 'auth-login-paciente' }"
            class="mx-1"
            variant="outline-primary"
          >
            Entrar
          </b-button>
          <b-button
            :to="{ name: 'auth-quero-cadastrar-paciente' }"
            variant="primary"
          >
            Cadastra-se grátis
          </b-button>
        </div>
      </div>

      <div class="home-header-mobile">
        <div id="header-logo">
          <b-button
            class="pl-0"
            variant="transparent"
            :to="{ name: 'home-view' }"
          >
            <img :src="require('@/assets/images/logo/logo4.png')" />
          </b-button>
          <div class="home-header-customer">
            <div class="menu-section">
              <div class="menu-toggle" @click="onClickToggle">
                <div class="one"></div>
                <div class="two"></div>
                <div class="three"></div>
              </div>
              <nav v-if="!show">
                <img
                  id="home-header-nav-img"
                  :src="require('@/assets/images/logo/logo10.png')"
                />
                <b-link
                  :to="{ name: 'merchants-view' }"
                  class="b-link-destaque mb-2 text-center"
                  @click="onclickMenu"
                >
                  <span>Buscar Profissionais</span>
                </b-link>
                <b-link
                  class="mb-2 text-center"
                  style="color: var(--white)"
                  :to="{ name: 'auth-login-psicologo' }"
                >
                  <strong class="text-center">Para Psicólogos</strong>
                </b-link>
                <b-button
                  :to="{ name: 'auth-login-paciente' }"
                  variant="primary"
                  class="mb-1"
                >
                  Entrar
                </b-button>
                <b-link
                  :to="{ name: 'auth-quero-cadastrar-paciente' }"
                  id="btn-mobile-cadastra-se"
                >
                  Cadastra-se grátis
                </b-link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { BLink } from "bootstrap-vue";
export default {
  components: {
    BLink,
  },
  data() {
    return {
      show: true,
    };
  },
  methods: {
    onClickToggle() {
      const menuSection = document.querySelector(".menu-section");
      document.body.style.overflow = this.show ? "hidden" : "initial";
      menuSection.classList.toggle("on", this.show);
      this.show = !this.show;
    },
    onclickMenu() {
      document.body.style.overflow = "initial";
      this.show = !this.show;
    },
  },
};
</script>
<style>
#home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#header-logo {
  display: flex;
  align-items: center;
}

#header-logo img {
  width: 250px;
}

#home-header-nav-img {
  left: 0;
  top: 0;
  position: absolute;
  right: 0;
  margin-top: 25px;
  margin-left: 25px;
}

.b-link-destaque {
  background: var(--teal);
  color: var(--blue);
  padding: 10px;
  font-weight: 700;
  border-radius: 3px;
}

#btn-mobile-cadastra-se {
  background: var(--indigo);
  color: var(--white);
  padding: 10px;
  text-align: center;
}

#home-header-links {
  font-size: 16px;
}

.one,
.two,
.three {
  background-color: var(--primary);
  height: 5px;
  width: 100%;
  margin: 6px auto;
  transition-duration: 0.3s;
}

.menu-toggle {
  width: 40px;
  height: 30px;
}

/* fullscreen */
.menu-section.on {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--primary);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-section.on nav {
  flex-direction: column;
  display: flex;
}

.menu-section.on .menu-toggle {
  position: absolute;
  right: 35px;
  top: 15px;
  margin-top: 10px;
}

.menu-section.on .menu-toggle .one {
  transform: rotate(45deg) translate(7px, 7px);
  background-color: var(--white);
}

.menu-section.on .menu-toggle .two {
  opacity: 0;
}

.menu-section.on .menu-toggle .three {
  transform: rotate(-45deg) translate(8px, -9px);
  background-color: var(--white);
}

.home-header-mobile {
  display: none;
}

@media screen and (max-width: 929px) {
  #home-header {
    display: none;
  }
  .home-header-mobile {
    display: block;
  }

  #header-logo {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  #header-logo img {
    width: 200px;
  }
}
</style>