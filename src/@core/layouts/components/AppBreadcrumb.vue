<template>
  <b-row
    v-if="$route.meta.breadcrumb || $route.meta.pageTitle"
    class="content-header"
  >
    <b-col class="content-header-left mb-2" cols="12" md="9">
      <b-row class="breadcrumbs-top">
        <b-col cols="12">
          <h2
            class="content-header-title float-left pr-1 mb-0"
            v-if="$route.meta.pageTitle"
          >
            {{ $route.meta.pageTitle }}
          </h2>
          <div class="breadcrumb-wrapper">
            <b-breadcrumb>
              <!-- <b-breadcrumb-item @click="$router.go(-1)">
                <feather-icon
                  icon="HomeIcon"
                  size="16"
                  class="align-text-top"
                />
              </b-breadcrumb-item> -->
              <b-breadcrumb-item
                v-for="item in $route.meta.breadcrumb"
                :key="item.text"
                :active="item.active"
                @click="breadgo(item)"
              >
                {{ item.text }}
              </b-breadcrumb-item>
            </b-breadcrumb>
          </div>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import {
  BBreadcrumb,
  BBreadcrumbItem,
  BRow,
  BCol,
  BDropdown,
  BDropdownItem,
  BButton,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";

export default {
  directives: {
    Ripple,
  },
  components: {
    BBreadcrumb,
    BBreadcrumbItem,
    BRow,
    BCol,
    BDropdown,
    BDropdownItem,
    BButton,
  },
  methods: {
    breadgo(item) {
      if (item.tab) {
        let path = this.$router.options.routes.filter(
          (f) => f.name == item.tab.origin_name
        );
        if (path && path.length > 0) {
          let object_path = path[0];
          let name_path = object_path.path;
          let split_name = name_path.split("/");
          split_name.forEach((element) => {
            if (element.includes(":")) {
              item.tab.replace_params.forEach((ele_tab) => {
                if (ele_tab.for == element) {
                  let params = this.$route.params[ele_tab.in.replace(":", "")];
                  if (params) {
                    name_path = name_path.replace(ele_tab.for, params);
                  }
                }
              });
            }
          });
          let paths = `${name_path}/tab/${item.tab.name}`;
          this.$router.push({ path: paths });
        }
      } else if (item.back) {
        this.$router.go(item.backto);
      } else if (item.to) {
        this.$router.push({ path: item.to });
      }
    },
  },
};
</script>
