package panel.domains.schedules

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonInclude
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.domains.panel.MechanicAppointment
import panel.domains.panel.MechanicPanelInfo
import panel.utils.Constants

import java.time.LocalDate
import java.time.LocalDateTime

@Entity
class EmployeeSchedule implements GormEntity<EmployeeSchedule> {

	EmployeeData employeeData

	@JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
	LocalDate day
	String code
	boolean workingDay
	AbsenceInfo absenceInfo
	int restMinutes
    JobPositionGroup.Code jobPositionGroupCode
	boolean savedIfv

	MechanicPanelInfo mechanicPanelInfo

	@JsonInclude
	List<MechanicAppointment> appointments

	@JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
	LocalDateTime dateCreated
	String userCreated

	@JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
	LocalDateTime lastUpdated
	String userUpdated

	@JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
	LocalDateTime dateDeleted

	@JsonInclude
	Set<ScheduleInterval> intervals

	static hasOne = [absenceInfo: AbsenceInfo]

	static hasMany = [intervals: ScheduleInterval]

	static constraints = {
		day nullable: true
		restMinutes nullable: true
		absenceInfo nullable: true
		userUpdated nullable: true, maxSize: 45
		dateDeleted nullable: true
	}

	static mapping = {
		datasource Constants.DataSource.SCHEDULES

		version defaultValue: 0
		employeeData lazy: false
		absenceInfo fetch: 'join'
		intervals fetch: 'join', joinTable: [name: 'employee_schedule_intervals']
	}

	static transients = ['mechanicPanelInfo', 'appointments']

}
