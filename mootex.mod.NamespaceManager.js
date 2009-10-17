//----------------------------------------------------
//
//  Author:    Peter Geil  (code@petergeil.name)
//  License:   BSD-style
//
//----------------------------------------------------
//  Copyright (c) 2009, Peter Geil
//----------------------------------------------------



var NamespaceManager = {
	
	/**
	 * Entrypoint for namespace objects
	 */
	namespaces: {},
	
	
	/**
	 * Embedded mootex.core.hash.GenerateFromPath
	 * for the sake of performance (200% gain!!)
	 * 
	 * @see mootex.core.hash.GenerateFromPath.js
	 *
	 */
	_generateFromPath: function(nsStr, includeToplevelReference) {
	 	
		if (!$chk(nsStr = nsStr.toString().trim())) return undefined;
		
	 	var splitted = nsStr.split("."),
			outermost = {},			// current structure reference
			tmp,					// ctrl variable
			innermost = outermost,	// ref to deepest obj
			ns;						// ctrl variable for ns segments
		
		while (ns = splitted.pop()) {
			tmp = {};
			tmp[ns] = outermost;
			outermost = tmp;	
		}
		
		return (!!includeToplevelReference) 
			? {	outer: outermost, inner: innermost } : a;
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
		
		// TODO: Have to assert that a property/class doesn't already exist (NS-Objects don't matter)
		//if (this.exists(nsStr)) {
			//throw new RangeError("NamespaceManager.declare: Namespace already declared");					
		//}
		 
		var nsObj = this._generateFromPath(nsStr, true);
		fn.call(nsObj.inner);
		Hash.combine(this.namespaces, nsObj.outer, true);
	},
	
	
	/**
	 * Takes a single or multiple namespace strings and "compiles" references 
	 * to their corresponding namespace objects into a new NamespaceConnector.
	 * 
	 * @method
	 * @param {String, Array} ns Dotted namespace strings to
	 * @returns {NamespaceConnector}  
	 */
	createConnector: function(ns) {
		var conn = {},
			namespaces = (([]).concat(ns)).filter(function(elem) {
				return this.exists(elem);
			}, this);
		
		namespaces.each(function(item, index) {
			Hash.combine(conn, this._getDirectReference(item), true);			
		}, this);
		
		return new NamespaceConnector(conn);
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
	 * contained namespace references to it. When called
	 * a single argument is passed -- a reference to
	 * this NSC. 
	 * 
	 * @method
	 * @param {Function} fn Function to which this 
	 * NamespaceConnector should expose his properties.
	 */
	shareWith: function(fn) {
		if (Function.type(fn)) fn.call(this, this);
	}
});

