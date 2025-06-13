package schedules.domains.skills


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class SkillCode implements GormEntity<SkillCode> {

    String code
    SkillStyle style
    int order

    static mapping = {
        version defaultValue: 0
        style fetch: 'join'
    }

}
