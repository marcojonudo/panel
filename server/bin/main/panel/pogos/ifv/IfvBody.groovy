package panel.pogos.ifv

import com.fasterxml.jackson.annotation.JsonProperty
import groovy.transform.CompileStatic

@CompileStatic
class IfvBody {

	String token

	@JsonProperty("parametro")
	IfvBodyData data

}

class IfvBodyData {}
