package panel.filters

import groovy.transform.CompileStatic
import io.micronaut.http.HttpResponse
import io.micronaut.http.MutableHttpRequest
import io.micronaut.http.annotation.Filter
import io.micronaut.http.filter.ClientFilterChain
import io.micronaut.http.filter.HttpClientFilter
import org.reactivestreams.Publisher
import panel.pogos.CardsPublisherInfo
import panel.publisher.CardsPublisher
import panel.utils.Constants

@CompileStatic
@Filter("/panel/cards/**")
class DatabaseClientFilter implements HttpClientFilter {

	@Override
	Publisher<? extends HttpResponse<?>> doFilter(MutableHttpRequest<?> request, ClientFilterChain chain) {
		String updateId = request.uri.path.split("/").last()
		/* Si el último elemento del path no es 'cards', es la propiedad a actualizar, por lo que se tiene que
		*  notificar el Observable para que se actualicen otros terminales en tiempo real */
		if (updateId != 'cards') {
			String sessionId = request.headers.get(Constants.SESSION_ID)
			/* Al crear de cero las fichas, se hace una petición a /cards/links, que forma parte de los endpoints que
			*  activan la actualización. Para evitarlo (en la carga inicial no se requiere), se comprueba el sessionId,
			*  que en esa petición es un string vacio */
			if (sessionId) {
				CardsPublisher.send(
						sessionId,
						new CardsPublisherInfo(updateId, (List<Map<String, Object>>) request.body.get())
				)
			}
		}
		return chain.proceed(request)
	}

}
