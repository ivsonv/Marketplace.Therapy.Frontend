<template>
  <div class="btn-scroll-to-top" :class="{ show: y > 250 }">
    <b-button variant="primary" class="btn-icon" @click="scrollToTop">
      <feather-icon icon="ArrowUpIcon" size="16" />
    </b-button>
  </div>
</template>

<script>
import { useWindowScroll } from "@vueuse/core";
import { BButton } from "bootstrap-vue";
import Ripple from "vue-ripple-directive";

export default {
  directives: {
    Ripple,
  },
  components: {
    BButton,
  },
  setup() {
    const { y } = useWindowScroll();

    const scrollToTop = () => {
      const rootEle = document.documentElement;
      rootEle.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    return { y, scrollToTop };
  },
};
</script>

<style lang="scss" scoped>
.btn-scroll-to-top {
  position: fixed;
  bottom: 5%;
  right: 30px;
  z-index: 99;
  opacity: 0;
  transition: all 0.5s ease;

  &.show {
    opacity: 1;
  }
}
</style>
