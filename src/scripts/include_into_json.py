import json

# Paths to your JSON files
original_data_file = 'src/data.json'
additional_data_file = 'labels.json'
output_file = 'src/output.json'

def integrate_json():
    try:
        # Load the original data
        with open(original_data_file, 'r') as file:
            original_data = json.load(file)
        
        # Load the additional data
        with open(additional_data_file, 'r') as file:
            additional_data = json.load(file)
        
        # Create a lookup dictionary from additional data
        category_lookup = {item['name'].split('.')[0]: item['category'] for item in additional_data}
        
        # Integrate category into the original data
        for entry in original_data:
            video_name = entry['filepath'].split('/')[-1].split('.')[0]
            if video_name in category_lookup:
                entry['category'] = category_lookup[video_name]
        
        # Remove 'safe_fall' and replace it with 'category'
        for entry in original_data:
            if 'safe_fall' in entry:
                del entry['safe_fall']

        # Save the updated data to a new file
        with open(output_file, 'w') as file:
            json.dump(original_data, file, indent=4)
        
        print(f'Integrated JSON data saved to {output_file}')

    except Exception as e:
        print(f'An error occurred: {e}')

if __name__ == '__main__':
    integrate_json()
