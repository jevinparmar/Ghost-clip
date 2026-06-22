import os
import csv
import json
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

# Locate the storage folder in the root of the backend directory
STORAGE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'storage'))
CSV_FILE = os.path.join(STORAGE_DIR, 'history.csv')

def save_history(media_type: str, user_input: str, result_data: any) -> None:
    """
    Saves a record of the download query to history.csv in the storage directory.
    This action is optional and depends on the SAVE_HISTORY environment variable.
    If save fails, the application will log the error and continue running.
    """
    if os.getenv("SAVE_HISTORY", "true").lower() != "true":
        return

    try:
        # Create storage directory if it doesn't exist
        os.makedirs(STORAGE_DIR, exist_ok=True)
        
        file_exists = os.path.isfile(CSV_FILE)
        
        # Format the result: if it's a dict or list, serialize to JSON string
        if isinstance(result_data, (dict, list)):
            result_str = json.dumps(result_data)
        else:
            result_str = str(result_data)
            
        timestamp = datetime.utcnow().isoformat()
        
        # Append record to CSV
        with open(CSV_FILE, mode='a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            if not file_exists:
                # Write header columns
                writer.writerow(['timestamp', 'type', 'input', 'result'])
            writer.writerow([timestamp, media_type, user_input, result_str])
            
        logger.info(f"Successfully saved history to {CSV_FILE}")
    except Exception as e:
        # Prevent crashes, application must continue running
        logger.error(f"Error saving history to CSV: {e}")
