<template>
  <b-card>
    <b-row class="mb-1 mb-sm-0">
      <b-col md="8">
        <button--c
          :variant="'gradient-info'"
          :iconsize="'20'"
          :icon="null"
          :permission="'permission.course.create'"
          :title="'Cadastrar Curso'"
          @clicked="onClickSave(null)"
          class="mb-2 mr-2"
        />
        <button--c
          :variant="notificar ? 'gradient-info' : 'outline-info'"
          :iconsize="'20'"
          :icon="null"
          :permission="'permission.notification.teacher.send'"
          :title="'Notificar Professor'"
          @clicked="notifyTeacher"
          class="mb-2"
        />
      </b-col>
      <b-col md="4">
        <b-input-group>
          <b-form-input
            placeholder="pesquise por disciplina, professor..."
            autocomplete="off"
            v-model="search"
          />
          <b-input-group-append>
            <b-button variant="gradient-info" @click="filter">
              Pesquisar
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
    <b-overlay :show="isloading" spinner-variant="primary" spinner-type="grow">
      <b-table
        :items="list"
        :fields="fields"
        :busy="isloading"
        responsive
        hover
      >
        <template #cell(rowselect)="data">
          <div class="ch-init-icon">
            <b-form-checkbox
              v-model="data.item.notifySelected"
              plain
              class="vs-checkbox-con"
              @change="notifyCheck"
              :disabled="isDisable(data.item.notification_date)"
            >
            </b-form-checkbox>
          </div>
        </template>
        <template #cell(notify)="data" style="width: 1px !important">
          <div class="text-nowrap notify-status">
            <b-avatar
              :variant="data.item.notification_date ? 'success' : 'danger'"
              :id="`scheduled-description-${data.item.id}`"
              size="25"
            >
              <feather-icon
                size="16"
                :icon="data.item.notification_date ? 'CheckIcon' : 'XIcon'"
              />
            </b-avatar>
          </div>
        </template>
        <template #cell(actions)="data">
          <div class="text-nowrap">
            <feather-icon
              :id="`details-event-row-${data.item.id}`"
              icon="TrelloIcon"
              size="16"
              class="mx-1"
              @click="onClickDetails(data.item)"
            />
            <b-tooltip
              v-if="data.index > 0"
              title="Detalhes do Curso"
              :target="`details-event-row-${data.item.id}`"
            />

            <feather-icon
              :id="`edit-event-row-${data.item.id}`"
              icon="EditIcon"
              size="16"
              class="mx-1"
              @click="onClickSave(data.item)"
            />
            <b-tooltip
              v-if="data.index > 0"
              title="Editar Curso"
              :target="`edit-event-row-${data.item.id}`"
            />
          </div>
        </template>
      </b-table>
      <hr />
      <div class="d-flex justify-content-center">
        <b-button @click="getLoadMore" variant="secondary" v-if="more" pill>
          Carregar mais
        </b-button>
      </div>
    </b-overlay>
    <b-sidebar
      ref="coursesDetailsSideBar"
      id="coursesDetailsSideBar"
      sidebar-class="sidebar-lg"
      bg-variant="white"
      v-model="isSave"
      right
      backdrop
      shadow
      no-header
    >
      <template #default="{ hide }" v-if="isSave">
        <div
          class="
            d-flex
            justify-content-between
            align-items-center
            content-sidebar-header
            px-2
            py-1
          "
        >
          <h5 v-if="dto.id" class="mb-0">Editar Curso #{{ dto.id }}</h5>
          <h5 v-else class="mb-0">Cadastrar Curso</h5>
          <div>
            <feather-icon
              class="ml-1 cursor-pointer"
              icon="XIcon"
              size="16"
              @click="hide"
            />
          </div>
        </div>
        <project-course-form @result="onResult" :dto="dto" />
      </template>
    </b-sidebar>
  </b-card>
</template>

<script>
import { VBToggle } from "bootstrap-vue";

import _coursesService from "@/services/courses-service";
import _notificationService from "@/services/notification-template-service";
import project_couse from "./project-course";

export default {
  components: {
    "project-course-form": project_couse,
  },
  directives: {
    "b-toggle": VBToggle,
  },
  data() {
    return {
      more: false,
      notificar: false,
      isloading: false,
      currentePage: 1,
      search: "",
      size: 12,
      fields: [
        { key: "rowselect", label: "" },
        { key: "teacher.name", label: "Professor" },
        { key: "discipline.name", label: "Disciplina" },
        { key: "project.name", label: "Projeto" },
        { key: "notify", label: "Notificado" },
        { key: "actions", label: "Ações" },
      ],
      urlImage: `${require("@/assets/images/pages/sem-foto.png")}`,
      list: [],
      isSave: false,
      dto: null,
      notitySelected: null,
    };
  },
  created() {
    this.getRecords(this.currentePage);
  },
  methods: {
    getRecords(_page) {
      this.isloading = true;
      _coursesService
        .show(_page, this.search, this.$route.params.id)
        .then((res) => {
          if (res.content) {
            this.more = res.content.length >= this.size;
            this.list.push(...res.content);
            this.currentePage = _page;
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    getLoadMore(_page) {
      this.getRecords(this.currentePage + 1);
    },
    filter() {
      this.currentePage = 1;
      this.list = [];
      this.getRecords(this.currentePage);
    },
    onClickSave(_record) {
      this.dto = {
        project_id: _record ? _record.project_id : this.$route.params.id,
        id: _record ? _record.id : 0,
      };
      this.isSave = true;
    },
    onClickDetails(record) {
      this.$router.push({
        path: `/pedagogic/project-view/${this.$route.params.id}/course/${record.id}`,
      });
    },
    onResult(_res) {
      this.isSave = false;
      this.dto = null;
      this.filter();
    },
    notifyTeacher() {
      if (this.notificar) {
        let count = 0;
        this.isloading = true;
        let payload = new FormData();
        let course = [];

        if (this.list && this.list.length > 0) {
          this.list.forEach((item) => {
            if (item != null) {
              if (item.notifySelected) {
                course.push({ id: item.id });
                count++;
              }
            }
          });
        }

        payload.append("dados", JSON.stringify(course));
        //promisse
        const _createOrUpdate = _notificationService.notifyTeacher(payload);

        _createOrUpdate
          .then((res) => {
            if (res.content == count) {
              let text =
                count > 1
                  ? "Professores notificados com sucesso"
                  : "Professor notificado com sucesso";
              this.$utils.toast("Notificação", text);
            } else {
              this.$utils.toastError(
                "Atenção",
                "Algumas notificações falharam."
              );
            }
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(
            () => (
              (this.isloading = false),
              (this.list = []),
              this.getRecords(this.currentePage)
            )
          );
      } else return;
    },
    notifyCheck() {
      this.notificar = false;
      if (this.list && this.list.length > 0) {
        this.list.forEach((item) => {
          if (item != null) {
            if (item.notifySelected) {
              this.notificar = true;
              return;
            }
          }
        });
      }
    },
    isDisable(notification_date) {
      return notification_date ? true : false;
    },
  },
};
</script>
<style>
.notify-status {
  margin-left: 30px;
}
</style>