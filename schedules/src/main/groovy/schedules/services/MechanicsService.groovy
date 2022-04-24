package schedules.services

import groovy.transform.CompileStatic
import jakarta.inject.Inject
import jakarta.inject.Singleton
import schedules.domains.EmployeeSchedule
import schedules.domains.skills.SkillEmployee
import schedules.pogos.JobPositionGroupCode
import schedules.services.data.EmployeeScheduleDataService
import schedules.services.data.skills.SkillEmployeeDataService

import java.time.LocalDate

@Singleton
@CompileStatic
class MechanicsService {

	private static List<JobPositionGroupCode> SKILL_GROUP_CODES = [
		JobPositionGroupCode.GARAGE, JobPositionGroupCode.SHOP
	]

	@Inject EmployeeScheduleDataService employeeScheduleDataService
	@Inject SkillEmployeeDataService skillEmployeeDataService

	/**
	 * Obtiene los mecánicos para cada día y carga su posición si todavía no está definida
	 * @param from Fecha desde
	 * @param to Fecha hasta
	 * @return Lista de mecánicos
	 */
	List<EmployeeSchedule> findMechanics(LocalDate from, LocalDate to) {
		List<EmployeeSchedule> mechanics = employeeScheduleDataService.findAll(from, to, JobPositionGroupCode.GARAGE)
		List<SkillEmployee> skillEmployees = skillEmployeeDataService.findAll((List<String>) mechanics.code)

		return fillMechanics(mechanics, skillEmployees)
	}

	/**
	 * Rellena los mecánicos con la información de panel y de citas
	 * @param mechanics Lista de mecánicos
	 * @param panelInfo Lista con información de panel
	 * @param appointments Lista con citas
	 * @param skills Lista de habilidades de mecánicos
	 * @return Lista de mecánicos
	 */
	static List<EmployeeSchedule> fillMechanics(List<EmployeeSchedule> mechanics, List<SkillEmployee> skills) {
		mechanics.groupBy { it.day }.each { LocalDate day, List<EmployeeSchedule> dayMechanics ->
			dayMechanics.each { EmployeeSchedule mechanic ->
				mechanic.skills = findMechanicSkills(mechanic, skills)
			}
		}
		return mechanics
	}

	/**
	 * Obtiene las habilidades de un mecánico
	 * @param mechanic Mecánico
	 * @param skillEmployees Lista de habilidades y el nivel de experiencia
	 * @return Lista de habilidades del mecánico
	 */
	static List<SkillEmployee> findMechanicSkills(EmployeeSchedule mechanic, List<SkillEmployee> skillEmployees) {
		List<SkillEmployee> chosenSkills = []
		/* Sólo hay habilidades en los grupos de taller y tienda */
		if (mechanic.jobPositionGroupCode in SKILL_GROUP_CODES) {
			List<SkillEmployee> employeeSkills = skillEmployees.findAll { it.employeeCode == mechanic.code }
			/* Una habilidad puede tener distintos valores en función del mes. En ese caso, se obtiene la del més
			 * superior (más actualizada) */
			chosenSkills = employeeSkills.groupBy { it.skillCode }.collect {
				it.value.max { it.month }
			}
		}
		return chosenSkills
	}

}
