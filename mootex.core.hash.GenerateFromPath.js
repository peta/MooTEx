
Hash.implement({
	
	/**

	 * @author Peter Geil
	 * 
	 * @memberOf {Hash}
	 * @alias Hash.generateFromPath
	 * @alias $H.generateFromPath
	 * @return {Object}
	 * @param {String} nsString Path usign the dotted namespace convention
	 * @param {Boolean} includeInnerReference When TRUE, the returned object has
	 * two keys -- "outer" references to the whole structure and "inner" references
	 * to the innermost (deepest) object.
	 */
	generateFromPath: function(nsStr, includeToplevelReference) {
	 	
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
	}	 
});