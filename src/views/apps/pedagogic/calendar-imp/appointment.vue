<template>
  <b-overlay :show="isloading" spinner-variant="primary" spinner-type="grow">
    <b-form class="px-1" v-if="appointment">
      <b-modal
        id="modal-cancelar"
        cancel-variant="outline-secondary"
        ok-title="Cancelar"
        cancel-title="Fechar"
        centered
        title="Cancelar 3 horas antes?"
        @ok="confirmSetcancel"
      >
        <b-form>
          <b-form-group label="Motivo *">
            <v-select
              v-model="reasonSelected"
              :options="reason"
              autocomplete="off"
              :clearable="false"
            />
          </b-form-group>
          <b-form-group label="Descrição (Opcional)">
            <b-form-textarea
              rows="7"
              v-model="reason_desc"
              placeholder="Informe uma breve descrição (opcional)"
            />
          </b-form-group>
        </b-form>
      </b-modal>

      <b-tabs fill>
        <b-tab active title="Dados Básicos">
          <b-row>
            <b-col md="6">
              <b-form-group label="Início" class="font-weight-bolder">
                <span class="font-weight-light">
                  {{ appointment.start }}
                </span>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Fim" class="font-weight-bolder">
                <span class="font-weight-light">
                  {{ appointment.end }}
                </span>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                :label="appointment.ds_type"
                class="font-weight-bolder"
              >
                <span class="font-weight-light">
                  <a
                    :href="
                      appointment.ds_type === 'Aula'
                        ? `/pedagogic/project-view/${appointment.project_id}/course/${appointment.course_id}`
                        : `/pedagogic/project-view/${appointment.project_id}/event/${appointment.event_id}`
                    "
                    target="_blank"
                    v-if="!isOnlyRead"
                    style="text-decoration: revert !important"
                  >
                    {{ appointment.name }}
                  </a>
                  <span v-else>
                    {{ appointment.name }}
                  </span>
                </span>
              </b-form-group>
            </b-col>
            <b-col
              cols="12"
              :md="
                appointment.project_name &&
                appointment.project_name.length <= 30
                  ? '6'
                  : '12'
              "
            >
              <b-form-group label="Projeto" class="font-weight-bolder">
                <span class="font-weight-light">
                  <a
                    :href="`/pedagogic/project-view/${appointment.project_id}`"
                    style="text-decoration: revert !important"
                    target="_blank"
                    v-if="!isOnlyRead"
                  >
                    {{ appointment.project_name }}
                  </a>
                  <span v-else>
                    {{ appointment.project_name }}
                  </span>
                </span>
              </b-form-group>
            </b-col>
            <b-col
              cols="12"
              :md="
                appointment.project_name &&
                appointment.project_name.length <= 30
                  ? '6'
                  : '12'
              "
            >
              <b-form-group label="Empresa" class="font-weight-bolder">
                <span class="font-weight-light">
                  {{ appointment.company_name }}
                </span>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Participantes"
                class="font-weight-bolder"
                v-if="participants"
              >
                <b-badge
                  v-for="(par, index) in participants"
                  :key="index"
                  class="mr-25"
                >
                  {{ par }}
                </b-badge>
                <p v-if="value">Value: {{ value }}</p>
              </b-form-group>
            </b-col>
            <b-col cols="6" v-if="appointment.ds_transmission === 'YouTube'">
              <b-form-group
                label="Transmissão Ao Vivo"
                class="font-weight-bolder"
              >
                <span class="font-weight-light">
                  <v-select
                    v-model="aovivo"
                    :options="aovivoOptions"
                    autocomplete="off"
                    :clearable="false"
                    :disabled="isEditTransmission"
                    @input="changeTarget"
                  />
                </span>
              </b-form-group>
            </b-col>
            <b-col cols="6">
              <b-form-group
                label="Tipo de transmissão"
                class="font-weight-bolder"
              >
                <span class="font-weight-light">
                  {{ appointment.ds_transmission }}
                </span>
              </b-form-group>
            </b-col>
            <b-col
              cols="12"
              class="mb-1"
              v-if="appointment.canceled_out_of_time"
            >
              <b-button variant="danger" class="btn-icon" size="sm">
                Cancelado - Jira (CRIADO)
              </b-button>
            </b-col>
            <b-col
              cols="12"
              v-if="
                appointment.can_out_of_time && !appointment.canceled_out_of_time
              "
            >
              <b-form-group
                label="Cancelar 3 horas antes ?"
                class="font-weight-bolder"
              >
                <small
                  >Agendamento já se encontra registrado no JIRA, mas pode
                  colocar o agendamento como cancelado.</small
                >
                <br />
                <b-button
                  variant="info"
                  class="btn-icon my-1"
                  v-b-modal.modal-cancelar
                >
                  Registrar como cancelado ?
                </b-button>
              </b-form-group>
            </b-col>
            <b-col cols="10">
              <b-input-group>
                <b-form-input
                  placeholder="nome"
                  autocomplete="off"
                  v-model="appointment.app_name"
                />
                <b-input-group-append>
                  <b-button
                    variant="gradient-info btn-icon"
                    @click="confirmSetpartial"
                  >
                    <feather-icon icon="SaveIcon" />
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-col>
            <b-col cols="10" class="mt-2">
              <b-input-group>
                <b-form-textarea
                  rows="7"
                  v-model="appointment.app_description"
                  placeholder="Informe uma breve descrição (opcional)"
                />
                <!-- <b-form-input
                  placeholder="Descrição"
                  autocomplete="off"
                  v-model="appointment.app_description"
                /> -->
                <b-input-group-append>
                  <b-button
                    variant="gradient-info btn-icon"
                    @click="confirmSetpartial"
                  >
                    <feather-icon icon="SaveIcon" />
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Estúdio">
          <b-row>
            <b-col
              cols="12"
              v-if="
                appointment.main_studios && appointment.main_studios.length > 0
              "
            >
              <b-form-group label="Estúdio" class="font-weight-bolder">
                <b-row
                  v-for="(item, index) in appointment.main_studios"
                  :key="index"
                  class="d-flex align-items-center"
                >
                  <b-col cols="12">
                    <span class="font-weight-light"> {{ item.name }}</span>
                    <b-badge
                      class="ml-1"
                      variant="info"
                      v-if="appointment.is_home_office"
                    >
                      Home office
                    </b-badge>
                  </b-col>
                  <b-col
                    cols="12"
                    v-if="item.operators && item.operators.length > 0"
                  >
                    <b-form-group label="Operador 1" class="mt-1">
                      {{ item.operators[0].name }}
                    </b-form-group>
                  </b-col>
                  <b-col
                    cols="12"
                    v-if="item.operatorsbkp && item.operatorsbkp.length > 0"
                  >
                    <b-form-group label="Operador BKP" class="mt-1">
                      {{ item.operatorsbkp[0].name }}
                    </b-form-group>
                  </b-col>
                  <b-col cols="12">
                    <b-form-group
                      label="Operador"
                      class="mt-1"
                      v-if="
                        item.operatorsAvailable &&
                        item.operatorsAvailable.length > 0
                      "
                    >
                      <v-select
                        :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                        v-model="item.operatorSelected"
                        :options="getOperatorOptions(item.operatorsAvailable)"
                        autocomplete="off"
                        :clearable="false"
                        @input="(res) => onChangeOperator(res, item)"
                        :loading="loadingop"
                      />
                    </b-form-group>
                  </b-col>

                  <!--Operator Backup -->
                  <b-col cols="12">
                    <b-form-group
                      label="Operador Backup"
                      v-if="
                        item.operatorsBkpAvailable &&
                        item.operatorsBkpAvailable.length > 0
                      "
                    >
                      <v-select
                        :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                        v-model="item.operatorBackupSelected"
                        :options="
                          getOperatorOptions(item.operatorsBkpAvailable)
                        "
                        autocomplete="off"
                        :clearable="false"
                        :loading="loadingopbk"
                        @input="(res) => saveOperatorBackup(res, item)"
                      />
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-form-group>
            </b-col>
            <b-col
              cols="12"
              v-if="
                appointment.support_studios &&
                appointment.support_studios.length > 0
              "
            >
              <b-form-group label="Estúdio de Apoio" class="font-weight-bolder">
                <span
                  class="font-weight-light"
                  v-for="(item, index) in appointment.support_studios"
                  :key="index"
                >
                  {{ item.name }}
                  <br />
                </span>
              </b-form-group>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Youtube">
          <b-row>
            <b-col cols="12">
              <p>Link para Youtube</p>
              <b-button
                v-if="isWriteYoutube"
                variant="primary"
                class="btn-icon mb-1"
                size="sm"
                @click="addLink()"
              >
                <feather-icon icon="PlusIcon" />
              </b-button>
              <b-button
                :disabled="isDisableSaveYoutube"
                v-if="isWriteYoutube"
                @click="saveYoutube"
                class="mb-1 ml-1"
                variant="info"
                size="sm"
              >
                <span class="ml-25">Salvar</span>
              </b-button>
              <b-row v-for="(ll, index) in links" :key="index" class="mb-1">
                <b-col cols="6" v-if="isWriteYoutube">
                  <b-form-input
                    placeholder="Youtube URL"
                    autocomplete="off"
                    v-model="ll.url"
                    @keyup="inputurl(ll.url, index)"
                  />
                </b-col>
                <b-col cols="6" v-if="!isWriteYoutube">
                  <b-form-group v-if="ll.url" class="font-weight-bolder">
                    <a
                      class="font-weight-light"
                      style="text-decoration: revert !important"
                      :href="ll.url"
                      target="_blank"
                    >
                      {{ ll.url }}
                    </a>
                  </b-form-group>
                </b-col>
                <b-col cols="5">
                  <v-select
                    v-if="companies.length > 0"
                    v-model="ll.companieSelected"
                    :options="companies"
                    autocomplete="off"
                    :clearable="false"
                    :disabled="!isWriteYoutube || index === 0"
                  />
                </b-col>
                <b-col cols="1" v-if="index > 0">
                  <b-button
                    v-if="isWriteYoutube"
                    variant="danger"
                    class="btn-icon"
                    @click="removeLink(ll)"
                    style="float: right"
                  >
                    <feather-icon icon="Trash2Icon" />
                  </b-button>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab>
          <template #title>
            <span class="mr-1">Avisos</span>
            <feather-icon
              v-if="
                chatData &&
                chatData.chat &&
                chatData.chat.chat &&
                chatData.chat.chat.length > 0
              "
              icon="BellIcon"
              color="var(--secondary)"
              size="20"
            />
          </template>
          <b-row>
            <b-col cols="12">
              <b-card class="chat-widget" no-body>
                <b-card-header>
                  <div class="d-flex align-items-center">
                    <h5 class="mb-0">Mensagens</h5>
                  </div>
                </b-card-header>
                <section class="chat-app-window">
                  <!-- User Chat Area -->
                  <vue-perfect-scrollbar
                    ref="refChatLogPS"
                    :settings="perfectScrollbarSettings"
                    class="user-chats scroll-area"
                    style="min-height: 60%"
                  >
                    <chat-log :chat-data="chatData" />
                  </vue-perfect-scrollbar>
                </section>
              </b-card>
            </b-col>
          </b-row>
          <b-row class="fixed-bottom m-25">
            <b-col cols="12" class="p-0 m-0">
              <div class="example">
                <table>
                  <tr>
                    <td>
                      <quill-editor
                        class="editor"
                        :options="editorOption"
                        v-model="chatInputMessage"
                      >
                      </quill-editor>
                    </td>
                    <td style="width: 10px">
                      <b-button
                        variant="primary"
                        class="btn-icon"
                        style="height: 20vh"
                        @click="sendMessage"
                      >
                        <feather-icon icon="SendIcon" size="25" />
                      </b-button>
                    </td>
                  </tr>
                </table>
              </div>
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
    </b-form>
  </b-overlay>
