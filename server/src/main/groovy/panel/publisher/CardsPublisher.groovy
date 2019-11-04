package panel.publisher

import groovy.transform.CompileStatic
import io.micronaut.http.sse.Event
import io.reactivex.processors.PublishProcessor
import panel.pogos.CardsPublisherInfo

@CompileStatic
class CardsPublisher {

	private static PublishProcessor<Event<CardsPublisherInfo>> processor

	static void create() {
		processor = processor ?: (PublishProcessor<Event<CardsPublisherInfo>>) PublishProcessor.create()
	}

	static PublishProcessor<Event<CardsPublisherInfo>> get() {
		return processor
	}

	static void send(CardsPublisherInfo updateInfo) {
		processor.onNext(Event.of(updateInfo).id('1234'))
	}

}
