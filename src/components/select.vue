<template>
  <v-select :multiple="multiple" :options="options" autocomplete="off" />
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: false,
    },
    optionSelected: {
      type: Object,
      required: false,
    },
    multiple: {
      type: Boolean,
      required: false,
    },
  },
  methods: {
    // onclick() {
    //   this.$emit("clicked");
    // },
  },
};
</script>