-- directions
-- https://www.postgresqltutorial.com/import-csv-file-into-posgresql-table/

-- give everyone permission to access the folder with the CSV file in it
-- https://stackoverflow.com/questions/14083311/permission-denied-when-trying-to-import-a-csv-file-from-pgadmin


-- don't copy in the id; the copy statetment does that automatically
COPY plans(title, plan_type, county, awc, year, link, plan_area) 
FROM '[path]' DELIMITER ',' CSV HEADER;


