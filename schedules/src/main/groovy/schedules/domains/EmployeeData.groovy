package schedules.domains

import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import schedules.pogos.JobPositionGroupCode

@Entity
class EmployeeData implements GormEntity<EmployeeData> {

    String code
    String name
    String surname1
    String surname2
    JobPositionGroupCode jobPositionGroupCode

    static mapping = {
        version defaultValue: 0
    }

}
