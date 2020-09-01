package panel.services

import io.micronaut.test.annotation.MicronautTest
import io.micronaut.test.annotation.MockBean
import panel.clients.CuboDatabaseClient
import panel.clients.PanelDatabaseClient
import panel.pogos.appointmentDays.AppointmentDay
import panel.pogos.appointmentDays.AppointmentType
import panel.pogos.appointmentDays.AppointmentType.AppointmentTypeCode
import panel.pogos.appointmentDays.AppointmentTypeValues
import panel.pogos.appointmentDays.UpdateAppointmentDays
import panel.pogos.cards.Card
import panel.pogos.cards.Group
import panel.pogos.cards.GroupUnits
import panel.pogos.cards.Task
import panel.pogos.firstLoad.UpdateCards
import panel.pogos.fviberi.*
import panel.pogos.schedules.EmployeeSchedule
import panel.pogos.schedules.Schedule
import panel.utils.Constants
import spock.lang.Shared
import spock.lang.Specification

import javax.inject.Inject
import java.time.LocalDate
import java.time.LocalTime

@MicronautTest
class PanelServiceSpec extends Specification {

	// region Collaborators

	@Inject
	PanelService panelService

	@Inject
	PanelDatabaseClient panelDatabaseClient

	@Inject
	CuboDatabaseClient cuboDatabaseClient

	@MockBean(PanelDatabaseClient)
	PanelDatabaseClient panelDatabaseClient() {
		Mock(PanelDatabaseClient)
	}

//	@MockBean(FviberiDatabaseClient)
//	FviberiDatabaseClient fviberiDatabaseClient() {
//		Mock(FviberiDatabaseClient)
//	}

	@MockBean(CuboDatabaseClient)
	CuboDatabaseClient cuboDatabaseClient() {
		Mock(CuboDatabaseClient)
	}

	// endregion

	// region Variables

	@Shared
	Order order4Articles = new Order(
		number: 1,
		timeInfo: new OrderTime(shortCode: 'C1'),
		lines: [
			new OrderLine(article: [code: 99026]),
			new OrderLine(article: [code: 99066]),
			new OrderLine(article: [code: 99129]),
			new OrderLine(article: [code: 99169]),
		],
		vehicle: new Vehicle([:]),
		client: new Client([:])
	)

	@Shared
	Order order1Article = new Order(
		number: 2,
		timeInfo: new OrderTime(shortCode: 'C2'),
		lines: [
				new OrderLine(article: [code: 1])
		],
		vehicle: new Vehicle([:]),
		client: new Client([:])
	)

	@Shared LocalDate today
	@Shared LocalDate tomorrow
	@Shared LocalTime time8
	@Shared LocalTime time15
	@Shared LocalTime time20

	@Shared
	List<AppointmentType> appointmentTypes

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
	@Shared Task task225 = new Task(articleCode: 99225, groups: [], absorbable: true)
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
	@Shared Task task339 = new Task(articleCode: 99339, groups: [], absorbable: true)
	@Shared Task task349 = new Task(articleCode: 99349, groups: [])
	@Shared Task task350 = new Task(articleCode: 99350, groups: [])
	@Shared Task task356 = new Task(articleCode: 99356, groups: [])
	@Shared Task task357 = new Task(articleCode: 99357, groups: [])
	@Shared Task task358 = new Task(articleCode: 99358, groups: [])
	@Shared Task task359 = new Task(articleCode: 99359, groups: [])
	@Shared Task task360 = new Task(articleCode: 99360, groups: [])
	@Shared Task task361 = new Task(articleCode: 99361, groups: [])
	@Shared Task task383 = new Task(articleCode: 99383, groups: [])
	@Shared Task task384 = new Task(articleCode: 99384, groups: [])
	@Shared Task task385 = new Task(articleCode: 99385, groups: [])
	@Shared Task task386 = new Task(articleCode: 99386, groups: [])
	@Shared Task task409 = new Task(articleCode: 99409, groups: [])
	@Shared Task task410 = new Task(articleCode: 99410, groups: [])
	@Shared Task task411 = new Task(articleCode: 99411, groups: [])
	@Shared Task task412 = new Task(articleCode: 99412, groups: [])
	@Shared Task task413 = new Task(articleCode: 99413, groups: [])
	@Shared Task task414 = new Task(articleCode: 99414, groups: [])
	@Shared Task task415 = new Task(articleCode: 99415, groups: [])
	@Shared Task task416 = new Task(articleCode: 99416, groups: [])
	@Shared Task task888 = new Task(articleCode: 99888, groups: [])

