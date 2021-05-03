package panel.services

import groovy.transform.CompileStatic
import panel.domains.schedules.EmployeeSchedule
import panel.domains.schedules.JobPositionGroup
import panel.domains.skills.Skill
import panel.domains.skills.SkillEmployee
import panel.services.data.skills.SkillEmployeeDataService

import javax.inject.Inject
import javax.inject.Singleton
import java.time.LocalDate

@Singleton
@CompileStatic
class SkillsService {

    @Inject private SkillEmployeeDataService skillEmployeeDataService

    List<SkillEmployee> findSkillEmployees(
        List<EmployeeSchedule> employeeSchedules, List<Skill> skills, LocalDate month
    ) {
        List<Skill> expertiseSkills = skills.findAll { it.parent }
        List<SkillEmployee> skillEmployees = skillEmployeeDataService.findAll((List<String>) employeeSchedules.code)

        List<SkillEmployee> lastMonthSkillEmployees = []
        /* Se obtienen, en orden, los meses para los que hay que buscar habilidades */
        List<LocalDate> months = [month] + skillEmployees.month.findAll { it < month }.unique().sort().reverse()
        employeeSchedules.groupBy {
            it.jobPositionGroupCode
        }.each { JobPositionGroup.Code jobPositionGroupCode, List<EmployeeSchedule> groupEmployeeSchedules ->
            /* Sólo se gestionan las habilidades si el grupo de trabajo es taller o tienda, ya que para el resto no hay
             * ninguna definida. Si en un futuro se decide tener más matrices, habría que modificar este if */
            if (jobPositionGroupCode == JobPositionGroup.Code.GARAGE ||
                    jobPositionGroupCode == JobPositionGroup.Code.SHOP) {
                List<Skill> jobPositionGroupSkills = expertiseSkills.findAll {
                    it.category.jobPositionGroupCode == jobPositionGroupCode
                }

                groupEmployeeSchedules.each { EmployeeSchedule employeeSchedule ->
                    List<SkillEmployee> codeSkillEmployees = skillEmployees.findAll {
                        it.employeeCode == employeeSchedule.code
                    }
                    if (codeSkillEmployees) {
                        lastMonthSkillEmployees += jobPositionGroupSkills.collect { Skill skill ->
                            codeSkillEmployees.find { SkillEmployee skillEmployee ->
                                skillEmployee.skill.id == skill.id && months.find { it == skillEmployee.month }
                            }
                        }
                    } else {
                        jobPositionGroupSkills.each {
//                            lastMonthSkillEmployees << skillEmployeeDataService.save(
//                                it, employeeSchedule.code, SkillEmployee.SkillExpertise.LOW, month
//                            )
                        }
                    }
                }
            }
        }
        return lastMonthSkillEmployees
    }

}
