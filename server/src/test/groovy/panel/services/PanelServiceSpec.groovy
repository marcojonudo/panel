package panel.services

import io.micronaut.test.annotation.MicronautTest
import io.micronaut.test.annotation.MockBean
import panel.clients.fviberi.FviberiDatabaseApi
import panel.clients.fviberi.FviberiDatabaseClient
import panel.clients.panel.PanelDatabaseApi
import panel.clients.panel.PanelDatabaseClient
import panel.clients.schedules.SchedulesDatabaseApi
import panel.clients.schedules.SchedulesDatabaseClient
import panel.pogos.UpdateCards
import spock.lang.Shared
import spock.lang.Specification
import utils.pogos.fviberi.*
import utils.pogos.panel.Card
import utils.pogos.panel.Group
import utils.pogos.panel.GroupUnits
import utils.pogos.panel.Task
import utils.pogos.schedules.EmployeeSchedule

import javax.inject.Inject

@MicronautTest
class PanelServiceSpec extends Specification {

	// region Collaborators

	@Inject
	PanelService panelService

	@Inject
	PanelDatabaseClient panelDatabaseClient

	@Inject
	SchedulesDatabaseClient schedulesDatabaseClient

	@MockBean(PanelDatabaseApi)
	PanelDatabaseClient panelDatabaseClient() {
		Mock(PanelDatabaseClient)
	}

	@MockBean(FviberiDatabaseApi)
	FviberiDatabaseClient fviberiDatabaseClient() {
		Mock(FviberiDatabaseClient)
	}

	@MockBean(SchedulesDatabaseApi)
	SchedulesDatabaseClient schedulesDatabaseClient() {
		Mock(SchedulesDatabaseClient)
	}

	// endregion

	// region Variables

	@Shared
	Order order4Articles = new Order(
			number: 1,
			timeInfo: [new OrderTime(shortCode: 'C1')],
			lines: [
					new OrderLine(article: new Article(code: 99026)),
					new OrderLine(article: new Article(code: 99066)),
					new OrderLine(article: new Article(code: 99129)),
					new OrderLine(article: new Article(code: 99169)),
			],
			vehicle: new Vehicle([:])
	)

	@Shared
	Order order1Article = new Order(
			number: 2,
			timeInfo: [new OrderTime(shortCode: 'C2')],
			lines: [
					new OrderLine(article: new Article(code: 1))
			],
			vehicle: new Vehicle([:])
	)

	// endregion

	// region Task groups relations

