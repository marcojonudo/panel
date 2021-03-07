package panel.serializers

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.SerializerProvider
import com.fasterxml.jackson.databind.ser.std.StdSerializer
import groovy.transform.CompileStatic
import panel.domains.panel.Group

@CompileStatic
class GroupSerializer extends StdSerializer<Group> {

	GroupSerializer() {
		super((Class) null)
	}

    GroupSerializer(Class<Group> group) {
		super(group)
	}

	@Override
	void serialize(Group group, JsonGenerator jsonGenerator, SerializerProvider provider) throws IOException, JsonProcessingException {
		jsonGenerator.writeStartObject()
		jsonGenerator.writeNumberField("id", group.id)
		jsonGenerator.writeNumberField("code", group.code)
		jsonGenerator.writeStringField("name", group.name)
		jsonGenerator.writeStringField("shortName", group.shortName)
		jsonGenerator.writeBooleanField("unitsInShortName", group.unitsInShortName)
		jsonGenerator.writeObjectField("color", group.color)
		jsonGenerator.writeObjectField("appointmentType", group.appointmentType)

		jsonGenerator.writeArrayFieldStart("tasks")
		group.tasks.each {
			jsonGenerator.writeStartObject()
			jsonGenerator.writeNumberField("id", it.id)
			jsonGenerator.writeNumberField("articleCode", it.articleCode)
			jsonGenerator.writeEndObject()
		}
		jsonGenerator.writeEndArray()

		jsonGenerator.writeEndObject()
	}

}
