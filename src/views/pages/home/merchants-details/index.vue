<template>
  <div class="main-view">
    <header--v />
    <h1 v-if="loading">Buscando... <spinner--c /></h1>

    <div v-if="!loading">
      <!-- Profile -->
      <section class="mx-2 px-lg-5 pt-3 pb-0" v-if="provider">
        <div class="row">
          <!-- fields -->
          <div class="col-12 col-lg-7 mb-2 mb-lg-0">
            <div class="d-flex provider-bloco">
              <div>
                <img
                  class="image-profile"
                  :src="provider.image"
                  :alt="`Imagem de perfil ${provider.name}`"
                />
              </div>
              <div class="personal ml-lg-1 mt-lg-0 mt-2">
                <p>{{ provider.name }}</p>
                <strong class="text-center" v-if="provider.crp"
                  >CRP – {{ provider.crp }}</strong
                >
                <span class="text-center text-lg-left" v-if="provider.state">
                  | {{ provider.state }}</span
                >
                <div class="price">
                  <strong
                    >R$ {{ provider.price.toFixed(0) }} / 50 minutos</strong
                  >
                </div>
                <div class="price" v-if="provider.youtube">
                  {{ provider.youtube }}
                </div>
              </div>
            </div>
          </div>

          <!-- horários -->
          <h2 v-if="loadinghours">Buscando horários... <spinner--c /></h2>

          <div id="box-hours" class="col-12 col-lg-5 text-center shadow p-0">
            <hours--v
              v-if="!loadinghours"
              :qtdDisplayDates="qtdDisplayDates"
              :contents="contents"
              :dates="dates"
              :provider="provider"
              @previushours="previushours"
              @previushoursMobile="previushoursMobile"
              @nexthours="nexthours"
              @nexthoursMobile="nexthoursMobile"
              @confirmSelected="confirmSelected"
            />
            <strong>
              Ao Clicar no horário, você será direcionado para o pagamento (ou
              cadastro caso não tenha ainda.)
            </strong>
          </div>
        </div>
      </section>

      <!-- Details -->
      <section
        id="section-profile-details"
        class="px-lg-5 pb-5"
        v-if="provider"
      >
        <div class="col-12 col-lg-7">
          <div class="row my-2" v-if="provider.introduction">
            <div class="col-12 d-block d-lg-none">
              <h1 class="title-details">Descrição</h1>
            </div>
            <div class="col-12 text-justify text-default">
              <span>
                {{ provider.introduction }}
              </span>
            </div>
          </div>
          <div class="row my-25" v-if="provider.experiences">
            <div class="col-12 mb-1">
              <h1 class="title-details">Experiência</h1>
            </div>
            <div class="col">
              <ul class="m-0">
                <li
                  v-for="(exper, iexper) in provider.experiences"
                  :key="'exp-' + iexper"
                >
                  {{ exper.name }}
                </li>
              </ul>
            </div>
          </div>
          <div class="row my-2" v-if="provider.expertises">
            <div class="col-12">
              <h1 class="title-details">Especialidades</h1>
            </div>
            <div class="col">
              <ul class="m-0">
                <li
                  v-for="(_exp, _iexp) in provider.expertises"
                  :key="'esp-' + _iexp"
                >
                  {{ _exp.name }}
                </li>
              </ul>
            </div>
          </div>
          <div class="row my-2" v-if="provider.biography">
            <div class="col-12">
              <h1 class="title-details">Biografia</h1>
            </div>
            <div class="col-12 text-justify text-default">
              <span> {{ provider.biography }} </span>
            </div>
          </div>
          <div class="row my-2">
            <div class="col-12">
              <h1 class="title-details remark-mobile">
                Política de Remarcação
              </h1>
            </div>
            <div class="col-12">
              Remarcações podem ocorrer em até 24 hora(s).
            </div>
          </div>
        </div>
      </section>
    </div>

    <footer--v />
  </div>
</template>

<script>
import HomeHeader from "../components/home-header.vue";
import HomeFooter from "../components/home-footer.vue";
import BoxHours from "../components/box-hours.vue";

