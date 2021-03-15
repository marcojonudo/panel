package panel.pogos.eCommerce.getSchedules

import com.fasterxml.jackson.annotation.JsonFormat
import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import panel.domains.panel.AppointmentType
import panel.utils.Constants

import java.time.LocalDate
import java.time.LocalTime

@CompileStatic
class OldEcommerceSchedule {

    @JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
    LocalDate day
    List<OldEcommerceScheduleInterval> intervals
    AppointmentType.Code type

    OldEcommerceSchedule(LocalDate day, EcommerceSchedule ecommerceSchedule) {
        this.day = day
        intervals = ecommerceSchedule.intervals.collect {
            new OldEcommerceScheduleInterval(it.start, it.end)
        }
        type = ecommerceSchedule.type
    }

}

@TupleConstructor
class OldEcommerceScheduleInterval {

    @JsonFormat(pattern = Constants.TimeFormat.HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
    LocalTime from
    @JsonFormat(pattern = Constants.TimeFormat.HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
    LocalTime to

}
