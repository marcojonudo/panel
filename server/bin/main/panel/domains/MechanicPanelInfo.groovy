package panel.domains

import grails.gorm.annotation.Entity
import groovy.transform.TupleConstructor
import org.grails.datastore.gorm.GormEntity

@Entity
@TupleConstructor
class MechanicPanelInfo implements GormEntity<MechanicPanelInfo> {

    long mechanicId
    String position
    int lines = 2
    String jobLineType
    boolean show = true

    static constraints = {
        jobLineType nullable: true
    }

    static mapping = {
        version defaultValue: false
        lines column: '`lines`'
        show column: '`show`'
    }

}
