import pandas as pd

# Step 2: Prepare Data
data = {
    'Rain': ['Yes', 'No', 'Yes', 'No', 'Yes'],
    'Traffic Jam': ['Yes', 'No', 'Yes', 'No', 'Yes'],
}

df = pd.DataFrame(data)

# Step 3: Save Data to Excel File
excel_file_path = 'netica_case_file.xlsx'
df.to_excel(excel_file_path, index=False)

print(f"Excel file saved to {excel_file_path}")
