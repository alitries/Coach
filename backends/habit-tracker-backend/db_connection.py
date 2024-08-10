from pymongo.mongo_client import MongoClient

uri = "mongodb+srv://karan_habit:YSFw5kjeDGpsWdRK@cluster1.ts4oosd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"

def get_mongo_client():
    try:
        client = MongoClient(uri)
        return client
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return None

def get_database(client):
    try:
        return client["Habit"]
    except Exception as e:
        print(f"Error getting database: {e}")
        return None

def get_collections(db):
    try:
        return db["reminders"], db["user_data"]
    except Exception as e:
        print(f"Error getting collections: {e}")
        return None, None

client = get_mongo_client()
if client:
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(f"Error pinging MongoDB: {e}")

    db = get_database(client)
    if db is not None:
        reminders_collection, user_data_collection = get_collections(db)
        if reminders_collection is not None and user_data_collection is not None:
            print("Successfully retrieved collections!")
        else:
            print("Error retrieving collections!")
    else:
        print("Error retrieving database!")
else:
    print("Error connecting to MongoDB!")
