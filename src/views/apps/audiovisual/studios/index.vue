<template>
    <b-card>
        <b-overlay :show="isloading" spinner-variant="primary" spinner-type="grow">
            <b-table
                :items="!isloading ? list[currentePage].itens : []"
                :fields="fields"
                :busy="isloading"
                responsive
                hover
                id="table-studios"
                >       
                 <template #cell(homeoffice)="data" style="width: 1px !important">
                    <div class="text-nowrap notify-status">
                        <b-avatar
                        :variant="data.item.homeoffice ? 'success' : 'danger'"
                        :id="`scheduled-description-${data.item.id}`"
                        size="25"
                        >
                        <feather-icon
                            size="16"
                            :icon="data.item.homeoffice ? 'CheckIcon' : 'XIcon'"
                        />
                        </b-avatar>
                    </div>
                </template>
                <template #cell(actions)="data">
                    <div class="text-nowrap">
                        <feather-icon
                            :id="`edit-studio-row-${data.item.id}`"
                            icon="EditIcon"
                            size="16"
                            class="mx-1"
                            @click="onClickSave(data.item)"
                        />
                        <b-tooltip
                            v-if="data.index > 0"
                            title="Editar Studio"
                            :target="`edit-studio-row-${data.item.id}`"
                        />
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
                    class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
                    >
                    <h5 class="mb-0">Editar Studio</h5>
                    <div>
                        <feather-icon
                        class="ml-1 cursor-pointer"
                        icon="XIcon"
                        size="16"
                        @click="hide"
                        />
                    </div>
                    </div>
                    <studio-form @result="onResult" :dto="dto" />
                </template>
        </b-sidebar>
    </b-card>
</template>
<script>
    import studio from "./studio";
    import _studiosService from "@/services/studios-service";
    import { VBToggle } from "bootstrap-vue";

    export default {
        components: {
            "studio-form": studio,
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
                    { key: "homeoffice", label: "Home Office" },
                    { key: "actions", label: "Ações" }
                ],
                list: [
                    {
                    page: 0,
                    itens: [],
                    },
                ],
                isSave: false,
                dto: null,
            };
        },
        created() {
            this.getRecords(this.currentePage);
        },
        methods: {
            getRecords(_page) {
                debugger;
                this.isloading = true;
                _studiosService
                    .show(this.$route.params.studiogroupid)
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
            onClickSave(_record) {
                debugger;
                this.dto = {
                    studios_group_id: _record ? _record.studios_group_id : this.$route.params.studiogroupid,
                    id: _record ? _record.id : 0,
                };
                this.isSave = true;
            },
            onResult(_res) {
                this.isSave = false;
                this.dto = null;
                this.filter();
            },
            filter() {
                this.list = [{ page: 0, itens: [] }];
                this.getRecords(this.currentePage);
            }
        }
    }
</script>