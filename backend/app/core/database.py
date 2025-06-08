import boto3
from botocore.config import Config
from typing import Dict, Any

# DynamoDB local configuration
DYNAMODB_ENDPOINT = "http://localhost:7999"
REGION = "us-east-1"  # This doesn't matter for local DynamoDB

# Create DynamoDB client
dynamodb = boto3.resource(
    'dynamodb',
    endpoint_url=DYNAMODB_ENDPOINT,
    region_name=REGION,
    aws_access_key_id='dummy',  # Required for local DynamoDB
    aws_secret_access_key='dummy',  # Required for local DynamoDB
    config=Config(
        retries={'max_attempts': 3},
        connect_timeout=5,
        read_timeout=5
    )
)

# Get or create tables
def get_or_create_tables():
    try:
        # Check if tables exist
        dynamodb.meta.client.describe_table(TableName='UserProgress')
    except dynamodb.meta.client.exceptions.ResourceNotFoundException:
        # Create UserProgress table
        table = dynamodb.create_table(
            TableName='UserProgress',
            KeySchema=[
                {
                    'AttributeName': 'user_id',
                    'KeyType': 'HASH'  # Partition key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'user_id',
                    'AttributeType': 'S'  # String type
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )
        table.wait_until_exists()

# Initialize tables on module import
get_or_create_tables()

# Helper functions for database operations
def get_user_progress(user_id: str) -> Dict[str, Any]:
    table = dynamodb.Table('UserProgress')
    response = table.get_item(Key={'user_id': user_id})
    return response.get('Item', {
        'user_id': user_id,
        'current_level': 'comparison',
        'completed_levels': [],
        'progress': {}
    })

def update_user_progress(user_id: str, progress_data: Dict[str, Any]) -> Dict[str, Any]:
    table = dynamodb.Table('UserProgress')
    table.put_item(Item={
        'user_id': user_id,
        **progress_data
    })
    return get_user_progress(user_id) 