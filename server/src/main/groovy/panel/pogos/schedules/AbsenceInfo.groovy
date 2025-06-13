package panel.pogos.schedules

import com.fasterxml.jackson.annotation.JsonFormat
import panel.utils.Constants

import java.time.LocalDate

class AbsenceInfo {

    Absence absence

    @JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
    LocalDate expectedEndDay

}
