package panel.services


import io.micronaut.test.extensions.spock.annotation.MicronautTest
import spock.lang.Specification

@MicronautTest
class MechanicServiceSpec extends Specification {

	// region Collaborators

//	@Inject MechanicsService mechanicsService
//
//	@Inject EmployeeScheduleDataService employeeScheduleDataService
//	@Inject MechanicAppointmentDataService mechanicAppointmentDataService
//	@Inject MechanicPanelInfoDataService mechanicPanelInfoDataService
//	@Inject SkillEmployeeDataService skillEmployeeDataService
//
//	@MockBean(EmployeeScheduleDataService)
//	EmployeeScheduleDataService employeeScheduleDataService() {
//	    Mock(EmployeeScheduleDataService)
//	}
//
//	@MockBean(MechanicAppointmentDataService)
//	MechanicAppointmentDataService mechanicAppointmentDataService() {
//	    Mock(MechanicAppointmentDataService)
//	}
//
//	@MockBean(MechanicPanelInfoDataService)
//	MechanicPanelInfoDataService mechanicPanelInfoDataService() {
//	    Mock(MechanicPanelInfoDataService)
//	}
//
//	@MockBean(SkillEmployeeDataService)
//	SkillEmployeeDataService skillEmployeeDataService() {
//		Mock(SkillEmployeeDataService)
//	}
//
//	// region Find mechanic position
//
//	void "test find mechanic position no other mechanics"() {
//		given:
//		List<EmployeeSchedule> dayMechanics = []
//
//		when:
//		String position = mechanicsService.findMechanicPosition(dayMechanics)
//
//		then:
//		position == Constants.FIRST_MECHANIC_POSITION
//	}
//
//	void "test find mechanic position other day mechanics no panel info"() {
//		given:
//		List<EmployeeSchedule> dayMechanics = [new EmployeeSchedule()]
//
//		when:
//		String position = mechanicsService.findMechanicPosition(dayMechanics)
//
//		then:
//		position == Constants.FIRST_MECHANIC_POSITION
//	}
//
//	void "test find mechanic position other day mechanics with panel info"() {
//		given:
//		List<EmployeeSchedule> dayMechanics = [
//			new EmployeeSchedule(panelInfo: new MechanicPanelInfo(position: "A")),
//			new EmployeeSchedule(panelInfo: new MechanicPanelInfo(position: "B"))
//		]
//
//		when:
//		String position = mechanicsService.findMechanicPosition(dayMechanics)
//
//		then:
//		position == "C"
//	}
//
//	// endregion
//
//	// region Find mechanic skills
//
//	void "test find mechanic skills no garage or shop job position group"() {
//		given:
//		EmployeeSchedule mechanic = new EmployeeSchedule(jobPositionGroupCode: JobPositionGroup.Code.MANAGER)
//
//		when:
//		List<SkillEmployee> skills = mechanicsService.findMechanicSkills(mechanic, [])
//
//		then:
//		!skills
//	}
//
//	void "test find mechanic skills no skill employees"() {
//		given:
//		EmployeeSchedule mechanic = new EmployeeSchedule(code: '1', jobPositionGroupCode: JobPositionGroup.Code.GARAGE)
//		List<SkillEmployee> skillEmployees = []
//
//		when:
//		List<SkillEmployee> skills = mechanicsService.findMechanicSkills(mechanic, skillEmployees)
//
//		then:
//		!skills
//	}
//
//	void "test find mechanic skills no skill employee for employee code"() {
//		given:
//		EmployeeSchedule mechanic = new EmployeeSchedule(code: '1', jobPositionGroupCode: JobPositionGroup.Code.GARAGE)
//		List<SkillEmployee> skillEmployees = [
//		    new SkillEmployee(employeeCode: '2', skillCode: 'A', month: LocalDate.now().withDayOfMonth(1)),
//		    new SkillEmployee(employeeCode: '2', skillCode: 'B', month: LocalDate.now().withDayOfMonth(1)),
//		]
//
//		when:
//		List<SkillEmployee> skills = mechanicsService.findMechanicSkills(mechanic, skillEmployees)
//
//		then:
//		!skills
//	}
//
//	void "test find mechanic skills one skill employee per month"() {
//		given:
//		EmployeeSchedule mechanic = new EmployeeSchedule(code: '1', jobPositionGroupCode: JobPositionGroup.Code.GARAGE)
//		List<SkillEmployee> skillEmployees = [
//		    new SkillEmployee(employeeCode: '1', skillCode: 'A', month: LocalDate.now().withDayOfMonth(1)),
//		    new SkillEmployee(employeeCode: '1', skillCode: 'B', month: LocalDate.now().withDayOfMonth(1)),
//		]
//
//		when:
//		List<SkillEmployee> skills = mechanicsService.findMechanicSkills(mechanic, skillEmployees)
//
//		then:
//		skills
//		skills.size() == skillEmployees.size()
//	}
//
//	void "test find mechanic skills repeated skill employee per month"() {
//		given:
//		EmployeeSchedule mechanic = new EmployeeSchedule(code: '1', jobPositionGroupCode: JobPositionGroup.Code.GARAGE)
//		List<SkillEmployee> skillEmployees = [
//			new SkillEmployee(employeeCode: '1', skillCode: 'A', month: LocalDate.now().minusMonths(1).withDayOfMonth(1)),
//			new SkillEmployee(employeeCode: '1', skillCode: 'A', month: LocalDate.now().withDayOfMonth(1)),
//			new SkillEmployee(employeeCode: '1', skillCode: 'B', month: LocalDate.now().minusMonths(1).withDayOfMonth(1)),
//			new SkillEmployee(employeeCode: '1', skillCode: 'B', month: LocalDate.now().withDayOfMonth(1)),
//		]
//
//		when:
//		List<SkillEmployee> skills = mechanicsService.findMechanicSkills(mechanic, skillEmployees)
//
//		then:
//		skills
//		skills.size() == 2
//		skills[0].month == LocalDate.now().withDayOfMonth(1)
//		skills[1].month == LocalDate.now().withDayOfMonth(1)
//	}
//
//	// endregion
//
//	// region Find mechanic panel info
//
//	void "test find mechanic panel info no panel info no day mechanics info"() {
//		given:
//		EmployeeSchedule mechanic = new EmployeeSchedule(id: 1)
//		List<MechanicPanelInfo> panelInfo = []
//		List<EmployeeSchedule> dayMechanics = [mechanic]
//
//		when:
//		MechanicPanelInfo mechanicPanelInfo = mechanicsService.findMechanicPanelInfo(mechanic, panelInfo, dayMechanics)
//
//		then:
//		mechanicPanelInfo.mechanicId == 1
//		mechanicPanelInfo.position == Constants.FIRST_MECHANIC_POSITION
//	}
//
//	void "test find mechanic panel info no panel info other day mechanics without panel info"() {
//		given:
//		EmployeeSchedule mechanic = new EmployeeSchedule(id: 1)
//		List<MechanicPanelInfo> panelInfo = []
//		List<EmployeeSchedule> dayMechanics = [mechanic, new EmployeeSchedule(id: 2), new EmployeeSchedule(id: 3)]
//
//		when:
//		MechanicPanelInfo mechanicPanelInfo = mechanicsService.findMechanicPanelInfo(mechanic, panelInfo, dayMechanics)
//
//		then:
//		mechanicPanelInfo.mechanicId == 1
//		mechanicPanelInfo.position == Constants.FIRST_MECHANIC_POSITION
//	}
//
//	void "test find mechanic panel info no panel info other day mechanics with panel info"() {
//		given:
//		EmployeeSchedule mechanic = new EmployeeSchedule(id: 1)
//		List<MechanicPanelInfo> panelInfo = []
//		List<EmployeeSchedule> dayMechanics = [
//			mechanic,
//			new EmployeeSchedule(id: 2, panelInfo: new MechanicPanelInfo(position: "A")),
//			new EmployeeSchedule(id: 3, panelInfo: new MechanicPanelInfo(position: "B"))
//		]
//
//		when:
//		MechanicPanelInfo mechanicPanelInfo = mechanicsService.findMechanicPanelInfo(mechanic, panelInfo, dayMechanics)
//
//		then:
//		mechanicPanelInfo.mechanicId == 1
//		mechanicPanelInfo.position == "C"
//	}
//
//	void "test find mechanic panel info already existent panel info"() {
//		given:
//		EmployeeSchedule mechanic = new EmployeeSchedule(id: 1)
//		List<MechanicPanelInfo> panelInfo = [new MechanicPanelInfo(mechanicId: 1, position: "C")]
//		List<EmployeeSchedule> dayMechanics = [mechanic]
//
//		when:
//		MechanicPanelInfo mechanicPanelInfo = mechanicsService.findMechanicPanelInfo(mechanic, panelInfo, dayMechanics)
//
//		then:
//		mechanicPanelInfo.mechanicId == 1
//		mechanicPanelInfo.position == "C"
//	}
//
//	// endregion
//
//	// region Find mechanics
//
//	void "test find mechanic no mechanics"() {
//		given:
//		LocalDate from = LocalDate.now().minusDays(2)
//		LocalDate to = LocalDate.now()
//		employeeScheduleDataService.findAll(from, to, JobPositionGroup.Code.GARAGE) >> []
//
//		when:
//		List<EmployeeSchedule> mechanics = mechanicsService.findMechanics(from, to)
//
//		then:
//		!mechanics
//	}
//
//	void "test find mechanic one mechanic without panel info"() {
//		given:
//		LocalDate from = LocalDate.now().minusDays(2)
//		LocalDate to = LocalDate.now()
//		employeeScheduleDataService.findAll(from, to, JobPositionGroup.Code.GARAGE) >> [
//		    new EmployeeSchedule(id: 1, day: from, code: "1")
//		]
//		mechanicPanelInfoDataService.findAll((List<Long>) _) >> []
//		mechanicAppointmentDataService.findAll((List<Long>) _) >> []
//
//		when:
//		List<EmployeeSchedule> mechanics = mechanicsService.findMechanics(from, to)
//
//		then:
//		mechanics
//		mechanics.size() == 1
//		mechanics[0].panelInfo.position == Constants.FIRST_MECHANIC_POSITION
//		!mechanics[0].appointments
//	}
//
//	void "test find mechanic several mechanics with panel info"() {
//		given:
//		LocalDate from = LocalDate.now().minusDays(2)
//		LocalDate to = LocalDate.now()
//		employeeScheduleDataService.findAll(from, to, JobPositionGroup.Code.GARAGE) >> [
//		    new EmployeeSchedule(id: 1, day: from, code: "1"),
//		    new EmployeeSchedule(id: 2, day: from, code: "2"),
//		    new EmployeeSchedule(id: 3, day: to, code: "3"),
//		    new EmployeeSchedule(id: 4, day: to, code: "4")
//		]
//		mechanicPanelInfoDataService.findAll((List<Long>) _) >> [
//		    new MechanicPanelInfo(1, "A"),
//		    new MechanicPanelInfo(2, "B"),
//		    new MechanicPanelInfo(3, "A"),
//		    new MechanicPanelInfo(4, "B"),
//		]
//		mechanicAppointmentDataService.findAll((List<Long>) _) >> []
//
//		when:
//		List<EmployeeSchedule> mechanics = mechanicsService.findMechanics(from, to)
//
//		then:
//		mechanics
//		mechanics.size() == 4
//		mechanics[0].panelInfo.position == "A"
//		mechanics[1].panelInfo.position == "B"
//		mechanics[2].panelInfo.position == "A"
//		mechanics[3].panelInfo.position == "B"
//	}
//
//	// endregion
//
//	// region Fill mechanics
//
//	void "test fill mechanics no mechanics"() {
//		given:
//		List<EmployeeSchedule> mechanics = []
//
//		when:
//		mechanics = mechanicsService.fillMechanics(mechanics, [], [])
//
//		then:
//		!mechanics
//	}
//
//	void "test fill mechanic one mechanic without panel info"() {
//		List<EmployeeSchedule> mechanics = [new EmployeeSchedule(id: 1, day: LocalDate.now(), code: "1")]
//
//		when:
//		mechanics = mechanicsService.fillMechanics(mechanics, [], [])
//
//		then:
//		mechanics
//		mechanics.size() == 1
//		mechanics[0].panelInfo.position == Constants.FIRST_MECHANIC_POSITION
//		!mechanics[0].appointments
//	}
//
//	void "test fill mechanic several mechanics with panel info"() {
//		given:
//		List<EmployeeSchedule> mechanics = [
//		    new EmployeeSchedule(id: 1, day: LocalDate.now().minusDays(1), code: "1"),
//		    new EmployeeSchedule(id: 2, day: LocalDate.now().minusDays(1), code: "2"),
//		    new EmployeeSchedule(id: 3, day: LocalDate.now(), code: "3"),
//		    new EmployeeSchedule(id: 4, day: LocalDate.now(), code: "4")
//		]
//		List<MechanicPanelInfo> panelInfo = [
//		    new MechanicPanelInfo(1, "A"),
//		    new MechanicPanelInfo(2, "B"),
//		    new MechanicPanelInfo(3, "A"),
//		    new MechanicPanelInfo(4, "B"),
//		]
//
//		when:
//		mechanics = mechanicsService.fillMechanics(mechanics, panelInfo, [])
//
//		then:
//		mechanics
//		mechanics.size() == 4
//		mechanics[0].panelInfo.position == "A"
//		mechanics[1].panelInfo.position == "B"
//		mechanics[2].panelInfo.position == "A"
//		mechanics[3].panelInfo.position == "B"
//	}
//
//	// endregion

}
