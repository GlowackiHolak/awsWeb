var helpers = require("../helpers");
var Policy = require("../s3post").Policy;
var AWS_CONFIG_FILE = "config.json";
var POLICY_FILE = "policy.json";
var INDEX_TEMPLATE = "showImage.ejs";
var url = require('url');
var AWS = require('aws-sdk');


var task = function(request, callback){	
	
	var policyData = helpers.readJSONFile(POLICY_FILE);
	var policy = new Policy(policyData);
	
	var bucket_name = policy.getConditionValueByKey("bucket");
	
	AWS.config.loadFromPath(AWS_CONFIG_FILE);
	var s3 = new AWS.S3();
	var reqShowImage = request.url;
	
	
	var index = reqShowImage.lastIndexOf("/") + 1;
	var filename = reqShowImage.substr(index);


	
	params = {
		Bucket: bucket_name,
		Key: filename
	};		
		
	
	s3.getObject(params, function(err, data) {
		if (err) {
			console.log(err, err.stack);
			callback(null, {template: INDEX_TEMPLATE});
		}
		else {
			console.log(data);
			callback(null, {template: INDEX_TEMPLATE, params:{fields: data, params: params}});
		}
	});
	
}



exports.action = task;
