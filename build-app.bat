@echo off
echo [1/4] Building Vite Web Application...
cd client
call npm run build

echo [2/4] Syncing assets with Capacitor...
call npx cap sync android

echo [3/4] Adjusting Java compatibility options...
powershell -Command "(Get-Content android\app\capacitor.build.gradle) -replace 'VERSION_21', 'VERSION_17' | Set-Content android\app\capacitor.build.gradle"

echo [4/4] Compiling Android APK via Gradle...
cd android
call gradlew.bat assembleDebug
echo APK build complete!
