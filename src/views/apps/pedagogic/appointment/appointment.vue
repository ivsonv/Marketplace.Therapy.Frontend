<template>
  <div>
    <b-overlay :show="isloading" spinner-variant="primary" spinner-type="grow">
      <form-wizard
        :color="colorfull"
        :title="null"
        :subtitle="null"
        shape="square"
        finish-button-text="Enviar"
        back-button-text="Anterior"
        next-button-text="Próximo"
        layout="vertical"
        class="wizard-vertical mb-3"
        @on-complete="formSubmitted"
      >
        <!-- Agendamento -->
        <tab-content
          title="Data e hora"
          :icon="`feather icon-${isAppointmentOk ? 'check' : 'clock'}`"
          :before-change="validationAppointmentForm"
        >
          <b-row>
            <b-col cols="12" class="mb-2">
              <h3 class="mb-0">
                {{ rescheduling ? "REAGENDAMENTO" : "AGENDAMENTO" }}
              </h3>
              <small class="text-muted">
                Escolha Data e hora para
                {{ rescheduling ? "reagendamento" : "agendamento" }}
              </small>
            </b-col>
            <b-col md="7" class="text-center">
              <b-form-group label="Calendário">
                <b-calendar
                  v-model="start"
                  locale="pt-BR"
                  :min="new Date()"
                  hide-header
                  block
                  class="mt-1"
                  @context="onContext"
                  today-variant="info"
                  selected-variant="success"
                />
              </b-form-group>
            </b-col>
            <b-col class="mt-sm-3" md="4" v-if="start">
              <b-form-group label="Horário do Evento">
                <b-form-timepicker
                  v-model="hour"
                  class="border rounded p-2"
                  locale="pt-BR"
                  minutes-step="15"
                  :state="hourValid"
                  @input="isValidTime"
                />
              </b-form-group>
              <b-form-checkbox
                v-model="record.available_youtube"
                class="custom-control-info"
              >
                Disponível no Youtube?
              </b-form-checkbox>
            </b-col>
          </b-row>
        </tab-content>

        <!-- Projeto detalhes tab -->
        <tab-content
          title="Projetos"
          :icon="`feather icon-${projectSelected ? 'check' : 'clipboard'}`"
          :before-change="validationProjectForm"
        >
          <b-row>
            <b-col cols="12" class="mb-2" v-if="!projectSelected">
              <h3 class="mb-0">Projetos</h3>
              <small class="text-muted">
                Escolha um projeto para o
                {{ rescheduling ? "reagendamento" : "agendamento" }}.
              </small>
            </b-col>
            <b-col cols="12" class="mb-2" v-else>
              <h5 class="mb-0 text-uppercase">{{ projectSelected.name }}</h5>
              <div v-if="projectSelected.company">
                <b-badge :style="`background: ${projectSelected.companycolor}`">
                  <feather-icon icon="HomeIcon" size="21" />
                </b-badge>
                <small>
                  {{ projectSelected.company }}
                </small>
              </div>
            </b-col>
            <b-col md="6" v-if="!rescheduling">
              <b-form-group>
                <b-overlay
                  :show="isloading"
                  spinner-variant="primary"
                  spinner-type="grow"
                >
                  <vue-autosuggest
                    v-model="queryProject"
                    :suggestions="projects"
                    :input-props="inputProps"
                    :section-configs="autoSugestsConfigs"
                    @input="getAutoCompleteProjects"
                  >
                    <template slot-scope="{ suggestion }">
                      <div v-if="suggestion.item.valid">
                        <h5 class="mb-0 text-uppercase">
                          {{ suggestion.item.name }}
                        </h5>
                        <div v-if="suggestion.item.company">
                          <b-badge
                            :style="`background: ${suggestion.item.companycolor}`"
                            ><feather-icon icon="HomeIcon" size="21"
                          /></b-badge>
                          <small>
                            {{ suggestion.item.company }}
                          </small>
                        </div>
                      </div>
                      <div v-else>
                        <strike class="mb-0 text-uppercase">
                          {{ suggestion.item.name }}
                        </strike>
                        <div v-if="suggestion.item.remark">
                          <small>
                            {{ suggestion.item.remark }}
                          </small>
                        </div>
                      </div>
                    </template>
                  </vue-autosuggest>
                </b-overlay>
              </b-form-group>
            </b-col>
          </b-row>
        </tab-content>

        <!-- tipo de evento  -->
        <tab-content
          title="Evento / Aula"
          :icon="`feather icon-${isEventOrLessonOk ? 'check' : 'calendar'}`"
          :before-change="validationEventLessonForm"
        >
          <b-overlay
            :show="isloading"
            spinner-variant="primary"
            spinner-type="grow"
          >
            <b-row>
              <b-col cols="12" class="mb-2">
                <h5 class="mb-0">Evento / Aula</h5>
                <small class="text-muted">Defina o tipo do agendamento.</small>
              </b-col>
              <b-col md="6">
                <b-button
                  :variant="isEvent ? 'secondary' : 'outline-secondary'"
                  @click="getEvents()"
                  class="mb-1"
                  block
                  :disabled="!isEvent && rescheduling"
                  >Evento</b-button
                >
              </b-col>
              <b-col md="6" class="mb-1">
                <b-button
                  :variant="isLesson ? 'secondary' : 'outline-secondary'"
                  :disabled="!isLesson && rescheduling"
                  @click="getLessons()"
                  block
                  >Aula</b-button
                >
              </b-col>

              <b-col cols="12" v-if="this.isEvent">
                <h5>Evento:</h5>
                <b-form-group>
                  <v-select
                    v-if="events.length > 0 && eventsSelected"
                    v-model="eventsSelected"
                    :disabled="rescheduling"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="events"
                    autocomplete="off"
                    :clearable="false"
                    @input="checkproject"
                  />
                </b-form-group>
                <b-form-checkbox
                  v-model="isStudioSupport"
                  class="custom-control-info"
                >
                  Necessita de estudio de apoio?
                </b-form-checkbox>
              </b-col>
              <b-col cols="12" v-if="this.isLesson">
                <h5>Aula:</h5>
                <b-form-group>
                  <v-select
                    v-if="lessons.length > 0 && lessonsSelected"
                    :disabled="rescheduling"
                    v-model="lessonsSelected"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="lessons"
                    autocomplete="off"
                    :clearable="false"
                    @input="checkproject"
                  />
                </b-form-group>
              </b-col>

              <b-col
                class="my-2"
                cols="12"
                v-if="this.isEvent || this.isLesson"
              >
                <h5>Tipo Transmissão</h5>
                <hr />
                <b-form-radio
                  v-for="(tt, index) in transmissions_types"
                  :key="index"
                  v-model="transmission_type"
                  name="some-transmission"
                  :value="tt.code"
                  class="mb-1"
                >
                  <feather-icon
                    size="25"
                    :color="`var(--${tt.color})`"
                    :icon="tt.icon"
                  />
                  {{ tt.name }}
                </b-form-radio>
              </b-col>
            </b-row>
          </b-overlay>
        </tab-content>

        <!-- Estudios Detalhes tab -->
        <tab-content
          title="Estúdios"
          v-if="transmission_type === 0"
          :before-change="validationStudiosForm"
          :icon="`feather icon-${
            studiosAdded && studiosAdded.length > 0 ? 'check' : 'headphones'
          }`"
        >
          <b-row>
            <b-col cols="12" class="mb-2">
              <h3 class="mb-0">Estúdios</h3>
              <small class="text-muted">
                Escolha até {{ studiosCapacity }} estúdio para Agendamento.
              </small>
            </b-col>
            <b-col md="6">
              <b-form-group>
                <b-overlay
                  :show="isloading"
                  spinner-variant="primary"
                  spinner-type="grow"
                >
                  <vue-autosuggest
                    v-model="queryStudio"
                    :suggestions="studios"
                    :input-props="inputStudiosProps"
                    :section-configs="autoSugestsConfigs"
                    @input="getAutoCompleteStudios"
                  >
                    <template slot-scope="{ suggestion }">
                      <h5 class="mb-0">{{ suggestion.item.name }}</h5>
                      <small v-if="suggestion.item.place">
                        {{ suggestion.item.place.name }}
                      </small>
                    </template>
                  </vue-autosuggest>

                  <div class="py-1 d-flex">
                    <b-form-checkbox
                      class="custom-control-success"
                      name="check-button"
                      switch
                      v-model="homeoffice"
                    >
                      <span class="switch-icon-left">
                        <feather-icon icon="CheckIcon" />
                      </span>
                      <span class="switch-icon-right">
                        <feather-icon icon="XIcon" />
                      </span>
                    </b-form-checkbox>
                    <strong>Apenas Estúdio HomeOffice ?</strong>
                  </div>

                  <!-- estudios marcados -->
                  <div v-if="studiosAdded && studiosAdded.length > 0">
                    <hr />
                    <b-row
                      class="mb-1"
                      v-for="(_stdo, index) in studiosAdded"
                      :key="index"
                    >
                      <b-col cols="10" class="d-flex align-items-center">
                        <b-button
                          variant="outline-danger"
                          class="mr-1"
                          @click="removeStudio(_stdo)"
                        >
                          <feather-icon icon="XIcon" class="mr-25" />
                          <span>Remover</span>
                        </b-button>
                        <div>
                          <h5 class="mb-0">{{ _stdo.name }}</h5>
                        </div>
                      </b-col>
                    </b-row>
                  </div>
                </b-overlay>
              </b-form-group>
            </b-col>
          </b-row>
        </tab-content>

        <!-- APOIO -->
        <tab-content v-if="isStudioSupport" title="Estúdio de Apoio">
          <b-overlay
            :show="isloading"
            spinner-variant="primary"
            spinner-type="grow"
          >
            <b-row>
              <b-col cols="12" class="mb-2">
                <h3 class="mb-0">Estúdio de Apoio</h3>
                <small class="text-muted"> Escolha os estúdio de apoio </small>
              </b-col>
            </b-row>

            <!-- studios de apoio -->
            <b-row
              v-for="(item, iitem) in studiosSupport"
              :id="'blb-' + item.id"
              :key="iitem"
            >
              <!-- sub events -->
              <b-col cols="12" md="4">
                <b-form-group label="Sub-Evento">
                  <v-select
                    v-model="item.subeventsSelected"
                    v-if="subevents.length > 0"
                    :options="subevents"
                    autocomplete="off"
                    :clearable="false"
                  />
                </b-form-group>
              </b-col>

              <!-- studio Apoio -->
              <b-col cols="12" md="4">
                <b-form-group label="Estúdios">
                  <v-select
                    v-model="item.studiosSelected"
                    :options="supportstudios"
                    :disabled="!item.subeventsSelected"
                    searchable
                    @search="
                      (term) => {
                        fetchStudiosApoio(term, item);
                      }
                    "
                    :loading="isloadingStudioApoio"
                  />
                </b-form-group>
              </b-col>
              <b-col cols="12" md="4">
                <b-form-group label="-">
                  <b-button
                    variant="outline-danger"
                    @click="removeStudioSupport(item)"
                  >
                    <feather-icon icon="XIcon" class="mr-25" />
                    <span>Remover</span>
                  </b-button>
                </b-form-group>
              </b-col>
            </b-row>
            <hr />
            <b-button variant="gradient-info" @click="newSupportStudio()">
              <feather-icon icon="PlusIcon" class="mr-1" />
              <span>Adicionar</span>
            </b-button>
          </b-overlay>
        </tab-content>

        <!-- Dados do agendamento  -->
        <tab-content icon="feather icon-cast" title="Agendamento">
          <b-row>
            <b-col cols="8">
              <b-form-group label="Nome">
                <b-form-input
                  v-model="record.name"
                  placeholder="Informe um nome (opcional)"
                />
              </b-form-group>
            </b-col>

            <b-col cols="8">
              <b-form-group label="Descrição">
                <b-form-textarea
                  rows="7"
                  v-model="record.description"
                  placeholder="Informe uma breve descrição (opcional)"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12" class="mb-1">
              <b-card-text class="mb-0">
                Notificar participantes ?
              </b-card-text>
              <b-form-checkbox
                v-model="record.send_notification"
                class="custom-control-success"
                name="check-button"
                switch
              >
                <span class="switch-icon-left">
                  <feather-icon icon="MailIcon" />
                </span>
                <span class="switch-icon-right">
                  <feather-icon icon="XIcon" />
                </span>
              </b-form-checkbox>
            </b-col>
          </b-row>
        </tab-content>
      </form-wizard>
    </b-overlay>
  </div>
</template>

<script>
import { FormWizard, TabContent } from "vue-form-wizard";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import moment from "moment";

import _projectsService from "@/services/projects-service";
import _studiosService from "@/services/studios-service";
import _appointmentService from "@/services/appointment-service";

import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BCalendar,
  BFormRadio,
} from "bootstrap-vue";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    FormWizard,
    TabContent,
    BRow,
    BCol,
    BCalendar,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BFormRadio,
  },
  data() {
    return {
      record: {
        id: 0,
        start: null,
        name: null,
        description: null,
        send_notification: true,
      },
      homeoffice: false,
      project_valid: false,
      rescheduling: false,
      start_hour: null,
      debounceMilliseconds: 300,
      timeout: null,
      queryProject: "",
      projectSelected: null,
      projects: [],
      isloading: false,
      colorfull: "#1890ff",
      autoSugestsConfigs: {
        projects: {
          limit: 20,
          onSelected: (selected) => {
            if (selected.item.valid) {
              this.projectSelected = selected.item;
              if (this.projectSelected && this.projectSelected.companycolor) {
                this.colorfull = this.projectSelected.companycolor;
              }
            } else {
              this.$utils.toastError(
                "ERRO!!!",
                "Não e possível escolher esse projeto."
              );
            }
          },
        },
        studios: {
          limit: 20,
          onSelected: (selected) => {
            this.queryStudio = null;
            let _add = true;
            if (this.studiosAdded.length > 0) {
              if (
                this.studiosAdded.length >= process.env.VUE_APP_MAX_QTD_STUDIOS
              ) {
                _add = false;
                this.$utils.toastError(
                  "OPS!!!",
                  "Não e possível adicionar mais de " +
                    process.env.VUE_APP_MAX_QTD_STUDIOS +
                    " estúdios."
                );
              }
            }

            if (
              _add &&
              !this.studiosAdded.some((s) => s.id == selected.item.id)
            ) {
              this.studiosAdded.push(selected.item);
            }
          },
        },
      },
      inputProps: {
        id: "autocompanies__input_ajax",
        placeholder: "Digite o nome do Projeto, empresa...",
        class: "form-control",
        name: "ajax",
      },
      queryStudio: "",
      studioSelected: null,
      studios: [],
      supportstudios: [],
      studiosAdded: [],
      inputStudiosProps: {
        id: "autostudios__input_ajax",
        placeholder: "Digite o nome do estúdio ou local",
        class: "form-control",
        name: "ajax",
      },
      studiosCapacity: process.env.VUE_APP_MAX_QTD_STUDIOS,
      eventsSelected: { label: "Evento....", value: "-3" },
      eventsOri: [],
      events: [],

      lessonsSelected: { label: "Aula...", value: "-3" },
      lessons: [],
      lessonsOri: [],
      subevents: [],

      studiosSupport: [
        {
          id: this.$utils.getGuidId(),
          subeventsSelected: null,
          studiosSelected: null,
        },
      ],
      hour: null,
      start: null,
      isEvent: false,
      isLesson: false,
      isStudioSupport: false,
      isEventOrLessonOk: false,
      isAppointmentOk: false,
      hourValid: false,
      transmissions_types: [
        {
          name: "Youtube",
          code: 0,
          icon: "YoutubeIcon",
          color: "red",
        },
        {
          name: "Instagram",
          code: 1,
          icon: "InstagramIcon",
          color: "pink",
        },
        {
          name: "Sala VIP",
          code: 2,
          icon: "StarIcon",
          color: "warning",
        },
      ],
      transmission_type: 0,
      isloadingStudioApoio: false,
    };
  },
  created() {
    var _date = new Date();
    var _hora = _date.getHours();
    var _minutes = _date.getMinutes();
    if (_minutes > 0 && _minutes < 15) _minutes = 15;
    else if (_minutes >= 15 && _minutes < 30) _minutes = 30;
    else if (_minutes >= 30 && _minutes < 45) _minutes = 45;
    else if (_minutes > 45) {
      _minutes = "00";
      _hora += 1;
    }
    if (_hora >= 0 && _hora <= 9) {
      _hora = `0${_hora}`;
    }

    this.hour = `${_hora}:${_minutes}`;
    this.hourValid = true;
  },
  mounted() {
    this.rescheduling = this.$route.params.id > 0;
    if (this.rescheduling) this.getAppoiment();
  },
  methods: {
    getAppoiment() {
      this.isloading = true;
      _appointmentService
        .findbyid(this.$route.params.id)
        .then((res) => {
          if (res.content) {
            this.record.description = res.content.description;
            this.record.name = res.content.name;

            this.isEvent = false;
            this.isLesson = false;
            this.transmission_type = res.content.transmission_type;
            switch (res.content.type) {
              case 2: // lesson
                this.projectSelected = {
                  id: res.content.lesson.course.project.id,
                  name: res.content.lesson.course.project.name,
                  company: res.content.lesson.course.project.company.name,
                  companycolor: res.content.lesson.course.project.company.color,
                };
                this.project_valid = true;

                //projects
                this.queryProject = res.content.lesson.course.project.name;

                // lessons
                this.lessonsSelected = {
                  label: res.content.lesson.name,
                  value: res.content.lesson.id,
                };
                this.lessonsOri = [];
                this.lessonsOri.push(res.content.lesson);
                this.lessons = this.$utils.populardropdown(
                  this.lessonsOri,
                  "name",
                  "id",
                  false,
                  false
                );

                this.isEventOrLessonOk = true;
                this.isLesson = true;
                break;

              // events
              case 1:
                this.projectSelected = {
                  id: res.content.event.project.id,
                  name: res.content.event.project.name,
                  company: res.content.event.project.company.name,
                  companycolor: res.content.event.project.company.color,
                };
                this.queryProject = res.content.event.project.name;
                this.project_valid = true;

                // events
                this.eventsSelected = {
                  label: res.content.event.name,
                  value: res.content.event.id,
                };
                this.eventsOri = [];
                this.eventsOri.push(res.content.event);
                this.events = this.$utils.populardropdown(
                  this.eventsOri,
                  "name",
                  "id",
                  false,
                  false
                );

                this.isEventOrLessonOk = true;
                this.isEvent = true;
                break;
            }
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    getAutoCompleteProjects() {
      if (this.queryProject && this.queryProject.length >= 3) {
        this.timeout = setTimeout(() => {
          if (!this.isloading) {
            this.isloading = true;
            _appointmentService
              .showProjects(this.queryProject, this.start_hour)
              .then((res) => {
                this.projects = [{ name: "projects", data: res.content }];
              })
              .catch((error) => this.$utils.toastError("Notificação", error))
              .finally(() => (this.isloading = false));
          }
        }, this.debounceMilliseconds);
      }
    },
    getAutoCompleteStudios() {
      if (this.queryStudio && this.queryStudio.length >= 3) {
        this.timeout = setTimeout(() => {
          if (!this.isloading) {
            var duration = 0;
            if (!this.isEvent) {
              var lessonid = this.$utils.getValueSelected(this.lessonsSelected);
              duration = this.lessonsOri.filter((f) => f.id === lessonid)[0]
                .duration;
            } else {
              var eventid = this.$utils.getValueSelected(this.eventsSelected);
              duration = this.eventsOri.filter((f) => f.id === eventid)[0]
                .duration;
            }
            this.isloading = true;
            _appointmentService
              .showAllStudios(
                this.queryStudio,
                this.start_hour,
                duration,
                this.homeoffice,
                this.$route.params.id
              )
              .then((res) => {
                this.studios = [{ name: "studios", data: res.content }];
              })
              .catch((error) => this.$utils.toastError("Notificação", error))
              .finally(() => (this.isloading = false));
          }
        }, this.debounceMilliseconds);
      }
    },
    getEvents() {
      this.isEvent = false;
      this.isLesson = false;
      if (this.projectSelected) {
        this.isEvent = true;
        if (this.events.length <= 0) {
          this.isloading = true;
          _projectsService
            .showEvents(this.projectSelected.id)
            .then((res) => {
              if (res.content && res.content.length > 0) {
                this.eventsOri = res.content;
                this.events = this.$utils.populardropdown(
                  res.content,
                  "name",
                  "id",
                  false,
                  false
                );
              } else {
                this.$utils.toastError(
                  "Notificação",
                  "Nenhum aula encontrada para esse projeto"
                );
              }
            })
            .catch((error) => this.$utils.toastError("Notificação", error))
            .finally(() => (this.isloading = false));
        }
      } else {
        this.$utils.toastError("Notificação", "Nenhum projeto selecionado.");
      }
    },
    getLessons() {
      this.isEvent = false;
      this.isLesson = false;
      this.isStudioSupport = false;
      if (this.projectSelected) {
        this.isLesson = true;
        if (this.lessons.length <= 0) {
          this.isloading = true;
          _appointmentService
            .showLessons(this.projectSelected.id)
            .then((res) => {
              this.lessonsOri = res.content;
              if (res.content && res.content.length > 0) {
                this.lessons = this.$utils.populardropdown(
                  res.content,
                  "name",
                  "id",
                  false,
                  false
                );
              } else {
                this.$utils.toastError(
                  "Notificação",
                  "Nenhum aula encontrada para esse projeto"
                );
              }
            })
            .catch((error) => this.$utils.toastError("Notificação", error))
            .finally(() => (this.isloading = false));
        }
      }
    },
    fetchStudiosApoio(_term, _item) {
      if (_term && _term.length >= 3) {
        setTimeout(() => {
          if (!this.isloadingStudioApoio) {
            var eventid = this.$utils.getValueSelected(this.eventsSelected);
            var subevent_id = _item.subeventsSelected.value;

            this.isloadingStudioApoio = true;
            _appointmentService
              .showAllStudiosApoio(_term, this.start_hour, eventid, subevent_id)
              .then((res) => {
                if (res.content) {
                  let _stds = [];
                  res.content.forEach((_item) => {
                    // nao pode adicionar o studio principal
                    // não pode adicionar studio ja adiciona em algum subevento em tempo de execução.
                    if (
                      !this.studiosAdded.some((s) => s.id === _item.id) &&
                      !this.studiosSupport.some(
                        (s) =>
                          s.studiosSelected &&
                          s.studiosSelected.value === _item.id
                      )
                    ) {
                      _stds.push(_item);
                    }
                  });

                  this.supportstudios = this.$utils.populardropdown(
                    _stds,
                    "name",
                    "id",
                    false,
                    false
                  );
                }
              })
              .catch((error) => this.$utils.toastError("Notificação", error))
              .finally(() => (this.isloadingStudioApoio = false));
          }
        }, 500);
      }
    },

    getStudios() {
      var duration = 0;
      if (!this.isEvent) {
        var lessonid = this.$utils.getValueSelected(this.lessonsSelected);
        duration = this.lessonsOri.filter((f) => f.id === lessonid)[0].duration;
      } else {
        var eventid = this.$utils.getValueSelected(this.eventsSelected);
        duration = this.eventsOri.filter((f) => f.id === eventid)[0].duration;
      }

      _appointmentService
        .showAllStudios("", this.start_hour, duration)
        .then((res) => {
          if (res.content) {
            let _stds = [];
            res.content.forEach((_item) => {
              if (!this.studiosAdded.some((s) => s.id === _item.id)) {
                _stds.push(_item);
              }
            });

            this.supportstudios = this.$utils.populardropdown(
              _stds,
              "name",
              "id",
              false,
              false
            );
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    removeStudio(_item) {
      this.studiosAdded = this.studiosAdded.filter((f) => f.id !== _item.id);
    },
    checkproject() {
      var duration = 0;
      if (!this.isEvent) {
        var lessonid = this.$utils.getValueSelected(this.lessonsSelected);
        duration = this.lessonsOri.filter((f) => f.id === lessonid)[0].duration;
      } else {
        var eventid = this.$utils.getValueSelected(this.eventsSelected);
        duration = this.eventsOri.filter((f) => f.id === eventid)[0].duration;
      }

      _appointmentService
        .showProjectsCheck(this.projectSelected.id, this.start_hour, duration)
        .then((res) => {
          if (res.content) {
            if (!res.content[0].valid) {
              this.$utils.toastError("PROJETO", res.content[0].remark);
              this.project_valid = false;
            } else {
              this.project_valid = true;
            }
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    onContext(ctx) {
      this.context = ctx;
      this.isValidTime();
    },
    newSupportStudio() {
      // validar já foi preenchido campos anteriores
      if (this.studiosSupport.some((s) => s.subeventsSelected == null)) {
        this.$utils.toastError("OPS!!!", "Favor Preencher Sub evento acima");
        return;
      }

      if (this.studiosSupport.some((s) => s.studiosSelected == null)) {
        this.$utils.toastError("OPS!!!", "Favor Preencher Estudio acima");
        return;
      }

      // sub-events
      let subaux = [];
      this.subevents.forEach((_se) => {
        if (
          !this.studiosSupport.some(
            (s) => s.subeventsSelected.value === _se.value
          )
        ) {
          subaux.push(_se);
        }
      });
      if (subaux.length <= 0) {
        this.$utils.toastError("OPS!!!", "Esse e o último sub-evento");
        return;
      } else {
        this.subevents = subaux;
      }
      // FIM sub-events

      // Studios
      let studioaux = [];
      this.supportstudios.forEach((_ss) => {
        if (
          !this.studiosSupport.some(
            (s) => s.studiosSelected.value === _ss.value
          )
        ) {
          studioaux.push(_ss);
        }
      });

      if (this.supportstudios.length <= 0) {
        this.$utils.toastError("OPS!!!", "Esse e o último estúdio.");
        return;
      } else {
        this.supportstudios = studioaux;
      }
      // FIM Studio

      this.studiosSupport.push({
        subeventsSelected: null,
        studiosSelected: null,
        id: this.$utils.getGuidId(),
      });
    },
    removeStudioSupport(_item) {
      // devolve para a lista os evento
      if (_item.subeventsSelected) {
        if (
          !this.subevents.some((s) => s.value === _item.subeventsSelected.value)
        ) {
          this.subevents.push({
            ..._item.subeventsSelected,
          });
        }
      }

      // devolve o studio para lista
      if (_item.studiosSelected) {
        if (
          !this.supportstudios.some(
            (s) => s.value === _item.studiosSelected.value
          )
        ) {
          this.supportstudios.push({
            ..._item.studiosSelected,
          });
        }
      }

      this.studiosSupport = this.studiosSupport.filter(
        (f) => f.id !== _item.id
      );
    },
    validationAppointmentForm() {
      if (!this.start || !this.hour || !this.hourValid) {
        this.$utils.toastError("Validação", "Escolha a data e hora");
        return false;
      } else {
        this.start_hour = `${this.start}T${this.hour}`;
        this.isAppointmentOk = true;
        if (!this.rescheduling) {
          this.projectSelected = null;
          this.queryProject = null;
          this.projects = [];
        }
        return true;
      }
    },
    validationProjectForm() {
      if (this.projectSelected === null) {
        this.$utils.toastError(
          "Notificação",
          "Selecione um projeto para continuar."
        );
      }
      return this.projectSelected !== null;
    },
    validationEventLessonForm() {
      if (!this.rescheduling) {
        this.studiosSelected = null;
        this.queryStudio = "";
        this.studios = [];
        this.studiosAdded = [];
        this.isEventOrLessonOk = true;
      }
      return this.project_valid;
    },
    validationStudiosForm() {
      // transmission_type | 0 - youtube
      if (this.isEvent && this.isStudioSupport && this.transmission_type == 0) {
        // buscar studios de apoio
        //this.getStudios();

        //buscar subeventos para vincular ao studio de apoio
        const evento = this.eventsOri.filter(
          (f) => f.id === this.eventsSelected.value
        )[0];
        if (evento.subEvents && evento.subEvents.length > 0) {
          this.subevents = this.$utils.populardropdown(
            evento.subEvents,
            "name",
            "id",
            false,
            false
          );
          this.isEventOrLessonOk = true;
          return true;
        } else {
          this.$utils.toastError(
            "Notificação",
            "O evento escolhido não tem SUBEVENTOS, não será possível escolher estudio de apoio."
          );
          return false;
        }
      }
      return true;
    },
    formSubmitted() {
      // 1 - Evento, 2 - Lesson
      this.record.transmission_type = this.transmission_type;
      this.record.is_home_office = this.homeoffice;
      this.record.type = this.isEvent ? 1 : 2;
      this.record.start = this.start_hour;
      this.record.id = 0;

      if (this.rescheduling) {
        this.record.id = this.$route.params.id;
      }

      this.record.studios = [];
      this.studiosAdded.forEach((_itemApo) => {
        this.record.studios.push({
          studio_id: _itemApo.id,
          main: true,
        });
      });

      switch (this.record.type) {
        case 1:
          this.record.event_id = this.$utils.getValueSelected(
            this.eventsSelected
          );

          if (this.isStudioSupport) {
            this.studiosSupport.forEach((_itemApo) => {
              this.record.studios.push({
                studio_id: this.$utils.getValueSelected(
                  _itemApo.studiosSelected
                ),
                subevent_id: this.$utils.getValueSelected(
                  _itemApo.subeventsSelected
                ),
                main: false,
              });
            });
          }
          break;
        case 2:
          this.record.lesson_id = this.$utils.getValueSelected(
            this.lessonsSelected
          );
          break;
      }

      // payload
      const payload = { data: { ...this.record } };

      //promisse
      const _createOrUpdate =
        this.record.id <= 0
          ? _appointmentService.create(payload)
          : _appointmentService.update(payload);

      if (!this.isloading) {
        this.isloading = true;
        _createOrUpdate
          .then(() => {
            this.$utils.toast("Notificação", "Agendamento criado com sucesso.");
            this.$router.push({ name: "pedagogic-calendar" });
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.isloading = false));
      }
    },
    isValidTime() {
      var _date = new Date();
      var _hora = _date.getHours();
      var _minutes = _date.getMinutes();

      const dateFormat = moment(_date).format("YYYY-MM-DD");
      if (moment(this.start).isSame(dateFormat)) {
        var minTime = moment(`${_hora}:${_minutes}`, "hh:mm");
        var maxTime = moment("23:59", "hh:mm");
        this.hourValid = moment(this.hour, "hh:mm").isBetween(minTime, maxTime);
      } else {
        this.hourValid = true;
      }
    },
  },
};
</script>
<style lang="scss">
@import "@core/scss/vue/libs/vue-wizard.scss";
@import "@core/scss/vue/libs/vue-select.scss";
</style>