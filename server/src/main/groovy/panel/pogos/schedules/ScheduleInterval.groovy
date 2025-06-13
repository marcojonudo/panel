package panel.pogos.schedules

import com.fasterxml.jackson.annotation.JsonFormat
import panel.utils.Constants

import java.time.LocalTime

class ScheduleInterval {

    @JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
    LocalTime start

    @JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
    LocalTime end

}