	@Shared Task task000 = new Task(articleCode: 99000, groups: [])
	@Shared Task task001 = new Task(articleCode: 99001, groups: [])
	@Shared Task task002 = new Task(articleCode: 99002, groups: [])
	@Shared Task task004 = new Task(articleCode: 99004, groups: [])
	@Shared Task task006 = new Task(articleCode: 99006, groups: [])
	@Shared Task task007 = new Task(articleCode: 99007, groups: [])
	@Shared Task task008 = new Task(articleCode: 99008, groups: [])
	@Shared Task task009 = new Task(articleCode: 99009, groups: [])
	@Shared Task task010 = new Task(articleCode: 99010, groups: [])
	@Shared Task task012 = new Task(articleCode: 99012, groups: [])
	@Shared Task task013 = new Task(articleCode: 99013, groups: [])
	@Shared Task task014 = new Task(articleCode: 99014, groups: [])
	@Shared Task task015 = new Task(articleCode: 99015, groups: [])
	@Shared Task task017 = new Task(articleCode: 99017, groups: [])
	@Shared Task task019 = new Task(articleCode: 99019, groups: [])
	@Shared Task task021 = new Task(articleCode: 99021, groups: [])
	@Shared Task task022 = new Task(articleCode: 99022, groups: [])
	@Shared Task task023 = new Task(articleCode: 99023, groups: [])
	@Shared Task task024 = new Task(articleCode: 99024, groups: [])
	@Shared Task task025 = new Task(articleCode: 99025, groups: [])
	@Shared Task task026 = new Task(articleCode: 99026, groups: [])
	@Shared Task task028 = new Task(articleCode: 99028, groups: [])
	@Shared Task task029 = new Task(articleCode: 99029, groups: [])
	@Shared Task task033 = new Task(articleCode: 99033, groups: [])
	@Shared Task task036 = new Task(articleCode: 99036, groups: [])
	@Shared Task task038 = new Task(articleCode: 99038, groups: [])
	@Shared Task task047 = new Task(articleCode: 99047, groups: [])
	@Shared Task task051 = new Task(articleCode: 99051, groups: [])
	@Shared Task task056 = new Task(articleCode: 99056, groups: [])
	@Shared Task task059 = new Task(articleCode: 99059, groups: [])
	@Shared Task task060 = new Task(articleCode: 99060, groups: [])
	@Shared Task task065 = new Task(articleCode: 99065, groups: [])
	@Shared Task task066 = new Task(articleCode: 99066, groups: [])
	@Shared Task task067 = new Task(articleCode: 99067, groups: [])
	@Shared Task task068 = new Task(articleCode: 99068, groups: [])
	@Shared Task task071 = new Task(articleCode: 99071, groups: [])
	@Shared Task task073 = new Task(articleCode: 99073, groups: [])
	@Shared Task task074 = new Task(articleCode: 99074, groups: [])
	@Shared Task task076 = new Task(articleCode: 99076, groups: [])
	@Shared Task task077 = new Task(articleCode: 99077, groups: [])
	@Shared Task task079 = new Task(articleCode: 99079, groups: [])
	@Shared Task task081 = new Task(articleCode: 99081, groups: [])
	@Shared Task task082 = new Task(articleCode: 99082, groups: [])
	@Shared Task task083 = new Task(articleCode: 99083, groups: [])
	@Shared Task task086 = new Task(articleCode: 99086, groups: [])
	@Shared Task task087 = new Task(articleCode: 99087, groups: [])
	@Shared Task task088 = new Task(articleCode: 99088, groups: [])
	@Shared Task task089 = new Task(articleCode: 99089, groups: [])
	@Shared Task task090 = new Task(articleCode: 99090, groups: [])
	@Shared Task task092 = new Task(articleCode: 99092, groups: [])
	@Shared Task task095 = new Task(articleCode: 99095, groups: [])
	@Shared Task task100 = new Task(articleCode: 99100, groups: [])
	@Shared Task task101 = new Task(articleCode: 99101, groups: [])
	@Shared Task task103 = new Task(articleCode: 99103, groups: [])
	@Shared Task task104 = new Task(articleCode: 99104, groups: [])
	@Shared Task task105 = new Task(articleCode: 99105, groups: [])
	@Shared Task task106 = new Task(articleCode: 99106, groups: [])
	@Shared Task task107 = new Task(articleCode: 99107, groups: [])
	@Shared Task task108 = new Task(articleCode: 99108, groups: [])
	@Shared Task task109 = new Task(articleCode: 99109, groups: [])
	@Shared Task task110 = new Task(articleCode: 99110, groups: [])
	@Shared Task task111 = new Task(articleCode: 99111, groups: [])
	@Shared Task task112 = new Task(articleCode: 99112, groups: [])
	@Shared Task task113 = new Task(articleCode: 99113, groups: [])
	@Shared Task task114 = new Task(articleCode: 99114, groups: [])
	@Shared Task task115 = new Task(articleCode: 99115, groups: [])
	@Shared Task task116 = new Task(articleCode: 99116, groups: [])
	@Shared Task task118 = new Task(articleCode: 99118, groups: [])
	@Shared Task task121 = new Task(articleCode: 99121, groups: [])
	@Shared Task task122 = new Task(articleCode: 99122, groups: [])
	@Shared Task task124 = new Task(articleCode: 99124, groups: [])
	@Shared Task task127 = new Task(articleCode: 99127, groups: [])
	@Shared Task task128 = new Task(articleCode: 99128, groups: [])
	@Shared Task task129 = new Task(articleCode: 99129, groups: [])
	@Shared Task task138 = new Task(articleCode: 99138, groups: [])
	@Shared Task task144 = new Task(articleCode: 99144, groups: [])
	@Shared Task task146 = new Task(articleCode: 99146, groups: [])
	@Shared Task task147 = new Task(articleCode: 99147, groups: [])
	@Shared Task task149 = new Task(articleCode: 99149, groups: [])
	@Shared Task task151 = new Task(articleCode: 99151, groups: [])
	@Shared Task task153 = new Task(articleCode: 99153, groups: [])
	@Shared Task task154 = new Task(articleCode: 99154, groups: [])
	@Shared Task task155 = new Task(articleCode: 99155, groups: [])
	@Shared Task task156 = new Task(articleCode: 99156, groups: [])
	@Shared Task task157 = new Task(articleCode: 99157, groups: [])
	@Shared Task task160 = new Task(articleCode: 99160, groups: [])
	@Shared Task task161 = new Task(articleCode: 99161, groups: [])
	@Shared Task task162 = new Task(articleCode: 99162, groups: [])
	@Shared Task task163 = new Task(articleCode: 99163, groups: [])
	@Shared Task task164 = new Task(articleCode: 99164, groups: [])
	@Shared Task task165 = new Task(articleCode: 99165, groups: [])
	@Shared Task task166 = new Task(articleCode: 99166, groups: [])
	@Shared Task task169 = new Task(articleCode: 99169, groups: [])
	@Shared Task task170 = new Task(articleCode: 99170, groups: [])
	@Shared Task task171 = new Task(articleCode: 99171, groups: [])
	@Shared Task task172 = new Task(articleCode: 99172, groups: [])
	@Shared Task task173 = new Task(articleCode: 99173, groups: [])
	@Shared Task task174 = new Task(articleCode: 99174, groups: [])
	@Shared Task task175 = new Task(articleCode: 99175, groups: [])
	@Shared Task task176 = new Task(articleCode: 99176, groups: [])
	@Shared Task task177 = new Task(articleCode: 99177, groups: [])
	@Shared Task task178 = new Task(articleCode: 99178, groups: [])
	@Shared Task task179 = new Task(articleCode: 99179, groups: [])
	@Shared Task task180 = new Task(articleCode: 99180, groups: [])
	@Shared Task task181 = new Task(articleCode: 99181, groups: [])
	@Shared Task task182 = new Task(articleCode: 99182, groups: [])
	@Shared Task task184 = new Task(articleCode: 99184, groups: [])
	@Shared Task task185 = new Task(articleCode: 99185, groups: [])
	@Shared Task task186 = new Task(articleCode: 99186, groups: [])
	@Shared Task task187 = new Task(articleCode: 99187, groups: [])
	@Shared Task task188 = new Task(articleCode: 99188, groups: [])
	@Shared Task task190 = new Task(articleCode: 99190, groups: [])
	@Shared Task task191 = new Task(articleCode: 99191, groups: [])
	@Shared Task task192 = new Task(articleCode: 99192, groups: [])
	@Shared Task task193 = new Task(articleCode: 99193, groups: [])
	@Shared Task task194 = new Task(articleCode: 99194, groups: [])
	@Shared Task task195 = new Task(articleCode: 99195, groups: [])
	@Shared Task task196 = new Task(articleCode: 99196, groups: [])
	@Shared Task task198 = new Task(articleCode: 99198, groups: [])
	@Shared Task task200 = new Task(articleCode: 99200, groups: [])
	@Shared Task task201 = new Task(articleCode: 99201, groups: [])
	@Shared Task task202 = new Task(articleCode: 99202, groups: [])
	@Shared Task task203 = new Task(articleCode: 99203, groups: [])
	@Shared Task task205 = new Task(articleCode: 99205, groups: [])
	@Shared Task task206 = new Task(articleCode: 99206, groups: [])
	@Shared Task task207 = new Task(articleCode: 99207, groups: [])
	@Shared Task task208 = new Task(articleCode: 99208, groups: [])
	@Shared Task task209 = new Task(articleCode: 99209, groups: [])
	@Shared Task task210 = new Task(articleCode: 99210, groups: [])
	@Shared Task task211 = new Task(articleCode: 99211, groups: [])
	@Shared Task task212 = new Task(articleCode: 99212, groups: [])
	@Shared Task task213 = new Task(articleCode: 99213, groups: [])
	@Shared Task task214 = new Task(articleCode: 99214, groups: [])
	@Shared Task task215 = new Task(articleCode: 99215, groups: [])
	@Shared Task task216 = new Task(articleCode: 99216, groups: [])
	@Shared Task task217 = new Task(articleCode: 99217, groups: [])
	@Shared Task task218 = new Task(articleCode: 99218, groups: [])
	@Shared Task task222 = new Task(articleCode: 99222, groups: [])
	@Shared Task task223 = new Task(articleCode: 99223, groups: [])
	@Shared Task task224 = new Task(articleCode: 99224, groups: [])
	@Shared Task task225 = new Task(articleCode: 99225, groups: [])
	@Shared Task task226 = new Task(articleCode: 99226, groups: [])
	@Shared Task task227 = new Task(articleCode: 99227, groups: [])
	@Shared Task task228 = new Task(articleCode: 99228, groups: [])
	@Shared Task task229 = new Task(articleCode: 99229, groups: [])
	@Shared Task task230 = new Task(articleCode: 99230, groups: [])
	@Shared Task task231 = new Task(articleCode: 99231, groups: [])
	@Shared Task task232 = new Task(articleCode: 99232, groups: [])
	@Shared Task task233 = new Task(articleCode: 99233, groups: [])
	@Shared Task task234 = new Task(articleCode: 99234, groups: [])
	@Shared Task task235 = new Task(articleCode: 99235, groups: [])
	@Shared Task task236 = new Task(articleCode: 99236, groups: [])
	@Shared Task task237 = new Task(articleCode: 99237, groups: [])
	@Shared Task task238 = new Task(articleCode: 99238, groups: [])
	@Shared Task task239 = new Task(articleCode: 99239, groups: [])
	@Shared Task task240 = new Task(articleCode: 99240, groups: [])
	@Shared Task task241 = new Task(articleCode: 99241, groups: [])
	@Shared Task task242 = new Task(articleCode: 99242, groups: [])
	@Shared Task task243 = new Task(articleCode: 99243, groups: [])
	@Shared Task task244 = new Task(articleCode: 99244, groups: [])
	@Shared Task task245 = new Task(articleCode: 99245, groups: [])
	@Shared Task task246 = new Task(articleCode: 99246, groups: [])
	@Shared Task task247 = new Task(articleCode: 99247, groups: [])
	@Shared Task task248 = new Task(articleCode: 99248, groups: [])
	@Shared Task task249 = new Task(articleCode: 99249, groups: [])
	@Shared Task task250 = new Task(articleCode: 99250, groups: [])
	@Shared Task task251 = new Task(articleCode: 99251, groups: [])
	@Shared Task task252 = new Task(articleCode: 99252, groups: [])
	@Shared Task task253 = new Task(articleCode: 99253, groups: [])
	@Shared Task task254 = new Task(articleCode: 99254, groups: [])
	@Shared Task task255 = new Task(articleCode: 99255, groups: [])
	@Shared Task task256 = new Task(articleCode: 99256, groups: [])
	@Shared Task task257 = new Task(articleCode: 99257, groups: [])
	@Shared Task task258 = new Task(articleCode: 99258, groups: [])
	@Shared Task task259 = new Task(articleCode: 99259, groups: [])
	@Shared Task task260 = new Task(articleCode: 99260, groups: [])
	@Shared Task task261 = new Task(articleCode: 99261, groups: [])
	@Shared Task task262 = new Task(articleCode: 99262, groups: [])
	@Shared Task task263 = new Task(articleCode: 99263, groups: [])
	@Shared Task task264 = new Task(articleCode: 99264, groups: [])
	@Shared Task task265 = new Task(articleCode: 99265, groups: [])
	@Shared Task task266 = new Task(articleCode: 99266, groups: [])
	@Shared Task task267 = new Task(articleCode: 99267, groups: [])
	@Shared Task task268 = new Task(articleCode: 99268, groups: [])
	@Shared Task task269 = new Task(articleCode: 99269, groups: [])
	@Shared Task task270 = new Task(articleCode: 99270, groups: [])
	@Shared Task task271 = new Task(articleCode: 99271, groups: [])
	@Shared Task task272 = new Task(articleCode: 99272, groups: [])
	@Shared Task task273 = new Task(articleCode: 99273, groups: [])
	@Shared Task task274 = new Task(articleCode: 99274, groups: [])
	@Shared Task task275 = new Task(articleCode: 99275, groups: [])
	@Shared Task task276 = new Task(articleCode: 99276, groups: [])
	@Shared Task task277 = new Task(articleCode: 99277, groups: [])
	@Shared Task task278 = new Task(articleCode: 99278, groups: [])
	@Shared Task task279 = new Task(articleCode: 99279, groups: [])
	@Shared Task task280 = new Task(articleCode: 99280, groups: [])
	@Shared Task task281 = new Task(articleCode: 99281, groups: [])
	@Shared Task task282 = new Task(articleCode: 99282, groups: [])
	@Shared Task task283 = new Task(articleCode: 99283, groups: [])
	@Shared Task task284 = new Task(articleCode: 99284, groups: [])
	@Shared Task task285 = new Task(articleCode: 99285, groups: [])
	@Shared Task task286 = new Task(articleCode: 99286, groups: [])
	@Shared Task task287 = new Task(articleCode: 99287, groups: [])
	@Shared Task task288 = new Task(articleCode: 99288, groups: [])
	@Shared Task task289 = new Task(articleCode: 99289, groups: [])
	@Shared Task task290 = new Task(articleCode: 99290, groups: [])
	@Shared Task task291 = new Task(articleCode: 99291, groups: [])
	@Shared Task task292 = new Task(articleCode: 99292, groups: [])
	@Shared Task task293 = new Task(articleCode: 99293, groups: [])
	@Shared Task task294 = new Task(articleCode: 99294, groups: [])
	@Shared Task task295 = new Task(articleCode: 99295, groups: [])
	@Shared Task task296 = new Task(articleCode: 99296, groups: [])
	@Shared Task task297 = new Task(articleCode: 99297, groups: [])
	@Shared Task task298 = new Task(articleCode: 99298, groups: [])
	@Shared Task task299 = new Task(articleCode: 99299, groups: [])
	@Shared Task task300 = new Task(articleCode: 99300, groups: [])
	@Shared Task task301 = new Task(articleCode: 99301, groups: [])
	@Shared Task task302 = new Task(articleCode: 99302, groups: [])
	@Shared Task task303 = new Task(articleCode: 99303, groups: [])
	@Shared Task task304 = new Task(articleCode: 99304, groups: [])
	@Shared Task task305 = new Task(articleCode: 99305, groups: [])
	@Shared Task task306 = new Task(articleCode: 99306, groups: [])
	@Shared Task task307 = new Task(articleCode: 99307, groups: [])
	@Shared Task task312 = new Task(articleCode: 99312, groups: [])
	@Shared Task task313 = new Task(articleCode: 99313, groups: [])
	@Shared Task task314 = new Task(articleCode: 99314, groups: [])
	@Shared Task task315 = new Task(articleCode: 99315, groups: [])
	@Shared Task task316 = new Task(articleCode: 99316, groups: [])
	@Shared Task task317 = new Task(articleCode: 99317, groups: [])
	@Shared Task task318 = new Task(articleCode: 99318, groups: [])
	@Shared Task task319 = new Task(articleCode: 99319, groups: [])
	@Shared Task task320 = new Task(articleCode: 99320, groups: [])
	@Shared Task task321 = new Task(articleCode: 99321, groups: [])
	@Shared Task task322 = new Task(articleCode: 99322, groups: [])
	@Shared Task task323 = new Task(articleCode: 99323, groups: [])
	@Shared Task task324 = new Task(articleCode: 99324, groups: [])
	@Shared Task task325 = new Task(articleCode: 99325, groups: [])
	@Shared Task task326 = new Task(articleCode: 99326, groups: [])
	@Shared Task task327 = new Task(articleCode: 99327, groups: [])
	@Shared Task task328 = new Task(articleCode: 99328, groups: [])
	@Shared Task task329 = new Task(articleCode: 99329, groups: [])
	@Shared Task task330 = new Task(articleCode: 99330, groups: [])
	@Shared Task task331 = new Task(articleCode: 99331, groups: [])
	@Shared Task task332 = new Task(articleCode: 99332, groups: [])
	@Shared Task task333 = new Task(articleCode: 99333, groups: [])
	@Shared Task task334 = new Task(articleCode: 99334, groups: [])
	@Shared Task task335 = new Task(articleCode: 99335, groups: [])
	@Shared Task task336 = new Task(articleCode: 99336, groups: [])
	@Shared Task task337 = new Task(articleCode: 99337, groups: [])
	@Shared Task task338 = new Task(articleCode: 99338, groups: [])
	@Shared Task task339 = new Task(articleCode: 99339, groups: [])
	@Shared Task task340 = new Task(articleCode: 99340, groups: [])
	@Shared Task task341 = new Task(articleCode: 99341, groups: [])
	@Shared Task task342 = new Task(articleCode: 99342, groups: [])
	@Shared Task task343 = new Task(articleCode: 99343, groups: [])
	@Shared Task task344 = new Task(articleCode: 99344, groups: [])
	@Shared Task task345 = new Task(articleCode: 99345, groups: [])
	@Shared Task task346 = new Task(articleCode: 99346, groups: [])
	@Shared Task task347 = new Task(articleCode: 99347, groups: [])
	@Shared Task task348 = new Task(articleCode: 99348, groups: [])
	@Shared Task task349 = new Task(articleCode: 99349, groups: [])
	@Shared Task task350 = new Task(articleCode: 99350, groups: [])
	@Shared Task task351 = new Task(articleCode: 99351, groups: [])
	@Shared Task task352 = new Task(articleCode: 99352, groups: [])
	@Shared Task task353 = new Task(articleCode: 99353, groups: [])
	@Shared Task task354 = new Task(articleCode: 99354, groups: [])
	@Shared Task task355 = new Task(articleCode: 99355, groups: [])
	@Shared Task task356 = new Task(articleCode: 99356, groups: [])
	@Shared Task task357 = new Task(articleCode: 99357, groups: [])
	@Shared Task task358 = new Task(articleCode: 99358, groups: [])
	@Shared Task task359 = new Task(articleCode: 99359, groups: [])
	@Shared Task task360 = new Task(articleCode: 99360, groups: [])
	@Shared Task task361 = new Task(articleCode: 99361, groups: [])
	@Shared Task task362 = new Task(articleCode: 99362, groups: [])
	@Shared Task task363 = new Task(articleCode: 99363, groups: [])
	@Shared Task task364 = new Task(articleCode: 99364, groups: [])
	@Shared Task task365 = new Task(articleCode: 99365, groups: [])
	@Shared Task task366 = new Task(articleCode: 99366, groups: [])
	@Shared Task task367 = new Task(articleCode: 99367, groups: [])
	@Shared Task task368 = new Task(articleCode: 99368, groups: [])
	@Shared Task task369 = new Task(articleCode: 99369, groups: [])
	@Shared Task task370 = new Task(articleCode: 99370, groups: [])
	@Shared Task task371 = new Task(articleCode: 99371, groups: [])
	@Shared Task task372 = new Task(articleCode: 99372, groups: [])
	@Shared Task task373 = new Task(articleCode: 99373, groups: [])
	@Shared Task task374 = new Task(articleCode: 99374, groups: [])
	@Shared Task task375 = new Task(articleCode: 99375, groups: [])
	@Shared Task task376 = new Task(articleCode: 99376, groups: [])
	@Shared Task task377 = new Task(articleCode: 99377, groups: [])
	@Shared Task task378 = new Task(articleCode: 99378, groups: [])
	@Shared Task task379 = new Task(articleCode: 99379, groups: [])
	@Shared Task task380 = new Task(articleCode: 99380, groups: [])
	@Shared Task task381 = new Task(articleCode: 99381, groups: [])
	@Shared Task task382 = new Task(articleCode: 99382, groups: [])
	@Shared Task task383 = new Task(articleCode: 99383, groups: [])
	@Shared Task task384 = new Task(articleCode: 99384, groups: [])
	@Shared Task task385 = new Task(articleCode: 99385, groups: [])
	@Shared Task task386 = new Task(articleCode: 99386, groups: [])
	@Shared Task task387 = new Task(articleCode: 99387, groups: [])
	@Shared Task task409 = new Task(articleCode: 99409, groups: [])
	@Shared Task task410 = new Task(articleCode: 99410, groups: [])
	@Shared Task task411 = new Task(articleCode: 99411, groups: [])
	@Shared Task task412 = new Task(articleCode: 99412, groups: [])
	@Shared Task task413 = new Task(articleCode: 99413, groups: [])
	@Shared Task task414 = new Task(articleCode: 99414, groups: [])
	@Shared Task task415 = new Task(articleCode: 99415, groups: [])
	@Shared Task task416 = new Task(articleCode: 99416, groups: [])
	@Shared Task task417 = new Task(articleCode: 99417, groups: [])
	@Shared Task task420 = new Task(articleCode: 99420, groups: [])
	@Shared Task task421 = new Task(articleCode: 99421, groups: [])
	@Shared Task task422 = new Task(articleCode: 99422, groups: [])
	@Shared Task task423 = new Task(articleCode: 99423, groups: [])
	@Shared Task task424 = new Task(articleCode: 99424, groups: [])
	@Shared Task task425 = new Task(articleCode: 99425, groups: [])
	@Shared Task task427 = new Task(articleCode: 99427, groups: [])
	@Shared Task task429 = new Task(articleCode: 99429, groups: [])
	@Shared Task task437 = new Task(articleCode: 99437, groups: [])
	@Shared Task task888 = new Task(articleCode: 99888, groups: [])
	@Shared Task task901 = new Task(articleCode: 99901, groups: [])
	@Shared Task task902 = new Task(articleCode: 99902, groups: [])
	@Shared Task task903 = new Task(articleCode: 99903, groups: [])
	@Shared Task task904 = new Task(articleCode: 99904, groups: [])
	@Shared Task task905 = new Task(articleCode: 99905, groups: [])
	@Shared Task task906 = new Task(articleCode: 99906, groups: [])
	@Shared Task task907 = new Task(articleCode: 99907, groups: [])
	@Shared Task task908 = new Task(articleCode: 99908, groups: [])
	@Shared Task task909 = new Task(articleCode: 99909, groups: [])
	@Shared Task task910 = new Task(articleCode: 99910, groups: [])
	@Shared Task task911 = new Task(articleCode: 99911, groups: [])
	@Shared Task task912 = new Task(articleCode: 99912, groups: [])
	@Shared Task task913 = new Task(articleCode: 99913, groups: [])
	@Shared Task task914 = new Task(articleCode: 99914, groups: [])
	@Shared Task task915 = new Task(articleCode: 99915, groups: [])
	@Shared Task task916 = new Task(articleCode: 99916, groups: [])
	@Shared Task task917 = new Task(articleCode: 99917, groups: [])
	@Shared Task task3 = new Task(articleCode: 3, groups: [])
	@Shared Task task419 = new Task(articleCode: 99419, groups: [])
	@Shared Task task150 = new Task(articleCode: 99150, groups: [])
	@Shared Task task426 = new Task(articleCode: 99426, groups: [])
	@Shared Task task310 = new Task(articleCode: 99310, groups: [])
	@Shared Task task439 = new Task(articleCode: 99439, groups: [])
	@Shared Task task440 = new Task(articleCode: 99440, groups: [])
	@Shared Task task441 = new Task(articleCode: 99441, groups: [])
	@Shared Task task442 = new Task(articleCode: 99442, groups: [])
	@Shared Task task443 = new Task(articleCode: 99443, groups: [])
	@Shared Task task444 = new Task(articleCode: 99444, groups: [])
	@Shared Task task445 = new Task(articleCode: 99445, groups: [])
	@Shared Task task446 = new Task(articleCode: 99446, groups: [])
	@Shared Task task447 = new Task(articleCode: 99447, groups: [])
	@Shared Task task448 = new Task(articleCode: 99448, groups: [])
	@Shared Task task449 = new Task(articleCode: 99449, groups: [])
	@Shared Task task450 = new Task(articleCode: 99450, groups: [])
	@Shared Task task451 = new Task(articleCode: 99451, groups: [])
	@Shared Task task452 = new Task(articleCode: 99452, groups: [])
	@Shared Task task453 = new Task(articleCode: 99453, groups: [])
	@Shared Task task454 = new Task(articleCode: 99454, groups: [])
	@Shared Task task455 = new Task(articleCode: 99455, groups: [])
	@Shared Task task456 = new Task(articleCode: 99456, groups: [])
	@Shared Task task457 = new Task(articleCode: 99457, groups: [])
	@Shared Task task458 = new Task(articleCode: 99458, groups: [])
	@Shared Task task459 = new Task(articleCode: 99459, groups: [])
	@Shared Task task460 = new Task(articleCode: 99460, groups: [])
	@Shared Task task461 = new Task(articleCode: 99461, groups: [])
	@Shared Task task462 = new Task(articleCode: 99462, groups: [])
	@Shared Task task918 = new Task(articleCode: 99918, groups: [])
	@Shared Task task919 = new Task(articleCode: 99919, groups: [])
	@Shared Task task920 = new Task(articleCode: 99920, groups: [])
	@Shared Task task921 = new Task(articleCode: 99921, groups: [])

