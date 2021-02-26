package panel.pogos.schedules

import groovy.transform.CompileStatic
import panel.pogos.skills.EmployeeSkills

@CompileStatic
class Employee {

	String code
	String name
	String surname1
	String surname2
	boolean active
	List<EmployeeSkills> employeeSkills

	List<String> getSurnames() {
		return [surname1, surname2].findAll { it }
	}

}
