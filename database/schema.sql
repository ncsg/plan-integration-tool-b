CREATE DATABASE sop;

CREATE EXTENSION postgis; 

CREATE TYPE county_md AS ENUM('Montgomery County', 
                        'Prince Georges County', 'Both');

CREATE TABLE plans (
    id BIGSERIAL, 
    title VARCHAR(150) NOT NULL,
    plan_type VARCHAR(150) NOT NULL,
    county county_md NOT NULL,
    awc VARCHAR(150) NOT NULL,
    year INT NOT NULL,
    link TEXT NOT NULL,
    PRIMARY KEY (id)
);

-- The plans table has a one-to-many 
-- relationship with goals table.
CREATE TABLE goals (
    id BIGSERIAL,
    goal TEXT NOT NULL,
    goal_type VARCHAR(150),
    plan_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
    -- ON CASCADE DELETE because a goal or goals cannot exist absent 
    -- a plan. If the plan is deleted from the database so are its
    -- corresponding goals.
);

-- The plans table has a one-to-many relationship with
-- the strategies table.
CREATE TABLE strategies(
    id BIGSERIAL,
    strategy VARCHAR(150) NOT NULL,
    description TEXT,
    goal_id INT NOT NULL,
    plan_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE,
    -- ON DELETE CASCADE because a strategy cannot exist absent
    -- the goal that mentions it. If the goal is deleted from the
    -- database so are its corresponding strategies. This relationship
    -- is a depedency.
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
    -- ON DELETE CASCADE because a strategy cannot exist absent the
    -- the plan that mentions it. If the plan is deleted from the
    -- database so are its corresponding strategies. This relationship
    -- is a dependency. 
);

-- The plans table has a one-to-many relationship
-- with the actions table. 
CREATE TYPE type_action AS ENUM('Action', 'Implementation',
                            'Recommendation');

CREATE TABLE actions(
    id BIGSERIAL,
    description TEXT NOT NULL,
    action_type type_action NOT NULL,
    dependency TEXT,
    latitude FLOAT,
    longitude FLOAT,
    location GEOGRAPHY,
    plan_id INT NOT NULL,
    strategy_id INT,
    asset VARCHAR(100),
    category TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
    -- ON DELETE CASCADE because an action cannot exist absent the
    -- plan that mentions it. If the plan is deleted from the database
    -- so are its corresponding actions. This realtionship is a
    -- dependency.
    FOREIGN KEY (strategy_id) REFERENCES strategies(id) ON DELETE SET NULL
    -- ON DELETE SET NULL because the relationship between
    -- a strategy and actions is an aggregation. Therefore, an
    -- action can exist absent a specific strategy. If a strategy is deleted
    -- or does not exist in the database an action can still exist
    -- independently.
);

UPDATE actions SET location = ST_POINT(longitude, latitude);










-- break point: everything before this point works











-- must be created before visions table because the visions table has plans_boundaries(plan_id) as a foreign key
-- also, in sop_dump.txt, it seems like this table is called boundaries, instead of plans_boundaries

CREATE TABLE plans_boundaries(
    plan_id INT NOT NULL,
    boundary_id INT NOT NULL,
    PRIMARY KEY (plan_id, boundary_id),
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON UPDATE CASCADE,
    -- unclear where the table boundaries_nad83_stateplane_md_meters would come from; this is throwing an error
    -- https://stackoverflow.com/questions/8595695/what-is-difference-between-foreign-key-and-reference-key
    FOREIGN KEY (boundary_id) REFERENCES boundaries_nad83_stateplane_md_meters(gid) ON UPDATE CASCADE
);


-- The plans table has a one-to-many relationship 
-- with the visions table.
CREATE TABLE visions (
    id BIGSERIAL,
    vision TEXT,
    PRIMARY KEY (id),
    plan_id INT NOT NULL,
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
    -- ON DELETE CASCADE because a vision statement cannot exist absent
    -- the plan that mentions it. If the plan is deleted from the
    -- database so are its corresponding vision statements. 
    FOREIGN KEY (boundary_id) REFERENCES plans_boundaries(plan_id) ON DELETE SET NULL
    -- ON DELETE SET NULL because a vision statement can exist absent
    -- the plan boundary. A vision statement is spatially associated with
    -- a plan boundary but not dependent on it. Planner can alter/update a 
    -- plans boundary but this happens independent to updating/altering vision
    -- statements. 
);

-- The plans table has a many-to-many
-- relationship with the actors table.
CREATE TABLE actors (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    org_name VARCHAR(150) NOT NULL
);

CREATE TYPE stage AS ENUM('Interim', 'Ultimate');

-- The actions table has a one-to-many
-- relationship with the conditions table.
CREATE TABLE conditions (
    id BIGSERIAL,
    condition TEXT NOT NULL,
    condition_type stage,
    action_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (action_id) REFERENCES actions(id) ON DELETE CASCADE
    -- ON DELETE CASCADE because the relationship between
    -- an action and a condition is a dependency. Therefore, a 
    -- condition cannot exist absent an action. If an action is deleted
    -- from the databse so are its corresponding conditions.
);

-- The actions table has a one-to-many 
-- relationship with the intents table.
CREATE TABLE intents (
    id BIGSERIAL,
    intent TEXT NOT NULL,
    action_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (action_id) REFERENCES actions(id) ON DELETE CASCADE
    -- ON DELETE CASCADE because the relationship between an action
    -- and an intent is a dependency. Therefore, an intent cannot exist
    -- absent its action. If an action is deleted from the database
    -- so are its corresponding intents. 
);

