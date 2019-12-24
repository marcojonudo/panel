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

}
