import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Input,
	OnInit,
	Renderer2
} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Mechanic} from "../../objects/mechanic";
import {MechanicUpdate} from "../../objects/update-days-cards/mechanic-update";
import {Constants} from "../../objects/constants";
import {MechanicsService} from "../../services/mechanics.service";
import {NotificationService} from "../../services/notification.service";
import {CardsService} from "../../services/cards.service";
import {Dayjs} from "dayjs";
import {MechanicLineUpdate} from "../../objects/update-days-cards/mechanic-line-update";
import {MechanicSkills} from "../../objects/mechanic-skills";
import {MechanicsUpdateObjects} from "../../objects/trigger-cd/mechanics-update-objects";
import {MechanicSkillsUpdate} from "../../objects/trigger-cd/update-objects/mechanic-skills-update";

@Component({
	selector: 'app-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit {

	@Input() day: Dayjs;
	@Input() mechanics: Mechanic[];
	@Input() mechanicLineUpdate: MechanicUpdate;
	@Input() mechanicSkillsUpdate: MechanicSkillsUpdate;
	@Input() showAppointmentsName: boolean;

	private pointerDownListener: () => void;

	mechanicsUpdateObjects: MechanicsUpdateObjects;

	constructor(
		private mechanicsService: MechanicsService,
		private cardsService: CardsService,
		private element: ElementRef,
		private renderer: Renderer2,
		private cdRef: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.initMechanicsUpdateObjects();
		this.pointerDownListener = this.renderer.listen(
			this.element.nativeElement,
			Constants.EVENT.POINTER_DOWN,
			this.onPointerDown.bind(this)
		);
	}

	private initMechanicsUpdateObjects(mechanics: Mechanic[] = this.mechanics): void {
		this.mechanicsUpdateObjects = {};
		mechanics.forEach((mechanic: Mechanic) => {
			this.mechanicsUpdateObjects[mechanic.code] = {};
			this.mechanicsUpdateObjects[mechanic.code][Constants.TRIGGER_CD_UPDATE_PROPERTY.MECHANIC_SKILLS] =
				new MechanicSkills();
		});
	}

	// region Getters / setters

	get mechanicBottomMargin(): number {
		return Constants.VALUE.MECHANIC_BOTTOM_MARGIN;
	}

	// endregion

	onPointerDown(event: PointerEvent): void {
		if ((<HTMLElement> event.target).id == Constants.ID.MECHANIC_LINE) {
			NotificationService.notifyLateralInfo(this.day, undefined);
		}
	}

	checkTriggerMechanicLineCd(
		mechanicCode: string,
		mechanicLineUpdate: MechanicUpdate = this.mechanicLineUpdate
	): MechanicUpdate {
		return mechanicLineUpdate
			&& (mechanicLineUpdate.mechanicCode == mechanicCode
				|| Constants.UPDATE_ALL_MECHANIC_LINES_TYPES.includes(mechanicLineUpdate.type))
			? mechanicLineUpdate : undefined;
	}

	findMechanicSkills(
		mechanicCode: string,
		mechanicsUpdateObjects: MechanicsUpdateObjects = this.mechanicsUpdateObjects,
		mechanicSkillsUpdate: MechanicSkillsUpdate = this.mechanicSkillsUpdate
	): MechanicSkills {
		mechanicSkillsUpdate.updateObjects(mechanicCode, mechanicsUpdateObjects);
		return mechanicsUpdateObjects[mechanicCode][mechanicSkillsUpdate.type];
	}

	triggerMechanicLineCd(): void {
		this.mechanicLineUpdate = new MechanicLineUpdate(Constants.MECHANIC_LINE_UPDATE_TYPE.RESIZE_LINE);
		this.cdRef.detectChanges();
	}

	drop(event: CdkDragDrop<string[]>) {
		moveItemInArray(this.mechanics, event.previousIndex, event.currentIndex);
	}

	check() {
		if (Constants.CHECK) {
			console.log('checking grid', this.mechanicLineUpdate, this.day);
		}
	}

}
