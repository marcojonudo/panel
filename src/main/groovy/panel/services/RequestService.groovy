package panel.services

import database.http.client.DatabaseHttpClient
import database.http.client.DatabaseRequestHeaders
import groovy.transform.CompileStatic
import io.micronaut.http.HttpResponse
import io.micronaut.http.HttpStatus
import panel.utils.Constants
import panel.utils.Url
import utils.exceptions.WrongDatabaseResponseException
import utils.pogos.EmployeeSchedule
import utils.pogos.fviberi.Order
import utils.pogos.panel.Card
import utils.pogos.panel.GroupUnits
import utils.pogos.panel.Task

import javax.inject.Singleton

@Singleton
@CompileStatic
class RequestService {

	private final DatabaseHttpClient databaseHttpClient

	RequestService(DatabaseHttpClient databaseHttpClient) {
		this.databaseHttpClient = databaseHttpClient
	}

	static Object handleResponse(HttpResponse httpResponse) {
		if (httpResponse.status != HttpStatus.OK && httpResponse.status != HttpStatus.ACCEPTED) {
			throw new WrongDatabaseResponseException(httpResponse.status, (String) ((Map) httpResponse.body()).message)
		}
		return httpResponse.body()
	}

	List<EmployeeSchedule> getDayMechanics(Date day, DatabaseRequestHeaders headers = new DatabaseRequestHeaders(utils.Constants.Id.LOCAL, utils.Constants.Id.CUBO)) {
		HttpResponse response = databaseHttpClient.get(Url.dayMechanics(day), headers)
		List<EmployeeSchedule> employeesSchedules = handleResponse(response).collect { (EmployeeSchedule) it }
		return employeesSchedules
	}

	List<EmployeeSchedule> updateEmployeesSchedulesPosition(List<EmployeeSchedule> employeesSchedules, DatabaseRequestHeaders headers = new DatabaseRequestHeaders(utils.Constants.Id.LOCAL, utils.Constants.Id.CUBO)) {
		HttpResponse response = databaseHttpClient.put(Constants.Url.UPDATE_EMPLOYEES_SCHEDULES_POSITION, employeesSchedules, headers)
		List<EmployeeSchedule> savedEmployeesSchedules = handleResponse(response).collect { (EmployeeSchedule) it }
		return savedEmployeesSchedules
	}

	List<Order> getOrders(Date day, List<String> states, DatabaseRequestHeaders headers = new DatabaseRequestHeaders(utils.Constants.Id.LOCAL, utils.Constants.Id.FVIBERI)) {
		HttpResponse response = databaseHttpClient.get(Url.orders(day, states), headers)
		List<Order> orders = handleResponse(response).collect { (Order) it }
		return orders
	}

	List<Card> getCards(Date day, DatabaseRequestHeaders headers = new DatabaseRequestHeaders(utils.Constants.Id.LOCAL, utils.Constants.Id.CUBO)) {
		HttpResponse response = databaseHttpClient.get(Url.cards(day), headers)
		List<Card> cards = handleResponse(response).collect { (Card) it }
		return cards
	}

	List<Task> getTasks(List<Integer> articles, DatabaseRequestHeaders headers = new DatabaseRequestHeaders(utils.Constants.Id.LOCAL, utils.Constants.Id.CUBO)) {
		HttpResponse response = databaseHttpClient.get(Url.tasks(articles), headers)
		List<Task> tasks = handleResponse(response).collect { (Task) it }
		return tasks
	}

	List<Integer> getDurations(List<GroupUnits> groupUnits, DatabaseRequestHeaders headers = new DatabaseRequestHeaders(utils.Constants.Id.LOCAL, utils.Constants.Id.CUBO)) {
		HttpResponse response = databaseHttpClient.post(Constants.Url.GET_DURATIONS, groupUnits, headers)
		List<Integer> durations = (List<Integer>) handleResponse(response)
		return durations
	}

}
