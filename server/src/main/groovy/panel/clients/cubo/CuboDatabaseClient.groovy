package panel.clients.cubo

import groovy.transform.CompileStatic
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Header
import io.micronaut.http.client.annotation.Client
import utils.pogos.schedules.AppointmentType

import javax.inject.Singleton

@Singleton
@CompileStatic
@Client("http://\${host.ip}:8082/cubo")
@Header(name = "database", value = "cubo")
interface CuboDatabaseClient extends CuboDatabaseApi {

	@Get("/appointmentTypes")
	List<AppointmentType> getAppointmentTypes()

}
