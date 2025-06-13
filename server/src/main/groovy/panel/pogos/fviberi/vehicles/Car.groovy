package panel.pogos.fviberi.vehicles

import groovy.transform.CompileStatic
import io.micronaut.core.annotation.Introspected
import io.swagger.v3.oas.annotations.media.Schema

@Introspected
@CompileStatic
class Car extends Vehicle {

    @Schema(description = "Car cylinder")
    String cylinder

    @Schema(description = "Car registration year")
    Integer registrationYear

    @Schema(description = "Car engine code")
    String engineCode

    @Schema(description = "Car engine power")
    String power

}
