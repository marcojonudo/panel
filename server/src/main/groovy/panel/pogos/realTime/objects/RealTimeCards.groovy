package panel.pogos.realTime.objects


import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import panel.domains.panel.Card

@TupleConstructor
@CompileStatic
class RealTimeCards implements RealTimeObject {

    List<Card> cards

}
