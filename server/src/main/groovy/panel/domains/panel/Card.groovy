package panel.domains.panel

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity
import panel.domains.fviberi.Order
import panel.domains.fviberi.OrderLine
import panel.serializers.CardMinSerializer
import panel.utils.Constants

import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

@Entity
class Card implements GormEntity<Card> {

    Group group
    CardType type
    String code

    @JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
    LocalDate day

    @JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
    LocalTime start

    int duration
    String mechanicCode
    Integer line
    Status status

    @JsonSerialize(using = CardMinSerializer)
    Card linkedPrevious

    @JsonSerialize(using = CardMinSerializer)
    Card linkedNext

    int linkedIndex = 0

    @JsonSerialize(using = CardMinSerializer)
    Card dividedPrevious

    @JsonSerialize(using = CardMinSerializer)
    Card dividedNext

    int divisionIndex = 0
    VehiclePosition vehiclePosition
    Pending pending

    OrderInfo order
    ClientInfo client
    VehicleInfo vehicle
    // TODO Comprobar por qué no lo asigna automáticamente
    @JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
    LocalDateTime dateCreated = LocalDateTime.now()

    @JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
    LocalDateTime lastUpdated = LocalDateTime.now()

    @JsonFormat(pattern = Constants.DateTimeFormat.yyyy_MM_dd_HH_mm_ss, timezone = Constants.SPAIN_TIMEZONE)
    LocalDateTime dateDeleted

    static hasOne = [group: Group]

    static belongsTo = Card

    static constraints = {
        code maxSize: 45
        day nullable: true
        start nullable: true
        mechanicCode nullable: true
        line nullable: true
        linkedPrevious nullable: true
        linkedNext nullable: true
        dividedPrevious nullable: true
        dividedNext nullable: true
        vehiclePosition nullable: true
        client nullable: true
        vehicle nullable: true
        dateDeleted nullable: true
    }

    static mapping = {
        version defaultValue: 0

        group lazy: false
        linkedPrevious lazy: false
        linkedNext lazy: false
    }

    static embedded = ['pending', 'order', 'client', 'vehicle']

    enum CardType {

        AUXILIARY({ String orderCode, LocalDate day -> !orderCode }),
        APPOINTMENT({ String orderCode, LocalDate day -> orderCode.startsWith("C") }),
        TODAY({ String orderCode, LocalDate day -> day == LocalDate.now() }),
        PENDING({ String orderCode, LocalDate day -> true })

        final Closure<Boolean> condition

        CardType(Closure<Boolean> condition) {
            this.condition = condition
        }

    }

    enum VehiclePosition {

        PARKING,
        GARAGE

    }

    enum Status {

        DEFAULT,
        FINISHED,
        AUXILIARY,
        ECOMMERCE,
        CONFIRMED

    }

}

class Pending {

    Boolean material
    boolean call
    boolean budget

    static constraints = {
        material nullable: true
    }

}

class OrderInfo {

    Integer number
    String code
    Order.State state
    String creatorCode

    @JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
    LocalTime created

    @JsonFormat(pattern = Constants.TimeFormat.HH_mm, timezone = Constants.SPAIN_TIMEZONE)
    LocalTime deadline

    @JsonFormat(pattern = Constants.DateFormat.yyyy_MM_dd, timezone = Constants.SPAIN_TIMEZONE)
    LocalDate day

    List<OrderLine> lines

    static constraints = {
        number nullable: true
        state nullable: true
        creatorCode nullable: true
        created nullable: true
        deadline nullable: true
        day nullable: true
    }

    static transients = ['lines']

}

class VehicleInfo {

    String numberPlate
    String brand
    String model
    String cylinder
    String color

    static constraints = {
        numberPlate nullable: true
        brand nullable: true
        model nullable: true
        cylinder nullable: true
        color nullable: true
    }

}

class ClientInfo {

    int code
    String name
    String surnames
    int phoneNumber

    static constraints = {
        code nullable: true
        name nullable: true
        surnames nullable: true
        phoneNumber nullable: true
    }

}
