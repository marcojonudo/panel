package panel.deserializers

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.deser.std.StdDeserializer
import com.fasterxml.jackson.databind.node.ObjectNode
import groovy.transform.CompileStatic
import panel.pogos.ifv.getEmployees.GetEmployeesResponse
import panel.pogos.ifv.getEmployees.IfvEmployee

@CompileStatic
class GetEmployeesResponseDeserializer extends StdDeserializer<GetEmployeesResponse> {

	GetEmployeesResponseDeserializer() {
		this(null)
	}

    GetEmployeesResponseDeserializer(Class<GetEmployeesResponse> loginResponse) {
		super(loginResponse)
	}

	@Override
	GetEmployeesResponse deserialize(JsonParser parser, DeserializationContext deserializationContext)
			throws IOException, JsonProcessingException {
		JsonNode node = (JsonNode) parser.getCodec().readTree(parser)
		int error = node.get("error").asInt()
		String message = node.get("detalle").asText()
		List<IfvEmployee> data = (node.get("datos").asList() as List<ObjectNode>).collect {
			new IfvEmployee(
				it.get("EMPcoemplea").asText(),
				it.get("EMPnoemplea").asText(),
				it.get("EMPnoap1emp").asText(),
				it.get("EMPnoap2emp").asText(),
				it.get("PUEcopuesto").asInt()
			)
		}
		return new GetEmployeesResponse(error, message, data)
	}

}
