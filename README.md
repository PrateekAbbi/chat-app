# Chat Application

## Introduction

This is a real-time chat application developed using Next.js and TypeScript. Users can log in through their Google accounts to ensure simplicity and security. The chat is performed in real-time, allowing users to add friends via email and chat instantly. The application features a responsive UI built with TailwindCSS, and database operations are managed using Redis.

## Features

- **Real-Time Chat**: Messages are sent and received instantly.
- **Google Authentication**: Users can log in using their Google accounts.
- **Add Friends**: Add friends via their email addresses.
- **Responsive Design**: The UI is built with TailwindCSS for a seamless experience across devices.
- **Redis Database**: Efficient and fast database queries are handled through Redis.

## Installation

To get started with the chat application, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/PrateekAbbi/chat-app.git
   cd chat-application
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory of the project and add the following environment variables:

   ```env
   NEXTAUTH_SECRET=your_nextauth_secret

   UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token

   GOOGLE_CLIENT_ID=your_google_client_id

   PUSHER_APP_ID=your_pusher_app_id
   NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_app_key
   PUSHER_APP_SECRET=your_pusher_app_secret
   ```

## How to Run

1. Start the development server:

   ```sh
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`.