	@Shared Group group1 = new Group(code: 1, tasks: [])
	@Shared Group group2 = new Group(code: 2, tasks: [])
	@Shared Group group3 = new Group(code: 3, tasks: [])
	@Shared Group group4 = new Group(code: 4, tasks: [])
	@Shared Group group5 = new Group(code: 5, tasks: [])
	@Shared Group group6 = new Group(code: 6, tasks: [])
	@Shared Group group7 = new Group(code: 7, tasks: [])
	@Shared Group group8 = new Group(code: 8, tasks: [])
	@Shared Group group9 = new Group(code: 9, tasks: [])
	@Shared Group group10 = new Group(code: 10, tasks: [])
	@Shared Group group11 = new Group(code: 11, tasks: [])
	@Shared Group group12 = new Group(code: 12, tasks: [])
	@Shared Group group13 = new Group(code: 13, tasks: [])
	@Shared Group group14 = new Group(code: 14, tasks: [])
	@Shared Group group15 = new Group(code: 15, tasks: [])
	@Shared Group group16 = new Group(code: 16, tasks: [])
	@Shared Group group17 = new Group(code: 17, tasks: [])
	@Shared Group group18 = new Group(code: 18, tasks: [])
	@Shared Group group19 = new Group(code: 19, tasks: [])
	@Shared Group group20 = new Group(code: 20, tasks: [])
	@Shared Group group21 = new Group(code: 21, tasks: [])
	@Shared Group group22 = new Group(code: 22, tasks: [])
	@Shared Group group23 = new Group(code: 23, tasks: [])
	@Shared Group group24 = new Group(code: 24, tasks: [])
	@Shared Group group25 = new Group(code: 25, tasks: [])
	@Shared Group group26 = new Group(code: 26, tasks: [])
	@Shared Group group27 = new Group(code: 27, tasks: [])
	@Shared Group group28 = new Group(code: 28, tasks: [])
	@Shared Group group29 = new Group(code: 29, tasks: [])
	@Shared Group group30 = new Group(code: 30, tasks: [])
	@Shared Group group31 = new Group(code: 31, tasks: [])
	@Shared Group group32 = new Group(code: 32, tasks: [])
	@Shared Group group33 = new Group(code: 33, tasks: [])
	@Shared Group group34 = new Group(code: 34, tasks: [])
	@Shared Group group35 = new Group(code: 35, tasks: [])
	@Shared Group group36 = new Group(code: 36, tasks: [])
	@Shared Group group37 = new Group(code: 37, tasks: [])
	@Shared Group group38 = new Group(code: 38, tasks: [])
	@Shared Group group39 = new Group(code: 39, tasks: [])
	@Shared Group group40 = new Group(code: 40, tasks: [])
	@Shared Group group41 = new Group(code: 41, tasks: [])
	@Shared Group group42 = new Group(code: 42, tasks: [])
	@Shared Group group43 = new Group(code: 43, tasks: [])
	@Shared Group group44 = new Group(code: 44, tasks: [])
	@Shared Group group45 = new Group(code: 45, tasks: [])
	@Shared Group group46 = new Group(code: 46, tasks: [])
	@Shared Group group47 = new Group(code: 47, tasks: [])
	@Shared Group group48 = new Group(code: 48, tasks: [])
	@Shared Group group49 = new Group(code: 49, tasks: [])
	@Shared Group group50 = new Group(code: 50, tasks: [])
	@Shared Group group51 = new Group(code: 51, tasks: [])
	@Shared Group group52 = new Group(code: 52, tasks: [])
	@Shared Group group53 = new Group(code: 53, tasks: [])
	@Shared Group group54 = new Group(code: 54, tasks: [])
	@Shared Group group55 = new Group(code: 55, tasks: [])
	@Shared Group group56 = new Group(code: 56, tasks: [])
	@Shared Group group57 = new Group(code: 57, tasks: [])
	@Shared Group group58 = new Group(code: 58, tasks: [])
	@Shared Group group60 = new Group(code: 60, tasks: [])
	@Shared Group group61 = new Group(code: 61, tasks: [])
	@Shared Group group62 = new Group(code: 62, tasks: [])
	@Shared Group group63 = new Group(code: 63, tasks: [])
	@Shared Group group64 = new Group(code: 64, tasks: [])
	@Shared Group group65 = new Group(code: 65, tasks: [])
	@Shared Group group66 = new Group(code: 66, tasks: [])
	@Shared Group group67 = new Group(code: 67, tasks: [])
	@Shared Group group68 = new Group(code: 68, tasks: [])
	@Shared Group group69 = new Group(code: 69, tasks: [])
	@Shared Group group70 = new Group(code: 70, tasks: [])
	@Shared Group group71 = new Group(code: 71, tasks: [])
	@Shared Group group72 = new Group(code: 72, tasks: [])
	@Shared Group group73 = new Group(code: 73, tasks: [])
	@Shared Group group74 = new Group(code: 74, tasks: [])
	@Shared Group group75 = new Group(code: 75, tasks: [])
	@Shared Group group76 = new Group(code: 76, tasks: [])
	@Shared Group group77 = new Group(code: 77, tasks: [])
	@Shared Group group78 = new Group(code: 78, tasks: [])
	@Shared Group group79 = new Group(code: 79, tasks: [])
	@Shared Group group80 = new Group(code: 80, tasks: [])
	@Shared Group group81 = new Group(code: 81, tasks: [])
	@Shared Group group82 = new Group(code: 82, tasks: [])
	@Shared Group group83 = new Group(code: 83, tasks: [])
	@Shared Group group84 = new Group(code: 84, tasks: [])
	@Shared Group group85 = new Group(code: 85, tasks: [])
	@Shared Group group86 = new Group(code: 86, tasks: [])
	@Shared Group group87 = new Group(code: 87, tasks: [])
	@Shared Group group88 = new Group(code: 88, tasks: [])
	@Shared Group group89 = new Group(code: 89, tasks: [])
	@Shared Group group90 = new Group(code: 90, tasks: [])
	@Shared Group group91 = new Group(code: 91, tasks: [])
	@Shared Group group92 = new Group(code: 92, tasks: [])
	@Shared Group group93 = new Group(code: 93, tasks: [])
	@Shared Group group94 = new Group(code: 94, tasks: [])
	@Shared Group group95 = new Group(code: 95, tasks: [])
	@Shared Group group96 = new Group(code: 96, tasks: [])
	@Shared Group group97 = new Group(code: 97, tasks: [])
	@Shared Group group98 = new Group(code: 98, tasks: [])
	@Shared Group group99 = new Group(code: 99, tasks: [])
	@Shared Group group100 = new Group(code: 100, tasks: [])
	@Shared Group group101 = new Group(code: 101, tasks: [])
	@Shared Group group102 = new Group(code: 102, tasks: [])
	@Shared Group group103 = new Group(code: 103, tasks: [])
	@Shared Group group104 = new Group(code: 104, tasks: [])
	@Shared Group group105 = new Group(code: 105, tasks: [])
	@Shared Group group106 = new Group(code: 106, tasks: [])
	@Shared Group group107 = new Group(code: 107, tasks: [])
	@Shared Group group108 = new Group(code: 108, tasks: [])
	@Shared Group group109 = new Group(code: 109, tasks: [])
	@Shared Group group110 = new Group(code: 110, tasks: [])
	@Shared Group group111 = new Group(code: 111, tasks: [])
	@Shared Group group112 = new Group(code: 112, tasks: [])
	@Shared Group group113 = new Group(code: 113, tasks: [])
	@Shared Group group114 = new Group(code: 114, tasks: [])
	@Shared Group group115 = new Group(code: 115, tasks: [])
	@Shared Group group116 = new Group(code: 116, tasks: [])
	@Shared Group group117 = new Group(code: 117, tasks: [])
	@Shared Group group118 = new Group(code: 118, tasks: [])
	@Shared Group group119 = new Group(code: 119, tasks: [])
	@Shared Group group120 = new Group(code: 120, tasks: [])
	@Shared Group group121 = new Group(code: 121, tasks: [])
	@Shared Group group122 = new Group(code: 122, tasks: [])
	@Shared Group group123 = new Group(code: 123, tasks: [])
	@Shared Group group124 = new Group(code: 124, tasks: [])
	@Shared Group group125 = new Group(code: 125, tasks: [])
	@Shared Group group126 = new Group(code: 126, tasks: [])
	@Shared Group group127 = new Group(code: 127, tasks: [])
	@Shared Group group128 = new Group(code: 128, tasks: [])
	@Shared Group group129 = new Group(code: 129, tasks: [])
	@Shared Group group130 = new Group(code: 130, tasks: [])
	@Shared Group group131 = new Group(code: 131, tasks: [])
	@Shared Group group132 = new Group(code: 132, tasks: [])
	@Shared Group group133 = new Group(code: 133, tasks: [])
	@Shared Group group134 = new Group(code: 134, tasks: [])
	@Shared Group group135 = new Group(code: 135, tasks: [])
	@Shared Group group136 = new Group(code: 136, tasks: [])
	@Shared Group group137 = new Group(code: 137, tasks: [])
	@Shared Group group138 = new Group(code: 138, tasks: [])
	@Shared Group group139 = new Group(code: 139, tasks: [])
	@Shared Group group140 = new Group(code: 140, tasks: [])
	@Shared Group group141 = new Group(code: 141, tasks: [])
	@Shared Group group142 = new Group(code: 142, tasks: [])
	@Shared Group group143 = new Group(code: 143, tasks: [])
	@Shared Group group144 = new Group(code: 144, tasks: [])
	@Shared Group group145 = new Group(code: 145, tasks: [])
	@Shared Group group146 = new Group(code: 146, tasks: [])
	@Shared Group group147 = new Group(code: 147, tasks: [])
	@Shared Group group148 = new Group(code: 148, tasks: [])
	@Shared Group group149 = new Group(code: 149, tasks: [])
	@Shared Group group150 = new Group(code: 150, tasks: [])
	@Shared Group group151 = new Group(code: 151, tasks: [])
	@Shared Group group152 = new Group(code: 152, tasks: [])
	@Shared Group group153 = new Group(code: 153, tasks: [])
	@Shared Group group154 = new Group(code: 154, tasks: [])
	@Shared Group group155 = new Group(code: 155, tasks: [])
	@Shared Group group156 = new Group(code: 156, tasks: [])
	@Shared Group group157 = new Group(code: 157, tasks: [])
	@Shared Group group158 = new Group(code: 158, tasks: [])
	@Shared Group group159 = new Group(code: 159, tasks: [])
	@Shared Group group160 = new Group(code: 160, tasks: [])
	@Shared Group group161 = new Group(code: 161, tasks: [])
	@Shared Group group162 = new Group(code: 162, tasks: [])
	@Shared Group group163 = new Group(code: 163, tasks: [])
	@Shared Group group164 = new Group(code: 164, tasks: [])
	@Shared Group group165 = new Group(code: 165, tasks: [])
	@Shared Group group166 = new Group(code: 166, tasks: [])
	@Shared Group group167 = new Group(code: 167, tasks: [])
	@Shared Group group168 = new Group(code: 168, tasks: [])
	@Shared Group group169 = new Group(code: 169, tasks: [])
	@Shared Group group170 = new Group(code: 170, tasks: [])
	@Shared Group group171 = new Group(code: 171, tasks: [])
	@Shared Group group172 = new Group(code: 172, tasks: [])
	@Shared Group group173 = new Group(code: 173, tasks: [])
	@Shared Group group174 = new Group(code: 174, tasks: [])
	@Shared Group group175 = new Group(code: 175, tasks: [])
	@Shared Group group176 = new Group(code: 176, tasks: [])
	@Shared Group group177 = new Group(code: 177, tasks: [])
	@Shared Group group178 = new Group(code: 178, tasks: [])
	@Shared Group group179 = new Group(code: 179, tasks: [])
	@Shared Group group180 = new Group(code: 180, tasks: [])
	@Shared Group group181 = new Group(code: 181, tasks: [])
	@Shared Group group182 = new Group(code: 182, tasks: [])
	@Shared Group group183 = new Group(code: 183, tasks: [])
	@Shared Group group184 = new Group(code: 184, tasks: [])
	@Shared Group group185 = new Group(code: 185, tasks: [])
	@Shared Group group186 = new Group(code: 186, tasks: [])
	@Shared Group group187 = new Group(code: 187, tasks: [])
	@Shared Group group188 = new Group(code: 188, tasks: [])
	@Shared Group group189 = new Group(code: 189, tasks: [])
	@Shared Group group190 = new Group(code: 190, tasks: [])
	@Shared Group group191 = new Group(code: 191, tasks: [])
	@Shared Group group192 = new Group(code: 192, tasks: [])
	@Shared Group group193 = new Group(code: 193, tasks: [])
	@Shared Group group194 = new Group(code: 194, tasks: [])
	@Shared Group group195 = new Group(code: 195, tasks: [])
	@Shared Group group196 = new Group(code: 196, tasks: [])
	@Shared Group group197 = new Group(code: 197, tasks: [])
	@Shared Group group198 = new Group(code: 198, tasks: [])
	@Shared Group group199 = new Group(code: 199, tasks: [])
	@Shared Group group200 = new Group(code: 200, tasks: [])
	@Shared Group group201 = new Group(code: 201, tasks: [])
	@Shared Group group202 = new Group(code: 202, tasks: [])
	@Shared Group group203 = new Group(code: 203, tasks: [])
	@Shared Group group204 = new Group(code: 204, tasks: [])
	@Shared Group group205 = new Group(code: 205, tasks: [])
	@Shared Group group206 = new Group(code: 206, tasks: [])
	@Shared Group group207 = new Group(code: 207, tasks: [])
	@Shared Group group208 = new Group(code: 208, tasks: [])
	@Shared Group group209 = new Group(code: 209, tasks: [])
	@Shared Group group210 = new Group(code: 210, tasks: [])
	@Shared Group group211 = new Group(code: 211, tasks: [])
	@Shared Group group212 = new Group(code: 212, tasks: [])
	@Shared Group group213 = new Group(code: 213, tasks: [])
	@Shared Group group214 = new Group(code: 214, tasks: [])
	@Shared Group group215 = new Group(code: 215, tasks: [])
	@Shared Group group216 = new Group(code: 216, tasks: [])
	@Shared Group group217 = new Group(code: 217, tasks: [])
	@Shared Group group218 = new Group(code: 218, tasks: [])
	@Shared Group group219 = new Group(code: 219, tasks: [])
	@Shared Group group220 = new Group(code: 220, tasks: [])
	@Shared Group group221 = new Group(code: 221, tasks: [])
	@Shared Group group222 = new Group(code: 222, tasks: [])
	@Shared Group group223 = new Group(code: 223, tasks: [])
	@Shared Group group224 = new Group(code: 224, tasks: [])
	@Shared Group group225 = new Group(code: 225, tasks: [])
	@Shared Group group226 = new Group(code: 226, tasks: [])
	@Shared Group group227 = new Group(code: 227, tasks: [])
	@Shared Group group228 = new Group(code: 228, tasks: [])
	@Shared Group group229 = new Group(code: 229, tasks: [])
	@Shared Group group230 = new Group(code: 230, tasks: [])
	@Shared Group group231 = new Group(code: 231, tasks: [])
	@Shared Group group232 = new Group(code: 232, tasks: [])
	@Shared Group group233 = new Group(code: 233, tasks: [])
	@Shared Group group234 = new Group(code: 234, tasks: [])
	@Shared Group group235 = new Group(code: 235, tasks: [])
	@Shared Group group236 = new Group(code: 236, tasks: [])
	@Shared Group group237 = new Group(code: 237, tasks: [])
	@Shared Group group238 = new Group(code: 238, tasks: [])
	@Shared Group group239 = new Group(code: 239, tasks: [])
	@Shared Group group240 = new Group(code: 240, tasks: [])
	@Shared Group group241 = new Group(code: 241, tasks: [])
	@Shared Group group242 = new Group(code: 242, tasks: [])
	@Shared Group group243 = new Group(code: 243, tasks: [])
	@Shared Group group244 = new Group(code: 244, tasks: [])
	@Shared Group group245 = new Group(code: 245, tasks: [])
	@Shared Group group246 = new Group(code: 246, tasks: [])
	@Shared Group group247 = new Group(code: 247, tasks: [])
	@Shared Group group248 = new Group(code: 248, tasks: [])
	@Shared Group group249 = new Group(code: 249, tasks: [])
	@Shared Group group250 = new Group(code: 250, tasks: [])
	@Shared Group group251 = new Group(code: 251, tasks: [])
	@Shared Group group252 = new Group(code: 252, tasks: [])
	@Shared Group group253 = new Group(code: 253, tasks: [])
	@Shared Group group254 = new Group(code: 254, tasks: [])
	@Shared Group group255 = new Group(code: 255, tasks: [])
	@Shared Group group256 = new Group(code: 256, tasks: [])
	@Shared Group group257 = new Group(code: 257, tasks: [])
	@Shared Group group258 = new Group(code: 258, tasks: [])
	@Shared Group group259 = new Group(code: 259, tasks: [])
	@Shared Group group260 = new Group(code: 260, tasks: [])
	@Shared Group group261 = new Group(code: 261, tasks: [])
	@Shared Group group262 = new Group(code: 262, tasks: [])
	@Shared Group group263 = new Group(code: 263, tasks: [])
	@Shared Group group264 = new Group(code: 264, tasks: [])
	@Shared Group group265 = new Group(code: 265, tasks: [])
	@Shared Group group266 = new Group(code: 266, tasks: [])
	@Shared Group group267 = new Group(code: 267, tasks: [])
	@Shared Group group268 = new Group(code: 268, tasks: [])
	@Shared Group group269 = new Group(code: 269, tasks: [])
	@Shared Group group270 = new Group(code: 270, tasks: [])
	@Shared Group group271 = new Group(code: 271, tasks: [])
	@Shared Group group272 = new Group(code: 272, tasks: [])
	@Shared Group group273 = new Group(code: 273, tasks: [])
	@Shared Group group274 = new Group(code: 274, tasks: [])
	@Shared Group group275 = new Group(code: 275, tasks: [])
	@Shared Group group276 = new Group(code: 276, tasks: [])
	@Shared Group group277 = new Group(code: 277, tasks: [])
	@Shared Group group278 = new Group(code: 278, tasks: [])
	@Shared Group group279 = new Group(code: 279, tasks: [])
	@Shared Group group280 = new Group(code: 280, tasks: [])
	@Shared Group group281 = new Group(code: 281, tasks: [])
	@Shared Group group282 = new Group(code: 282, tasks: [])
	@Shared Group group283 = new Group(code: 283, tasks: [])
	@Shared Group group284 = new Group(code: 284, tasks: [])
	@Shared Group group285 = new Group(code: 285, tasks: [])
	@Shared Group group286 = new Group(code: 286, tasks: [])
	@Shared Group group287 = new Group(code: 287, tasks: [])
	@Shared Group group288 = new Group(code: 288, tasks: [])
	@Shared Group group289 = new Group(code: 289, tasks: [])
	@Shared Group group290 = new Group(code: 290, tasks: [])
	@Shared Group group291 = new Group(code: 291, tasks: [])
	@Shared Group group292 = new Group(code: 292, tasks: [])
	@Shared Group group293 = new Group(code: 293, tasks: [])
	@Shared Group group294 = new Group(code: 294, tasks: [])
	@Shared Group group295 = new Group(code: 295, tasks: [])
	@Shared Group group296 = new Group(code: 296, tasks: [])
	@Shared Group group297 = new Group(code: 297, tasks: [])
	@Shared Group group298 = new Group(code: 298, tasks: [])
	@Shared Group group299 = new Group(code: 299, tasks: [])
	@Shared Group group300 = new Group(code: 300, tasks: [])
	@Shared Group group301 = new Group(code: 301, tasks: [])
	@Shared Group group302 = new Group(code: 302, tasks: [])
	@Shared Group group303 = new Group(code: 303, tasks: [])
	@Shared Group group304 = new Group(code: 304, tasks: [])
	@Shared Group group305 = new Group(code: 305, tasks: [])
	@Shared Group group306 = new Group(code: 306, tasks: [])
	@Shared Group group307 = new Group(code: 307, tasks: [])
	@Shared Group group308 = new Group(code: 308, tasks: [])
	@Shared Group group309 = new Group(code: 309, tasks: [])
	@Shared Group group310 = new Group(code: 310, tasks: [])
	@Shared Group group311 = new Group(code: 311, tasks: [])
	@Shared Group group312 = new Group(code: 312, tasks: [])
	@Shared Group group313 = new Group(code: 313, tasks: [])
	@Shared Group group314 = new Group(code: 314, tasks: [])
	@Shared Group group315 = new Group(code: 315, tasks: [])
	@Shared Group group316 = new Group(code: 316, tasks: [])
	@Shared Group group317 = new Group(code: 317, tasks: [])
	@Shared Group group318 = new Group(code: 318, tasks: [])
	@Shared Group group319 = new Group(code: 319, tasks: [])
	@Shared Group group320 = new Group(code: 320, tasks: [])
	@Shared Group group321 = new Group(code: 321, tasks: [])
	@Shared Group group322 = new Group(code: 322, tasks: [])
	@Shared Group group323 = new Group(code: 323, tasks: [])
	@Shared Group group324 = new Group(code: 324, tasks: [])
	@Shared Group group325 = new Group(code: 325, tasks: [])
	@Shared Group group326 = new Group(code: 326, tasks: [])
	@Shared Group group327 = new Group(code: 327, tasks: [])
	@Shared Group group328 = new Group(code: 328, tasks: [])
	@Shared Group group329 = new Group(code: 329, tasks: [])
	@Shared Group group330 = new Group(code: 330, tasks: [])
	@Shared Group group331 = new Group(code: 331, tasks: [])
	@Shared Group group332 = new Group(code: 332, tasks: [])
	@Shared Group group333 = new Group(code: 333, tasks: [])
	@Shared Group group334 = new Group(code: 334, tasks: [])
	@Shared Group group335 = new Group(code: 335, tasks: [])
	@Shared Group group336 = new Group(code: 336, tasks: [])
	@Shared Group group337 = new Group(code: 337, tasks: [])
	@Shared Group group338 = new Group(code: 338, tasks: [])
	@Shared Group group339 = new Group(code: 339, tasks: [])
	@Shared Group group340 = new Group(code: 340, tasks: [])
	@Shared Group group341 = new Group(code: 341, tasks: [])
	@Shared Group group342 = new Group(code: 342, tasks: [])
	@Shared Group group343 = new Group(code: 343, tasks: [])
	@Shared Group group344 = new Group(code: 344, tasks: [])
	@Shared Group group345 = new Group(code: 345, tasks: [])
	@Shared Group group346 = new Group(code: 346, tasks: [])
	@Shared Group group347 = new Group(code: 347, tasks: [])
	@Shared Group group348 = new Group(code: 348, tasks: [])
	@Shared Group group349 = new Group(code: 349, tasks: [])
	@Shared Group group350 = new Group(code: 350, tasks: [])
	@Shared Group group351 = new Group(code: 351, tasks: [])
	@Shared Group group352 = new Group(code: 352, tasks: [])
	@Shared Group group353 = new Group(code: 353, tasks: [])
	@Shared Group group354 = new Group(code: 354, tasks: [])
	@Shared Group group355 = new Group(code: 355, tasks: [])
	@Shared Group group356 = new Group(code: 356, tasks: [])
	@Shared Group group357 = new Group(code: 357, tasks: [])
	@Shared Group group358 = new Group(code: 358, tasks: [])
	@Shared Group group359 = new Group(code: 359, tasks: [])
	@Shared Group group360 = new Group(code: 360, tasks: [])
	@Shared Group group361 = new Group(code: 361, tasks: [])
	@Shared Group group362 = new Group(code: 362, tasks: [])
	@Shared Group group363 = new Group(code: 363, tasks: [])
	@Shared Group group364 = new Group(code: 364, tasks: [])
	@Shared Group group365 = new Group(code: 365, tasks: [])
	@Shared Group group366 = new Group(code: 366, tasks: [])
	@Shared Group group367 = new Group(code: 367, tasks: [])
	@Shared Group group368 = new Group(code: 368, tasks: [])
	@Shared Group group369 = new Group(code: 369, tasks: [])
	@Shared Group group370 = new Group(code: 370, tasks: [])
	@Shared Group group371 = new Group(code: 371, tasks: [])
	@Shared Group group372 = new Group(code: 372, tasks: [])
	@Shared Group group373 = new Group(code: 373, tasks: [])
	@Shared Group group374 = new Group(code: 374, tasks: [])
	@Shared Group group375 = new Group(code: 375, tasks: [])
	@Shared Group group376 = new Group(code: 376, tasks: [])
	@Shared Group group377 = new Group(code: 377, tasks: [])
	@Shared Group group378 = new Group(code: 378, tasks: [])
	@Shared Group group379 = new Group(code: 379, tasks: [])
	@Shared Group group380 = new Group(code: 380, tasks: [])
	@Shared Group group381 = new Group(code: 381, tasks: [])
	@Shared Group group382 = new Group(code: 382, tasks: [])
	@Shared Group group383 = new Group(code: 383, tasks: [])
	@Shared Group group384 = new Group(code: 384, tasks: [])
	@Shared Group group385 = new Group(code: 385, tasks: [])
	@Shared Group group386 = new Group(code: 386, tasks: [])
	@Shared Group group387 = new Group(code: 387, tasks: [])
	@Shared Group group388 = new Group(code: 388, tasks: [])
	@Shared Group group389 = new Group(code: 389, tasks: [])
	@Shared Group group390 = new Group(code: 390, tasks: [])
	@Shared Group group391 = new Group(code: 391, tasks: [])
	@Shared Group group392 = new Group(code: 392, tasks: [])
	@Shared Group group393 = new Group(code: 393, tasks: [])
	@Shared Group group394 = new Group(code: 394, tasks: [])
	@Shared Group group395 = new Group(code: 395, tasks: [])
	@Shared Group group396 = new Group(code: 396, tasks: [])
	@Shared Group group397 = new Group(code: 397, tasks: [])
	@Shared Group group398 = new Group(code: 398, tasks: [])
	@Shared Group group399 = new Group(code: 399, tasks: [])
	@Shared Group group400 = new Group(code: 400, tasks: [])
	@Shared Group group401 = new Group(code: 401, tasks: [])
	@Shared Group group402 = new Group(code: 402, tasks: [])
	@Shared Group group403 = new Group(code: 403, tasks: [])
	@Shared Group group404 = new Group(code: 404, tasks: [])
	@Shared Group group405 = new Group(code: 405, tasks: [])
	@Shared Group group406 = new Group(code: 406, tasks: [])
	@Shared Group group407 = new Group(code: 407, tasks: [])

