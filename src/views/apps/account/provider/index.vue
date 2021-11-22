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
              <h5 class="mb-0">Sessão #{{ appointmentid }}</h5>
              <div>
                <feather-icon
                  class="ml-1 cursor-pointer"
                  icon="XIcon"
                  size="16"
                  @click="hide"
                />
              </div>
            </div>
            <v-schedule v-if="appointmentid > 0" :id="appointmentid" />
          </template>
        </b-sidebar>

        <!-- Filter -->
        <!-- <b-button
          class="btn-filter-appoitment btn-icon rounded-circle"
          size="lg"
          :variant="containsFilter ? 'gradient-warning' : 'gradient-info'"
          @click="isActiveFilter = true"
        >
          <feather-icon icon="FilterIcon" size="30" />
        </b-button> -->

        <b-sidebar
          sidebar-class="sidebar sidebar-lg"
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
                  <b-form-group label="PESQUISA POR NOME">
                    <b-form-input
                      placeholder="nome do cliente /evento..."
                      v-model="filter.name"
                      autocomplete="off"
                    />
                  </b-form-group>
                </b-col>

                <b-col cols="12" md="6">
                  <b-form-checkbox
                    v-model="filter.sessiononline"
                    class="custom-control-info"
                  >
                    Sessão Online
                  </b-form-checkbox>
                </b-col>
                <b-col cols="12" md="6">
                  <b-form-checkbox
                    v-model="filter.appointment_private"
                    class="custom-control-warning"
                  >
                    Compromisso Particular
                  </b-form-checkbox>
                </b-col>
              </b-row>
              <b-row class="mt-3">
                <b-col cols="9">
                  <b-button @click="getfilter" variant="gradient-info" block>
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
<script>
import FullCalendar from "@fullcalendar/vue";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";

import _account from "@/services/account-provider-service";
import schedule from "./schedule-details.vue";

export default {
  components: {
    "v-schedule": schedule,
    FullCalendar,
  },
  data() {
    return {
      filter: {
        name: "",
        sessiononline: true,
        appointment_private: true,
      },
      isloading: false,
      appointmentid: 0,
      isActiveDetails: false,
      isActiveFilter: false,
      appointments: [],
      currentmonth: new Date().getMonth() + 1,

      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
        initialView: "listMonth",
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
          //start: "prev,next, title",
          start: "title",
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
            click: (_prv) => {
              this.currentmonth -= 1;
              //this.showAppointments();
              this.$refs.fullCalendar.getApi().prev();
            },
          },
          next: {
            click: (_nxt) => {
              this.currentmonth += 1;
              //this.showAppointments();
              this.$refs.fullCalendar.getApi().next();
            },
          },
        },
      },
    };
  },
  destroyed() {
    this.$destroy();
  },
  created() {
    this.showAppointments();
  },
  computed: {
    containsFilter() {
      return false;
    },
  },
  methods: {
    showAppointments() {
      this.isloading = true;
      _account
        .fetchCalendar(this.currentmonth)
        .then((res) => {
          if (res.content && res.content.appointments) {
            this.appointments = res.content.appointments;
            this.populateEvents(res.content.appointments);
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    onClickCalendar(_item) {
      const { id } = _item.event;
      this.appointmentid = id;
      this.isActiveDetails = true;
    },
    changefilter() {},
    getfilter() {
      this.isActiveFilter = false;
    },
    getFilterEvents() {},
    isOperator(_appointment, _operatorid) {},
    populateEvents(_events) {
      console.log(_events);
      this.calendarOptions.events = _events.map((m) => {
        return {
          allDay: false,
          title: `${m.hour.substring(0, 5)} ${m.customer.name}`,
          color: this.getColor(m.type),
          start: `${m.startds} ${m.hour.substring(0, 5)}`,
          id: m.id,
        };
      });
    },
    getColor(_type) {
      switch (_type) {
        case 0:
          return "#007bff"; // sessão online
        case 1:
          return "#FFAC10"; // personal_session
      }
      return null;
    },
    clearfilter() {},
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