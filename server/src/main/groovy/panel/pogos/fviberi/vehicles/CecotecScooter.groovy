package panel.pogos.fviberi.vehicles

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import io.micronaut.core.annotation.Introspected
import io.swagger.v3.oas.annotations.media.Schema
import panel.pogos.fviberi.vehicles.repair.RepairInfo

import javax.validation.Valid

@Introspected
@CompileStatic
@TupleConstructor
class CecotecScooter extends Scooter {

    @Valid
    @Schema(description = "Repair information")
    RepairInfo repairInfo

}
