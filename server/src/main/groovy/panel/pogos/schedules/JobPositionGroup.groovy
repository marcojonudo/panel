package panel.pogos.schedules

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.utils.Constants

class JobPositionGroup {

	Code code
	String name
	String color
	Set<JobPosition> jobPositions


	enum Code {

		GARAGE, SHOP, CASH, MANAGER

	}

}
