package panel.pogos.logs

import groovy.transform.CompileStatic

@CompileStatic
class Log {

	Map info

	Log(String message) {
		this.info = [message: message]
	}

	Log(Map info) {
		this.info = info
	}

	@Override
	String toString() {
		return Jackson.writeValueAsString(info)
	}

}
