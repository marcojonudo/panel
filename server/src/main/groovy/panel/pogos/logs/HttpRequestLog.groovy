package panel.pogos.logs

import com.fasterxml.jackson.databind.node.ObjectNode
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import groovy.transform.CompileStatic
import io.micronaut.http.HttpMethod
import io.micronaut.http.HttpRequest

@CompileStatic
class HttpRequestLog {

	HttpMethod method
	String service
	Map<String, Object> params
	Object body

	HttpRequestLog(HttpRequest request) {
		method = request.method
		service = request.path
		if (request.parameters.size() > 0) {
			params = request.parameters.collectEntries {
				[(it.key): ((List<String>) it.value)[0]]
			}
		}
		request.body.ifPresent({ Object body ->
			this.body = body instanceof ObjectNode ? new JsonSlurper().parseText(body.toString()) : body
		})
	}

	@Override
	String toString() {
		return JsonOutput.toJson(this)
	}

}
