#!/bin/sh

# Function to prompt for missing environment variables
prompt_missing_variables() {
    if [ -z "$CLIENT_ID" ]; then
        echo "To get your Discord Client ID:"
        echo "1. Go to https://discord.com/developers/applications"
        echo "2. Click on 'New Application' and give it a name."
        echo "3. Go to the 'General Information' tab and copy the 'CLIENT ID'."
        echo "Enter your Discord Client ID:"
        read -r CLIENT_ID
    fi

    if [ -z "$BOT_TOKEN" ]; then
        echo "To get your Discord Bot Token:"
        echo "1. Go to the 'Bot' tab in your Discord application."
        echo "2. Click 'Add Bot' and confirm."
        echo "3. Under 'Token', click 'Copy'."
        echo "Enter your Discord Bot Token:"
        read -r BOT_TOKEN
    fi

    if [ -z "$PERSPECTIVE_API_KEY" ]; then
        echo "To get your Perspective API Key:"
        echo "1. Go to https://console.developers.google.com/"
        echo "2. Create a new project or select an existing project."
        echo "3. Enable the Perspective API."
        echo "4. Create an API Key and copy it."
        echo "Enter your Perspective API Key:"
        read -r PERSPECTIVE_API_KEY
    fi

    if [ -z "$GEMINI_API_KEY" ]; then
        echo "To get your Gemini API Key:"
        echo "1. Go to https://aistudio.google.com/app/apikey"
        echo "2. Sign in with your Google account."
        echo "3. Create a new API key."
        echo "4. Copy the generated API key."
        echo "Enter your Gemini API Key:"
        read -r GEMINI_API_KEY
    fi
}

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating a new .env file..."
    touch .env
else
    echo ".env file found."
fi

# Load environment variables from .env file
source .env

# Prompt for missing environment variables
prompt_missing_variables

# Update .env file with provided or existing values
cat << EOF > .env
CLIENT_ID=${CLIENT_ID:-$CLIENT_ID}
BOT_TOKEN=${BOT_TOKEN:-$BOT_TOKEN}
PERSPECTIVE_API_KEY=${PERSPECTIVE_API_KEY:-$PERSPECTIVE_API_KEY}
GEMINI_API_KEY=${GEMINI_API_KEY:-$GEMINI_API_KEY}
EOF

# Inform the user
echo ".env file updated successfully with the provided or existing environment variables."

# Install dependencies
npm install

# Run the bot
npm run start
