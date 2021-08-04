<template>
  <div>
    <div class="p-2" v-if="itens && itens.length > 0">
      <div>
        <h5 class="app-label section-label mb-1">
          <span class="align-middle">Estúdios</span>
        </h5>
        <b-form-checkbox v-model="checkAll" class="mb-1">
          Todos Estúdios
        </b-form-checkbox>
        <hr />
        <b-form-group>
          <b-form-checkbox
            v-for="item in itens"
            v-model="item.selected"
            :key="'key-studios-' + item.id"
            @change="filterCheck"
            :value="item.id"
            class="mb-1"
          >
            <span>{{ item.name }}</span>
          </b-form-checkbox>
        </b-form-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  watch: {
    checkAll() {
      this.itens.forEach((_item) => {
        if (this.checkAll) {
          _item.selected = _item.id;
        } else {
          _item.selected = false;
        }
      });

      this.$emit("filter", this.getstudios());
    },
  },
  props: {
    itens: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      checkAll: true,
    };
  },
  methods: {
    filterCheck() {
      this.$emit("filter", this.getstudios());
    },
    getstudios() {
      return this.itens.filter((f) => f.selected === f.id);
    },
  },
};
</script>