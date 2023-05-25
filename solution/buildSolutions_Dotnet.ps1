get-date
$BuildStartTime = $(get-date)
"Build DEBUG Solution"
dotnet "C:\Program Files\dotnet\sdk\6.0.408\MSBuild.dll" "FetchXmlDetailsList.Solution.cdsproj" /t:Rebuild
$elapsedTime = $(get-date) - $BuildStartTime
$buildTotalTime = "BUILD: {0:HH:mm:ss}" -f ([datetime]$elapsedTime.Ticks)
$buildTotalTime

$StartTime = $(get-date)
"Build RELEASE Solution"
dotnet "C:\Program Files\dotnet\sdk\6.0.408\MSBuild.dll" "FetchXmlDetailsList.Solution.cdsproj" /p:configuration=Release
$elapsedTime = $(get-date) - $StartTime
$pushTotalTime = "Total Build Time: {0:HH:mm:ss}" -f ([datetime]$elapsedTime.Ticks)
"--------------"
$buildTotalTime
$pushTotalTime
get-date
