package panel.domains.cubo

import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class SkillExpertise implements GormEntity<SkillExpertise> {

    Level level

    static mapping = {
        datasource 'cubo'

        version defaultValue: 0
    }

    enum Level {

        LOW(1),
        MEDIUM(2),
        HIGH(3)

        final int value

        Level(int value) {
            this.value = value
        }

    }

}
