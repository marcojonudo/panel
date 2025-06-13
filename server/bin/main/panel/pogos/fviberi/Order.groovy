package panel.pogos.fviberi

import com.fasterxml.jackson.annotation.JsonFormat
import groovy.transform.CompileStatic
import panel.pogos.fviberi.vehicles.Vehicle
import panel.utils.Constants

import java.time.LocalDateTime

@CompileStatic
class Order {

	int number
	String shortCode

	@JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_T_hh_MM_ss_Z, timezone = Constants.SPAIN_TIMEZONE)
    LocalDateTime date

    State state
	Vehicle vehicle
	Client client
	String origin
	String sellerCode
	List<OrderLine> lines

	enum State {

		A,
		C,
		E,
		P,
		V,
		X

	}

	List<OrderLine> findLabourLines() {
		List<OrderLine> labourLines = []
		lines.findAll { OrderLine line ->
			line.units.times {
				try {
					if (line.article.labour) {
						labourLines << line
					}
				} catch (ignored) {
					return false
				}
			}
		}
		return labourLines
	}

}
