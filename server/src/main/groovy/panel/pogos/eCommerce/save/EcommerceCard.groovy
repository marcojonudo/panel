package panel.pogos.eCommerce.save

import com.fasterxml.jackson.annotation.JsonFormat
import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import panel.utils.Constants

import java.time.LocalDate
import java.time.LocalTime

@CompileStatic
@TupleConstructor
class EcommerceCard {

    @JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
    LocalDate day

    @JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
    LocalTime start

    @JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
    LocalTime end

    String code

    String state

}