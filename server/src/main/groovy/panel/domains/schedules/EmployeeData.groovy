package panel.domains.schedules

import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class EmployeeData implements GormEntity<EmployeeData> {

    String code
    String name
    String surname1
    String surname2
    JobPositionGroup.Code jobPositionGroupCode

    static mapping = {
        version defaultValue: 0
    }

}
