package panel.filters

import groovy.transform.CompileStatic
import io.micronaut.http.HttpMethod
import io.micronaut.http.HttpRequest
import io.micronaut.http.HttpResponse
import io.micronaut.http.MutableHttpRequest
import io.micronaut.http.annotation.Filter
import io.micronaut.http.context.ServerRequestContext
import io.micronaut.http.filter.ClientFilterChain
import io.micronaut.http.filter.HttpClientFilter
import org.reactivestreams.Publisher
import panel.pogos.PublisherInfo
import panel.publisher.PanelPublisher
import panel.utils.Constants

@CompileStatic
@Filter(["/panel/cards/**", "/schedules/mechanic/**", "/cubo/appointment/**"])
class RealTimePublisherClientFilter implements HttpClientFilter {

	private static final List<HttpMethod> GET_BODY_METHODS = [HttpMethod.POST, HttpMethod.PUT]

	@Override
	Publisher<? extends HttpResponse<?>> doFilter(MutableHttpRequest<?> request, ClientFilterChain chain) {
		Map<String, String> updateInfo = findRealTimeUpdateInfo(request.uri.path)

		/* Si se determina que el path se corresponde con un actualización que provoca otra en tiempo real, se debe
		*  enviar la info mediante el Publisher para que llegue a los clientes */
		if (updateInfo) {
			String sessionId = request.headers.get(Constants.SESSION_ID)
			/* Al crear de cero las fichas, se hace una petición a /cards/links, que forma parte de los endpoints que
			*  activan la actualización. Para evitarlo (en la carga inicial no se requiere), se comprueba el sessionId,
			*  que en esa petición es un string vacio */
			if (sessionId) {
				Map<String, Object> requestInfo = findRequestInfo(request)
				PublisherInfo publisherInfo = PublisherInfo.findPublisherInfoType(
						updateInfo.updateObject,
						updateInfo.updateProperty,
						requestInfo
				)
				PanelPublisher.send(sessionId, publisherInfo)
			}
		}
		return chain.proceed(request)
	}

	static Map<String, String> findRealTimeUpdateInfo(String path) {
		String[] pathInfo = path.split("/")[-1..-2].reverse()
		Map<String, String> updateInfo = null
		/* Si el path no tiene, al menos, el formato '/cards/position', no */
		if (pathInfo.length > 1 && triggerRealTimeUpdate(pathInfo[1])) {
			updateInfo = [updateObject: pathInfo[0], updateProperty: pathInfo[1]]
		}
		return updateInfo
	}

	static boolean triggerRealTimeUpdate(String updateProperty) {
		return !Constants.REAL_TIME_UPDATE_AVOID_PATHS.find { it == updateProperty }
	}

	static Map<String, Object> findRequestInfo(MutableHttpRequest<?> request) {
		boolean getBody = GET_BODY_METHODS.find { it == request.method }
		if (getBody) {
			return (Map<String, Object>) request.body.get()
		} else {
			/* Por algún motivo, no se pueden sacar los parámetros de la request pasada como parámetro. Por lo tanto, se
			*  obtiene la petición al controlador y se obtienen de ahí (en este caso, se obtiene la petición del front
			*  al back de panel, no de panel a server-database-resolver) */
			HttpRequest httpRequest = ServerRequestContext.currentRequest().get()
			return httpRequest.parameters.collectEntries { [(it.key): ((List<String>) it.value)[0]] }
		}

	}

}
