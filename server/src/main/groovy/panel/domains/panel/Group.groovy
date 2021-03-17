package panel.domains.panel

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.serializers.GroupSerializer

@JsonSerialize(using = GroupSerializer)
@Entity
class Group implements GormEntity<Group> {

//    long id
    int code
    String name
    String shortName
    boolean unitsInShortName
    GroupColor color
    AppointmentType appointmentType

    static hasMany = [cards: Card, tasks: Task]

    static constraints = {
        name maxSize: 255
        shortName maxSize: 15, nullable: true
    }

    static mapping = {
        table "`group`"
        version defaultValue: 0
        color fetch: 'join'
        appointmentType fetch: 'join'
        tasks fetch: 'join'
    }

}
