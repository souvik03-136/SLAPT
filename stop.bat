@echo off
docker compose -f docker-compose.release.yml down
echo SLAPT stopped.
pause