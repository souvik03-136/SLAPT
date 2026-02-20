#!/bin/bash
echo "Starting SLAPT..."
docker compose -f docker-compose.release.yml pull
docker compose -f docker-compose.release.yml up -d
sleep 4
if command -v xdg-open &> /dev/null; then
  xdg-open http://localhost
elif command -v open &> /dev/null; then
  open http://localhost
fi
echo ""
echo "SLAPT is running at http://localhost"
echo "To stop: docker compose -f docker-compose.release.yml down"