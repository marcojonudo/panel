package panel.domains.cubo

import com.fasterxml.jackson.annotation.JsonIgnore
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class Skill implements GormEntity<Skill>, Comparable {

    String name
    Integer expertsPercentage
    @JsonIgnore
    Skill parent
    SortedSet children
    @JsonIgnore
    JobPositionGroup jobPositionGroup

    static hasMany = [children: Skill]

    static constraints = {
        name maxSize: 45
        expertsPercentage nullable: true
        parent nullable: true
    }

    static mapping = {
        datasource 'cubo'

        children fetch: 'join'
        version defaultValue: 0
    }

    int compareTo(skill) {
        id <=> skill.id
    }

}
