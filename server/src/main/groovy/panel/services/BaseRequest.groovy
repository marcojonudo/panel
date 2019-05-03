package panel.services

import io.micronaut.http.HttpResponse

interface BaseRequest {

	Object handleResponse(HttpResponse httpResponse)

}
