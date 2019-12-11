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
		DAY_PANEL_WIDTH: 200,
		TOOLS_BAR_WIDTH: 30,
		CARD_MIN_DURATION: 10,
		UNASSIGNED_BAR_HEIGHT: 75,
		UNASSIGNED_MARGIN_BETWEEN_GROUPS: 10,
		CARD_MOVEMENT_DURATION: 200
	};
	public static readonly CHECK: boolean = false;
	public static readonly SKILL_EXPERTISE_LEVEL: any = {
		LOW: 1,
		MEDIUM: 2,
		HIGH: 3
	};
	public static readonly NEXT_CARD_DIRECTION: any = {
		LEFT: 'LEFT',
		RIGHT: 'RIGHT'
	};
	public static readonly SCHEDULE_TYPE: any = {
		MORNING: 'MORNING',
		AFTERNOON: 'AFTERNOON',
		FULL_TIME: 'FULL_TIME'
	};
	public static readonly QUARTERS: any = {
		STEP_0: 0,
		STEP_15: 15,
		STEP_30: 30,
		STEP_45: 45,
	};
	public static readonly CARD_TYPE: any = {
		APPOINTMENT: 'APPOINTMENT',
		TODAY: 'TODAY',
		PENDING: 'PENDING'
	};
	public static readonly CARD_STATUS: any = {
		DEFAULT: 'DEFAULT',
		TEMPORAL: 'TEMPORAL',
		FINISHED: 'FINISHED'
	};
	public static readonly DROPZONE_TYPE: any = {
		ASSIGNED: 'ASSIGNED',
		UNASSIGNED: 'UNASSIGNED',
		FINISH: 'FINISH'
	};
	public static readonly APPOINTMENT_CARD_TYPE_ID: string = "C";
	public static readonly HOUR_MINUTES: number = 60;
	public static readonly REAL_TIME_UPDATE_PATHS: string[] = ["/cards/", "/mechanic/", "/appointment"];
	public static readonly MORNING_AFTERNOON_THRESHOLD_MINUTES: number = 900;

}
