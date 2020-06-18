package panel.jobs

import groovy.transform.CompileStatic
import io.micronaut.context.annotation.Requires
import io.micronaut.context.env.Environment
import io.micronaut.scheduling.annotation.Scheduled
import panel.pogos.UpdateCards
import panel.pogos.realTime.RealTimeRequestInfo
import panel.publisher.PanelPublisher
import panel.services.PanelService
import panel.utils.Constants

import javax.inject.Inject
import javax.inject.Singleton
import java.time.LocalDate

@CompileStatic
@Singleton
@Requires(notEnv = Environment.TEST)
class JpdvOrdersJob {

	@Inject PanelService panelService

	@Scheduled(cron = "\${cron.sync-jpdv-orders}")
	void execute() {
		UpdateCards updateCards = panelService.syncJpdvOrders(LocalDate.now(), PanelService.lastScheduleDay)
		/* Se se ha actualizado alguna ficha, se actualizan los terminales con los cambios */
		if (updateCards.updated()) {
			RealTimeRequestInfo realTimeRequestInfo = new RealTimeRequestInfo(
					Constants.REAL_TIME_ACTION.SYNC_JPDV,
					updateCards.getSyncInfo()
			)
			PanelPublisher.send("", realTimeRequestInfo)
		}
	}

}
