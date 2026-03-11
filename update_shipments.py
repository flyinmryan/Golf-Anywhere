import json
from datetime import datetime, timedelta

file_path = r'C:\Users\micha\source\repos\hairstyle-studio\ace-ma-n-pa-2.json'

with open(file_path, 'r') as f:
    data = json.load(f)

base_start_time = datetime.strptime("2026-03-12T08:00:00Z", "%Y-%m-%dT%H:%M:%SZ")

shipments = data['model']['shipments']
for i, shipment in enumerate(shipments):
    # Increment start time by 6 minutes for each shipment (total 594 minutes for 100 shipments)
    # 0 to 99 * 6 = 594 minutes
    # 594 minutes = 9 hours 54 minutes.
    # 08:00 + 09:54 = 17:54.
    # 17:54 + 2 hours = 19:54. All within 20:00 limit.
    start_time = base_start_time + timedelta(minutes=i * 6)
    end_time = start_time + timedelta(hours=2)
    
    start_str = start_time.strftime("%Y-%m-%dT%H:%M:%SZ")
    end_str = end_time.strftime("%Y-%m-%dT%H:%M:%SZ")
    
    # Add timeWindows to deliveries
    for delivery in shipment['deliveries']:
        delivery['timeWindows'] = [{"startTime": start_str, "endTime": end_str}]

with open(file_path, 'w') as f:
    json.dump(data, f, indent=2)

print(f"Updated {len(shipments)} shipments in {file_path}")
