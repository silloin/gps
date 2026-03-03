```
+----------------+      +----------------+      +----------------+
|      User      |      |      Run       |      |      Tile      |
+----------------+      +----------------+      +----------------+
| - _id          |      | - _id          |      | - _id          |
| - username     |      | - user (ref)   |      | - owner (ref)  |
| - email        |      | - distance     |      | - timestamp    |
| - password     |      | - duration     |      | - areaValue    |
| - totalDistance|      | - avgPace      |      | - zone (ref)   |
| - totalTerritory|     | - route        |      | - geoHash      |
| - weeklyMileage|      | - tiles (ref)  |      | - history      |
| - runs (ref)   |      +----------------+      +----------------+
| - tiles (ref)  |
| - trainingPlan |
| - achievements |
+----------------+
       |
       |
+----------------+      +----------------+      +----------------+
|  TrainingPlan  |      |      Zone      |      |      Event     |
+----------------+      +----------------+      +----------------+
| - _id          |      | - _id          |      | - _id          |
| - user (ref)   |      | - name         |      | - name         |
| - planType     |      | - type         |      | - description  |
| - workouts     |      | - king (ref)   |      | - startDate    |
| - startDate    |      | - tiles (ref)  |      | - endDate      |
+----------------+      +----------------+      | - goalType     |
                                              | - goalValue    |
                                              | - participants |
                                              +----------------+

Relationships:
- A User can have multiple Runs.
- A User can own multiple Tiles.
- A User can have one TrainingPlan.
- A Run consists of multiple Tiles.
- A Tile belongs to a Zone.
- A Zone has a King (User).
- A User can participate in multiple Events.
```
