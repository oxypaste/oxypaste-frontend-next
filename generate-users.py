#!/bin/python

# Script to generate mock user accounts for the backend simulation
import os
import json
import uuid
import random
from datetime import datetime, timedelta

# Ensure the target directory exists
os.makedirs("./backend-simulation/data", exist_ok=True)

# Usernames to generate data for
usernames = ["johndoe", "janedoe", "anon1", "gradippp", "joemama"]

# Get current time and 30 days ago
now = datetime.now()
start_date = now - timedelta(days=30)

# Function to generate a random timestamp within the past month
def random_timestamp():
    random_seconds = random.randint(0, 30 * 24 * 60 * 60)  # Up to 30 days
    timestamp = start_date + timedelta(seconds=random_seconds)
    return timestamp.isoformat()

# Generate and save account files
for username in usernames:
    user_id = str(uuid.uuid4())
    account_data = {
        "id": user_id,
        "username": username,
        "password": "12345678",
        "created_at": random_timestamp(),
        "session_tokens": [],
        "statistics": 0
    }

    file_path = f"./backend-simulation/data/account.{user_id}.json"
    with open(file_path, "w") as f:
        json.dump(account_data, f, indent=2)

    print(f"Generated account file: {file_path}")
