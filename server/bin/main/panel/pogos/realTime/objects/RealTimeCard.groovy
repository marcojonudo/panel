package panel.pogos.realTime.objects


import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import panel.domains.Card

@TupleConstructor
@CompileStatic
class RealTimeCard implements RealTimeObject {

    Card card

}
