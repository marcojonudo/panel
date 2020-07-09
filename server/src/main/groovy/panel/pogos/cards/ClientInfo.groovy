package panel.pogos.cards

import com.fasterxml.jackson.annotation.JsonInclude
import groovy.transform.CompileStatic
import panel.pogos.fviberi.Client

@CompileStatic
@JsonInclude(JsonInclude.Include.ALWAYS)
class ClientInfo {

	int code
	String name
	String surnames
	Integer phoneNumber

    ClientInfo(Map client) {
		code = (int) client.code
		name = client.name
		surnames = client.surnames
		phoneNumber = (int) client.phoneNumber
	}

    ClientInfo(Client client) {
		code = client.code
		name = client.name
		surnames = client.surnames
		phoneNumber = client.phoneNumber
	}

}
