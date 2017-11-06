// Should be added to /config/secret.js


var config = {
	production: {
		session: {
			secret: 'qlsxjpbnwcpixlsmwdzmttrvksmgrc'
		},
		database: 'mongodb://dev_user:WjtWtZzkMZw9hzJuiNiz@ds231315.mlab.com:31315/skilltree',
		googleAuth : {
	        clientID      : '893921223365-s3unofcrfa43vapco7b33r8glbiu03qu.apps.googleusercontent.com',
	        clientSecret  : '0XTK4QmBsdGNI56wjLWjZM01',
	        callbackURL   : 'http://aaltoskilltree.herokuapp.com/auth/google/callback/'
    	}
	},
	default: {
		session: {
			secret: 'qlsxjpbnwcpixlsmwdzmttrvksmgrc'
		},
		database: 'mongodb://dev_user:WjtWtZzkMZw9hzJuiNiz@ds231315.mlab.com:31315/skilltree',
		googleAuth : {
	        clientID      : '893921223365-s3unofcrfa43vapco7b33r8glbiu03qu.apps.googleusercontent.com',
	        clientSecret  : '0XTK4QmBsdGNI56wjLWjZM01',
	        callbackURL   : 'http://localhost:8081/auth/google/callback'
    	}
	}
}

exports.get = function get(env) {
  return config[env] || config.default;
}