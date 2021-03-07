package panel.domains.fviberi

import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class Client implements GormEntity<Client> {

	int code
	String name
	String surnames
	Integer phoneNumber

	static mapping = {
		datasource 'fviberi'
		table 'fvclient'

		code column: 'coclient'
		name column: 'noclient'
		surnames column: 'apellido'
		phoneNumber column: 'nutelefo'

		id name: 'code', generator : 'assigned'
		version false
	}

}
