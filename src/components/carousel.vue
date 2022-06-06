<template>
  <VueSlickCarousel
    :arrows="arrows"
    :dots="dots"
    :speed="speed"
    :autoplay="autoplay"
    :infinite="infinite"
    :slidesToShow="slidesToShow"
    :slidesToScroll="slidesToScroll"
    :responsive="responsive"
  >
    <div v-for="(item, i) in list" :key="i" id="carousel-list">
      <img :title="item.title" :src="item.image" class="d-none d-md-block" />
      <img
        :title="item.title"
        :src="item.image_mobile | item.image"
        class="d-block d-md-none"
      />
    </div>
  </VueSlickCarousel>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'

export default {
  components: { VueSlickCarousel },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    responsive: {
      type: Array,
      default: () => [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: true,
          },
        },
      ],
    },
    arrows: {
      type: Boolean,
      default: true,
    },
    dots: {
      type: Boolean,
      default: true,
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    infinite: {
      type: Boolean,
      default: true,
    },
    speed: {
      type: Number,
      default: 1500,
    },
    slidesToShow: {
      type: Number,
      default: 1,
    },
    slidesToScroll: {
      type: Number,
      default: 1,
    },
  },
}
</script>
<style>
@import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css';
@import 'vue-slick-carousel/dist/vue-slick-carousel.css';

.slick-prev:before,
.slick-next:before {
  color: #333;
}

#carousel-list img {
  max-width: 1600px;
  max-height: 380px;
  object-fit: cover;
}
</style>