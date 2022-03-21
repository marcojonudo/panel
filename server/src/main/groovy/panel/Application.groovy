package panel

import groovy.transform.CompileStatic
import io.micronaut.runtime.Micronaut

@CompileStatic
//@Requires(notEnv = Environment.TEST)
class Application {

    static void main(String[] args) {
        Micronaut.run(Application, args)
    }

//    @Override
//    void onApplicationEvent(ServerStartupEvent event) {
//        SyncOrdersSemaphore.create()
//        PanelPublisher.create()
//    }

}
