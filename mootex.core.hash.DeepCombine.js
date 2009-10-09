
Hash.implement({
	
	/**
	 * Combines this Hash with the key-value pairs of the object passed in. 
	 * Does not allow duplicates (old values are not overwritten by new 
	 * ones) and is case and type sensitive.
	 * 
	 * @author Peter Geil, MooTools Developers
	 * 
	 * @memberOf {Hash}
	 * @alias Hash.combine
	 * @alias $H.combine
	 * @param {Object} properties Object whose k/v-pairs should be combined
	 * @param {Boolean} deep When TRUE also k/v-pairs of nested Objects are 
	 * combined (referred to as <b>deep</b>). When FALSE or ommited, the default 
	 * implementation of <b>Hash.combine</b> is used.
	 */
	combine: function(properties, deep) {
	 	
		var fnCallee = arguments.callee;
		
		var	fnShallow = function(value, key) {		
			Hash.include(this, key, value);     	 
		};
		
		var	fnDeep = function(value, key) {
			if (	value.constructor.name === "Object"
				&&	this.hasOwnProperty(key)
				&&	this[key].constructor.name === "Object") 
			{
				// starting recursion
				fnCallee.call(this[key], value, true);
				return;
			}			
			Hash.include(this, key, value);     	 
		};
					
		Hash.each(properties || {}, ((!!deep) ? fnDeep : fnShallow), this);	 

		return this;
	}	 
});