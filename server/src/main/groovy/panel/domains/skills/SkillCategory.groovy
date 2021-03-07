package panel.domains.skills


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.domains.schedules.JobPositionGroup

@Entity
class SkillCategory implements GormEntity<SkillCategory> {

    String code
    String name
    JobPositionGroup jobPositionGroup

    static mapping = {
        version defaultValue: 0
        jobPositionGroup lazy: false
    }

}
