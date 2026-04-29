# Cleanup script for SMS project structure
# Run this script to remove redundant and unnecessary files

Write-Host "Starting cleanup..." -ForegroundColor Cyan

$itemsToRemove = @(
    "sms/.github",
    "sms/.vscode",
    "sms/.gitignore",
    "sms/HELP.md",
    "school-frontend/.gitignore",
    "sms.md"
)

foreach ($item in $itemsToRemove) {
    if (Test-Path $item) {
        Write-Host "Removing $item..."
        Remove-Item -Path $item -Recurse -Force
    } else {
        Write-Host "$item not found, skipping." -ForegroundColor Yellow
    }
}

Write-Host "Cleanup complete!" -ForegroundColor Green
