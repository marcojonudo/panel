package panel.pogos.logs

import groovy.transform.CompileStatic

@CompileStatic
class ExceptionLog extends Log {

	String exception
	String exceptionMessage

	ExceptionLog(String message, String exception, String exceptionMessage) {
		super(message)
		this.exception = exception
		this.exceptionMessage = exceptionMessage
	}

}
