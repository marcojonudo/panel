package panel.pogos.eCommerce.getSchedules

import groovy.transform.CompileStatic

@CompileStatic
class GetEcommerceSchedulesInfo {

    GetEcommerceScheduleError error
    List<List<OldEcommerceSchedule>> schedules
//    List<DayEcommerceSchedule> schedules

    GetEcommerceSchedulesInfo(
        List<List<OldEcommerceSchedule>> schedules,
        GetEcommerceScheduleError error = null
    ) {
        this.schedules = schedules
        this.error = error
    }

}
