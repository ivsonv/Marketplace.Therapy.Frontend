<template>
  <div class="main-view">
    <h1 v-if="loading">Buscando... <spinner--c /></h1>

    <div v-if="!loading">
      <!-- PROFILE -->
      <section class="mx-2 px-lg-5 pt-3 pb-0" v-if="provider">
        <div class="row">
          <div class="col-12 col-lg-7">
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
              </div>
            </div>
          </div>
          <div id="box-hours" class="col-12 col-lg-5 text-center shadow p-0">
            <h1 class="fuso-required py-1 px-0 m-0" v-if="!loadinghours">
              Agende aqui sua consulta
              <div>
                <small>Fuso horário de São Paulo ({{ horasp }})</small>
                <hr class="divisor-hour" />
              </div>
            </h1>
            <h4 v-if="loadinghours">Buscando horários... <spinner--c /></h4>
            <div class="form-group" v-if="hours"></div>
          </div>
        </div>
      </section>

      <!-- DETAILS -->
      <section class="mx-2 px-lg-5" v-if="provider">
        <div class="col-12 col-lg-7">
          <hr />
          <div class="row my-25" v-if="provider.experiences">
            <div class="col-12 mb-1">
              <span class="title-details">Temas que trabalho</span>
            </div>
            <div class="col">
              <b-badge
                v-for="(exper, iexper) in provider.experiences"
                variant="warning"
                :key="iexper"
                class="bagde-expertises"
                pill
              >
                {{ exper.name }}
              </b-badge>
            </div>
          </div>
          <div class="row my-2" v-if="provider.introduction">
            <div class="col-12">
              <span class="title-details">Descrição</span>
            </div>
            <div class="col-12 text-justify">
              <span>
                {{ provider.introduction }}
              </span>
            </div>
          </div>
          <div class="row my-2" v-if="provider.expertises">
            <div class="col-12">
              <span class="title-details">Especialidades</span>
            </div>
            <div class="col">
              <b-badge
                v-for="(_exp, _iexp) in provider.expertises"
                class="bagde-expertises"
                variant="warning"
                :key="_iexp"
                pill
              >
                {{ _exp.name }}
              </b-badge>
            </div>
          </div>
          <div class="row my-2" v-if="provider.biography">
            <div class="col-12">
              <span class="title-details">Biografia</span>
            </div>
            <div class="col-12 text-justify">
              <span> {{ provider.biography }} </span>
            </div>
          </div>
          <div class="row my-2">
            <div class="col-12">
              <span class="title-details">Política de Remarcação</span>
            </div>
            <div class="col-12">
              Remarcações podem ocorrer em até 24 hora(s).
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import HomeHeader from "../components/home-header";
import _ecommerce from "@/services/ecommerce-service";
export default {
  components: {
    "header--v": HomeHeader,
  },
  data() {
    return {
      optionsUf: this.$utils.getStates(),
      loadinghours: false,
      loading: false,
      provider: null,
      hours: null,
      horasp: null,
    };
  },
  created() {
    this.getProviderHours();
    this.getfuso();
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
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    getProviderHours() {
      this.loadinghours = true;
      _ecommerce
        .showProviderHours(this.$route.params.link)
        .then((_res) => {
          this.hours = _res.content;
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loadinghours = false));
    },
    getfuso() {
      setInterval(() => {
        this.horasp = this.$utils.getFusoHorarioSP();
      }, 1000);
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
    color: var(--success);
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
  width: 30px;
  border: 1px solid var(--success);
}

.fuso-required {
  border-radius: 4px;
  // background: var(--dark);
  color: var(--dark);
}

#box-hours {
  max-width: 600px;
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
}
</style>