package panel.exceptions.handlers

import io.micronaut.context.annotation.Requires
import io.micronaut.http.HttpRequest
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Produces
import io.micronaut.http.client.exceptions.HttpClientResponseException
import io.micronaut.http.server.exceptions.ExceptionHandler
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import javax.inject.Singleton

@Produces
@Singleton
@Requires(classes = [HttpClientResponseException, ExceptionHandler])
class HttpClientResponseExceptionHandler implements ExceptionHandler<HttpClientResponseException, HttpResponse> {

	private static final Logger LOG = LoggerFactory.getLogger(HttpClientResponseExceptionHandler)

	@Override
	HttpResponse handle(HttpRequest request, HttpClientResponseException exception) {
		String message = "ServerDatabaseResolver returned status $exception.status ($exception.status.code) | $exception.message"
		LOG.error(message)
		return HttpResponse.status(exception.status).body([message: message])
	}

}
