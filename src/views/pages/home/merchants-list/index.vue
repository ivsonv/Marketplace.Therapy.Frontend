<template>
  <div class="main-view">
    <header--v />

    <section id="headerListProfissional" style="margin-top: 110px">
      <img
        class="List_imgOne"
        :src="require('@/assets/images/home/List_imgOne.jpg')"
      />
      <img
        class="List_imgTwo"
        :src="require('@/assets/images/home/List_imgTwo.jpg')"
      />
      <div class="menuList">
        <h1>Converse com um psicólogo online sem sair de casa.</h1>
        <p>
          A qualquer hora, em qualquer lugar.
          <br />Dados seguros, privacidade total.
        </p>
        <div class="row" id="search_name">
          <div class="col-12 mt-3">
            <b-input-group>
              <b-form-input
                placeholder="pesquise por especialidade, motivo ou nome..."
                autocomplete="off"
                size="lg"
              />
              <b-input-group-append>
                <b-button variant="success" size="lg"> Pesquisar </b-button>
              </b-input-group-append>
            </b-input-group>
          </div>
        </div>
      </div>
      <img
        class="List_imgThree"
        :src="require('@/assets/images/home/List_imgThree.jpg')"
      />
      <img
        class="List_imgFour"
        :src="require('@/assets/images/home/List_imgFour.jpg')"
      />
    </section>

    <!-- profissionais -->
    <section id="bodyListProfissional" class="container-fluid" v-if="providers">
      <h1 v-if="loading">Carregando... <spinner--c /></h1>
      <h1 v-else-if="providers.length > 0">Nossos Especialistas</h1>
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
                    <!-- <img
                      style="width: 20px; height: 20px"
                      src="../assets/img/youtube.svg"
                    /> -->
                  </a>
                </div>
                <!-- <div class="fileStar">
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
                </div>-->
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
    </section>
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

#headerListProfissional {
  height: 60vh;
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  .menuList {
    z-index: 10;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  @media screen and (max-width: 474px) {
    br {
      display: none;
    }
  }
  h1 {
    font-size: 40px;
    font-weight: 600;
    color: var(--blue);
    background: var(--teal);
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 4px;
    @media screen and (max-width: 767px) {
      margin: 0 20px 10px;
      font-size: 40px;
    }
    @media screen and (max-width: 510px) {
      margin: 50px 20px 10px;
    }
  }
  p {
    font-size: 28px;
    line-height: 28px;
    color: var(--purple);
    font-weight: 400;
    @media screen and (max-width: 770px) {
      font-size: 20px;
      line-height: 20px;
    }
  }
  #search_name {
    width: 95vw;
    @media screen and (min-width: 850px) {
      width: 60vw;
    }
    @media screen and (min-width: 1000px) {
      width: 50vw;
    }
  }

  .boxSearch {
    width: 100%;
    display: flex;
    margin-top: 60px;
    border-radius: 10px;
    position: relative;
    flex-direction: column;
    text-align: initial;
    padding: 20px 20px 50px;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
    -moz-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
    -webkit-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
    @media screen and (max-width: 767px) {
      min-width: 290px;
      width: 90%;
    }
    .divSearch {
      display: flex;
      align-items: center;
      justify-content: center;
      @media screen and (max-width: 767px) {
        width: 100%;
        flex-direction: column;
      }
    }
    button {
      bottom: -29px;
      position: absolute;
    }
  }
  .List_imgOne {
    width: 290px;
    left: -100px;
    margin-top: -120px;
    position: absolute;
    border-radius: 15px;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
    -moz-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
    -webkit-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
    @media screen and (max-width: 1330px) {
      left: -200px;
    }
    @media screen and (max-width: 1100px) {
      left: -230px;
    }
    @media screen and (max-width: 990px) {
      display: none;
    }
  }
  .List_imgTwo {
    width: 290px;
    right: -100px;
    margin-top: -120px;
    position: absolute;
    border-radius: 15px;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
    -moz-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
    -webkit-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
    @media screen and (max-width: 1330px) {
      right: -200px;
    }
    @media screen and (max-width: 1100px) {
      right: -230px;
    }
    @media screen and (max-width: 990px) {
      display: none;
    }
  }
  .List_imgThree {
    left: -100px;
    width: 400px;
    margin-top: 190px;
    position: absolute;
    border-radius: 15px;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
    -moz-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
    -webkit-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
    @media screen and (max-width: 1330px) {
      left: -250px;
    }
    @media screen and (max-width: 1100px) {
      left: -275px;
    }
    @media screen and (max-width: 990px) {
      left: -50px;
      opacity: 0.6;
      width: 270px;
      margin-top: 400px;
    }
    @media screen and (max-width: 510px) {
      margin-top: 450px;
    }
    @media screen and (max-width: 340px) {
      margin-top: 480px;
    }
    @media screen and (max-width: 510px) {
      display: none;
    }
  }
  .List_imgFour {
    width: 400px;
    right: -100px;
    margin-top: 190px;
    position: absolute;
    border-radius: 15px;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
    -moz-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
    -webkit-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
    @media screen and (max-width: 1330px) {
      right: -250px;
    }
    @media screen and (max-width: 1100px) {
      right: -275px;
    }
    @media screen and (max-width: 990px) {
      opacity: 0.6;
      right: -50px;
      width: 270px;
      margin-top: 400px;
    }
    @media screen and (max-width: 510px) {
      display: none;
    }
  }
}
#bodyListProfissional {
  @media screen and (max-width: 990px) {
    margin-top: 260px;
  }
  @media screen and (max-width: 510px) {
    margin-top: 330px;
  }
  @media screen and (max-width: 340px) {
    margin-top: 360px;
  }
  h1 {
    font-size: 54px;
    color: var(--primary);
    text-align: center;
    margin-bottom: 30px;
  }
  .itemProfissonal {
    padding: 50px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    border-radius: 4px;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
    -moz-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
    -webkit-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
    background: #ffffff;
    @media screen and (max-width: 990px) {
      margin-bottom: 30px;
    }
    .infoProfissonal {
      display: flex;
      @media screen and (max-width: 1150px) {
        flex-direction: column;
      }
      .fhotoProfissonal {
        width: auto;
        height: 215px;
        border-radius: 10px 0 0 0;
        margin: -20px 20px 0 -20px;
        @media screen and (max-width: 1150px) {
          width: 100% !important;
          border-radius: 0;
          margin: auto auto 15px;
        }
        @media screen and (max-width: 400px) {
          width: 100%;
          height: 100%;
        }
      }
      h1 {
        margin: 0;
        font-size: 22px;
        color: #142344;
        text-align: left;
        margin-bottom: 3px;
      }
      span {
        font-size: 17px;
        color: var(--blue);
        font-weight: bold;
      }
      .fileStar {
        display: flex;
        margin: 10px 0 15px;
        .start {
          fill: #ffac10;
          margin-right: 3px;
        }
        .startOff {
          fill: grey;
          margin-right: 3px;
        }
      }
      a {
        display: flex;
        cursor: pointer;
        color: #ffac10;
        transition: 0.2s;
        justify-content: flex-end;
        &:hover {
          color: #ffd07a;
          transition: 0.2s;
        }
      }
    }
    .detailProfissonal {
      width: 100%;
      display: flex;
      padding: 15px 0;
      margin: 30px 0;
      justify-content: space-around;
      border-top: 1px solid var(--primary);
      border-bottom: 1px solid var(--primary);
      p {
        font-size: 20px;
        font-family: "Poppins", sans-serif;
      }
      span {
        color: var(--primary);
        font-weight: 800;
      }
    }
  }
}
</style>