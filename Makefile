default: build

clean:
	rm -rf build

build: clean
	mkdir -p build
	cp src/* build/

publish:
	AWS_DEFAULT_REGION='us-east-1' aws s3 cp build s3://dl.fligl.io/ --recursive --sse
