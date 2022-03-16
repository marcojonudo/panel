package panel.serializers

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.SerializerProvider
import com.fasterxml.jackson.databind.ser.std.StdSerializer
import groovy.transform.CompileStatic
import panel.domains.panel.AppointmentType

@CompileStatic
class AppointmentTypeSerializer extends StdSerializer<AppointmentType> {

	AppointmentTypeSerializer() {
		super((Class) null)
	}

    AppointmentTypeSerializer(Class<AppointmentType> appointmentType) {
		super(appointmentType)
	}

	@Override
	void serialize(AppointmentType appointmentType, JsonGenerator jsonGenerator, SerializerProvider provider) throws IOException, JsonProcessingException {
		jsonGenerator.writeStartObject()
		jsonGenerator.writeStringField("code", appointmentType.code.value)
		jsonGenerator.writeStringField("name", appointmentType.name)
		jsonGenerator.writeBooleanField("workingLine", appointmentType.workingLine)
		jsonGenerator.writeBooleanField("counter", appointmentType.counter)
		jsonGenerator.writeStringField("color", appointmentType.color)
		jsonGenerator.writeEndObject()
	}

}
