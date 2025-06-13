package panel.pogos.logs


import groovy.transform.CompileStatic
import io.micronaut.http.HttpMethod
import io.micronaut.http.HttpRequest

@CompileStatic
class HttpRequestLog {

	HttpMethod method
	String service
	Map<String, Object> params
	Map body

	HttpRequestLog(HttpRequest request) {
		method = request.method
		service = request.path
		if (request.parameters.size() > 0) {
			params = request.parameters.collectEntries {
				[(it.key): ((List<String>) it.value)[0]]
			}
		}
		body = Jackson.convertValue(request.body.get())
	}

	@Override
	String toString() {
		return ""
//		return JsonOutput.toJson(this)
	}

}
