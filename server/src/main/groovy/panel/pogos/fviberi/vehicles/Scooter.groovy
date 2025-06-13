package panel.pogos.fviberi.vehicles

import com.fasterxml.jackson.annotation.JsonFormat
import groovy.transform.CompileStatic
import io.micronaut.core.annotation.Introspected
import io.swagger.v3.oas.annotations.media.Schema
import panel.utils.Constants

import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull
import java.time.LocalDate

@Introspected
@CompileStatic
class Scooter extends Vehicle {

    @NotNull
    @NotEmpty
    @Schema(description = "Scooter reference")
    String reference

    @NotNull
    @NotEmpty
    @Schema(description = "Scooter distributor")
    String distributor

    @NotNull
    @JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
    @Schema(description = "Scooter purchase day")
    LocalDate purchaseDay

}
