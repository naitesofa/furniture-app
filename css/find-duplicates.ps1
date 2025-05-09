# 查找CSS文件中的重复定义
$cssFile = "crowdfunding-detail.css"

Write-Host "===== 检查客服按钮样式 ====="
Select-String -Path $cssFile -Pattern "\.customer-service|\.cs-btn" | ForEach-Object {
    Write-Host $_.LineNumber ":" $_.Line
}

Write-Host ""
Write-Host "===== 检查收藏按钮样式 ====="
Select-String -Path $cssFile -Pattern "\.favorite-container|\.favorite-btn" | ForEach-Object {
    Write-Host $_.LineNumber ":" $_.Line
}

Write-Host ""
Write-Host "===== 检查分享按钮样式 ====="
Select-String -Path $cssFile -Pattern "\.share-container" | ForEach-Object {
    Write-Host $_.LineNumber ":" $_.Line
}

Write-Host ""
Write-Host "===== 检查操作栏新样式 ====="
Select-String -Path $cssFile -Pattern "\.action-bar|\.action-item|\.action-btn" | ForEach-Object {
    Write-Host $_.LineNumber ":" $_.Line
} 