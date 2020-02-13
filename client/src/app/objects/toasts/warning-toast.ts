import {Toast} from "./toast";
import {Constants} from "../constants";

export class WarningToast implements Toast {

	className: string;
	text: string;
	delay: number;

	constructor(text: string, delay: number = Constants.VALUE.DEFAULT_TOAST_DELAY) {
		this.text = text;
		this.className = Constants.TOAST_CLASSNAME.WARNING;
		this.delay = delay;
	}

}
