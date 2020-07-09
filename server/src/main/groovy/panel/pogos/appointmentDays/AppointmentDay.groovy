package panel.pogos.appointmentDays

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.CompileStatic
import panel.utils.Constants

import java.time.LocalDate

@CompileStatic
class AppointmentDay {

    @JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
    LocalDate day
    List<AppointmentTypeValues> values

    AppointmentDay(LocalDate day, List<AppointmentType> types) {
        this.day = day
        values = types.collect {
            new AppointmentTypeValues(appointmentDay: this, appointmentType: it)
        }
    }

    @JsonCreator
    AppointmentDay(Map<String, Object> appointmentDay) {
        day = LocalDate.parse((String) appointmentDay.day)
        ObjectMapper mapper = new ObjectMapper()
        values = ((List<Map<String, Object>>) appointmentDay.values).collect {
            new AppointmentTypeValues(
                appointmentDay: mapper.convertValue(it.appointmentDay, AppointmentDay),
                appointmentType: mapper.convertValue(it.appointmentType, AppointmentType),
                morning: (int) it.morning,
                afternoon: (int) it.afternoon,
                total: (int) it.total,
                max: (int) it.max
            )
        }
    }

}
