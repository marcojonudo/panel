import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Constants} from "../objects/constants";
import {RealTimeService} from "../services/real-time.service";

@Injectable({
	providedIn: 'root'
})
export class SessionIdInterceptor implements HttpInterceptor {

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (this.triggerRealTimeUpdate(req.url)) {
			const sessionId = RealTimeService.sessionId;
			req = req.clone({
				setHeaders: {
					sessionId: sessionId
				}
			});
		}
		return next.handle(req);
	}

	triggerRealTimeUpdate(url: string): boolean {
		return Constants.REAL_TIME_UPDATE_PATHS.find(path => url.includes(path)) != undefined
	}

}
