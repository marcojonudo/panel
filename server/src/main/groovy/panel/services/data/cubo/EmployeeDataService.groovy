package panel.services.data.cubo


import grails.gorm.services.Service
import panel.domains.cubo.Employee

@Service(Employee)
interface EmployeeDataService {

	Employee find(String code)

	List<Employee> findAll(boolean active)

}
