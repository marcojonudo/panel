package panel.filters

import groovy.transform.CompileStatic
import io.micronaut.context.annotation.Requires
import io.micronaut.context.env.Environment
import io.micronaut.http.HttpResponse
import io.micronaut.http.MutableHttpRequest
import io.micronaut.http.annotation.Filter
import io.micronaut.http.filter.ClientFilterChain
import io.micronaut.http.filter.HttpClientFilter
import org.reactivestreams.Publisher
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import panel.clients.IfvClient
import panel.pogos.ifv.IfvBody
import panel.pogos.ifv.getToken.GetTokenBody
import panel.pogos.ifv.getToken.GetTokenResponse
import panel.pogos.logs.ExceptionLog
import panel.utils.Constants

import javax.inject.Inject
import javax.inject.Singleton

@Singleton
@CompileStatic
@Requires(notEnv = Environment.TEST)
@Filter("/api/HorariosCentroJson/**")
class IfvFilter implements HttpClientFilter {

	private static final Logger LOG = LoggerFactory.getLogger(IfvFilter)

	@Inject IfvClient ifvClient
	@Inject GetTokenBody getTokenBody

	@Override
	Publisher<? extends HttpResponse<?>> doFilter(MutableHttpRequest<?> request, ClientFilterChain chain) {
//		LOG.info(new HttpRequestLog(request).toString())
		try {
			GetTokenResponse response = ifvClient.getToken(getTokenBody)
			((IfvBody) request.body.get()).token = response.token
		} catch (all) {
			LOG.error(new ExceptionLog(Constants.ExceptionMessage.GET_IFV_TOKEN, all.class.simpleName, all.message).toString())
		}
		return chain.proceed(request)
//		return Publishers.map(chain.proceed(request), { HttpResponse<?> response ->
////			LOG.info(new HttpResponseLog(response).toString())
//			return response
//		})
	}

}
