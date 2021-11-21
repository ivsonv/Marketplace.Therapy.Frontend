<template>
  <div class="main-view">
    <header--v />

    <b-row class="auth-inner m-0">
      <!-- Left Text-->
      <b-col lg="8" class="d-none d-lg-flex align-items-center">
        <div
          class="w-100 d-lg-flex align-items-center justify-content-center px-5"
        >
          <b-img fluid :src="imgUrl" alt="Login" />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Login-->
      <b-col lg="4" class="d-flex align-items-center auth-bg px-2 p-lg-5">
        <b-col sm="8" md="6" lg="12" class="px-xl-2 mx-auto">
          <div
            class="mb-5"
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
            "
          >
            <img width="100" :src="logo" class="mb-2" />
            <h2 class="brand-text text-primary ml-1">SOU PACIENTE</h2>
          </div>

          <!-- form -->
          <validation-observer ref="loginForm" #default="{ invalid }">
            <b-form class="auth-login-form mt-2">
              <!-- email -->
              <b-form-group label="Login" label-for="login-email">
                <validation-provider
                  #default="{ errors }"
                  name="Login"
                  vid="email"
                  rules="required"
                >
                  <b-form-input
                    id="login-email"
                    v-model="userEmail"
                    :state="errors.length > 0 ? false : null"
                    name="login-email"
                    placeholder="john@example.com"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- forgot password -->
              <b-form-group>
                <div class="d-flex justify-content-between">
                  <label for="login-password">Senha</label>
                  <b-link :to="{ name: 'sou-paciente-esqueci-minha-senha' }">
                    <small>Esqueceu a Senha?</small>
                  </b-link>
                </div>
                <validation-provider
                  #default="{ errors }"
                  name="Password"
                  vid="password"
                  rules="required"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid' : null"
                  >
                    <b-form-input
                      id="login-password"
                      v-model="password"
                      :state="errors.length > 0 ? false : null"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      name="login-password"
                      placeholder="Password"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        class="cursor-pointer"
                        :icon="passwordToggleIcon"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
              <div class="d-flex justify-content-center">
                <b-button
                  type="submit"
                  variant="primary"
                  pill
                  :disabled="invalid"
                  v-if="!loading"
                  @click="login"
                >
                  ACESSAR COMO PACIENTE
                </b-button>
                <spinner--c v-else />
              </div>
              <div
                class="d-flex justify-content-center"
                style="flex-direction: column"
                v-if="!loading"
              >
                <div class="text-center">
                  <div class="divider">
                    <div class="divider-text">OU</div>
                  </div>
                  <b-button @click="register" variant="primary" pill>
                    QUERO ME CADASTRAR
                  </b-button>
                </div>
              </div>
            </b-form>
          </validation-observer>
        </b-col>
      </b-col>
    </b-row>

    <footer--v />
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import pt_br from "vee-validate/dist/locale/pt_BR.json";
import HomeHeader from "../../../home/components/home-header.vue";
import HomeFooter from "../../../home/components/home-footer.vue";
import {
  BLink,
  BFormGroup,
  BFormInput,
  BInputGroupAppend,
  BInputGroup,
  BFormCheckbox,
  BCardText,
  BCardTitle,
  BImg,
  BForm,
  BButton,
  BAlert,
  VBTooltip,
} from "bootstrap-vue";
import useJwt from "@/auth/jwt/useJwt";
import { required, email } from "@validations";
import { togglePasswordVisibility } from "@core/mixins/ui/forms";
import store from "@/store/index";
import _authService from "@/services/auth-service";
import rotas from "@/navigation/vertical/customers";
export default {
  directives: {
    "b-tooltip": VBTooltip,
  },
  components: {
    "header--v": HomeHeader,
    "footer--v": HomeFooter,
    BLink,
    BFormGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
    BFormCheckbox,
    BCardText,
    BCardTitle,
    BImg,
    BForm,
    BButton,
    BAlert,
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      status: "",
      password: "",
      userEmail: "",
      sideImg: require("@/assets/images/pages/login-v2.svg"),
      logo: require("@/assets/images/logo/logo.png"),
      loading: false,
      required,
      email,
    };
  },
  destroyed() {
    this.$destroy();
  },
  created() {
    console.log(this.$route.query);
    if (!this.$route.query.goto) {
      localStorage.clear();
    }
  },
  mounted() {
    localize("pt_BR", pt_br);
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === "dark") {
        this.sideImg = require("@/assets/images/pages/login-v2-dark.svg");
        return this.sideImg;
      }
      return this.sideImg;
    },
  },
  methods: {
    login() {
      this.$refs.loginForm.validate().then((success) => {
        if (success) {
          const payload = {
            login: this.userEmail,
            password: this.password,
          };

          // enviar
          this.loading = true;
          _authService
            .loginCustomer(payload)
            .then((res) => {
              this.loading = false;
              useJwt.setToken(res.content.accessToken);
              useJwt.setRefreshToken(res.content.accessToken);

              // menus do usuário
              res.content.data.navMenus = rotas;

              // dados usuario
              localStorage.setItem(
                "userData",
                JSON.stringify(res.content.data)
              );
              this.$ability.update([{ action: "manage", subject: "all" }]);

              if (this.$route.query.goto) {
                this.$router.push({
                  path: `/${this.$route.query.goto}`,
                });
              } else {
                this.$router.push({ name: "sou-paciente-appointments" });
              }
            })
            .catch((error) =>
              this.$refs.loginForm.setErrors({ password: error })
            )
            .finally(() => (this.loading = false));
        }
      });
    },
    register() {
      if (this.$route.query.goto) {
        this.$router.push({
          path: `sou-paciente-quero-me-cadastrar?goto=${this.$route.query.goto}`,
        });
      } else {
        this.$router.push({ name: "auth-quero-cadastrar-paciente" });
      }
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-auth.scss";
</style>