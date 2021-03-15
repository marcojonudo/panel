package panel.pogos.logs

import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.CompileStatic

@CompileStatic
class Jackson {

	static ObjectMapper mapper

	static ObjectMapper getMapper() {
		mapper = mapper ?: new ObjectMapper()
		return mapper
	}

	static Map convertValue(Object object) {
		return getMapper().convertValue(object, Map)
	}

}
