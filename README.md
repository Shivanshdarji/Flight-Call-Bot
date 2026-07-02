# Flight-Call-Bot

This is a call attendant bot for Air Services, built with React and the OpenAI API.

## Features
- Disruption Management
- Autonomous Rebooking and Refund Processing
- Conversational Flight Search and Booking
- Voice input support (Hindi/English)

## Run Locally
1. Install dependencies: `npm install`
2. Set the `VITE_OPENAI_API_KEY` in `.env` to your OpenAI API key
3. Run the app: `npm run dev`

## Deploy to Render
The easiest way to deploy this application is using [Render](https://render.com).

1. Create a Render account and connect your GitHub repository.
2. Go to your Render dashboard, click **New +**, and select **Blueprint**.
3. Select your `Flight-Call-Bot` repository.
4. Render will automatically detect the `render.yaml` file and configure a Static Site for you.
5. Provide your `VITE_OPENAI_API_KEY` in the environment variables when prompted.
6. Click **Apply** to deploy!
