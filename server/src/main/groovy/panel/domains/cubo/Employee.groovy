package panel.domains.cubo


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class Employee implements GormEntity<Employee> {

	String code
	String name
	String surname1
	String surname2
	String nopasswd
	Gender gender
	boolean active

	static hasMany = [employeeSkills: EmployeeSkills]

    static constraints = {
		gender nullable: true
    }

	static mapping = {
		datasource 'cubo'

		surname1 column: 'noap1'
		surname2 column: 'noap2'
		gender column: 'sex'

		employeeSkills fetch: 'join'

		id name: 'code', generator: 'assigned'
		version false
	}

	enum Gender {

		NN,
		ML,
		FM

	}

}
