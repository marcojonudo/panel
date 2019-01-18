package panel.services

import groovy.transform.CompileStatic
import org.grails.orm.hibernate.HibernateDatastore
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
@CompileStatic
class PanelService {

	private final HibernateDatastore hibernateDatastore

	@Inject
	PanelService(HibernateDatastore hibernateDatastore) {
		this.hibernateDatastore = hibernateDatastore
	}

	void test() {
	}

}
