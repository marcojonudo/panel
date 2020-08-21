package panel.pogos.logs

import groovy.json.JsonOutput
import groovy.transform.CompileStatic

@CompileStatic
class Log {

	String message

	Log(String message) {
		this.message = message
	}

	@Override
	String toString() {
		return JsonOutput.toJson(this)
	}

}
