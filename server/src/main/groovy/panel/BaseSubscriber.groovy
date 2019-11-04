package panel

import org.reactivestreams.Subscriber
import org.reactivestreams.Subscription

class BaseSubscriber implements Subscriber<Object> {

	private Subscription subscription;

	@Override
	public void onSubscribe(Subscription subscription) {
		System.out.println("New Subscriber");
		this.subscription = subscription;
		subscription.request(1);
	}

	@Override
	public void onNext(Object o) {
		System.out.println("Got : " + o);
		subscription.request(1);
	}

	@Override
	public void onError(Throwable throwable) {
		throwable.printStackTrace();
	}

	@Override
	public void onComplete() {
		System.out.println("Complete.");
	}
}