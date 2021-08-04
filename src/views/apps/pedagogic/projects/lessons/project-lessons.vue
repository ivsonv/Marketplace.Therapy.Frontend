<template>
  <b-card>
    <b-overlay :show="isloading" spinner-variant="primary" spinner-type="grow">
      <b-modal
        id="modal-cancelar"
        cancel-variant="outline-secondary"
        ok-title="Cancelar"
        cancel-title="Fechar"
        centered
        title="Cancelar Agendamento"
        @ok="onClickCancel"
      >
        <b-form>
          <b-form-group label="Motivo *">
            <v-select
              v-model="reasonSelected"
              :options="reason"
              autocomplete="off"
              :clearable="false"
            />
          </b-form-group>
          <b-form-group label="Descrição (Opcional)">
            <b-form-textarea
              rows="7"
              v-model="reason_desc"
              placeholder="Informe uma breve descrição (opcional)"
            />
          </b-form-group>
        </b-form>
      </b-modal>

      <b-table
        :items="!isloading ? list[currentePage].itens : []"
        :fields="fields"
        :busy="isloading"
        responsive
        hover
        id="table-lessons"
      >
        <template #cell(scheduled)="data" style="width: 10px !important">
          <div class="text-nowrap">
            <b-avatar
              :variant="data.item.scheduled ? 'success' : 'danger'"
              :id="`scheduled-description-${data.item.id}`"
              size="25"
            >
              <feather-icon
                size="16"
                :icon="data.item.scheduled ? 'CheckIcon' : 'XIcon'"
              />
            </b-avatar>
            <b-tooltip
              v-if="data.item.scheduled"
              :title="data.item.scheduled_description"
              :target="`scheduled-description-${data.item.id}`"
            />
          </div>
        </template>
        <template #cell(sync_calendar)="data">
          <div class="text-nowrap">
            <b-avatar
              :variant="data.item.sync_calendar ? 'success' : 'danger'"
              size="25"
            >
              <feather-icon
                size="16"
                :icon="data.item.sync_calendar ? 'CheckIcon' : 'XIcon'"
                @click="onClickCalendar(data.item)"
              />
            </b-avatar>
          </div>
        </template>
        <template #cell(sync_youtube)="data">
          <div class="text-nowrap">
            <b-avatar
              :variant="data.item.sync_youtube ? 'success' : 'danger'"
              size="25"
            >
              <feather-icon
                size="16"
                :icon="data.item.sync_youtube ? 'CheckIcon' : 'XIcon'"
                @click="onClickYoutube(data.item)"
              />
            </b-avatar>
          </div>
        </template>
        <template #cell(sync_jira)="data">
          <div class="text-nowrap">
            <b-avatar
              :variant="data.item.sync_jira ? 'success' : 'danger'"
              size="25"
            >
              <feather-icon
                size="16"
                :icon="data.item.sync_jira ? 'CheckIcon' : 'XIcon'"
                @click="onClickJira(data.item)"
              />
            </b-avatar>
          </div>
        </template>
        <template #cell(actions)="data">
          <div class="text-nowrap">
            <feather-icon
              :id="`edit-lesson-row-${data.item.id}`"
              icon="EditIcon"
              size="16"
              class="mx-1"
              @click="onClickSave(data.item)"
            />

            <feather-icon
              :id="`rescheduling-lesson-row-${data.item.id}`"
              v-if="data.item.can_rescheduling"
              icon="CalendarIcon"
              size="16"
              class="mx-1"
              @click="onClickRescheduling(data.item)"
            />
            <b-tooltip
              v-if="data.item.can_rescheduling && data.index > 0"
              title="Reagendar"
              :target="`rescheduling-lesson-row-${data.item.id}`"
            />

            <span
              v-if="data.item.canCancel"
              @click="onClickConfirmCancel(data.item)"
              v-b-modal.modal-cancelar
              >Cancelar</span
            >
          </div>
        </template>
      </b-table>
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
          <h5 v-if="dto.id" class="mb-0">Editar Aula</h5>
          <h5 v-else class="mb-0">Cadastrar Aula</h5>
          <div>
            <feather-icon
              class="ml-1 cursor-pointer"
              icon="XIcon"
              size="16"
              @click="hide"
            />
          </div>
        </div>
        <project-lesson-form @result="onResult" :dto="dto" />
      </template>
    </b-sidebar>
  </b-card>
