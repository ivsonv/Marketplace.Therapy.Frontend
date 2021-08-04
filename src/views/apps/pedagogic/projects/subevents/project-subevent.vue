<template>
  <b-overlay :show="isloading" spinner-variant="primary" spinner-type="grow">
    <b-modal ref="modal-guest" hide-footer title="Criar Convidado">
      <b-overlay
        :show="isloadingModal"
        spinner-variant="primary"
        spinner-type="grow"
      >
        <validation-observer ref="guestsNewtRules">
          <b-form class="p-2" @submit.prevent v-if="guestsNew">
            <b-form-group label="Nome">
              <validation-provider
                #default="{ errors }"
                name="Nome"
                rules="required"
              >
                <b-form-input
                  v-model="guestsNew.name"
                  placeholder="Nome"
                  autocomplete="off"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
            <b-form-group label="E-mail">
              <validation-provider
                #default="{ errors }"
                name="E-mail"
                rules="required|email"
              >
                <b-form-input
                  v-model="guestsNew.email"
                  placeholder="E-mail"
                  autocomplete="off"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
            <b-form-group label="Telefone">
              <validation-provider
                #default="{ errors }"
                name="Telefone"
                rules="required"
              >
                <b-form-input
                  v-model="guestsNew.phone"
                  v-mask="$utils.masked.phone"
                  autocomplete="off"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
            <div class="d-block text-center">
              <b-button
                variant="info"
                class="mr-1"
                @click="validationFormModal()"
              >
                Salvar
              </b-button>
              <b-button
                variant="gradient-danger"
                class="mr-1"
                @click="closeModal()"
              >
                Cancelar
              </b-button>
            </div>
          </b-form>
        </validation-observer>
      </b-overlay>
    </b-modal>
    <validation-observer ref="subEventRules">
      <b-form class="p-2" @submit.prevent v-if="record">
        <b-form-group label="Nome *">
          <validation-provider
            #default="{ errors }"
            name="Nome"
            rules="required"
          >
            <b-form-input
              v-model="record.name"
              :disabled="appointments_active"
              placeholder="Nome"
            />
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>
        <b-form-group label="Professores *">
          <validation-provider
            #default="{ errors }"
            name="Professores"
            rules="required"
          >
            <v-select
              v-model="teachersSelected"
              :options="teachers"
              searchable
              @search="fetchTeachers"
              :loading="isloadingTeacher"
              multiple
            >
              <template v-slot:no-options="{ search, searching }">
                <template v-if="searching">
                  Pesquisando ... <em>{{ search }}</em
                  >.
                </template>
                <em style="opacity: 0.5" v-else>Digite o Nome</em>
              </template>
            </v-select>
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>
        <b-row class="d-flex align-items-center">
          <b-col cols="10" sm="11">
            <b-form-group label="Convidados">
              <v-select
                v-model="guestsSelected"
                :options="guests"
                searchable
                @search="fetchGuests"
                :loading="isloadingGuest"
                multiple
              >
                <template v-slot:no-options="{ search, searching }">
                  <template v-if="searching">
                    Pesquisando ... <em>{{ search }}</em
                    >.
                  </template>
                  <em style="opacity: 0.5" v-else>Digite o Nome</em>
                </template>
              </v-select>
            </b-form-group>
          </b-col>
          <b-col cols="2" sm="1">
            <b-button
              variant="info"
              class="btn-icon mt-1"
              @click="openModal()"
              style="float: right"
            >
              <feather-icon icon="UserPlusIcon" />
            </b-button>
          </b-col>
        </b-row>

        <b-form-group label="Duração *">
          <validation-provider
            #default="{ errors }"
            name="Duração"
            rules="required"
          >
            <flat-pickr
              v-model="record.duration"
              :disabled="appointments_active"
              placeholder="Duração"
              class="form-control"
              :config="{
                enableTime: true,
                noCalendar: true,
                dateFormat: 'H:i',
                time_24hr: true,
              }"
            />
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>
        <button--c
          :variant="'info'"
          :iconsize="'20'"
          :icon="null"
          :permission="
            record.id > 0
              ? 'permission.sub.events.edit'
              : 'permission.sub.events.create'
          "
          :title="'Salvar'"
          @clicked="validationForm()"
          class="mr-1"
        />
        <button--c
          v-if="record.id > 0"
          :variant="'gradient-danger'"
          :iconsize="'20'"
          :icon="null"
          :permission="'permission.sub.events.delete'"
          :title="'Excluir'"
          @clicked="confirmDelete()"
          class="mr-1"
        />
      </b-form>
    </validation-observer>
  </b-overlay>
</template>
<script>
import _teachersService from "@/services/teachers-service";
import _guestsService from "@/services/guests-service";
import _subeventService from "@/services/subevent-service";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import pt_br from "vee-validate/dist/locale/pt_BR.json";
import { required, email } from "@validations";

import { BModal } from "bootstrap-vue";

