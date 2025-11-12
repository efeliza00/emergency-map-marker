-- This is an empty migration.

SET GLOBAL event_scheduler = ON;

CREATE EVENT IF NOT EXISTS delete_old_emergencies
ON SCHEDULE EVERY 1 DAY
DO
  DELETE FROM EmergencyMarker
  WHERE createdAt < NOW() - INTERVAL 7 DAY;
