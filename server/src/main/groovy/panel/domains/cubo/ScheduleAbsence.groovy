package panel.domains.cubo

import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class ScheduleAbsence implements GormEntity<ScheduleAbsence> {

    String code
    String description
    Date created
    Date updated
    boolean deleted

    static constraints = {
        code maxSize: 45
        description maxSize: 255
        updated nullable: true
    }

    static mapping = {
        datasource 'cubo'

        version defaultValue: 0
    }

}