</template>

<script>
import { BModal, VBModal } from "bootstrap-vue";
import { VBToggle } from "bootstrap-vue";

import _lessonService from "@/services/lessons-service";
import _reasonService from "@/services/reason-service";

import _externalDataBaseService from "@/services/external-database-service";
import project_lesson from "./project-lesson";

export default {
  components: {
    "project-lesson-form": project_lesson,
    BModal,
    VBModal,
  },
  directives: {
    "b-toggle": VBToggle,
  },
  data() {
    return {
      debounceMilliseconds: 300,
      timeout: null,
      isloading: false,
      currentePage: 1,
      search: "",
      size: 12,
      rows: 20,
      fields: [
        { key: "name", label: "Nome" },
        { key: "order", label: "Aula" },
        { key: "duration", label: "Duração" },
        { key: "scheduled", label: "Agendado" },
        { key: "sync_calendar", label: "Sinc. Calendar" },
        { key: "sync_youtube", label: "Sinc. Youtube" },
        { key: "sync_jira", label: "Jira" },
        { key: "actions", label: "Ações" },
      ],
      urlImage: `${require("@/assets/images/pages/sem-foto.png")}`,
      list: [
        {
          page: 0,
          itens: [],
        },
      ],
      isSave: false,
      dto: null,
      cancelItem: null,
      reason: [],
      reasonSelected: null,
      reason_desc: "",
    };
  },
  created() {
    this.getRecords(this.currentePage);
    this.getReason();
  },
  methods: {
    getReason() {
      _reasonService
        .show()
        .then((res) => {
          this.reason = this.$utils.populardropdown(
            res.content,
            "name",
            "id",
            false,
            false
          );
        })
        .catch((error) => this.$utils.toastError("Notificação", error));
    },
    getRecords(_page) {
      this.isloading = true;
      _lessonService
        .show(this.$route.params.id)
        .then((res) => {
          if (res.content) {
            this.list.push({ page: _page, itens: res.content });
            if (res.content.length > 0) {
              this.rows += this.$utils.pagination(res.content, this.size);
              this.currentePage = _page;
            }
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    getLoadMore(_page) {
      if (!this.list.some((s) => s.page === _page)) {
        this.getRecords(_page);
      }
    },
    filter() {
      this.currentePage = 1;
      this.rows = 20;
      this.list = [{ page: 0, itens: [] }];
      this.getRecords(this.currentePage);
    },
    onClickSave(_record) {
      this.dto = {
        course_id: _record ? _record.course_id : this.$route.params.id,
        id: _record ? _record.id : 0,
      };
      this.isSave = true;
    },
    onClickConfirmCancel(_item) {
      this.cancelItem = _item;
    },
    onClickCancel() {
      if (!this.reasonSelected) {
        this.$utils.toastError("OPS!!!", "Selecione o motivo.");
        return;
      }

      const payload = {
        reason_id: this.reasonSelected.value,
        reason_desc: this.reason_desc,
        id: this.cancelItem.id,
      };

      this.isloading = true;
      _lessonService
        .cancelWithReason(payload)
        .then((res) => {
          if (res.content) {
            this.$utils.toast("Cancelamento", "Sucesso ao cancelar.");
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => ((this.isloading = false), this.onResult()));
    },
    onClickRescheduling(_item) {
      this.$router.push({
        path: `/pedagogic/appointment/${_item.appointment_id}`,
      });
    },
    onClickJira(_record) {
      this.$utils.toastError("DESCULPE!!!", "função JIRA não disponivel");
    },
    onClickYoutube(_record) {
      this.$utils.toastError("DESCULPE!!!", "função YOUTUBE não disponivel");
    },
    onClickCalendar(_record) {
      if (_record.google_event_url) {
        var a = document.createElement("a");
        a.target = "_blank";
        a.href = `${_record.google_event_url}`;
        a.click();
      }
    },
    onResult(_res) {
      this.isSave = false;
      this.dto = null;
      this.filter();
    },
  },
};
</script>
<style>
#table-lessons thead th {
  text-align: center !important;
}

#table-lessons tbody tr {
  text-align: center !important;
}
</style>