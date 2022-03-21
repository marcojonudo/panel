package panel.pogos.logs


import groovy.transform.CompileStatic
import io.micronaut.http.HttpResponse

@CompileStatic
class HttpResponseLog {

	int status
	Object body

	HttpResponseLog(HttpResponse response) {
		status = response.status.code
		response.body.ifPresent({ Object body ->
			this.body = body instanceof Optional ? body.get() : body
		})
	}

	@Override
	String toString() {
		return ""
//		return JsonOutput.toJson(this)
	}

}
