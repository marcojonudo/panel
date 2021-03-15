package panel.domains.schedules


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.utils.Constants

@Entity
class JobPosition implements GormEntity<JobPosition> {

	int code
	String name
	JobPositionGroup jobPositionGroup
	Authority roleAuthority

	static mapping = {
		datasource Constants.DataSource.SCHEDULES

		jobPositionGroup lazy: false
		version defaultValue: 0
	}

	enum Authority {

		ROLE_ADMIN,
		ROLE_HIGH_AUTHORITY,
		ROLE_MEDIUM_AUTHORITY,
		ROLE_LOW_AUTHORITY,
		ROLE_DEFAULT

	}

}
