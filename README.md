# BrosChat

A real-time chat application built with Next.js, Convex, and Clerk for authentication.

## Features

- 🔐 Secure authentication with Clerk
- 💬 Real-time messaging
- 👤 User-specific message colors
- ⌨️ Enter key support for sending messages
- 📱 Responsive design
- 🕒 Message timestamps

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Backend**: Convex for real-time database
- **Authentication**: Clerk
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Clerk account for authentication
- A Convex account for the backend

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/BrosChat.git
cd BrosChat
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

4. Update Clerk domain:
In `convex/auth.config.ts`, update the domain to match your Clerk application domain.

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

6. In a separate terminal, start the Convex development server:
```bash
npx convex dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
BrosChat/
├── app/                # Next.js app directory
│   ├── Chat.tsx       # Main chat component
│   ├── Header.tsx     # Application header
│   └── layout.tsx     # Root layout
├── convex/            # Convex backend
│   ├── messages.ts    # Message handlers
│   └── auth.config.ts # Authentication configuration
└── public/           # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
