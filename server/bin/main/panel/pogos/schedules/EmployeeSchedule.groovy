package panel.pogos.schedules

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import panel.domains.MechanicAppointment
import panel.domains.MechanicPanelInfo
import panel.pogos.schedules.skills.SkillEmployee
import panel.utils.Constants

import java.time.LocalDate

class EmployeeSchedule {

	Long id
	EmployeeData employeeData

	@JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
	LocalDate day
	String code
	boolean workingDay
	int restMinutes
    JobPositionGroup.Code jobPositionGroupCode
	boolean savedIfv

	@JsonInclude
	List<ScheduleInterval> intervals

	@JsonInclude
	List<SkillEmployee> skills

	AbsenceInfo absenceInfo
	MechanicPanelInfo panelInfo

	@JsonInclude
	List<MechanicAppointment> appointments

}
