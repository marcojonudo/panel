package panel.domains.skills


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.domains.schedules.JobPositionGroup
import panel.utils.Constants

@Entity
class SkillCategory implements GormEntity<SkillCategory> {

    String code
    String name
    JobPositionGroup.Code jobPositionGroupCode

    static mapping = {
        datasource Constants.DataSource.SCHEDULES

        version defaultValue: 0
    }

}
