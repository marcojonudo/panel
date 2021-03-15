package panel.pogos.ifv.getEmployees

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer
import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import panel.pogos.ifv.IfvBody
import panel.pogos.ifv.IfvBodyData
import panel.utils.Constants

import java.time.LocalDate

@CompileStatic
class GetEmployeesBody extends IfvBody {

    GetEmployeesBody(LocalDate from, LocalDate to, int centre) {
        data = new GetEmployeesBodyData(from, to, centre)
    }

}

@TupleConstructor
class GetEmployeesBodyData extends IfvBodyData {

    @JsonProperty("FechaDesde")
    @JsonSerialize(using = LocalDateSerializer)
    @JsonFormat(pattern = Constants.DateFormat.dd_MM_yyyy_SLASH, timezone = Constants.SPAIN_TIMEZONE)
    LocalDate from

    @JsonProperty("FechaHasta")
    @JsonSerialize(using = LocalDateSerializer)
    @JsonFormat(pattern = Constants.DateFormat.dd_MM_yyyy_SLASH, timezone = Constants.SPAIN_TIMEZONE)
    LocalDate to

    @JsonProperty("CodigosCentros")
    List<String> centres

    GetEmployeesBodyData(LocalDate from, LocalDate to, int centre) {
        this.from = from
        this.to = to
        centres = [String.format("%03d", centre)]
    }

}
