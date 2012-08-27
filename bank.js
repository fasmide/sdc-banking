var Bank = {
	EndPoint: "https://b.sdc.dk/sdc-mobile-bank/9380/app/2/",
	lastestNonce: null,
	activationCode: null,
	getNonce: function(callback) {
		var self = this;
		$.get(this.EndPoint + "noncegenerator.json", function(data) {
			self.lastestNonce = data.nonce;
			callback(data);
		});
	},
	login: function(cpr, pinkode, activationCode, callback) {
		var self = this;
		this.activationCode = activationCode;
		if(!this.lastestNonce) {
			this.getNonce(function() {
				self.login(cpr, pinkode, activationCode, callback);
				
			});
			return;
		}
		
		$.post(this.EndPoint + "login.json", {'hashnonce': this.generateHash(activationCode), 'username': cpr, 'password': pinkode}, function(data) {
			self.lastestNonce = data.nonce;
			callback(data);
		});
		
	},
	agreement: function(agreement, callback) {
		var self = this;
		$.post(this.EndPoint + "agreement.json", {'hashnonce':this.generateHash(this.activationCode), 'agreement_no': agreement}, function(data) {
			self.lastestNonce = data.nonce;
			callback(data);
		});	
	},
	accounts: function(callback) {
		var self = this;
		$.post(this.EndPoint + "accounts.json", {'hashnonce':this.generateHash(this.activationCode)}, function(data) {
			self.lastestNonce = data.nonce;
			callback(data);
		});
	},
	accountsearch: function(accountNo, fromDate, toDate, callback) {
		var self = this;
		var request = {
			'hashnonce':this.generateHash(this.activationCode),
			'account_no':accountNo,
			'from': fromDate,
			'to': toDate
		};
		$.post(this.EndPoint + "accountsearch.json", request, function(data) {
			self.lastestNonce = data.nonce;
			callback(data);
		});
		
	},
	logoff: function(callback) {
		var self = this;
		$.post(this.EndPoint + "logoff.json", {'hashnonce':this.generateHash(this.activationCode)}, function(data) {
			self.lastestNonce = null,
			callback(data);
		});	
	},
	generateHash: function(activationCode) {
		return SHA1(this.lastestNonce + ":" + activationCode);
	}
}