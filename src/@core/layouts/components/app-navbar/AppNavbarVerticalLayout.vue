<template>
  <div class="navbar-container d-flex content align-items-center">
    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link class="nav-link" @click="toggleVerticalMenuActive">
          <feather-icon icon="MenuIcon" size="21" />
        </b-link>
      </li>
    </ul>

    <div
      class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex"
    >
      <bookmarks />
    </div>

    <b-navbar-nav class="nav align-items-center ml-auto">
      <appointment />
      <dark-Toggler class="d-none d-lg-block" />
      <!-- <notification-dropdown /> -->
      <user-dropdown />
    </b-navbar-nav>
  </div>
</template>

<script>
import { BLink, BNavbarNav } from "bootstrap-vue";
import Bookmarks from "./components/Bookmarks.vue";
import DarkToggler from "./components/DarkToggler.vue";
import NotificationDropdown from "./components/NotificationDropdown.vue";
import UserDropdown from "./components/UserDropdown.vue";
import appointment from "./components/Appointment";

export default {
  components: {
    BLink,
    BNavbarNav,
    Bookmarks,
    DarkToggler,
    NotificationDropdown,
    UserDropdown,
    appointment,
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
};
</script>