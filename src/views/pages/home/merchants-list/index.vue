<template>
  <div class="main-view">
    <header--v />
    <section class="merchant-list-main">
      <div class="row m-0 p-0">
        <div class="col-12 col-lg-3 m-0 p-0 pt-3 d-none d-lg-block">
          <img
            height="400"
            :src="require('@/assets/images/home/especialista-search.png')"
            title="Nossos especialistas"
          />
        </div>
        <div class="col-12 col-lg-8 d-flex align-items-center">
          <div class="merchant-list-search">
            <h1>Converse com um psicólogo online sem sair de casa.</h1>
            <p>
              A qualquer hora, em qualquer lugar.
              <br />Dados seguros, privacidade total.
            </p>
            <div class="row" id="search_name">
              <div class="col-12 mt-3 mb-3">
                <b-input-group>
                  <b-form-input
                    placeholder="especialidade, motivo ou nome..."
                    v-model="filter.search"
                    autocomplete="off"
                  />
                  <b-input-group-append class="d-none d-lg-block rounded">
                    <b-button variant="primary" @click="search">
                      Pesquisar
                    </b-button>
                  </b-input-group-append>
                  <b-input-group-append class="d-block d-lg-none">
                    <b-button variant="primary">
                      <feather-icon icon="SearchIcon" />
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="merchant-list-filter"></section>

    <section
      class="merchant-list-psi pt-1 container"
      v-if="providers"
      id="main-page"
    >
      <h1 class="text-center text-muted" v-if="loading">
        buscando... <spinner--c />
      </h1>
      <h1 class="text-center my-5" v-else-if="providers.length <= 0">
        Nenhum especialista encontrado
      </h1>

      <!-- psis -->
      <div>
        <div class="row">
          <div
            class="col-12 col-lg-6 mb-1"
            v-for="(data, index) in providers"
            :key="'psi-' + index"
          >
            <div class="profile-psi shadow" @click="goDetails(data)">
              <div class="psi my-3">
                <div class="psi-image">
                  <img :src="data.image" />
                </div>
                <div class="psi-infos">
                  <h1 class="text-uppercase">{{ data.name }}</h1>
                  <span>CRP – {{ data.crp }} </span> | {{ data.state }}
                  <div class="psi-info-price">
                    <p>
                      R$ {{ data.price.toFixed(0) }}
                      <small class="text-muted">| 50 Minutos</small>
                    </p>
                  </div>
                </div>
              </div>
              <p class="pt-2" style="margin: auto">
                {{
                  data.introduction && data.introduction.length > 160
                    ? data.introduction.substring(0, 159) + "..."
                    : data.introduction
                }}
              </p>
              <a class="my-2" style="margin: auto">
                <b-button variant="primary" class="d-flex align-items-center">
                  <feather-icon
                    class="mr-1 cursor-pointer"
                    icon="HeartIcon"
                    size="16"
                  />
                  Quero Conhecer Mais
                </b-button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="row my-2" v-if="isVisibleLoadMore">
        <div class="col-12 d-flex justify-content-center">
          <b-button @click="loadmore" variant="primary" pill size="lg">
            Mostrar mais
          </b-button>
        </div>
      </div>
    </section>

    <footer--v v-if="providers.length > 0" class="shadow" />
  </div>
</template>

<script>
import HomeHeader from "../components/home-header.vue";
import HomeFooter from "../components/home-footer.vue";
import _ecommerce from "@/services/ecommerce-service";
export default {
  components: {
    "header--v": HomeHeader,
    "footer--v": HomeFooter,
  },
  data() {
    return {
      loading: false,
      isVisibleLoadMore: false,
      page: 0,
      experienceSelected: null,
      experiences: [],
      languageSelected: null,
      languages: [],
      providers: [],
      filter: {
        search: "",
      },
    };
  },
  destroyed() {
    this.$destroy();
  },
  created() {
    localStorage.removeItem("checkout");
  },
  mounted() {
    //this.getTopics();
    this.getProviders();
  },
  methods: {
    getTopics() {
      _ecommerce
        .showTopics()
        .then((_res) => {
          this.experiences = _res.content
            .filter((f) => f.active && f.experience)
            .map((m) => {
              return {
                label: m.name,
                value: m.id,
              };
            });
        })
        .catch((error) => this.$utils.toastError("Notificação", error));
    },
    getProviders() {
      this.loading = true;
      let prvs = this.providers.map((m) => m.link);
      const payload = {
        data: {
          name: this.filter.search,
          provs: prvs,
        },
        pagination: {
          page: this.page,
        },
      };
      _ecommerce
        .showProviders(payload)
        .then((_res) => {
          this.isVisibleLoadMore = _res.content.length >= 10;
          this.providers.push(..._res.content);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    goDetails(_dto) {
      this.$router.push({
        name: "merchants-details",
        params: { link: _dto.link },
      });
    },
    search() {
      this.page = 0;
      this.providers = [];
      this.getProviders();
    },
    loadmore() {
      this.page += 1;
      this.getProviders();
    },
  },
};
</script>

<style lang="scss">
.main-view {
  min-height: 100vh;
}
.merchant-list-main {
  background: linear-gradient(
    90deg,
    rgba(0, 237, 214, 1) 0%,
    rgb(192, 255, 244, 1) 100%
  );
}

.merchant-list-search {
  text-align: center;
  h1 {
    font-size: 40px;
    font-weight: 600;
    color: var(--white);
    background: var(--primary);
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 4px;
  }
  p {
    font-size: 28px;
    line-height: 28px;
    color: #000;
    font-weight: 400;
    padding-top: 10px;
    @media screen and (max-width: 770px) {
      font-size: 20px;
      line-height: 20px;
    }
  }
}

.profile-psi {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  p {
    width: 80%;
    margin-top: 12px;
  }
}

.psi {
  display: flex;
  margin: auto;
}
.psi-infos {
  margin-left: 20px;
  min-width: 200px;
  span {
    color: var(--purple);
    font-weight: 700;
  }
}

.psi-info-price {
  font-weight: 700;
  font-size: 16px;
}

.psi-image img {
  border-radius: 50%;
  height: 215px;
  width: 215px;
}

@media screen and (max-width: 600px) {
  .psi {
    flex-direction: column;
  }

  .psi-image {
    text-align: center;
  }

  .psi-infos h1 {
    font-size: 20px;
    margin-top: 10px;
  }

  .merchant-list-search {
    p {
      font-size: 16px;
    }
    h1 {
      font-size: 20px;
    }
  }

  .psi-info {
    margin-left: initial;
  }
}
</style>