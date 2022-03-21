package panel.services

import groovy.transform.CompileStatic
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import panel.domains.panel.MechanicPanelInfo
import panel.domains.schedules.EmployeeSchedule
import panel.domains.schedules.JobPositionGroup
import panel.services.data.panel.MechanicAppointmentDataService
import panel.services.data.panel.MechanicPanelInfoDataService
import panel.services.data.schedules.EmployeeScheduleDataService
import panel.utils.Constants

import jakarta.inject.Inject
import jakarta.inject.Singleton
import java.time.LocalDate

@Singleton
@CompileStatic
class MechanicsService {

	private static final Logger LOG = LoggerFactory.getLogger(MechanicsService)

	@Inject EmployeeScheduleDataService employeeScheduleDataService
	@Inject MechanicAppointmentDataService mechanicAppointmentDataService
	@Inject MechanicPanelInfoDataService mechanicPanelInfoDataService

	/**
	 * Obtiene los mecánicos para cada día y carga su posición si todavía no está definida
	 * @param from Fecha desde
	 * @param to Fecha hasta
	 * @return Lista de mecánicos
	 */
	List<EmployeeSchedule> findMechanics(LocalDate from, LocalDate to) {
		List<EmployeeSchedule> mechanics = employeeScheduleDataService.findAll(from, to, JobPositionGroup.Code.GARAGE)
		mechanics.each {
			it.mechanicPanelInfo = findMechanicPanelInfo(it, mechanics)
			it.appointments = mechanicAppointmentDataService.findAll(it.id)
		}
//		lastScheduleDay = employeeScheduleDataService.findEmployeeScheduleDay([sort: 'day', order: 'desc', max: 1])
		return mechanics
	}

	/**
	 * Encuentra la información de panel del mecánico
	 * @param mechanic Mecánico
	 * @param mechanics Lista de mecánicos para comprobar su posición en panel
	 * @return Información de panel del mecánico
	 */
	MechanicPanelInfo findMechanicPanelInfo(EmployeeSchedule mechanic, List<EmployeeSchedule> mechanics) {
		String lastPosition = mechanics.findAll { it.day == mechanic.day }.mechanicPanelInfo.position.max()
		String nextPosition = lastPosition ?
			String.valueOf((lastPosition.charAt(0) + 1) as char) : Constants.FIRST_MECHANIC_POSITION
		return mechanicPanelInfoDataService.find(mechanic.id) ?: mechanicPanelInfoDataService.save(mechanic.id, nextPosition)
	}

//	/**
//	 * Integra los mecánicos sin día (líneas de taller y tienda) y convierte la lista de mecánicos en un mapa
//	 * @param mechanics Lista de mecánicos
//	 * @return Mapa con día y mecánicos
//	 */
//	static Map<String, List<EmployeeSchedule>> integrateFixedMechanics(List<EmployeeSchedule> mechanics) {
//		boolean existentMechanics = mechanics.find { it.day }
//		Map<String, List<EmployeeSchedule>> daysMechanics = [:]
//
//		/* Sólo se integran las líneas de taller y tienda si existen otros mecánicos. Si no, no tiene sentido hacerlo,
//		*  ya que el horario de las primeras se basa en el de los segundos */
//		if (existentMechanics) {
//			LocalDate today = LocalDate.now()
//            List<EmployeeSchedule> todayMechanics = mechanics.findAll { it.day == today }
//            if (!todayMechanics) {
//                mechanics = mechanics.findAll { it.day }
//            }
//			mechanics.each {
//				if (!it.day) {
//					it.intervals = [findThresholdSchedule(todayMechanics)].toSet()
//					it.day = today
//				}
//				if (!daysMechanics[it.day.toString()]) {
//					daysMechanics[it.day.toString()] = []
//				}
//				daysMechanics[it.day.toString()] << it
//			}
//		}
//		return daysMechanics
//	}

//	/**
//	 * Obtiene un horario con la entrada más temprana y la salida más tardía
//	 * @param mechanics Lista de mecánicos
//	 * @return Intervalo de horario
//	 */
//	static ScheduleInterval findThresholdSchedule(List<EmployeeSchedule> mechanics) {
//		List<ScheduleInterval> intervals = (List<ScheduleInterval>) mechanics.intervals.flatten()
//		LocalTime minStart = intervals.start.min()
//		LocalTime maxEnd = intervals.end.max()
//
//		return new ScheduleInterval(start: minStart, end: maxEnd)
//	}

	// endregion

}
