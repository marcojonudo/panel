package panel.pogos.eCommerce.getSchedules

import groovy.transform.CompileStatic
import io.micronaut.http.HttpStatus

@CompileStatic
enum GetEcommerceScheduleError {

    NO_APPOINTMENTS(HttpStatus.ACCEPTED),
    NO_SCHEDULES(HttpStatus.NOT_FOUND)

    final HttpStatus status

    GetEcommerceScheduleError(HttpStatus status) {
        this.status = status
    }

}
