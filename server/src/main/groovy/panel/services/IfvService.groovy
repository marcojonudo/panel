//package panel.services
//
//import groovy.transform.CompileStatic
//import io.micronaut.http.HttpResponse
//import io.micronaut.http.HttpStatus
//import jakarta.inject.Inject
//import jakarta.inject.Singleton
//import org.slf4j.Logger
//import org.slf4j.LoggerFactory
//import panel.clients.IfvClient
//import panel.pogos.ifv.getEmployees.GetEmployeesBody
//import panel.pogos.ifv.getEmployees.GetEmployeesResponse
//import panel.pogos.ifv.getEmployees.IfvEmployee
//import panel.pogos.logs.ExceptionLog
//import panel.pogos.logs.Log
//import panel.utils.Constants
//
//import java.time.LocalDate
//
//@Singleton
//@CompileStatic
//class IfvService {
//
//	private static final Logger LOG = LoggerFactory.getLogger(IfvService)
//
//	public static final int RETRIES = 3
//
//	@Inject private IfvClient ifvClient
//
//	List<IfvEmployee> getEmployees(LocalDate from, LocalDate to, int centre, int retries = 0) {
//		List<IfvEmployee> employees = []
//		try {
//			HttpResponse<GetEmployeesResponse> response = ifvClient.getEmployees(new GetEmployeesBody(from, to, centre))
//			if (response.status() == HttpStatus.OK) {
//				GetEmployeesResponse body = response.body()
//				if (!body.error) {
//					employees = response.body().data
//				} else {
//					LOG.error("${new Log((Map)[error: body.error, message: body.message, from: from, to: to, centre: centre])}")
//				}
//			} else {
//				LOG.error("${new Log((Map)[status: response.status, message: Constants.Message.GET_EMPLOYEES_IFV_WRONG_REQUEST, from: from, to: to, centre: centre])}")
//			}
//		} catch(Exception e) {
//			LOG.error("${new ExceptionLog(Constants.ExceptionMessage.IFV_REQUEST_ERROR, e.class.simpleName, e.message)}")
//			if (retries < RETRIES) {
//				return getEmployees(from, to, centre, ++retries)
//			}
//		}
//		return employees
//	}
//
//}
