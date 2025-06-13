package panel.pogos.schedules.skills

import com.fasterxml.jackson.annotation.JsonInclude
import groovy.transform.CompileStatic

@CompileStatic
class Skill {

    String name
    SkillCode code
    Integer expertisePercentage
    SkillStyle style
    SkillCategory category
    int order

    @JsonInclude
    Set<Skill> children

}
