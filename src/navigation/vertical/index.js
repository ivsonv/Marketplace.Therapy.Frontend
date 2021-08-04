import registrations from './registrations'
import pedagogic from './pedagogic'
import audiovisual from './audiovisual'
import uptos3 from './uptos3'
import hangfire from './hangfire'
import backoffice from './backoffice'
import reports from './reports'
import attendance from './attendance'
export default [...registrations, ...pedagogic, ...audiovisual, ...reports, ...attendance, ...uptos3, ...backoffice, ...hangfire]
