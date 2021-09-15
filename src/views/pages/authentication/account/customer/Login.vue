<template>
  <div class="auth-wrapper auth-v2">
    <div id="bodyCaller"></div>
    <b-row class="auth-inner m-0">
      <!-- Brand logo-->
      <b-link to="/" class="brand-logo d-none d-lg-flex">
        <img :src="logo" />
        <h2 class="brand-text text-primary ml-1">
          CLIQUE TERAPIA
          <br />
          <small class="text-muted">SOU PACIENTE</small>
        </h2>
      </b-link>
      <!-- /Brand logo-->

      <!-- Left Text-->
      <b-col lg="8" class="d-none d-lg-flex align-items-center p-5">
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
            <img :src="logo" class="mb-2" />
            <h2 class="brand-text text-primary ml-1">CLIQUE TERAPIA</h2>
            <small class="text-muted">SOU PACIENTE</small>
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
                  <b-link :to="{ name: 'auth-forgot-password' }">
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
                  variant="warning"
                  size="lg"
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
                  <b-button @click="register" variant="warning" size="lg" pill>
                    QUERO ME CADASTRAR
                  </b-button>
                </div>
              </div>
            </b-form>
          </validation-observer>
        </b-col>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import pt_br from "vee-validate/dist/locale/pt_BR.json";
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
      logo: require("@/assets/images/home/LogoMobile.png"),
      loading: false,
      required,
      email,
    };
  },
  created() {
    localStorage.clear();
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

              this.$router.push({ name: "account-customer-reports" });

              // redirect
              // if (this.$route.params.redirect) {
              //   let redirect_url = this.$route.params.redirect.replace(
              //     /_/g,
              //     "/"
              //   );
              //   this.$router.push({
              //     path: `/${redirect_url}`,
              //   });
              // } else {
              //   this.$router.push({ name: "account-appointments" });
              // }
            })
            .catch((error) =>
              this.$refs.loginForm.setErrors({ password: error })
            )
            .finally(() => (this.loading = false));
        }
      });
    },
    register() {
      this.$router.push({ name: "auth-quero-cadastrar-paciente" });
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-auth.scss";
</style>