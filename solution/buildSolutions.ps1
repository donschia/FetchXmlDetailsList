# TODO: Still looking for an easier way to get to MSBUILD without hardcoding the path like this...
# Also trying to avoid having to change the host PC's path variable as that's not super portable
get-date
$BuildStartTime = $(get-date)
# "INITIAL MSBUILD SETUP"
# & "C:\Program Files (x86)\Microsoft Visual Studio\2019\Enterprise\MSBuild\Current\Bin\msbuild" /t:build /restore
"Building DEBUG Solution"
& "C:\Program Files (x86)\Microsoft Visual Studio\2019\Enterprise\MSBuild\Current\Bin\msbuild"
"Building RELEASE Solution"
& "C:\Program Files (x86)\Microsoft Visual Studio\2019\Enterprise\MSBuild\Current\Bin\msbuild" /p:configuration=Release

$elapsedTime = $(get-date) - $BuildStartTime
$buildTotalTime = "BUILD ALL SOLUTIONS: {0:HH:mm:ss}" -f ([datetime]$elapsedTime.Ticks)
$buildTotalTime