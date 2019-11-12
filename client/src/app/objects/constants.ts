export class Constants {
	public static PROPERTY: any = {
		SCROLL_LEFT: 'scrollLeft',
		SCROLL_TOP: 'scrollTop'
	};
	public static ELEMENT: any = {
		SCROLLABLE_CONTAINER: 'scrollableContainer'
	};
	public static VALUE: any = {
		LINE_HEIGHT_DEFAULT: 40,
		LINE_HEIGHT_NARROW: 25,
		MECHANIC_INFO_WIDTH: 180,
		CARD_MIN_DURATION: 10
	};
	public static readonly CHECK: boolean = false;
	public static readonly SKILL_EXPERTISE_LEVEL: any = {
		LOW: 1,
		MEDIUM: 2,
		HIGH: 3
	};
	public static readonly NEXT_CARD_DIRECTION: any = {
		LEFT: 'LEFT',
		RIGHT: 'RIGTH'
	};
	public static readonly SCHEDULE_TYPE: any = {
		MORNING: 'morning',
		AFTERNOON: 'afternoon',
		FULL_TIME: 'full-time'
	};
	public static readonly DRAG_SCHEDULE_ACTION: any = {
		ADD: 'add',
		REMOVE: 'remove'
	};
	public static readonly REAL_TIME_UPDATE_PATHS: string[] = ["/cards/", "/mechanic/"];
}
