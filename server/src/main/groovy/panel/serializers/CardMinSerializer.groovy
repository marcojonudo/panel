package panel.serializers

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.SerializerProvider
import com.fasterxml.jackson.databind.ser.std.StdSerializer
import groovy.transform.CompileStatic
import panel.pogos.cards.CardPogo

@CompileStatic
class CardMinSerializer extends StdSerializer<CardPogo> {

	CardMinSerializer() {
		super((Class) null)
	}

    CardMinSerializer(Class<CardPogo> card) {
		super(card)
	}

	@Override
	void serialize(CardPogo card, JsonGenerator jsonGenerator, SerializerProvider provider) throws IOException, JsonProcessingException {
		jsonGenerator.writeStartObject()
		jsonGenerator.writeObjectFieldStart("order")
		jsonGenerator.writeObjectField("number", card.order.number)
		jsonGenerator.writeObjectField("code", card.order.code)
		jsonGenerator.writeEndObject()
		jsonGenerator.writeObjectFieldStart("group")
		jsonGenerator.writeObjectField("code", card.group.code)
		jsonGenerator.writeEndObject()
		jsonGenerator.writeNumberField("divisionIndex", card.divisionIndex)
		jsonGenerator.writeNumberField("linkedIndex", card.linkedIndex)
		jsonGenerator.writeStringField("mechanicCode", card.mechanicCode)
		jsonGenerator.writeNumberField("duration", card.duration)
		if (card.day) {
			jsonGenerator.writeStringField("day", card.day.toString())
		}
		if (card.start) {
			jsonGenerator.writeStringField("start", card.start.toString())
		}
		jsonGenerator.writeEndObject()
	}

}
