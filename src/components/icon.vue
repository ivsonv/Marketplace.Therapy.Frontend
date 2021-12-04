<template>
  <feather-icon :icon="InfoIcon" :size="size" />
</template>

<script>
export default {
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
  },
};
</script>