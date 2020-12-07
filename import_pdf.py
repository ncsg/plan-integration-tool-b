"""
Author: Cyrus Chimento
Date: 11/23/2020
Purpose: Import plan PDFs into a folder in ArcGIS Online and make them public.
         Script is adapted from reference (1) below. Note that the time.sleep
         lines are to allow full processing of large files. Less processing
         time can result in errors. The maximum file size that this script
         processed was 246,457 KB.

References:
1. https://community.esri.com/t5/python-questions/add-2k-pdf-s-to-specific-folder-in-my-content/td-p/194571
2. https://developers.arcgis.com/rest/users-groups-and-items/search-reference.htm
3. https://pythonexamples.org/pandas-dataframe-add-append-row/
4. https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.html
5. https://support.esri.com/en/technical-article/000016853
6. https://developers.arcgis.com/python/api-reference/arcgis.gis.toc.html#item
7. https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_csv.html

"""

# import modules
import arcgis
import os
import glob
import time
import pandas

# establish a connection to ArcGIS Online
gis = arcgis.gis.GIS(None, "XXXXXXX", "XXXXXXX") # REMOVE user and password before sending to github
print("Connection established.")

contentManager = arcgis.gis.ContentManager(gis) # access content manager
contentManager.create_folder('Plan Documents',None) # create a folder in ArcGIS Online
pdf_list = glob.glob(r'C:\Users\cyrus\Desktop\Plan PDFs\*.pdf') # path to folder of PDFs
additem = arcgis.gis.ContentManager(gis) # add item action
print("Setup complete.")

# loop through pdfs in the list and add each to the folder in ArcGIS Online
for pdf in pdf_list:
    file_name = os.path.basename(pdf)
    pdf_properties = {'type':'PDF','title':file_name.split(".")[0],'tags':'Plans, NCSG, Purple Line', 'access':'Public'}
    additem.add(pdf_properties,pdf,folder='Plan Documents')
    print(file_name + " added.")
    time.sleep(5) # suspends execution for given number of seconds

print("Files added.")

# get all the PDFs in ArcGIS Online into a list
item_search = gis.content.search("owner: XXXXXXXX", item_type='PDF', max_items=100) # REMOVE owner name before sending to github
item_search

df = pandas.DataFrame(columns=["Title", "URL"]) # initialize a new dataframe to hold title/url of items

# loop through each PDF and change the sharing permissions
for item in item_search:
    item.share(everyone=True)
    item_id = item.id # retrieve item id
    item_title = item.title # retrieve item title
    item_url = "https://uofmd.maps.arcgis.com/sharing/rest/content/items/%s/data"%item_id # create URL
    new_row = {"Title":item_title, "URL": item_url} # create series
    df = df.append(new_row, ignore_index=True) # add series to dataframe
    print(item_title + ", " + item_url)
    time.sleep(5) # suspends execution for given number of seconds
    
# export dataframe to csv
df.to_csv(r"C:\Users\cyrus\Desktop\Plan_URLs.csv")



