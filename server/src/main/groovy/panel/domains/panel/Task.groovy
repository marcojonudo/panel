package panel.domains.panel

import com.fasterxml.jackson.annotation.JsonIdentityInfo
import com.fasterxml.jackson.annotation.ObjectIdGenerators
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator, property = "articleCode")
@Entity
class Task implements GormEntity<Task> {

    long id
    int articleCode
    String name
    boolean absorbable
    boolean enabled

    static hasMany = [groups: Group]
    static belongsTo = Group

    static constraints = {
        name maxSize: 255
    }

    static mapping = {
        version defaultValue: 0
        absorbable defaultValue: false
        enabled defaultValue: true

        groups fetch: 'join'
    }

}
