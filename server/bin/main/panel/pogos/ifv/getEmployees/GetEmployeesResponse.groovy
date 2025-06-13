package panel.pogos.ifv.getEmployees

import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import panel.deserializers.GetEmployeesResponseDeserializer

@CompileStatic
@JsonDeserialize(using = GetEmployeesResponseDeserializer)
@TupleConstructor
class GetEmployeesResponse {

    int error
    String message
    List<IfvEmployee> data

}

@TupleConstructor
class IfvEmployee {

    String code
    String name
    String surname1
    String surname2
    int jobPositionCode

}
