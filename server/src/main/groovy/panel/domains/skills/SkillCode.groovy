package panel.domains.skills


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.utils.Constants

@Entity
class SkillCode implements GormEntity<SkillCode> {

    String code
    SkillStyle style
    int order

    static mapping = {
        datasource Constants.DataSource.SCHEDULES

        version defaultValue: 0
        style fetch: 'join'
    }

}
