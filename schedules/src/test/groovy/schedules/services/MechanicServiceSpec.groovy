package schedules.services


import io.micronaut.test.extensions.spock.annotation.MicronautTest
import spock.lang.Specification

@MicronautTest
class MechanicServiceSpec extends Specification {

//	// region Collaborators
//
//	@Inject MechanicsService mechanicsService
//
//	@Inject EmployeeScheduleDataService employeeScheduleDataService
//	@Inject SkillEmployeeDataService skillEmployeeDataService
//
//	@MockBean(EmployeeScheduleDataService)
//	EmployeeScheduleDataService employeeScheduleDataService() {
//	    Mock(EmployeeScheduleDataService)
//	}
//
//	@MockBean(SkillEmployeeDataService)
//	SkillEmployeeDataService skillEmployeeDataService() {
//		Mock(SkillEmployeeDataService)
//	}
//
//	// region Find mechanic skills
//
//	void "test find mechanic skills no garage or shop job position group"() {
//		given:
//		EmployeeSchedule mechanic = new EmployeeSchedule(jobPositionGroupCode: JobPositionGroupCode.MANAGER)
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
//		EmployeeSchedule mechanic = new EmployeeSchedule(code: '1', jobPositionGroupCode: JobPositionGroupCode.GARAGE)
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
//		EmployeeSchedule mechanic = new EmployeeSchedule(code: '1', jobPositionGroupCode: JobPositionGroupCode.GARAGE)
//		List<SkillEmployee> skillEmployees = [
//            new SkillEmployee(employeeCode: '2', skillCode: 'A', month: LocalDate.now().withDayOfMonth(1)),
//            new SkillEmployee(employeeCode: '2', skillCode: 'B', month: LocalDate.now().withDayOfMonth(1)),
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
//		EmployeeSchedule mechanic = new EmployeeSchedule(code: '1', jobPositionGroupCode: JobPositionGroupCode.GARAGE)
//		List<SkillEmployee> skillEmployees = [
//            new SkillEmployee(employeeCode: '1', skillCode: 'A', month: LocalDate.now().withDayOfMonth(1)),
//            new SkillEmployee(employeeCode: '1', skillCode: 'B', month: LocalDate.now().withDayOfMonth(1)),
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
//		EmployeeSchedule mechanic = new EmployeeSchedule(code: '1', jobPositionGroupCode: JobPositionGroupCode.GARAGE)
//		List<SkillEmployee> skillEmployees = [
//            new SkillEmployee(employeeCode: '1', skillCode: 'A', month: LocalDate.now().minusMonths(1).withDayOfMonth(1)),
//            new SkillEmployee(employeeCode: '1', skillCode: 'A', month: LocalDate.now().withDayOfMonth(1)),
//            new SkillEmployee(employeeCode: '1', skillCode: 'B', month: LocalDate.now().minusMonths(1).withDayOfMonth(1)),
//            new SkillEmployee(employeeCode: '1', skillCode: 'B', month: LocalDate.now().withDayOfMonth(1)),
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
//	// region Find mechanics
//
//	void "test find mechanic no mechanics"() {
//		given:
//		LocalDate from = LocalDate.now().minusDays(2)
//		LocalDate to = LocalDate.now()
//		employeeScheduleDataService.findAll(from, to, JobPositionGroupCode.GARAGE) >> []
//
//		when:
//		List<EmployeeSchedule> mechanics = mechanicsService.findMechanics(from, to)
//
//		then:
//		!mechanics
//	}
//
//	void "test find mechanic one mechanic without skills"() {
//		given:
//		LocalDate from = LocalDate.now().minusDays(2)
//		LocalDate to = LocalDate.now()
//		employeeScheduleDataService.findAll(from, to, JobPositionGroupCode.GARAGE) >> [
//		    new EmployeeSchedule(id: 1, day: from, code: "1")
//		]
//		skillEmployeeDataService.findAll((List<String>) _) >> []
//
//		when:
//		List<EmployeeSchedule> mechanics = mechanicsService.findMechanics(from, to)
//
//		then:
//		mechanics
//		mechanics.size() == 1
//		!mechanics[0].skills
//	}
//
//	void "test find mechanic several mechanics with skills"() {
//		given:
//		LocalDate from = LocalDate.now().minusDays(2)
//		LocalDate to = LocalDate.now()
//		employeeScheduleDataService.findAll(from, to, JobPositionGroupCode.GARAGE) >> [
//            new EmployeeSchedule(day: from, code: "1", jobPositionGroupCode: JobPositionGroupCode.GARAGE),
//            new EmployeeSchedule(day: from, code: "2", jobPositionGroupCode: JobPositionGroupCode.GARAGE)
//		]
//		skillEmployeeDataService.findAll((List<String>) _) >> [new SkillEmployee("A", "2")]
//
//		when:
//		List<EmployeeSchedule> mechanics = mechanicsService.findMechanics(from, to)
//
//		then:
//		mechanics
//		mechanics.size() == 2
//		mechanics.findAll { it.skills }.size() == 1
//		mechanics[1].skills[0].skillCode == "A"
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
//		mechanics = mechanicsService.fillMechanics(mechanics, [])
//
//		then:
//		!mechanics
//	}
//
//	void "test fill mechanic one mechanic without skills"() {
//		List<EmployeeSchedule> mechanics = [new EmployeeSchedule(id: 1, day: LocalDate.now(), code: "1")]
//
//		when:
//		mechanics = mechanicsService.fillMechanics(mechanics, [])
//
//		then:
//		mechanics
//		mechanics.size() == 1
//		!mechanics[0].skills
//	}
//
//	void "test fill mechanic several mechanics with skills"() {
//		given:
//		List<EmployeeSchedule> mechanics = [
//            new EmployeeSchedule(day: LocalDate.now().minusDays(1), code: "1", jobPositionGroupCode: JobPositionGroupCode.GARAGE),
//            new EmployeeSchedule(day: LocalDate.now().minusDays(1), code: "2", jobPositionGroupCode: JobPositionGroupCode.GARAGE),
//            new EmployeeSchedule(day: LocalDate.now(), code: "3", jobPositionGroupCode: JobPositionGroupCode.GARAGE),
//            new EmployeeSchedule(day: LocalDate.now(), code: "4", jobPositionGroupCode: JobPositionGroupCode.GARAGE)
//		]
//		List<SkillEmployee> skills = [
//            new SkillEmployee("A", "1"),
//            new SkillEmployee("B", "2"),
//            new SkillEmployee("A", "3")
//		]
//
//		when:
//		mechanics = mechanicsService.fillMechanics(mechanics, skills)
//
//		then:
//		mechanics
//		mechanics.size() == 4
//		mechanics.findAll { it.skills }.size() == 3
//		mechanics[0].skills[0].skillCode == "A"
//		mechanics[1].skills[0].skillCode == "B"
//		mechanics[2].skills[0].skillCode == "A"
//	}
//
//	// endregion

}
