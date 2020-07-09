package panel.pogos.schedules

import com.fasterxml.jackson.annotation.JsonFormat
import panel.utils.Constants

import java.time.LocalTime

class Schedule {

	long id

	@JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
	LocalTime morningStart

	@JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
	LocalTime morningEnd

	@JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
	LocalTime afternoonStart

	@JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
	LocalTime afternoonEnd
	ScheduleType type
	Float hours

	enum ScheduleType {

		MORNING({ Schedule scheduleDay -> scheduleDay.morningStart && !scheduleDay.afternoonStart }),
		AFTERNOON({ Schedule scheduleDay -> !scheduleDay.morningStart && scheduleDay.afternoonStart }),
		FULL_TIME({ Schedule scheduleDay -> scheduleDay.morningStart && scheduleDay.afternoonStart }),
		ABSENCE({ Schedule scheduleDay -> !scheduleDay.morningStart && !scheduleDay.afternoonStart }),

		final Closure criteria

		ScheduleType(Closure criteria) {
			this.criteria = criteria
		}

	}

//	float getHours() {
//		use(TimeCategory) {
//			Duration hoursDuration = (morningEnd - morningStart) + (afternoonEnd - afternoonStart)
//			return hoursDuration.hours + hoursDuration.minutes/60
//		}
//	}

}
