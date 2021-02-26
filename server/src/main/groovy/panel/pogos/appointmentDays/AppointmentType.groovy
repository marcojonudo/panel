package panel.pogos.appointmentDays

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import groovy.transform.CompileStatic
import panel.serializers.AppointmentTypeSerializer

@CompileStatic
@JsonSerialize(using = AppointmentTypeSerializer)
class AppointmentType {

    Long id
    AppointmentTypeCode code
    String name
    boolean workingLine
    boolean counter
    String color

    enum AppointmentTypeCode {

        RAP('RAP'),
        INT('INT'),
        TP('TP'),
        ECO('ECO'),
        CRF('CRF'),
        RAP_CRF('RAP+CRF')

        final String value

        AppointmentTypeCode(String value) {
            this.value = value
        }

    }

}
