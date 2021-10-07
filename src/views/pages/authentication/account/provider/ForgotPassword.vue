<template>
  <div class="auth-wrapper auth-v1">
    <b-row class="auth-inner m-0">
      <!-- Login-->
      <b-col cols="12" class="d-flex align-items-center auth-bg px-2 p-5">
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
            <img :src="logo" />
            <h2 class="brand-text text-primary mt-3" v-if="!alterarVisible">
              ESQUECI MINHA SENHA
            </h2>
            <h2 class="brand-text text-primary mt-3" v-if="alterarVisible">
              INFORME SUA NOVA SENHA
            </h2>
            <small class="text-muted">Sou Psicólogo</small>
          </div>

          <!-- form -->
          <validation-observer
            ref="resetForm"
            #default="{ invalid }"
            v-if="formReset"
          >
            <b-form class="auth-login-form mt-2" @submit.prevent="updateReset">
              <!-- email -->
              <b-form-group label="Senha" label-for="login-password">
                <validation-provider
                  #default="{ errors }"
                  name="Senha"
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
                      placeholder="Senha"
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
              <b-form-group
                label="Confirmação Senha"
                label-for="login-password-confirmed"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Confirmação Senha"
                  vid="passwordConfirmed"
                  rules="required"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid' : null"
                  >
                    <b-form-input
                      id="login-password-confirmed"
                      v-model="passwordConfirmed"
                      :state="errors.length > 0 ? false : null"
                      class="form-control-merge"
                      :type="passworConfirmedFieldType"
                      name="login-password-confirmed"
                      placeholder="Confirmação Senha"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        class="cursor-pointer"
                        :icon="passwordConfirmedToggleIcon"
                        @click="togglePasswordConfirmedVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
              <!-- submit buttons -->
              <b-button
                v-if="alterarVisible"
                type="submit"
                variant="primary"
                block
                :disabled="invalid"
              >
                <b-spinner type="grow" v-if="loading" />
                {{ loading ? "" : "ALTERAR" }}
              </b-button>
              <b-card-text class="text-center mt-2">
                <b-link :to="{ name: 'auth-login-psicologo' }">
                  <feather-icon icon="ChevronLeftIcon" /> Retornar ao login
                </b-link>
              </b-card-text>
            </b-form>
          </validation-observer>

          <!-- form -->
          <validation-observer ref="loginForm" #default="{ invalid }" v-else>
            <b-form class="auth-login-form mt-2" @submit.prevent="reset">
              <!-- email -->
              <b-form-group label="E-mail" label-for="login-email">
                <validation-provider
                  #default="{ errors }"
                  name="E-mail"
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
              <!-- submit buttons -->
              <b-button
                type="submit"
                variant="primary"
                block
                :disabled="invalid"
              >
                <b-spinner type="grow" v-if="loading" />
                {{ loading ? "" : "Enviar" }}
              </b-button>
              <b-card-text class="text-center mt-2">
                <b-link :to="{ name: 'auth-login-psicologo' }">
                  <feather-icon icon="ChevronLeftIcon" /> Retornar ao login
                </b-link>
              </b-card-text>
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
import { required, email } from "@validations";
import store from "@/store/index";
import _authService from "@/services/auth-service";
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
  data() {
    return {
      passwordFieldType: "password",
      passworConfirmedFieldType: "password",
      formReset: false,
      token: "",
      password: "",
      passwordConfirmed: "",
      sideImg: require("@/assets/images/pages/login-v2.svg"),
      logo: require("@/assets/images/home/LogoMobile.png"),
      loading: false,
      required,
      email,
      userEmail: "",
      alterarVisible: true,
    };
  },
  created() {
    localize("pt_BR", pt_br);
    this.iniciar();
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
    },
    passwordConfirmedToggleIcon() {
      return this.passworConfirmedFieldType === "password"
        ? "EyeIcon"
        : "EyeOffIcon";
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
    iniciar() {
      if (this.$route.query.token) {
        this.formReset = true;
        this.token = this.$route.query.token;
        this.alterarVisible = true;
      } else {
        this.formReset = false;
        this.token = "";
      }
    },
    togglePasswordVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
    },
    togglePasswordConfirmedVisibility() {
      this.passworConfirmedFieldType =
        this.passworConfirmedFieldType === "password" ? "text" : "password";
    },
    reset() {
      this.$refs.loginForm.validate().then((success) => {
        if (success) {
          const payload = {
            login: this.userEmail,
          };
          this.loading = true;
          _authService
            .resetLoginProvider(payload)
            .then((res) => {
              this.loading = false;
              this.$utils.toast("Notificação", "Verifique seu e-mail.");
            })
            .catch((error) => {
              this.loading = false;
              this.$refs.loginForm.setErrors({
                email: error,
              });
            });
        }
      });
    },
    updateReset() {
      this.$refs.resetForm.validate().then((success) => {
        if (success) {
          if (this.password !== this.passwordConfirmed) {
            this.$refs.resetForm.setErrors({
              passwordConfirmed: "Senha e Confirmação da Senha diferentes",
            });
          } else {
            const payload = { password: this.password, token: this.token };
            this.loading = true;
            _authService
              .updateLoginProvider(payload)
              .then((res) => {
                this.loading = false;
                this.$router.push({ name: "auth-login-psicologo" });
              })
              .catch((error) => {
                this.loading = false;
                this.$refs.resetForm.setErrors({
                  passwordConfirmed: error,
                });
              });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-auth.scss";
</style>