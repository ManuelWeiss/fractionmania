# FractionMania 🎯

An interactive and fun web application designed to help kids learn and master fractions through engaging exercises and immediate AI-powered feedback.

## Features

- 🎮 Interactive fraction exercises and games
- 🤖 AI-powered feedback using Llama (via AWS Bedrock)
- 📊 Progress tracking and achievements
- 🎨 Modern, kid-friendly user interface
- 🎯 Immediate feedback and explanations
- 📱 Responsive design for all devices

## Tech Stack

- **Backend**: Python FastAPI
- **Frontend**: React with TypeScript
- **AI Integration**: Llama (via AWS Bedrock)
- **Database**: DynamoDB (AWS)
- **Styling**: Tailwind CSS
- **Authentication**: JWT

## Project Structure

```
fractionmania/
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Core functionality
│   │   ├── models/       # Data models
│   │   └── services/     # Business logic
│   ├── tests/            # Backend tests
│   └── requirements.txt  # Python dependencies
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── styles/       # CSS styles
│   └── package.json      # Node dependencies
└── docker/              # Docker configuration
```

## Getting Started

### Prerequisites

- Python 3.11
- Node.js 18+
- AWS account (for DynamoDB and AWS Bedrock)
- AWS credentials configured (see [AWS docs](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)) (with access to AWS Bedrock)

### Backend Setup

1. Create a virtual environment (using Python 3.11):
   ```bash
   python3.11 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your AWS (DynamoDB and Bedrock) configuration
   ```

4. Run DynamoDb Local on port 7999:
   ```bash
   java -Djava.library.path=./DynamoDBLocal_lib -jar ./DynamoDBLocal.jar -sharedDb -port 7999
   ```

5. Run the development server (default port 8000):
   ```bash
   uvicorn app.main:app --reload
   ```

#### Troubleshooting
- If you encounter errors with Pydantic or FastAPI, ensure you are using Python 3.11.
- Make sure your AWS credentials are set up for DynamoDB and AWS Bedrock access.

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server (default port 5173):
   ```bash
   npm run dev
   ```

## Repository

The latest code is hosted at: [https://github.com/ManuelWeiss/fractionmania](https://github.com/ManuelWeiss/fractionmania)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.