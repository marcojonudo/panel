package panel.pogos.realTime.objects


import groovy.transform.CompileStatic
import groovy.transform.TupleConstructor
import panel.domains.AppointmentDay
import panel.domains.Card

@TupleConstructor
@CompileStatic
class RealTimeSyncJpdv implements RealTimeObject {

    List<Card> newCards
    List<Card> newReplace
    List<Card> reset
    List<Card> updated
    List<Card> deleted
    List<AppointmentDay> appointmentDays

}
