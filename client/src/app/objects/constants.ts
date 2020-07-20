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
		POINTER_ENTER: 'pointerenter',
		POINTER_DOWN: 'pointerdown',
		POINTER_MOVE: 'pointermove',
		POINTER_UP: 'pointerup',
		POINTER_LEAVE: 'pointerleave',
		CONTEXT_MENU: 'contextmenu'
	};
	public static VALUE: any = {
		LINE_HEIGHT_DEFAULT: 40,
		LINE_HEIGHT_NARROW: 25,
		MECHANIC_INFO_WIDTH: 180,
		TOOLS_BAR_WIDTH: 50,
		MINUTES_PER_INTERVAL: 5,
		CARD_MIN_DURATION: 10,
		UNASSIGNED_BAR_HEIGHT: 75,
		UNASSIGNED_MARGIN_BETWEEN_GROUPS: 10,
		CARD_MOVEMENT_DURATION: 200,
		CARD_MOVEMENT_DURATION_OFFSET: 10,
		MECHANIC_BOTTOM_MARGIN: 5,
		MECHANIC_BORDER: 1,
		TIMELINE_HEIGHT: 30,
		SCROLLBAR_SIZE: 11,
		UNASSIGNED_BAND_CONTAINER_HEIGHT: 100,
		QUARTERS_PER_HOUR: 4,
		INTERVALS_PER_QUARTER: 3,
		SKILLS_PANEL_WIDTH: 250,
		CARD_DETAILS_PANEL_WIDTH: 350,
		LATERAL_PANEL_WIDTH: 300,
		MECHANICS_SATURATION_PERCENTAGE: 60,
		JOB_LINE_TYPE_HEIGHT: 5,
		TIME_INDICATOR_INTERVAL: 60000,
		APPOINTMENT_SUMMARY_ITEM_HEIGHT: 60,
		DEFAULT_TOAST_DELAY: 10000
	};
	public static ID: any = {
		MECHANIC_LINE: 'mechanic-line',
		CARD_CONTEXT_MENU: 'card-context-menu',
		DRAG_SCHEDULE_CONTEXT_MENU: 'drag-schedule-context-menu'
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
		MORNING: 0.6,
		AFTERNOON: 0.4
	};
	public static readonly QUARTERS: any = {
		STEP_0: 0,
		STEP_15: 15,
		STEP_30: 30,
		STEP_45: 45,
	};
	public static readonly CARD_TYPE: any = {
		AUXILIARY: 'AUXILIARY',
		APPOINTMENT: 'APPOINTMENT',
		TODAY: 'TODAY',
		PENDING: 'PENDING'
	};
	public static readonly CARD_STATUS: any = {
		DEFAULT: 'DEFAULT',
		AUXILIARY: 'AUXILIARY',
		FINISHED: 'FINISHED'
	};
	public static readonly DROPZONE_TYPE: any = {
		ASSIGNED: 'ASSIGNED',
		UNASSIGNED: 'UNASSIGNED',
		UNASSIGNED_FINISHED: 'UNASSIGNED_FINISHED',
		FINISH: 'FINISH',
		AUXILIARY: 'AUXILIARY'
	};
	public static readonly CARD_TYPE_BACKGROUND: any = {
		DEFAULT: '#FFFFFF',
		AUXILIARY: '#FFE4AA'
	};
	public static readonly GROUP_MODE: any = {
		DRAG: 'DRAG',
		CUT: 'CUT',
		REPLACE: 'REPLACE',
	};
	public static readonly GROUP_MODE_CURSOR: any = {
		DRAG: 'move',
		CUT: 'scissors.svg',
		REPLACE: 'exchange.png'
	};
	public static readonly MAIN_CURSOR: any = {
		DRAGGING_SCHEDULES: 'brush.svg',
		DEFAULT: 'default'
	};
	public static readonly SCHEDULE_BORDER_CURSOR: any = {
		E_RESIZE: 'e-resize',
		DEFAULT: 'default'
	};
	public static readonly LINK_HANDLER_IMAGE: any = {
		JOINED: 'link_handler_joined.svg',
		SPLITTED: 'link_handler_splitted.svg'
	};
	public static readonly LATERAL_PANEL_INFO_TYPE: any = {
		SKILLS: 'SKILLS',
		CARD_DETAILS: 'CARD_DETAILS',
		APPOINTMENTS_DETAILS: 'APPOINTMENTS_DETAILS'
	};
	public static readonly MECHANIC_LINE_UPDATE_TYPE: any = {
		APPOINTMENT_TYPE: 'APPOINTMENT_TYPE',
		APPOINTMENT_SCHEDULE: 'APPOINTMENT_SCHEDULE',
		CARD_DURATION: 'CARD_DURATION',
		ADD_GROUP: 'ADD_GROUP',
		REMOVE_GROUP: 'REMOVE_GROUP',
		CARD_MODE: 'CARD_MODE',
		JOB_LINE_TYPE: 'JOB_LINE_TYPE',
		LINES_NUMBER: 'LINES_NUMBER',
		MAX_SCHEDULE_WIDTH: 'MAX_SCHEDULE_WIDTH',
		SYNC_JPDV: 'SYNC_JPDV',
		RESIZE_LINE: 'RESIZE_LINE',
		HIGHLIGHT_CARDS: 'HIGHLIGHT_CARDS'
	};
	public static readonly UPDATE_OBJECT: any = {
		MAX_SCHEDULE_WIDTH: 'MAX_SCHEDULE_WIDTH',
		SATURATED_QUARTERS: 'saturatedQuarters',
		MECHANIC_SKILLS: 'mechanicSkills',
		LATERAL_PANEL: 'lateralPanel',
		APPOINTMENT_DAY: 'appointmentDay',
		MECHANIC_LINE: 'mechanicLine',
		DROPZONE: 'DROPZONE',
		GROUPS: 'groups',
		BAND: 'band'
	};
	public static readonly UPDATE_ALL_MECHANIC_LINES_TYPES: string[] = [
		Constants.MECHANIC_LINE_UPDATE_TYPE.MAX_SCHEDULE_WIDTH,
		Constants.MECHANIC_LINE_UPDATE_TYPE.RESIZE_LINE,
		Constants.MECHANIC_LINE_UPDATE_TYPE.HIGHLIGHT_CARDS
	]
	public static readonly TOAST_CLASSNAME: any = {
		WARNING: 'bg-warning'
	};
	public static readonly MESSAGE: any = {
		NO_UNASSIGNED_GROUPS_TO_REPLACE: 'No quedan fichas sin asignar para sustituir la auxiliar',
		NO_REPLACEMENT_SPACE: 'No hay espacio suficiente para reemplazar la ficha auxiliar con la agrupación seleccionada',
		CREATE_SCHEDULE_TOO_CLOSE: 'Hay otros horarios de citas demasiado próximos. Por favor, escoge otro intervalo de horas',
		NO_DAYS_SCHEDULES: 'No hay horarios definidos para días posteriores',
		GROUP_UPDATED_REAL_TIME: 'La ficha se ha actualizado en otro terminal'
	};
	public static readonly SCHEDULE_BORDER_COLOR: any = {
		'#c5e0b4': '#38a83d',
		'#b4c7e7': '#3847e7',
		'#b3e1d2': '#00e1ab',
		'#f8cbad': '#f8a240',
		'#fffcb0': '#fbff00'
	};
	public static readonly JOB_LINE_TYPE: any = {
		AA: 'A/A'
	};
	public static readonly COLOR: any = {
		WHITE: '#ffffff',
		BLACK: '#000000',
	};
	public static readonly CONTEXT_MENU_TYPE: any = {
		GROUP: 'GROUP',
		DRAG_SCHEDULE: 'DRAG_SCHEDULE'
	};
	public static readonly APPOINTMENT_TYPE_CODE: any = {
		RAP: 'RAP'
	};
	public static readonly DATE_FORMAT: any = {
		yyyy_MM_dd: 'YYYY-MM-DD'
	};
	public static readonly TIME_FORMAT: any = {
		HH_mm: 'HH:mm'
	};
	public static readonly DAY_JS: any = {
		d: 'd',
		m: 'm'
	};
	public static readonly REAL_TIME_ACTION: any = {
		UPDATE_CARDS_POSITION: 'updateCardsPosition'
	};
	public static readonly VEHICLE_POSITION: any = {
		PARKING: 'PARKING',
		GARAGE: 'GARAGE'
	};
	public static readonly FIXED_MECHANIC_CODES: string[] = ['9999995', '9999996'];
	public static readonly DEFAULT: string = "DEFAULT";
	public static readonly DEFAULT_JOB_LINE_TYPE_COLOR: string = "#f1f1f1";
	public static readonly AUXILIARY_DEFAULT_ORDER_CODE: string = "Fx";
	public static readonly APPOINTMENT_COUNTER_TOTAL: string = "total";
	public static readonly HOUR_MINUTES: number = 60;
	public static readonly REAL_TIME_UPDATE_PATHS: string[] = ["/cards", "/mechanic/", "/appointment"];
	public static readonly MORNING_AFTERNOON_THRESHOLD_TIME: string = "15:00";
	public static readonly LEFT_CLICK_BUTTON_ID: number = 0;
	public static readonly CONTEXT_MENU: string = 'context-menu';

}
