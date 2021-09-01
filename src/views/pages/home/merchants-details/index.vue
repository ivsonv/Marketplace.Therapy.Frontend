<template>
  <div class="main-view">
    <!-- <div class="d-flex justify-content-center">
      <header--v />
    </div> -->

    <!-- PROFILE -->
    <section class="container">
      <div class="row">
        <div class="col-12 col-lg-7">
          <div class="row">
            <div class="col-12 col-lg-2 d-flex justify-content-center">
              <img
                class="image-profile ml-lg-5"
                src="https://zenklub.com.br/static/professionals/6111366873ad6d00112f2967/c34617a4343508a5faf1118ccc35d287fff6182c-180x180.png"
                alt="Imagem de perfil Vanessa Tentes"
              />
            </div>
            <div class="col-12 col-lg-10 pt-1">
              <div class="personal ml-lg-4 text-center text-lg-left">
                <p>VANESSA TENTES</p>
                <strong class="text-center">CRP – 6737/01</strong>
                <span class="text-center text-lg-left">
                  | DISTRITO FEDERAL - DF</span
                >
                <div class="price">
                  <strong>R$ 250 / 50 minutos</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-5 mt-5">
          <p class="text-center">Agende aqui sua consulta</p>
        </div>
      </div>
    </section>
    <!-- DETAILS -->
    <section class="mx-2 p-lg-5">
      <div class="col-12 col-lg-7">
        <hr />
        <div class="row my-25">
          <div class="col-12">Temas que trabalho</div>
          <div class="col">Aprendizagem, Transtornos</div>
        </div>
        <div class="row my-2">
          <div class="col-12">Descrição</div>
          <div class="col-12">
            <span class="text-wrap">
              Avaliação Psicológica adulto, adolescente e criança Atendimento
              Psicoterápico da Criança Aconselhamento Parental Atendimento
              Especializado ao Indivíduo Superdotado
            </span>
          </div>
        </div>
        <div class="row">
          <div class="col-12">Biografia</div>
          <div class="col-12 text-justify">
            <span> {{ biograby }} </span>
          </div>
        </div>
        <div class="row my-2">
          <div class="col-12">Política de Remarcação</div>
          <div class="col-12">Remarcações podem ocorrer em até 24 hora(s).</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import HomeHeader from "../components/home-header";
export default {
  components: {
    "header--v": HomeHeader,
  },
  data() {
    return {
      loading: false,
      biograby:
        "Possui graduação em Psicologia pelo Centro Universitário de Brasília (1996), mestrado (2005) e doutorado (2011) em Psicologia pela Universidade de Brasília na área de Desenvolvimento Humano e Saúde. Professora da Secretaria de Estado de Educação do Distrito Federal, desde 1991, atuou como professora de Educação Básica, psicóloga escolar e gestora do sistema educacional. Foi docente e orientadora de mestrado e doutorado no Programa de Pós-graduação em Educação da Universidade Católica de Brasília, no período de 2012 a 2016. Atualmente realiza atividades na Educação Básica, no Atendimento Educacional Especializado para Estudantes com Altas Habilidades/Superdotação. e desenvolve docência e pesquisa na Educação Superior. Aplica-se à pesquisa e estudos nas áreas de criatividade, motivação, processos de ensino aprendizagem e metodologias ativas de aprendizagem, educação especial e inclusiva e transtornos funcionais específicos. Suas áreas de interesse são avaliação e atendimento em altas habilidades/superdotação e Transtorno de Déficit de Atenção e Hiperatividade. Sócia e Responsável Técnica da Clínica Em Si Psicologia, atua na clínica psicológica desde 1996. Dedica-se a palestras, cursos de formação de professores e produção científica na área de Educação e Psicologia. Membro do Conselho Brasileiro para Superdotação ? CONBRASD; Associação Nacional de Pós-Graduação e Pesquisa em Educação ANPED; Associação Brasileira de Pesquisadores em Educação Especial ABPEE; Associação Brasileira de Psicologia Escolar e Educacional ABRAPEE, vinculada ao Conselho Federal de Psicologia e Conselho Regional de Psicologia CRP 01/ DistritoFederal.",
    };
  },
  created() {},
  methods: {},
};
</script>

<style lang="scss">
.main-view {
  min-height: 100vh;
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
</style>