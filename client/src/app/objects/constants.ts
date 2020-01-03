export class Constants {
	public static PROPERTY: any = {
		SCROLL_LEFT: 'scrollLeft',
		SCROLL_TOP: 'scrollTop',
		DURATION: 'duration'
	};
	public static ELEMENT: any = {
		DOCUMENT: 'document',
		SCROLLABLE_CONTAINER: 'scrollableContainer'
	};
	public static EVENT: any = {
		POINTER_DOWN: 'pointerdown',
		POINTER_MOVE: 'pointermove',
		POINTER_UP: 'pointerup',
		POINTER_LEAVE: 'pointerleave'
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
		CARD_MOVEMENT_DURATION: 200,
		MECHANIC_BOTTOM_MARGIN: 10,
		TIMELINE_HEIGHT: 30,
		SCROLLBAR_SIZE: 7,
		UNASSIGNED_BAND_CONTAINER_HEIGHT: 100,
		QUARTERS_PER_HOUR: 4,
		INTERVALS_PER_QUARTER: 3,
		SKILLS_PANEL_WIDTH: 250,
		CARD_DETAILS_PANEL_WIDTH: 350,
		MECHANICS_SATURATION_PERCENTAGE: 60,
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
	public static readonly ORDER_STATE_NAME: any = {
		V: 'VENDIDA',
		X: 'ANULADA',
		C: 'CERRADA',
		P: 'PAUSADA',
		A: 'ABIERTA',
		E: 'EMPEZADA'
	};
	public static readonly SCHEDULE_TYPE: any = {
		MORNING: 'morning',
		AFTERNOON: 'afternoon',
		FULL_TIME: 'full_time'
	};
	public static readonly APPOINTMENT_SATURATION: any = {
		MORNING: 0.4,
		AFTERNOON: 0.6
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
	public static readonly APPOINTMENT_COUNTER_TOTAL: string = "total";
	public static readonly APPOINTMENT_CARD_TYPE_ID: string = "C";
	public static readonly HOUR_MINUTES: number = 60;
	public static readonly REAL_TIME_UPDATE_PATHS: string[] = ["/cards/", "/mechanic/", "/appointment"];
	public static readonly MORNING_AFTERNOON_THRESHOLD_MINUTES: number = 900;

}
