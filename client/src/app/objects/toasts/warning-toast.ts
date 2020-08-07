import {Toast} from "./toast";
import {Constants} from "../constants";

export class WarningToast implements Toast {

	className: string;
	text: string;
	spinner: boolean;
	delay: number;

	constructor(text: string, spinner: boolean = false, delay: number = Constants.VALUE.DEFAULT_TOAST_DELAY) {
		this.text = text;
		this.spinner = text ? false : spinner;
		this.className = Constants.TOAST_CLASSNAME.WARNING;
		this.delay = delay;
	}

}
