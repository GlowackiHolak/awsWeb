var INDEX_TEMPLATE = "delete.ejs";
var url = require('url');
var AWS = require('aws-sdk');
var POLICY_FILE = "policy.json";
var Policy = require("../s3post").Policy;
var helpers = require("../helpers");


var task = function(request, callback){				
	
	var s3 = new AWS.S3();
	
	var reqShowImage = request.url;		
	var index = reqShowImage.lastIndexOf("/") + 1;
	var filename = reqShowImage.substr(index);
		
	var policyData = helpers.readJSONFile(POLICY_FILE);
	var policy = new Policy(policyData);	
	var bucket_name = policy.getConditionValueByKey("bucket");
	
	params = {
		Bucket: bucket_name,
		Key: filename
	};		
	
	s3.deleteObject(params, function(err, data) {
		if (err) {			
			console.log(err, err.stack);
			callback(null, {template: INDEX_TEMPLATE});
		}
		else {
			console.log(data);
			callback(null, {template: INDEX_TEMPLATE, params:{data: params}});
		}
	});
	
}

exports.action = task;
