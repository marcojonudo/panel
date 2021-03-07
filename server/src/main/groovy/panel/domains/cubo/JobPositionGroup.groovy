package panel.domains.cubo

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class JobPositionGroup implements GormEntity<JobPositionGroup> {

	JobPositionGroupCode code
	String name
	String color
	@JsonIgnore
	Set<JobPosition> jobPositions

	static constraints = {
		code maxSize: 15
		name maxSize: 45
		color maxSize: 10
	}

	static mapping = {
		datasource 'cubo'
	}

	static hasMany = [jobPositions: JobPosition]

	enum JobPositionGroupCode {

		GARAGE, SHOP, CASH, MANAGER

	}

}
