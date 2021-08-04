import softphone from './softphone'
import dialer from './dialer'
import pabx from './pabx'
import monitoring from './monitoring'

export default [{
  title: 'Atendimento',
  icon: 'SlackIcon',
  tagVariant: 'light-warning',
  main: [
    ...dialer,
    ...pabx,
    ...softphone,
    ...monitoring
  ]
}]