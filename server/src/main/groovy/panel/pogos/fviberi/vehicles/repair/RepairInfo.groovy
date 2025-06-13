package panel.pogos.fviberi.vehicles.repair

import groovy.transform.CompileStatic
import io.micronaut.core.annotation.Introspected
import io.swagger.v3.oas.annotations.media.Schema

import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

@Introspected
@CompileStatic
class RepairInfo {

    @NotNull
    @NotEmpty
    @Schema(description = "Failure diagnosis")
    String diagnosis

    @NotNull
    @Schema(description = "Failure diagnosis ID")
    Long diagnosisId

    @Schema(description = "Failure cause")
    String cause

    @NotNull
    @Schema(description = "Failure cause ID")
    Long causeId

    @Schema(description = "Product under warranty")
    boolean warranty

    @Schema(description = "Failure relapse")
    boolean relapse

}
