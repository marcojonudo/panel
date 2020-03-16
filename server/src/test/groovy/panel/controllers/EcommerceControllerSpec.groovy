package panel.controllers

import io.micronaut.http.HttpRequest
import io.micronaut.http.HttpResponse
import io.micronaut.http.HttpStatus
import io.micronaut.http.client.HttpClient
import io.micronaut.http.client.annotation.Client
import io.micronaut.http.client.exceptions.HttpClientResponseException
import io.micronaut.test.annotation.MicronautTest
import io.micronaut.test.annotation.MockBean
import panel.pogos.eCommerce.getSchedules.DayEcommerceSchedule
import panel.pogos.eCommerce.getSchedules.EcommerceSchedule
import panel.pogos.eCommerce.getSchedules.GetEcommerceScheduleError
import panel.pogos.eCommerce.getSchedules.GetEcommerceSchedulesInfo
import panel.services.EcommerceService
import spock.lang.Shared
import spock.lang.Specification
import utils.pogos.panel.AppointmentType
import utils.pogos.schedules.ScheduleInterval

import javax.inject.Inject
import java.time.LocalDate
import java.time.LocalTime

@MicronautTest
class EcommerceControllerSpec extends Specification {

	// region Collaborators

	@Inject
	@Client('/')
	HttpClient httpClient

	@Inject
	EcommerceService ecommerceService

	@MockBean(EcommerceService)
	EcommerceService ecommerceService() {
		Mock(EcommerceService)
	}

	// endregion

	// region Variables

	@Shared LocalDate today
	@Shared LocalTime time8
	@Shared LocalTime time15
	@Shared LocalTime time20
	@Shared List<DayEcommerceSchedule> daysEcommerceSchedules

	// endregion

	void setupSpec() {
		today = LocalDate.now()
		time8 = LocalTime.of(8, 0)
		time15 = LocalTime.of(15, 0)
		time20 = LocalTime.of(20, 0)
		daysEcommerceSchedules = [
				new DayEcommerceSchedule(
						today,
						[
								new EcommerceSchedule(
										[new ScheduleInterval(start: time8, end: time15)],
										AppointmentType.Code.ECO
								)
						]
				)
		]
	}

	// region Get schedules

	void "test get schedules no schedules"() {
		given:
		ecommerceService.findSchedules(today, today) >>
				new GetEcommerceSchedulesInfo([], GetEcommerceScheduleError.NO_SCHEDULES)

		when:
		httpClient.toBlocking().exchange(
				HttpRequest.GET("/eCommerce/schedules?from=${today.toString()}&to=${today.toString()}")
		)

		then:
		HttpClientResponseException exception = thrown()
		exception.status == HttpStatus.NOT_FOUND
	}

	void "test get schedules existent appointment schedules"() {
		given:
		ecommerceService.findSchedules(today, today) >> new GetEcommerceSchedulesInfo(daysEcommerceSchedules)

		when:
		HttpResponse<DayEcommerceSchedule[]> response = httpClient.toBlocking().exchange(
				HttpRequest.GET("/eCommerce/schedules?from=${today.toString()}&to=${today.toString()}"),
				DayEcommerceSchedule[]
		)

		then:
		response.status == HttpStatus.OK
		List<DayEcommerceSchedule> body = response.body().toList()
		body.size() == daysEcommerceSchedules.size()
		body[0].day == daysEcommerceSchedules[0].day
		body[0].schedules.size() == daysEcommerceSchedules[0].schedules.size()
		body[0].schedules[0].intervals[0].start == daysEcommerceSchedules[0].schedules[0].intervals[0].start
	}

	void "test get schedules not existent appointment schedules existent mechanics"() {
		given:
		ecommerceService.findSchedules(today, today) >>
				new GetEcommerceSchedulesInfo(daysEcommerceSchedules, GetEcommerceScheduleError.NO_APPOINTMENTS)

		when:
		HttpResponse<DayEcommerceSchedule[]> response = httpClient.toBlocking().exchange(
				HttpRequest.GET("/eCommerce/schedules?from=${today.toString()}&to=${today.toString()}"),
				DayEcommerceSchedule[]
		)

		then:
		response.status == HttpStatus.ACCEPTED
		List<DayEcommerceSchedule> body = response.body().toList()
		body.size() == daysEcommerceSchedules.size()
		body[0].day == daysEcommerceSchedules[0].day
		body[0].schedules.size() == daysEcommerceSchedules[0].schedules.size()
		body[0].schedules[0].intervals[0].start == daysEcommerceSchedules[0].schedules[0].intervals[0].start
	}

	// endregion

}
