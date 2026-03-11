# Read version from Solution.xml
[xml]$solutionXml = Get-Content "solution\src\Other\Solution.xml"
$version = $solutionXml.ImportExportXml.SolutionManifest.Version

Write-Host "Syncing version: $version" -ForegroundColor Green

# Update package.json
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
$packageJson.version = $version
$packageJson | ConvertTo-Json -Depth 100 | Set-Content "package.json"

# Update ControlManifest.Input.xml
[xml]$manifest = Get-Content "src\ControlManifest.Input.xml"
$manifest.manifest.control.version = $version
$manifest.Save("$PWD\src\ControlManifest.Input.xml")

Write-Host "Version synced to $version successfully!" -ForegroundColor Green