	void setupSpec() {
		group1.tasks << task001
		group1.tasks << task004
		group2.tasks << task077
		group2.tasks << task079
		group3.tasks << task004
		group3.tasks << task385
		group4.tasks << task004
		group4.tasks << task386
		group5.tasks << task001
		group6.tasks << task077
		group7.tasks << task385
		group8.tasks << task386
		group9.tasks << task081
		group10.tasks << task321
		group11.tasks << task410
		group12.tasks << task411
		group13.tasks << task412
		group14.tasks << task413
		group15.tasks << task004
		group16.tasks << task079
		group17.tasks << task002
		group18.tasks << task149
		group19.tasks << task004
		group19.tasks << task149
		group20.tasks << task349
		group21.tasks << task222
		group22.tasks << task215
		group23.tasks << task225
		group24.tasks << task226
		group25.tasks << task331
		group26.tasks << task333
		group27.tasks << task218
		group28.tasks << task271
		group29.tasks << task012
		group30.tasks << task013
		group31.tasks << task151
		group32.tasks << task272
		group32.tasks << task013
		group33.tasks << task151
		group33.tasks << task272
		group34.tasks << task092
		group35.tasks << task175
		group36.tasks << task108
		group37.tasks << task273
		group38.tasks << task108
		group38.tasks << task273
		group39.tasks << task274
		group40.tasks << task014
		group41.tasks << task111
		group42.tasks << task138
		group43.tasks << task015
		group44.tasks << task086
		group45.tasks << task015
		group45.tasks << task021
		group46.tasks << task086
		group46.tasks << task021
		group47.tasks << task277
		group47.tasks << task015
		group48.tasks << task277
		group48.tasks << task086
		group49.tasks << task275
		group50.tasks << task276
		group51.tasks << task198
		group52.tasks << task021
		group53.tasks << task277
		group54.tasks << task212
		group55.tasks << task019
		group56.tasks << task021
		group56.tasks << task019
		group57.tasks << task277
		group57.tasks << task019
		group58.tasks << task109
		group60.tasks << task112
		group60.tasks << task021
		group61.tasks << task112
		group61.tasks << task277
		group62.tasks << task017
		group63.tasks << task017
		group63.tasks << task021
		group64.tasks << task277
		group64.tasks << task017
		group65.tasks << task106
		group66.tasks << task278
		group67.tasks << task278
		group67.tasks << task021
		group68.tasks << task278
		group68.tasks << task277
		group69.tasks << task107
		group70.tasks << task021
		group70.tasks << task107
		group71.tasks << task107
		group71.tasks << task277
		group72.tasks << task191
		group73.tasks << task339
		group74.tasks << task000
		group75.tasks << task006
		group76.tasks << task008
		group77.tasks << task009
		group78.tasks << task010
		group79.tasks << task076
		group80.tasks << task105
		group81.tasks << task301
		group82.tasks << task211
		group83.tasks << task007
		group84.tasks << task114
		group85.tasks << task088
		group86.tasks << task279
		group87.tasks << task200
		group88.tasks << task010
		group88.tasks << task200
		group89.tasks << task200
		group89.tasks << task009
		group90.tasks << task200
		group90.tasks << task076
		group91.tasks << task105
		group91.tasks << task200
		group92.tasks << task200
		group92.tasks << task301
		group93.tasks << task201
		group94.tasks << task009
		group94.tasks << task201
		group95.tasks << task201
		group95.tasks << task076
		group96.tasks << task201
		group96.tasks << task105
		group97.tasks << task201
		group97.tasks << task301
		group98.tasks << task202
		group99.tasks << task202
		group99.tasks << task105
		group100.tasks << task301
		group100.tasks << task202
		group101.tasks << task203
		group102.tasks << task105
		group102.tasks << task203
		group103.tasks << task301
		group103.tasks << task203
		group104.tasks << task313
		group105.tasks << task314
		group106.tasks << task315
		group107.tasks << task350
		group108.tasks << task065
		group109.tasks << task113
		group109.tasks << task065
		group110.tasks << task113
		group110.tasks << task409
		group111.tasks << task888
		group112.tasks << task153
		group113.tasks << task066
		group114.tasks << task067
		group115.tasks << task154
		group116.tasks << task302
		group117.tasks << task303
		group118.tasks << task304
		group119.tasks << task154
		group119.tasks << task302
		group120.tasks << task154
		group120.tasks << task303
		group121.tasks << task304
		group121.tasks << task154
		group122.tasks << task073
		group123.tasks << task073
		group123.tasks << task302
		group124.tasks << task073
		group124.tasks << task303
		group125.tasks << task304
		group125.tasks << task280
		group126.tasks << task280
		group127.tasks << task110
		group128.tasks << task155
		group129.tasks << task322
		group130.tasks << task170
		group131.tasks << task082
		group131.tasks << task170
		group132.tasks << task082
		group133.tasks << task171
		group134.tasks << task025
		group135.tasks << task026
		group136.tasks << task196
		group137.tasks << task282
		group138.tasks << task283
		group139.tasks << task179
		group140.tasks << task174
		group141.tasks << task022
		group142.tasks << task023
		group143.tasks << task024
		group144.tasks << task190
		group145.tasks << task194
		group146.tasks << task190
		group146.tasks << task194
		group147.tasks << task122
		group148.tasks << task317
		group149.tasks << task318
		group150.tasks << task319
		group151.tasks << task115
		group152.tasks << task068
		group153.tasks << task103
		group154.tasks << task103
		group154.tasks << task323
		group155.tasks << task327
		group155.tasks << task103
		group156.tasks << task328
		group156.tasks << task103
		group157.tasks << task105
		group157.tasks << task103
		group158.tasks << task301
		group158.tasks << task328
		group158.tasks << task103
		group159.tasks << task281
		group160.tasks << task104
		group161.tasks << task323
		group162.tasks << task327
		group163.tasks << task328
		group164.tasks << task087
		group165.tasks << task087
		group165.tasks << task009
		group166.tasks << task087
		group166.tasks << task076
		group167.tasks << task316
		group168.tasks << task113
		group169.tasks << task294
		group170.tasks << task195
		group171.tasks << task295
		group172.tasks << task296
		group173.tasks << task297
		group174.tasks << task047
		group175.tasks << task121
		group176.tasks << task051
		group177.tasks << task144
		group178.tasks << task147
		group179.tasks << task059
		group180.tasks << task146
		group181.tasks << task056
		group182.tasks << task060
		group183.tasks << task089
		group184.tasks << task214
		group185.tasks << task305
		group186.tasks << task306
		group187.tasks << task307
		group188.tasks << task205
		group189.tasks << task206
		group190.tasks << task036
		group191.tasks << task038
		group192.tasks << task217
		group193.tasks << task213
		group194.tasks << task284
		group195.tasks << task320
		group196.tasks << task156
		group197.tasks << task128
		group198.tasks << task383
		group199.tasks << task416
		group200.tasks << task071
		group201.tasks << task162
		group202.tasks << task028
		group203.tasks << task164
		group204.tasks << task414
		group205.tasks << task415
		group206.tasks << task165
		group207.tasks << task164
		group207.tasks << task165
		group208.tasks << task414
		group208.tasks << task165
		group209.tasks << task165
		group209.tasks << task415
		group210.tasks << task166
		group211.tasks << task166
		group211.tasks << task164
		group212.tasks << task166
		group212.tasks << task414
		group213.tasks << task166
		group213.tasks << task415
		group214.tasks << task169
		group215.tasks << task033
		group216.tasks << task127
		group217.tasks << task160
		group218.tasks << task224
		group219.tasks << task285
		group220.tasks << task161
		group221.tasks << task163
		group222.tasks << task095
		group223.tasks << task286
		group224.tasks << task287
		group225.tasks << task288
		group226.tasks << task289
		group227.tasks << task290
		group228.tasks << task095
		group228.tasks << task184
		group229.tasks << task286
		group229.tasks << task184
		group230.tasks << task184
		group230.tasks << task287
		group231.tasks << task184
		group231.tasks << task288
		group232.tasks << task184
		group232.tasks << task289
		group233.tasks << task184
		group233.tasks << task290
		group234.tasks << task184
		group235.tasks << task173
		group236.tasks << task157
		group237.tasks << task083
		group238.tasks << task176
		group239.tasks << task176
		group239.tasks << task083
		group240.tasks << task177
		group241.tasks << task177
		group241.tasks << task083
		group242.tasks << task178
		group243.tasks << task083
		group243.tasks << task178
		group244.tasks << task181
		group245.tasks << task182
		group246.tasks << task291
		group247.tasks << task185
		group248.tasks << task186
		group249.tasks << task187
		group250.tasks << task188
		group251.tasks << task172
		group252.tasks << task292
		group253.tasks << task293
		group254.tasks << task312
		group255.tasks << task356
		group256.tasks << task357
		group257.tasks << task358
		group258.tasks << task359
		group259.tasks << task360
		group260.tasks << task361
		group261.tasks << task124
		group262.tasks << task129
		group263.tasks << task180
		group264.tasks << task216
		group265.tasks << task227
		group266.tasks << task228
		group267.tasks << task229
		group268.tasks << task230
		group269.tasks << task231
		group270.tasks << task232
		group271.tasks << task233
		group272.tasks << task234
		group273.tasks << task235
		group274.tasks << task236
		group275.tasks << task237
		group276.tasks << task238
		group277.tasks << task239
		group278.tasks << task240
		group279.tasks << task241
		group280.tasks << task242
		group281.tasks << task243
		group282.tasks << task244
		group283.tasks << task245
		group284.tasks << task246
		group285.tasks << task247
		group286.tasks << task248
		group287.tasks << task249
		group288.tasks << task250
		group289.tasks << task251
		group290.tasks << task252
		group291.tasks << task253
		group292.tasks << task254
		group293.tasks << task255
		group294.tasks << task256
		group295.tasks << task257
		group296.tasks << task258
		group297.tasks << task259
		group298.tasks << task260
		group299.tasks << task261
		group300.tasks << task262
		group301.tasks << task263
		group302.tasks << task264
		group303.tasks << task265
		group304.tasks << task266
		group305.tasks << task267
		group306.tasks << task268
		group307.tasks << task269
		group308.tasks << task270
		group309.tasks << task300
		group310.tasks << task324
		group311.tasks << task325
		group312.tasks << task326
		group313.tasks << task326
		group313.tasks << task009
		group314.tasks << task326
		group314.tasks << task076
		group315.tasks << task329
		group316.tasks << task330
		group317.tasks << task332
		group318.tasks << task334
		group319.tasks << task335
		group320.tasks << task336
		group321.tasks << task362
		group322.tasks << task337
		group323.tasks << task338
		group324.tasks << task074
		group325.tasks << task192
		group326.tasks << task193
		group327.tasks << task118
		group328.tasks << task090
		group329.tasks << task340
		group330.tasks << task341
		group331.tasks << task342
		group332.tasks << task343
		group333.tasks << task344
		group334.tasks << task345
		group335.tasks << task346
		group336.tasks << task347
		group337.tasks << task355
		group338.tasks << task363
		group339.tasks << task364
		group340.tasks << task365
		group341.tasks << task366
		group342.tasks << task367
		group343.tasks << task369
		group344.tasks << task370
		group345.tasks << task371
		group346.tasks << task372
		group347.tasks << task373
		group348.tasks << task374
		group349.tasks << task375
		group350.tasks << task376
		group351.tasks << task377
		group352.tasks << task378
		group353.tasks << task379
		group354.tasks << task368
		group355.tasks << task380
		group356.tasks << task381
		group357.tasks << task437
		group358.tasks << task382
		group359.tasks << task429
		group360.tasks << task427
		group361.tasks << task029
		group362.tasks << task387
		group363.tasks << task100
		group364.tasks << task101
		group365.tasks << task417
		group366.tasks << task420
		group367.tasks << task421
		group368.tasks << task422
		group369.tasks << task423
		group370.tasks << task424
		group371.tasks << task425
		group372.tasks << task909
		group373.tasks << task910
		group374.tasks << task911
		group375.tasks << task912
		group376.tasks << task913
		group377.tasks << task914
		group378.tasks << task915
		group379.tasks << task916
		group380.tasks << task917
		group381.tasks << task901
		group382.tasks << task902
		group383.tasks << task903
		group384.tasks << task904
		group385.tasks << task905
		group386.tasks << task906
		group387.tasks << task907
		group388.tasks << task908
		group389.tasks << task008
		group389.tasks << task010
		group389.tasks << task006
		group390.tasks << task008
		group390.tasks << task010
		group390.tasks << task006
		group390.tasks << task009
		group391.tasks << task076
		group391.tasks << task008
		group391.tasks << task010
		group391.tasks << task006
		group392.tasks << task103
		group392.tasks << task301
		group393.tasks << task103
		group393.tasks << task328
		group393.tasks << task105
		group394.tasks << task019
		group394.tasks << task109
		group395.tasks << task021
		group395.tasks << task019
		group395.tasks << task109
		group396.tasks << task019
		group396.tasks << task109
		group396.tasks << task277
		group397.tasks << task409
		group398.tasks << task187
		group398.tasks << task007
		group399.tasks << task188
		group399.tasks << task007
		group400.tasks << task112
		group401.tasks << task150
		group402.tasks << task272
		group402.tasks << task150
		group403.tasks << task419
		group404.tasks << task013
		group404.tasks << task012
		group405.tasks << task151
		group405.tasks << task012
		group406.tasks << task150
		group406.tasks << task012
		group407.tasks << task426

		task001.groups << group1
		task004.groups << group1
		task077.groups << group2
		task079.groups << group2
		task004.groups << group3
		task385.groups << group3
		task004.groups << group4
		task386.groups << group4
		task001.groups << group5
		task077.groups << group6
		task385.groups << group7
		task386.groups << group8
		task081.groups << group9
		task321.groups << group10
		task410.groups << group11
		task411.groups << group12
		task412.groups << group13
		task413.groups << group14
		task004.groups << group15
		task079.groups << group16
		task002.groups << group17
		task149.groups << group18
		task004.groups << group19
		task149.groups << group19
		task349.groups << group20
		task222.groups << group21
		task215.groups << group22
		task225.groups << group23
		task226.groups << group24
		task331.groups << group25
		task333.groups << group26
		task218.groups << group27
		task271.groups << group28
		task012.groups << group29
		task013.groups << group30
		task151.groups << group31
		task272.groups << group32
		task013.groups << group32
		task151.groups << group33
		task272.groups << group33
		task092.groups << group34
		task175.groups << group35
		task108.groups << group36
		task273.groups << group37
		task108.groups << group38
		task273.groups << group38
		task274.groups << group39
		task014.groups << group40
		task111.groups << group41
		task138.groups << group42
		task015.groups << group43
		task086.groups << group44
		task015.groups << group45
		task021.groups << group45
		task086.groups << group46
		task021.groups << group46
		task277.groups << group47
		task015.groups << group47
		task277.groups << group48
		task086.groups << group48
		task275.groups << group49
		task276.groups << group50
		task198.groups << group51
		task021.groups << group52
		task277.groups << group53
		task212.groups << group54
		task019.groups << group55
		task021.groups << group56
		task019.groups << group56
		task277.groups << group57
		task019.groups << group57
		task109.groups << group58
		task112.groups << group60
		task021.groups << group60
		task112.groups << group61
		task277.groups << group61
		task017.groups << group62
		task017.groups << group63
		task021.groups << group63
		task277.groups << group64
		task017.groups << group64
		task106.groups << group65
		task278.groups << group66
		task278.groups << group67
		task021.groups << group67
		task278.groups << group68
		task277.groups << group68
		task107.groups << group69
		task021.groups << group70
		task107.groups << group70
		task107.groups << group71
		task277.groups << group71
		task191.groups << group72
		task339.groups << group73
		task000.groups << group74
		task006.groups << group75
		task008.groups << group76
		task009.groups << group77
		task010.groups << group78
		task076.groups << group79
		task105.groups << group80
		task301.groups << group81
		task211.groups << group82
		task007.groups << group83
		task114.groups << group84
		task088.groups << group85
		task279.groups << group86
		task200.groups << group87
		task010.groups << group88
		task200.groups << group88
		task200.groups << group89
		task009.groups << group89
		task200.groups << group90
		task076.groups << group90
		task105.groups << group91
		task200.groups << group91
		task200.groups << group92
		task301.groups << group92
		task201.groups << group93
		task009.groups << group94
		task201.groups << group94
		task201.groups << group95
		task076.groups << group95
		task201.groups << group96
		task105.groups << group96
		task201.groups << group97
		task301.groups << group97
		task202.groups << group98
		task202.groups << group99
		task105.groups << group99
		task301.groups << group100
		task202.groups << group100
		task203.groups << group101
		task105.groups << group102
		task203.groups << group102
		task301.groups << group103
		task203.groups << group103
		task313.groups << group104
		task314.groups << group105
		task315.groups << group106
		task350.groups << group107
		task065.groups << group108
		task113.groups << group109
		task065.groups << group109
		task113.groups << group110
		task409.groups << group110
		task888.groups << group111
		task153.groups << group112
		task066.groups << group113
		task067.groups << group114
		task154.groups << group115
		task302.groups << group116
		task303.groups << group117
		task304.groups << group118
		task154.groups << group119
		task302.groups << group119
		task154.groups << group120
		task303.groups << group120
		task304.groups << group121
		task154.groups << group121
		task073.groups << group122
		task073.groups << group123
		task302.groups << group123
		task073.groups << group124
		task303.groups << group124
		task304.groups << group125
		task280.groups << group125
		task280.groups << group126
		task110.groups << group127
		task155.groups << group128
		task322.groups << group129
		task170.groups << group130
		task082.groups << group131
		task170.groups << group131
		task082.groups << group132
		task171.groups << group133
		task025.groups << group134
		task026.groups << group135
		task196.groups << group136
		task282.groups << group137
		task283.groups << group138
		task179.groups << group139
		task174.groups << group140
		task022.groups << group141
		task023.groups << group142
		task024.groups << group143
		task190.groups << group144
		task194.groups << group145
		task190.groups << group146
		task194.groups << group146
		task122.groups << group147
		task317.groups << group148
		task318.groups << group149
		task319.groups << group150
		task115.groups << group151
		task068.groups << group152
		task103.groups << group153
		task103.groups << group154
		task323.groups << group154
		task327.groups << group155
		task103.groups << group155
		task328.groups << group156
		task103.groups << group156
		task105.groups << group157
		task103.groups << group157
		task301.groups << group158
		task328.groups << group158
		task103.groups << group158
		task281.groups << group159
		task104.groups << group160
		task323.groups << group161
		task327.groups << group162
		task328.groups << group163
		task087.groups << group164
		task087.groups << group165
		task009.groups << group165
		task087.groups << group166
		task076.groups << group166
		task316.groups << group167
		task113.groups << group168
		task294.groups << group169
		task195.groups << group170
		task295.groups << group171
		task296.groups << group172
		task297.groups << group173
		task047.groups << group174
		task121.groups << group175
		task051.groups << group176
		task144.groups << group177
		task147.groups << group178
		task059.groups << group179
		task146.groups << group180
		task056.groups << group181
		task060.groups << group182
		task089.groups << group183
		task214.groups << group184
		task305.groups << group185
		task306.groups << group186
		task307.groups << group187
		task205.groups << group188
		task206.groups << group189
		task036.groups << group190
		task038.groups << group191
		task217.groups << group192
		task213.groups << group193
		task284.groups << group194
		task320.groups << group195
		task156.groups << group196
		task128.groups << group197
		task383.groups << group198
		task416.groups << group199
		task071.groups << group200
		task162.groups << group201
		task028.groups << group202
		task164.groups << group203
		task414.groups << group204
		task415.groups << group205
		task165.groups << group206
		task164.groups << group207
		task165.groups << group207
		task414.groups << group208
		task165.groups << group208
		task165.groups << group209
		task415.groups << group209
		task166.groups << group210
		task166.groups << group211
		task164.groups << group211
		task166.groups << group212
		task414.groups << group212
		task166.groups << group213
		task415.groups << group213
		task169.groups << group214
		task033.groups << group215
		task127.groups << group216
		task160.groups << group217
		task224.groups << group218
		task285.groups << group219
		task161.groups << group220
		task163.groups << group221
		task095.groups << group222
		task286.groups << group223
		task287.groups << group224
		task288.groups << group225
		task289.groups << group226
		task290.groups << group227
		task095.groups << group228
		task184.groups << group228
		task286.groups << group229
		task184.groups << group229
		task184.groups << group230
		task287.groups << group230
		task184.groups << group231
		task288.groups << group231
		task184.groups << group232
		task289.groups << group232
		task184.groups << group233
		task290.groups << group233
		task184.groups << group234
		task173.groups << group235
		task157.groups << group236
		task083.groups << group237
		task176.groups << group238
		task176.groups << group239
		task083.groups << group239
		task177.groups << group240
		task177.groups << group241
		task083.groups << group241
		task178.groups << group242
		task083.groups << group243
		task178.groups << group243
		task181.groups << group244
		task182.groups << group245
		task291.groups << group246
		task185.groups << group247
		task186.groups << group248
		task187.groups << group249
		task188.groups << group250
		task172.groups << group251
		task292.groups << group252
		task293.groups << group253
		task312.groups << group254
		task356.groups << group255
		task357.groups << group256
		task358.groups << group257
		task359.groups << group258
		task360.groups << group259
		task361.groups << group260
		task124.groups << group261
		task129.groups << group262
		task180.groups << group263
		task216.groups << group264
		task227.groups << group265
		task228.groups << group266
		task229.groups << group267
		task230.groups << group268
		task231.groups << group269
		task232.groups << group270
		task233.groups << group271
		task234.groups << group272
		task235.groups << group273
		task236.groups << group274
		task237.groups << group275
		task238.groups << group276
		task239.groups << group277
		task240.groups << group278
		task241.groups << group279
		task242.groups << group280
		task243.groups << group281
		task244.groups << group282
		task245.groups << group283
		task246.groups << group284
		task247.groups << group285
		task248.groups << group286
		task249.groups << group287
		task250.groups << group288
		task251.groups << group289
		task252.groups << group290
		task253.groups << group291
		task254.groups << group292
		task255.groups << group293
		task256.groups << group294
		task257.groups << group295
		task258.groups << group296
		task259.groups << group297
		task260.groups << group298
		task261.groups << group299
		task262.groups << group300
		task263.groups << group301
		task264.groups << group302
		task265.groups << group303
		task266.groups << group304
		task267.groups << group305
		task268.groups << group306
		task269.groups << group307
		task270.groups << group308
		task300.groups << group309
		task324.groups << group310
		task325.groups << group311
		task326.groups << group312
		task326.groups << group313
		task009.groups << group313
		task326.groups << group314
		task076.groups << group314
		task329.groups << group315
		task330.groups << group316
		task332.groups << group317
		task334.groups << group318
		task335.groups << group319
		task336.groups << group320
		task362.groups << group321
		task337.groups << group322
		task338.groups << group323
		task074.groups << group324
		task192.groups << group325
		task193.groups << group326
		task118.groups << group327
		task090.groups << group328
		task340.groups << group329
		task341.groups << group330
		task342.groups << group331
		task343.groups << group332
		task344.groups << group333
		task345.groups << group334
		task346.groups << group335
		task347.groups << group336
		task355.groups << group337
		task363.groups << group338
		task364.groups << group339
		task365.groups << group340
		task366.groups << group341
		task367.groups << group342
		task369.groups << group343
		task370.groups << group344
		task371.groups << group345
		task372.groups << group346
		task373.groups << group347
		task374.groups << group348
		task375.groups << group349
		task376.groups << group350
		task377.groups << group351
		task378.groups << group352
		task379.groups << group353
		task368.groups << group354
		task380.groups << group355
		task381.groups << group356
		task437.groups << group357
		task382.groups << group358
		task429.groups << group359
		task427.groups << group360
		task029.groups << group361
		task387.groups << group362
		task100.groups << group363
		task101.groups << group364
		task417.groups << group365
		task420.groups << group366
		task421.groups << group367
		task422.groups << group368
		task423.groups << group369
		task424.groups << group370
		task425.groups << group371
		task909.groups << group372
		task910.groups << group373
		task911.groups << group374
		task912.groups << group375
		task913.groups << group376
		task914.groups << group377
		task915.groups << group378
		task916.groups << group379
		task917.groups << group380
		task901.groups << group381
		task902.groups << group382
		task903.groups << group383
		task904.groups << group384
		task905.groups << group385
		task906.groups << group386
		task907.groups << group387
		task908.groups << group388
		task008.groups << group389
		task010.groups << group389
		task006.groups << group389
		task008.groups << group390
		task010.groups << group390
		task006.groups << group390
		task009.groups << group390
		task076.groups << group391
		task008.groups << group391
		task010.groups << group391
		task006.groups << group391
		task103.groups << group392
		task301.groups << group392
		task103.groups << group393
		task328.groups << group393
		task105.groups << group393
		task019.groups << group394
		task109.groups << group394
		task021.groups << group395
		task019.groups << group395
		task109.groups << group395
		task019.groups << group396
		task109.groups << group396
		task277.groups << group396
		task409.groups << group397
		task187.groups << group398
		task007.groups << group398
		task188.groups << group399
		task007.groups << group399
		task112.groups << group400
		task150.groups << group401
		task272.groups << group402
		task150.groups << group402
		task419.groups << group403
		task013.groups << group404
		task012.groups << group404
		task151.groups << group405
		task012.groups << group405
		task150.groups << group406
		task012.groups << group406
		task426.groups << group407
	}

