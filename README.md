[![Build Status](https://travis-ci.org/benschw/s3-artifacts.svg?branch=master)](https://travis-ci.org/benschw/s3-artifacts)

`s3-artifacts` is a static website that can be installed in your aws S3 bucket to
list artifacts you publish to that same bucket in a user friendly UI.



Take a look at it in action at [dl.fligl.io](http://dl.fligl.io/) and click through to one of the projects
to see how to configure a TravisCI build to automatically publish to your bucket.


## Create a bucket
- `dl.fligl.io`


## Edit Permissions

- grant "List" to "Everyone"
- edit bucket policy:

<!-- br -->

	{
		"Version": "2008-10-17",
		"Statement": [
			{
				"Sid": "AllowPublicRead",
				"Effect": "Allow",
				"Principal": {
					"AWS": "*"
				},
				"Action": "s3:GetObject",
				"Resource": "arn:aws:s3:::dl.fligl.io/*"
			}
		]
	}

- edit CORS configuration

<!-- br -->

	<?xml version="1.0" encoding="UTF-8"?>
	<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
	    <CORSRule>
	        <AllowedOrigin>*</AllowedOrigin>
	        <AllowedMethod>GET</AllowedMethod>
	        <AllowedHeader>*</AllowedHeader>
	    </CORSRule>
	</CORSConfiguration>

- enable website hosting and set `index.html` as the index and error document


## Add Web Assets

- upload the contents of httpdocs to the bucket:

<!-- br -->

	aws s3 cp httpdocs s3://dl.fligl.io/ --recursive --sse




_idea/technique from [Francesco Pasqualini's s3 bucket listing (GPL v2)](https://aws.amazon.com/code/Amazon-S3/1713)_
