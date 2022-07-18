<template>
  <div>
    <h1 class="fuso-required py-1 px-0 m-0">
      Agende aqui sua consulta
      <div>
        <h4 class="mt-25">Fuso horário de São Paulo ({{ horasp }})</h4>
        <hr class="divisor-hour" />
      </div>
    </h1>

    <div class="form-group" v-if="dates">
      <!-- DESKTOP -->
      <div class="d-none d-lg-block">
        <!-- SEMANAS -->
        <div class="row">
          <div class="col-2 cursor-pointer">
            <feather-icon
              icon="ArrowLeftCircleIcon"
              size="40"
              @click="previushours"
            />
          </div>
          <div class="col-lg-2">
            <small class="d-block">{{ dates[0].ds_week }}</small>
            <strong>{{ dates[0].ds_date }}</strong>
          </div>
          <div class="col-lg-2">
            <small class="d-block">{{ dates[1].ds_week }}</small>
            <strong>{{ dates[1].ds_date }}</strong>
          </div>
          <div class="col-lg-2">
            <small class="d-block">{{ dates[2].ds_week }}</small>
            <strong>{{ dates[2].ds_date }}</strong>
          </div>
          <div class="col-lg-2">
            <small class="d-block">{{ dates[3].ds_week }}</small>
            <strong>{{ dates[3].ds_date }}</strong>
          </div>
          <div class="col-2 cursor-pointer">
            <feather-icon
              icon="ArrowRightCircleIcon"
              size="40"
              @click="nexthours"
            />
          </div>
        </div>
        <hr />

        <!--HORARIOS -->
        <div class="display-hours-details">
          <div class="row" v-for="(item, i) in qtdDisplayDates" :key="i">
            <div class="col-2" />
            <div class="col-lg-2" @click="selectHour(0, i)">
              <div class="box-hour-avail">
                <img
                  v-if="gethours(0, i) === '-'"
                  :src="require('@/assets/images/svg/Lock.svg')"
                  title="Horário Indisponível"
                />
                <strong v-else>{{ gethours(0, i) }}</strong>
              </div>
            </div>
            <div class="col-lg-2" @click="selectHour(1, i)">
              <div class="box-hour-avail">
                <img
                  v-if="gethours(1, i) === '-'"
                  :src="require('@/assets/images/svg/Lock.svg')"
                  title="Horário Indisponível"
                />
                <strong v-else>{{ gethours(1, i) }}</strong>
              </div>
            </div>
            <div class="col-lg-2" @click="selectHour(2, i)">
              <div class="box-hour-avail">
                <img
                  v-if="gethours(2, i) === '-'"
                  :src="require('@/assets/images/svg/Lock.svg')"
                  title="Horário Indisponível"
                />
                <strong v-else>{{ gethours(2, i) }}</strong>
              </div>
            </div>
            <div class="col-lg-2" @click="selectHour(3, i)">
              <div class="box-hour-avail">
                <img
                  v-if="gethours(3, i) === '-'"
                  :src="require('@/assets/images/svg/Lock.svg')"
                  title="Horário Indisponível"
                />
                <strong v-else>{{ gethours(3, i) }}</strong>
              </div>
            </div>
            <div class="col-2" />
          </div>
        </div>
      </div>

      <!-- MOBILE -->
      <div class="d-block d-lg-none">
        <!-- SEMANAS -->
        <div class="row">
          <div class="col-2 cursor-pointer">
            <feather-icon
              icon="ArrowLeftCircleIcon"
              class="ml-2"
              size="40"
              @click="previushoursMobile"
            />
          </div>
          <div class="col-7">
            <small style="font-size: 20px" class="d-block">{{
              dates[0].ds_week
            }}</small>
            <strong style="font-size: 16px">{{ dates[0].ds_date }}</strong>
          </div>
          <div class="col-2 cursor-pointer mr-1">
            <feather-icon
              icon="ArrowRightCircleIcon"
              size="40"
              @click="nexthoursMobile"
            />
          </div>
        </div>

        <!--HORARIOS -->
        <div class="display-hours-details">
          <div class="row mt-1" style="margin-left: 0px; margin-right: 0px">
            <div class="col-6" v-for="(item, i) in qtdDisplayDates" :key="i">
              <div class="box-hour-avail" @click="selectHour(0, i)">
                <img
                  v-if="gethours(0, i) === '-'"
                  :src="require('@/assets/images/svg/Lock.svg')"
                  title="Horário Indisponível"
                />
                <strong v-else>{{ gethours(0, i) }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    dates: null,
    contents: null,
    qtdDisplayDates: 0,
    provider: null,
  },
  data() {
    return {
      horasp: null,
    };
  },
  created() {
    this.getfuso();
  },
  methods: {
    getfuso() {
      setInterval(() => {
        this.horasp = this.$utils.getFusoHorarioSP();
      }, 1000);
    },

    getformathour(_date) {
      return `${_date.substr(8, 2)}/${_date.substr(5, 2)}/${_date.substr(
        0,
        4
      )}`;
    },

    previushours() {
      this.$emit("previushours");
    },
    previushoursMobile() {
      this.$emit("previushoursMobile");
    },
    nexthours() {
      this.$emit("nexthours");
    },
    nexthoursMobile() {
      this.$emit("nexthoursMobile");
    },
    gethours(_position, _index) {
      if (this.dates[_position].hours.length > _index) {
        return this.dates[_position].hours[_index].hour.substring(0, 5);
      }
      return "-";
    },
    selectHour(_position, _index) {
      const _hour = this.gethours(_position, _index);
      const _date = this.dates[_position].date;

      if (_hour !== "-") {
        const payload = {
          provider_id: this.provider.id,
          provider: this.provider,
          hour: `${_hour}:00`,
          date: _date,
          ds_date: this.dates[_position].ds_date,
          auth: false,
        };
        const _dateformat = this.getformathour(_date);

        this.$swal({
          title: `Sua consulta será para ${_dateformat} as ${_hour}h`,
          text: "FUSO Horário de São Paulo",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sim, Quero Continuar!",
          cancelButtonText: "Cancelar",
          customClass: {
            confirmButton: "btn btn-info",
            cancelButton: "btn btn-outline-danger ml-1",
          },
          buttonsStyling: false,
        }).then((result) => {
          if (result.value) {
            this.$emit("confirmSelected", payload);
          }
        });
      }
    },
  },
};
</script>

<style>
.fuso-required {
  border-radius: 4px;
  color: var(--dark);
}

#box-hours {
  max-width: 600px;
  height: 409px;
}

.box-hour-avail {
  background: #e1e6ec;
  margin-bottom: 10px;
  border-radius: 2px;
  padding: 10px;
}
.box-hour-avail:hover {
  cursor: pointer;
  background: #b8c2cc;
}

.display-hours-details {
  overflow-y: auto;
  overflow-x: hidden;
  height: 220px;
}
</style>