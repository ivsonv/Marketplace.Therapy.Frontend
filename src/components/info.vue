<template>
  <div>
    <feather-icon :id="id" :icon="icon" :size="size" />
    <b-tooltip
      :triggers="triggers"
      :target="id"
      :title="title"
      :delay="{ show: 100, hide: 50 }"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$utils.getGuidId(),
    };
  },
  props: {
    icon: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: false,
      default: "20",
    },
    triggers: {
      type: String,
      required: false,
      default: "hover",
    },
    title: {
      type: String,
      required: false,
    },
  },
};
</script>