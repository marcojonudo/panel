package panel.pogos.fviberi


import groovy.transform.CompileStatic

@CompileStatic
class OrderLine {

	Integer line
	Float units
	String boxNumber
	Article article

    OrderLine(panel.domains.fviberi.OrderLine orderLine) {
		line = orderLine.line
		units = orderLine.units
		boxNumber = orderLine.boxNumber
		article = new Article(orderLine.article)
	}

}
