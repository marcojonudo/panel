package panel.pogos.ifv

import com.fasterxml.jackson.annotation.JsonProperty
import groovy.transform.CompileStatic

@CompileStatic
class IfvResponse {

	int error

	@JsonProperty("detalle")
	String message

}
