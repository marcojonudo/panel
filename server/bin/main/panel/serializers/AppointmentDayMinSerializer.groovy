package panel.serializers

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.SerializerProvider
import com.fasterxml.jackson.databind.ser.std.StdSerializer
import groovy.transform.CompileStatic
import panel.domains.AppointmentDay

@CompileStatic
class AppointmentDayMinSerializer extends StdSerializer<AppointmentDay> {

	AppointmentDayMinSerializer() {
		super((Class) null)
	}

    AppointmentDayMinSerializer(Class<AppointmentDay> card) {
		super(card)
	}

	@Override
	void serialize(AppointmentDay appointmentDay, JsonGenerator jsonGenerator, SerializerProvider provider) throws IOException, JsonProcessingException {
		jsonGenerator.writeStartObject()
		jsonGenerator.writeStringField("day", appointmentDay.day.toString())
		jsonGenerator.writeFieldName("values")
		jsonGenerator.writeStartArray()
		jsonGenerator.writeEndArray()
		jsonGenerator.writeEndObject()
	}

}
