"""
Created by: Cyrus Chimento
Purpose: Loop through through all the feature classes in the geodatabase,
and, for any feature classes without the LAST_UPDATE attribute, add the
field and calculate it. Because this script is using the arcpy module,
it will need to be run in the Python 3 version that comes with ArcGIS Pro.
"""

# Import system modules
import arcpy

# Set environment settings
arcpy.env.workspace = r"C:\Users\cyrus\Desktop\GIS\UMD\NCSG\Regulations.gdb" # CHANGE THIS TO YOUR WORKSPACE

# Pull feature classes in workspace into a list
fc_list = arcpy.ListFeatureClasses()
# define field name
new_field = "LAST_UPDATE"
update = True

for fc in fc_list:
    print(update)
    update = True
    fields = arcpy.ListFields(fc) # get a list of the feature class' fields
    field_names = [f.name.upper() for f in fields]
    
    for name in field_names: # check if the feature class already has a LAST_UPDATE field
        if name == "LAST_UPDATE":
            update = False
            print(fc + " already has this field.")
            break
        
    # if LAST_UPDATE does not exist, add the field and calculate it
    if update == True:
        arcpy.AddField_management(fc, new_field, "DATE")
        arcpy.CalculateField_management(fc, new_field, "datetime.datetime(2021, 3, 15)", "PYTHON3", "import datetime")
        print(fc + " was updated.")
