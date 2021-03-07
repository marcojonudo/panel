package panel.services.data.fviberi


import grails.gorm.services.Service
import grails.gorm.services.Where
import panel.domains.fviberi.OrderHeader
import panel.pogos.fviberi.Order

import java.time.LocalDate

@Service(OrderHeader)
abstract class OrderHeaderDataService {

	@Where({ state in states && day <= to })
	abstract List<OrderHeader> findAllOrders(List<String> states, LocalDate to)

	List<Order> findAll(List<String> states, LocalDate to) {
		return findAllOrders(states, to).collect { new Order(it) }
	}

}
