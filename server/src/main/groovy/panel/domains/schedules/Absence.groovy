package panel.domains.schedules


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class Absence implements GormEntity<Absence> {

    Code code
    String description

    static constraints = {
        code maxSize: 45
        description maxSize: 255
    }

    static mapping = {
        version defaultValue: 0
    }

    enum Code {

        VAC,
        CMF,
        FOR,
        ENF,
        CEJ,
        PRV,
        MED,
        HSC,
        LRC,
        ACC,
        ANJ,
        PAT,
        PRD,
        ADO,
        CAS,
        MUD,
        HEN,
        MAT,
        LAC,
        SES,
        RIS,
        HUT,
        EEX,
        AMP,
        PSS,
        ERT

    }

}
