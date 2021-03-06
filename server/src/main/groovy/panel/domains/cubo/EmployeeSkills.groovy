package panel.domains.cubo

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

import java.sql.Date

@Entity
class EmployeeSkills implements GormEntity<EmployeeSkills>, Serializable {

	@JsonIgnore
    Employee employee
    Skill skill
    SkillExpertise skillExpertise
    Date month

    static constraints = {
        month nullable: true
    }

    static mapping = {
        datasource 'cubo'

        id composite: ['employee', 'skill', 'month']
        skill fetch: 'join'
        skillExpertise lazy: false
        version false
    }

	@Override
	boolean equals(Object object) {
		EmployeeSkills obj = (EmployeeSkills) object
		return this.employee.code == obj.employee.code &&
				this.skill.id == obj.skill.id &&
				this.month == obj.month
	}

	@Override
	int hashCode() {
		return Objects.hash(employee.code, skill.id, month)
	}

}
