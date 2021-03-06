package panel.domains.fviberi

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.MultiTenant
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.utils.Constants

import java.time.LocalTime

@Entity
class OrderTime implements GormEntity<OrderTime>, Serializable {

	@JsonIgnore
	OrderHeader order
	String shortCode

	@JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
	LocalTime deadline

	static mapping = {
		datasource 'fviberi'
		table 'fvsegtie'

		order column: 'nuordrep'
		shortCode column: 'codcorto'
		deadline formula: 'sec_to_time(hocomcli*60)'

		id composite: ['order', 'shortCode'], generator: 'assigned'

		version false
	}

	@Override
	boolean equals(Object object) {
		OrderTime obj = (OrderTime) object
		return this.order.id == obj.order.id && this.shortCode == obj.shortCode
	}

	@Override
	int hashCode() {
		return Objects.hash(order.id, shortCode)
	}

}
