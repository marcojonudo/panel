package panel.publisher

import groovy.transform.CompileStatic

@CompileStatic
class PanelPublisher {

//	private static PublishSubject<Event<RealTimeInfo>> processor

	static void create() {
//		processor = processor ?: PublishSubject.create() as PublishSubject<Event<RealTimeInfo>>
	}

//	static PublishSubject<Event<RealTimeInfo>> get() {
//		return processor
//	}
//
//	static void send(String sessionId, RealTimeInfo realTimeInfo) {
//		processor.onNext(Event.of(realTimeInfo).id(sessionId))
//	}

}
