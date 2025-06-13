package panel.domains

import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class GroupColor implements GormEntity<GroupColor> {

    String code
    int order

    static constraints = {
        code maxSize: 7
    }

    static mapping = {
        version defaultValue: 0
    }

}
