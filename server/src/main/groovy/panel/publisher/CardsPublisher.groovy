package panel.publisher

import groovy.transform.CompileStatic
import io.micronaut.http.sse.Event
import io.reactivex.subjects.PublishSubject
import panel.pogos.CardsPublisherInfo

@CompileStatic
class CardsPublisher {

	private static PublishSubject<Event<CardsPublisherInfo>> processor

	static void create() {
		processor = processor ?: (PublishSubject<Event<CardsPublisherInfo>>) PublishSubject.create()
	}

	static PublishSubject<Event<CardsPublisherInfo>> get() {
		return processor
	}

	static void send(String sessionId, CardsPublisherInfo updateInfo) {
		processor.onNext(Event.of(updateInfo).id(sessionId))
	}

}
