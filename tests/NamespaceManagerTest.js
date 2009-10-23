//----------------------------------------------------
//
//  Author:		Peter Geil	(code@petergeil.name)
//  License:	BSD-style
//
//----------------------------------------------------
//  Copyright (c) 2009, Peter Geil
//----------------------------------------------------




// Performance tests (Requires Firebug)
function NamespaceManagerTest() {	
	this.testNs = [
		"com.example",
		"com.example.MyApp",
		"com.example.MyApp.Model",
		"com.example.MyApp.Model.Adress.Simple",
		"com.example.MyApp.Model.Adress.Simple.Person",
		"com.example.MyApp.Model.Adress.Simple.Person.Dunno",
		"tld.here.we",
		"tld.here.we.go"
	];
	
	console.profile("declare() with Function")
	this.testNs.each(function(elem) {
		console.log(elem);
		NamespaceManager.declare(elem, function() {
			this.el = elem;
			
			this.Console = new Class({		
				privMember: "value",	
				initialize: function(arg1, arg2) {},
				someMethod: function(arg1) {}	
			});
			this.Connector = new Class({		
				privMember: "value",	
				initialize: function(arg1, arg2) {},
				someMethod: function(arg1) {}	
			});
			this.Database = new Class({		
				privMember: "value",	
				initialize: function(arg1, arg2) {},
				someMethod: function(arg1) {}	
			});
			this.Controller = new Class({		
				privMember: "value",	
				initialize: function(arg1, arg2) {},
				someMethod: function(arg1) {}	
			});
			this.Display = new Class({		
				privMember: "value",	
				initialize: function(arg1, arg2) {},
				someMethod: function(arg1) {},	
				someMethod1: function(arg1) {},	
				someMethod2: function(arg1) {},	
				someMethod3: function(arg1) {},	
				someMethod4: function(arg1) {},	
				someMethod5: function(arg1) {},	
				someMethod6: function(arg1) {},	
				someMethod7: function(arg1) {},	
				someMethod8: function(arg1) {},	
				someMethod9: function(arg1) {}
			});
			
		});
	});	
	console.profileEnd(); 
}


