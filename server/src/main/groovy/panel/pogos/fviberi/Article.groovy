package panel.pogos.fviberi


import groovy.transform.CompileStatic
import panel.utils.Constants

@CompileStatic
class Article {

	Integer code
	String name
	boolean labour
	Boolean spv

    Article(panel.domains.fviberi.Article article) {
		labour = article.labour == 'S'
		code = (labour ? (article.code as String)[1..-1] : article.code) as Integer
		name = article.name
		spv = code ? (article.code as String).startsWith(Constants.SPV_ID) : null
	}

}
