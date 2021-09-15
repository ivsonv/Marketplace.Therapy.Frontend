<template>
  <div class="main-view">
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
              </div>
            </div>
          </div>

          <!-- horários -->
          <div id="box-hours" class="col-12 col-lg-5 text-center shadow p-0">
            <h1 class="fuso-required py-1 px-0 m-0" v-if="!loadinghours">
              Agende aqui sua consulta
              <div>
                <h6 class="mt-25">Fuso horário de São Paulo ({{ horasp }})</h6>
                <hr class="divisor-hour" />
              </div>
            </h1>
            <h4 v-if="loadinghours">Buscando horários... <spinner--c /></h4>
            <div class="form-group" v-if="dates">
              <!-- SEMANAS -->
              <div class="row">
                <div class="col-2">
                  <feather-icon icon="ArrowLeftCircleIcon" size="22" />
                </div>
                <div class="col-lg-2">
                  <small class="d-block">{{ dates[0].ds_week }}</small>
                  <strong>{{ dates[0].ds_date }}</strong>
                </div>
                <div class="col-lg-2">
                  <small class="d-block">{{ dates[1].ds_week }}</small>
                  <strong>{{ dates[1].ds_date }}</strong>
                </div>
                <div class="col-lg-2">
                  <small class="d-block">{{ dates[2].ds_week }}</small>
                  <strong>{{ dates[2].ds_date }}</strong>
                </div>
                <div class="col-lg-2">
                  <small class="d-block">{{ dates[3].ds_week }}</small>
                  <strong>{{ dates[3].ds_date }}</strong>
                </div>
                <div class="col-2">
                  <feather-icon icon="ArrowRightCircleIcon" size="22" />
                </div>
              </div>
              <hr />

              <!--HORARIOS -->
              <div class="display-hours-details">
                <div class="row" v-for="(item, i) in qtdDisplayDates" :key="i">
                  <div class="col-2" />
                  <div class="col-lg-2">
                    <div class="box-hour-avail">
                      <strong>{{ gethours(0, i) }}</strong>
                    </div>
                  </div>
                  <div class="col-lg-2">
                    <div class="box-hour-avail">
                      <strong>{{ gethours(1, i) }}</strong>
                    </div>
                  </div>
                  <div class="col-lg-2">
                    <div class="box-hour-avail">
                      <strong>{{ gethours(2, i) }}</strong>
                    </div>
                  </div>
                  <div class="col-lg-2">
                    <div class="box-hour-avail">
                      <strong>{{ gethours(3, i) }}</strong>
                    </div>
                  </div>
                  <div class="col-2" />
                </div>
              </div>
            </div>
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
        class="mx-2 px-lg-5"
        v-if="provider"
      >
        <div class="col-12 col-lg-7">
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
            <div class="col-12 text-justify text-default">
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
            <div class="col-12 text-justify text-default">
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
      dates: null,
      horasp: null,
      grouphours: [],
      qtdDisplayDates: 0,
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
          this.qtdDisplayDates = _res.content.displayDates;
          this.dates = _res.content.dates;
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loadinghours = false));
    },
    getfuso() {
      setInterval(() => {
        this.horasp = this.$utils.getFusoHorarioSP();
      }, 1000);
    },
    gethours(_position, _index) {
      if (this.dates[_position].hours.length > _index) {
        return this.dates[_position].hours[_index].hour.substring(0, 5);
      }
      return "-";
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
    margin-top: 220px;
  }
}
</style>