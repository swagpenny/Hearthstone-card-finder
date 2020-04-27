var multer = require('multer')
var path = require('path')
var fs = require('fs')
const customConfig = multer.diskStorage({
    destination: function (req, file, cb) {
        
      cb(null, ('./uploads'))
    },
    filename: function (req, file, cb) {
          
      cb(null, file.fieldname + Date.now() + '.jpg' )
        
    }
  })
 var upload = multer({storage: customConfig})
 

module.exports = upload;