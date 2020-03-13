package panel.pogos.eCommerce.getSchedules

import com.fasterxml.jackson.annotation.JsonFormat
import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import panel.utils.Constants

import java.time.LocalDate

@CompileStatic
@TupleConstructor
class DayEcommerceSchedule {

    @JsonFormat(
            shape = JsonFormat.Shape.STRING,
            pattern = Constants.DateFormat.yyyy_MM_dd,
            timezone = Constants.SPAIN_TIMEZONE
    )
    LocalDate day
    List<EcommerceSchedule> schedules

}
