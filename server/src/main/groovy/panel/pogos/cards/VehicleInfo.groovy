package panel.pogos.cards

import com.fasterxml.jackson.annotation.JsonInclude
import groovy.transform.CompileStatic
import panel.pogos.fviberi.Vehicle

@CompileStatic
@JsonInclude(JsonInclude.Include.ALWAYS)
class VehicleInfo {

	String numberPlate
	String brand
	String model
	String cylinder
	String color

    VehicleInfo(Map vehicle) {
		numberPlate = vehicle.numberPlate ?: null
		brand = vehicle.brand ?: null
		model = vehicle.model ?: null
		cylinder = vehicle.cylinder ?: null
		color = vehicle.color ?: null
	}

    VehicleInfo(Vehicle vehicle) {
		numberPlate = vehicle.numberPlate ?: null
		brand = vehicle.brand ?: null
		model = vehicle.model ?: null
		cylinder = vehicle.cylinder ?: null
		color = vehicle.color ?: null
	}

}
