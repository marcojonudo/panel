package panel.pogos.fviberi

import groovy.transform.CompileStatic

@CompileStatic
class Client {

	int code
	String name
	String surnames
	Integer phoneNumber

	Client(panel.domains.fviberi.Client client) {
		code = client.code
		name = client.name
		surnames = client.surnames
		phoneNumber = client.phoneNumber
	}

}
