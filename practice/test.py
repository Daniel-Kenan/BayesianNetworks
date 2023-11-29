def print_table_from_file(file_path):
    with open(file_path, 'r') as file:
        lines = file.readlines()

    # Extracting header and data separately
    header = lines[0].strip().split()
    data_lines = lines[1:]

    # Calculate the maximum width for each column
    column_widths = [max(len(column), max(map(len, col))) for column, col in zip(header, zip(*[line.strip().split() for line in data_lines]))]

    # Printing the header
    print("   |", end=" ")
    for column, width in zip(header, column_widths):
        print(f"{column:^{width}} |", end=" ")
    print("\n" + "-" * (sum(column_widths) + 6 * len(column_widths)))

    # Splitting each line into values and converting them to float
    for line in data_lines:
        row = list(map(float, line.strip().split()))

        # Formatting the first column without a name
        print(f"{row[0]:.1f}|", end=" ")

        # Formatting the rest of the columns
        for value, width in zip(row[1:], column_widths[1:]):
            print(f"{value:>{width}.1f} |", end=" ")

        print()  # Move to the next line for the next row

# Example usage:
file_path = "file.txt"
print_table_from_file(file_path)
