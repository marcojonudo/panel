package panel.pogos.eCommerce.save

import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor

@CompileStatic
@TupleConstructor
class SaveEcommerceCardResponse {

    String message
    EcommerceCard card

}
