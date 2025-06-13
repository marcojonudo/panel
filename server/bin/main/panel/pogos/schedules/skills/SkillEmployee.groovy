package panel.pogos.schedules.skills


import java.time.LocalDate

class SkillEmployee {

    Skill skill
    String skillCode
    String employeeCode
    SkillExpertise expertise
    LocalDate month

    enum SkillExpertise {

        LOW,
        MEDIUM,
        HIGH,
        TRAINING

    }

}
