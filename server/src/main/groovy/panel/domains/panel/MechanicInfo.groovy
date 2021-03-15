package panel.domains.panel

import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class MechanicInfo implements GormEntity<MechanicInfo> {

    long mechanicId
    String position
    int lines
    String jobLineType
    boolean show

    static mapping = {
        version defaultValue: false
    }

}
