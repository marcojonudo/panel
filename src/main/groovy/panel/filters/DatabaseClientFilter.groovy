package panel.filters

import groovy.transform.CompileStatic
import io.micronaut.http.HttpResponse
import io.micronaut.http.MutableHttpRequest
import io.micronaut.http.annotation.Filter
import io.micronaut.http.filter.ClientFilterChain
import io.micronaut.http.filter.HttpClientFilter
import org.reactivestreams.Publisher
import utils.Constants

@CompileStatic
@Filter("/**")
class DatabaseClientFilter implements HttpClientFilter {

	@Override
	Publisher<? extends HttpResponse<?>> doFilter(MutableHttpRequest<?> request, ClientFilterChain chain) {
		return chain.proceed(request.header(Constants.Id.HEADER_SERVER_KEY, "local"))
	}

}
