<template>
  <b-overlay :show="isloading" spinner-variant="primary" spinner-type="grow">
    <b-row v-if="record">
      <b-col
        cols="12"
        xl="5"
        class="d-flex justify-content-between flex-column"
      >
        <div class="d-flex justify-content-start">
          <b-img
            rounded="right"
            alt="Right-rounded image"
            class="img-fluid rounded-shadow"
            id="thumbnail-youtube"
            :src="urlImage"
          />

          <div class="d-flex flex-column ml-1">
            <div class="mb-1">
              <h4 class="mb-0">
                {{ record.name }}
              </h4>
              <span class="card-text">Id: {{ record.id }}</span>
            </div>
            <div class="d-flex flex-wrap">
              <b-button variant="primary" @click="onClickEdit()">
                Detalhes
              </b-button>
              <button--c
                :variant="'outline-danger'"
                :iconsize="'20'"
                :icon="null"
                :permission="'permission.project.delete'"
                :title="'Deletar'"
                @clicked="confirmDelete()"
                class="ml-1"
              />
              <b-button
                class="ml-1"
                variant="warning"
                title="URL Pública"
                @click="openPublicUrl()"
              >
                <feather-icon icon="Share2Icon" />
              </b-button>
            </div>
          </div>
        </div>

        <!-- User Stats -->
        <div class="d-flex align-items-center mt-2">
          <b-col cols="12" xl="12">
            <div class="d-flex align-items-center mr-2">
              <b-avatar variant="light-warning" rounded>
                <feather-icon icon="YoutubeIcon" size="18" />
              </b-avatar>
              <div class="ml-1">
                <h5 class="mb-0">Youtube Descrição</h5>
                <b-card-text v-html="record.youtube_description">
                  {{ record.youtube_description }}
                </b-card-text>
              </div>
            </div>
          </b-col>
          <b-col cols="12" xl="12">
            <div class="d-flex align-items-center">
              <b-avatar variant="light-info" rounded>
                <feather-icon icon="CalendarIcon" size="18" />
              </b-avatar>
              <div class="ml-1">
                <h5 class="mb-0">Descrição Rodapé Google Calendar</h5>
                <b-card-text v-html="record.calendar_description_footer">
                  {{ record.calendar_description_footer }}
                </b-card-text>
              </div>
            </div>
          </b-col>
        </div>
      </b-col>

      <!-- Right Col: Table -->
      <b-col cols="12" xl="7">
        <table class="mt-1 mt-xl-0 w-100">
          <tr>
            <th class="pb-50">
              <feather-icon icon="CalendarIcon" class="mr-75" />
              <span class="font-weight-bold">Primeira Aula</span>
            </th>
            <td class="pb-50">
              {{ record.first_class_date }}
            </td>
          </tr>
          <tr>
            <th class="pb-50">
              <feather-icon icon="ClockIcon" class="mr-75" />
              <span class="font-weight-bold">Duração</span>
            </th>
            <td class="pb-50 text-capitalize">
              {{ record.lesson_duration }}
            </td>
          </tr>
          <tr>
            <th class="pb-50">
              <feather-icon icon="InboxIcon" class="mr-75" />
              <span class="font-weight-bold">Calendar ID</span>
            </th>
            <td class="pb-50 text-capitalize">
              {{ record.google_calendar_id }}
            </td>
          </tr>
          <tr>
            <th class="pb-50">
              <feather-icon icon="FlagIcon" class="mr-75" />
              <span class="font-weight-bold">Jira ID</span>
            </th>
            <td class="pb-50">
              {{ record.jira_project_id }}
            </td>
          </tr>
        </table>
      </b-col>
    </b-row>
  </b-overlay>
</template>

<script>
import { BCard, BButton, BAvatar, BRow, BCol, BImg } from "bootstrap-vue";
import _projectsService from "@/services/projects-service";

export default {
  components: {
    BCard,
    BButton,
    BRow,
    BCol,
    BAvatar,
    BImg,
  },
  data() {
    return {
      record: null,
      urlImage: `${require("@/assets/images/pages/sem-foto.png")}`,
      mainProps: {
        blank: true,
        blankColor: "#777",
        width: 75,
        height: 75,
        class: "m1",
      },
    };
  },
  created() {
    this.getRecord();
  },
  methods: {
    getRecord() {
      if (this.$route.params.id > 0) {
        this.isloading = true;
        _projectsService
          .find(this.$route.params.id)
          .then((res) => {
            this.record = res.content;
            this.isloading = false;

            if (this.record.youtube_image) {
              this.urlImage = `${res.pathimage}/${this.record.youtube_image}`;
            }
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.isloading = false));
      }
    },
    onClickEdit() {
      this.$router.push({
        path: `/pedagogic/project/${this.record.id}`,
      });
    },
    confirmDelete() {
      this.$swal({
        title: "Tem certeza?",
        text: "Isso não pode ser revertido!",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Sim, quero excluir!",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-info",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.excluir();
        }
      });
    },
    openPublicUrl() {
      let url = `${process.env.VUE_APP_CALENDAR_PUBLIC_URL.replace(
        "{0}",
        this.record.google_calendar_id
      )}`;

      const el = document.createElement("textarea");
      el.value = url;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      const selected =
        document.getSelection().rangeCount > 0
          ? document.getSelection().getRangeAt(0)
          : false;
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
      }

      var a = document.createElement("a");
      a.target = "_blank";
      a.href = url;
      a.click();
    },
    excluir() {
      this.isloading = true;
      _projectsService
        .delete(this.record.id)
        .then(() => {
          this.$utils.toast("Notificação", "Excluido com sucesso.");
          this.$router.go(-1);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
  },
};
</script>

<style>
#thumbnail-youtube {
  border: 1px solid #999;
  height: 100px;
  border-radius: 10%;
}
</style>
