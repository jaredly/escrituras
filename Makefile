
full:
	cd app; cordova run

install:
	adb install -r app/platforms/android/ant-build/Escrituras-debug.apk

release:
	cd app; cordova build --release