	@Shared Group group1 = new Group(code: 1, shortName: 'SN', tasks: [], color: [order: 0])
	@Shared Group group2 = new Group(code: 2, tasks: [], color: [order: 0])
	@Shared Group group3 = new Group(code: 3, tasks: [], color: [order: 0])
	@Shared Group group4 = new Group(code: 4, tasks: [], color: [order: 0])
	@Shared Group group5 = new Group(code: 5, tasks: [], color: [order: 0])
	@Shared Group group6 = new Group(code: 6, tasks: [], color: [order: 0])
	@Shared Group group7 = new Group(code: 7, tasks: [], color: [order: 0])
	@Shared Group group8 = new Group(code: 8, tasks: [], color: [order: 0])
	@Shared Group group9 = new Group(code: 9, tasks: [], color: [order: 0])
	@Shared Group group10 = new Group(code: 10, tasks: [], color: [order: 0])
	@Shared Group group11 = new Group(code: 11, tasks: [], color: [order: 0])
	@Shared Group group12 = new Group(code: 12, tasks: [], color: [order: 0])
	@Shared Group group13 = new Group(code: 13, tasks: [], color: [order: 3])
	@Shared Group group14 = new Group(code: 14, tasks: [], color: [order: 0])
	@Shared Group group15 = new Group(code: 15, tasks: [], color: [order: 0])
	@Shared Group group16 = new Group(code: 16, tasks: [], color: [order: 0])
	@Shared Group group17 = new Group(code: 17, tasks: [], color: [order: 0])
	@Shared Group group18 = new Group(code: 18, tasks: [], color: [order: 0])
	@Shared Group group19 = new Group(code: 19, tasks: [], color: [order: 0])
	@Shared Group group20 = new Group(code: 20, tasks: [], color: [order: 0])
	@Shared Group group21 = new Group(code: 21, tasks: [], color: [order: 0])
	@Shared Group group22 = new Group(code: 22, tasks: [], color: [order: 0])
	@Shared Group group23 = new Group(code: 23, tasks: [], color: [order: 0])
	@Shared Group group24 = new Group(code: 24, tasks: [], color: [order: 0])
	@Shared Group group25 = new Group(code: 25, tasks: [], color: [order: 0])
	@Shared Group group26 = new Group(code: 26, tasks: [], color: [order: 0])
	@Shared Group group27 = new Group(code: 27, tasks: [], color: [order: 0])
	@Shared Group group28 = new Group(code: 28, tasks: [], color: [order: 0])
	@Shared Group group29 = new Group(code: 29, tasks: [], color: [order: 7])
	@Shared Group group30 = new Group(code: 30, tasks: [], color: [order: 7])
	@Shared Group group31 = new Group(code: 31, tasks: [], color: [order: 7])
	@Shared Group group32 = new Group(code: 32, tasks: [], color: [order: 7])
	@Shared Group group33 = new Group(code: 33, tasks: [], color: [order: 7])
	@Shared Group group34 = new Group(code: 34, tasks: [], color: [order: 3])
	@Shared Group group35 = new Group(code: 35, tasks: [], color: [order: 3])
	@Shared Group group36 = new Group(code: 36, tasks: [], color: [order: 3])
	@Shared Group group37 = new Group(code: 37, tasks: [], color: [order: 3])
	@Shared Group group38 = new Group(code: 38, tasks: [], color: [order: 3])
	@Shared Group group39 = new Group(code: 39, tasks: [], color: [order: 3])
	@Shared Group group40 = new Group(code: 40, tasks: [], color: [order: 3])
	@Shared Group group41 = new Group(code: 41, tasks: [], color: [order: 3])
	@Shared Group group42 = new Group(code: 42, tasks: [], color: [order: 3])
	@Shared Group group43 = new Group(code: 43, tasks: [], color: [order: 3])
	@Shared Group group44 = new Group(code: 44, tasks: [], color: [order: 3])
	@Shared Group group45 = new Group(code: 45, tasks: [], color: [order: 3])
	@Shared Group group46 = new Group(code: 46, tasks: [], color: [order: 4])
	@Shared Group group47 = new Group(code: 47, tasks: [], color: [order: 3])
	@Shared Group group48 = new Group(code: 48, tasks: [], color: [order: 3])
	@Shared Group group49 = new Group(code: 49, tasks: [], color: [order: 3])
	@Shared Group group50 = new Group(code: 50, tasks: [], color: [order: 3])
	@Shared Group group51 = new Group(code: 51, tasks: [], color: [order: 3])
	@Shared Group group52 = new Group(code: 52, tasks: [], color: [order: 4])
	@Shared Group group53 = new Group(code: 53, tasks: [], color: [order: 3])
	@Shared Group group54 = new Group(code: 54, tasks: [], color: [order: 3])
	@Shared Group group55 = new Group(code: 55, tasks: [], color: [order: 3])
	@Shared Group group56 = new Group(code: 56, tasks: [], color: [order: 3])
	@Shared Group group57 = new Group(code: 57, tasks: [], color: [order: 3])
	@Shared Group group58 = new Group(code: 58, tasks: [], color: [order: 3])
	@Shared Group group60 = new Group(code: 60, tasks: [], color: [order: 3])
	@Shared Group group61 = new Group(code: 61, tasks: [], color: [order: 3])
	@Shared Group group62 = new Group(code: 62, tasks: [], color: [order: 3])
	@Shared Group group63 = new Group(code: 63, tasks: [], color: [order: 3])
	@Shared Group group64 = new Group(code: 64, tasks: [], color: [order: 3])
	@Shared Group group65 = new Group(code: 65, tasks: [], color: [order: 3])
	@Shared Group group66 = new Group(code: 66, tasks: [], color: [order: 3])
	@Shared Group group67 = new Group(code: 67, tasks: [], color: [order: 3])
	@Shared Group group68 = new Group(code: 68, tasks: [], color: [order: 3])
	@Shared Group group69 = new Group(code: 69, tasks: [], color: [order: 3])
	@Shared Group group70 = new Group(code: 70, tasks: [], color: [order: 3])
	@Shared Group group71 = new Group(code: 71, tasks: [], color: [order: 3])
	@Shared Group group72 = new Group(code: 72, tasks: [], color: [order: 8])
	@Shared Group group73 = new Group(code: 73, tasks: [], color: [order: 3])
	@Shared Group group74 = new Group(code: 74, tasks: [], color: [order: 3])
	@Shared Group group75 = new Group(code: 75, tasks: [], color: [order: 1])
	@Shared Group group76 = new Group(code: 76, tasks: [], color: [order: 1])
	@Shared Group group77 = new Group(code: 77, tasks: [], color: [order: 3])
	@Shared Group group78 = new Group(code: 78, tasks: [], color: [order: 3])
	@Shared Group group79 = new Group(code: 79, tasks: [], color: [order: 3])
	@Shared Group group80 = new Group(code: 80, tasks: [], color: [order: 3])
	@Shared Group group81 = new Group(code: 81, tasks: [], color: [order: 3])
	@Shared Group group82 = new Group(code: 82, tasks: [], color: [order: 3])
	@Shared Group group83 = new Group(code: 83, tasks: [], color: [order: 3])
	@Shared Group group84 = new Group(code: 84, tasks: [], color: [order: 3])
	@Shared Group group85 = new Group(code: 85, tasks: [], color: [order: 3])
	@Shared Group group86 = new Group(code: 86, tasks: [], color: [order: 3])
	@Shared Group group87 = new Group(code: 87, tasks: [], color: [order: 1])
	@Shared Group group88 = new Group(code: 88, tasks: [], color: [order: 1])
	@Shared Group group89 = new Group(code: 89, tasks: [], color: [order: 1])
	@Shared Group group90 = new Group(code: 90, tasks: [], color: [order: 1])
	@Shared Group group91 = new Group(code: 91, tasks: [], color: [order: 1])
	@Shared Group group92 = new Group(code: 92, tasks: [], color: [order: 1])
	@Shared Group group93 = new Group(code: 93, tasks: [], color: [order: 1])
	@Shared Group group94 = new Group(code: 94, tasks: [], color: [order: 1])
	@Shared Group group95 = new Group(code: 95, tasks: [], color: [order: 1])
	@Shared Group group96 = new Group(code: 96, tasks: [], color: [order: 1])
	@Shared Group group97 = new Group(code: 97, tasks: [], color: [order: 1])
	@Shared Group group98 = new Group(code: 98, tasks: [], color: [order: 1])
	@Shared Group group99 = new Group(code: 99, tasks: [], color: [order: 1])
	@Shared Group group100 = new Group(code: 100, tasks: [], color: [order: 1])
	@Shared Group group101 = new Group(code: 101, tasks: [], color: [order: 1])
	@Shared Group group102 = new Group(code: 102, tasks: [], color: [order: 1])
	@Shared Group group103 = new Group(code: 103, tasks: [], color: [order: 1])
	@Shared Group group104 = new Group(code: 104, tasks: [], color: [order: 1])
	@Shared Group group105 = new Group(code: 105, tasks: [], color: [order: 1])
	@Shared Group group106 = new Group(code: 106, tasks: [], color: [order: 1])
	@Shared Group group107 = new Group(code: 107, tasks: [], color: [order: 1])
	@Shared Group group108 = new Group(code: 108, tasks: [], color: [order: 3])
	@Shared Group group109 = new Group(code: 109, tasks: [], color: [order: 3])
	@Shared Group group110 = new Group(code: 110, tasks: [], color: [order: 3])
	@Shared Group group111 = new Group(code: 111, tasks: [], color: [order: 3])
	@Shared Group group112 = new Group(code: 112, tasks: [], color: [order: 3])
	@Shared Group group113 = new Group(code: 113, tasks: [], color: [order: 3])
	@Shared Group group114 = new Group(code: 114, tasks: [], color: [order: 3])
	@Shared Group group115 = new Group(code: 115, tasks: [], color: [order: 5])
	@Shared Group group116 = new Group(code: 116, tasks: [], color: [order: 5])
	@Shared Group group117 = new Group(code: 117, tasks: [], color: [order: 3])
	@Shared Group group118 = new Group(code: 118, tasks: [], color: [order: 3])
	@Shared Group group119 = new Group(code: 119, tasks: [], color: [order: 5])
	@Shared Group group120 = new Group(code: 120, tasks: [], color: [order: 3])
	@Shared Group group121 = new Group(code: 121, tasks: [], color: [order: 3])
	@Shared Group group122 = new Group(code: 122, tasks: [], color: [order: 3])
	@Shared Group group123 = new Group(code: 123, tasks: [], color: [order: 3])
	@Shared Group group124 = new Group(code: 124, tasks: [], color: [order: 3])
	@Shared Group group125 = new Group(code: 125, tasks: [], color: [order: 3])
	@Shared Group group126 = new Group(code: 126, tasks: [], color: [order: 3])
	@Shared Group group127 = new Group(code: 127, tasks: [], color: [order: 3])
	@Shared Group group128 = new Group(code: 128, tasks: [], color: [order: 3])
	@Shared Group group129 = new Group(code: 129, tasks: [], color: [order: 3])
	@Shared Group group130 = new Group(code: 130, tasks: [], color: [order: 3])
	@Shared Group group131 = new Group(code: 131, tasks: [], color: [order: 3])
	@Shared Group group132 = new Group(code: 132, tasks: [], color: [order: 3])
	@Shared Group group133 = new Group(code: 133, tasks: [], color: [order: 3])
	@Shared Group group134 = new Group(code: 134, tasks: [], color: [order: 3])
	@Shared Group group135 = new Group(code: 135, tasks: [], color: [order: 3])
	@Shared Group group136 = new Group(code: 136, tasks: [], color: [order: 3])
	@Shared Group group137 = new Group(code: 137, tasks: [], color: [order: 3])
	@Shared Group group138 = new Group(code: 138, tasks: [], color: [order: 3])
	@Shared Group group139 = new Group(code: 139, tasks: [], color: [order: 3])
	@Shared Group group140 = new Group(code: 140, tasks: [], color: [order: 3])
	@Shared Group group141 = new Group(code: 141, tasks: [], color: [order: 3])
	@Shared Group group142 = new Group(code: 142, tasks: [], color: [order: 3])
	@Shared Group group143 = new Group(code: 143, tasks: [], color: [order: 3])
	@Shared Group group144 = new Group(code: 144, tasks: [], color: [order: 3])
	@Shared Group group145 = new Group(code: 145, tasks: [], color: [order: 3])
	@Shared Group group146 = new Group(code: 146, tasks: [], color: [order: 3])
	@Shared Group group147 = new Group(code: 147, tasks: [], color: [order: 3])
	@Shared Group group148 = new Group(code: 148, tasks: [], color: [order: 3])
	@Shared Group group149 = new Group(code: 149, tasks: [], color: [order: 3])
	@Shared Group group150 = new Group(code: 150, tasks: [], color: [order: 3])
	@Shared Group group151 = new Group(code: 151, tasks: [], color: [order: 3])
	@Shared Group group152 = new Group(code: 152, tasks: [], color: [order: 3])
	@Shared Group group153 = new Group(code: 153, tasks: [], color: [order: 6])
	@Shared Group group154 = new Group(code: 154, tasks: [], color: [order: 6])
	@Shared Group group155 = new Group(code: 155, tasks: [], color: [order: 6])
	@Shared Group group156 = new Group(code: 156, tasks: [], color: [order: 6])
	@Shared Group group157 = new Group(code: 157, tasks: [], color: [order: 6])
	@Shared Group group158 = new Group(code: 158, tasks: [], color: [order: 6])
	@Shared Group group159 = new Group(code: 159, tasks: [], color: [order: 3])
	@Shared Group group160 = new Group(code: 160, tasks: [], color: [order: 6])
	@Shared Group group161 = new Group(code: 161, tasks: [], color: [order: 5])
	@Shared Group group162 = new Group(code: 162, tasks: [], color: [order: 5])
	@Shared Group group163 = new Group(code: 163, tasks: [], color: [order: 5])
	@Shared Group group164 = new Group(code: 164, tasks: [], color: [order: 5])
	@Shared Group group165 = new Group(code: 165, tasks: [], color: [order: 5])
	@Shared Group group166 = new Group(code: 166, tasks: [], color: [order: 5])
	@Shared Group group167 = new Group(code: 167, tasks: [], color: [order: 5])
	@Shared Group group168 = new Group(code: 168, tasks: [], color: [order: 3])
	@Shared Group group169 = new Group(code: 169, tasks: [], color: [order: 3])
	@Shared Group group170 = new Group(code: 170, tasks: [], color: [order: 3])
	@Shared Group group171 = new Group(code: 171, tasks: [], color: [order: 3])
	@Shared Group group172 = new Group(code: 172, tasks: [], color: [order: 3])
	@Shared Group group173 = new Group(code: 173, tasks: [], color: [order: 3])
	@Shared Group group174 = new Group(code: 174, tasks: [], color: [order: 3])
	@Shared Group group175 = new Group(code: 175, tasks: [], color: [order: 3])
	@Shared Group group176 = new Group(code: 176, tasks: [], color: [order: 3])
	@Shared Group group177 = new Group(code: 177, tasks: [], color: [order: 3])
	@Shared Group group178 = new Group(code: 178, tasks: [], color: [order: 3])
	@Shared Group group179 = new Group(code: 179, tasks: [], color: [order: 3])
	@Shared Group group180 = new Group(code: 180, tasks: [], color: [order: 3])
	@Shared Group group181 = new Group(code: 181, tasks: [], color: [order: 3])
	@Shared Group group182 = new Group(code: 182, tasks: [], color: [order: 3])
	@Shared Group group183 = new Group(code: 183, tasks: [], color: [order: 3])
	@Shared Group group184 = new Group(code: 184, tasks: [], color: [order: 3])
	@Shared Group group185 = new Group(code: 185, tasks: [], color: [order: 3])
	@Shared Group group186 = new Group(code: 186, tasks: [], color: [order: 3])
	@Shared Group group187 = new Group(code: 187, tasks: [], color: [order: 3])
	@Shared Group group188 = new Group(code: 188, tasks: [], color: [order: 3])
	@Shared Group group189 = new Group(code: 189, tasks: [], color: [order: 3])
	@Shared Group group190 = new Group(code: 190, tasks: [], color: [order: 3])
	@Shared Group group191 = new Group(code: 191, tasks: [], color: [order: 3])
	@Shared Group group192 = new Group(code: 192, tasks: [], color: [order: 3])
	@Shared Group group193 = new Group(code: 193, tasks: [], color: [order: 3])
	@Shared Group group194 = new Group(code: 194, tasks: [], color: [order: 3])
	@Shared Group group195 = new Group(code: 195, tasks: [], color: [order: 3])
	@Shared Group group196 = new Group(code: 196, tasks: [], color: [order: 5])
	@Shared Group group197 = new Group(code: 197, tasks: [], color: [order: 3])
	@Shared Group group198 = new Group(code: 198, tasks: [], color: [order: 5])
	@Shared Group group199 = new Group(code: 199, tasks: [], color: [order: 5])
	@Shared Group group200 = new Group(code: 200, tasks: [], color: [order: 3])
	@Shared Group group201 = new Group(code: 201, tasks: [], color: [order: 3])
	@Shared Group group202 = new Group(code: 202, tasks: [], color: [order: 3])
	@Shared Group group203 = new Group(code: 203, tasks: [], color: [order: 3])
	@Shared Group group204 = new Group(code: 204, tasks: [], color: [order: 3])
	@Shared Group group205 = new Group(code: 205, tasks: [], color: [order: 3])
	@Shared Group group206 = new Group(code: 206, tasks: [], color: [order: 5])
	@Shared Group group207 = new Group(code: 207, tasks: [], color: [order: 3])
	@Shared Group group208 = new Group(code: 208, tasks: [], color: [order: 3])
	@Shared Group group209 = new Group(code: 209, tasks: [], color: [order: 3])
	@Shared Group group210 = new Group(code: 210, tasks: [], color: [order: 3])
	@Shared Group group211 = new Group(code: 211, tasks: [], color: [order: 3])
	@Shared Group group212 = new Group(code: 212, tasks: [], color: [order: 3])
	@Shared Group group213 = new Group(code: 213, tasks: [], color: [order: 3])
	@Shared Group group214 = new Group(code: 214, tasks: [], color: [order: 3])
	@Shared Group group215 = new Group(code: 215, tasks: [], color: [order: 3])
	@Shared Group group216 = new Group(code: 216, tasks: [], color: [order: 3])
	@Shared Group group217 = new Group(code: 217, tasks: [], color: [order: 3])
	@Shared Group group218 = new Group(code: 218, tasks: [], color: [order: 3])
	@Shared Group group219 = new Group(code: 219, tasks: [], color: [order: 3])
	@Shared Group group220 = new Group(code: 220, tasks: [], color: [order: 3])
	@Shared Group group221 = new Group(code: 221, tasks: [], color: [order: 3])
	@Shared Group group222 = new Group(code: 222, tasks: [], color: [order: 3])
	@Shared Group group223 = new Group(code: 223, tasks: [], color: [order: 3])
	@Shared Group group224 = new Group(code: 224, tasks: [], color: [order: 3])
	@Shared Group group225 = new Group(code: 225, tasks: [], color: [order: 3])
	@Shared Group group226 = new Group(code: 226, tasks: [], color: [order: 3])
	@Shared Group group227 = new Group(code: 227, tasks: [], color: [order: 3])
	@Shared Group group228 = new Group(code: 228, tasks: [], color: [order: 3])
	@Shared Group group229 = new Group(code: 229, tasks: [], color: [order: 3])
	@Shared Group group230 = new Group(code: 230, tasks: [], color: [order: 3])
	@Shared Group group231 = new Group(code: 231, tasks: [], color: [order: 3])
	@Shared Group group232 = new Group(code: 232, tasks: [], color: [order: 3])
	@Shared Group group233 = new Group(code: 233, tasks: [], color: [order: 3])
	@Shared Group group234 = new Group(code: 234, tasks: [], color: [order: 3])
	@Shared Group group235 = new Group(code: 235, tasks: [], color: [order: 3])
	@Shared Group group236 = new Group(code: 236, tasks: [], color: [order: 3])
	@Shared Group group237 = new Group(code: 237, tasks: [], color: [order: 5])
	@Shared Group group238 = new Group(code: 238, tasks: [], color: [order: 3])
	@Shared Group group239 = new Group(code: 239, tasks: [], color: [order: 3])
	@Shared Group group240 = new Group(code: 240, tasks: [], color: [order: 3])
	@Shared Group group241 = new Group(code: 241, tasks: [], color: [order: 3])
	@Shared Group group242 = new Group(code: 242, tasks: [], color: [order: 3])
	@Shared Group group243 = new Group(code: 243, tasks: [], color: [order: 3])
	@Shared Group group244 = new Group(code: 244, tasks: [], color: [order: 3])
	@Shared Group group245 = new Group(code: 245, tasks: [], color: [order: 3])
	@Shared Group group246 = new Group(code: 246, tasks: [], color: [order: 3])
	@Shared Group group247 = new Group(code: 247, tasks: [], color: [order: 3])
	@Shared Group group248 = new Group(code: 248, tasks: [], color: [order: 3])
	@Shared Group group249 = new Group(code: 249, tasks: [], color: [order: 3])
	@Shared Group group250 = new Group(code: 250, tasks: [], color: [order: 3])
	@Shared Group group251 = new Group(code: 251, tasks: [], color: [order: 3])
	@Shared Group group252 = new Group(code: 252, tasks: [], color: [order: 3])
	@Shared Group group253 = new Group(code: 253, tasks: [], color: [order: 3])
	@Shared Group group254 = new Group(code: 254, tasks: [], color: [order: 3])
	@Shared Group group255 = new Group(code: 255, tasks: [], color: [order: 3])
	@Shared Group group256 = new Group(code: 256, tasks: [], color: [order: 3])
	@Shared Group group257 = new Group(code: 257, tasks: [], color: [order: 3])
	@Shared Group group258 = new Group(code: 258, tasks: [], color: [order: 3])
	@Shared Group group259 = new Group(code: 259, tasks: [], color: [order: 3])
	@Shared Group group260 = new Group(code: 260, tasks: [], color: [order: 3])
	@Shared Group group261 = new Group(code: 261, tasks: [], color: [order: 3])
	@Shared Group group262 = new Group(code: 262, tasks: [], color: [order: 3])
	@Shared Group group263 = new Group(code: 263, tasks: [], color: [order: 3])
	@Shared Group group264 = new Group(code: 264, tasks: [], color: [order: 5])
	@Shared Group group265 = new Group(code: 265, tasks: [], color: [order: 3])
	@Shared Group group266 = new Group(code: 266, tasks: [], color: [order: 3])
	@Shared Group group267 = new Group(code: 267, tasks: [], color: [order: 3])
	@Shared Group group268 = new Group(code: 268, tasks: [], color: [order: 3])
	@Shared Group group269 = new Group(code: 269, tasks: [], color: [order: 3])
	@Shared Group group270 = new Group(code: 270, tasks: [], color: [order: 3])
	@Shared Group group271 = new Group(code: 271, tasks: [], color: [order: 3])
	@Shared Group group272 = new Group(code: 272, tasks: [], color: [order: 3])
	@Shared Group group273 = new Group(code: 273, tasks: [], color: [order: 3])
	@Shared Group group274 = new Group(code: 274, tasks: [], color: [order: 3])
	@Shared Group group275 = new Group(code: 275, tasks: [], color: [order: 3])
	@Shared Group group276 = new Group(code: 276, tasks: [], color: [order: 3])
	@Shared Group group277 = new Group(code: 277, tasks: [], color: [order: 3])
	@Shared Group group278 = new Group(code: 278, tasks: [], color: [order: 3])
	@Shared Group group279 = new Group(code: 279, tasks: [], color: [order: 3])
	@Shared Group group280 = new Group(code: 280, tasks: [], color: [order: 3])
	@Shared Group group281 = new Group(code: 281, tasks: [], color: [order: 3])
	@Shared Group group282 = new Group(code: 282, tasks: [], color: [order: 3])
	@Shared Group group283 = new Group(code: 283, tasks: [], color: [order: 3])
	@Shared Group group284 = new Group(code: 284, tasks: [], color: [order: 3])
	@Shared Group group285 = new Group(code: 285, tasks: [], color: [order: 3])
	@Shared Group group286 = new Group(code: 286, tasks: [], color: [order: 3])
	@Shared Group group287 = new Group(code: 287, tasks: [], color: [order: 3])
	@Shared Group group288 = new Group(code: 288, tasks: [], color: [order: 3])
	@Shared Group group289 = new Group(code: 289, tasks: [], color: [order: 3])
	@Shared Group group290 = new Group(code: 290, tasks: [], color: [order: 3])
	@Shared Group group291 = new Group(code: 291, tasks: [], color: [order: 3])
	@Shared Group group292 = new Group(code: 292, tasks: [], color: [order: 3])
	@Shared Group group293 = new Group(code: 293, tasks: [], color: [order: 3])
	@Shared Group group294 = new Group(code: 294, tasks: [], color: [order: 3])
	@Shared Group group295 = new Group(code: 295, tasks: [], color: [order: 3])
	@Shared Group group296 = new Group(code: 296, tasks: [], color: [order: 3])
	@Shared Group group297 = new Group(code: 297, tasks: [], color: [order: 3])
	@Shared Group group298 = new Group(code: 298, tasks: [], color: [order: 3])
	@Shared Group group299 = new Group(code: 299, tasks: [], color: [order: 3])
	@Shared Group group300 = new Group(code: 300, tasks: [], color: [order: 3])
	@Shared Group group301 = new Group(code: 301, tasks: [], color: [order: 3])
	@Shared Group group302 = new Group(code: 302, tasks: [], color: [order: 3])
	@Shared Group group303 = new Group(code: 303, tasks: [], color: [order: 3])
	@Shared Group group304 = new Group(code: 304, tasks: [], color: [order: 3])
	@Shared Group group305 = new Group(code: 305, tasks: [], color: [order: 3])
	@Shared Group group306 = new Group(code: 306, tasks: [], color: [order: 3])
	@Shared Group group307 = new Group(code: 307, tasks: [], color: [order: 3])
	@Shared Group group308 = new Group(code: 308, tasks: [], color: [order: 3])
	@Shared Group group309 = new Group(code: 309, tasks: [], color: [order: 3])
	@Shared Group group310 = new Group(code: 310, tasks: [], color: [order: 6])
	@Shared Group group311 = new Group(code: 311, tasks: [], color: [order: 3])
	@Shared Group group312 = new Group(code: 312, tasks: [], color: [order: 5])
	@Shared Group group313 = new Group(code: 313, tasks: [], color: [order: 5])
	@Shared Group group314 = new Group(code: 314, tasks: [], color: [order: 5])
	@Shared Group group315 = new Group(code: 315, tasks: [], color: [order: 5])
	@Shared Group group316 = new Group(code: 316, tasks: [], color: [order: 5])
	@Shared Group group317 = new Group(code: 317, tasks: [], color: [order: 3])

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

