<template>
  <div class="main-view">
    <!-- HEADER -->
    <header--v />

    <!-- BODY -->
    <section id="Inicio">
      <div class="boxInicio mb-5 pb-5">
        <h1>A qualquer hora, em qualquer lugar.</h1>
        <p>
          Agende uma consulta online de qualquer dispositivo
          <br />no conforto da sua casa ou onde estiver.
        </p>
      </div>
      <a>
        <b-button size="lg" variant="warning" class="rounded" pill>
          Agendar agora
        </b-button>
      </a>
    </section>
  </div>
</template>

<script>
import HomeHeader from "./components/home-header";
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
  methods: {
    login() {
      const loginRq = {
        login: "",
        pass: "",
      };
      // requisição AXIOS
      // ...........

      // popular dados usuario
      //   const payload = {
      //     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", // token gerado dynamic
      //     name: "Leonardo Brandão",
      //     ramal: this.userRamal || "TST",
      //     id: "I6IkpXVCJ9",
      //   };
      //   this.$store.dispatch("setLogin", payload);

      //   // Tela Inicial
      //   this.$router.push({ name: "softphone-view" });
    },
  },
};
</script>

<style lang="scss">
.main-view {
  min-height: 100vh;
}

#Inicio {
  margin: 0;
  height: 95vh;
  display: flex;
  color: white;
  position: relative;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  background-size: cover;
  background-position: bottom;
  background-image: url("~@/assets/images/home/headerHome.png");
  @media screen and (max-width: 770px) {
    height: 90vh;
    padding-left: 20px !important;
    padding-right: 20px !important;
  }
  .boxInicio {
    text-align: center;
    @media screen and (max-width: 474px) {
      br {
        display: none;
      }
    }
    h1 {
      font-size: 60px;
      font-weight: 600;
      color: var(--success);
      margin-bottom: 15px;
      @media screen and (max-width: 770px) {
        font-size: 40px;
      }
    }
    p {
      font-size: 28px;
      line-height: 28px;
      @media screen and (max-width: 770px) {
        font-size: 20px;
        line-height: 20px;
      }
    }
  }
  a {
    width: 178px;
    button {
      position: absolute;
      bottom: -5px;
    }
  }
}
</style>