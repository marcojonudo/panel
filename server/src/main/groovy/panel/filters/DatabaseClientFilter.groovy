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

@CompileStatic
@Filter("/panel/cards/**")
class DatabaseClientFilter implements HttpClientFilter {

	@Override
	Publisher<? extends HttpResponse<?>> doFilter(MutableHttpRequest<?> request, ClientFilterChain chain) {
		String updateId = request.uri.path.split("/").last()
		if (updateId != 'cards') {
			CardsPublisher.send(new CardsPublisherInfo(updateId, (List<Map<String, Object>>) request.body.get()))
		}
		return chain.proceed(request)
	}

}
