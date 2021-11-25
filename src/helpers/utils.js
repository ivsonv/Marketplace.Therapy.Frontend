let _vm = null
import { masked } from './masked'
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
export default {
    masked,
    isEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    },
    isCpf(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf == '') return false;
        // Elimina CPFs invalidos conhecidos	
        if (cpf.length != 11 ||
            cpf == "00000000000" ||
            cpf == "11111111111" ||
            cpf == "22222222222" ||
            cpf == "33333333333" ||
            cpf == "44444444444" ||
            cpf == "55555555555" ||
            cpf == "66666666666" ||
            cpf == "77777777777" ||
            cpf == "88888888888" ||
            cpf == "99999999999")
            return false;
        // Valida 1o digito	
        let add = 0;
        for (let i = 0; i < 9; i++)
            add += parseInt(cpf.charAt(i)) * (10 - i);
        let rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(cpf.charAt(9)))
            return false;
        // Valida 2o digito	
        add = 0;
        for (let i = 0; i < 10; i++)
            add += parseInt(cpf.charAt(i)) * (11 - i);
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(cpf.charAt(10)))
            return false;
        return true;
    },
    isPermited(_permission) {
        return this.getRoles().some(s => s === _permission)
    },
    getNavMenus() {
        return JSON.parse(localStorage.getItem("userData")).navMenus;
    },
    getRoles() {
        return JSON.parse(localStorage.getItem("userData")).roles;
    },
    populardrp(_list, _texto, _valor) {
        return _list.map((m) => {
            return {
                label: m[_texto],
                value: m[_valor],
            };
        })
    },
    populardropdown(_list, _texto, _valor, btodos, bnenhum) {
        const retorno = [];
        if (btodos) {
            retorno.push({ label: "Todos", value: "-1" });
        }
        if (bnenhum) {
            retorno.push({ label: "Nenhum", value: "-2" });
        }

        retorno.push(
            ..._list.map((m) => {
                return {
                    label: m[_texto],
                    value: m[_valor],
                };
            })
        );
        return retorno;
    },
    pagination(lst, _size, paginationDefault = 20) {
        if (lst && lst.length >= _size) {
            return paginationDefault
        }
        else
            return 0;
    },
    getValueSelected(_vl) {
        return _vl.value !== "-3" ? _vl.value : null;
    },
    formatToNumber(number) {
        return parseInt(number)
    },
    getFusoHorarioSP() {
        const options = {
            timeZone: "America/Sao_Paulo",
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
        };
        const date = new Intl.DateTimeFormat([], options);
        return date.format(new Date());
    },
    toast(title, msg) {
        this._toast({
            title,
            msg
        });
    },
    toastError(title, msg) {
        this._toast({
            variant: 'danger',
            icon: "BellIcon",
            title,
            msg,
        });
    },
    _toast(payload) {
        _vm.$toast({
            component: ToastificationContent,
            props: {
                title: payload.title || "Notificação",
                icon: payload.icon || "CheckIcon",
                text: payload.msg || "Sucesso",
                variant: payload.variant || "success",
            },
        }, { position: payload.position || "top-center" });
    },
    getStates() {
        return [{ value: "AC", label: "Acre - AC" },
        { value: "AL", label: "Alagoas - AL" },
        { value: "AP", label: "Amapá - AP" },
        { value: "AM", label: "Amazonas - AM" },
        { value: "BA", label: "Bahia - BA" },
        { value: "CE", label: "Ceará - CE" },
        { value: "DF", label: "Distrito Federal - DF" },
        { value: "ES", label: "Espírito Santo - ES" },
        { value: "GO", label: "Goiás - GO" },
        { value: "MA", label: "Maranhão - MA" },
        { value: "MT", label: "Mato Grosso - MT" },
        { value: "MS", label: "Mato Grosso do Sul - MS" },
        { value: "MG", label: "Minas Gerais - MG" },
        { value: "PA", label: "Pará - PA" },
        { value: "PB", label: "Paraíba - PB" },
        { value: "PR", label: "Paraná - PR" },
        { value: "PE", label: "Pernambuco - PE" },
        { value: "PI", label: "Piauí - PI" },
        { value: "RJ", label: "Rio de Janeiro - RJ" },
        { value: "RN", label: "Rio Grande do Norte - RN" },
        { value: "RS", label: "Rio Grande do Sul - RS" },
        { value: "RO", label: "Rondônia - RO" },
        { value: "RR", label: "Roraima - RR" },
        { value: "SC", label: "Santa Catarina - SC" },
        { value: "SP", label: "São Paulo - SP" },
        { value: "SE", label: "Sergipe - SE" },
        { value: "TO", label: "Tocantins - TO" }];
    },
    clearExcel(str) {
        str = this.removeAccents(str).toLowerCase().trim();
        str = str.replace(".", "").replace(".", "").replace(".", "").replace(".", "").replace(".", "").replace(".", "").replace(".", "");
        str = str.replace("/", "").replace("/", "").replace("/", "").replace("/", "").replace("/", "").replace("/", "").replace("/", "");
        str = str.replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_").replace(" ", "_");
        return str;
    },
    isPhone(str) {
        return str.includes('phone') || str.includes('telefone') || str.includes('fone');

    },
    removeAccents(str) {
        return str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : str
    },
    formatCurrencyToBR(number) {
        return parseFloat(number).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            style: 'currency',
            currency: 'BRL'
        });
    },
    formatCurrencyToDouble(number) {
        let num = this.formatCurrencyToBR(number);
        num = num.replace("R$", "")
        num = num.replace(".", "")
        num = num.replace(",", ".")
        return parseFloat(num.trim())
    },
    getGuidId() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    },
    install(Vue, config) {
        _vm = config.vm
        Vue.prototype.$utils = this
    },
    vue() {
        return _vm
    },
}