<template>
  <b-overlay :show="isloading" spinner-variant="primary" spinner-type="grow">
    <div class="app-calendar overflow-hidden border">
      <div class="row no-gutters">
        <!-- Calendar -->
        <div class="col position-relative">
          <div class="card shadow-none border-0 mb-0 rounded-0">
            <div class="card-body pb-0">
              <full-calendar
                ref="fullCalendar"
                :options="calendarOptions"
                class="full-calendar"
                id="full-calendar-appoitment-list"
              />
            </div>
          </div>
        </div>

        <!-- Details appointment -->
        <b-sidebar
          sidebar-class="sidebar-lg"
          id="sidebar-details-appointment"
          bg-variant="white"
          v-model="isActiveDetails"
          right
          backdrop
          shadow
          no-header
        >
          <template #default="{ hide }" v-if="isActiveDetails">
            <div
              class="
                d-flex
                justify-content-between
                align-items-center
                content-sidebar-header
                px-2
                py-1
              "
            >
              <h5 class="mb-0">Detalhes Agendamento #{{ appointmentid }}</h5>
              <div>
                <feather-icon
                  class="ml-1 cursor-pointer"
                  icon="XIcon"
                  size="16"
                  @click="hide"
                />
              </div>
            </div>
            <v-appointment v-if="appointmentid > 0" :id="appointmentid" />
          </template>
        </b-sidebar>

        <!-- Filter -->
        <b-button
          class="btn-filter-appoitment btn-icon rounded-circle"
          :variant="containsFilter ? 'gradient-warning' : 'gradient-info'"
          @click="isActiveFilter = true"
        >
          <feather-icon icon="FilterIcon" size="25" />
        </b-button>

        <b-sidebar
          sidebar-class="sidebar-lg"
          bg-variant="white"
          v-model="isActiveFilter"
          right
          backdrop
          shadow
          no-header
        >
          <template #default="{ hide }" v-if="isActiveFilter">
            <div
              class="
                d-flex
                justify-content-between
                align-items-center
                content-sidebar-header
                px-2
                py-1
              "
            >
              <h5 class="mb-0">Filtros</h5>
              <div>
                <feather-icon
                  class="ml-1 cursor-pointer"
                  icon="XIcon"
                  size="16"
                  @click="hide"
                />
              </div>
            </div>
            <b-form class="px-1 mt-1">
              <b-row>
                <b-col cols="12">
                  <b-form-group label="Empresa">
                    <v-select
                      v-if="companies.length > 0 && companieSelected"
                      v-model="companieSelected"
                      :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                      :options="companies"
                      autocomplete="off"
                      multiple
                      :clearable="false"
                      @input="changefilter"
                    >
                      <template v-slot:option="option">
                        <div class="d-flex justify-content-between">
                          <h5 class="mb-0 text-uppercase">
                            {{ option.label }}
                          </h5>
                          <b-avatar
                            v-if="option.color"
                            :style="`z-index: 1; background: ${option.color}`"
                            :text="option.qtd"
                            size="2rem"
                          />
                        </div>
                      </template>
                    </v-select>
                  </b-form-group>
                </b-col>
                <b-col cols="12">
                  <b-form-group label="Projetos">
                    <v-select
                      v-if="projects.length > 0"
                      v-model="projectSelected"
                      :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                      :options="projects.filter((f) => f.qtd > 0)"
                      autocomplete="off"
                      :clearable="false"
                      multiple
                      @input="changefilter"
                    >
                      <template v-slot:option="option">
                        <div class="d-flex justify-content-between">
                          <h5 class="mb-0 text-uppercase">
                            {{ option.label }}
                          </h5>
                          <b-avatar
                            v-if="option.color"
                            :style="`z-index: 1; background: ${option.color}`"
                            :text="option.qtd"
                            size="2rem"
                          />
                        </div>
                      </template>
                    </v-select>
                  </b-form-group>
                </b-col>
                <b-col cols="12">
                  <b-form-group label="Estúdio">
                    <v-select
                      v-if="studios.length > 0 && studioSelected"
                      v-model="studioSelected"
                      :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                      :options="studios.filter((f) => f.qtd > 0)"
                      autocomplete="off"
                      :clearable="false"
                      multiple
                      @input="changefilter"
                    >
                      <template v-slot:option="option">
                        <div class="d-flex justify-content-between">
                          <h5 class="mb-0 text-uppercase">
                            {{ option.label }}
                          </h5>
                          <b-avatar
                            v-if="option.qtd > 0"
                            style="z-index: 1"
                            variant="secondary"
                            :text="option.qtd"
                            size="2rem"
                          />
                        </div>
                      </template>
                    </v-select>
                  </b-form-group>
                </b-col>
                <b-col cols="12">
                  <b-form-group label="Tipo de Transmissão">
                    <v-select
                      v-if="
                        transmissions_types.length > 0 && transmissionsSelected
                      "
                      v-model="transmissionsSelected"
                      :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                      :options="transmissions_types"
                      autocomplete="off"
                      multiple
                      :clearable="false"
                      @input="changefilter"
                    >
                      <template v-slot:option="option">
                        <div class="d-flex justify-content-between">
                          <h5 class="mb-0 text-uppercase">
                            {{ option.label }}
                          </h5>
                          <b-avatar
                            v-if="option.color"
                            :style="`z-index: 1; background: ${option.color}`"
                            :text="option.qtd"
                            size="2rem"
                          />
                        </div>
                      </template>
                    </v-select>
                  </b-form-group>
                </b-col>

                <b-col cols="6">
                  <b-form-group label="Operadores">
                    <v-select
                      v-if="operators.length > 0 && operatorsSelected"
                      v-model="operatorsSelected"
                      :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                      :options="operators"
                      autocomplete="off"
                      :clearable="false"
                      @input="changefilter"
                    >
                      <template v-slot:option="option">
                        <div class="d-flex justify-content-between">
                          <h5 class="mb-0 text-uppercase">
                            {{ option.label }}
                          </h5>
                          <b-avatar
                            v-if="option.qtd > 0"
                            style="z-index: 1"
                            variant="secondary"
                            :text="option.qtd"
                            size="2rem"
                          />
                        </div>
                      </template>
                    </v-select>
                  </b-form-group>
                </b-col>

                <b-col cols="6">
                  <b-form-group label="Home Office">
                    <v-select
                      v-if="homeoffices.length > 0 && homeofficesSelected"
                      v-model="homeofficesSelected"
                      :options="homeoffices"
                      autocomplete="off"
                      :clearable="false"
                      @input="changefilter"
                    >
                      <template v-slot:option="option">
                        <div class="d-flex justify-content-between">
                          <h5 class="mb-0 text-uppercase">
                            {{ option.label }}
                          </h5>
                          <b-avatar
                            v-if="option.qtd > 0"
                            style="z-index: 1"
                            variant="secondary"
                            :text="option.qtd"
                            size="2rem"
                          />
                        </div>
                      </template>
                    </v-select>
                  </b-form-group>
                </b-col>

                <b-col cols="6">
                  <b-form-group label="Cancelados 3h*">
                    <v-select
                      v-if="canceleds.length > 0 && canceledsSelected"
                      v-model="canceledsSelected"
                      :options="canceleds"
                      autocomplete="off"
                      :clearable="false"
                      @input="changefilter"
                    >
                      <template v-slot:option="option">
                        <div class="d-flex justify-content-between">
                          <h5 class="mb-0 text-uppercase">
                            {{ option.label }}
                          </h5>
                          <b-avatar
                            v-if="option.qtd > 0"
                            style="z-index: 1"
                            variant="secondary"
                            :text="option.qtd"
                            size="2rem"
                          />
                        </div>
                      </template>
                    </v-select>
                  </b-form-group>
                </b-col>

                <b-col cols="6">
                  <b-form-group label="Links Youtube *">
                    <v-select
                      v-if="youtubeLinks.length > 0 && youtubeLinksSelected"
                      v-model="youtubeLinksSelected"
                      :options="youtubeLinks"
                      autocomplete="off"
                      :clearable="false"
                      @input="changefilter"
                    >
                      <template v-slot:option="option">
                        <div class="d-flex justify-content-between">
                          <h5 class="mb-0 text-uppercase">
                            {{ option.label }}
                          </h5>
                          <b-avatar
                            v-if="option.qtd > 0"
                            style="z-index: 1"
                            variant="secondary"
                            :text="option.qtd"
                            size="2rem"
                          />
                        </div>
                      </template>
                    </v-select>
                  </b-form-group>
                </b-col>

                <b-col cols="9">
                  <b-button @click="filter" variant="gradient-info" block>
                    FILTRAR
                  </b-button>
                </b-col>
                <b-col cols="3">
                  <b-button
                    @click="clearfilter"
                    variant="gradient-primary"
                    block
                  >
                    Limpar
                  </b-button>
                </b-col>
              </b-row>
            </b-form>
          </template>
        </b-sidebar>
      </div>
    </div>
  </b-overlay>
