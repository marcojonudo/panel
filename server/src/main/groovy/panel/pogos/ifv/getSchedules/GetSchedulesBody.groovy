package panel.pogos.ifv.getSchedules

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonProperty
import groovy.transform.CompileStatic
import panel.pogos.ifv.IfvBody
import panel.pogos.ifv.IfvBodyData
import panel.utils.Constants

import jakarta.inject.Singleton
import java.time.LocalDate

@Singleton
@CompileStatic
class GetSchedulesBody extends IfvBody {

    GetSchedulesBody(int centre, LocalDate from, LocalDate to) {
        data = new GetSchedulesBodyData(centre, from, to)
    }

    class GetSchedulesBodyData extends IfvBodyData {

        @JsonProperty("FechaDesde")
        @JsonFormat(pattern = Constants.DateFormat.dd_MM_yyyy_SLASH, timezone = Constants.SPAIN_TIMEZONE)
        LocalDate from

        @JsonProperty("FechaHasta")
        @JsonFormat(pattern = Constants.DateFormat.dd_MM_yyyy_SLASH, timezone = Constants.SPAIN_TIMEZONE)
        LocalDate to

        @JsonProperty("IdCentros")
        List<String> centres

        GetSchedulesBodyData(int centre, LocalDate from, LocalDate to) {
            this.from = from
            this.to = to
            this.centres = [String.format("%03d", centre)]
        }

    }

}
