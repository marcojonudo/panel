import {Directive, HostBinding, Input} from '@angular/core';
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";
import {Coordinates} from "../objects/coordinates";

@Directive({
	selector: '[appMovable]',
	exportAs: 'appMovable'
})
export class MovableDirective {

	@Input() coordinates: Coordinates;

	@HostBinding('style.transform') get transform(): SafeStyle {
		return this.sanitizer.bypassSecurityTrustStyle(
			`translateX(${this.coordinates.x}px) translateY(${this.coordinates.y}px)`
		);
	}

	constructor(private sanitizer: DomSanitizer) {}

}
