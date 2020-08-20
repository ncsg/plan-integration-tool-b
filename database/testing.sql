-- SELECT Find_SRID('cchiment', 'land_use_plans', 'geom');

-- SELECT ST_SRID(CAST(geom as GEOMETRY)) from cchiment.land_use_plans;

-- SELECT ST_SetSRID(CAST(geom), 4326) from cchiment.land_use_plans;

-- SELECT ST_Transform(ST_SetSRID(CAST(geom as GEOMETRY), 2248), 4326) from cchiment.land_use_plans;

-- select ST_AsText(geom), ST_SRID(geom) from cchiment.land_use_plans;

-- select ST_AsGeoJSON(ST_Transform(ST_SetSRID(CAST(geom as GEOMETRY), 2248), 4326), 6), ST_SRID(CAST(geom as GEOMETRY)) from cchiment.land_use_plans;

-- Select ST_AsGeoJSON(geom, 6) from cchiment.land_use_plans;
-- select * from pg_proc where proname = 'st_asgeojson';

-- select ST_AsGeoJSON(geom), ST_SRID(geom) from cchiment.land_use_plans;

-- this JUST updates the SRID, not the geometry
-- SELECT UpdateGeometrySRID('cchiment', 'land_use_plans', 'geom', 3857);
-- SELECT UpdateGeometrySRID('cchiment', 'montgomery_county_bus_stops', 'geom', 4326);
