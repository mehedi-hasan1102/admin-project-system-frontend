# Frontend - Admin & Project Management System

This is the React + TypeScript frontend for the Admin & Project Management System with Invitation-Based User Onboarding.

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Static typing
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Project Structure

```
src/
├── components/           # Reusable components
│   ├── Layout.tsx       # Main layout wrapper
│   ├── Navigation.tsx   # Navigation bar
│   ├── ProtectedRoute.tsx # Route guards
│   └── common.tsx       # Common UI components (Alert, Button, LoadingSpinner)
├── pages/               # Page components
│   ├── LoginPage.tsx
│   ├── InviteRegistrationPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProjectsPage.tsx
│   └── UsersPage.tsx
├── services/
│   └── api.ts          # API client with axios
├── store/              # Redux store
│   ├── index.ts        # Store configuration
│   └── slices/         # Redux slices
│       ├── authSlice.ts
│       ├── projectsSlice.ts
│       ├── usersSlice.ts
│       └── invitesSlice.ts
├── hooks/
│   └── redux.ts        # Custom Redux hooks
├── types/
│   └── index.ts        # TypeScript types
├── App.tsx             # Main app component with routing
├── main.tsx            # Entry point
├── index.css           # Global styles
└── vite-env.d.ts       # Vite environment types
```

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm/yarn
- Backend API running on `http://localhost:5000`

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (or copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` if your backend is running on a different URL:
```
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will start on `http://localhost:5173`

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## Features

### Authentication
- **Login** - Email/password based authentication with JWT
- **Invite-Based Registration** - Users can only register via admin-generated invites
- **Protected Routes** - Role-based access control for different pages
- **Token Persistence** - Auth tokens and user info stored in localStorage

### Pages

#### Public Pages
- **Login** (`/login`) - User authentication
- **Invite Registration** (`/invite?token=...`) - Register with invitation token

#### Protected Pages (Authenticated Users)
- **Dashboard** (`/dashboard`) - User profile and role information
- **Projects** (`/projects`) - View, create, and manage projects
  - All users can create projects
  - Only admins can edit/delete projects
  - Soft delete functionality

#### Admin-Only Pages
- **Users** (`/users`) - User and invitation management
  - View all users with pagination
  - Change user roles (ADMIN, MANAGER, STAFF)
  - Activate/deactivate users
  - Create and manage invitations
  - Revoke pending invitations

### State Management (Redux)

#### Auth Slice
- User authentication state
- Token management
- Login/Register/Logout actions
- Profile management

#### Projects Slice
- Projects list
- Create project
- Update project (admin only)
- Delete project (soft delete, admin only)
- Selected project details

#### Users Slice
- Users list with pagination
- Change user status (activate/deactivate)
- Change user role
- User management actions

#### Invites Slice
- Pending invitations list
- Create new invitation
- Revoke invitation
- Track invitation status

## API Integration

The frontend communicates with the backend through the API client in `src/services/api.ts`.

### Key API Endpoints Used
- `POST /auth/login` - User login
- `POST /auth/register` - User registration with invite
- `GET /auth/profile` - Get current user profile
- `GET /users` - List all users (admin only)
- `POST /users/invites/create` - Create invitation (admin only)
- `PATCH /users/:id/status` - Change user status (admin only)
- `PATCH /users/:id/role` - Change user role (admin only)
- `GET /projects` - List user projects
- `POST /projects` - Create project
- `PATCH /projects/:id` - Update project (admin only)
- `DELETE /projects/:id` - Delete project (admin only, soft delete)

## Styling

The application uses **Tailwind CSS** for styling with a clean, modern design.

### Color Scheme
- Primary: Blue (`#2563eb`)
- Success: Green (`#16a34a`)
- Warning: Yellow (`#ca8a04`)
- Danger: Red (`#dc2626`)

## Component Architecture

### Layout Component
- Wraps authenticated pages
- Displays navigation bar
- Provides consistent styling

### Navigation Component
- Shows authenticated user info and role
- Navigation links (contextual based on role)
- Logout button

### Protected Routes
- `<ProtectedRoute>` - Requires authentication
- `<AdminRoute>` - Requires admin role

## Error Handling

- Centralized error handling in Redux slices
- Toast-like alerts for user feedback
- HTTP error interceptors for failed requests
- User-friendly error messages

## Performance Optimizations

- Redux selectors for efficient state access
- Memoized components using `React.memo`
- Lazy loading of routes (can be added)
- Local storage for auth persistence
- Optimistic updates for better UX

## Development Workflow

1. **Create Pages** - New pages go in `src/pages/`
2. **Add Components** - Reusable components in `src/components/`
3. **Update Redux** - Add slices in `src/store/slices/`
4. **Add Types** - Update types in `src/types/index.ts`
5. **Use Hooks** - Use `useAppDispatch` and `useAppSelector` from Redux hooks
6. **Style with Tailwind** - Use Tailwind classes for styling

## Troubleshooting

### CORS Issues
- Ensure backend is running with CORS enabled
- Check `VITE_API_URL` in `.env` matches backend URL

### Auth Token Issues
- Clear localStorage if stuck on login
- Check token expiration in Redux state
- Verify JWT format from backend

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`

## Future Enhancements

- [ ] Search and filtering for users/projects
- [ ] Pagination UI for large datasets
- [ ] Dark mode toggle
- [ ] Edit project details page
- [ ] Project team member management
- [ ] User activity audit logs
- [ ] Email notifications
- [ ] File upload for project documents
- [ ] Unit and integration tests
- [ ] E2E testing with Cypress

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# admin-project-system-frontend
