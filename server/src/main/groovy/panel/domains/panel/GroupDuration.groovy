package panel.domains.panel

import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class GroupDuration implements GormEntity<GroupDuration> {

    Group group
    Task task
    int units
    int duration

    static constraints = {
        task nullable: true
    }

    static mapping = {
        version defaultValue: 0
        group fetch: 'join'
        task fetch: 'join'
    }

}
