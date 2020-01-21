import {Directive, HostListener} from '@angular/core';
import {CardPositionService} from "../services/card-position.service";

@Directive({
	selector: '[appHorizontalScrollable]'
})
export class HorizontalScrollableDirective {

	@HostListener('scroll', ['$event'])
	onScroll(event): void {
		CardPositionService.barScrollLeft = event.target.scrollLeft;
	}

}
