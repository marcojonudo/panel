package panel.domains.skills

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonInclude
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class Skill implements GormEntity<Skill> {

    @JsonIgnore
    Skill parent

    String name
    SkillCode code
    Integer expertisePercentage
    SkillStyle style
    SkillCategory category
    int order

    @JsonInclude
    Set<Skill> children

    static hasMany = [children: Skill]

    static constraints = {
        code nullable: true
        expertisePercentage nullable: true
    }

    static mapping = {
        version defaultValue: 0
        code lazy: false
        style fetch: 'join'
        category fetch: 'join'
        children fetch: 'join'
    }

}
