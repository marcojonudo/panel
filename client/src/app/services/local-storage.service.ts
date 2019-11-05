import {Injectable} from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class LocalStorageService {

	setItem(key, value): void {
		localStorage.setItem(key, JSON.stringify(value));
	}

	setItems(object: any): void {
		for (const [key, value] of Object.entries(object)) {
			this.setItem(key, value);
		}
	}

	getItem(key): any {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : undefined;
	}

}
