package panel.pogos.schedules

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import groovy.transform.CompileStatic
import panel.utils.Constants

import java.time.LocalDate

@CompileStatic
class EmployeeSchedule {

	Long id

	@JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd)
	LocalDate day

	Employee employee
	Schedule schedule
	Integer restMinutes
	Integer lines
	ScheduleAbsence absence
	JobPositionGroup jobPositionGroup
	String panelPosition
	String jobLineType
	boolean showInPanel

	@JsonInclude
	List<MechanicAppointment> appointments

}
