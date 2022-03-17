// Requiring ObjectId from mongoose npm package
const ObjectId = require('mongoose').Types.ObjectId;

// Validator function
 module.exports.isValid = (id) => {
	
	if(ObjectId.isValid(id)){
		if((String)(new ObjectId(id)) === id)
			return true;		
		return false;
	}
	return false;
}




