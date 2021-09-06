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
                  >CRP – 6737/01</strong
                >
                <span class="text-center text-lg-left">
                  | DISTRITO FEDERAL - DF</span
                >
                <div class="price">
                  <strong
                    >R$ {{ provider.price.toFixed(0) }} / 50 minutos</strong
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-5">
            <p>Agende aqui sua consulta</p>
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
      loading: false,
      provider: null,
      biograby:
        "Possui graduação em Psicologia pelo Centro Universitário de Brasília (1996), mestrado (2005) e doutorado (2011) em Psicologia pela Universidade de Brasília na área de Desenvolvimento Humano e Saúde. Professora da Secretaria de Estado de Educação do Distrito Federal, desde 1991, atuou como professora de Educação Básica, psicóloga escolar e gestora do sistema educacional. Foi docente e orientadora de mestrado e doutorado no Programa de Pós-graduação em Educação da Universidade Católica de Brasília, no período de 2012 a 2016. Atualmente realiza atividades na Educação Básica, no Atendimento Educacional Especializado para Estudantes com Altas Habilidades/Superdotação. e desenvolve docência e pesquisa na Educação Superior. Aplica-se à pesquisa e estudos nas áreas de criatividade, motivação, processos de ensino aprendizagem e metodologias ativas de aprendizagem, educação especial e inclusiva e transtornos funcionais específicos. Suas áreas de interesse são avaliação e atendimento em altas habilidades/superdotação e Transtorno de Déficit de Atenção e Hiperatividade. Sócia e Responsável Técnica da Clínica Em Si Psicologia, atua na clínica psicológica desde 1996. Dedica-se a palestras, cursos de formação de professores e produção científica na área de Educação e Psicologia. Membro do Conselho Brasileiro para Superdotação ? CONBRASD; Associação Nacional de Pós-Graduação e Pesquisa em Educação ANPED; Associação Brasileira de Pesquisadores em Educação Especial ABPEE; Associação Brasileira de Psicologia Escolar e Educacional ABRAPEE, vinculada ao Conselho Federal de Psicologia e Conselho Regional de Psicologia CRP 01/ DistritoFederal.",
    };
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
          this.provider = _res.content;
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
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