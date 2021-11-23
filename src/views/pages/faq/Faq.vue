<template>
  <div>
    <header--v />

    <!-- faq search section -->
    <section id="faq-search-filter">
      <b-card no-body class="faq-search">
        <b-card-body class="text-center">
          <h2 class="text-primary">Vamos responder algumas perguntass</h2>
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
  watch: {
    faqSearchQuery: {
      immediate: true,
      handler() {
        this.fetchData();
      },
    },
  },
  methods: {
    fetchData() {
      /* eslint-disable global-require */
      const data = {
        faqData: {
          // payment
          payment: {
            icon: "CreditCardIcon",
            title: "Pagamento",
            subtitle: "Formas de Pagamento",
            qandA: [
              {
                question: "Qual o valor de uma sessão?",
                ans: "Cada Psicólogo estabelece o seu valor de sessão e você pode encontrar consultas de 50 minutos a partir de R$60. Lembrando que é possível usar os recibos das sessões para solicitar reembolso diretamente com seu convênio. Para ter acesso ao documento, basta acessar a aba 'minhas sessões' e clicar em 'gerar recibo' na respectiva consulta.",
              },
              {
                question: "Quais são as formas de pagamento?",
                ans: "Cartão de crédito (todas as bandeiras Visa e Mastercard);",
              },
              {
                question:
                  "O que eu faço se o meu cartão de crédito for rejeitado?",
                ans: "Se o seu cartão de crédito for rejeitado, primeiramente verifique se está tudo certo com o cartão e se os dados foram inseridos corretamente. Caso você tenha outro cartão de crédito, sugerimos que você tente utilizá-lo. ",
              },
              {
                question:
                  "As informações do meu cartão de crédito estão seguras na plataforma?",
                ans: "Sim, todas informações deixadas na plataforma são criptografadas de ponta a ponta. Não existe acesso por parte da plataforma aos dados de pagamentos ",
              },
            ],
          },
          // delivery
          delivery: {
            icon: "ShoppingBagIcon",
            title: "A Clique Terapia é seguro?",
            subtitle: "",
            qandA: [
              {
                question:
                  "O Clique Terapia é seguro? Vocês garantem minha privacidade?",
                ans: "As sessões da Clique Terapia não são gravadas e são sigilosas. As informações do site são protegidas por criptografia ponta a ponta - ou seja, seus dados e o que for conversado em sessão ficarão entre você e seu Psicólogo, não se preocupe. ",
              },
            ],
          },
          // cancellation and return
          cancellationReturn: {
            icon: "RefreshCwIcon",
            title: "Cancelamento e estorno",
            subtitle: "",
            qandA: [
              {
                question: "Quero solicitar um estorno. Como funciona?",
                ans: "Pedidos de estorno devem ser encaminhados para nosso time de suporte pelo e-mail atendimento@cliqueterapia.com.br ou pelo nosso chat.",
              },
            ],
          },
          // my orders
          myOrders: {
            icon: "PackageIcon",
            title: "Minha sessões",
            subtitle: "Which license do I need?",
            qandA: [
              {
                question: "Can I avail of an open delivery?",
                ans: "Pastry pudding cookie toffee bonbon jujubes jujubes powder topping. Jelly beans gummi bears sweet roll bonbon muffin liquorice. Wafer lollipop sesame snaps. Brownie macaroon cookie muffin cupcake candy caramels tiramisu. Oat cake chocolate cake sweet jelly-o brownie biscuit marzipan. Jujubes donut marzipan chocolate bar. Jujubes sugar plum jelly beans tiramisu icing cheesecake.",
              },
              {
                question:
                  "I haven’t received the refund of my returned shipment. What do I do?",
                ans: "Sweet pie candy jelly. Sesame snaps biscuit sugar plum. Sweet roll topping fruitcake. Caramels liquorice biscuit ice cream fruitcake cotton candy tart. Donut caramels gingerbread jelly-o gingerbread pudding. Gummi bears pastry marshmallow candy canes pie. Pie apple pie carrot cake.",
              },
              {
                question:
                  "How can I ship my order to an international location?",
                ans: "Tart gummies dragée lollipop fruitcake pastry oat cake. Cookie jelly jelly macaroon icing jelly beans soufflé cake sweet. Macaroon sesame snaps cheesecake tart cake sugar plum. Dessert jelly-o sweet muffin chocolate candy pie tootsie roll marzipan.",
              },
              {
                question:
                  "I missed the delivery of my order today. What should I do?",
                ans: "Cheesecake muffin cupcake dragée lemon drops tiramisu cake gummies chocolate cake. Marshmallow tart croissant. Tart dessert tiramisu marzipan lollipop lemon drops. Cake bonbon bonbon gummi bears topping jelly beans brownie jujubes muffin. Donut croissant jelly-o cake marzipan. Liquorice marzipan cookie wafer tootsie roll. Tootsie roll sweet cupcake.",
              },
              {
                question:
                  "The delivery of my order is delayed. What should I do?",
                ans: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
              },
            ],
          },
          // product and services
          productServices: {
            icon: "SettingsIcon",
            title: "Como escolher um psicólogo?",
            subtitle: "Which license do I need?",
            qandA: [
              {
                question:
                  "How can I register a complaint against the courier executive who came to deliver my order?",
                ans: "Pastry pudding cookie toffee bonbon jujubes jujubes powder topping. Jelly beans gummi bears sweet roll bonbon muffin liquorice. Wafer lollipop sesame snaps. Brownie macaroon cookie muffin cupcake candy caramels tiramisu. Oat cake chocolate cake sweet jelly-o brownie biscuit marzipan. Jujubes donut marzipan chocolate bar. Jujubes sugar plum jelly beans tiramisu icing cheesecake.",
              },
              {
                question:
                  "The status for my shipment shows as ‘not picked up’. What do I do?",
                ans: "Sweet pie candy jelly. Sesame snaps biscuit sugar plum. Sweet roll topping fruitcake. Caramels liquorice biscuit ice cream fruitcake cotton candy tart. Donut caramels gingerbread jelly-o gingerbread pudding. Gummi bears pastry marshmallow candy canes pie. Pie apple pie carrot cake.",
              },
              {
                question: "How can I get a proof of delivery for my shipment?",
                ans: "Tart gummies dragée lollipop fruitcake pastry oat cake. Cookie jelly jelly macaroon icing jelly beans soufflé cake sweet. Macaroon sesame snaps cheesecake tart cake sugar plum. Dessert jelly-o sweet muffin chocolate candy pie tootsie roll marzipan.",
              },
              {
                question: "How can I avail your services?",
                ans: "Cheesecake muffin cupcake dragée lemon drops tiramisu cake gummies chocolate cake. Marshmallow tart croissant. Tart dessert tiramisu marzipan lollipop lemon drops. Cake bonbon bonbon gummi bears topping jelly beans brownie jujubes muffin. Donut croissant jelly-o cake marzipan. Liquorice marzipan cookie wafer tootsie roll. Tootsie roll sweet cupcake.",
              },
            ],
          },
        },
      };
      this.faqData = data.faqData;

      // mock.onGet("/faq/data").reply((config) => {
      //   const { q = "" } = config.params;
      //   const queryLowered = q.toLowerCase();

      //   const filteredData = {};

      //   Object.entries(data.faqData).forEach((entry) => {
      //     const [categoryName, categoryObj] = entry;
      //     // eslint-disable-next-line arrow-body-style
      //     const filteredQAndAOfCategory = categoryObj.qandA.filter(
      //       (qAndAObj) => {
      //         return qAndAObj.question.toLowerCase().includes(queryLowered);
      //       }
      //     );
      //     if (filteredQAndAOfCategory.length) {
      //       filteredData[categoryName] = {
      //         ...categoryObj,
      //         qandA: filteredQAndAOfCategory,
      //       };
      //     }
      //   });

      //   return [200, filteredData];
      // });

      // this.$http
      //   .get("/faq/data", { params: { q: this.faqSearchQuery } })
      //   .then((res) => {
      //     this.faqData = res.data;
      //   });
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-faq.scss";
</style>
