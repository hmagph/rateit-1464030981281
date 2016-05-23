module.exports = function (app, todoDb) {

	//Functions =============================================================
	
  function getTodos(res, from) {
	  
	  var listOfTracks = require('../config.json');
	  
	  if (from == "file") {
//		  console.log("listOfTracks = " + JSON.stringify(listOfTracks) );
		  res.send(listOfTracks.map(function (row) {
              return row;
		  }));
	
	  } else {
		    
    todoDb.list(
    		{
    			include_docs: true,
    			"fields": [
    			           "docs"
    			         ]
    				
    		}, function (err, body) {
      if (err) {
        res.status(500).send({
          error: err
        });
      } else {
    	  	  
    	   var newBody = [];
    	   newBody[0] = listOfTracks;
    	   newBody[1] = [];
    	   newBody[2] = [];
    	   var j =0;
    	   console.log("\n\nBody rows doc rates 0= " + JSON.stringify(body.rows[0].doc.rates) );
    	   for (var i=0; i< body.rows.length; i++) {
    		   if (body.rows[i] != null) {
    			   if (body.rows[i].doc != null) {
    				   if (body.rows[i].doc.type=="eventrating") { 
    					   console.log("\n\nBody docs = " + JSON.stringify(body.rows[i].doc));
    					   newBody[1][j]=body.rows[i].doc.rates;
    					   console.log("\n\nBody elements = " + JSON.stringify(newBody[1][j]));
    					   for (var k=0; k<listOfTracks.length; k++) {
    						   newBody[2][k] = body.rows[i].doc.rates[listOfTracks[k]];
    					   }
    					   j++;
    				   }
    			   }
    		   }
    	   }
       	   console.log("\n\nBody = " + JSON.stringify(newBody[1]) );
    	   console.log("\n\nlistOfTracks = " + JSON.stringify(newBody[0]) );
    	   console.log("\n\nlistOfRates = " + JSON.stringify(newBody[2]) );
    	   res.send (newBody[1]);
    	   
//    		res.send(newBody.map(function (row) {
//        	    if (row) {
//                   return row;
//        	    }
//            }
//    		));
      }
    });
	  }
  }

  // api ---------------------------------------------------------------------
  // get all todos
  app.get('/api/todos', function (req, res) {
    getTodos(res, "file");
  });
  
  app.get('/report', function (req, res) {
	  console.log("report res = " + JSON.stringify(res.body));   
	  console.log("report req = " + JSON.stringify(req.body)); 
	    getTodos(res, "db");
  });
  // ------------------------------------------------
  

  require ('stringify-object'); 
  
  // create feedback and send back all feedbacks after creation
  app.put('/api/todostest', function (req, res) {
     
      todoDb.insert({
        type: "testeventrating",
        rates: req.body,
        done: false
      }, function (err, todo) {
        if (err) {
          res.status(500).send({
            error: err
          });
        } else {
          getTodos(res);
        }
      });
  });
  
  // create todo and send back all todos after creation
  app.put('/api/todos', function (req, res) {
           
    todoDb.insert({
      type: "eventrating",
      rates: req.body,
      done: false
    }, function (err, todo) {
      if (err) {
        res.status(500).send({
          error: err
        });
      } else {
        getTodos(res);
      }
    });
  });

  // delete a todo
  app.delete('/api/todos/:id', function (req, res) {
    todoDb.destroy(req.params.id, req.query.rev, function (err, body) {
      if (err) {
        res.status(500).send({
          error: err
        });
      } else {
        getTodos(res);
      }
    });
  });

};
