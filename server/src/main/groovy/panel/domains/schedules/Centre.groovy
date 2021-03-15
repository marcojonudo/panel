package panel.domains.schedules


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.utils.Constants

@Entity
class Centre implements GormEntity<Centre> {

    int code
    ScheduleInterval interval

    static mapping = {
        datasource Constants.DataSource.SCHEDULES

        version defaultValue: 0
        interval fetch: 'join'
    }

}
