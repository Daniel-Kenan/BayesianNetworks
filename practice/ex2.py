import pandas as pd

def read_excel_file(file_path):
    try:
        # Read the Excel file
        df = pd.read_excel(file_path)

        # Display the entire DataFrame
        print("Contents of the Excel file:")
        print(df)

        # Calculate percentiles of all values
        percentiles = df.describe(percentiles=[.1,.25, .50, .75])
        print("\nPercentiles of all values:")
        print(percentiles)

        return df

    except Exception as e:
        print(f"Error reading Excel file: {e}")

if __name__ == "__main__":
    # Replace 'testfile.xlsx' with the actual path to your Excel file
    excel_file_path = 'testfile.xlsx'
    
    # Call the function to read the Excel file
    data_frame = read_excel_file(excel_file_path)
    
    # You can now use 'data_frame' to perform further operations with the data