	// endregion

	// region getDaysMechanics

	void "test get day mechanics sort correct not defined positions"() {
		given:
		Date date = new Date()
		List<Map> dayMechanics = [
				[day: 1567090800000],
				[day: 1567090800000],
				[day: 1566939600000]
		]
		schedulesDatabaseClient.getMechanics(date, true) >> dayMechanics

		when:
		Map<java.sql.Date, List<EmployeeSchedule>> daysMechanics = panelService.getDaysMechanics(date)

		then:
		daysMechanics.size() == 2
		daysMechanics[new java.sql.Date(new Date(1567090800000).time)].size() == 2
		daysMechanics[new java.sql.Date(new Date(1566939600000).time)].size() == 1
	}

	// endregion

	// region getOrderGroups

	void "test get order groups 1"() {
		when:
		List<GroupUnits> groupUnits = panelService.getOrderGroups(order4Articles, [task026, task066, task129, task169])

		then:
		groupUnits.size() == 4
		groupUnits[0].group.code == 135
		groupUnits[1].group.code == 113
		groupUnits[2].group.code == 262
		groupUnits[3].group.code == 214
	}

	void "test get order groups 2"() {
		given: // Articles 99108 and 99273 form group 38
		Order order = new Order(
				number: 1,
				timeInfo: [new OrderTime(shortCode: 'C1')],
				lines: [
						new OrderLine(article: new Article(code: 99108)),
						new OrderLine(article: new Article(code: 99273)),
						new OrderLine(article: new Article(code: 99169)),
				],
				vehicle: new Vehicle([:])
		)

		when:
		List<GroupUnits> groupUnits = panelService.getOrderGroups(order, [task108, task169, task273])

		then:
		groupUnits.size() == 2
		groupUnits[0].group.code == 38
		groupUnits[1].group.code == 214
	}

