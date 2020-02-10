export interface LateralPanelInfo {

	type: string;
	params: any;
	show: boolean;

	handle(...info: any[]): void;

}
