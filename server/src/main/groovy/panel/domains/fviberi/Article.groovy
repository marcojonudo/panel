package panel.domains.fviberi

import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.utils.Constants

@Entity
class Article implements GormEntity<Article> {

	Integer code
	String name
	String labour
	Long ean

//	static hasOne = [order: OrderHeader]

	static constraints = {
		ean nullable: true
	}

	static mapping = {
		datasource Constants.DataSource.FVIBERI
		table 'fvarticu'

		code column: 'coarticu'
		name column: 'noarticu'
		labour column: 'inmanobr'
		ean column: 'codean13'

		id name: 'code', generator: 'assigned'
		version false
	}

}
