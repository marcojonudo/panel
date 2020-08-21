package panel.services

import groovy.transform.CompileStatic
import panel.clients.CuboDatabaseClient

import javax.inject.Inject
import javax.inject.Singleton

@Singleton
@CompileStatic
class IfvService {

	@Inject private CuboDatabaseClient cuboDatabaseClient

//	List<IfvCentreSchedule> getCentreSchedules(int centreCode, Date from, Date to) {
//		RestBuilder restBuilder = new RestBuilder()
//
//		String url = "$NEW_IFV_URL$GET_CENTRE_SCHEDULES"
//		String token = getToken(GET_CENTRE_SCHEDULES.split("/")[0])
//
//		List<IfvCentreSchedule> schedules = []
//		if (token) {
//			RestResponse response = restBuilder.post(url) {
//				body(new GetCentreSchedulesBody(token, from, to, centreCode) as JSON)
//			}
//
//			schedules = ((Map) response.json).datos.collect {
//				((Map) it).horaApertura ? new IfvCentreSchedule((Map) it) : null
//			} - (IfvCentreSchedule) null
//		}
//		return schedules
//	}

}
