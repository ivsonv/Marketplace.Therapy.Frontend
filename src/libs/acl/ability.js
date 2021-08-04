import { Ability } from '@casl/ability'
import { initialAbility } from './config'

// const userData = JSON.parse(localStorage.getItem('userData'))
// const existingAbility = userData ? userData.ability : null

export default new Ability(initialAbility)
