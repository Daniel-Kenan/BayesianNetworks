import pandas as pd

def create_excel_with_columns(data, excel_filename='output.xlsx'):
    # Create a DataFrame using the provided data
    df = pd.DataFrame(data)

    # Write the DataFrame to an Excel file
    df.to_excel(excel_filename, index=False)
    print(f"Excel file '{excel_filename}' created successfully.")

# Example usage:
columns_data = {
    'Name': ['John', 'Jane', 'Bob'],
    'Age': [25, 30, 22],
    'City': ['New York', 'San Francisco', 'Seattle']
}

create_excel_with_columns(columns_data, excel_filename='example.xlsx')

print(columns_data)