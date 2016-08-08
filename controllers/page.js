module.exports = {
  
    getHeaderType: function(req){
        var headerType = req.get('Content-Type');
        if(headerType == undefined){
            headerType = req.accepts('text/html');
        }
        else if(headerType.indexOf(',') != -1){
            headerType = headerType.split(",")[0];
        }
        return headerType;    
    },

    renderJson: function(req,res,next) {

    },

    renderHtml: function(req,res){

    }
};