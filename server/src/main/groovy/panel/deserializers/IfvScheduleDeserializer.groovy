package panel.deserializers

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.deser.std.StdDeserializer
import groovy.transform.CompileStatic
import panel.pogos.ifv.getSchedules.GetSchedulesResponseData
import panel.utils.Constants

import java.time.LocalDate
import java.time.LocalTime
import java.time.format.DateTimeFormatter

@CompileStatic
class IfvScheduleDeserializer extends StdDeserializer<GetSchedulesResponseData> {

	IfvScheduleDeserializer() {
		this(null)
	}

    IfvScheduleDeserializer(Class<GetSchedulesResponseData> ifvSchedule) {
		super(ifvSchedule)
	}

	@Override
	GetSchedulesResponseData deserialize(JsonParser parser, DeserializationContext deserializationContext)
			throws IOException, JsonProcessingException {
		JsonNode node = (JsonNode) parser.getCodec().readTree(parser)
		String day = node.get("fecha").asText()
		String start = node.get("horaApertura").asText()
		String end = node.get("horaCierre").asText()

		return new GetSchedulesResponseData(
			LocalDate.parse(day, DateTimeFormatter.ofPattern(Constants.DateFormat.dd_MM_yyyy)),
			LocalTime.parse(start),
			LocalTime.parse(end)
		)
	}

}
