package panel.sockets

import groovy.transform.CompileStatic
import io.micronaut.websocket.WebSocketBroadcaster
import io.micronaut.websocket.WebSocketSession
import io.micronaut.websocket.annotation.OnClose
import io.micronaut.websocket.annotation.OnMessage
import io.micronaut.websocket.annotation.OnOpen
import io.micronaut.websocket.annotation.ServerWebSocket
import org.reactivestreams.Publisher

import java.util.function.Predicate

@CompileStatic
@ServerWebSocket("/ws/cards/{topic}/{username}")
class CardsWebSocket {

	private final WebSocketBroadcaster broadcaster
	private List<WebSocketSession> sessions

	CardsWebSocket(WebSocketBroadcaster broadcaster) {
		this.broadcaster = broadcaster
		this.sessions = []
	}


	@OnOpen
	void onOpen(String topic, String username, WebSocketSession session) {
//		String msg = "[" + username + "] Joined!"
		println("Nuevo usuario conectado: $username")
		sessions << session
//		return null//broadcaster.broadcast(msg, isValid(topic))
	}

	@OnMessage
	Publisher<String> onMessage(
			String topic,
			String username,
			String message,
			WebSocketSession session) {
//		String msg = "[" + username + "] " + message
		return broadcaster.broadcast((String) "[$username] Message $message", isValid(session))
	}

	@OnClose
	Publisher<String> onClose(
			WebSocketSession session) {
//		String msg = "[" + username + "] Disconnected!"
		return null//broadcaster.broadcast(msg, isValid(topic))
	}

	private Predicate<WebSocketSession> isValid(WebS) {
		return new Predicate<WebSocketSession>() {

			@Override
			boolean test(WebSocketSession entries) {
				return true
			}
		}
	}

}
