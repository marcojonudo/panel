package panel.serializers

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.SerializerProvider
import com.fasterxml.jackson.databind.ser.std.StdSerializer
import groovy.transform.CompileStatic
import panel.domains.cubo.MechanicAppointment

@CompileStatic
class MechanicAppointmentSerializer extends StdSerializer<MechanicAppointment> {

    MechanicAppointmentSerializer() {
		super((Class) null)
	}

    MechanicAppointmentSerializer(Class<MechanicAppointment> mechanicAppointment) {
		super(mechanicAppointment)
	}

	@Override
	void serialize(MechanicAppointment mechanicAppointment, JsonGenerator jsonGenerator, SerializerProvider provider) throws IOException, JsonProcessingException {
		jsonGenerator.writeStartObject()
		jsonGenerator.writeStringField("appointmentTypeCode", mechanicAppointment.appointmentTypeCode)
		jsonGenerator.writeObjectField("schedule", mechanicAppointment.schedule)
		jsonGenerator.writeObjectFieldStart("mechanic")
		jsonGenerator.writeStringField("day", mechanicAppointment.mechanic.day.toString())
		jsonGenerator.writeNumberField("lines", mechanicAppointment.mechanic.lines)
		jsonGenerator.writeObjectFieldStart("employee")
		jsonGenerator.writeObjectField("code", mechanicAppointment.mechanic.employee.code)
		jsonGenerator.writeEndObject()
		jsonGenerator.writeEndObject()
		jsonGenerator.writeEndObject()
	}

}
