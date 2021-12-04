const defaultDelimiters = /[-!$%^&*()_+|~=`{}[\]:";'<>?,./\\ ]/
const masked = {
  money: ["#,##", "##,##", "###,##", "####,##", "#####,##", "######,##"],
  cpf: "###.###.###-##",
  cvv: "####",
  card: ["#### #### #### ####"],
  expire: "##/####",
  cnpj: "##.###.###/####-##",
  countrycode: ['+##'],
  phone: ['(##) ####-####', '(##) # ####-####'],
  cep: ['##.###-###'],
  unmask: text => {
    return text ? String(text).replace(new RegExp(defaultDelimiters, 'g'), '') : text
  }
}

export {
  masked
}
