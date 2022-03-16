package panel.filters

import groovy.transform.CompileStatic
import io.micronaut.http.HttpRequest
import io.micronaut.http.HttpResponse
import io.micronaut.http.MutableHttpRequest
import io.micronaut.http.annotation.Filter
import io.micronaut.http.context.ServerRequestContext
import io.micronaut.http.filter.ClientFilterChain
import io.micronaut.http.filter.HttpClientFilter
import org.reactivestreams.Publisher
import panel.utils.Constants

@CompileStatic
@Filter(["/panel/cards/**", "/cubo/mechanic/**", "/cubo/appointment/**"])
class RealTimePublisherClientFilter implements HttpClientFilter {

	@Override
	Publisher<? extends HttpResponse<?>> doFilter(MutableHttpRequest<?> request, ClientFilterChain chain) {
		String realTimeAction = request.headers.get(Constants.HEADER_ID.REAL_TIME_ACTION)

		/* Si en las cabeceras se encuentra el campo realTimeAction, significa que debe ejecutarse la actualización
		*  en tiempo real en otros terminales de panel */
		if (realTimeAction) {
			String sessionId = request.headers.get(Constants.HEADER_ID.SESSION_ID)
			Object requestContent = findRequestContent(request)
//			RealTimeInfo realTimeRequestInfo = new RealTimeInfo(realTimeAction, requestContent)
//			PanelPublisher.send(sessionId, realTimeRequestInfo)
		}
		return chain.proceed(request)
	}

	static Object findRequestContent(MutableHttpRequest<?> request) {
//		boolean getBody = GET_BODY_METHODS.find { it == request.method }
		if (request.body.isPresent()) {
			return request.body.get()
		} else {
			/* Por algún motivo, no se pueden sacar los parámetros de la request pasada como parámetro. Por lo tanto, se
			*  obtiene la petición al controlador y se obtienen de ahí (en este caso, se obtiene la petición del front
			*  al back de panel, no de panel a server-database-resolver) */
			HttpRequest httpRequest = ServerRequestContext.currentRequest().get()
			return httpRequest.parameters.collectEntries { [(it.key): ((List<String>) it.value)[0]] }
		}

	}

}
