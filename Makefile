
ARGS=-t [ reactify --es6 --everything --visitors jstransform/visitors/es6-destructuring-visitors ]

js:
	browserify ${ARGS} -d run.js -o www/build.js

watch:
	watchify -v ${ARGS} -d run.js -o www/build.js

serve:
	cd www; python -mSimpleHTTPServer 8004

get:
	scp aml:~/clone/escrituras/app/platforms/android/ant-build/Escrituras-debug.apk ./

full:
	cd app; cordova run

install:
	adb install -r app/platforms/android/ant-build/Escrituras-debug.apk

release:
	cd app; cordova build --release

