package panel.init

import io.micronaut.context.annotation.Requires
import io.micronaut.context.env.Environment
import io.micronaut.context.event.ApplicationEventListener
import io.micronaut.context.event.StartupEvent
import panel.publisher.CardsPublisher

import javax.inject.Singleton

@Singleton
@Requires(notEnv = Environment.TEST)
class Bootstrap implements ApplicationEventListener<StartupEvent> {

	@Override
	void onApplicationEvent(StartupEvent event) {
		CardsPublisher.create()
	}

}
