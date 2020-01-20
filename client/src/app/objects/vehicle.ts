export class Vehicle {

	brand: string;
	model: string;
	cylinder: string;
	color: string;

	constructor(vehicle: any) {
		this.brand = vehicle.brand;
		this.model = vehicle.model;
		this.cylinder = vehicle.cylinder;
		this.color = vehicle.color;
	}

	clone(): Vehicle {
		return new Vehicle({
			brand: this.brand,
			model: this.model,
			cylinder: this.cylinder,
			color: this.color
		});
	}

}