	void "test get order groups 3"() {
		given: // Now order doesn't have 99273 and 99108 forms group 36
		Order order = new Order(
				number: 1,
				timeInfo: [new OrderTime(shortCode: 'C1')],
				lines: [
						new OrderLine(article: new Article(code: 99108)),
						new OrderLine(article: new Article(code: 99086)),
						new OrderLine(article: new Article(code: 99169)),
				],
				vehicle: new Vehicle([:])
		)

		when:
		List<GroupUnits> groupUnits = panelService.getOrderGroups(order, [task108, task086, task169])

		then:
		groupUnits.size() == 3
		groupUnits[0].group.code == 36
		groupUnits[1].group.code == 44
		groupUnits[2].group.code == 214
	}

	void "test get order groups 4"() {
		given:
		Order order = new Order(
				number: 1,
				timeInfo: [new OrderTime(shortCode: 'C1')],
				lines: [
						new OrderLine(article: new Article(code: 99086)),
						new OrderLine(article: new Article(code: 99021)),
						new OrderLine(article: new Article(code: 99277)),
				],
				vehicle: new Vehicle([:])
		)

		when:
		List<GroupUnits> groupUnits = panelService.getOrderGroups(order, [task086, task021, task277])

		then:
		groupUnits.size() == 2
		groupUnits[0].group.code == 46
		groupUnits[1].group.code == 53
	}