CREATE TYPE unit_type AS ENUM('Square Feet', 'Acres', ' ');

CREATE TYPE landuse AS ENUM('Agriculture', 'Cooperative',
                        'Cultural', 'Error', 'Industrial',
                        'Institutional/Community Facility',
                        'Multi-Family', 'Office',
                        'Open Space/Recreation',
                        'Parking and Transportation',
                        'Parks', 'Research and Development',
                        'Retail', 'Single Family Attached',
                        'Single Family Detached',
                        'Utility', 'Vacant', 'Warehouse', ' ');

CREATE TYPE azcode AS ENUM('Agricultural', 'Apartments',
                            'Commercial', 'Commercial Condominium',
                            'Commercial/Residential', 'Country Club',
                            'Exempt', 'Exempt Commercial',
                            'Industrial', 'Marsh Land', 'Residential',
                            'Residential Condominium',
                            'Residential/Commercial', ' ');

CREATE TYPE water AS ENUM('ROW', 'S-1', 'W-0', 'W-1',
                          'W-2', 'W-3', 'W-4', 'W-5',
                          'W-6', ' ');

CREATE TYPE sewer AS ENUM('ROW', 'S-0', 'S-1', 'S-2',
                          'S-3', 'S-4', 'S-5', 'S-6', ' ');

-- The actions table has a many-to-many 
-- relationship with parcels.
CREATE TABLE parcels (
    fid INT NOT NULL,
    objectid INT NOT NULL,
    area DECIMAL(12,2),
    unit unit_type,
    lu_code INT,
    lu_cat landuse,
    azcode_name azcode,
    zone VARCHAR(25),
    longzone VARCHAR(50),
    water_cat water,
    sewer_cat sewer,
    shape_length DECIMAL(12,6) NOT NULL,
    shape_area DECIMAL(12,6) NOT NULL,
    geom GEOMETRY(POLYGON),
    PRIMARY KEY (fid)
);

-- The plans table has a one-to-many relationship 
-- with the capital improvements table.
CREATE TABlE capital_improvements(
    id BIGSERIAL,
    project_name VARCHAR(150) NOT NULL,
    amount DECIMAL(12, 2),
    asset VARCHAR(120),
    description TEXT,
    latitude FLOAT,
    longitude FLOAT,
    location GEOGRAPHY,
    plan_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
    -- ON CASCADE DELETE because a capital improvement project cannot exist
    -- absent the plan that mentions it. If the plan is deleted from
    -- the database so are its corresponding capital improvement projects. 
);

-- Junction tables for many-to-many relationships
CREATE TABLE actions_parcels (
    action_id INT NOT NULL,
    parcel_id INT NOT NULL,
    PRIMARY KEY (action_id, parcel_id),
    FOREIGN KEY (action_id) REFERENCES actions(id) ON UPDATE CASCADE,
    FOREIGN KEY (parcel_id) REFERENCES parcels(fid) ON UPDATE CASCADE
);

CREATE TABLE actions_actors (
    action_id INT NOT NULL,
    actor_id INT NOT NULL,
    PRIMARY KEY (action_id, actor_id),
    FOREIGN KEY (action_id) REFERENCES actions(id) ON UPDATE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES actors(id) ON UPDATE CASCADE
);


CREATE TABLE plans_parcels (
    plan_id INT NOT NULL,
    parcel_id INT NOT NULL,
    PRIMARY KEY (plan_id, parcel_id),
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON UPDATE CASCADE,
    FOREIGN KEY (parcel_id) REFERENCES parcels(fid) ON UPDATE CASCADE
);

CREATE TABLE plans_actors (
    plan_id INT NOT NULL,
    actor_id INT NOT NULL,
    PRIMARY KEY (plan_id, actor_id),
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON UPDATE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES actors(id) ON UPDATE CASCADE
);





CREATE TABLE actions(
    id BIGSERIAL,
    description TEXT NOT NULL,
    action_type type_action NOT NULL,
    dependency TEXT,
    latitude FLOAT,
    longitude FLOAT,
    plan_id INT NOT NULL,
    strategy_id INT,
    asset VARCHAR(100),
    category TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
    -- ON DELETE CASCADE because an action cannot exist absent the
    -- plan that mentions it. If the plan is deleted from the database
    -- so are its corresponding actions. This realtionship is a
    -- dependency.
    FOREIGN KEY (strategy_id) REFERENCES strategies(id) ON DELETE SET NULL
    -- ON DELETE SET NULL because the relationship between
    -- a strategy and actions is an aggregation. Therefore, an
    -- action can exist absent a specific strategy. If a strategy is deleted
    -- or does not exist in the database an action can still exist
    -- independently.
);

SELECT AddGeometryColumn('actions',
 'geom', 26985, 'POINT',2); 

UPDATE actions
 SET geom = ST_Transform(
 ST_GeomFromText('POINT(' || longitude || ' ' || latitude || ')',4326), 26985);

 SELECT * FROM plans
 INNER JOIN actions on plans.action_id = actions.id;


 CREATE TABLE plans_parcels (
    plan_id INT NOT NULL,
    parcel_id INT NOT NULL,
    PRIMARY KEY (plan_id, parcel_id),
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON UPDATE CASCADE,
    FOREIGN KEY (parcel_id) REFERENCES parcels(fid) ON UPDATE CASCADE
);

