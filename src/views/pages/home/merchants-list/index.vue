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
                    autocomplete="off"
                  />
                  <b-input-group-append class="d-none d-lg-block rounded">
                    <b-button variant="primary"> Pesquisar </b-button>
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
      <h1 class="text-center" v-if="loading">buscando... <spinner--c /></h1>
      <h1 class="text-center" v-else-if="providers.length <= 0">
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
    </section>

    <!-- profissionais -->
    <!-- <section id="bodyListProfissional" class="container-fluid" v-if="providers">
      <h1 v-if="loading">Carregando... <spinner--c /></h1>
      <h1 v-else-if="providers.length <= 0">Nenhum especialista encontrado</h1>
      <div class="row" id="profissionaislist">
        <div
          class="col-lg-6 mb-1 d-flex justify-content-center"
          v-for="(data, index) in providers"
          :key="'con' + index"
        >
          <div class="itemProfissonal">
            <div class="infoProfissonal">
              <img
                class="fhotoProfissonal"
                :src="data.image"
                style="border-radius: 50%"
              />
              <div>
                <h1 class="text-uppercase">{{ data.name }}</h1>
                <span>CRP – {{ data.crp }} | {{ data.state }} </span>
                <div
                  v-if="data.urlvideo && data.urlvideo.includes('https://')"
                  class="fileStar"
                >
                  <a :href="data.urlvideo" target="_blank">
                     <img
                      style="width: 20px; height: 20px"
                      src="../assets/img/youtube.svg"
                    />
                  </a>
                </div>
                 <div class="fileStar">
                  <svg
                    id="star-regular"
                    class="start"
                    xmlns="http://www.w3.org/2000/svg"
                    width="19.519"
                    height="18.682"
                    viewBox="0 0 19.519 18.682"
                  >
                    <path
                      id="star-regular-2"
                      data-name="star-regular"
                      d="M39.018,6.245l-5.33-.777L31.306.637a1.168,1.168,0,0,0-2.094,0l-2.382,4.83-5.33.777a1.168,1.168,0,0,0-.646,1.992l3.856,3.758L23.8,17.3a1.167,1.167,0,0,0,1.693,1.229l4.768-2.506,4.768,2.506A1.168,1.168,0,0,0,36.72,17.3l-.912-5.308,3.856-3.758a1.168,1.168,0,0,0-.646-1.992Zm-5.089,5.137.865,5.049-4.535-2.382-4.535,2.382.865-5.049-3.67-3.575,5.071-.737,2.269-4.6,2.269,4.6,5.071.737Z"
                      transform="translate(-20.5 0.013)"
                    />
                    <path
                      id="Caminho_108"
                      data-name="Caminho 108"
                      d="M262.43,1383.865l2.75-5.615,3.247,5.615,5.844.764s-3.7,3.552-3.858,3.7.344,6.3.344,6.3l-5.576-2.253-5,2.75.229-6.226-3.972-4.278Z"
                      transform="translate(-255.612 -1377.338)"
                    />
                  </svg>
                  <svg
                    id="star-regular"
                    class="start"
                    xmlns="http://www.w3.org/2000/svg"
                    width="19.519"
                    height="18.682"
                    viewBox="0 0 19.519 18.682"
                  >
                    <path
                      id="star-regular-2"
                      data-name="star-regular"
                      d="M39.018,6.245l-5.33-.777L31.306.637a1.168,1.168,0,0,0-2.094,0l-2.382,4.83-5.33.777a1.168,1.168,0,0,0-.646,1.992l3.856,3.758L23.8,17.3a1.167,1.167,0,0,0,1.693,1.229l4.768-2.506,4.768,2.506A1.168,1.168,0,0,0,36.72,17.3l-.912-5.308,3.856-3.758a1.168,1.168,0,0,0-.646-1.992Zm-5.089,5.137.865,5.049-4.535-2.382-4.535,2.382.865-5.049-3.67-3.575,5.071-.737,2.269-4.6,2.269,4.6,5.071.737Z"
                      transform="translate(-20.5 0.013)"
                    />
                    <path
                      id="Caminho_108"
                      data-name="Caminho 108"
                      d="M262.43,1383.865l2.75-5.615,3.247,5.615,5.844.764s-3.7,3.552-3.858,3.7.344,6.3.344,6.3l-5.576-2.253-5,2.75.229-6.226-3.972-4.278Z"
                      transform="translate(-255.612 -1377.338)"
                    />
                  </svg>
                  <svg
                    id="star-regular"
                    class="start"
                    xmlns="http://www.w3.org/2000/svg"
                    width="19.519"
                    height="18.682"
                    viewBox="0 0 19.519 18.682"
                  >
                    <path
                      id="star-regular-2"
                      data-name="star-regular"
                      d="M39.018,6.245l-5.33-.777L31.306.637a1.168,1.168,0,0,0-2.094,0l-2.382,4.83-5.33.777a1.168,1.168,0,0,0-.646,1.992l3.856,3.758L23.8,17.3a1.167,1.167,0,0,0,1.693,1.229l4.768-2.506,4.768,2.506A1.168,1.168,0,0,0,36.72,17.3l-.912-5.308,3.856-3.758a1.168,1.168,0,0,0-.646-1.992Zm-5.089,5.137.865,5.049-4.535-2.382-4.535,2.382.865-5.049-3.67-3.575,5.071-.737,2.269-4.6,2.269,4.6,5.071.737Z"
                      transform="translate(-20.5 0.013)"
                    />
                    <path
                      id="Caminho_108"
                      data-name="Caminho 108"
                      d="M262.43,1383.865l2.75-5.615,3.247,5.615,5.844.764s-3.7,3.552-3.858,3.7.344,6.3.344,6.3l-5.576-2.253-5,2.75.229-6.226-3.972-4.278Z"
                      transform="translate(-255.612 -1377.338)"
                    />
                  </svg>
                  <svg
                    id="star-regular"
                    class="start"
                    xmlns="http://www.w3.org/2000/svg"
                    width="19.519"
                    height="18.682"
                    viewBox="0 0 19.519 18.682"
                  >
                    <path
                      id="star-regular-2"
                      data-name="star-regular"
                      d="M39.018,6.245l-5.33-.777L31.306.637a1.168,1.168,0,0,0-2.094,0l-2.382,4.83-5.33.777a1.168,1.168,0,0,0-.646,1.992l3.856,3.758L23.8,17.3a1.167,1.167,0,0,0,1.693,1.229l4.768-2.506,4.768,2.506A1.168,1.168,0,0,0,36.72,17.3l-.912-5.308,3.856-3.758a1.168,1.168,0,0,0-.646-1.992Zm-5.089,5.137.865,5.049-4.535-2.382-4.535,2.382.865-5.049-3.67-3.575,5.071-.737,2.269-4.6,2.269,4.6,5.071.737Z"
                      transform="translate(-20.5 0.013)"
                    />
                    <path
                      id="Caminho_108"
                      data-name="Caminho 108"
                      d="M262.43,1383.865l2.75-5.615,3.247,5.615,5.844.764s-3.7,3.552-3.858,3.7.344,6.3.344,6.3l-5.576-2.253-5,2.75.229-6.226-3.972-4.278Z"
                      transform="translate(-255.612 -1377.338)"
                    />
                  </svg>
                  <svg
                    id="star-regular"
                    class="startOff"
                    xmlns="http://www.w3.org/2000/svg"
                    width="19.519"
                    height="18.682"
                    viewBox="0 0 19.519 18.682"
                  >
                    <path
                      id="star-regular-2"
                      data-name="star-regular"
                      d="M39.018,6.245l-5.33-.777L31.306.637a1.168,1.168,0,0,0-2.094,0l-2.382,4.83-5.33.777a1.168,1.168,0,0,0-.646,1.992l3.856,3.758L23.8,17.3a1.167,1.167,0,0,0,1.693,1.229l4.768-2.506,4.768,2.506A1.168,1.168,0,0,0,36.72,17.3l-.912-5.308,3.856-3.758a1.168,1.168,0,0,0-.646-1.992Zm-5.089,5.137.865,5.049-4.535-2.382-4.535,2.382.865-5.049-3.67-3.575,5.071-.737,2.269-4.6,2.269,4.6,5.071.737Z"
                      transform="translate(-20.5 0.013)"
                    />
                    <path
                      id="Caminho_108"
                      data-name="Caminho 108"
                      d="M262.43,1383.865l2.75-5.615,3.247,5.615,5.844.764s-3.7,3.552-3.858,3.7.344,6.3.344,6.3l-5.576-2.253-5,2.75.229-6.226-3.972-4.278Z"
                      transform="translate(-255.612 -1377.338)"
                    />
                  </svg>
                </div>
                <p>
                  {{
                    data.introduction && data.introduction.length > 189
                      ? data.introduction.substring(0, 188) + "..."
                      : data.introduction
                  }}
                </p>
                <a @click="goDetails(data)">Ver perfil completo</a>
              </div>
            </div>
            <div class="detailProfissonal">
              <div>
                <p>Sessão</p>
                <span>R$ {{ data.price.toFixed(0) }}</span>
              </div>
              <div>
                <p>Tempo</p>
                <span>50 minutos</span>
              </div>
            </div>
            <a @click="goDetails(data)">
              <b-button size="lg" variant="primary" class="rounded" pill>
                Marcar consulta
              </b-button>
            </a>
          </div>
        </div>
      </div>
    </section> -->
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
      loading: false,
      page: 0,
      experienceSelected: null,
      experiences: [],
      languageSelected: null,
      languages: [],
      providers: [],
    };
  },
  destroyed() {
    this.$destroy();
  },
  created() {
    localStorage.removeItem("checkout");
  },
  mounted() {
    this.getTopics();
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
      const payload = { data: null };

      _ecommerce
        .showProviders(payload)
        .then((_res) => {
          this.providers = _res.content;
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
    filter() {
      this.page = 0;
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