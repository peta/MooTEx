//----------------------------------------------------
//
//  Author:		Peter Geil	(code@petergeil.name)
//  License:	BSD-style
//
//----------------------------------------------------
//  Copyright (c) 2009, Peter Geil
//----------------------------------------------------




var NamespaceManager = {
	
	// Entrypoint for namespaces objects
	namespaces: {}
	
	// Embedded mootex.core.hash.GenerateFromPath
	// for the sake of performance (200% gain!!)
	_generateFromPath: function(nsStr, includeToplevelReference) {
	 	
		if (!$chk(nsStr = nsStr.toString().trim())) return undefined;
		
	 	var splitted = nsStr.split("."),
			a = {},		// current structure reference
			b,			// ctrl variable
			innermost = a,	// ref to deepest obj
			ns;			// ctrl variable for ns segments
		
		while (ns = splitted.pop()) {
			b = {};
			b[ns] = a;
			a = b;	
		}
		
		return (!!includeToplevelReference) 
			? {	outer: a, inner: innermost } : a;
	},
		
	getDirectAccess: function(nsStr) {
		
		var objRef = this.namespaces;
		
		// no argument automatically means root 
		// object (= NamespaceManager.namespaces)
		if (!arguments.length) return objRef;
		 
		var splitted = nsStr.trim().split(".");			
		
		for (var i=0; i < splitted.length; i++) {
			if (splitted[i] in objRef) {
				objRef = objRef[splitted[i]];
				continue;
			}
			// no "fallback" to root object
			// instead returning undefined
			return undefined;
		}
		
		return objRef;
	},
	
	
	exists: function(ns) {
		return !!this.getDirectAccess(ns.toString());
	},


	declare: function(nsStr, fn) {
		
		if (	!String.type(nsStr)
			||	!$chk(nsStr = nsStr.trim()) 
			||	!Function.type(fn)) 
		{
			throw new TypeError("NamespaceManager.declare: Invalid arguments");
		}
		
		// TODO: Have to assert that a property/class doesn't already exist (NS-Objects don't matter)
		//if (this.exists(nsStr)) {
			//throw new RangeError("NamespaceManager.declare: Namespace already declared");					
		//}
		 
		var nsObj = this.generateFromPath(nsStr, true);
		fn.call(nsObj.inner);
		Hash.combine(this.namespaces, nsObj.outer, true);
	},
	
	createConnection: function(ns) {
		var conn = {},
			namespaces = (([]).concat(ns)).filter(function(elem) {
				return this.exists(elem);
			}, this);
		
		namespaces.each(function(item, index) {
			Hash.combine(conn, this.getDirectAccess(item), true);			
		}, this);
		
		return new NamespaceConnection(conn);
	}
};

// Hooking up some handy aliases
var $NSM = NamespaceManager,
	$connect = NamespaceManager.createConnection.bind(NamespaceManager),
	$declare = NamespaceManager.declare.bind(NamespaceManager);
	 

/**
 * NamespaceConnection is used to decorate
 * a pre-populated namespace object with 
 * additional namespace-specific behaviour.
 * 
 * @pattern Decorator
 * @constructor
 * @alias NamespaceConnection
 * @param {Object} obj Pre-populated namespace object that gets wrapped
 */
var NamespaceConnection = new Class({
	
	initialize: function(obj) {		
		Hash.combine(this, obj, false, true);
	},
	
	/**
	 * Takes a function as argument and shares this
	 * NamespaceConnection with it. When called a
	 * single argument is passed -- a reference to
	 * this NSC. 
	 * 
	 * @method
	 * @param {Function} fn Function with which this 
	 * NamespaceConnection should be shared.
	 */
	shareWith: function(fn) {
		if (Function.type(fn)) fn.call(this, this);
	}
});




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
		NamespaceManager.declare(elem, function() {
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
			
			console.log(document);
		});
	});	
	console.profileEnd(); 
}

	

	

