<template>
  <footer class="container-fluid" style="background: rgba(186, 191, 199, 0.12)">
    <div class="row m-0 p-0">
      <div class="col-12 m-0 p-0">
        <div id="footer-sobre-empresa" class="row">
          <div class="col-6 col-lg-3 d-flex justify-content-center">
            <div>
              <strong class="d-block mb-1">Especialistas</strong>
              <b-link
                style="color: var(--secondary)"
                :to="{ name: 'merchants-view' }"
                class="cursor-pointer"
              >
                <ul class="list-unstyled">
                  <li>Psicólogos</li>
                  <li>Pesquisar</li>
                </ul>
              </b-link>
            </div>
          </div>
          <div class="col-6 col-lg-3 d-flex justify-content-center">
            <div>
              <strong class="d-block mb-1">Precisa de ajuda?</strong>
              <ul class="list-unstyled">
                <li>
                  <b-link
                    style="color: var(--secondary)"
                    :to="{ name: 'need-for-help' }"
                    class="cursor-pointer"
                    >Perguntas frequentes</b-link
                  >
                </li>

                <!-- <li>Politica de privacidade</li>
                <li>Termos de uso</li> -->
              </ul>
            </div>
          </div>
          <div class="col-12 col-lg-3 d-flex justify-content-center">
            <div class="d-none d-lg-block">
              <strong class="d-block mb-1">Suporte</strong>
              <ul class="list-unstyled">
                <li>
                  <a href="mailto:atendimento@cliqueterapia.com.br">
                    atendimento@cliqueterapia.com.br
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-12 col-lg-2 d-flex justify-content-center">
            <div>
              <strong class="d-block mb-1">Siga a gente</strong>
              <a href="https://www.instagram.com/cliqueterapia" target="_blank">
                <feather-icon icon="InstagramIcon" size="35" />
              </a>
              <a href="https://www.instagram.com/cliqueterapia" target="_blank">
                <feather-icon icon="FacebookIcon" size="35" />
              </a>
            </div>
          </div>
        </div>
        <div class="row py-3 justify-content-center">
          <div class="home-footer-danger">
            <strong>Atenção:</strong> Este site não oferece tratamento ou
            aconselhamento imediato para pessoas em crise suicida. <br />Em caso
            de crise, ligue para 188 (CVV) ou acesse o site www.cvv.org.br.
            <br />Em caso de emergência, procure atendimento em um hospital mais
            próximo.<br /><br />
            Clique Terapia - CNPJ: 87.227.227-84
          </div>
          <img
            id="img-logo-mk"
            :src="require('@/assets/images/pages/dialogo.png')"
          />
        </div>
        <div class="row py-1">
          <div class="col-12 text-center">
            <strong>
              Copyright © {{ new Date().getFullYear() }}
              <span class="d-none d-sm-inline-block">
                Todos os direitos reservados</span
              >
            </strong>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { BLink } from "bootstrap-vue";
export default {
  components: {
    BLink,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style>
#footer-sobre-empresa {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

footer {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.home-footer-danger {
  text-align: center;
}
#img-logo-mk {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 400px;
}

@media screen and (max-width: 600px) {
  #img-logo-mk {
    display: none;
  }

  .home-footer-danger {
    text-align: justify;
    max-width: 90%;
  }

  .home-footer-danger strong {
    display: block;
    text-align: center;
    font-size: 30px;
  }
}
</style>