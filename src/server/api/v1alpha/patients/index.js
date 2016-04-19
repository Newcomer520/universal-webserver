import router from 'koa-router'
import PassportHelper from 'server/helpers/passport'
import Summaries from './summaries'
import Records from './records'
import ExamReports from './exam-reports'
import ExamItems from './exam-items'
import Patients from './patients'

const patientsRouter = new router()

patientsRouter.use(PassportHelper.allow('doctor'))

const patients = new Patients()
patientsRouter.get('/:p_id', patients.list)

const summaries = new Summaries()
patientsRouter.get('/:p_id/summaries', summaries.fetch)

const records = new Records()
patientsRouter.get('/:p_id/records', records.list)
patientsRouter.get('/:p_id/records/:r_id', records.fetch)

const examReports = new ExamReports()
patientsRouter.get('/:p_id/exam_reports', examReports.list)
patientsRouter.get('/:p_id/exam_reports/:er_id', examReports.fetch)

const examItems = new ExamItems()
patientsRouter.get('/:p_id/exam_items/:ei_id', examItems.fetch)

export default patientsRouter
