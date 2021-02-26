package panel.pogos.eCommerce.save

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import io.micronaut.http.HttpStatus

@CompileStatic
@TupleConstructor
class SaveEcommerceCardInfo {

    EcommerceCard card
    String message
    Error error

    enum Error {

        NOT_AVAILABLE_APPOINTMENT_SCHEDULE(HttpStatus.ACCEPTED),
        NOT_AVAILABLE_SCHEDULE_TIME(HttpStatus.NOT_ACCEPTABLE),
        ALREADY_CREATED_PLANNING(HttpStatus.CONFLICT),
        ERROR_SAVING_PLANNING(HttpStatus.INTERNAL_SERVER_ERROR)

        final HttpStatus status

        Error(HttpStatus status) {
            this.status = status
        }

    }

}