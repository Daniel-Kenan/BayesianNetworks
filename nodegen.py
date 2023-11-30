import pandas as pd
import math
import openpyxl

MAXIMA = 1000

class ExcelProcessor:
    def __init__(self, excel_file_path):
        self.excel_file_path = excel_file_path
        self.data_frame = self.read_excel_file()

    def read_excel_file(self):
        df = pd.read_excel(self.excel_file_path)
        return df

    def remove_empty_columns(self):
        self.data_frame = self.data_frame.dropna(axis=1, how='all')

    def remove_rows_with_all_nan(self):
        self.data_frame = self.data_frame.dropna(axis=0, how='all')

    def get_values_array(self):
        columns_array = self.data_frame.columns.tolist()
        values_array = self.data_frame.values.flatten()

        values_array = [value for value in values_array if pd.notna(value)]
        values_array = list(map(lambda val: val.replace("}", "").replace("{", "").split(","), values_array))

        return columns_array, values_array

    def process_values_array(self, columns_array, values_array):
        mappings = {}
        mappings["ID"] = [str(i) for i in range(MAXIMA)]

        for key, val in enumerate(values_array):
            mappings[columns_array[key]] = []

            for i in range(len(val)):
                distribution = val[i].strip().rstrip().split()
                state_name = distribution[0]
                distribution_val = math.ceil(float(distribution[1]) * MAXIMA)

                for _ in range(distribution_val):
                    mappings[columns_array[key]].append(state_name)

        return mappings

    def create_excel_with_columns(self, data, excel_filename='output.xlsx'):
        df = pd.DataFrame(data)
        df.to_excel(excel_filename, index=False)
        print(f"Excel file '{excel_filename}' created successfully.")

    def write_to_text_file(self, excel_filename, output_file_path="output.cas"):
        workbook = openpyxl.load_workbook(excel_filename)
        sheet = workbook.active

        with open(output_file_path, "w") as output_file:
            for row in sheet.iter_rows():
                row_data = [str(cell.value) for cell in row]
                output_line = '\t'.join(row_data) + '\n'
                output_file.write(output_line)


# Example usage:
def process_excel_file(input_excel, output_excel='example.xlsx', output_text='output.cas'):
    excel_processor = ExcelProcessor(input_excel)
    excel_processor.remove_empty_columns()
    excel_processor.remove_rows_with_all_nan()

    columns_array, values_array = excel_processor.get_values_array()

    mappings = excel_processor.process_values_array(columns_array, values_array)
    excel_processor.create_excel_with_columns(mappings, excel_filename=output_excel)
    excel_processor.write_to_text_file(excel_filename=output_excel, output_file_path=output_text)
    return "output.cas"
# Example usage of the function:
