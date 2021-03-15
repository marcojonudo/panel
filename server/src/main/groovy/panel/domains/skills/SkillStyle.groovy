package panel.domains.skills


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.utils.Constants

@Entity
class SkillStyle implements GormEntity<SkillStyle> {

    String color
    String backgroundColor

    static mapping = {
        datasource Constants.DataSource.SCHEDULES

        version defaultValue: 0
    }

}