import _ecommerce from "@/services/ecommerce-service";
export default {
  components: {
    "header--v": HomeHeader,
    "footer--v": HomeFooter,
    "hours--v": BoxHours,
  },
  data() {
    return {
      optionsUf: this.$utils.getStates(),
      loadinghours: false,
      loading: false,
      provider: null,
      dates: null,
      horasp: null,
      qtdDisplayDates: 0,
      contents: [],
    };
  },
  destroyed() {
    this.$destroy();
    this.setMetadataDefault();
  },
  created() {
    this.getProviderHours(null);
  },
  mounted() {
    this.getProvider();
  },
  methods: {
    getProvider() {
      this.loading = true;
      _ecommerce
        .findByProvider(this.$route.params.link)
        .then((_res) => {
          if (_res.content.state) {
            _res.content.state = this.optionsUf
              .filter((f) => f.value === _res.content.state)[0]
              .label.toUpperCase();
          }
          this.provider = _res.content;
          this.setMetadata();
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    getProviderHours(dt_start) {
      this.loadinghours = true;
      _ecommerce
        .showProviderHours(this.$route.params.link, dt_start)
        .then((_res) => {
          this.contents.push(_res.content);
          this.qtdDisplayDates = _res.content.displayDates;

          _res.content.dates.forEach((_datee) => {
            _datee.date = _datee.date.substr(0, 10);
          });
          this.dates = _res.content.dates;
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loadinghours = false));
    },
    confirmSelected(payload) {
      localStorage.setItem("checkout", JSON.stringify(payload));
      const auth = `${localStorage.getItem("accessToken")}`;
      if (auth && auth !== "null") {
        this.$router.push({
          name: "checkout-details",
        });
      } else {
        this.$router.push({
          path: `/sou-paciente?goto=checkout`,
        });
      }
    },
    nexthours() {
      const _date = this.dates[3].date;

      // já buscou antes
      const _cm = this.contents.filter((f) => f.dates[0].date === _date)[0];
      if (_cm) {
        this.qtdDisplayDates = _cm.displayDates;
        this.dates = _cm.dates;
      } else {
        this.getProviderHours(_date);
      }
    },
    nexthoursMobile() {
      const _date = this.dates[1].date;

      // já buscou antes
      const _cm = this.contents.filter((f) => f.dates[0].date === _date)[0];
      if (_cm) {
        this.qtdDisplayDates = _cm.displayDates;
        this.dates = _cm.dates;
      } else {
        this.getProviderHours(_date);
      }
    },
    previushours() {
      const _date = this.dates[0].date;
      const _cm = this.contents.filter((f) => f.dates[3].date === _date)[0];
      if (_cm) {
        this.qtdDisplayDates = _cm.displayDates;
        this.dates = _cm.dates;
      }
    },
    previushoursMobile() {
      const _date = this.dates[0].date;
      const _cm = this.contents.filter((f) => f.dates[1].date === _date)[0];
      if (_cm) {
        this.qtdDisplayDates = _cm.displayDates;
        this.dates = _cm.dates;
      }
    },

    setMetadata() {
      document.title =
        this.provider.name + " - Psicólogo Online | Clique Terapia";
      let desc =
        "Agende agora uma consulta por video chamada com " +
        this.provider.name +
        ".";
      if (this.provider.expertises && this.provider.expertises.length > 0) {
        desc += " Especialista em ";

        for (let index = 0; index < this.provider.expertises.length; index++) {
          if (index > 0) desc += ", ";
          desc += this.provider.expertises[index].name;
        }
      }
      document.head.querySelector("meta[name=description]").content = desc;
      document.getElementsByName("og:description")[0].content =
        this.provider.introduction;
      document.getElementsByName("og:image:secure_url")[0].content =
        this.provider.image;
      document.getElementsByName("og:image")[0].content = this.provider.image;
      document.getElementsByName("og:url")[0].content = window.location.href;
      document.getElementsByName("og:type")[0].content = "Psicólogo";
      document.getElementById("canonical").href = window.location.href;
    },
    setMetadataDefault() {
      document.title = "Psicólogos online sem sair de casa | Clique Terapia";
      document.getElementsByName("og:image")[0].content =
        process.env.BASE_URL + "logo.png";
      document.getElementsByName("og:image:secure_url")[0].content =
        process.env.BASE_URL + "logo.png";
      document.getElementsByName("og:url")[0].content =
        "https://www.cliqueterapia.com.br";
      document.getElementById("canonical").href =
        "https://www.cliqueterapia.com.br";
      document.head.querySelector("meta[name=description]").content =
        "Encontre um psicólogo online e cuide da sua saúde emocional sem sair de casa. Temos psicólogos de todas as especialidades. Comece agora";
      document.getElementsByName("og:description")[0].content =
        "Encontre um psicólogo online e cuide da sua saúde emocional sem sair de casa. Temos psicólogos de todas as especialidades. Comece agora";
      document.getElementsByName("og:type")[0].content = "website";
    },
  },
};
</script>

<style lang="scss">
.main-view {
  min-height: 100vh;
}

#image-header-details {
  display: flex;
  justify-content: flex-end;
}

.image-profile {
  border-radius: 50%;
  width: 180px;
  height: 180px;
}

.personal {
  p {
    font-size: 30px;
    color: #000;
  }
  strong {
    color: var(--primary);
  }
}

.price {
  margin-top: 5px;
  strong {
    font-size: 16px;
    color: #000;
  }
}

.bagde-expertises {
  padding: 0.6rem;
  font-size: 14px;
  margin-right: 5px;
  margin-bottom: 5px;
}

.title-details {
  font-size: 2rem;
}

.divisor-hour {
  width: 60px;
  border: 1px solid var(--primary);
}

.fuso-required {
  border-radius: 4px;
  color: var(--dark);
}

#box-hours {
  max-width: 600px;
  height: 409px;
}

.box-hour-avail {
  background: #e1e6ec;
  margin-bottom: 10px;
  border-radius: 2px;
  padding: 10px;
}
.box-hour-avail:hover {
  cursor: pointer;
  background: #b8c2cc;
}

.display-hours-details {
  overflow-y: auto;
  overflow-x: hidden;
  height: 220px;
}

#section-profile-details {
  margin-top: -220px;
}

.text-default {
  max-width: 90%;
}

@media screen and (max-width: 991px) {
  .provider-bloco {
    flex-direction: column;
    justify-content: center;
    display: flex;
  }
  .provider-bloco div {
    text-align: center;
  }
  #section-profile-details {
    margin-top: 100px;
  }

  .personal {
    p {
      font-size: 25px;
    }
  }
  .remark-mobile {
    font-size: 25px;
  }
  .text-default {
    max-width: 100%;
  }
}
</style>