package panel.domains.skills


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

import java.time.LocalDate

@Entity
class SkillEmployee implements GormEntity<SkillEmployee> {

    Skill skill
    String employeeCode
    SkillExpertise expertise
    LocalDate month

    static mapping = {
        version defaultValue: 0
        skill fetch: 'join'
    }

    enum SkillExpertise {

        LOW,
        MEDIUM,
        HIGH,
        TRAINING

    }

}