	void "test get order groups 5"() {
		given:
		Order order = new Order(
				number: 1,
				timeInfo: [new OrderTime(shortCode: 'C1')],
				lines: [
						new OrderLine(article: new Article(code: 99001)),//
						new OrderLine(article: new Article(code: 99004)),//
						new OrderLine(article: new Article(code: 99021)),//
						new OrderLine(article: new Article(code: 99022)),
						new OrderLine(article: new Article(code: 99025)),
						new OrderLine(article: new Article(code: 99026)),
						new OrderLine(article: new Article(code: 99066)),
						new OrderLine(article: new Article(code: 99086)),//
						new OrderLine(article: new Article(code: 99112)),
						new OrderLine(article: new Article(code: 99151)),
						new OrderLine(article: new Article(code: 99200)),
						new OrderLine(article: new Article(code: 99330))
				],
				vehicle: new Vehicle([:])
		)

		when:
		List<GroupUnits> groupUnits = panelService.getOrderGroups(
				order,
				[task001, task004, task021, task022, task025, task026, task066, task086, task112, task151, task200, task330]
		)

		then:
		groupUnits.size() == 10
		groupUnits[0].group.code == 1
		groupUnits[1].group.code == 4
		groupUnits[2].group.code == 5
		groupUnits[3].group.code == 5
		groupUnits[4].group.code == 5
		groupUnits[5].group.code == 5
		groupUnits[6].group.code == 5
		groupUnits[7].group.code == 5
		groupUnits[8].group.code == 5
		groupUnits[9].group.code == 5
	}

//	void "test get order groups one article one absorbable task"() {
//		given:
//		group1.tasks = [task1]
//		task1.absorbable = true
//		task1.groups = [group1]
////		List<Task> tasks = [
////				new Task(articleCode: 1, absorbable: true, groups: [new Group(code: 1)])
////		]
//
//		when:
//		List<GroupUnits> groupUnits = panelService.getOrderGroups(order1Article, [task1])
//
//		then:
//		groupUnits.size() == 1
//		groupUnits[0].group.code == 1
//	}
//
//	void "test get order groups several articles several absorbable tasks"() {
//		given:
//		group1.tasks = [task1, task2, task3, task4]
//		task2.absorbable = true
//		task3.absorbable = true
//		task4.absorbable = true
//		task1.groups = [group1]
//		task2.groups = [group1]
//		task3.groups = [group1]
//		task4.groups = [group1]
//
//		when:
//		List<GroupUnits> groupUnits = panelService.getOrderGroups(order4Articles, [task1, task2, task3, task4])
//
//		then:
//		groupUnits.size() == 1
//		groupUnits[0].group.code == 1
//	}

	// endregion

	// region buildOrdersCards

	void "test build order cards 1"() {
		given:
		GroupUnits groupUnits = new GroupUnits(group1, [1])
		Map<Order, List<GroupUnits>> ordersGroupsUnits = [
				(order1Article): [groupUnits]
		]
		panelDatabaseClient.getDurations(
				(Map<Integer, List<GroupUnits>>) ordersGroupsUnits.collectEntries { [(it.key.number): (it.value)] }
		) >> [(order1Article.number): [[group: group1, units: 1, duration: 30]]]

		when:
		List<Card> cards = panelService.buildOrdersCards([order1Article], ordersGroupsUnits)

		then:
		cards.size() == 1
		cards[0].order.number == order1Article.number
		cards[0].order.code == order1Article.timeInfo.shortCode
		cards[0].code == group1.shortName
		cards[0].group.code == group1.code
		cards[0].status == Card.Status.DEFAULT
		cards[0].duration == 30
	}

	void "test build order cards 2"() {
		given:
		GroupUnits groupUnits1 = new GroupUnits(group1, [1])
		GroupUnits groupUnits2 = new GroupUnits(group2, [1, 1])
		GroupUnits groupUnits3 = new GroupUnits(group3, [3])
		Map<Order, List<GroupUnits>> ordersGroupsUnits = [
				(order1Article): [groupUnits1],
				(order4Articles): [groupUnits1, groupUnits2, groupUnits3]
		]
		panelDatabaseClient.getDurations(
				(Map<Integer, List<GroupUnits>>) ordersGroupsUnits.collectEntries { [(it.key.number): (it.value)] }
		) >> [
				(order1Article.number): [[group: group1, units: 1, duration: 10]],
				(order4Articles.number): [
						[group: group1, units: 1, duration: 10],
						[group: group2, units: 2, duration: 30],
						[group: group3, units: 3, duration: 45]
				],
		]

		when:
		List<Card> cards = panelService.buildOrdersCards([order1Article, order4Articles], ordersGroupsUnits)

		then:
		cards.size() == 4
		cards[0].order.number == order1Article.number
		cards[0].group.code == group1.code
		cards[0].duration == 10
		!cards[0].linkedPrevious
		!cards[0].linkedNext
		cards[1].order.number == order4Articles.number
		cards[1].group.code == group1.code
		cards[1].duration == 10
		!cards[1].linkedPrevious
		cards[1].linkedNext == cards[2]
		cards[2].order.number == order4Articles.number
		cards[2].group.code == group2.code
		cards[2].duration == 30
		cards[2].linkedPrevious == cards[1]
		cards[2].linkedNext == cards[3]
		cards[3].order.number == order4Articles.number
		cards[3].group.code == group3.code
		cards[3].duration == 45
		cards[3].linkedPrevious == cards[2]
		!cards[3].linkedNext
	}

	void "test build order cards duration not found for group"() {
		given:
		GroupUnits groupUnits1 = new GroupUnits(group1, [1])
		Map<Order, List<GroupUnits>> ordersGroupsUnits = [
				(order1Article): [groupUnits1]
		]
		panelDatabaseClient.getDurations(
				(Map<Integer, List<GroupUnits>>) ordersGroupsUnits.collectEntries { [(it.key.number): (it.value)] }
		) >> [(order1Article.number): []]

		when:
		List<Card> cards = panelService.buildOrdersCards([order1Article], ordersGroupsUnits)

		then:
		!cards
	}

	// endregion

//	// region checkUpdatedOrderInfo

	void "test check updated card same fields"() {
		given:
		Card builtCard = new Card(duration: 10, code: 'code', order: [number: 1, state: Order.State.A], mechanicCode: '1', status: Card.Status.TEMPORAL, vehicle: [brand: 'FV'])
		Card dayCard = new Card(duration: 10, code: 'code', order: [number: 1, state: Order.State.A], mechanicCode: '1', status: Card.Status.TEMPORAL, vehicle: [brand: 'FV'])

		when:
		boolean updated = panelService.checkUpdatedOrderInfo(dayCard, builtCard)

		then:
		!updated
	}

	void "test check updated card updated order info"() {
		given:
		Card builtCard = new Card(order: [number: 1, code: 'C1'], duration: 20, vehicle: [brand: 'FV'])
		Card dayCard = new Card(order: [number: 1, code: 'C2'], duration: 20, vehicle: [brand: 'FV'])

		when:
		boolean updated = panelService.checkUpdatedOrderInfo(dayCard, builtCard)

		then:
		updated
	}

	void "test check updated card updated vehicle info"() {
		given:
		Card builtCard = new Card(order: [number: 1], vehicle: [brand: 'FV'], duration: 30)
		Card dayCard = new Card(order: [number: 1], vehicle: [brand: 'BMW'], duration: 30)

		when:
		boolean updated = panelService.checkUpdatedOrderInfo(dayCard, builtCard)

		then:
		updated
	}

	// endregion

	// region updateCardOrderInfo

	void "test update card order info"() {
		given:
		Card dayCard = new Card(order: [number: 1, state: 'A'], vehicle: [brand: 'BMW'], duration: 10)
		Card builtCard = new Card(order: [number: 1, state: 'V'], vehicle: [brand: 'FV'], duration: 10)

		when:
		Card updatedDayCard = panelService.updateCardOrderInfo(dayCard, builtCard)

		then:
		updatedDayCard.vehicle.brand == 'FV'
		updatedDayCard.order.state == Order.State.V
	}

	// endregion

	// region findReplacedCard

