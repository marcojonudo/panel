export class Client {

	code: number;
	name: string;
	surnames: string;
	phoneNumber: number;

	constructor(client: any) {
		this.code = client.code;
		this.name = client.name;
		this.surnames = client.surnames;
		this.phoneNumber = client.phoneNumber;
	}

	clone(): Client {
		return new Client({
			code: this.code,
			name: this.name,
			surnames: this.surnames,
			phoneNumber: this.phoneNumber
		});
	}

}
