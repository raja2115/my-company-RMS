# 1. Grant permissions to D:\new project and copy files
Write-Host "Setting up permissions for D:\new project..." -ForegroundColor Cyan
icacls "D:\new project" /grant Everyone:`(OI`)`(CI`)F /T /C

Write-Host "Copying files to D:\new project..." -ForegroundColor Cyan
Copy-Item -Path "D:\tmp\rms-website\*" -Destination "D:\new project\" -Recurse -Force

# 2. Add domain mapping in hosts file
$hostsPath = "$env:windir\System32\drivers\etc\hosts"
$domain1 = "rmsmultitech.com"
$domain2 = "www.rmsmultitech.com"
$ip = "127.0.0.1"
$entry1 = "$ip $domain1"
$entry2 = "$ip $domain2"

Write-Host "Checking hosts file mapping..." -ForegroundColor Cyan
$content = Get-Content $hostsPath -Raw
$updated = $false

if ($content -notlike "*$domain1*") {
    Add-Content $hostsPath "`r`n$entry1"
    Write-Host "Added $domain1 to hosts file." -ForegroundColor Green
    $updated = $true
} else {
    Write-Host "$domain1 is already in hosts file." -ForegroundColor Yellow
}

if ($content -notlike "*$domain2*") {
    Add-Content $hostsPath "`r`n$entry2"
    Write-Host "Added $domain2 to hosts file." -ForegroundColor Green
    $updated = $true
} else {
    Write-Host "$domain2 is already in hosts file." -ForegroundColor Yellow
}

if ($updated) {
    Write-Host "Flushing DNS cache..." -ForegroundColor Cyan
    ipconfig /flushdns
}

Write-Host "Setup completed successfully!" -ForegroundColor Green
Start-Sleep -Seconds 3
