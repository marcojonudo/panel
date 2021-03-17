package panel.services.data.panel

import grails.gorm.services.Query
import grails.gorm.services.Service
import grails.gorm.services.Where
import panel.domains.panel.Card
import panel.domains.panel.Group
import panel.domains.panel.OrderInfo
import panel.domains.panel.VehicleInfo

import javax.inject.Inject
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

@Service(Card)
abstract class CardDataService {

	@Inject
    GroupDataService groupDataService

	@Where({ (day >= from || day == null) && dateDeleted == null })
	abstract List<Card> findAllFrom(LocalDate from)

	@Where({ ((day >= from && day <= to) || day == null) && dateDeleted == null })
	abstract List<Card> findAll(LocalDate from, LocalDate to)

	@Where({ day < to && dateDeleted == null })
	abstract List<Card> findAllTo(LocalDate to)

	@Where({ day == day && mechanicCode in mechanicCodes && dateDeleted == null })
	abstract List<Card> findAll(LocalDate day, List<String> mechanicCodes)

	@Query("""
		from ${Card card}
		where card.order.code = $orderCode and card.group.code = $groupCode
		and $card.divisionIndex = $divisionIndex
		and (card.day is null or card.day >= $day) and card.dateDeleted is null
	""")
	abstract Card find(String orderCode, int groupCode, int divisionIndex, LocalDate day)

	@Query("""
		from ${Card card}
		where card.order.code = $orderCode and card.group.code = $groupCode
		and $card.linkedIndex = $linkedIndex and $card.divisionIndex = $divisionIndex
		and ($card.day is null or $card.day >= $day) and $card.dateDeleted is null
	""")
	abstract Card find(String orderCode, int groupCode, int linkedIndex, int divisionIndex, LocalDate day)

	@Query("select $card.code from ${Card card} where $card.status in $statusList")
	abstract String findCode(List<Card.Status> statusList, Map args)

	abstract Card find(String code)

	abstract Card save(Card card)

	@Query("update ${Card card} set $card.vehiclePosition = $vehiclePosition where $card.id = $id")
	abstract Number save(Serializable id, Card.VehiclePosition vehiclePosition)

	@Query("update ${Card card} set card.pending.call = $pendingCall where $card.id = $id")
	abstract Number update(Serializable id, boolean pendingCall)

	@Query("update ${Card card} set card.pending.budget = $pendingBudget where $card.id = $id")
	abstract Number updateBudget(Serializable id, boolean pendingBudget)

	abstract Card update(Serializable id, int linkedIndex)

	abstract Card update(Serializable id, Card linkedPrevious, Card linkedNext, int linkedIndex)

	abstract Card update(Serializable id, Card linkedPrevious, Card linkedNext)

	abstract Card updateLinkedPrevious(Serializable id, Card linkedPrevious)

	abstract Card updateLinkedNext(Serializable id, Card linkedNext)

	abstract Card update(Serializable id, LocalDate day, String mechanicCode, Integer line, LocalTime start, Card.Status status)

	abstract Card update(
        Serializable id,
        LocalDate day,
        String mechanicCode,
        Integer line,
        LocalTime start,
        Card.Status status,
        Card linkedPrevious,
        Card linkedNext
	)

	abstract Card update(
		Serializable id,
		LocalDate day,
		String mechanicCode,
		LocalTime start,
		Integer line,
		OrderInfo order,
		VehicleInfo vehicle
	)

	abstract Card update(Serializable id, int duration, LocalTime start)

	abstract Card update(
        Serializable id,
        LocalTime start,
        int duration,
        Card linkedPrevious,
        Card linkedNext,
        Card dividedPrevious,
        Card dividedNext
	)

	abstract Card update(Serializable id, LocalDateTime dateDeleted)

	abstract Card update(Serializable id, Card.Status status)

	Card find(Card card) {
		return find(card.order.code, card.group.code, card.linkedIndex, card.divisionIndex, LocalDate.now())
	}

	Card saveCard(Card card) {
		Group group = groupDataService.find(card.group.code)
		card.group = group
		fillLinkedCards(card)
		fillDividedCard(card)
		save(card)
	}

	List<Card> saveCards(List<Card> cards) {
		List<Card> dbCards = cards.collect { saveCard(it) }
		initLinkedCards(dbCards)
		return dbCards
	}

