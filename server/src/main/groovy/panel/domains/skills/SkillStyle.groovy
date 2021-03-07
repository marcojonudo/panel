package panel.domains.skills


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class SkillStyle implements GormEntity<SkillStyle> {

    String color
    String backgroundColor

    static mapping = {
        version defaultValue: 0
    }

}
