import pandas as pd
import math

MAXIMA=1000
def read_excel_file(file_path):
    df = pd.read_excel(file_path)
    return df

excel_file_path = "case_example.xlsx"
data_frame = read_excel_file(excel_file_path)

# Remove empty columns
data_frame = data_frame.dropna(axis=1, how='all')

# Remove rows with all NaN values
data_frame = data_frame.dropna(axis=0, how='all')

# Get all values and store them in an array
columns_array = data_frame.columns.tolist()
values_array = data_frame.values.flatten()

# Remove NaN values from the array
values_array = [value for value in values_array if pd.notna(value)]
values_array = list(map(lambda val: val.replace("}","").replace("{","").split(","), values_array))

# print(values_array[0])
# exit()

mappings = {}
mappings["ID"] = [str(i) for i in range(MAXIMA)]
holder = [[i for i in range(MAXIMA)] for _ in range(len(columns_array))]
for key,val in enumerate(values_array):
    mappings[columns_array[key]] = []
    print(mappings)
    print(val)
    
    for i in range(len(val)) :
        distribution = val[i].strip().rstrip().split()
        len_distribution = len(distribution)
        state_name = distribution[0]
        distribution_val = math.ceil(float(distribution[1])*MAXIMA)
        # mappings[columns_array[key]].append([state_name,distribution_val])
        for i in range(distribution_val): 
            mappings[columns_array[key]].append(state_name)
        

import pandas as pd

def create_excel_with_columns(data, excel_filename='output.xlsx'):
    # Create a DataFrame using the provided data
    df = pd.DataFrame(data)

    # Write the DataFrame to an Excel file
    df.to_excel(excel_filename, index=False)
    print(f"Excel file '{excel_filename}' created successfully.")

# Example usage:
columns_data = mappings

create_excel_with_columns(columns_data, excel_filename='example.xlsx')


import openpyxl

# Load the workbook
workbook = openpyxl.load_workbook("example.xlsx")

# Select the active sheet
sheet = workbook.active

# Specify the output text file
output_file_path = "output.cas"

# Open the text file in write mode
with open(output_file_path, "w") as output_file:
    # Iterate through rows and write each cell value to the text file
    for row in sheet.iter_rows():
        row_data = [str(cell.value) for cell in row]
        output_line = '\t'.join(row_data) + '\n'
        output_file.write(output_line)

