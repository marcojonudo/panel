package panel.pogos.fviberi.vehicles

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import groovy.transform.CompileStatic
import io.micronaut.core.annotation.Introspected
import io.swagger.v3.oas.annotations.media.Schema
import panel.utils.Constants

import javax.validation.constraints.NotNull

@Introspected
@CompileStatic
@JsonIgnoreProperties(ignoreUnknown = true)
class Vehicle {

    @NotNull
    @Schema(description = "Vehicle type")
    Type type

    @NotNull
    @Schema(description = "Vehicle identifier")
    String identifier

    @NotNull
    @Schema(description = "Vehicle brand")
    String brand

    @NotNull
    @Schema(description = "Vehicle model")
    String model

    @Schema(description = "Vehicle color")
    String color

    enum Type {

        CAR("COCHE", Car, { Map order -> (String) order.vehicleType == CAR.name }),
        BIKE("BICICLETA", null, { Map order -> false }),
        MOTORBIKE("MOTO", null, { Map order -> false }),
        SCOOTER(
            "PATINETE",
            Scooter,
            { Map order ->
                ((String) order.vehicleType) == SCOOTER.name && ((String) order.sellerCode) != Constants.SellerCode.CECOTEC
            }
        ),
        CECOTEC_SCOOTER(
            "PATINETE",
            CecotecScooter,
            { Map order ->
                ((String) order.vehicleType) == CECOTEC_SCOOTER.name && ((String) order.sellerCode) == Constants.SellerCode.CECOTEC
            }
        )

        final String name
        final Class clazz
        final Closure<Boolean> check

        Type(String name, Class clazz, Closure<Boolean> check) {
            this.name = name
            this.clazz = clazz
            this.check = check
        }

    }

}
