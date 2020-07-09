package panel.pogos.fviberi

import com.fasterxml.jackson.annotation.JsonCreator
import groovy.transform.CompileStatic

@CompileStatic
class Article {

	Integer code
	String name
	boolean labour
	String supplierCode
	String familyCode
	String subfamilyCode
	String rangeCode
	Integer units
	Float price

	@JsonCreator
    Article(Map article) {
		labour = article.labour == 'S'
		code = (labour ? ((String) article.code)[1..-1] : article.code) as Integer
		name = article.name
		labour = article.labour
		supplierCode = article.supplierCode
		familyCode = article.familyCode
		subfamilyCode = article.subfamilyCode
		rangeCode = article.rangeCode
		units = (Integer) article.units
		price = (Float) article.price
	}

}
