package panel.pogos.fviberi

import groovy.transform.CompileStatic

@CompileStatic
class Vehicle {

	String numberPlate
	String model
	String cylinder
	String color
	String brand
	String fuel

	Vehicle(panel.domains.fviberi.Vehicle vehicle) {
		numberPlate = vehicle.numberPlate
		model = vehicle.model
		cylinder = vehicle.cylinder
		color = vehicle.color
		brand = vehicle.brand
		fuel = vehicle.fuel
	}

}
