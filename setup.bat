@echo off
title RMS Website Setup Helper
echo ===================================================
echo   RMS MultiTech Website Setup & Custom Domain Utility
echo ===================================================
echo.
echo This script will request administrative privileges to:
echo 1. Set up write permissions for "D:\new project".
echo 2. Copy the website files to "D:\new project".
echo 3. Add "rmsmultitech.com" to your Windows hosts file.
echo.
echo Please click "Yes" on the UAC elevation prompt.
echo.
pause

powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process powershell -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File \"D:\tmp\rms-website\setup.ps1\"' -Verb RunAs -Wait"

echo.
echo ===================================================
echo Done! The setup was completed.
echo Please check your VS Code workspace (D:\new project).
echo ===================================================
echo.
pause
