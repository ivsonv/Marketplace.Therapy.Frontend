<template>
  <div>
    <header--v />

    <div class="auth-wrapper auth-v1 px-1">
      <div class="auth-inner py-2">
        <!-- Register v1 -->
        <b-card>
          <b-card-title class="mb-1 text-center">
            <h1>Um novo jeito de cuidar de voce.</h1>
          </b-card-title>

          <!-- form -->
          <validation-observer ref="registerForm">
            <b-form
              class="auth-register-form mt-2"
              @submit.prevent="validationForm"
            >
              <b-form-group label="Nome Completo" label-for="namecomplete">
                <validation-provider
                  #default="{ errors }"
                  name="Nome Completo"
                  rules="required"
                >
                  <b-form-input
                    id="namecomplete"
                    v-model="record.name"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Digite nome completo..."
                    autocomplete="off"
                    size="lg"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- email -->
              <b-form-group label="Email" label-for="email">
                <validation-provider
                  #default="{ errors }"
                  name="Email"
                  rules="required|email"
                  autocomplete="off"
                >
                  <b-form-input
                    id="email"
                    v-model="record.email"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Digite seu e-mail..."
                    autocomplete="off"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group label="Confirmar E-mail" label-for="emailconfirm">
                <validation-provider
                  #default="{ errors }"
                  name="confirmar-email"
                  rules="required|email"
                >
                  <b-form-input
                    id="confirmar-email"
                    v-model="record.emailconfirm"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Confirme seu e-mail..."
                    onpaste="return false"
                    ondrop="return false"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group label="CPF">
                <b-form-input
                  v-mask="$utils.masked.cpf"
                  v-model="record.cpf"
                  placeholder="cpf..."
                  autocomplete="off"
                />
              </b-form-group>

              <!-- password -->
              <b-form-group label="Password" label-for="password">
                <validation-provider
                  #default="{ errors }"
                  name="Password"
                  rules="required"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid' : null"
                  >
                    <b-form-input
                      id="password"
                      v-model="record.password"
                      :type="passwordFieldType"
                      :state="errors.length > 0 ? false : null"
                      class="form-control-merge"
                      name="register-password"
                      placeholder="············"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        :icon="passwordToggleIcon"
                        class="cursor-pointer"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
              <b-form-group class="d-flex justify-content-center mt-2">
                <b-form-checkbox
                  id="register-privacy-policy"
                  v-model="status"
                  name="checkbox-1"
                >
                  Estou de acordo com os
                  <b-link v-b-modal.modal-xl> Termos e Condições </b-link>
                </b-form-checkbox>

                <b-modal
                  id="modal-xl"
                  ok-only
                  ok-title="OK"
                  centered
                  size="xl"
                  title="Termos e Condições"
                >
                  <b-card-text>
                    <b-embed
                      type="iframe"
                      aspect="16by9"
                      :src="pdfurl"
                      allowfullscreen
                    />
                  </b-card-text>
                </b-modal>
              </b-form-group>
            </b-form>
          </validation-observer>

          <b-card-text class="text-center mt-2">
            <span>Já tem cadastro? </span>
            <b-link @click="goLogin">
              <span>Faça login</span>
            </b-link>
          </b-card-text>
          <div class="text-center">
            <b-button
              size="lg"
              variant="primary"
              pill
              @click="validationForm"
              v-if="!loading"
            >
              Criar Conta
            </b-button>
            <spinner--c v-else />
          </div>
        </b-card>
      </div>
    </div>

    <footer--v />
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import useJwt from "@/auth/jwt/useJwt";

import _authService from "@/services/auth-service";
import _account from "@/services/account-customer-service";
import rotas from "@/navigation/vertical/customers";
import {
  BCard,
  BLink,
  BCardTitle,
  BCardText,
  BForm,
  BButton,
  BFormInput,
  BFormGroup,
  BInputGroup,
  BInputGroupAppend,
  BFormCheckbox,
  BEmbed,
} from "bootstrap-vue";
import { required, email } from "@validations";
import { togglePasswordVisibility } from "@core/mixins/ui/forms";
import HomeHeader from "../../../home/components/home-header.vue";
import HomeFooter from "../../../home/components/home-footer.vue";

export default {
  components: {
    "header--v": HomeHeader,
    "footer--v": HomeFooter,
    BCard,
    BLink,
    BCardTitle,
    BCardText,
    BForm,
    BButton,
    BFormInput,
    BFormGroup,
    BInputGroup,
    BInputGroupAppend,
    BFormCheckbox,
    // validations
    ValidationProvider,
    ValidationObserver,
    BEmbed,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      pdfurl: "https://imagem.cliqueterapia.com.br/terms/paciente.pdf",
      logo: require("@/assets/images/logo/logo.png"),
      record: {
        name: "",
        email: "",
        emailconfirm: "",
        password: "",
        phone: "",
        cpf: "",
      },
      loading: false,
      status: false,
      required,
    };
  },
  destroyed() {
    this.$destroy();
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
    },
  },
  methods: {
    validationForm() {
      this.$refs.registerForm.validate().then((success) => {
        if (success) {
          if (!this.status) {
            this.$utils.toastError(
              "Notificação",
              "Você deve concordar com os termos."
            );
            return;
          }

          if (
            this.record.email.toLowerCase().trim() !==
            this.record.emailconfirm.toLowerCase().trim()
          ) {
            this.$utils.toastError(
              "Notificação",
              "E-mails digitados não são iguais."
            );
            return;
          }
          const payload = {
            password: this.record.password,
            email: this.record.email,
            name: this.record.name,
            cpf: this.record.cpf,
          };

          this.loading = true;
          _account
            .create(payload)
            .then((res) => {
              this.loading = false;
              this.loginPosRegister();
            })
            .catch((error) => {
              this.$utils.toastError("Notificação", error);
            })
            .finally(() => (this.loading = false));
        }
      });
    },
    loginPosRegister() {
      const payload = {
        login: this.record.email,
        password: this.record.password,
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
          localStorage.setItem("userData", JSON.stringify(res.content.data));

          // redirecionar para o cadastro
          this.$ability.update([{ action: "manage", subject: "all" }]);

          if (this.$route.query.goto) {
            this.$router.push({
              path: `/${this.$route.query.goto}`,
            });
          } else {
            this.$router.push({ name: "sou-paciente-appointments" });
          }
        })
        .catch((error) => {
          this.$utils.toastError("Notificação", error);
        })
        .finally(() => (this.loading = false));
    },
    goLogin() {
      if (this.$route.query.goto) {
        this.$router.push({
          path: `/sou-paciente?goto=${this.$route.query.goto}`,
        });
      } else {
        this.$router.push({ name: "auth-login-paciente" });
      }
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-auth.scss";
</style>