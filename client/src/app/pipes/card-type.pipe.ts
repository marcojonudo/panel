import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'cardType'
})
export class CardTypePipe implements PipeTransform {

	transform(cardTypes: string[], selectedType: string): string[] {
		return cardTypes.filter(type => type == selectedType);
	}

}
