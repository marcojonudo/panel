import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {LocalStorageService} from "../services/local-storage.service";
import {Constants} from "../objects/constants";
import {RealTimeService} from "../services/real-time.service";

@Injectable({
	providedIn: 'root'
})
export class SessionIdInterceptor implements HttpInterceptor {

	constructor(
		private localStorageService: LocalStorageService,
		private realTimeService: RealTimeService
	) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (req.url.includes(Constants.CARDS_PATH)) {
			const sessionId = this.realTimeService.sessionId;
			req = req.clone({
				setHeaders: {
					sessionId: sessionId
				}
			});
		}
		return next.handle(req);
	}

}
