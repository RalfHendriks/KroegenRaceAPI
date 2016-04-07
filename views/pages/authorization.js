var auth = function() {};
    
    auth.prototype.validAction = function(obj){
        if(obj !== undefined){
            switch(obj.role) {
                case 'admin':
                    return '1';
                case 'user':
                    return '2';
                default:
                    return '0';
            }      
        }
        return '0';
    }

module.exports = auth;