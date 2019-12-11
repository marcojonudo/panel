import {Pipe, PipeTransform} from '@angular/core';
import {UnassignedSection} from "../objects/unassigned-sections/unassigned-section";

@Pipe({
	name: 'cardSection'
})
export class CardSectionPipe implements PipeTransform {

	transform(cardSections: UnassignedSection[], selectedSection: UnassignedSection): UnassignedSection[] {
		return cardSections.filter((section: UnassignedSection) => section.name == selectedSection.name);
	}

}
