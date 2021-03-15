package panel.domains.schedules

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.utils.Constants

@Entity
class JobPositionGroup implements GormEntity<JobPositionGroup> {

	Code code
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
		datasource Constants.DataSource.SCHEDULES
	}

	static hasMany = [jobPositions: JobPosition]

	enum Code {

		GARAGE, SHOP, CASH, MANAGER

	}

}
