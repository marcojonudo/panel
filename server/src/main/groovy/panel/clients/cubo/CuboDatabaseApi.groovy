package panel.clients.cubo

import groovy.transform.CompileStatic
import utils.pogos.schedules.AppointmentType

import javax.inject.Singleton

@Singleton
@CompileStatic
interface CuboDatabaseApi {

	List<AppointmentType> getAppointmentTypes()

}