		today = LocalDate.now()
		tomorrow = today.plusDays(1)
		time8 = LocalTime.of(8, 0)
		time15 = LocalTime.of(15, 0)
		time20 = LocalTime.of(20, 0)

		appointmentTypes = [
			new AppointmentType(code: AppointmentTypeCode.RAP),
			new AppointmentType(code: AppointmentTypeCode.TP),
			new AppointmentType(code: AppointmentTypeCode.INT),
		]
	}

	// endregion

	// region Integrate fixed mechanics

	void "test get day mechanics sort not null days"() {
		given:
		List<EmployeeSchedule> mechanics = [
			new EmployeeSchedule(day: today),
			new EmployeeSchedule(day: today),
			new EmployeeSchedule(day: tomorrow)
		]

		when:
		Map<String, List<EmployeeSchedule>> daysMechanics = panelService.integrateFixedMechanics(mechanics)

		then:
		daysMechanics.size() == 2
		daysMechanics[today.toString()]
		daysMechanics[today.toString()].size() == 2
		daysMechanics[tomorrow.toString()]
		daysMechanics[tomorrow.toString()].size() == 1
	}

	void "test get day mechanics null days"() {
		given:
		List<EmployeeSchedule> mechanics = [
			new EmployeeSchedule(day: today),
			new EmployeeSchedule(day: tomorrow),
			new EmployeeSchedule(day: null),
		]

		when:
		Map<String, List<EmployeeSchedule>> daysMechanics = panelService.integrateFixedMechanics(mechanics)

		then:
		daysMechanics.size() == 2
		daysMechanics[today.toString()]
		daysMechanics[today.toString()].size() == 2
		daysMechanics[tomorrow.toString()]
		daysMechanics[tomorrow.toString()].size() == 1
	}

	void "test integrate fixed mechanics max today schedule"() {
		given:
		List<EmployeeSchedule> mechanics = [
			new EmployeeSchedule(
				day: today,
				schedule: new Schedule(
					morningStart: LocalTime.of(8, 0),
					morningEnd: LocalTime.of(13, 0),
					afternoonStart: LocalTime.of(15, 0),
					afternoonEnd: LocalTime.of(20, 0)
				)
			),
			new EmployeeSchedule(
				day: tomorrow,
				schedule: new Schedule(
					morningStart: LocalTime.of(9, 0),
					morningEnd: LocalTime.of(13, 0),
					afternoonStart: LocalTime.of(15, 0),
					afternoonEnd: LocalTime.of(19, 0)
				)),
			new EmployeeSchedule(day: null),
		]

		when:
		Map<String, List<EmployeeSchedule>> daysMechanics = panelService.integrateFixedMechanics(mechanics)

		then:
		daysMechanics.size() == 2
		daysMechanics[today.toString()].size() == 2
		daysMechanics[today.toString()].findAll {
			it.schedule.morningEnd == LocalTime.of(20, 0)
		}.size() == 1
	}

	void "test integrate fixed mechanics max tomorrow schedule"() {
		given:
		List<EmployeeSchedule> mechanics = [
			new EmployeeSchedule(
				day: today,
				schedule: new Schedule(
					morningStart: LocalTime.of(8, 0),
					morningEnd: LocalTime.of(13, 0),
					afternoonStart: LocalTime.of(15, 0),
					afternoonEnd: LocalTime.of(20, 0)
				)
			),
			new EmployeeSchedule(
				day: tomorrow,
				schedule: new Schedule(
					morningStart: LocalTime.of(9, 0),
					morningEnd: LocalTime.of(13, 0),
					afternoonStart: LocalTime.of(15, 0),
					afternoonEnd: LocalTime.of(22, 0)
				)),
			new EmployeeSchedule(day: null),
		]

		when:
		Map<String, List<EmployeeSchedule>> daysMechanics = panelService.integrateFixedMechanics(mechanics)

		then:
		daysMechanics.size() == 2
		daysMechanics[today.toString()].size() == 2
		daysMechanics[today.toString()].findAll {
			it.schedule.morningEnd == LocalTime.of(20, 0)
		}.size() == 1
	}

	// endregion

	// region Sort possible groups

	void "test sort possible groups no task groups"() {
		given:
		List<Group> groups = []

		when:
		List<Group> possibleGroups = panelService.sortPossibleGroups(groups, [])

		then:
		!possibleGroups
	}

	void "test sort possible groups different tasks number"() {
		given:
		List<Group> groups = [group43, group45]

		when:
		List<Group> possibleGroups = panelService.sortPossibleGroups(groups, [])

		then:
		possibleGroups
		possibleGroups.size() == 2
		possibleGroups[0].code == 45
		possibleGroups[1].code == 43
	}

	void "test sort possible groups same tasks number different color"() {
		given:
		List<Group> groups = [group45, group88]

		when:
		List<Group> possibleGroups = panelService.sortPossibleGroups(groups, [])

		then:
		possibleGroups
		possibleGroups.size() == 2
		possibleGroups[0].code == 88
		possibleGroups[1].code == 45
	}

	void "test sort possible groups same tasks number same color"() {
		given:
		List<Group> groups = [group43, group45, group47]

		when:
		List<Group> possibleGroups = panelService.sortPossibleGroups(groups, [])

		then:
		possibleGroups
		possibleGroups.size() == 3
		possibleGroups[0].code == 45
		possibleGroups[1].code == 47
		possibleGroups[2].code == 43
	}

	// endregion

	// region Find selected group

	void "test find selected groups no task groups"() {
		given:
		List<Group> groups = []

		when:
		Group selectedGroup = panelService.findSelectedGroup([], groups, [])

		then:
		!selectedGroup
	}

	void "test find selected groups different tasks number"() {
		given:
		List<Task> orderTasks = [task015, task021]
		List<Group> groups = [group43, group45]

		when:
		Group selectedGroup = panelService.findSelectedGroup(orderTasks, groups, [])

		then:
		selectedGroup.code == 45
	}

	void "test find selected groups different tasks number already processed task"() {
		given:
		List<Task> orderTasks = [task015, task021]
		List<Group> groups = [group43, group45]
		List<Task> processedTasks = [task021]

		when:
		Group selectedGroup = panelService.findSelectedGroup(orderTasks, groups, processedTasks)

		then:
		selectedGroup.code == 43
	}

	void "test find selected groups same tasks number different color"() {
		given:
		List<Task> orderTasks = [task010, task200]
		List<Group> groups = [group45, group88]

		when:
		Group selectedGroup = panelService.findSelectedGroup(orderTasks, groups, [])

		then:
		selectedGroup.code == 88
	}

	void "test find selected groups same tasks number different color processed task"() {
		given:
		List<Task> orderTasks = [task010, task200]
		List<Group> groups = [group45, group88]
		List<Task> processedTasks = [task010]

		when:
		Group selectedGroup = panelService.findSelectedGroup(orderTasks, groups, processedTasks)

		then:
		!selectedGroup
	}

	// endregion

	// region Filter absorbable tasks

	void "test filter absorbable tasks existent main and absorbable tasks"() {
		given:
		List<Task> tasks = [task001, task004, task151, task200, task225, task339]

		when:
		List<Task> filteredTasks = panelService.filterAbsorbableTasks(tasks)

		then:
		filteredTasks.size() == 4
		!filteredTasks.find { it == task225 }
		!filteredTasks.find { it == task339 }
	}

	void "test filter absorbable tasks only main tasks"() {
		given:
		List<Task> tasks = [task001, task004, task151, task200]

		when:
		List<Task> filteredTasks = panelService.filterAbsorbableTasks(tasks)

		then:
		filteredTasks.size() == 4
	}

	void "test filter absorbable tasks only absorbable tasks"() {
		given:
		List<Task> tasks = [task225]

		when:
		List<Task> filteredTasks = panelService.filterAbsorbableTasks(tasks)

		then:
		filteredTasks.size() == 1
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
			timeInfo: new OrderTime(shortCode: 'C1'),
			lines: [
				new OrderLine(article: [code: 99108]),
				new OrderLine(article: [code: 99273]),
				new OrderLine(article: [code: 99169]),
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
			timeInfo: new OrderTime(shortCode: 'C1'),
			lines: [
				new OrderLine(article: [code: 99108]),
				new OrderLine(article: [code: 99086]),
				new OrderLine(article: [code: 99169]),
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
			timeInfo: new OrderTime(shortCode: 'C1'),
			lines: [
				new OrderLine(article: [code: 99086]),
				new OrderLine(article: [code: 99021]),
				new OrderLine(article: [code: 99277]),
			],
			vehicle: new Vehicle([:])
		)

		when:
		List<GroupUnits> groupUnits = panelService.getOrderGroups(order, [task086, task021, task277])

		then:
		groupUnits.size() == 2
		groupUnits[0].group.code == 48
		groupUnits[1].group.code == 52
	}

	void "test get order groups 5"() {
		given:
		Order order = new Order(
			number: 1,
			timeInfo: new OrderTime(shortCode: 'C1'),
			lines: [
				new OrderLine(article: [code: 99001]),
				new OrderLine(article: [code: 99004]),
				new OrderLine(article: [code: 99021]),
				new OrderLine(article: [code: 99022]),
				new OrderLine(article: [code: 99025]),
				new OrderLine(article: [code: 99026]),
				new OrderLine(article: [code: 99066]),
				new OrderLine(article: [code: 99086]),
				new OrderLine(article: [code: 99112]),
				new OrderLine(article: [code: 99151]),
				new OrderLine(article: [code: 99200]),
				new OrderLine(article: [code: 99330])
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
		groupUnits[1].group.code == 60
		groupUnits[2].group.code == 141
		groupUnits[3].group.code == 134
		groupUnits[4].group.code == 135
		groupUnits[5].group.code == 113
		groupUnits[6].group.code == 44
		groupUnits[7].group.code == 31
		groupUnits[8].group.code == 87
		groupUnits[9].group.code == 316
	}

	void "test get order groups 6"() {
		given:
		Order order = new Order(
			number: 1,
			timeInfo: new OrderTime(shortCode: 'C1'),
			lines: [
				new OrderLine(article: [code: 99013]),
				new OrderLine(article: [code: 99015]),
				new OrderLine(article: [code: 99021]),
				new OrderLine(article: [code: 99073]),
				new OrderLine(article: [code: 99212]),
				new OrderLine(article: [code: 99277]),
				new OrderLine(article: [code: 99339])
			],
			vehicle: new Vehicle([:])
		)

		when:
		List<GroupUnits> groupUnits = panelService.getOrderGroups(
			order,
			[task013, task015, task021, task073, task212, task277, task339]
		)

		then:
		groupUnits.size() == 5
		groupUnits[0].group.code == 30
		groupUnits[1].group.code == 45
		groupUnits[2].group.code == 122
		groupUnits[3].group.code == 54
		groupUnits[4].group.code == 53
	}

	void "test get order groups 7"() {
		given:
		Order order = new Order(
			number: 1,
			timeInfo: new OrderTime(shortCode: 'C1'),
			lines: [
				new OrderLine(article: [code: 99001]),
				new OrderLine(article: [code: 99004]),
				new OrderLine(article: [code: 99021]),
				new OrderLine(article: [code: 99022]),
				new OrderLine(article: [code: 99025]),
				new OrderLine(article: [code: 99026]),
				new OrderLine(article: [code: 99066]),
				new OrderLine(article: [code: 99086]),
				new OrderLine(article: [code: 99112]),
				new OrderLine(article: [code: 99151]),
				new OrderLine(article: [code: 99200]),
				new OrderLine(article: [code: 99330])
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
		groupUnits[1].group.code == 60
		groupUnits[2].group.code == 141
		groupUnits[3].group.code == 134
		groupUnits[4].group.code == 135
		groupUnits[5].group.code == 113
		groupUnits[6].group.code == 44
		groupUnits[7].group.code == 31
		groupUnits[8].group.code == 87
		groupUnits[9].group.code == 316
	}

	void "test get order groups absorbable tasks"() {
		given:
		Order order = new Order(
			number: 1,
			timeInfo: new OrderTime(shortCode: 'C1'),
			lines: [
				new OrderLine(article: [code: 99001]),
				new OrderLine(article: [code: 99004]),
				new OrderLine(article: [code: 99151]),
				new OrderLine(article: [code: 99200]),
				new OrderLine(article: [code: 99225]),
				new OrderLine(article: [code: 99339])
			],
			vehicle: new Vehicle([:])
		)

		when:
		List<GroupUnits> groupUnits = panelService.getOrderGroups(
			order,
			[task001, task004, task151, task200, task225, task339]
		)

		then:
		groupUnits.size() == 3
		groupUnits[0].group.code == 1
		groupUnits[1].group.code == 31
		groupUnits[2].group.code == 87
	}

	// endregion

	// region buildOrdersCards

	void "test build order cards 1"() {
		given:
		GroupUnits groupUnits = new GroupUnits(group: group1, units: [1])
		Map<Order, List<GroupUnits>> ordersGroupsUnits = [
			(order1Article): [groupUnits]
		]
		panelDatabaseClient.getDurations(_) >>
			[(order1Article.number): [new GroupUnits([group: group1, units: [1], duration: 30])]]

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
		GroupUnits groupUnits1 = new GroupUnits(group: group1, units: [1])
		GroupUnits groupUnits2 = new GroupUnits(group: group2, units: [1, 1])
		GroupUnits groupUnits3 = new GroupUnits(group: group3, units: [3])
		Map<Order, List<GroupUnits>> ordersGroupsUnits = [
			(order1Article): [groupUnits1],
			(order4Articles): [groupUnits1, groupUnits2, groupUnits3]
		]
		panelDatabaseClient.getDurations(_) >> [
			(order1Article.number): [new GroupUnits([group: group1, units: [1], duration: 10])],
			(order4Articles.number): [
				new GroupUnits([group: group1, units: [1], duration: 10]),
				new GroupUnits([group: group2, units: [2], duration: 30]),
				new GroupUnits([group: group3, units: [3], duration: 45])
			],
		]

		when:
		List<Card> cards = panelService.buildOrdersCards([order1Article, order4Articles], ordersGroupsUnits)

		then:
		cards.size() == 4
		cards[0].order.number == order1Article.number
		cards[0].group.code == group1.code
		cards[0].duration == 10
		cards[1].order.number == order4Articles.number
		cards[1].group.code == group1.code
		cards[1].duration == 10
		cards[2].order.number == order4Articles.number
		cards[2].group.code == group2.code
		cards[2].duration == 30
		cards[3].order.number == order4Articles.number
		cards[3].group.code == group3.code
		cards[3].duration == 45
	}

	void "test build order cards duration not found for group"() {
		given:
		GroupUnits groupUnits1 = new GroupUnits(group: group1, units: [1])
		Map<Order, List<GroupUnits>> ordersGroupsUnits = [
			(order1Article): [groupUnits1]
		]
		panelDatabaseClient.getDurations(_) >> [(order1Article.number): []]

		when:
		List<Card> cards = panelService.buildOrdersCards([order1Article], ordersGroupsUnits)

		then:
		!cards
	}

	// endregion

	// region Check updated order info

	void "test check updated card same fields"() {
		given:
		Card builtCard = new Card([duration: 10, divisionIndex: 0, code: 'code', order: [number: 1, state: Order.State.A], mechanicCode: '1', status: Card.Status.AUXILIARY, vehicle: [brand: 'FV']])
		Card dayCard = new Card([duration: 10, divisionIndex: 0, code: 'code', order: [number: 1, state: Order.State.A], mechanicCode: '1', status: Card.Status.AUXILIARY, vehicle: [brand: 'FV']])

		when:
		Map<String, Object> updateOrderInfo = panelService.checkUpdatedOrderInfo(dayCard, builtCard)

		then:
		!updateOrderInfo
	}

	void "test check updated card updated order info"() {
		given:
		Card builtCard = new Card([order: [number: 1, code: 'C1'], duration: 20, divisionIndex: 0, vehicle: [brand: 'FV']])
		Card dayCard = new Card([order: [number: 1, code: 'C2'], duration: 20, divisionIndex: 0, vehicle: [brand: 'FV']])

		when:
		Map<String, Object> updateOrderInfo = panelService.checkUpdatedOrderInfo(dayCard, builtCard)

		then:
		updateOrderInfo
		updateOrderInfo.size() == 1
		updateOrderInfo['code'] == 'C1'
	}

	void "test check updated card updated vehicle info"() {
		given:
		Card builtCard = new Card([order: [number: 1], divisionIndex: 0, vehicle: [brand: 'FV'], duration: 30])
		Card dayCard = new Card([order: [number: 1], divisionIndex: 0, vehicle: [brand: 'BMW'], duration: 30])

		when:
		Map<String, Object> updateOrderInfo = panelService.checkUpdatedOrderInfo(dayCard, builtCard)

		then:
		updateOrderInfo
		updateOrderInfo.size() == 1
		updateOrderInfo['brand'] == 'FV'
	}

	void "test check updated card updated order appointment start"() {
		given:
		Card builtCard = new Card([order: [number: 1, created: '10:00'], divisionIndex: 0, vehicle: [brand: 'FV'], duration: 30])
		Card dayCard = new Card([order: [number: 1, created: '19:00'], divisionIndex: 0, vehicle: [brand: 'FV'], duration: 30])

		when:
		Map<String, Object> updateOrderInfo = panelService.checkUpdatedOrderInfo(dayCard, builtCard)

		then:
		updateOrderInfo
		updateOrderInfo.size() == 1
		updateOrderInfo['created'] == LocalTime.of(10, 0)
	}

	void "test check updated card updated order appointment day"() {
		given:
		Card builtCard = new Card([order: [number: 1, day: '2020-07-03', created: '10:00'], divisionIndex: 0, vehicle: [brand: 'FV'], duration: 30])
		Card dayCard = new Card([order: [number: 1, day: '2020-07-04', created: '10:00'], divisionIndex: 0, vehicle: [brand: 'FV'], duration: 30])

		when:
		Map<String, Object> updateOrderInfo = panelService.checkUpdatedOrderInfo(dayCard, builtCard)

		then:
		updateOrderInfo
		updateOrderInfo.size() == 1
		updateOrderInfo['day'] == LocalDate.of(2020, 7, 3)
	}

	void "test check updated card updated order appointment day and start"() {
		given:
		Card builtCard = new Card([order: [number: 1, day: '2020-07-03', created: '10:00'], divisionIndex: 0, vehicle: [brand: 'FV'], duration: 30])
		Card dayCard = new Card([order: [number: 1, day: '2020-07-04', created: '17:00'], divisionIndex: 0, vehicle: [brand: 'FV'], duration: 30])

		when:
		Map<String, Object> updateOrderInfo = panelService.checkUpdatedOrderInfo(dayCard, builtCard)

		then:
		updateOrderInfo
		updateOrderInfo.size() == 2
		updateOrderInfo['day'] == LocalDate.of(2020, 7, 3)
		updateOrderInfo['created'] == LocalTime.of(10, 0)
	}

	// endregion

	// region Update card order info

	void "test update card order info"() {
		given:
		Card dayCard = new Card([order: [number: 1, state: 'A'], vehicle: [brand: 'BMW'], duration: 10])
		Card builtCard = new Card([order: [number: 1, state: 'V'], vehicle: [brand: 'FV'], duration: 10])

		when:
		Card updatedDayCard = panelService.updateCardOrderInfo(dayCard, builtCard)

		then:
		updatedDayCard.vehicle.brand == 'FV'
		updatedDayCard.order.state == Order.State.V
	}

	// endregion

	// region Find replaced card

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

	// region Update card group info

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

	// region Test check replace order cards

	void "test check replace order cards no replacement"() {
		given:
		List<Card> builtCards = [
			new Card([order: [number: 1, creatorCode: '123'], group: [code: 1]]),
			new Card([order: [number: 1], group: [code: 2]]),
			new Card([order: [number: 2], group: [code: 1]])
		]

		when:
		boolean replace = panelService.checkReplaceOrderCards(builtCards)

		then:
		!replace
	}

	void "test check replace order cards replace eCommerce cards"() {
		given:
		List<Card> builtCards = [
			new Card([order: [number: 1, creatorCode: Constants.ECOMMERCE_USER_CODE], group: [code: 1]]),
			new Card([order: [number: 1], group: [code: 2]]),
			new Card([order: [number: 2], group: [code: 1]])
		]

		when:
		boolean replace = panelService.checkReplaceOrderCards(builtCards)

		then:
		replace
	}

	// endregion

	// region Handle cards update

	void "test handle cards update no existent cards"() {
		given:
		List<Card> dbCards = []
		List<Card> builtCards = [
			new Card([order: [number: 1], group: [code: 1]]),
			new Card([order: [number: 1], group: [code: 2]]),
			new Card([order: [number: 2], group: [code: 1]])
		]

		when:
		UpdateCards updateCards = panelService.handleCardsUpdate(dbCards, builtCards)

		then:
		updateCards.newCards
		updateCards.newCards.size() == 3
		updateCards.newCards[0].order.number == 1
		updateCards.newCards[0].group.code == 1
		updateCards.newCards[1].order.number == 1
		updateCards.newCards[1].group.code == 2
		updateCards.newCards[2].order.number == 2
		updateCards.newCards[2].group.code == 1
	}

	void "test handle cards update new order cards new card with new group"() {
		given:
		List<Card> dbCards = [
			new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]])
		]
		List<Card> builtCards = [
			new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]]),
			new Card([order: [number: 2], group: [code: 1]])
		]

		when:
		UpdateCards updateCards = panelService.handleCardsUpdate(dbCards, builtCards)

		then:
		updateCards.newCards
		updateCards.newCards.size() == 1
		updateCards.newCards[0].order.number == 2
		updateCards.same
		updateCards.same.size() == 1
		updateCards.same[0].order.number == 1
	}

	void "test handle cards update no updated cards"() {
		given:
		List<Card> dbCards = [new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]])]
		List<Card> builtCards = [new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]])]

		when:
		UpdateCards updateCards = panelService.handleCardsUpdate(dbCards, builtCards)

		then:
		updateCards.same.size() == updateCards.getAll().size()
		updateCards.same[0].order.number == 1
	}

	void "test handle cards update updated order info card"() {
		given:
		List<Card> dbCards = [new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]])]
		List<Card> builtCards = [new Card([order: [number: 1], vehicle: [brand: 'FV'], group: [code: 1]])]

		when:
		UpdateCards updateCards = panelService.handleCardsUpdate(dbCards, builtCards)

		then:
		updateCards.updated
		updateCards.updated.size() == 1
		updateCards.updated[0].order.number == 1
		updateCards.updated[0].vehicle.brand == 'FV'
		updateCards.updated[0].group.code == 1
		!updateCards.newCards
		!updateCards.deleted
		!updateCards.same
		!updateCards.reset
		!updateCards.newReplace
	}

	void "test handle cards update cards updated replaced card"() {
		given:
		List<Card> dbCards = [new Card([order: [number: 1], day: '2020-07-03', vehicle: [brand: 'BMW'], group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2]]]])]
		List<Card> builtCards = [new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 2, tasks: [[articleCode: 1]]]])]

		when:
		UpdateCards updateCards = panelService.handleCardsUpdate(dbCards, builtCards)

		then:
		updateCards.newReplace
		updateCards.newReplace.size() == 1
		updateCards.newReplace[0].order.number == 1
		updateCards.newReplace[0].vehicle.brand == 'BMW'
		updateCards.newReplace[0].group.code == 2
		updateCards.newReplace[0].day == LocalDate.of(2020, 7, 3)
		!updateCards.newCards
		!updateCards.updated
		!updateCards.reset
		!updateCards.deleted
		!updateCards.same
	}

	void "test handle cards update cards updated replaced card different order day"() {
		given:
		List<Card> dbCards = [new Card([order: [number: 1, day: '2020-07-03'], vehicle: [brand: 'BMW'], group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2]]]])]
		List<Card> builtCards = [new Card([order: [number: 1, day: '2020-07-04'], vehicle: [brand: 'BMW'], group: [code: 2, tasks: [[articleCode: 1]]]])]

		when:
		UpdateCards updateCards = panelService.handleCardsUpdate(dbCards, builtCards)

		then:
		updateCards.newCards
		updateCards.newCards.size() == 1
		updateCards.newCards[0].order.number == 1
		updateCards.newCards[0].vehicle.brand == 'BMW'
		updateCards.newCards[0].group.code == 2
		!updateCards.newReplace
		!updateCards.updated
		!updateCards.reset
		!updateCards.deleted
		!updateCards.same
	}

	void "test handle cards update replaced card and updated order info"() {
		given:
		List<Card> dbCards = [new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2]]]])]
		List<Card> builtCards = [new Card([order: [number: 1], vehicle: [brand: 'FV'], group: [code: 2, tasks: [[articleCode: 1]]]])]

		when:
		UpdateCards updateCards = panelService.handleCardsUpdate(dbCards, builtCards)

		then:
		updateCards.newReplace
		updateCards.newReplace.size() == 1
		updateCards.newReplace[0].order.number == 1
		updateCards.newReplace[0].vehicle.brand == 'FV'
		updateCards.newReplace[0].group.code == 2
		!updateCards.newCards
		!updateCards.updated
		!updateCards.reset
		!updateCards.deleted
		!updateCards.same
	}

	void "test handle cards update order cards new group"() {
		given:
		List<Card> dbCards = [
			new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1, tasks: [[articleCode: 1], [articleCode: 2]]]]),
			new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 2, tasks: [[articleCode: 1], [articleCode: 2]]]]),
			new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 3, tasks: [[articleCode: 1], [articleCode: 2]]]]),
		]
		List<Card> builtCards = [
			new Card([order: [number: 1], vehicle: [brand: 'FV'], group: [code: 1, tasks: [[articleCode: 1]]]]),
			new Card([order: [number: 1], vehicle: [brand: 'FV'], group: [code: 2, tasks: [[articleCode: 1]]]]),
			new Card([order: [number: 1], vehicle: [brand: 'FV'], group: [code: 4, tasks: [[articleCode: 7]]]])
		]

		when:
		UpdateCards updateCards = panelService.handleCardsUpdate(dbCards, builtCards)

		then:
		updateCards.newCards
		updateCards.newCards.size() == 1
		updateCards.newCards[0].order.number == 1
		updateCards.newCards[0].vehicle.brand == 'FV'
		updateCards.newCards[0].group.code == 4
		updateCards.updated
		updateCards.updated.size() == 2
		!updateCards.newReplace
		!updateCards.same
		!updateCards.reset
		!updateCards.deleted
	}

	void "test handle cards update order replace eCommerce found cards"() {
		given:
		List<Card> dbCards = [
			new Card([start: time8.toString(), type: Card.CardType.AUXILIARY, status: Card.Status.ECOMMERCE, order: [number: 1, creatorCode: Constants.ECOMMERCE_USER_CODE], vehicle: [brand: 'FV'], group: [code: 1, tasks: [[articleCode: 1]]]]),
		]
		List<Card> builtCards = [
			new Card([duration: 30, order: [number: 1, creatorCode: Constants.ECOMMERCE_USER_CODE, created: time8.toString()], vehicle: [brand: 'FV'], group: [code: 1, tasks: [[articleCode: 1]]]]),
			new Card([duration: 20, order: [number: 1], vehicle: [brand: 'FV'], group: [code: 2, tasks: [[articleCode: 1]]]]),
			new Card([duration: 10, order: [number: 1], vehicle: [brand: 'FV'], group: [code: 4, tasks: [[articleCode: 7]]]])
		]

		when:
		UpdateCards updateCards = panelService.handleCardsUpdate(dbCards, builtCards)

		then:
		updateCards.newReplace
		updateCards.newReplace.size() == 3
		updateCards.newReplace[0].start == time8
		updateCards.newReplace[1].start == time8.plusMinutes(30)
		updateCards.newReplace[2].start == time8.plusMinutes(50)
		updateCards.deleted
		updateCards.deleted.size() == 1
		updateCards.deleted[0].status == Card.Status.ECOMMERCE
		!updateCards.updated
		!updateCards.newCards
		!updateCards.same
		!updateCards.reset
	}

	void "test handle cards update order replace eCommerce not found cards"() {
		given:
		List<Card> dbCards = [
			new Card([order: [number: 2, creatorCode: '123', created: time8.toString()], vehicle: [brand: 'FV'], group: [code: 1, tasks: [[articleCode: 1]]]]),
		]
		List<Card> builtCards = [
			new Card([duration: 30, order: [number: 1, creatorCode: Constants.ECOMMERCE_USER_CODE, created: time8.toString()], vehicle: [brand: 'FV'], group: [code: 1, tasks: [[articleCode: 1]]]]),
			new Card([duration: 20, order: [number: 1], vehicle: [brand: 'FV'], group: [code: 2, tasks: [[articleCode: 1]]]]),
			new Card([duration: 10, order: [number: 1], vehicle: [brand: 'FV'], group: [code: 4, tasks: [[articleCode: 7]]]])
		]

		when:
		UpdateCards updateCards = panelService.handleCardsUpdate(dbCards, builtCards)

		then:
		updateCards.newCards
		updateCards.newCards.size() == 3
		!updateCards.newReplace
		!updateCards.same
		!updateCards.updated
		!updateCards.reset
		!updateCards.deleted
	}

	// endregion

	// region Get deleted order cards

	void "test deleted orders cards no cards to delete"() {
		given:
		List<Card> dbCards = [new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]])]

		when:
		List<Card> cards = panelService.getDeletedOrdersCards([order4Articles], dbCards)

		then:
		!cards
	}

	void "test deleted orders cards card to delete"() {
		given:
		List<Card> dbCards = [new Card([order: [number: 2], vehicle: [brand: 'BMW'], group: [code: 1]])]

		when:
		List<Card> cards = panelService.getDeletedOrdersCards([order4Articles], dbCards)

		then:
		cards.size() == 1
		cards[0].order.number == 2
	}

	// endregion

	// region Get updated group deleted cards

	void "test get updated group deleted cards no cards to delete"() {
		given:
		List<Card> dbCards = [new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]])]
		List<Card> builtCards = [new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]])]

		when:
		List<Card> cards = panelService.getUpdatedGroupDeletedCards(dbCards, builtCards)

		then:
		!cards
	}

	void "test get updated group deleted cards cards to delete"() {
		given:
		List<Card> dbCards = [new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]])]
		List<Card> builtCards = [new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 2]])]

		when:
		List<Card> cards = panelService.getUpdatedGroupDeletedCards(dbCards, builtCards)

		then:
		cards.size() == 1
		cards[0].order.number == 1
		cards[0].group.code == 1
	}

	// endregion

	// region Delete card

	void "test delete card"() {
		given:
		Card card = new Card([order: [number: 2], vehicle: [brand: 'BMW'], group: [code: 1]])

		when:
		Card deletedCard = panelService.deleteCard(card)

		then:
		deletedCard.dateDeleted
	}

	// endregion

	// region Get deleted cards

	void "test get deleted cards no deleted cards"() {
		given:
		List<Card> dbCards = [new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]])]
		List<Card> builtCards = [new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]])]

		when:
		List<Card> cards = panelService.getDeletedCards([order4Articles], dbCards, builtCards)

		then:
		!cards
	}

	void "test get deleted cards deleted order deleted cards"() {
		given:
		List<Card> dbCards = [new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]])]
		List<Card> builtCards = [new Card([order: [number: 2], vehicle: [brand: 'BMW'], group: [code: 1]])]

		when:
		List<Card> cards = panelService.getDeletedCards([order1Article], dbCards, builtCards)

		then:
		cards
		cards.size() == 1
		cards[0].order.number == 1
	}

	void "test get deleted cards deleted updated group deleted card"() {
		given:
		List<Card> dbCards = [new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]])]
		List<Card> builtCards = [new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 2]])]

		when:
		List<Card> cards = panelService.getDeletedCards([order4Articles], dbCards, builtCards)

		then:
		cards
		cards.size() == 1
		cards[0].group.code == 1
	}

	// endregion

	// region Fix same cards deleted info

	void "test fix same cards deleted info no deleted cards"() {
		given:
		List<Card> cards = [
			new Card([
				order: [number: 1],
				vehicle: [brand: 'BMW'],
				group: [code: 1],
				linkedPrevious: new Card(order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 2]),
				linkedNext: new Card(order: [number: 1],vehicle: [brand: 'BMW'],group: [code: 3])
			])
		]

		when:
		panelService.fixSameCardsDeletedInfo(cards, [])

		then:
		cards[0].linkedPrevious
		cards[0].linkedNext
	}

	void "test fix same cards deleted info deleted linked previous"() {
		given:
		List<Card> cards = [
			new Card([
				order: [number: 1],
				vehicle: [brand: 'BMW'],
				group: [code: 1],
				linkedPrevious: new Card(order: [number: 1],vehicle: [brand: 'BMW'],group: [code: 2]),
				linkedNext: new Card(order: [number: 1],vehicle: [brand: 'BMW'],group: [code: 3])
			])
		]
		List<Card> deletedCards = [
			new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 2]])
		]

		when:
		panelService.fixSameCardsDeletedInfo(cards, deletedCards)

		then:
		!cards[0].linkedPrevious
		cards[0].linkedNext
	}

	void "test fix same cards deleted info deleted linked next"() {
		given:
		List<Card> cards = [
			new Card([
				order: [number: 1],
				vehicle: [brand: 'BMW'],
				group: [code: 1],
				linkedPrevious: new Card(order: [number: 1],vehicle: [brand: 'BMW'],group: [code: 2]),
				linkedNext: new Card(order: [number: 1],vehicle: [brand: 'BMW'],group: [code: 3])
			])
		]
		List<Card> deletedCards = [
			new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 3]])
		]

		when:
		panelService.fixSameCardsDeletedInfo(cards, deletedCards)

		then:
		cards[0].linkedPrevious
		!cards[0].linkedNext
	}

	void "test fix same cards deleted info deleted all linked"() {
		given:
		List<Card> cards = [
			new Card([
				order: [number: 1],
				vehicle: [brand: 'BMW'],
				group: [code: 1],
				linkedPrevious: new Card(order: [number: 1],vehicle: [brand: 'BMW'],group: [code: 2]),
				linkedNext: new Card(order: [number: 1],vehicle: [brand: 'BMW'],group: [code: 3])
			])
		]
		List<Card> deletedCards = [
			new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 2]]),
			new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 3]])
		]

		when:
		panelService.fixSameCardsDeletedInfo(cards, deletedCards)

		then:
		!cards[0].linkedPrevious
		!cards[0].linkedNext
	}

	// endregion

	// region Get cards to update

	void "test handle cards no actions needed"() {
		given:
		List<Card> dbCards = [new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]])]
		List<Card> builtCards = [new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]])]

		when:
		UpdateCards updateCards = panelService.getCardsToUpdate([order4Articles], dbCards, builtCards)

		then:
		!updateCards.newCards
		!updateCards.updated
		!updateCards.deleted
		updateCards.same.size() == 1
		updateCards.same[0].order.number == 1
	}

	void "test handle cards new cards"() {
		given:
		List<Card> dbCards = [new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]])]
		List<Card> builtCards = dbCards + [new Card([order: [number: 2], vehicle: [brand: 'BMW'], group: [code: 1]])]

		when:
		UpdateCards updateCards = panelService.getCardsToUpdate([order4Articles, order1Article], dbCards, builtCards)

		then:
		updateCards.newCards.size() == 1
		updateCards.newCards[0].order.number == 2
		updateCards.same.size() == 1
		updateCards.same[0].order.number == 1
		!updateCards.updated
		!updateCards.deleted
	}

	void "test handle cards updated cards"() {
		given:
		List<Card> dbCards = [new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 1]])]
		List<Card> builtCards = [new Card([order: [number: 1], vehicle: [brand: 'FV'], group: [code: 1]])]

		when:
		UpdateCards updateCards = panelService.getCardsToUpdate([order4Articles], dbCards, builtCards)

		then:
		updateCards.updated.size() == 1
		updateCards.updated[0].order.number == 1
		updateCards.updated[0].vehicle.brand == 'FV'
		!updateCards.same
	}

	void "test handle cards updated new cards"() {
		given:
		List<Card> dbCards = [new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [[code: 1, tasks: [[articleCode: 1], [articleCode: 2]]]]])]
		List<Card> builtCards = [new Card([order: [number: 1], vehicle: [brand: 'BMW'], group: [code: 2, tasks: [[articleCode: 3], [articleCode: 4]]]])]

		when:
		UpdateCards updateCards = panelService.getCardsToUpdate([order4Articles], dbCards, builtCards)

		then:
		updateCards.newCards.size() == 1
		updateCards.newCards[0].group.code == 2
		!updateCards.newCards[0].dateDeleted
		updateCards.deleted.size() == 1
		updateCards.deleted[0].group.code == 1
		updateCards.deleted[0].dateDeleted
		!updateCards.updated
		!updateCards.same
	}

	// endregion

	// region Check update appointment day

	void "test check update appointment day no update"() {
		given:
		AppointmentDay existent = new AppointmentDay(
			day: today,
			values: [[appointmentType: [code: 'RAP'], morning: 1, afternoon: 2, total: 3, max: 0]]
		)
		AppointmentDay appointmentDay = new AppointmentDay(
			day: today,
			values: [[appointmentType: [code: 'RAP'], morning: 1, afternoon: 2, total: 3, max: 0]]
		)

		when:
		boolean update = panelService.checkUpdatedAppointmentDay(existent, appointmentDay)

		then:
		!update
	}

	void "test check update appointment day update"() {
		given:
		AppointmentDay existent = new AppointmentDay(
			day: today,
			values: [[appointmentType: [code: 'RAP'], morning: 1, afternoon: 2, total: 3, max: 0]]
		)
		AppointmentDay appointmentDay = new AppointmentDay(
			day: today,
			values: [[appointmentType: [code: 'RAP'], morning: 2, afternoon: 2, total: 4, max: 0]]
		)

		when:
		boolean update = panelService.checkUpdatedAppointmentDay(existent, appointmentDay)

		then:
		update
	}

	// endregion

	// region Check morning type

	void "test check morning type morning"() {
		given:
		LocalTime start = LocalTime.of(10, 0)
		int duration = 60

		when:
		boolean morning = panelService.checkMorningType(start, duration)

		then:
		morning
	}

	void "test check morning type afternoon"() {
		given:
		LocalTime start = LocalTime.of(16, 0)
		int duration = 60

		when:
		boolean morning = panelService.checkMorningType(start, duration)

		then:
		!morning
	}

	void "test check morning type middle day morning"() {
		given:
		LocalTime start = LocalTime.of(14, 25)
		int duration = 60

		when:
		boolean morning = panelService.checkMorningType(start, duration)

		then:
		morning
	}

	void "test check morning type middle day"() {
		given:
		LocalTime start = LocalTime.of(14, 30)
		int duration = 60

		when:
		boolean morning = panelService.checkMorningType(start, duration)

		then:
		!morning
	}

	// endregion

	// region Fill schedule type appointment values

	void "test fill schedule type appointment values morning add"() {
		given:
		AppointmentTypeValues values = new AppointmentTypeValues()
		LocalTime orderStart = LocalTime.of(10, 0)
		int orderDuration = 60

		when:
		panelService.fillScheduleTypeAppointmentValues(values, orderStart, orderDuration, 1)

		then:
		values.morning == 1
		values.afternoon == 0
	}

	void "test fill schedule type appointment values afternoon add"() {
		given:
		AppointmentTypeValues values = new AppointmentTypeValues()
		LocalTime orderStart = LocalTime.of(19, 0)
		int orderDuration = 60

		when:
		panelService.fillScheduleTypeAppointmentValues(values, orderStart, orderDuration, 1)

		then:
		values.morning == 0
		values.afternoon == 1
	}

	void "test fill schedule type appointment values middle day morning add"() {
		given:
		AppointmentTypeValues values = new AppointmentTypeValues()
		LocalTime orderStart = LocalTime.of(14, 25)
		int orderDuration = 60

		when:
		panelService.fillScheduleTypeAppointmentValues(values, orderStart, orderDuration, 1)

		then:
		values.morning == 1
		values.afternoon == 0
	}

	void "test fill schedule type appointment values middle day afternoon add"() {
		given:
		AppointmentTypeValues values = new AppointmentTypeValues()
		LocalTime orderStart = LocalTime.of(14, 35)
		int orderDuration = 60

		when:
		panelService.fillScheduleTypeAppointmentValues(values, orderStart, orderDuration, 1)

		then:
		values.morning == 0
		values.afternoon == 1
	}

	void "test fill schedule type appointment values morning remove"() {
		given:
		AppointmentTypeValues values = new AppointmentTypeValues()
		values.morning = 7
		LocalTime orderStart = LocalTime.of(10, 30)
		int orderDuration = 60

		when:
		panelService.fillScheduleTypeAppointmentValues(values, orderStart, orderDuration, -1)

		then:
		values.morning == 6
		values.afternoon == 0
	}

	// endregion

	// region Find order cards appointment types

	void "test find order cards appointment types only RAP appointments"() {
		given:
		List<Card> cards = [
			new Card([
				order: [number: 1, code: 'C1', day: today.minusDays(1)],
				duration: 20,
				vehicle: [brand: 'FV'],
				divisionIndex: 0,
				group: [appointmentType: new AppointmentType(code: AppointmentTypeCode.RAP)]
			]),
			new Card([
				order: [number: 1, code: 'C1', day: today],
				duration: 20,
				vehicle: [brand: 'FV'],
				divisionIndex: 0,
				group: [appointmentType: new AppointmentType(code: AppointmentTypeCode.RAP)]
			]),
			new Card([
				order: [number: 1, code: 'C1', day: today.plusDays(1)],
				duration: 20,
				vehicle: [brand: 'FV'],
				divisionIndex: 0,
				group: [appointmentType: new AppointmentType(code: AppointmentTypeCode.RAP)]
			])
		]

		when:
		List<AppointmentTypeCode> appointmentTypeCodes = panelService.findOrderCardsAppointmentTypes(cards)

		then:
		appointmentTypeCodes.size() == 1
		appointmentTypeCodes[0] == AppointmentTypeCode.RAP
	}

	void "test find order cards appointment types only RAP and INT appointments"() {
		given:
		List<Card> cards = [
			new Card([
				order: [number: 1, code: 'C1', day: today.minusDays(1)],
				duration: 20,
				vehicle: [brand: 'FV'],
				divisionIndex: 0,
				group: [appointmentType: new AppointmentType(code: AppointmentTypeCode.INT)]
			]),
			new Card([
				order: [number: 1, code: 'C1', day: today],
				duration: 20,
				vehicle: [brand: 'FV'],
				divisionIndex: 0,
				group: [appointmentType: new AppointmentType(code: AppointmentTypeCode.RAP)]
			]),
			new Card([
				order: [number: 1, code: 'C1', day: today.plusDays(1)],
				duration: 20,
				vehicle: [brand: 'FV'],
				divisionIndex: 0,
				group: [appointmentType: new AppointmentType(code: AppointmentTypeCode.RAP)]
			])
		]

		when:
		List<AppointmentTypeCode> appointmentTypeCodes = panelService.findOrderCardsAppointmentTypes(cards)

		then:
		appointmentTypeCodes.size() == 2
		appointmentTypeCodes[0] == AppointmentTypeCode.RAP
		appointmentTypeCodes[1] == AppointmentTypeCode.INT
	}

	void "test find order cards appointment types one TP appointment"() {
		given:
		List<Card> cards = [
			new Card([
				order: [number: 1, code: 'C1', day: today.minusDays(1)],
				duration: 20,
				vehicle: [brand: 'FV'],
				divisionIndex: 0,
				group: [appointmentType: new AppointmentType(code: AppointmentTypeCode.INT)]
			]),
			new Card([
				order: [number: 1, code: 'C1', day: today],
				duration: 20,
				vehicle: [brand: 'FV'],
				divisionIndex: 0,
				group: [appointmentType: new AppointmentType(code: AppointmentTypeCode.TP)]
			]),
			new Card([
				order: [number: 1, code: 'C1', day: today.plusDays(1)],
				duration: 20,
				vehicle: [brand: 'FV'],
				divisionIndex: 0,
				group: [appointmentType: new AppointmentType(code: AppointmentTypeCode.RAP)]
			])
		]

		when:
		List<AppointmentTypeCode> appointmentTypeCodes = panelService.findOrderCardsAppointmentTypes(cards)

		then:
		appointmentTypeCodes.size() == 1
		appointmentTypeCodes[0] == AppointmentTypeCode.TP
	}

	// endregion

	// region Fill appointment days

	void "test fill appointment days no cards"() {
		given:
		List<AppointmentDay> appointmentDays = [
			new AppointmentDay([day: today, values: [[appointmentType: [code: 'TP'], morning: 0, afternoon: 0, total: 0, max: 0]]]),
		]

		when:
		appointmentDays = panelService.fillAppointmentDays(appointmentDays, [], [])

		then:
		AppointmentTypeValues values = appointmentDays[0].values.find {
			it.appointmentType.code == AppointmentTypeCode.TP
		}
		values
		values.morning == 0
		values.afternoon == 0
	}

	void "test fill appointment days today order cards"() {
		given:
		List<AppointmentDay> appointmentDays = [
			new AppointmentDay([day: today, values: [[appointmentType: [code: 'TP'], morning: 0, afternoon: 0, total: 0, max: 0]]]),
		]
		List<Card> cards = [
			new Card([
				order: [number: 1, code: 'C1', day: today, created: '10:00'],
				duration: 20,
				vehicle: [brand: 'FV'],
				divisionIndex: 0,
				group: [appointmentType: new AppointmentType(code: AppointmentTypeCode.TP)]
			])
		]
		when:
		appointmentDays = panelService.fillAppointmentDays(appointmentDays, [], cards)

		then:
		AppointmentTypeValues values = appointmentDays[0].values.find {
			it.appointmentType.code == AppointmentTypeCode.TP
		}
		values
		values.morning == 1
		values.afternoon == 0
	}

	void "test fill appointment days yesterday order cards"() {
		given:
		List<AppointmentDay> appointmentDays = [
			new AppointmentDay([day: today, values: [[appointmentType: [code: 'TP'], morning: 0, afternoon: 0, total: 0, max: 0]]]),
		]
		List<Card> cards = [
			new Card([
				order: [number: 1, code: 'C1', day: today.minusDays(1), created: '10:00'],
				duration: 20,
				vehicle: [brand: 'FV'],
				divisionIndex: 0,
				group: [appointmentType: new AppointmentType(code: AppointmentTypeCode.TP)]
			])
		]
		when:
		appointmentDays = panelService.fillAppointmentDays(appointmentDays, [], cards)

		then:
		AppointmentTypeValues values = appointmentDays[0].values.find {
			it.appointmentType.code == AppointmentTypeCode.TP
		}
		values
		values.morning == 1
		values.afternoon == 0
	}

	void "test fill appointment days several day order cards"() {
		given:
		List<AppointmentDay> appointmentDays = [
			new AppointmentDay([day: today, values: [[appointmentType: [code: 'TP'], morning: 0, afternoon: 0, total: 0, max: 0]]]),
			new AppointmentDay([day: today.plusDays(1), values: [[appointmentType: [code: 'RAP'], morning: 0, afternoon: 0, total: 0, max: 0]]])
		]
		List<Card> cards = [
			new Card([
				order: [number: 1, code: 'C1', day: today, created: '10:00'],
				duration: 20,
				vehicle: [brand: 'FV'],
				divisionIndex: 0,
				group: [appointmentType: new AppointmentType(code: AppointmentTypeCode.TP)]
			]),
			new Card([
				order: [number: 2, code: 'C2', day: today.plusDays(1), created: '19:00'],
				duration: 20,
				vehicle: [brand: 'FV'],
				divisionIndex: 0,
				group: [appointmentType: new AppointmentType(code: AppointmentTypeCode.RAP)]
			])
		]
		when:
		appointmentDays = panelService.fillAppointmentDays(appointmentDays, [], cards)

		then:
		AppointmentTypeValues values = appointmentDays[0].values.find {
			it.appointmentType.code == AppointmentTypeCode.TP
		}
		values
		values.morning == 1
		values.afternoon == 0
		AppointmentTypeValues rapValues = appointmentDays[1].values.find {
			it.appointmentType.code == AppointmentTypeCode.RAP
		}
		rapValues
		rapValues.morning == 0
		rapValues.afternoon == 1
	}

	void "test fill appointment days existent appointment days max today order cards"() {
		given:
		List<AppointmentDay> appointmentDays = [
			new AppointmentDay([day: today, values: [[appointmentType: [code: 'TP'], morning: 0, afternoon: 0, total: 0, max: 0]]]),
		]
		List<AppointmentDay> existentAppointmentDays = [
			new AppointmentDay([day: today, values: [[appointmentType: [code: 'TP'], morning: 0, afternoon: 0, total: 0, max: 3]]]),
		]
		List<Card> cards = [
			new Card([
				order: [number: 1, code: 'C1', day: today, created: '10:00'],
				duration: 20,
				vehicle: [brand: 'FV'],
				divisionIndex: 0,
				group: [appointmentType: new AppointmentType(code: AppointmentTypeCode.TP)]
			])
		]
		when:
		appointmentDays = panelService.fillAppointmentDays(appointmentDays, existentAppointmentDays, cards)

		then:
		AppointmentTypeValues values = appointmentDays[0].values.find {
			it.appointmentType.code == AppointmentTypeCode.TP
		}
		values
		values.morning == 1
		values.afternoon == 0
		values.max == 3
	}

	// endregion

	// region Find update info appointment days

	void "test find update info appointment days no update info"() {
		given:
		List<AppointmentDay> existent = [
			new AppointmentDay([day: today, values: [[appointmentType: [code: 'RAP'], morning: 1, afternoon: 2, total: 3, max: 0]]]),
		]
		List<AppointmentDay> appointmentDays = [
			new AppointmentDay([day: today, values: [[appointmentType: [code: 'RAP'], morning: 1, afternoon: 2, total: 3, max: 0]]]),
		]

		when:
		UpdateAppointmentDays updateAppointmentDays = panelService.findUpdateAppointmentDays(existent, appointmentDays)

		then:
		!updateAppointmentDays.created
		!updateAppointmentDays.updated
	}

	void "test find update info appointment days created appointment days"() {
		given:
		List<AppointmentDay> existent = [
			new AppointmentDay([day: today, values: [[appointmentType: [code: 'RAP'], morning: 1, afternoon: 2, total: 3, max: 0]]]),
		]
		List<AppointmentDay> appointmentDays = [
			new AppointmentDay([day: today.plusDays(1), values: [[appointmentType: [code: 'RAP'], morning: 1, afternoon: 2, total: 3, max: 0]]]),
		]

		when:
		UpdateAppointmentDays updateAppointmentDays = panelService.findUpdateAppointmentDays(existent, appointmentDays)

		then:
		updateAppointmentDays.created
		updateAppointmentDays.created.size() == 1
		updateAppointmentDays.created[0].values.find { it.appointmentType.code == AppointmentTypeCode.RAP }
		!updateAppointmentDays.updated
	}

	void "test find update info appointment days updated appointment days"() {
		given:
		List<AppointmentDay> existent = [
			new AppointmentDay([day: today, values: [[appointmentType: [code: 'RAP'], morning: 1, afternoon: 2, total: 3, max: 0]]]),
		]
		List<AppointmentDay> appointmentDays = [
			new AppointmentDay([day: today, values: [[appointmentType: [code: 'RAP'], morning: 4, afternoon: 2, total: 6, max: 0]]]),
		]

		when:
		UpdateAppointmentDays updateAppointmentDays = panelService.findUpdateAppointmentDays(existent, appointmentDays)

		then:
		!updateAppointmentDays.created
		updateAppointmentDays.updated
		updateAppointmentDays.updated.size() == 1
		AppointmentTypeValues values = updateAppointmentDays.updated[0].values.find {
			it.appointmentType.code == AppointmentTypeCode.RAP
		}
		values
		values.morning == 4
	}

	// endregion

	// region Sync appointments days

	void "test sync appointment days updated appointment day"() {
		given:
		List<LocalDate> days = [today]
		LocalTime orderStart = LocalTime.of(12, 0)
		List<AppointmentDay> appointmentDays = [new AppointmentDay(today, appointmentTypes)]
		appointmentDays[0].values.find { it.appointmentType.code == AppointmentTypeCode.RAP }.morning = 1
		appointmentDays[0].values.find { it.appointmentType.code == AppointmentTypeCode.RAP }.total = 1

		List<Card> cards = [
			new Card([
				order: [number: 1, code: 'C1', day: today, created: orderStart.toString()],
				duration: 20,
				vehicle: [brand: 'FV'],
				divisionIndex: 0,
				group: [appointmentType: new AppointmentType(code: AppointmentTypeCode.RAP)]
			]),
			new Card([
				order: [number: 1, code: 'C1', day: today],
				duration: 20,
				vehicle: [brand: 'FV'],
				divisionIndex: 0,
				group: [appointmentType: new AppointmentType(code: AppointmentTypeCode.TP)]
			])
		]

		when:
		List<AppointmentDay> updatedAppointmentDays = panelService.syncAppointmentDays(
			days, appointmentDays, appointmentTypes, cards
		)

		then:
		updatedAppointmentDays.size() == 1
		AppointmentTypeValues rapValues = updatedAppointmentDays[0].values.find { it.appointmentType.code == AppointmentTypeCode.RAP }
		rapValues.morning == 0
		rapValues.total == 0
		AppointmentTypeValues tpValues = updatedAppointmentDays[0].values.find { it.appointmentType.code == AppointmentTypeCode.TP }
		tpValues.morning == 1
		tpValues.total == 1
	}

	// endregion

}
