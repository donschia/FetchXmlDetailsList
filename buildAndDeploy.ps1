get-date
$BuildStartTime = $(get-date)
npm run build
$elapsedTime = $(get-date) - $BuildStartTime
$buildTotalTime = "BUILD: {0:HH:mm:ss}" -f ([datetime]$elapsedTime.Ticks)
$buildTotalTime

$StartTime = $(get-date)
pac pcf push --publisher-prefix schiavone
$elapsedTime = $(get-date) - $StartTime
$pushTotalTime = "PCF PCF PUSH: {0:HH:mm:ss}" -f ([datetime]$elapsedTime.Ticks)

"--------------"
$buildTotalTime
$pushTotalTime
get-date
