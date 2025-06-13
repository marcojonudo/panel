package panel.pogos.schedules

class JobPosition {

	int code
	String name
	JobPositionGroup jobPositionGroup
	Authority roleAuthority

	enum Authority {

		ROLE_ADMIN,
		ROLE_HIGH_AUTHORITY,
		ROLE_MEDIUM_AUTHORITY,
		ROLE_LOW_AUTHORITY,
		ROLE_DEFAULT

	}

}
