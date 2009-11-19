//----------------------------------------------------
//
//  Author:    Peter Geil  (code@petergeil.name)
//  License:   BSD-style
//
//----------------------------------------------------
//  Copyright (c) 2009, Peter Geil
//----------------------------------------------------



var Namespace = new Class({
	
	initialize: function(n) {
		this.name = n;
	},
		
	name: undefined,
	
	members: {},
	
	hasMember: function(name) {
		return (this.members[name] !== undefined);
	},
	
	subspaces: {},
	
	hasSubspace: function(name) {
		return (this.subspaces[name] !== undefined);
	}	
});

// Static type-checking method
Namespace.type = function(obj) {
	return obj instanceof this;
}

var NamespaceManager = {
	
	/**
	 * Entrypoint for namespace objects
	 */
	namespaces: new Namespace("ROOT"),
	
	
	/**
	 * Takes a namespace-string and -- when valid --
	 * creates the corresponding structure of 
	 * Namespace-objects. The return value is object
	 * consisting of three k/v-pairs, namely:
	 *   <b>outer:</b> Reference to the root namespace-object
	 *   <b>inner:</b> Reference to the innermost namespace-object
	 *   <b>nsChain:</b> Array of the parsed namespace elements
	 * 
	 * @method
	 * @param {String} nsStr Dotted namespace string
	 * @return {Object}
	 *
	 */
	_generateNsObjFromPath: function(nsStr) {
	 	
		if (!$chk(nsStr = nsStr.toString().trim())) return undefined;
						
	 	var	splitted = nsStr.split(".").erase(""),
			outermost = (!!splitted.length) // current structure reference
				? new Namespace(splitted.getLast()) : undefined,			
			tmp,					// ctrl variable
			innermost = outermost,	// ref to innermost obj
			ns;						// ctrl variable for ns segments
		
		
		for (var i = splitted.length - 2; i >= 0; i--) {
			ns = splitted[i];
			tmp = new Namespace(ns); 
			tmp.subspaces[outermost.name] = outermost;
			outermost = tmp;	
		}
		
		return { outer: outermost, inner: innermost, nsChain: splitted };
	},

	
	/**
	 * Takes a namespace object and integrates it into
	 * NamespaceManager's namespace tree. Existing members
	 * won't be overridden.
	 * 
	 * @method
	 * @param {Object} nsObj Object returned by <i>_generateNsObjFrompath</i>.
	 */
	_integrateNsObj: function(nsObj) {
		
		var	targetNs = this.namespaces,
			sourceNs = nsObj.outer,
			tmpName;
		
		for (var i = 0; i < nsObj.nsChain.length; i++) {
			
			tmpName = nsObj.nsChain[i];
			if (targetNs.hasSubspace(tmpName)) {
				// keeping target- & sourceNs on the same level
				targetNs = targetNs.subspaces[tmpName];
				sourceNs = (i == 0) ? sourceNs : sourceNs.subspaces[nsObj.nsChain[i]];
				continue;				
			}

			// subspace doesn't exist yet; comparing to
			// zero, because when a whole namespace string doesn't
			// exist yet, we can simply assign sourceNs to the ns root
			targetNs.subspaces[tmpName] = (i == 0) ? sourceNs : sourceNs.subspaces[nsObj.nsChain[i]];
			return;
		}
					
		Hash.each(sourceNs.members, function(value, key) {
			if (this[key] === undefined) this[key] = value;					
		}, targetNs.members);	 
	},
	
	
	/**
	 * Takes a <b>dotted namespace</b> string and -- when existing --
	 * returns a direct reference to its corresponding namespace object.
	 * 
	 * @method
	 * @private
	 * @param {String} nsStr Dotted namespace string of an namespace object
	 * @return {Object} When found, a reference to the ns-object; else undefined
	 */	
	_getDirectReference: function(nsStr) {
		
		var objRef = this.namespaces;
		
		// no argument automatically means roo-object
		if (!arguments.length) return objRef;
		 
		var splitted = nsStr.trim().split(".").erase("");			
		
		for (var i=0; i < splitted.length; i++) {
			
			if (objRef.hasSubspace(splitted[i])) {
				objRef = objRef.subspaces[splitted[i]];
				continue;
			}
			console.error("doens exist");
			// no "fallback" to root object
			// instead returning undefined
			return undefined;
		}
		
		return objRef;
	},
	
	
	/**
	 * Takes a <b>dotted namespace string</b> and checks wether
	 * an corresponding namespace object exists.
	 * 
	 * @method
	 * @param {String} ns The namespace string to check
	 * @return {Boolean}
	 */
	exists: function(ns) {
		return !!this._getDirectReference(ns.toString());
	},

	
	/**
	 * Declares a new namespace and embeds the stuff defined within <b>fn</b>
	 * into it. Within <b>fn</b> you define namespace citizens by declaring them 
	 * as public function properties. <i>(this.myProp = ...)</i>.<br><br>
	 * <b>NOTE:</b> Already existing namespace citizens are not overridden! When
	 * you have a namespace string and use him twice to declare two identically named
	 * citizens, the one being declared first will be embedded while the last one
	 * won't.
	 * 
	 * @method
	 * @param {String} nsStr Dotted namespace string
	 * @param {Function} fn Function whose public properties will be embedded into
	 * the namespace object 
	 */
	declare: function(nsStr, fn) {
		
		if (   !String.type(nsStr)
		    || !$chk(nsStr = nsStr.trim()) 
		    || !Function.type(fn)) 
		{
			throw new TypeError("NamespaceManager.declare: Invalid arguments");
		}
		 
		var nsObj = this._generateNsObjFromPath(nsStr);
		
		fn.call(nsObj.inner.members);
		
		// TODO: Have to assert that a property/class doesn't already exist (NS-Objects don't matter)
		this._integrateNsObj(nsObj);
	},
	
	
	/**
	 * Takes a single or multiple namespace strings and "compiles" references 
	 * to their corresponding namespace objects into a new NamespaceConnector.
	 * 
	 * @method
	 * @param {String, Array} ns Dotted namespace strings to
	 * @returns {NamespaceConnector}  
	 */
	createConnector: function() {

		var conn = {},
			nsList = [];
		
		for (var i = 0, a; i < arguments.length; i++) {
			a = arguments[i].toString();
			if (this.exists(a)) {
				nsList.push(a);
			}
		}
		
		var e;
		nsList.each(function(item, index) {			
			e = this._getDirectReference(item);
			Hash.combine(conn, e.members, false, false);			
		}, this);
					
		return ($defined(e)) 
			? new NamespaceConnector(conn) 
			: undefined;
	}
};

