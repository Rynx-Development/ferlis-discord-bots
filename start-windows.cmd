@echo off
cd /d "%~dp0"
node --env-file=.env src/main.js
pause
