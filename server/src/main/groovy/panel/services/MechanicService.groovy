package panel.services

import groovy.transform.CompileStatic
import jakarta.inject.Inject
import jakarta.inject.Singleton
import panel.clients.SchedulesClient
import panel.domains.MechanicAppointment
import panel.domains.MechanicPanelInfo
import panel.pogos.schedules.EmployeeSchedule
import panel.pogos.schedules.JobPositionGroup
import panel.services.data.MechanicAppointmentDataService
import panel.services.data.MechanicPanelInfoDataService
import panel.utils.Constants

import java.time.LocalDate

@Singleton
@CompileStatic
class MechanicService {

	private static List<JobPositionGroup.Code> SKILL_GROUP_CODES = [
		JobPositionGroup.Code.GARAGE, JobPositionGroup.Code.SHOP
	]

    @Inject SchedulesClient schedulesClient
	@Inject MechanicAppointmentDataService mechanicAppointmentDataService
	@Inject MechanicPanelInfoDataService mechanicPanelInfoDataService

	/**
	 * Obtiene los mecánicos para cada día y carga su posición si todavía no está definida
	 * @param from Fecha desde
	 * @param to Fecha hasta
	 * @return Lista de mecánicos
	 */
	List<EmployeeSchedule> findMechanics(LocalDate from, LocalDate to) {
		List<EmployeeSchedule> mechanics = schedulesClient.findMechanics(from, to)
		List<MechanicPanelInfo> panelInfo = mechanicPanelInfoDataService.findAll((List<Long>) mechanics.id)
		List<MechanicAppointment> appointments = mechanicAppointmentDataService.findAll((List<Long>) mechanics.id)

		return fillMechanics(mechanics, panelInfo, appointments)
	}

	/**
	 * Rellena los mecánicos con la información de panel y de citas
	 * @param mechanics Lista de mecánicos
	 * @param panelInfo Lista con información de panel
	 * @param appointments Lista con citas
	 * @return Lista de mecánicos
	 */
	static List<EmployeeSchedule> fillMechanics(
		List<EmployeeSchedule> mechanics, List<MechanicPanelInfo> panelInfo, List<MechanicAppointment> appointments
	) {
		mechanics.groupBy { it.day }.each { LocalDate day, List<EmployeeSchedule> dayMechanics ->
			dayMechanics.each { EmployeeSchedule mechanic ->
				mechanic.panelInfo = findMechanicPanelInfo(mechanic, panelInfo, dayMechanics)
				mechanic.appointments = appointments.findAll { it.mechanicId == mechanic.id }
			}
		}
		return mechanics
	}

	/**
	 * Obtiene la información de panel de un mecánico
	 * @param mechanic Mecánico para el que se busca la información
	 * @param panelInfo Lista con toda la información de panel
	 * @param dayMechanics Mecánicos del día
	 * @return Información de panel
	 */
	static MechanicPanelInfo findMechanicPanelInfo(
		EmployeeSchedule mechanic, List<MechanicPanelInfo> panelInfo, List<EmployeeSchedule> dayMechanics
	) {
		MechanicPanelInfo mechanicPanelInfo = panelInfo.find { it.mechanicId == mechanic.id }
		/* Si no se encuentra información de panel para el mecánico, se construye con la posición que corresponda */
		if (!mechanicPanelInfo) {
			String position = findMechanicPosition(dayMechanics)
			mechanicPanelInfo = new MechanicPanelInfo(mechanic.id, position)
		}
		return mechanicPanelInfo
	}

	/**
	 * Obtiene la posición del mecánico
	 * @param dayMechanics Mecánicos del día
	 * @return String con la posición (A, B...)
	 */
	static String findMechanicPosition(List<EmployeeSchedule> dayMechanics) {
		String lastPosition = dayMechanics.panelInfo.position.max()
		return lastPosition ?
			String.valueOf((lastPosition.charAt(0) + 1) as char) : Constants.FIRST_MECHANIC_POSITION
	}

}