export default {
  props: {
    dto: {
      type: Object,
      required: true,
    },
  },
  components: {
    BModal,
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      appointments_active: false,
      debounceMilliseconds: 300,
      timeout: null,
      isloading: false,
      isloadingModal: false,
      isloadingTeacher: false,
      isloadingGuest: false,
      record: {},
      teachers: [],
      teachersSelected: null,
      guests: [],
      guestsSelected: null,
      guestsNew: {
        id: 0,
        name: "",
        phone: "",
        email: "",
      },
    };
  },
  created() {
    this.getInitials();
    this.getRecord();
    localize("pt_BR", pt_br);
  },
  methods: {
    validationForm() {
      this.$refs.subEventRules.validate().then((success) => {
        if (success) {
          this.save();
        }
      });
    },
    validationFormModal() {
      this.$refs.guestsNewtRules.validate().then((success) => {
        if (success) {
          this.saveGuest();
        }
      });
    },
    openModal() {
      this.guestsNew = {
        id: 0,
        name: "",
        phone: "",
        email: "",
      };
      this.$refs["modal-guest"].show();
    },
    closeModal() {
      this.$refs["modal-guest"].hide();
    },
    getInitials() {
      this.record = this.dto;
      this.record.duration = "";
      this.record.name = null;
    },
    getRecord() {
      if (this.dto.id > 0) {
        this.isloading = true;
        _subeventService
          .find(this.dto.id)
          .then((res) => {
            this.record = res.content;

            if (this.record.subEventsTeachers) {
              this.teachersSelected = this.record.subEventsTeachers.map((m) => {
                return {
                  label: m.teacher.name,
                  value: m.teacher.id,
                };
              });
              this.record.subEventsTeachers = null;
            }

            if (this.record.subEventGuest) {
              this.guestsSelected = this.record.subEventGuest.map((m) => {
                return {
                  label: m.guest.name,
                  value: m.guest.id,
                };
              });
              this.record.subEventGuest = null;
            }
           
            if (res.content.event.appointments != null) {
              var active = res.content.event.appointments.filter(
                (f) => f.active
              );
              this.appointments_active = active && active.length > 0 ? true : false;
            }
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.isloading = false));
      }
    },
    fetchTeachers(_search) {
      if (_search && _search.length >= 3) {
        this.timeout = setTimeout(() => {
          if (!this.isloadingTeacher) {
            this.isloadingTeacher = true;
            _teachersService
              .autoComplete(_search)
              .then((res) => {
                this.teachers = this.$utils.populardropdown(
                  res.content,
                  "name",
                  "id",
                  false,
                  false
                );
              })
              .catch((error) => this.$utils.toastError("Notificação", error))
              .finally(() => (this.isloadingTeacher = false));
          }
        }, this.debounceMilliseconds);
      }
    },
    fetchGuests(_search) {
      if (_search && _search.length >= 3) {
        this.timeout = setTimeout(() => {
          if (!this.isloadingGuest) {
            this.isloadingGuest = true;
            _guestsService
              .autoComplete(_search)
              .then((res) => {
                this.guests = this.$utils.populardropdown(
                  res.content,
                  "name",
                  "id",
                  false,
                  false
                );
              })
              .catch((error) => this.$utils.toastError("Notificação", error))
              .finally(() => (this.isloadingGuest = false));
          }
        }, this.debounceMilliseconds);
      }
    },
    save() {
      if (this.teachersSelected) {
        this.record.subEventsteachers = [];
        this.teachersSelected.forEach((_itemApo) => {
          this.record.subEventsteachers.push({
            teacher_id: _itemApo.value,
          });
        });
      }

      if (this.guestsSelected) {
        this.record.SubEventGuest = [];
        this.guestsSelected.forEach((_itemGuest) => {
          this.record.SubEventGuest.push({
            guest_id: _itemGuest.value,
          });
        });
      }

      if (this.record.duration == "") this.record.duration = "00:00:00";

      let payload = new FormData();
      payload.append("dados", JSON.stringify(this.record));

      //promisse
      const _createOrUpdate =
        this.record.id <= 0
          ? _subeventService.create(payload)
          : _subeventService.update(payload);

      this.isloading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Registro salvo com sucesso.");
          this.$emit("result", { status: "ok" });
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
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
    excluir() {
      this.isloading = true;
      _subeventService
        .delete(this.record.id)
        .then(() => {
          this.$utils.toast("Notificação", "Excluido com sucesso.");
          this.$emit("result", { status: "ok" });
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    saveGuest() {
      let sError = "";
      if (!this.guestsNew.name) {
        sError = "Necessário informar o nome!";
      } else if (!this.guestsNew.email) {
        sError = "Necessário informar o e-mail!";
      } else if (!this.guestsNew.phone) {
        sError = "Necessário informar o telefone!";
      }

      if (sError) {
        this.$utils.toastError("Notificação", sError);
      } else {
        this.isloadingModal = true;
        let guest = {
          email: this.guestsNew.email,
          name: this.guestsNew.name,
          phone: this.guestsNew.phone,
        };

        const payload = { data: { ...guest } };

        const _createOrUpdate = _guestsService.create(payload);

        _createOrUpdate
          .then((res) => {
            if (res.content && res.content.id && res.content.id > 0) {
              this.guests.push({
                label: res.content.name,
                value: res.content.id,
              });
              if (this.guestsSelected == null) {
                this.guestsSelected = [];
              }
              this.guestsSelected.push({
                label: res.content.name,
                value: res.content.id,
              });
              this.$refs["modal-guest"].hide();
            }
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.isloadingModal = false));
      }
    },
  },
};
</script>