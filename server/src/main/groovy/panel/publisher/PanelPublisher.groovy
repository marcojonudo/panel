package panel.publisher

import groovy.transform.CompileStatic
import io.micronaut.http.sse.Event
import io.reactivex.subjects.PublishSubject
import panel.pogos.PublisherInfo

@CompileStatic
class PanelPublisher {

	private static PublishSubject<Event<PublisherInfo>> processor

	static void create() {
		processor = processor ?: (PublishSubject<Event<PublisherInfo>>) PublishSubject.create()
	}

	static PublishSubject<Event<PublisherInfo>> get() {
		return processor
	}

	static void send(String sessionId, PublisherInfo updateInfo) {
		processor.onNext(Event.of(updateInfo).id(sessionId))
	}

}