</template>

<script>
import _appointmentService from "@/services/appointment-service";
import _companyService from "@/services/company-service";
import _reasonService from "@/services/reason-service";

import {
  BFormTags,
  BCard,
  BCardHeader,
  BAvatar,
  BForm,
  BFormInput,
  BInputGroup,
  BButton,
} from "bootstrap-vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import ChatLog from "@/views/apps/chat/ChatLog.vue";

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  components: {
    BFormTags,
    BCard,
    BCardHeader,
    BAvatar,
    BForm,
    BFormInput,
    BInputGroup,
    BButton,

    // SFC
    ChatLog,

    // 3rd party
    VuePerfectScrollbar,
  },
  data() {
    return {
      isloading: false,
      loadingop: false,
      loadingopbk: false,
      appointment: null,
      isOnlyRead: false,
      isWriteYoutube: false,
      isEditTransmission: false,
      isDisableSaveYoutube: true,
      iswarningsaveYoutube: false,
      youtube_url: "",
      participants: [""],
      aovivoOptions: null,
      aovivo: null,
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ font: [] }],
            [{ color: [] }],
          ],
        },
      },
      value: null,
      links: [],
      companies: [],
      companieSelected: null,
      perfectScrollbarSettings: {
        maxScrollbarLength: 150,
        wheelPropagation: false,
      },
      chatInputMessage: "",
      chatData: {
        chat: {
          id: 0,
          chat: [],
        },
        contact: {
          id: 0,
        },
      },
      reason: [],
      reasonSelected: null,
      reason_desc: "",
    };
  },
  created() {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.roles) {
      this.isEditTransmission = !userData.roles.some(
        (s) => s === "permission.appointment.edit"
      );
      // if (userData.roles.length === 1) {
      //   this.isOnlyRead = userData.roles.some((s) => s === "calendar");
      // } else this.isOnlyRead = false;

      this.isWriteYoutube = userData.roles.some(
        (s) => s === "backyoutube" || s === "admin"
      );
    }
    this.getCompanies();
    this.getReason();
  },
  mounted() {
    this.getRecord();
    this.initChat();
    this.activeTabMensagem();
  },
  methods: {
    getReason() {
      _reasonService
        .show()
        .then((res) => {
          this.reason = this.$utils.populardropdown(
            res.content,
            "name",
            "id",
            false,
            false
          );
        })
        .catch((error) => this.$utils.toastError("Notificação", error));
    },
    inputurl(_txt, _index) {
      if (this.links.length <= 1) {
        this.isDisableSaveYoutube = true;
      }
      if (_index <= 0 && _txt) {
        this.isDisableSaveYoutube = false;
        this.alertSaveYoutube();
      }
    },
    getCompanies() {
      _companyService
        .showAll()
        .then((res) => {
          this.companies = this.$utils.populardropdown(
            res.content,
            "name",
            "id",
            false,
            false
          );
        })
        .catch((error) => this.$utils.toastError("Notificação", error));
    },
    confirmSetcancel() {
      if (!this.reasonSelected) {
        this.$utils.toastError("OPS!!!", "informe o motivo");
        return;
      }

      const payload = {
        canceled_reason_out_of_time_id: this.reasonSelected.value,
        description_canceled_reason_out_of_time: this.reason_desc,
        id: this.id,
      };

      this.isloading = true;
      _appointmentService
        .updateWithOutTime(payload)
        .then(() => {
          this.$utils.toast("Notificação", "Salvo com sucesso");
          this.getRecord();
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    confirmSetpartial() {
      const payload = {
        description: this.appointment.app_description,
        name: this.appointment.app_name,
        id: this.id,
      };

      this.isloading = true;
      _appointmentService
        .updatePartial(payload)
        .then(() => {
          this.$utils.toast("Notificação", "Salvo com sucesso");
          this.getRecord();
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    getRecord() {
      this.isloading = true;
      _appointmentService
        .find(this.id)
        .then((res) => {
          let appoint = res.content;
          appoint.id = this.id;

          // studio principal
          if (res.content.main_studios) {
            res.content.main_studios.forEach((_mainStd) => {
              if (_mainStd.operators && _mainStd.operators.length > 0) {
                _mainStd.operatorSelected = {
                  label: _mainStd.operators[0].name,
                  value: _mainStd.operators[0].id,
                };
              }
              if (_mainStd.operatorsbkp && _mainStd.operatorsbkp.length > 0) {
                _mainStd.operatorBackupSelected = {
                  label: _mainStd.operatorsbkp[0].name,
                  value: _mainStd.operatorsbkp[0].id,
                };
              }
            });
          }

          // studio support
          if (res.content.support_studios) {
            res.content.support_studios.forEach((_supportStd) => {
              if (_supportStd.operators && _supportStd.operators.length > 0) {
                _supportStd.operatorSelected = {
                  label: _supportStd.operators[0].name,
                  value: _supportStd.operators[0].id,
                };
              }
              if (
                _supportStd.operatorsbkp &&
                _supportStd.operatorsbkp.length > 0
              ) {
                _supportStd.operatorBackupSelected = {
                  label: _supportStd.operatorsbkp[0].name,
                  value: _supportStd.operatorsbkp[0].id,
                };
              }
            });
          }

          this.participants = res.content.participants;
          this.links = res.content.links;

          if (this.links.length <= 0) {
            this.links = [
              {
                url: "",
              },
            ];
          } else {
            this.links = res.content.links.map((m) => {
              return {
                url: m.url,
                companieSelected:
                  m.company_id > 0
                    ? [{ label: m.company_name, value: m.company_id }]
                    : null,
              };
            });
          }

          this.links[0].companieSelected = [
            {
              label: res.content.company_name,
              value: res.content.company_id,
            },
          ];

          this.aovivoOptions = [
            { label: "Público", value: "1" },
            { label: "Privado", value: "0" },
          ];

          this.aovivo = appoint.available_youtube
            ? this.aovivoOptions[0]
            : this.aovivoOptions[1];

          // mount screen
          this.appointment = appoint;
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    getOperatorOptions(_list) {
      return this.$utils.populardropdown(_list, "name", "id", false, false);
    },
    onChangeOperator(_selected, _studio) {
      const payload = {
        data: {
          appointment_studio_id: _studio.id,
          operator_id: _selected.value,
          studio_id: _studio.studio_id,
        },
      };

      this.loadingop = true;
      _appointmentService
        .createOperator(payload)
        .then((res) => {
          this.loadingop = false;
          this.$utils.toast("Operador", "Salvo com Sucesso");
        })
        .catch((error) => {
          this.loadingop = false;
          this.$utils.toastError("Notificação", error);
        })
        .finally(() => (this.loadingop = false));
    },
    saveOperatorBackup(_selected, _studio) {
      const payload = {
        data: {
          appointment_studio_id: _studio.id,
          operator_id: _selected.value,
          studio_id: _studio.studio_id,
          operator_backup: true,
        },
      };

      this.loadingopbk = true;
      _appointmentService
        .createOperator(payload)
        .then((res) => {
          this.loadingopbk = false;
          this.$utils.toast("Operador Backup", "Salvo com Sucesso");
        })
        .catch((error) => {
          this.loadingopbk = false;
          this.$utils.toastError("Notificação", error);
        })
        .finally(() => (this.loadingop = false));
    },
    saveYoutube() {
      this.isloading = true;

      this.links.forEach((fe) => {
        fe.company_id = fe.companieSelected.value;
      });

      const payload = {
        youtube_url: this.appointment.youtube_url,
        appointmentlinks: this.links,
        id: this.appointment.id,
      };

      _appointmentService
        .updateYoutubeUpsert(payload)
        .then((res) => {
          this.$utils.toast("Notificação", "Salvo com sucesso");
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    removeLink(ll) {
      this.links = this.links.filter((f) => f.url !== ll.url);

      this.alertSaveYoutube();
      this.isDisableSaveYoutube = false;
    },
    isDisable(url) {
      return url ? false : true;
    },
    addLink() {
      this.links.push({ url: "" });
      this.alertSaveYoutube();
      this.isDisableSaveYoutube = false;
    },
    //CHAT
    sendMessage() {
      if (this.chatInputMessage) {
        this.isloading = true;

        const payload = {
          data: {
            message: this.chatInputMessage,
            appointment_id: this.id,
          },
        };

        _appointmentService
          .createChat(payload)
          .then((res) => {
            this.chatData.chat.chat.push({
              message: this.chatInputMessage,
              time: new Date(),
              senderId: this.chatData.contact.id,
              userName: res.content,
              userNameInitial: this.getinitials(res.content),
            });
            this.chatInputMessage = "";
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.isloading = false));
      }
    },
    psToBottom() {
      const scrollEl = this.$refs.refChatLogPS.$el || this.$refs.refChatLogPS;
      scrollEl.scrollTop = scrollEl.scrollHeight;
    },
    activeTabMensagem() {
      this.isloading = true;

      this.chatData = {
        chat: {
          id: 0,
          chat: [],
        },
        contact: {
          id: 0,
        },
      };

      this.chatData.chat.id = this.id;
      _appointmentService
        .getChat(this.id)
        .then((res) => {
          this.chatData.contact.id = res.content.user_id;
          res.content.chats.forEach((chat) => {
            this.chatData.chat.chat.push({
              message: chat.message,
              time: chat.created_at,
              senderId: chat.user_id,
              userName: chat.user_name,
              userNameInitial: this.getinitials(chat.user_name),
            });
          });
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    initChat() {
      this.chatData.chat.id = this.id;
    },
    alertSaveYoutube() {
      if (!this.iswarningsaveYoutube) {
        this.iswarningsaveYoutube = true;
        this.$swal({
          title: "Lembrete !!!",
          text: "Para persistir os links do youtube, tanto se adicionar ou remover, deve se clicar em 'salvar', para concretizar.",
          icon: "warning",
          confirmButtonText: "Estou ciente!",
          customClass: {
            confirmButton: "btn btn-info",
            cancelButton: "btn btn-outline-danger ml-1",
          },
          buttonsStyling: false,
        });
      }
    },
    getinitials(name) {
      const ii = name.split(" ");
      if (ii.length >= 2) {
        return ii[0].substring(0, 1) + ii[1].substring(0, 1);
      } else {
        return ii[0].substring(0, 2);
      }
    },
    changeTarget() {
      if (!this.isOnlyRead) {
        const payload = {
          available_youtube: this.aovivo.value === "1",
          id: this.appointment.id,
        };

        _appointmentService
          .updateAvailYoutube(payload)
          .then((res) => {
            this.$utils.toast("Notificação", "Salvo com sucesso");
            this.getRecord();
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.isloading = false));
      } else {
        this.$utils.toastError(
          "Notificação",
          "Não tem permissão para alterar o alvo da transmissão."
        );
      }
    },
  },
};
</script>
<style lang="scss">
@import "@core/scss/base/pages/app-chat-list.scss";
.example {
  display: flex;
  flex-direction: column;
}
.editor {
  height: 20vh;
  padding-bottom: 6%;
}
</style>