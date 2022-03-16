package panel.publisher

import groovy.transform.CompileStatic
import io.micronaut.http.sse.Event
import io.reactivex.subjects.PublishSubject
import panel.pogos.realTime.RealTimeInfo

@CompileStatic
class PanelPublisher {

	private static PublishSubject<Event<RealTimeInfo>> processor

	static void create() {
		processor = processor ?: PublishSubject.create() as PublishSubject<Event<RealTimeInfo>>
	}

	static PublishSubject<Event<RealTimeInfo>> get() {
		return processor
	}

	static void send(String sessionId, RealTimeInfo realTimeInfo) {
		processor.onNext(Event.of(realTimeInfo).id(sessionId))
	}

}
