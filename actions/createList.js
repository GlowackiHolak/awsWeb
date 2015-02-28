var util = require("util");
var helpers = require("../helpers");
var Policy = require("../s3post").Policy;
var S3Form = require("../s3post").S3Form;
var AWS_CONFIG_FILE = "config.json";
var POLICY_FILE = "policy.json";
var INDEX_TEMPLATE = "imageList.ejs";
var INDEX_TEMPLATE_OBJECT = "showImage.ejs";
var AWS = require('aws-sdk');

AWS.config.loadFromPath(AWS_CONFIG_FILE);
var s3 = new AWS.S3();
	
var task = function(request, callback){	
	
	var policyData = helpers.readJSONFile(POLICY_FILE);
	var policy = new Policy(policyData);
	
	var bucket_name = policy.getConditionValueByKey("bucket");
			
	param = {
		Bucket: bucket_name		
	};		
	
	s3.listObjects(param, function(err, data) {
		if (err) {
			console.log(err, err.stack);
		}
		else {
			console.log(data);
			callback(null, {template: INDEX_TEMPLATE, params:{obj: data.Contents, bucket: param.Bucket}});
		}
	});
	
}


exports.action = task;
