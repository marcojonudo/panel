package panel.pogos.ifv.getToken

import com.fasterxml.jackson.annotation.JsonProperty
import groovy.transform.CompileStatic
import panel.pogos.ifv.IfvResponse

import jakarta.inject.Singleton

@Singleton
@CompileStatic
class GetTokenResponse extends IfvResponse {

    @JsonProperty("datos")
    String token

}
