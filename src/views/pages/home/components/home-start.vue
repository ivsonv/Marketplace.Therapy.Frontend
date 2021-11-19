<template>
  <div class="container" id="main-page">
    <section class="home-start-psi">
      <div id="home-start-section">
        <h1 class="mb-1">
          Atendimento psicológico a qualquer hora, em qualquer lugar.
        </h1>
        <strong class="mb-1"
          >Agende uma consulta online por meio de qualquer dispositivo no
          conforto da sua casa ou de onde estiver, com total sigilo e
          segurança.</strong
        >
        <b-button
          variant="primary"
          :to="{ name: 'merchants-view' }"
          class="home-start-comece-agora-bt"
          size="lg"
        >
          Comece agora!
        </b-button>
      </div>
      <div id="home-start-section-img">
        <img :src="require('@/assets/images/home/menina-capa.png')" />
      </div>
    </section>
    <section
      class="
        home-start-section-indicate
        d-flex
        justify-content-center
        pr-0 pr-lg-5
      "
    >
      <img width="150" :src="require('@/assets/images/logo/logo.gif')" />
    </section>
    <section class="home-start-como-funciona mb-5">
      <h1 class="text-center mb-5">Agende sua consulta em apenas 3 passos:</h1>

      <!-- PASSO 1 -->
      <div class="box-passo mb-5">
        <div class="passo">
          <h1>
            1 - Escolha o psicólogo que mais se identifica com o seu perfil.
            Nossos profissionais são devidamente cadastrados e certificados.
          </h1>
          <p class="text-justify"></p>
          <img
            id="seta-1"
            :src="require('@/assets/images/home/passo-seta-1.png')"
          />
        </div>
        <div>
          <img
            style="max-width: 500px; width: 100%"
            :src="require('@/assets/images/home/passo-1.png')"
          />
        </div>
      </div>

      <!-- PASSO 2 -->
      <div class="box-passo mb-5 mb-lg-0">
        <div class="order-2 order-md-1">
          <img
            style="max-width: 500px; width: 100%"
            :src="require('@/assets/images/home/passo-2.png')"
          />
        </div>
        <div class="passo order-1 order-md-2">
          <h1>
            2 - Selecione a data e o horário desejado, de acordo com sua
            disponibilidade.
          </h1>
          <p class="text-justify"></p>
          <img
            id="seta-2"
            :src="require('@/assets/images/home/passo-seta-2.png')"
          />
        </div>
      </div>

      <!-- PASSO 3 -->
      <div class="box-passo align-items-center">
        <div class="passo">
          <h1>
            3 - Efetue o pagamento da forma que preferir…. e pronto! Consulta
            confirmada!
          </h1>
          <p class="text-justify"></p>
        </div>
        <div>
          <img
            style="max-width: 500px; width: 100%"
            :src="require('@/assets/images/home/passo-3.png')"
          />
        </div>
      </div>
    </section>
    <section class="home-start-comece-agora pb-5">
      <div class="box-comece-agora">
        <h1 class="mb-2" id="h1-mobile">
          O mais importante para nós é cuidar de você.
        </h1>
        <p id="comece-text" class="text-uppercase">
          <b
            >Cuidar da sua saúde mental pode transformar todo o seu caminho e
            mudar sua vida.</b
          >
        </p>
        <b-button
          class="mb-2"
          :to="{ name: 'merchants-view' }"
          variant="primary"
          size="lg"
        >
          Buscar Psicólogos
        </b-button>
        <p id="comece-text-sub" class="mb-2 text-uppercase">
          <b
            >Cuidar da saúde mental, sempre foi importante, mas agora, devido a
            pandemia, crucial. Relações sofreram mudanças, rotinas foram
            alteradas, sentimentos e emoções impactadas. Busque ajuda!</b
          >
        </p>
      </div>
    </section>
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
};
</script>
<style>
.home-start-psi {
  display: flex;
  min-height: 100vh;
}

#home-start-col-section {
  display: flex;
  align-items: center;
}

#home-start-section {
  display: flex;
  flex-direction: column;
}

#home-start-section h1 {
  color: var(--blue);
  background: var(--teal);
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 4px;
  padding-bottom: 4px;
  font-weight: 600;
  margin-top: 20%;
  min-width: 850px;
  font-size: 30px;
}

#home-start-section strong {
  width: 465px;
  color: var(--purple);
  font-weight: 400;
}

.home-start-section-indicate {
  margin-top: -13%;
  margin-bottom: 5%;
}

.home-start-search {
  background: var(--blue);
  height: 10%;
  width: 10%;
}

.home-start-comece-agora-bt {
  max-width: 200px;
}

#home-start-section-img {
  justify-content: left;
  align-items: initial;
  display: flex;
}

#home-start-section-img img {
  height: 92%;
}

.home-start-como-funciona h1 {
  font-size: 4rem;
  font-weight: 600;
  color: #000;
}

.box-passo {
  justify-content: space-between;
  display: flex;
}

.passo {
  max-width: 50%;
}

.passo h1 {
  font-size: 2rem;
}

.box-comece-agora {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.box-comece-agora h1 {
  color: var(--white);
  background: var(--indigo);
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 3rem;
}

#comece-text {
  max-width: 100%;
  text-align: justify;
}

#comece-text-sub {
  max-width: 60%;
  text-align: justify;
}

.home-start-section-indicate {
  visibility: visible;
}

@media screen and (max-width: 1550px) {
  .home-start-section-indicate {
    margin-top: -20%;
    margin-bottom: 1%;
  }
  #home-start-section-img img {
    height: 79%;
  }
}

@media screen and (max-width: 1383px) {
  #home-start-section-img {
    justify-content: center;
  }
  .home-start-como-funciona h1 {
    font-size: 2rem;
  }

  .home-start-como-funciona {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .home-start-psi {
    flex-direction: column;
  }
  #home-start-section h1 {
    max-width: 550px;
    margin-top: 5vh;
  }
  #comece-text {
    max-width: 100%;
  }
  .box-comece-agora h1 {
    font-size: 2.1rem;
  }
  .home-start-section-indicate {
    content-visibility: hidden;
    margin-top: initial;
    margin-bottom: initial;
    display: none;
  }
}

@media screen and (max-width: 600px) {
  #home-start-section-img img {
    width: 100%;
  }
  .box-comece-agora h1 {
    font-size: 2.2rem;
    text-align: center;
  }
  #home-start-section h1 {
    font-size: 1.8rem;
    text-align: center;
    min-width: initial;
    width: 108%;
    margin-left: -4%;
  }
  #home-start-section strong {
    color: var(--purple);
    text-align: justify;
    font-weight: 500;
    width: initial;
  }
  .home-start-comece-agora-bt {
    max-width: initial;
  }

  .home-start-como-funciona h1 {
    font-size: 1.6rem;
    font-weight: bold;
    color: #000;
  }

  .box-passo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .passo {
    max-width: initial;
    text-align: justify;
  }
  #home-start-section h1 {
    margin-top: 0.1vh;
  }
  #seta-1 {
    display: none;
  }
  #seta-2 {
    display: none;
  }
  .home-start-psi {
    min-height: 0vh;
  }
  .home-start-section-indicate {
    content-visibility: hidden;
    display: none;
  }

  #comece-text-sub {
    max-width: 100%;
  }

  #h1-mobile {
    margin-left: -8%;
    margin-right: -4%;
  }
}
</style>