	void initLinkedCards(List<Card> cards) {
		cards.groupBy { it.order.number }.each { int orderNumber, List<Card> orderCards ->
			orderCards.eachWithIndex { Card card, int i ->
				if (i != 0) {
					card.linkedPrevious = orderCards[i-1]
				}
				if (i != orderCards.size() - 1) {
					card.linkedNext = orderCards[i+1]
				}
				card.linkedIndex = i
				update(card.id, card.linkedPrevious, card.linkedNext, card.linkedIndex)
			}
		}
	}

	void fillLinkedCards(Card card) {
		if (card.linkedPrevious) {
			card.linkedPrevious = find(card.linkedPrevious)
		}
		if (card.linkedNext) {
			card.linkedNext = find(card.linkedNext)
		}
	}

	void fillDividedCard(Card card) {
		if (card.dividedPrevious) {
			card.dividedPrevious = find(card.dividedPrevious)
		}
		if (card.dividedNext) {
			card.dividedNext = find(card.dividedNext)
		}
	}

	List<Card> updateLinks(List<Card> cards) {
		List<Card> dbCards = cards.collect { Card card ->
			Card dbCard = find(card)
			fillLinkedCards(card)
			update(dbCard.id, card.linkedPrevious, card.linkedNext)
		}
		return dbCards
	}

	Card updatePosition(Card card, boolean updateLinks) {
		Card dbCard = find(card)
		if (updateLinks) {
			fillLinkedCards(card)
			update(
				dbCard.id,
				card.day,
				card.mechanicCode,
				card.line,
				card.start,
				card.status,
				card.linkedPrevious,
				card.linkedNext
			)
		} else {
			update(dbCard.id, card.day, card.mechanicCode, card.line, card.start, card.status)
		}
	}

	List<Card> updateOrder(List<Card> cards) {
		List<Card> dbCards = cards.collect {
			Card dbCard = find(it)
			update(dbCard.id, it.day, it.mechanicCode, it.start, it.line, it.order, it.vehicle)
		}
		return dbCards
	}

	List<Card> updateDuration(List<Card> cards) {
		List<Card> dbCards = cards.collect {
			Card dbCard = find(it)
			update(dbCard.id, it.duration, it.start)
		}
		return dbCards
	}

	Card updateDividedTranslated(Serializable id, Card card, LocalTime start, int duration) {
		fillLinkedCards(card)
		fillDividedCard(card)
		update(id, start, duration, card.linkedPrevious, card.linkedNext, card.dividedPrevious, card.dividedNext)
	}

	List<Card> updateDivision(List<Card> cards) {
		Card savedCard = saveCard(cards[0])
		List<Card> dbCards = cards[1..-1].eachWithIndex { Card card, int i ->
			Card dbCard = find(card)
			updateDividedTranslated(dbCard.id, cards[i+1], cards[i+1].start, cards[i+1].duration)
		}
		return [savedCard] + dbCards
	}

	List<Card> updateDeleted(List<Card> cards) {
		LocalDate today = LocalDate.now()
		List<Card> dbCards = cards.collect { Card card ->
			Card dbCard = find(card.order.code, card.group.code, card.linkedIndex, card.divisionIndex, today)
			if (dbCard.linkedPrevious) {
				Card linkedPreviousDbCard = find(card.linkedPrevious)
				linkedPreviousDbCard.linkedNext = null
				updateLinkedNext(linkedPreviousDbCard.id, linkedPreviousDbCard.linkedNext)
			}
			if (dbCard.linkedNext) {
				Card linkedNextDbCard = find(card.linkedNext)
				linkedNextDbCard.linkedPrevious = null
				updateLinkedPrevious(linkedNextDbCard.id, linkedNextDbCard.linkedPrevious)
			}
			return dbCard
		}
		dbCards.each {
			update(it.id, LocalDateTime.now())
		}
		return dbCards
	}

	Number updateVehiclePosition(Card card, Card.VehiclePosition vehiclePosition) {
		Card dbCard = find(card)
		return save(dbCard.id, vehiclePosition)
	}

	Number updatePendingCall(Card card, boolean pendingCall) {
		Card dbCard = find(card)
		return update(dbCard.id, pendingCall)
	}

	Number updatePendingBudget(Card card, boolean pendingBudget) {
		Card dbCard = find(card)
		return updateBudget(dbCard.id, pendingBudget)
	}

	Card updateStatus(Card card, Card.Status status) {
		Card dbCard = find(card)
		return update(dbCard.id, status)
	}

}
