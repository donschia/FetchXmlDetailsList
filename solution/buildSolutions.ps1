get-date
$BuildStartTime = $(get-date)
# "INITIAL MSBUILD SETUP"
# & "C:\Program Files (x86)\Microsoft Visual Studio\2019\Enterprise\MSBuild\Current\Bin\msbuild" /t:build /restore
# Find MSBuild automatically
$msbuild = & "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe" -latest -requires Microsoft.Component.MSBuild -find MSBuild\**\Bin\MSBuild.exe | Select-Object -First 1

if (-not $msbuild) {
    Write-Error "MSBuild not found!"
    exit 1
}

#"Restoring NuGet packages"
#& $msbuild /t:restore

"Building DEBUG Solution"
& $msbuild

"Building RELEASE Solution"
& $msbuild /p:configuration=Release

$elapsedTime = $(get-date) - $BuildStartTime
$buildTotalTime = "BUILD ALL SOLUTIONS: {0:HH:mm:ss}" -f ([datetime]$elapsedTime.Ticks)
$buildTotalTime