package panel.domains.cubo


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class JobPosition implements GormEntity<JobPosition> {

	String code
	String name

	static hasOne = [jobPositionGroup: JobPositionGroup]

	static constraints = {
		jobPositionGroup nullable: true
	}

	static mapping = {
		datasource 'cubo'

		id name: 'code', generator: 'assigned'
		version false
	}

}
