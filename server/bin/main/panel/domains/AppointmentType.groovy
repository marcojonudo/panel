package panel.domains


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class AppointmentType implements GormEntity<AppointmentType> {

    Code code
    String name
    boolean workingLine
    boolean counter
    String color

    static constraints = {
        code maxSize: 10
        name maxSize: 255
        color nullable: true, maxSize: 7
    }

    enum Code {

        RAP('RAP'),
        INT('INT'),
        TP('TP'),
        ECO('ECO'),
        CRF('CRF'),
        RAP_CRF('RAP+CRF')

        final String value

        Code(String value) {
            this.value = value
        }

    }

}
