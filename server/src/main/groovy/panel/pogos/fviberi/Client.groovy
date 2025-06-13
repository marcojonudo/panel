package panel.pogos.fviberi


import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import io.micronaut.core.annotation.Introspected
import io.swagger.v3.oas.annotations.media.Schema

import javax.validation.Valid
import javax.validation.constraints.Min
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

@CompileStatic
@Introspected
@TupleConstructor
class Client {

	@NotNull
	@NotEmpty
	@Schema(description = "Client NIF")
    String nif

	@NotNull
	@NotEmpty
	@Schema(description = "Client name")
    String name

	@NotNull
	@NotEmpty
	@Schema(description = "Client surnames")
    List<String> surnames

	@NotNull
	@Min(0L)
	@Schema(description = "Client phone number")
    Long phoneNumber

	@Schema(description = "Client email")
    String email

	@NotNull
	@Valid
    Address address

}

@CompileStatic
@Introspected
@TupleConstructor
class Address {

	@Schema(description = "Postal code")
    String zipCode

	@Schema(type = "string", description = "Country code", allowableValues = ["ES"], defaultValue = "ES")
	CountryCode countryCode

	@Schema(description = "Province")
    String province

	@NotNull
	@NotEmpty
	@Schema(description = "City")
    String city

	@NotNull
	@NotEmpty
	@Schema(description = "Address")
    String address

	enum CountryCode {

		ES

	}

}
