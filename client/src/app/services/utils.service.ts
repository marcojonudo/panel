import {Injectable} from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class UtilsService {

	public static parseTimeFromString(time: string): Date {
		const info = time.split(":");
		let date = new Date();
		date.setHours(parseInt(info[0]));
		date.setMinutes(parseInt(info[1]));
		date.setSeconds(parseInt(info[2]));

		return date;
	}

	public static parseTimeFromMinutes(minutes: number, day: Date): Date {
		// const hours = minutes / 60 < 10 ? `0${minutes / 60}` : `${minutes / 60}`;
		// const m = minutes % 60 < 10 ? `0${minutes % 60}` : `${minutes % 60}`;
		// return `${hours}:${m}:00`
		return new Date(day.getFullYear(), day.getMonth(), day.getDate(), minutes/60, minutes%60)
	}

	public static parseDateFromString(date: string): Date {
		const info = date.split('-');
		return new Date(+info[0], +info[1], +info[2]);
	}

	public static parseDateFromCompleteString(date: string): Date {
		const info = date.split(' ');
		const dateInfo = info[0].split('-');
		const timeInfo = info[1].split(':');
		return new Date(+dateInfo[0], +dateInfo[1], +dateInfo[2], +timeInfo[0], +timeInfo[1], +timeInfo[2]);
	}

	public static getTotalMinutes(time: Date): number {
		return time.getHours() * 60 + time.getMinutes();
	}

	public static groupBy(array: any[], property: any) {
		let grouped = {};
		for (let item of array) {
			if (!grouped[property(item)]) {
				grouped[property(item)] = []
			}
			grouped[property(item)].push(item);
		}
		return grouped;
	}

	public static groupList(array: any[], property: any) {
		let groupList = [];
		for (let item of array) {
			const index = groupList.findIndex(list => list && property(list[0]) == property(item));
			if (index == -1) {
				groupList.push([item]);
			} else {
				groupList[index].push(item);
			}
		}
		return groupList;
	}

}
