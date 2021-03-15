package panel.domains.fviberi

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.utils.Constants

@Entity
class OrderLine implements GormEntity<OrderLine>, Serializable {

	@JsonIgnore
	OrderHeader order
	int line
	float units
	String boxNumber
	Article article

	static mapping = {
		datasource Constants.DataSource.FVIBERI
		table 'fvlinord'

		order column: 'nuordrep'
		line column: 'nulinord'
		units column: 'caordrep'
		boxNumber column: 'numerbox'
		article column: 'coarticu', fetch: 'join'

		id composite: ['order', 'line'], generator: 'assigned'
		version false
	}

	@Override
	boolean equals(Object object) {
		OrderLine obj = (OrderLine) object
		return this.order.id == obj.order.id && this.line == obj.line
	}

	@Override
	int hashCode() {
		return Objects.hash(order.id, line)
	}

}
