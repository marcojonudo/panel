package panel.pogos.realTime.objects

import com.fasterxml.jackson.annotation.JsonFormat
import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import panel.domains.panel.MechanicAppointment
import panel.utils.Constants

import java.time.LocalDate
import java.time.LocalTime

@TupleConstructor
@CompileStatic
class RealTimeMechanicAppointment implements RealTimeObject {

    @JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
    LocalDate day
    String mechanicCode
    MechanicAppointment mechanicAppointment
    String appointmentTypeCode

    @JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
    LocalTime lastStart

    @JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
    LocalTime lastEnd

}