</template>
<style lang='css'>
.fc .fc-scrollgrid-section-liquid {
  height: 1px !important;
}
</style>
<script>
import FullCalendar from "@fullcalendar/vue";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";

import _appointmentService from "@/services/appointment-service";
import appointment from "./appointment";
import companies from "./companies";
import studios from "./studios";

export default {
  components: {
    FullCalendar,
    "v-studios": studios,
    "v-companies": companies,
    "v-appointment": appointment,
  },
  data() {
    return {
      isloading: false,
      appointmentid: 0,
      isActiveDetails: false,
      isActiveFilter: false,
      appointments: [],
      currentmonth: new Date().getMonth() + 1,

      projects: [],
      projectSelected: null,
      companies: [],
      companieSelected: [],
      studios: [],
      studioSelected: [],
      operators: [
        { label: "Todos", value: "-1" },
        { label: "Sem Operadores", value: "1" },
        { label: "Com Operadores", value: "2" },
      ],
      operatorsSelected: { label: "Todos", value: "-1" },
      homeoffices: [
        { label: "Todos", value: "-1" },
        { label: "Home Office", value: "1" },
      ],
      homeofficesSelected: { label: "Todos", value: "-1" },
      canceleds: [
        { label: "Todos", value: "-1" },
        { label: "cancelados", value: "1" },
        { label: "Não cancelados", value: "2" },
      ],
      canceledsSelected: { label: "Todos", value: "-1" },

      youtubeLinks: [
        { label: "Todos", value: "-1" },
        { label: "Com Links", value: "1" },
        { label: "Sem Links", value: "2" },
      ],
      youtubeLinksSelected: { label: "Todos", value: "-1" },
      transmissions_types: [
        {
          label: "Youtube",
          value: "0",
        },
        {
          label: "Instagram",
          value: "1",
        },
        {
          label: "Sala VIP",
          value: "2",
        },
      ],
      transmissionsSelected: null,

      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
        initialView: "dayGridMonth",
        eventTextColor: "#ffffff",
        eventOrder: "start",
        eventDisplay: "list-item",
        dayMaxEventRows: true,
        views: {
          timeGrid: {
            dayMaxEventRows: 6,
          },
        },

        headerToolbar: {
          start: "prev,next, title",
          end: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
        },
        buttonText: {
          today: "Hoje",
          month: "Mês",
          week: "Semana",
          day: "Hoje",
          list: "Lista",
        },
        locales: ["pt-BR"],
        locale: "pt-BR",
        eventClick: this.onClickCalendar,
        events: [],
        customButtons: {
          prev: {
            click: () => {
              this.currentmonth -= 1;
              this.showAppointments();
              this.$refs.fullCalendar.getApi().prev();
            },
          },
          next: {
            click: (_nxt) => {
              this.currentmonth += 1;
              this.showAppointments();
              this.$refs.fullCalendar.getApi().next();
            },
          },
        },
      },
    };
  },
  created() {
    this.showAppointments();
  },
  computed: {
    containsFilter() {
      if (this.projectSelected) {
        var companyid = this.companieSelected
          ? this.companieSelected.map((m) => m.value)
          : (this.companieSelected = this.companies);
        var projectid = this.projectSelected
          ? this.projectSelected.map((m) => m.value)
          : ["-1"];
        var groupstudioid = this.studioSelected
          ? this.studioSelected.map((m) => m.value)
          : ["-1"];

        var operatorid = this.$utils.getValueSelected(this.operatorsSelected);

        return (
          companyid.some((s) => s !== "-1") ||
          projectid.some((s) => s !== "-1") ||
          groupstudioid.some((s) => s !== "-1") ||
          operatorid !== "-1"
        );
      }
      return false;
    },
  },
  methods: {
    showAppointments() {
      this.companies = [];
      this.projects = [[{ label: "Todos", value: "-1" }]];
      this.studios = [[{ label: "Todos", value: "-1" }]];
      this.transmissionsSelected = this.transmissions_types;

      this.isloading = true;
      _appointmentService
        .show(this.currentmonth)
        .then((res) => {
          this.appointments = res.content;
          this.populateEvents(res.content);

          // default- manter filtros atuais
          if (this.companieSelected.length <= 0) {
            this.companieSelected = this.companies[0];
          }

          if (this.studioSelected.length <= 0) {
            this.studioSelected = this.studios[0];
          }

          if (!this.projectSelected) {
            this.projectSelected = this.projects[0];
          }

          res.content.forEach((_cpm) => {
            if (!this.companies.some((s) => s.value == _cpm.company_id)) {
              this.companies.push({
                value: _cpm.company_id,
                label: _cpm.company,
                color: _cpm.color,
                qtd: this.appointments
                  .filter((f) => f.company_id === _cpm.company_id)
                  .length.toString(),
              });
            }

            _cpm.groupstudios_ids.forEach((grupoid) => {
              if (!this.studios.some((s) => s.value == grupoid)) {
                let _nameStd = null;
                if (_cpm.groupstudios.some((f) => f.id === grupoid)) {
                  _nameStd = _cpm.groupstudios.filter(
                    (f) => f.id === grupoid
                  )[0].name;
                }

                this.studios.push({
                  value: grupoid,
                  label: _nameStd || "SEM ESTÚDIO",
                  qtd: this.appointments
                    .filter((f) =>
                      f.groupstudios_ids.some((f) => f === grupoid)
                    )
                    .length.toString(),
                });
              }
            });

            if (!this.projects.some((s) => s.value == _cpm.project_id)) {
              this.projects.push({
                value: _cpm.project_id,
                label: _cpm.project,
                color: _cpm.color,
                qtd: this.appointments
                  .filter((f) => f.project_id === _cpm.project_id)
                  .length.toString(),
              });
            }
          });
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    onClickCalendar(_item) {
      const { id } = _item.event;
      this.appointmentid = id;
      this.isActiveDetails = true;
    },
    changefilter() {
      var companyid =
        this.companieSelected && this.companieSelected.length > 0
          ? this.companieSelected.map((m) => m.value)
          : (this.companieSelected = this.companies);
      var projectid =
        this.projectSelected && this.projectSelected.length > 0
          ? this.projectSelected.map((m) => m.value)
          : ["-1"];
      var groupstudioid =
        this.studioSelected && this.studioSelected.length > 0
          ? this.studioSelected.map((m) => m.value)
          : ["-1"];

      var homeoffice = "-1";
      if (this.homeofficesSelected) {
        if (this.homeofficesSelected.value !== "-1") homeoffice = true;
      }

      var canceled = "-1";
      if (this.canceledsSelected) {
        if (this.canceledsSelected.value === "1") canceled = true;
        if (this.canceledsSelected.value === "2") canceled = false;
      }

      var youtube = "-1";
      if (this.youtubeLinksSelected) {
        if (this.youtubeLinksSelected.value === "1") youtube = true;
        if (this.youtubeLinksSelected.value === "2") youtube = false;
      }

      var transmissionid =
        this.transmissionsSelected && this.transmissionsSelected.length > 0
          ? this.transmissionsSelected.map((m) => m.value)
          : (this.transmissionsSelected = this.transmissions_types);

      const operatorid = this.$utils.getValueSelected(this.operatorsSelected);

      var _events = this.getFilterEvents(
        companyid,
        projectid,
        groupstudioid,
        operatorid,
        transmissionid,
        homeoffice,
        canceled,
        youtube
      );

      // definindo quantidade
      if (companyid.some((s) => s === "-1")) {
        this.companies.forEach((_item) => {
          _item.qtd = _events
            .filter((f) => f.company_id === _item.value)
            .length.toString();
        });
      }
      if (projectid.some((s) => s === "-1")) {
        this.projects.forEach((_item) => {
          _item.qtd = _events
            .filter((f) => f.project_id === _item.value)
            .length.toString();
        });
      }
      if (groupstudioid.some((s) => s === "-1")) {
        this.studios.forEach((_item) => {
          _item.qtd = _events
            .filter((f) => f.groupstudio_id === _item.value)
            .length.toString();
        });
      }
    },
    filter() {
      var companyid =
        this.companieSelected && this.companieSelected.length > 0
          ? this.companieSelected.map((m) => m.value)
          : (this.companieSelected = this.companies);
      var projectid =
        this.projectSelected && this.projectSelected.length > 0
          ? this.projectSelected.map((m) => m.value)
          : ["-1"];
      var groupstudioid =
        this.studioSelected && this.studioSelected.length > 0
          ? this.studioSelected.map((m) => m.value)
          : ["-1"];

      var homeoffice = "-1";
      if (this.homeofficesSelected) {
        if (this.homeofficesSelected.value !== "-1") homeoffice = true;
      }

      var canceled = "-1";
      if (this.canceledsSelected) {
        if (this.canceledsSelected.value === "1") canceled = true;
        if (this.canceledsSelected.value === "2") canceled = false;
      }

      var youtube = "-1";
      if (this.youtubeLinksSelected) {
        if (this.youtubeLinksSelected.value === "1") youtube = true;
        if (this.youtubeLinksSelected.value === "2") youtube = false;
      }

      var transmissionid =
        this.transmissionsSelected && this.transmissionsSelected.length > 0
          ? this.transmissionsSelected.map((m) => m.value)
          : (this.transmissionsSelected = this.transmissions_types);

      const operatorid = this.$utils.getValueSelected(this.operatorsSelected);

      var _events = this.getFilterEvents(
        companyid,
        projectid,
        groupstudioid,
        operatorid,
        transmissionid,
        homeoffice,
        canceled,
        youtube
      );
      this.populateEvents(_events);
      this.isActiveFilter = false;
    },
    getFilterEvents(
      companyid,
      projectid,
      groupstudioid,
      operatorid,
      transmissionid,
      homeoffice,
      canceled,
      youtube
    ) {
      return this.appointments.filter(
        (f) =>
          (youtube === f.is_youtube_link || youtube === "-1") &&
          (canceled === f.canceled_out_of_time || canceled === "-1") &&
          (homeoffice === f.is_home_office || homeoffice === "-1") &&
          this.isOperator(f, operatorid) &&
          (projectid.some((s) => s.toString() === "-1") ||
            projectid.some((s) => s.toString() === f.project_id.toString())) &&
          (companyid.some((s) => s.toString() === "-1") ||
            companyid.some((s) => s.toString() === f.company_id.toString())) &&
          (transmissionid.some((s) => s.toString() === "-1") ||
            transmissionid.some(
              (s) => s.toString() === f.transmissiontype.toString()
            )) &&
          (groupstudioid.some((s) => s.toString() === "-1") ||
            groupstudioid.some((s) =>
              f.groupstudios_ids.some((ss) => ss.toString() === s.toString())
            ))
      );
    },
    isOperator(_appointment, _operatorid) {
      if (!_operatorid) {
        _operatorid = "-1";
      }

      if (_operatorid === "-1") {
        return true;
      } else {
        switch (_operatorid) {
          case "1":
            // sem operadores
            return _appointment.operators === false;
          case "2":
            // com operadores
            return _appointment.operators === true;
          default:
            return false;
        }
      }
    },
    populateEvents(_events) {
      this.calendarOptions.events = _events.map((m) => {
        return {
          title: `${m.project} - ${m.time.substring(0, 5)} ${m.title}`,
          start: `${m.start}`,
          color: m.color,
          id: m.id,
        };
      });
      this.companieSelected = this.companies.map((m) => m);
    },
    clearfilter() {
      this.companieSelected = this.companies;
      this.transmissionsSelected = this.transmissions_types;
      this.projectSelected = [{ label: "Todos", value: "-1" }];
      this.studioSelected = [{ label: "Todos", value: "-1" }];
      this.operatorsSelected = [{ label: "Todos", value: "-1" }];
    },
  },
};
</script>
<style lang="scss">
@import "@core/scss/vue/apps/calendar.scss";
.fc-list-event-time {
  display: none !important;
}
.btn-filter-appoitment {
  position: fixed;
  bottom: 5%;
  right: 45px;
  z-index: 99;
}

.fc-daygrid-more-link {
  font-weight: bolder !important;
}

.fc-popover-title {
  font-weight: bolder !important;
}

#sidebar-details-appointment {
  width: 60rem;
}

#full-calendar-appoitment-list .fc-view-harness-active .fc-popover {
  top: 0px !important;
  left: 15% !important;
  max-height: -webkit-fill-available;
  overflow-y: scroll;
}
</style>