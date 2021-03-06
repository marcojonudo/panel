package panel.domains.panel

import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class JobLineType implements GormEntity<JobLineType> {

    String name
    String code
    String color

    static constraints = {
        name maxSize: 30
        code maxSize: 5
        color maxSize: 7
    }

    static mapping = {
        version defaultValue: 0
    }

}
