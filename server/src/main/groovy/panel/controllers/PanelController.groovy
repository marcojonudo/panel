package panel.controllers

import groovy.transform.CompileStatic
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Put
import io.micronaut.http.sse.Event
import org.reactivestreams.Publisher
import panel.clients.panel.PanelDatabaseClient
import panel.clients.schedules.SchedulesDatabaseClient
import panel.pogos.CardsPublisherInfo
import panel.pogos.CompleteInfo
import panel.services.PanelService
import panel.publisher.CardsPublisher

@CompileStatic
@Controller("/panel")
class PanelController {

	private final PanelService panelService
	private final PanelDatabaseClient panelDatabaseClient
	private final SchedulesDatabaseClient schedulesDatabaseClient
//	Flowable<Integer> obs

	PanelController(
			PanelService panelService,
			PanelDatabaseClient panelDatabaseClient,
			SchedulesDatabaseClient schedulesDatabaseClient
	) {
		this.panelService = panelService
		this.panelDatabaseClient = panelDatabaseClient
		this.schedulesDatabaseClient = schedulesDatabaseClient
//
//		FlowableOnSubscribe<Integer> flowableOnSubscribe = new FlowableOnSubscribe<Integer>() {
//
//			@Override
//			void subscribe(@NonNull FlowableEmitter<Integer> emitter) throws Exception {
//				emitter.onNext(1234)
//			}
//		}
//		obs = Flowable
//				.create(flowableOnSubscribe, BackpressureStrategy.BUFFER);
//		obs = Flowable.create(new FlowableOnSubscribe<Object>() {
//
//			@Override
//			void subscribe(@NonNull FlowableEmitter<Object> emitter) throws Exception {
//				emitter.onNext('hola que tal')
//			}
//		})
	}

	@Get("/get")
	CompleteInfo get() {
		CompleteInfo panelInfo = panelService.getPanelInfo()
		return panelInfo
	}

	@Get("/publisher")
	Publisher<Event<CardsPublisherInfo>> getCardsPublisher() {
//		Flowable.generate({ emitter ->
//			emitter.on
//		})
		return CardsPublisher.get()
	}

//	@Get(uri = "/publisher", produces = MediaType.TEXT_EVENT_STREAM)
//	Flowable<Integer> getCardsPublisher() {
//		//		Flowable.generate({ emitter ->
//		//			emitter.on
//		//		})
//		return obs//CardsPublisher.processor
//	}

	@Put("/cards/position")
	void updatePosition(@Body List<Map<String, Object>> cards) {
		panelDatabaseClient.updateCardsPosition(cards)
	}

	@Put("/cards/duration")
	void updateDuration(@Body List<Map<String, Object>> cards) {
		panelDatabaseClient.updateCardDuration(cards)
	}

	@Put("/cards/links")
	void updateLinks(@Body List<Map<String, Object>> cards) {
		panelDatabaseClient.updateCardsLinks(cards)
	}

	@Put("/mechanic/lines")
	void updateMechanicLines(@Body Map<String, Object> mechanic) {
		schedulesDatabaseClient.updateMechanicLines(mechanic)
	}

}
