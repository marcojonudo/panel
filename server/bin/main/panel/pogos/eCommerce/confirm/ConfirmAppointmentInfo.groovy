package panel.pogos.eCommerce.confirm

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import io.micronaut.http.HttpStatus
import panel.utils.Constants

@CompileStatic
@TupleConstructor
class ConfirmAppointmentInfo {

    String message = Constants.OPERATION_SUCCESS
    Error error

    enum Error {

        NON_EXISTENT_CARD(HttpStatus.NOT_FOUND),
        ERROR_SAVING_CARD(HttpStatus.INTERNAL_SERVER_ERROR)

        final HttpStatus status

        Error(HttpStatus status) {
            this.status = status
        }

    }

}
