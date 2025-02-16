# Mystery Message

Mystery Message is a real-time chat application built with Next.js, TypeScript, Zustand, and Socket.IO. It allows users to send and receive messages in real-time. The app supports user authentication, individual chats, unread message notifications, and profile management.

## Features

- **User Authentication**: Implemented using NextAuth.
- **Real-time Messaging**: Powered by Socket.io for instant message delivery.
- **State Management**: Zustand for managing user, chatbox, messages, and unread message count.
- **Unread Message Notifications**: Shows unread message count per contact.
- **Contacts Section**: Displays users you've chatted with and includes a search option.
- **Sidebar**: Allows profile image editing.
- **API Endpoints**: Handled in the `api` folder for various functionalities:
  - Sign-in / Sign-up
  - Send / Read Messages
  - Search User
  - Verify Code
  - Update Profile
  - Check Username Uniqueness

## Tech Stack

- **Frontend**: Next.js, TypeScript
- **State Management**: Zustand
- **Real-time Communication**: Socket.io
- **Authentication**: NextAuth
- **Database**: MongoDB (or your preferred database)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/jithu5/mysterymessage.git
cd mysterymessage
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add the following environment variables:

```
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 5. Run the WebSocket server

```bash
npm start
```

## Usage

1. Register and log in to the application.
2. Add contacts and start chatting in real-time.

### Working in this project for further integration

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
