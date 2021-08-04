<template>
  <div>
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
    <b-card>
      <b-row class="mb-1 mb-sm-0">
        <b-col md="8">
          <button--c
            :variant="'gradient-info'"
            :iconsize="'20'"
            :icon="null"
            :permission="'permission.events.create'"
            :title="'Cadastrar Evento'"
            @clicked="onClickSave(null)"
            class="mb-2"
          />
        </b-col>
        <b-col md="4">
          <b-input-group>
            <b-form-input
              placeholder="pesquise por Nome"
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
      <b-overlay
        :show="isloading"
        spinner-variant="primary"
        spinner-type="grow"
      >
        <b-table
          :items="list"
          :fields="fields"
          :busy="isloading"
          id="table-events"
          responsive
          hover
        >
          <template #cell(color)="data">
            <b-badge pill :style="`background: ${data.value}`">
              {{ data.value }}
            </b-badge>
          </template>
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
                  :icon="data.item.sync_calendar ? 'CheckIcon' : 'XIcon'"
                  @click="onClickCalendar(data.item)"
                  size="16"
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
                v-if="!data.item.subevents"
                :id="`warning-event-row-${data.item.id}`"
                icon="AlertTriangleIcon"
                size="16"
                class="mx-1"
              />
              <b-tooltip
                v-if="!data.item.subevents"
                triggers="hover"
                :target="`warning-event-row-${data.item.id}`"
                title="Esse evento não tem nenhum sub evento"
                :delay="{ show: 100, hide: 50 }"
              />

              <feather-icon
                :id="`details-event-row-${data.item.id}`"
                icon="TrelloIcon"
                size="16"
                class="mx-1"
                @click="onClickDetails(data.item)"
              />
              <feather-icon
                :id="`edit-event-row-${data.item.id}`"
                icon="EditIcon"
                size="16"
                class="mx-1"
                @click="onClickSave(data.item)"
              />
              <feather-icon
                :id="`cancel-event-row-${data.item.id}`"
                v-if="data.item.canCancel"
                icon="XCircleIcon"
                size="16"
                class="mx-1"
                v-b-modal.modal-cancelar
                @click="onClickConfirmCancel(data.item)"
              />

              <feather-icon
                :id="`rescheduling-events-row-${data.item.id}`"
                v-if="data.item.can_rescheduling"
                icon="CalendarIcon"
                size="16"
                class="mx-1"
                @click="onClickRescheduling(data.item)"
              />
              <b-tooltip
                v-if="data.item.can_rescheduling && data.index > 0"
                title="Reagendar"
                :target="`rescheduling-events-row-${data.item.id}`"
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
      <!-- DETALHES DO EVENTO -->
      <b-sidebar
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
            <h5 v-if="dto.id" class="mb-0">Editar Evento</h5>
            <h5 v-else class="mb-0">Cadastrar Evento</h5>
            <div>
              <feather-icon
                class="ml-1 cursor-pointer"
                icon="XIcon"
                size="16"
                @click="hide"
              />
            </div>
          </div>
          <project-event-form @result="onResult" :dto="dto" />
        </template>
      </b-sidebar>
    </b-card>
  </div>
</template>

<script>
import { BModal, VBModal } from "bootstrap-vue";
import { VBToggle } from "bootstrap-vue";
import _eventService from "@/services/event-service";
import _externalDataBaseService from "@/services/external-database-service";
import project_event from "./project-event";
import _reasonService from "@/services/reason-service";

export default {
  components: {
    "project-event-form": project_event,
    BModal,
    VBModal,
  },
  directives: {
    "b-toggle": VBToggle,
  },
  data() {
    return {
      more: false,
      debounceMilliseconds: 300,
      isloading: false,
      isloadingBackoffice: false,
      currentePage: 1,
      search: "",
      size: 12,
      fields: [
        { key: "name", label: "Nome" },
        { key: "project", label: "Projeto" },
        { key: "scheduled", label: "Agendado" },
        { key: "sync_calendar", label: "Sinc. Calendar" },
        { key: "sync_youtube", label: "Sinc. Youtube" },
        { key: "sync_jira", label: "Jira" },
        { key: "actions", label: "Ações" },
      ],
      urlImage: `${require("@/assets/images/pages/sem-foto.png")}`,
      list: [],
      isSave: false,
      dto: null,
      timeout: null,
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
      _eventService
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
    onClickDetails(record, _) {
      this.$router.push({
        path: `/pedagogic/project-view/${this.$route.params.id}/event/${record.id}`,
      });
    },
    onClickSave(_record) {
      this.dto = {
        id: _record ? _record.id : 0,
        project_id: _record ? _record.project_id : this.$route.params.id,
      };
      this.isSave = true;
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
      if (_record.google_calendar_id) {
        var a = document.createElement("a");
        a.target = "_blank";
        a.href = `${_record.google_event_url}`;
        a.click();
      }
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
      _eventService
        .cancelWithReason(payload)
        .then((res) => {
          if (res.content) {
            this.$utils.toast("Cancelamento", "Sucesso ao cancelar.");
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => ((this.isloading = false), this.onResult()));
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
#table-events thead th {
  text-align: center !important;
}

#table-events tbody tr {
  text-align: center !important;
}
</style>