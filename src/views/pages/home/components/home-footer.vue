<template>
  <footer class="container-fluid">
    <!--<div id="footer-sobre-empresa" class="row">
       <div class="col-2">
        <strong class="d-block mb-1">Siga a gente</strong>
        <feather-icon icon="InstagramIcon" size="22" />
        <feather-icon icon="FacebookIcon" size="22" />
      </div> -->
    <!-- <div class="col-3">
        <strong class="d-block mb-1">Para você</strong>
        <ul class="list-unstyled">
          <li>Contato</li>
          <li>Trabalhe conosco</li>
          <li>Acompanhar pedido</li>
        </ul>
      </div> -->
    <!-- <div class="col-3">
        <strong class="d-block mb-1">Precisa de ajuda?</strong>
        <ul class="list-unstyled">
          <li>Central de ajuda</li>
          <li>Politica de Entrega</li>
          <li>Privacidade e Segurança</li>
        </ul>
      </div> -->
    <!-- <div class="col-3">
        <strong class="d-block mb-1">Formas de pagamentos</strong>
        <div>
          <img class="mr-1 mb-1" />
          <img class="mr-1 mb-1" />
          <img class="mr-1 mb-1" />
          <img class="mr-1 mb-1" />
          <img class="mr-1 mb-1" />
        </div>
      </div> 
    </div>-->
    <div class="row shadow py-1">
      <div class="col-12 text-center">
        <strong>
          CLIQUE TERAPIA © {{ new Date().getFullYear() }}
          <span class="d-none d-sm-inline-block">
            Todos os direitos reservados</span
          >
        </strong>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped>
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
</style>