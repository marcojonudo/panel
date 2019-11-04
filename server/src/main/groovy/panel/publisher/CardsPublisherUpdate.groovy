package panel.publisher

import groovy.transform.CompileStatic

@CompileStatic
abstract class CardsPublisherUpdate {

	String updateId
	List<Map<String, String>> cards

}
