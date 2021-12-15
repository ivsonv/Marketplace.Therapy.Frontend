<template>
  <div>
    <header--v />

    <!-- faq search section -->
    <section id="faq-search-filter">
      <b-card no-body class="faq-search">
        <b-card-body class="text-center">
          <h2 class="text-primary">Vamos responder algumas perguntas</h2>
          <b-card-text class="mb-2">
            ou escolha uma categoria para encontrar rapidamente a ajuda de que
            você precisa
          </b-card-text>

          <!-- form -->
          <b-form class="faq-search-input">
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="SearchIcon" />
              </b-input-group-prepend>
              <b-form-input
                id="searchbar"
                v-model="faqSearchQuery"
                placeholder="Pesquisar faq..."
              />
            </b-input-group>
          </b-form>
          <!-- form -->
        </b-card-body>
      </b-card>
    </section>
    <!--/ faq search section -->

    <!-- frequently asked questions tabs pills -->
    <section id="faq-tabs">
      <b-tabs
        vertical
        content-class="col-12 col-md-8 col-lg-9"
        pills
        nav-wrapper-class="faq-navigation col-md-4 col-lg-3 col-12"
        nav-class="nav-left"
      >
        <!-- payment tab -->
        <b-tab
          v-for="(categoryObj, categoryName, index) in faqData"
          :key="categoryName"
          :active="!index"
        >
          <!-- title -->
          <template #title>
            <feather-icon :icon="categoryObj.icon" size="18" class="mr-1" />
            <span class="font-weight-bold">{{ categoryObj.title }}</span>
          </template>

          <faq-question-answer :options="categoryObj" />
        </b-tab>
        <!--/ payment tab -->

        <!-- sitting lady image -->
        <template #tabs-end>
          <b-img
            fluid
            :src="require('@/assets/images/illustration/faq-illustrations.svg')"
            class="d-none d-md-block mt-auto"
          />
        </template>
        <!--/ sitting lady image -->
      </b-tabs>
    </section>
    <!--/ frequently asked questions tabs pills -->

    <!-- contact us -->
    <section class="faq-contact">
      <b-row class="mt-5 pt-75 text-center">
        <b-col cols="12">
          <h2>Você ainda tem uma pergunta?</h2>
          <b-card-text class="mb-3">
            Se você não conseguir encontrar uma pergunta em nosso FAQ, você pode
            nos contatar. Responderemos em breve!
          </b-card-text>
        </b-col>
        <b-col sm="6">
          <b-card class="shadow-none py-1 faq-contact-card">
            <b-avatar size="42" rounded variant="light-primary" class="mb-2">
              <feather-icon icon="PhoneCallIcon" size="18" />
            </b-avatar>
            <h4>+55 61 9 9869-5451</h4>
            <span class="text-body">Nós estamos sempre felizes em ajudar!</span>
          </b-card>
        </b-col>
        <b-col sm="6">
          <b-card class="shadow-none py-1 faq-contact-card">
            <b-avatar size="42" rounded variant="light-primary" class="mb-2">
              <feather-icon icon="MailIcon" size="18" />
            </b-avatar>
            <h4>
              <a href="mailto:atendimento@cliqueterapia.com.br"
                >atendimento@cliqueterapia.com.br</a
              >
            </h4>
            <span class="text-body"
              >Melhor maneira de obter uma resposta mais rápida!</span
            >
          </b-card>
        </b-col>
      </b-row>
    </section>
    <!--/ contact us -->

    <footer--v />
  </div>
</template>

<script>
import HomeHeader from "../home/components/home-header.vue";
import HomeFooter from "../home/components/home-footer.vue";
import {
  BCard,
  BCardBody,
  BForm,
  BInputGroup,
  BFormInput,
  BCardText,
  BInputGroupPrepend,
  BTabs,
  BTab,
  BImg,
  BRow,
  BCol,
  BAvatar,
} from "bootstrap-vue";
import FaqQuestionAnswer from "./FaqQuestionAnswer.vue";

import _ecommerceService from "@/services/ecommerce-service";
export default {
  components: {
    "footer--v": HomeFooter,
    "header--v": HomeHeader,
    BForm,
    BCard,
    BRow,
    BCol,
    BAvatar,
    BCardBody,
    BInputGroup,
    BFormInput,
    BCardText,
    BInputGroupPrepend,
    BTabs,
    BTab,
    BImg,
    FaqQuestionAnswer,
  },
  data() {
    return {
      faqSearchQuery: "",
      faqData: {},
    };
  },
  created() {
    this.getFaq();
  },
  methods: {
    getFaq() {
      _ecommerceService
        .showFaq()
        .then((_res) => {
          let _content = _res.content.map((m) => {
            return {
              icon: "CheckIcon",
              title: m.title,
              subtitle: m.sub_title,
              qandA: m.question.map((q) => {
                return { ...q };
              }),
            };
          });
          const data = {
            faqData: {
              ..._content,
            },
          };

          this.faqData = data.faqData;
          console.log(this.faqData);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-faq.scss";
</style>
