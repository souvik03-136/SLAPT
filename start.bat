@echo off
echo Starting SLAPT...
docker compose -f docker-compose.release.yml pull
docker compose -f docker-compose.release.yml up -d
timeout /t 4 /nobreak > nul
start http://localhost
echo.
echo SLAPT is running at http://localhost
echo To stop: docker compose -f docker-compose.release.yml down
pause