	void "test find replaced card same tasks"() {
		given:
		List<Card> dayOrderCards = [new Card(group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2]]])]
		Card builtCard = new Card(group: [code: 2, tasks: [[articleCode: 1], [articleCode: 2]]])

		when:
		Card replacedCard = panelService.findReplacedCard(dayOrderCards, builtCard)

		then:
		!replacedCard
	}

	void "test find replaced card one more task"() {
		given:
		List<Card> dayOrderCards = [new Card(group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2]]])]
		Card builtCard = new Card(group: [code: 2, tasks: [[articleCode: 1], [articleCode: 2], [articleCode: 3]]])

		when:
		Card replacedCard = panelService.findReplacedCard(dayOrderCards, builtCard)

		then:
		replacedCard
		replacedCard.group.code == 1
		replacedCard.group.tasks.size() == 2
	}

	void "test find replaced card one less task"() {
		given:
		List<Card> dayOrderCards = [new Card(group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2]]])]
		Card builtCard = new Card(group: [code: 2, tasks: [[articleCode: 1]]])

		when:
		Card replacedCard = panelService.findReplacedCard(dayOrderCards, builtCard)

		then:
		replacedCard
		replacedCard.group.code == 1
		replacedCard.group.tasks.size() == 2
	}

	void "test find replaced card completely different tasks"() {
		given:
		List<Card> dayOrderCards = [new Card(group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2], [articleCode: 3], [articleCode: 4]]])]
		Card builtCard = new Card(group: [code: 2, tasks: [[articleCode: 5], [articleCode: 6], [articleCode: 7]]])

		when:
		Card replacedCard = panelService.findReplacedCard(dayOrderCards, builtCard)

		then:
		!replacedCard
	}

	// endregion

	// region updateCardGroupInfo

	void "test update card group info same groups"() {
		given:
		Card dayCard = new Card(group: [code: 1], duration: 20)
		Card builtCard = new Card(group: [code: 1], duration: 20)

		when:
		Card updatedCard = panelService.updateCardGroupInfo(dayCard, builtCard)

		then:
		updatedCard.group.code == 1
		updatedCard.duration == 20
	}

	void "test update card group info updated group"() {
		given:
		Card dayCard = new Card(group: [code: 1], duration: 20)
		Card builtCard = new Card(group: [code: 2], duration: 30)

		when:
		Card updatedCard = panelService.updateCardGroupInfo(dayCard, builtCard)

		then:
		updatedCard.group.code == 2
		updatedCard.duration == 30
	}

	// endregion

	// region handleExistentGroupCard

	void "test handle existent group card new group"() {
		given:
		UpdateCards updateCards = new UpdateCards()
		List<Card> dayOrderCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		Card builtCard = new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 2])

		when:
		boolean handled = panelService.handleExistentGroupCard(dayOrderCards, builtCard, updateCards)

		then:
		!handled
		!updateCards.updatedCards
		!updateCards.sameCards
	}

	void "test handle existent group card same group not updated card"() {
		given:
		UpdateCards updateCards = new UpdateCards()
		List<Card> dayOrderCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		Card builtCard = new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])

		when:
		boolean handled = panelService.handleExistentGroupCard(dayOrderCards, builtCard, updateCards)

		then:
		handled
		!updateCards.updatedCards
		updateCards.sameCards.size() == 1
	}

	void "test handle existent group card same group updated card"() {
		given:
		UpdateCards updateCards = new UpdateCards()
		List<Card> dayOrderCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		Card builtCard = new Card(order: [number: 1], vehicle: [brand: 'FV'], group: [code: 1])

		when:
		boolean handled = panelService.handleExistentGroupCard(dayOrderCards, builtCard, updateCards)

		then:
		handled
		updateCards.updatedCards
		updateCards.updatedCards.size() == 1
		updateCards.updatedCards[0].vehicle.brand == 'FV'
		!updateCards.sameCards
	}

	// endregion

	// region handleReplacedGroupCard

	void "test handle replaced group card completely new group"() {
		given:
		UpdateCards updateCards = new UpdateCards()
		List<Card> dayOrderCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		Card builtCard = new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 2])

		when:
		panelService.handleReplacedGroupCard(dayOrderCards, builtCard, updateCards)

		then:
		updateCards.newCards
		updateCards.newCards.size() == 1
		updateCards.newCards[0].group.code == 2
		!updateCards.updatedCards
		!updateCards.deletedCards
	}

	void "test handle replaced group card replaced group no updated card"() {
		given:
		UpdateCards updateCards = new UpdateCards()
		List<Card> dayOrderCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2]]])]
		Card builtCard = new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 2, tasks: [[articleCode: 1], [articleCode: 2], [articleCode: 3]]])

		when:
		panelService.handleReplacedGroupCard(dayOrderCards, builtCard, updateCards)

		then:
		updateCards.updatedCards
		updateCards.updatedCards.size() == 1
		updateCards.updatedCards[0].group.code == 2
		updateCards.updatedCards[0].vehicle.brand == 'BMW'
		!updateCards.newCards
		!updateCards.deletedCards
	}

	void "test handle replaced group card replaced group updated card"() {
		given:
		UpdateCards updateCards = new UpdateCards()
		List<Card> dayOrderCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2]]])]
		Card builtCard = new Card(order: [number: 1], vehicle: [brand: 'FV'], group: [code: 2, tasks: [[articleCode: 1], [articleCode: 2], [articleCode: 3]]])

		when:
		panelService.handleReplacedGroupCard(dayOrderCards, builtCard, updateCards)

		then:
		updateCards.updatedCards
		updateCards.updatedCards.size() == 1
		updateCards.updatedCards[0].group.code == 2
		updateCards.updatedCards[0].vehicle.brand == 'FV'
		!updateCards.newCards
		!updateCards.deletedCards
	}

	// endregion

	// region getNewOrUpdatedCards

	void "test get new order cards new card with new group"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = [
				new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]),
				new Card(order: [number: 2], vehicle: [brand: 'BMW'], group: [code: 1])
		]

		when:
		UpdateCards updateCards = panelService.getNewOrUpdatedCards(dayCards, builtCards)

		then:
		updateCards.newCards
		updateCards.newCards.size() == 1
		updateCards.newCards[0].order.number == 2
		updateCards.sameCards
		updateCards.sameCards.size() == 1
		updateCards.sameCards[0].order.number == 1
		!updateCards.updatedCards
		!updateCards.deletedCards
	}

	void "test get updated order cards no updated cards"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]

		when:
		UpdateCards updateCards = panelService.getNewOrUpdatedCards(dayCards, builtCards)

		then:
		updateCards.sameCards.size() == updateCards.getAll().size()
		updateCards.sameCards[0].order.number == 1
	}

	void "test get updated order cards updated order info card"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = [new Card(order: [number: 1], vehicle: [brand: 'FV'], group: [code: 1])]

		when:
		UpdateCards updateCards = panelService.getNewOrUpdatedCards(dayCards, builtCards)

		then:
		updateCards.updatedCards
		updateCards.updatedCards.size() == 1
		updateCards.updatedCards[0].order.number == 1
		updateCards.updatedCards[0].vehicle.brand == 'FV'
		updateCards.updatedCards[0].group.code == 1
		!updateCards.newCards
		!updateCards.deletedCards
		!updateCards.sameCards
	}

	void "test get updated order cards updated replaced card"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2]]])]
		List<Card> builtCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 2, tasks: [[articleCode: 1]]])]

		when:
		UpdateCards updateCards = panelService.getNewOrUpdatedCards(dayCards, builtCards)

		then:
		updateCards.updatedCards
		updateCards.updatedCards.size() == 1
		updateCards.updatedCards[0].order.number == 1
		updateCards.updatedCards[0].vehicle.brand == 'BMW'
		updateCards.updatedCards[0].group.code == 2
		!updateCards.newCards
		!updateCards.deletedCards
		!updateCards.sameCards
	}

	void "test get updated order cards updated replaced card and updated order info"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2]]])]
		List<Card> builtCards = [new Card(order: [number: 1], vehicle: [brand: 'FV'], group: [code: 2, tasks: [[articleCode: 1]]])]

		when:
		UpdateCards updateCards = panelService.getNewOrUpdatedCards(dayCards, builtCards)

		then:
		updateCards.updatedCards
		updateCards.updatedCards.size() == 1
		updateCards.updatedCards[0].order.number == 1
		updateCards.updatedCards[0].vehicle.brand == 'FV'
		updateCards.updatedCards[0].group.code == 2
	}

	// endregion

	// region getDeletedOrdersCards

	void "test deleted orders cards no cards to delete"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]

		when:
		List<Card> cards = panelService.getDeletedOrdersCards([order4Articles], dayCards)

		then:
		!cards
	}

	void "test deleted orders cards card to delete"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 2], vehicle: [brand: 'BMW'], group: [code: 1])]

		when:
		List<Card> cards = panelService.getDeletedOrdersCards([order4Articles], dayCards)

		then:
		cards.size() == 1
		cards[0].order.number == 2
	}

	// endregion

	// region getUpdatedGroupCards

	void "test get updated group deleted cards no cards to delete"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]

		when:
		List<Card> cards = panelService.getUpdatedGroupDeletedCards(dayCards, builtCards)

		then:
		!cards
	}

	void "test get updated group deleted cards cards to delete"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 2])]

		when:
		List<Card> cards = panelService.getUpdatedGroupDeletedCards(dayCards, builtCards)

		then:
		cards.size() == 1
		cards[0].order.number == 1
		cards[0].group.code == 1
	}

	// endregion

	// region deleteCard

	void "test delete card"() {
		given:
		Card card = new Card(order: [number: 2], vehicle: [brand: 'BMW'], group: [code: 1])

		when:
		Card deletedCard = panelService.deleteCard(card)

		then:
		deletedCard.dateDeleted
	}

	// endregion

	// region getDeletedCards

	void "test get deleted cards no deleted cards"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]

		when:
		List<Card> cards = panelService.getDeletedCards([order4Articles], dayCards, builtCards)

		then:
		!cards
	}

	void "test get deleted cards deleted order deleted cards"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = [new Card(order: [number: 2], vehicle: [brand: 'BMW'], group: [code: 1])]

		when:
		List<Card> cards = panelService.getDeletedCards([order1Article], dayCards, builtCards)

		then:
		cards
		cards.size() == 1
		cards[0].order.number == 1
	}

	void "test get deleted cards deleted updated group deleted card"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 2])]

		when:
		List<Card> cards = panelService.getDeletedCards([order4Articles], dayCards, builtCards)

		then:
		cards
		cards.size() == 1
		cards[0].group.code == 1
	}

	// endregion

	// region getCardsToUpdate

	void "test handle cards no actions needed"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]

		when:
		UpdateCards updateCards = panelService.getCardsToUpdate([order4Articles], dayCards, builtCards)

		then:
		!updateCards.newCards
		!updateCards.updatedCards
		!updateCards.deletedCards
		updateCards.sameCards.size() == 1
		updateCards.sameCards[0].order.number == 1
	}

	void "test handle cards new cards"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = dayCards + [new Card(order: [number: 2], vehicle: [brand: 'BMW'], group: [code: 1])]

		when:
		UpdateCards updateCards = panelService.getCardsToUpdate([order4Articles, order1Article], dayCards, builtCards)

		then:
		updateCards.newCards.size() == 1
		updateCards.newCards[0].order.number == 2
		updateCards.sameCards.size() == 1
		updateCards.sameCards[0].order.number == 1
		!updateCards.updatedCards
		!updateCards.deletedCards
	}

	void "test handle cards updated cards"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = [new Card(order: [number: 1], vehicle: [brand: 'FV'], group: [code: 1])]

		when:
		UpdateCards updateCards = panelService.getCardsToUpdate([order4Articles], dayCards, builtCards)

		then:
		updateCards.updatedCards.size() == 1
		updateCards.updatedCards[0].order.number == 1
		updateCards.updatedCards[0].vehicle.brand == 'FV'
		!updateCards.sameCards
	}

	void "test handle cards updated new cards"() {
		given:
		List<Card> dayCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])]
		List<Card> builtCards = [new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 2])]

		when:
		UpdateCards updateCards = panelService.getCardsToUpdate([order4Articles], dayCards, builtCards)

		then:
		updateCards.newCards.size() == 1
		updateCards.newCards[0].group.code == 2
		!updateCards.newCards[0].dateDeleted
		updateCards.deletedCards.size() == 1
		updateCards.deletedCards[0].group.code == 1
		updateCards.deletedCards[0].dateDeleted
		!updateCards.updatedCards
		!updateCards.sameCards
	}

	// endregion

	// region Save cards

	void "test relate cards IDs no relations"() {
		given:
		List<Card> cards = [
				new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])
		]

		when:
		panelService.relateCardsIds(cards)

		then:
		!cards[0].linkedPreviousId
		!cards[0].linkedNextId
	}

	void "test relate cards IDs different orders"() {
		given:
		List<Card> cards = [
				new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]),
				new Card(order: [number: 2], vehicle: [brand: 'BMW'], group: [code: 1])
		]

		when:
		panelService.relateCardsIds(cards)

		then:
		!cards[0].linkedPreviousId
		!cards[0].linkedNextId
		!cards[1].linkedPreviousId
		!cards[1].linkedNextId
	}

	void "test relate cards IDs same order"() {
		given:
		List<Card> cards = [
				new Card(id: 1, order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]),
				new Card(id: 2, order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])
		]

		when:
		panelService.relateCardsIds(cards)

		then:
		!cards[0].linkedPreviousId
		cards[0].linkedNextId == 2
		cards[1].linkedPreviousId == 1
		!cards[1].linkedNextId
	}

	void "test relate cards IDs same order several cards"() {
		given:
		List<Card> cards = [
				new Card(id: 1, order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]),
				new Card(id: 2, order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]),
				new Card(id: 3, order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]),
				new Card(id: 4, order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1])
		]

		when:
		panelService.relateCardsIds(cards)

		then:
		!cards[0].linkedPreviousId
		cards[0].linkedNextId == 2
		cards[1].linkedPreviousId == 1
		cards[1].linkedNextId == 3
		cards[2].linkedPreviousId == 2
		cards[2].linkedNextId == 4
		cards[3].linkedPreviousId == 3
		!cards[3].linkedNextId
	}

	// endregion

}
