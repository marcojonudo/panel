package panel.services.data.fviberi

import grails.gorm.services.Service
import grails.gorm.services.Where
import grails.gorm.transactions.Transactional
import panel.domains.fviberi.Order
import panel.utils.Constants

import java.time.LocalDate

@Service(Order)
@Transactional(connection = Constants.DataSource.FVIBERI)
interface OrderDataService {

	@Where({ state in states && day <= to })
	List<Order> findAll(List<Order.State> states, LocalDate to)

//	List<Order> findAll(List<String> states, LocalDate to) {
//		return findAllOrders(states, to).collect { new Order(it) }
//	}

}
