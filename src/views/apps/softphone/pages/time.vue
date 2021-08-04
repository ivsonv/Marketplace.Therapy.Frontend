<template>
  <p>{{ timer }}</p>
</template>

<script>
export default {
  data() {
    return {
      centesimas: 0,
      segundos: 0,
      minutos: `0` + 0,
      horas: `0` + 0,
      timer: "",
      myTimer: null,
    };
  },
  created() {
    this.cronometro();
  },
  destroyed() {
    clearInterval(this.myTimer);
  },
  methods: {
    cronometro() {
      this.myTimer = setInterval(() => {
        if (this.centesimas < 99) {
          this.centesimas++;
          if (this.centesimas < 10) {
            this.centesimas = "0" + this.centesimas;
          }
        }
        if (this.centesimas == 99) {
          this.centesimas = -1;
        }
        if (this.centesimas == 0) {
          this.segundos++;
          if (this.segundos < 10) {
            this.segundos = "0" + this.segundos;
          }
        }
        if (this.segundos == 59) {
          this.segundos = -1;
        }
        if (this.centesimas == 0 && this.segundos == 0) {
          this.minutos++;
          if (this.minutos < 10) {
            this.minutos = "0" + this.minutos;
          }
        }
        if (this.minutos == 59) {
          this.minutos = -1;
        }
        if (this.centesimas == 0 && this.segundos == 0 && this.minutos == 0) {
          this.horas++;
          if (this.horas < 10) {
            this.horas = "0" + this.horas;
          }
        }

        // format
        this.timer = `${this.horas}:${this.minutos}:${this.segundos}`;
      }, 10);
    },
  },
};
</script>