// Hooking up some handy aliases
var	$NSM = NamespaceManager,
	$connect = NamespaceManager.createConnector.bind(NamespaceManager),
	$declare = NamespaceManager.declare.bind(NamespaceManager);
	 

/**
 * NamespaceConnector is used to decorate
 * a pre-populated namespace object with 
 * additional namespace-specific behaviour.
 * 
 * @pattern Decorator
 * @constructor
 * @param {Object} obj Pre-populated namespace object that gets wrapped
 */
var NamespaceConnector = new Class({
	
	initialize: function(obj) {		
		Hash.combine(this, obj, false, true);
	},
	
	/**
	 * Takes a function as argument and exposes the
	 * contained namespace members to it. When called,
	 * the function is executed within the prepopulated
	 * scope of this method and a single argument is 
	 * passed -- a reference to this NSC. 
	 * 
	 * @method
	 * @param {Function} fn Function to which this 
	 * NamespaceConnector should expose his properties.
	 */
	shareWith: function(_fn) {
		
		if (!Function.type(_fn)) return;
		
		var _validKeys = [];
		
		var _k;
		for (_k in this) {
			if (   this.hasOwnProperty(_k) 
				&& ["_current", "caller"].indexOf(_k) == -1)
			{
				_validKeys.push(_k);
			}
		}
		
		for (var _i=0, _tmpObj; _i < _validKeys.length; _i++) {
			_tmpObj = this[_validKeys[_i]];
						
			// IE-specific
			if (Browser.Engine.trident) {
				window.eval("var " + _validKeys[_i] + "  = _tmpObj");
			}
			// Other UAs
			else {
				eval("var " + _validKeys[_i] + " = _tmpObj;");
			}
		}
		
		// Depending on the user-agent the passed
		// function is converted into raw code
		// and evaluated immediately => breaks
		// the lexical scope 
		if (Browser.Engine.trident) {
			// Workaround for IE >= 6
			window.eval("_fn = " + _fn);
		}
		else if (Browser.Engine.gecko){
			// Works for FF
			_fn = eval("(" + _fn.toSource() + ")");
		}
		else {
			// Safari >= 4
			_fn = eval("(" + _fn.toString() + ")");
		}		
		
		// Cleaning up the local scope
		delete _validKeys,
			   _tmpObj, 
			   _k, 
			   _i;
		
		// Finally calling the passed function
		_fn(this);		
	},
	
	/**
	 * The previous version of "shareWith".
	 * Instead of prepopulating its local scope,
	 * the passed function is bound to this NSC-instance
	 * and a reference to it is passed.
	 * 
	 * So shared namespace members can be accessed in
	 * two ways, namely:
	 * 
	 * 1) with a prepend "this" (e.g. this.MyClass ...)
	 * 2) by naming the passed argument (e.g. 
	 *    function (ns) { var foo = new ns.MyClass(); }
	 * 
	 */
	shareWith2: function(fn) {
		if (Function.type(fn)) fn.call(this, this);
	}
});



