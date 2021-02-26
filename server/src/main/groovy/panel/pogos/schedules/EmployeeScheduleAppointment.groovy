package panel.pogos.schedules

import groovy.transform.CompileStatic
import panel.pogos.appointmentDays.AppointmentType

@CompileStatic
class EmployeeScheduleAppointment {

	Long id
    EmployeeSchedule employeeSchedule
    AppointmentType appointmentType
    Schedule schedule

}
