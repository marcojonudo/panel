import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Input, OnChanges,
	OnInit,
	Renderer2, SimpleChanges
} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Mechanic} from "../../objects/mechanic";
import {Constants} from "../../objects/constants";
import {MechanicsService} from "../../services/mechanics.service";
import {NotificationService} from "../../services/notification.service";
import {CardsService} from "../../services/cards.service";
import {Dayjs} from "dayjs";
import {MechanicSkills} from "../../objects/mechanic-skills";
import {CardsGroup} from "../../objects/cards-group";
import {MechanicLineUpdate} from "../../objects/trigger-cd/update-objects/mechanic-line/mechanic-line-update";
import {MechanicSkillsUpdate} from "../../objects/trigger-cd/update-objects/mechanic-skills/mechanic-skills-update";
import {MechanicGroupUpdate} from "../../objects/trigger-cd/update-objects/groups/mechanic-group-update";
import {GroupUpdate} from "../../objects/trigger-cd/update-objects/groups/group-update";
import {MechanicsTriggerMap} from "../../objects/trigger-cd/trigger-maps/mechanics-trigger-map";

@Component({
	selector: 'app-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit {

	@Input() day: Dayjs;
	@Input() mechanics: Mechanic[];
	@Input() mechanicLineUpdates: MechanicLineUpdate[];
	@Input() mechanicSkillsUpdate: MechanicSkillsUpdate;
	@Input() showAppointmentsName: boolean;
	@Input() mechanicGroupUpdates: MechanicGroupUpdate[];

	private pointerDownListener: () => void;

	mechanicsTriggerMap: MechanicsTriggerMap;

	constructor(
		private mechanicsService: MechanicsService,
		private cardsService: CardsService,
		private element: ElementRef,
		private renderer: Renderer2
	) {}

	ngOnInit(): void {
		this.mechanicsTriggerMap = new MechanicsTriggerMap(this.mechanics);
		this.pointerDownListener = this.renderer.listen(
			this.element.nativeElement,
			Constants.EVENT.POINTER_DOWN,
			this.onPointerDown.bind(this)
		);
	}

	// region Getters / setters

	get mechanicBottomMargin(): number {
		return Constants.VALUE.MECHANIC_BOTTOM_MARGIN;
	}

	// endregion

	onPointerDown(event: PointerEvent): void {
		if ((<HTMLElement> event.target).id == Constants.ID.MECHANIC_LINE) {
			NotificationService.notifyLateralInfo(this.day, undefined, true);
		}
	}

	findMechanicGroups(mechanicCode: string, day: Dayjs = this.day): CardsGroup[] {
		return CardsService.findDayMechanicGroups(day, mechanicCode);
	}

	findMechanicLineUpdates(
		mechanicCode: string,
		mechanicsTriggerMap: MechanicsTriggerMap = this.mechanicsTriggerMap,
		mechanicLineUpdates: MechanicLineUpdate[] = this.mechanicLineUpdates
	): MechanicLineUpdate {
		const mechanicLineUpdate = mechanicLineUpdates.find((update: MechanicLineUpdate) =>
			update.mechanicCode == mechanicCode || !update.mechanicCode
		);
		if (mechanicLineUpdate) {
			mechanicLineUpdate.updateTriggerMap(mechanicsTriggerMap, mechanicCode);
		}
		return mechanicsTriggerMap[mechanicCode][mechanicLineUpdates[0].type];
	}

	findGroupsUpdate(
		mechanicCode: string,
		mechanicsTriggerMap: MechanicsTriggerMap = this.mechanicsTriggerMap,
		mechanicGroupUpdates: MechanicGroupUpdate[] = this.mechanicGroupUpdates
	): GroupUpdate[] {
		const mechanicGroupUpdate = mechanicGroupUpdates.find((update: MechanicGroupUpdate) =>
			update.mechanicCode == mechanicCode
		)
		if (mechanicGroupUpdate) {
			mechanicGroupUpdate.updateTriggerMap(mechanicsTriggerMap, mechanicCode);
		}
		return mechanicsTriggerMap[mechanicCode][mechanicGroupUpdates[0].type];
	}

	findMechanicSkills(
		mechanicCode: string,
		mechanicsTriggerMap: MechanicsTriggerMap = this.mechanicsTriggerMap,
		mechanicSkillsUpdate: MechanicSkillsUpdate = this.mechanicSkillsUpdate
	): MechanicSkills {
		mechanicSkillsUpdate.updateTriggerMap(mechanicsTriggerMap, mechanicCode);
		return mechanicsTriggerMap[mechanicCode][mechanicSkillsUpdate.type];
	}

	drop(event: CdkDragDrop<string[]>) {
		moveItemInArray(this.mechanics, event.previousIndex, event.currentIndex);
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking grid', this.mechanicLineUpdates, this.day);
		}
	}

}
