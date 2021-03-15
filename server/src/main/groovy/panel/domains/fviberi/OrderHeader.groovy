package panel.domains.fviberi

import com.fasterxml.jackson.annotation.JsonFormat
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.utils.Constants

import java.time.LocalDate
import java.time.LocalTime

@Entity
class OrderHeader implements GormEntity<OrderHeader> {

	int number
	State state
	String creatorCode

	@JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
	LocalTime created

	@JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
	LocalDate day
	Client client
	Vehicle vehicle

	static hasMany = [lines: OrderLine, timeInfo: OrderTime]

	static mapping = {
		datasource Constants.DataSource.FVIBERI
		table 'fvcabord'

		number column: 'nuordrep'
		state column: 'clsituac'
		creatorCode column: 'covended', fetch: 'join'
		created formula: 'sec_to_time(hoapertu*60)'
		day column: 'feordrep'
		client column: 'coclient', fetch: 'join'
		vehicle column: 'numatric', lazy: false
		lines fetch: 'join'
		timeInfo fetch: 'join'

		id name: 'number', generator: 'assigned'
		version false
	}

	enum State {

		A,
		C,
		E,
		P,
		V,
		X

	}

}
