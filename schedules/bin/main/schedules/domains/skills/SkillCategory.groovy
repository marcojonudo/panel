package schedules.domains.skills

import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import schedules.pogos.JobPositionGroupCode

@Entity
class SkillCategory implements GormEntity<SkillCategory> {

    String code
    String name
    JobPositionGroupCode jobPositionGroupCode

    static mapping = {
        version defaultValue: 0
    }

}
