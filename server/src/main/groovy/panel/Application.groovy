package panel

import groovy.transform.CompileStatic
import io.micronaut.context.annotation.Requires
import io.micronaut.context.env.Environment
import io.micronaut.context.event.ApplicationEventListener
import io.micronaut.runtime.Micronaut
import io.micronaut.runtime.server.event.ServerStartupEvent
import panel.pogos.firstLoad.SyncOrdersSemaphore
import panel.publisher.PanelPublisher

import javax.inject.Singleton

@Singleton
@CompileStatic
@Requires(notEnv = Environment.TEST)
class Application implements ApplicationEventListener<ServerStartupEvent> {

    static void main(String[] args) {
        Micronaut.run(Application)
    }

    @Override
    void onApplicationEvent(ServerStartupEvent event) {
        SyncOrdersSemaphore.create()
        PanelPublisher.create()
    }

}
