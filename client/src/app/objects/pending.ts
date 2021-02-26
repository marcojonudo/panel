export class Pending {

	material: boolean;
	call: boolean;
	budget: boolean;

	constructor(pending: any) {
		this.material = pending.material;
		this.call = pending.call;
		this.budget = pending.budget;
	}

	clone(): Pending {
		return new Pending({
			material: this.material,
			call: this.call,
			budget: this.budget
		});
	}

}
