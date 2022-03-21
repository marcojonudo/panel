package panel.pogos.ifv.getToken

import com.fasterxml.jackson.annotation.JsonProperty
import groovy.transform.CompileStatic
import io.micronaut.context.annotation.Property
import panel.utils.Constants

import jakarta.inject.Singleton

@Singleton
@CompileStatic
class GetTokenBody {

    @Property(name = "ifv.username")
    @JsonProperty("usuario")
    String user

    @Property(name = "ifv.password")
    @JsonProperty("pass")
    String password

    @Property(name = "ifv.centre")
    @JsonProperty("centro")
    String centre

    @JsonProperty("servicio")
    String service = Constants.IFV_GET_CENTRE_SCHEDULE_SERVICE

}
