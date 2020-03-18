package panel.publisher

import groovy.transform.CompileStatic
import io.micronaut.http.sse.Event
import io.reactivex.subjects.PublishSubject
import panel.pogos.realTime.RealTimeRequestInfo

@CompileStatic
class PanelPublisher {

	private static PublishSubject<Event<RealTimeRequestInfo>> processor

	static void create() {
		processor = processor ?: (PublishSubject<Event<RealTimeRequestInfo>>) PublishSubject.create()
	}

	static PublishSubject<Event<RealTimeRequestInfo>> get() {
		return processor
	}

	static void send(String sessionId, RealTimeRequestInfo realTimeInfo) {
		processor.onNext(Event.of(realTimeInfo).id(sessionId))
	}

}
