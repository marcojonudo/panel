package panel.pogos.ifv.getSchedules

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import groovy.transform.CompileStatic
import panel.deserializers.IfvScheduleDeserializer

import java.time.LocalDate
import java.time.LocalTime

@CompileStatic
class GetSchedulesResponse {

    int error

    @JsonProperty("detalle")
    String message

    @JsonProperty("datos")
    List<GetSchedulesResponseData> data

}

@JsonDeserialize(using = IfvScheduleDeserializer)
class GetSchedulesResponseData {

    LocalDate day
    LocalTime start
    LocalTime end

    GetSchedulesResponseData(LocalDate day, LocalTime start, LocalTime end) {
        this.day = day
        this.start = start
        this.end = end
    }

}
