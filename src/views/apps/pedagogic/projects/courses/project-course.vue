<template>
  <b-overlay :show="isloading" spinner-variant="primary" spinner-type="grow">
    <b-modal ref="modal-discipline" hide-footer title="Criar Disciplina">
      <b-overlay
        :show="isloadingModal"
        spinner-variant="primary"
        spinner-type="grow"
      >
        <validation-observer ref="disciplineNewRules">
          <b-form class="p-2" @submit.prevent v-if="disciplineNew">
            <b-form-group label="Nome">
              <validation-provider
                #default="{ errors }"
                name="Nome"
                rules="required"
              >
                <b-form-input
                  v-model="disciplineNew.name"
                  placeholder="Nome"
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

    <b-modal size="lg" ref="modal-teacher" hide-footer title="Criar Professor">
      <b-overlay
        :show="isloadingModal"
        spinner-variant="primary"
        spinner-type="grow"
      >
        <b-form-group label="Localidade">
          <v-select
            v-if="states.length > 0"
            v-model="stateSelected"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :options="states"
            autocomplete="off"
            :clearable="false"
          />
        </b-form-group>
        <b-form-group label="Nome">
          <b-form-input
            v-model="teacherNew.name"
            placeholder="Nome Professor"
            autocomplete="off"
          />
        </b-form-group>
        <b-form-group label="E-mail">
          <b-form-input
            v-model="teacherNew.email"
            placeholder="Email do Professor"
            type="email"
            autocomplete="off"
          />
        </b-form-group>
        <div class="d-block text-center">
          <b-button
            variant="info"
            class="mr-1"
            @click="validationFormTeacherModal()"
          >
            Salvar
          </b-button>
          <b-button
            variant="gradient-danger"
            class="mr-1"
            @click="closeTeacherModal()"
          >
            Cancelar
          </b-button>
        </div>
      </b-overlay>
    </b-modal>

    <!-- Form -->
    <validation-observer ref="courseRules">
      <b-form class="p-2" @submit.prevent v-if="record">
        <b-form-group label="Nome *">
          <validation-provider
            #default="{ errors }"
            name="Nome do curso"
            rules="required"
          >
            <b-form-input v-model="record.name" placeholder="Nome" />
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>
        <b-row class="d-flex align-items-center" v-if="record.canChange">
          <b-col cols="10" sm="11">
            <b-form-group label="Disciplina *">
              <validation-provider
                #default="{ errors }"
                name="Disciplina"
                rules="required"
              >
                <vue-autosuggest
                  v-model="queryDiscipline"
                  :suggestions="disciplines"
                  :input-props="inputDisciplineProps"
                  :section-configs="disciplineConfigs"
                  @input="getDisciplines"
                  :loading="isloadingAutocomplete"
                  disabled
                >
                  <template slot-scope="{ suggestion }">
                    {{ suggestion.item.name }}
                  </template>
                </vue-autosuggest>
                <small class="text-danger position-absolute">{{
                  errors[0]
                }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col cols="2" sm="1">
            <b-button
              variant="info"
              class="btn-icon mt-1"
              @click="openModal()"
              style="float: right"
            >
              <feather-icon icon="PlusIcon" />
            </b-button>
          </b-col>
        </b-row>
        <b-row class="d-flex align-items-center" v-else>
          <b-col cols="12" sm="12">
            <b-form-group label="Disciplina *">
              <b-form-input v-model="disciplineSelected.name" disabled />
            </b-form-group>
          </b-col>
        </b-row>

        <!-- TEACHER -->
        <b-row class="d-flex align-items-center" v-if="record.canChange">
          <b-col cols="10" sm="11">
            <b-form-group label="Professor *">
              <vue-autosuggest
                v-model="queryTeacher"
                :suggestions="teachers"
                :input-props="inputTeacherProps"
                :section-configs="teacherConfigs"
                :loading="isloadingAutocomplete"
                @input="getTeachers"
              >
                <template slot-scope="{ suggestion }">
                  <h5 class="text-capitalize">{{ suggestion.item.name }}</h5>
                  <small v-if="suggestion.item.email">
                    {{ suggestion.item.email }}
                  </small>
                </template>
              </vue-autosuggest>
            </b-form-group>
          </b-col>
          <b-col cols="2" sm="1" v-if="record.canChange">
            <button--c
              style="float: right"
              :variant="'info'"
              :iconsize="'14'"
              :icon="'PlusIcon'"
              :permission="'permission.teacher.create'"
              :title="''"
              @clicked="openTeacherModal()"
              class="btn-icon mt-1"
            />
          </b-col>

          <b-col cols="11" class="mb-2">
            <b-badge
              v-for="(tt, index) in teachersSelected"
              @click="removeTeacher(tt)"
              class="mr-1 mb-1 cursor-pointer"
              :key="index"
            >
              {{ tt.name }}
              <feather-icon icon="XIcon" />
            </b-badge>
          </b-col>
        </b-row>
        <b-row class="d-flex align-items-center" v-else>
          <b-col cols="12">
            <strong v-if="teachersSelected.length > 1">Professores</strong>
            <strong v-else>Professor</strong>
            <hr />
          </b-col>
          <b-col cols="12" class="mb-1">
            <b-badge
              v-for="(tt, index) in teachersSelected"
              class="mr-1 mb-1 cursor-pointer"
              :key="index"
            >
              {{ tt.name }}
            </b-badge>
          </b-col>
        </b-row>

        <b-row>
          <b-col cols="6">
            <b-form-group label="Duração *">
              <validation-provider
                #default="{ errors }"
                name="Duração"
                rules="required"
              >
                <flat-pickr
                  v-model="record.duration"
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
          </b-col>
          <b-col cols="6">
            <b-form-group label="Número de Aulas *" class="fluid">
              <validation-provider
                #default="{ errors }"
                name="Número de Aulas"
                rules="required"
              >
                <b-form-spinbutton
                  id="sb-inline"
                  min="1"
                  v-model="record.lesson_number"
                  inline
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group label="Imagem">
          <div class="form-label-group">
            <img
              @click="$refs.fileInput.click()"
              :src="urlImage"
              id="thumbnail-youtube"
              class="img-fluid rounded-shadow cursor-pointer"
            />
            <input
              style="display: none"
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="onFileChange"
            />
          </div>
        </b-form-group>
        <button--c
          :variant="'info'"
          :iconsize="'20'"
          :icon="null"
          :permission="
            record.id > 0 ? 'permission.course.edit' : 'permission.course.create'
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
          :permission="'permission.course.delete'"
          :title="'Excluir'"
          @clicked="confirmDelete()"
          class="mr-1"
        />
      </b-form>
    </validation-observer>
  </b-overlay>
</template>
<script>
import _coursesService from "@/services/courses-service";
import _disciplineService from "@/services/discipline-service";
import _teachersService from "@/services/teachers-service";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import pt_br from "vee-validate/dist/locale/pt_BR.json";
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
      debounceMilliseconds: 300,
      timeout: null,
      isloading: false,
      isloadingAutocomplete: false,
      isloadingModal: false,
      record: {},
      stateSelected: null,
      states: [],
      inputDisciplineProps: {
        id: "autodisciplines__input_ajax",
        placeholder: "Digite o nome da Disciplina",
        class: "form-control",
        name: "ajax",
      },
      inputTeacherProps: {
        id: "autodisciplines__input_ajax",
        placeholder: "Digite o nome do Professor",
        class: "form-control",
        name: "ajax",
      },
      queryDiscipline: "",
      disciplines: [],
      disciplineSelected: null,
      disciplineConfigs: {
        disciplines: {
          limit: 20,
          label: "Disciplina",
          onSelected: (selected) => {
            this.disciplineSelected = selected.item;
          },
        },
      },
      queryTeacher: "",
      teachers: [],
      teacherConfigs: {
        teachers: {
          limit: 20,
          label: "Professor",
          onSelected: (selected) => {
            if (!this.teachersSelected.some((s) => s.id === selected.item.id)) {
              this.teachersSelected.push({
                name: selected.item.name,
                id: selected.item.id,
              });
              this.queryTeacher = "";
            } else {
              this.$utils.toastError("OPS!!!", "Professor já adicionado.");
            }
          },
        },
      },
      selectedFile: null,
      urlImage: `${require("@/assets/images/pages/sem-foto.png")}`,
      disciplineNew: {
        id: 0,
        name: "",
      },
      teacherNew: {
        id: 0,
        name: "",
        email: "",
      },
      teachersSelected: [],
    };
  },
  created() {
    this.states = this.$utils.getStates();

    this.getInitials();
    this.getRecord();
    localize("pt_BR", pt_br);
  },
  methods: {
    validationForm() {
      this.$refs.courseRules.validate().then((success) => {
        if (success) {
          this.save();
        }
      });
    },
    validationFormModal() {
      this.$refs.disciplineNewRules.validate().then((success) => {
        if (success) {
          this.saveDiscipline();
        }
      });
    },
    validationFormTeacherModal() {
      this.saveTeacher();
    },
    getInitials() {
      this.record = this.dto;
      this.record.discipline_id = null;
      this.record.teacher_id = null;
      this.record.lesson_number = 1;
      this.record.image = null;
      this.record.name = null;
      this.record.canChange = true;
      this.record.duration = "";
    },
    getRecord() {
      if (this.dto.id > 0) {
        this.isloading = true;
        _coursesService
          .find(this.dto.id)
          .then((res) => {
            this.record = res.content.course;
            this.record.canChange = res.content.canChange;

            if (this.record.image) {
              this.urlImage = `${res.pathimage}/${this.record.image}`;
            }

            if (this.record.discipline) {
              this.disciplineSelected = {
                id: this.record.discipline.id,
                name: this.record.discipline.name,
              };
              this.queryDiscipline = this.disciplineSelected.name;
              this.record.discipline = null;
            }

            if (this.record.teachers) {
              this.teachersSelected = this.record.teachers.map((m) => {
                return {
                  name: m.teacher.name,
                  id: m.teacher.id,
                };
              });
            }
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.isloading = false));
      } else {
        this.isloading = true;
        _coursesService
          .duration(this.$route.params.id)
          .then((res) => {
            this.record.duration = res.content.lesson_duration + ":00";
            console.log(this.record.duration);
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.isloading = false));
      }
    },
    getDisciplines() {
      if (this.queryDiscipline && this.queryDiscipline.length >= 3) {
        this.timeout = setTimeout(() => {
          if (!this.isloadingAutocomplete) {
            this.isloadingAutocomplete = true;
            _disciplineService
              .autoComplete(this.queryDiscipline)
              .then((res) => {
                this.disciplines = [{ name: "disciplines", data: res.content }];
              })
              .catch((error) => this.$utils.toastError("Notificação", error))
              .finally(() => (this.isloadingAutocomplete = false));
          }
        }, this.debounceMilliseconds);
      }
    },
    getTeachers() {
      if (this.queryTeacher && this.queryTeacher.length >= 3) {
        this.timeout = setTimeout(() => {
          if (!this.isloadingAutocomplete) {
            this.isloadingAutocomplete = true;
            _teachersService
              .autoComplete(this.queryTeacher)
              .then((res) => {
                this.teachers = [{ name: "teachers", data: res.content }];
              })
              .catch((error) => this.$utils.toastError("Notificação", error))
              .finally(() => (this.isloadingAutocomplete = false));
          }
        }, this.debounceMilliseconds);
      }
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
      _coursesService
        .delete(this.record.id)
        .then(() => {
          this.$utils.toast("Notificação", "Excluido com sucesso.");
          this.$emit("result", "ok");
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    onFileChange(e) {
      e.preventDefault();
      this.selectedFile = e.target.files[0];
      this.urlImage = URL.createObjectURL(e.target.files[0]);
    },
    save() {
      if (this.disciplineSelected)
        this.record.discipline_id = this.disciplineSelected.id;

      debugger;
      if (this.teachersSelected && this.teachersSelected.length > 0) {
        this.record.teachers = this.teachersSelected.map((m) => {
          return {
            teacher_id: m.id,
          };
        });
      }

      // if (this.teacherSelected)
      //   this.record.teacher_id = this.teacherSelected.id;

      let payload = new FormData();

      if (this.selectedFile) {
        payload.append("thumbnail", this.selectedFile);
      }
      payload.append("dados", JSON.stringify(this.record));

      //promisse
      const _createOrUpdate =
        this.record.id <= 0
          ? _coursesService.create(payload)
          : _coursesService.update(payload);

      this.isloading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Evento salvo com sucesso.");
          this.$emit("result", { status: "ok" });
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    openModal() {
      this.disciplineNew = {
        id: 0,
        name: "",
      };
      this.$refs["modal-discipline"].show();
    },
    openTeacherModal() {
      this.teacherNew = {
        id: 0,
        name: "",
        email: "",
        uf: "",
      };
      this.$refs["modal-teacher"].show();
    },
    closeModal() {
      this.$refs["modal-discipline"].hide();
    },
    closeTeacherModal() {
      this.$refs["modal-teacher"].hide();
    },
    saveDiscipline() {
      let sError = "";
      if (!this.disciplineNew.name) {
        sError = "Necessário informar o nome!";
      }

      if (sError) {
        this.$utils.toastError("Notificação", sError);
      } else {
        this.isloadingModal = true;
        let discipline = {
          name: this.disciplineNew.name,
        };

        const payload = { data: { ...discipline } };

        const _createOrUpdate = _disciplineService.create(payload);

        _createOrUpdate
          .then((res) => {
            if (res.content && res.content.id && res.content.id > 0) {
              this.disciplines = [
                {
                  name: "disciplines",
                  data: [
                    {
                      id: 546,
                      name: this.disciplineNew.name,
                    },
                  ],
                },
              ];

              this.disciplineSelected = {
                id: res.content.id,
                name: res.content.name,
              };
              this.queryDiscipline = this.disciplineSelected.name;

              this.$refs["modal-discipline"].hide();
            }
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.isloadingModal = false));
      }
    },
    saveTeacher() {
      this.teacherNew.uf = this.$utils.getValueSelected(this.stateSelected);

      const payload = { data: { ...this.teacherNew } };

      this.loading = true;
      _teachersService
        .create(payload)
        .then((res) => {
          console.log(res);
          this.teacherSelected = {
            name: res.content.name,
            id: res.content.id,
          };
          this.closeTeacherModal();
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    removeTeacher(_tt) {
      this.teachersSelected = this.teachersSelected.filter(
        (f) => f.id !== _tt.id
      );
    },
  },
};
</script>
<style>
#thumbnail-youtube {
  border: 1px solid #999;
  width: 100px;
  height: 70px;
  border-radius: 10%;
}

#thumbnail-youtube:hover {
  opacity: 0.5;
}
</style>