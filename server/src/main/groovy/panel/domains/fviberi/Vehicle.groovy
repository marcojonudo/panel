package panel.domains.fviberi

import com.fasterxml.jackson.annotation.JsonInclude
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.utils.Constants

@Entity
class Vehicle implements GormEntity<Vehicle> {

	@JsonInclude
	String numberPlate
	@JsonInclude
	String model
	@JsonInclude
	String cylinder
	@JsonInclude
	String color
	@JsonInclude
	String brand
	@JsonInclude
	String fuel

	static mapping = {
		datasource Constants.DataSource.FVIBERI
		table 'fvvehicu'

		numberPlate column: 'numatric'
		model column: 'nomodelo'
		cylinder column: 'nucilind'
		color column: 'nocolorv'
		brand column: 'nomarcav'
		fuel column: 'clgasdie'

		id name: 'numberPlate', generator: 'assigned'
		version false
	}

}
