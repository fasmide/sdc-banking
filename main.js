/*
 * 
 * Example usage:
$(function() {
	Bank.login('cpr nummer', 'pinkode', 'aktiverings nummer', function(data) {
		console.log("Login:", data);
		
		Bank.agreement(data.agreements[0].agreementNo, function(data) {
			console.log("Agreement:", data);
			
			Bank.accounts(function(data) {
				console.log("Accounts:", data);

				Bank.accountsearch(data.accounts[2].id, '2012-07-26', '2012-08-26', function(data) {
					console.log("accountSearch:", data);

					Bank.logoff(function(data) {
						console.log("Logoff:",data);
					});
				});
			});			
		});
	});
});*/
var loggedIn = false;
$(function() {
	
	$('#loginBtn').click(handleLogin); 
	$('#accountInput').change(handleAccountSelection)
});
function handleAccountSelection() {
	if(!loggedIn) {
		return;
	}
	var accountId = $('#accountInput').val();
	var saldo = parseInt($('#accountInput :selected').data('saldo'), 10);
	$('#saldo').text((saldo/100).toFixed(2) + " DKK");
	$('#transactions').empty();
	var currentDate = new Date();
	var from = currentDate.getFullYear() + "-" + pad(currentDate.getMonth()) + "-" + currentDate.getDate();
	var to = currentDate.getFullYear() + "-" + pad((currentDate.getMonth()+1)) + "-" + currentDate.getDate();
	Bank.accountsearch(accountId, from, to, function(data) {
		console.log("accountSearch:", data);
		$(data.transactions).each(function(key, value) {
			var date = new Date(value.availableDate);
			$('#transactions').append("<tr><td>"+date.toDateString()+"</td><td>"+value.text+"</td><td>"+(value.amount/100).toFixed(2)+"</td><td>"+(value.balance/100).toFixed(2)+"</td></tr>");	
		});
		
	});
	
}
function handleLogin() {
	if(loggedIn) {
		Bank.logoff(function(data) {
			console.log("Logoff:",data);
			loggedIn = false;
			$('#accountInput').empty();
			$('#loginBtn').text('Log ind');
		});
		return;
	}
	Bank.login($('#cprInput').val(), $('#pinCodeInput').val(), $('#activationCodeInput').val(), function(data) {
		console.log("Login:", data);
		loggedIn = true;
		$('#loginBtn').text('Logoff');
		Bank.agreement(data.agreements[0].agreementNo, function(data) {
			console.log("Agreement:", data);

			Bank.accounts(function(data) {
				console.log("Accounts:", data);
				$(data.accounts).each(function(key, value) {
					$('#accountInput').append($('<option data-saldo="'+value.amount+'" value="'+value.id+'">'+value.id+' - '+value.ownName+'</option>'));
					
				});
				handleAccountSelection();
			});
		});
	});
}

function pad(number) {       
     return (number < 10 ? '0' : '') + number       
}