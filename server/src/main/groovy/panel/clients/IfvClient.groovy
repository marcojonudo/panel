package panel.clients

import groovy.transform.CompileStatic
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Post
import io.micronaut.http.client.annotation.Client
import panel.pogos.ifv.getSchedules.GetSchedulesBody
import panel.pogos.ifv.getSchedules.GetSchedulesResponse
import panel.pogos.ifv.getToken.GetTokenBody
import panel.pogos.ifv.getToken.GetTokenResponse

import javax.inject.Singleton

@Singleton
@CompileStatic
@Client("\${ifv.path}")
interface IfvClient {

	@Post("/SeguridadJson/GetToken")
	GetTokenResponse getToken(@Body GetTokenBody body)

	@Post("/HorariosCentroJson/GetEcommerce")
	GetSchedulesResponse getSchedules(@Body GetSchedulesBody body)

}
