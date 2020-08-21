package panel.pogos.eCommerce.save

import groovy.transform.CompileStatic
import panel.pogos.appointmentDays.AppointmentType

import java.time.LocalDate
import java.time.LocalTime

@CompileStatic
class SaveEcommerceCardJson {

    LocalDate day
    LocalTime start
    Integer duration
    Integer groupCode
    AppointmentType.AppointmentTypeCode type

}
