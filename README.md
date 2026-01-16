# Commit Coach

**Commit Coach** is a full-stack application that analyzes GitHub repositories to provide insights on commit history, contributor activity, production readiness, and technical debt. It also includes a modern frontend with authentication, a dashboard, and interactive visualizations for easy analysis.

---

## Features

### Backend
- Built with **Node.js** and **Express**
- **MongoDB** database for storing repository analysis and user data
- RESTful APIs for:
  - User signup, login, and authentication
  - Adding and analyzing GitHub repositories
  - Fetching commit history and contributor stats
- **Authentication & Authorization**:
  - Secure login with hashed passwords using **bcrypt**
  - JWT-based token authentication
- **Data Analysis**:
  - Commit frequency tracking
  - Contributor analysis (commits per user)
  - Production readiness and technical debt evaluation
- **Validation & Security**:
  - Input validation for all API endpoints
  - Prevents invalid or duplicate data entry
- **Performance**:
  - Implemented caching to reduce repeated database queries
- **Testing**:
  - Unit testing using **Jest** for backend APIs

### Frontend
- Built with **React.js**
- **User-friendly dashboard** showing:
  - Repository insights
  - Commit trends and graphs
  - Contributor stats
- **Authentication flow**:
  - Signup → Login → Dashboard
  - Displays logged-in user name with logout functionality
- **Interactive features**:
  - Visualizations for commit statistics
  - Smooth navigation and responsive UI
- **Validation & UX**:
  - Form validation on signup/login and repo submission

### Other Features
- Clean project structure with separate backend and frontend folders
- Ready for further enhancements like AI-based analysis or advanced system metrics

---

## Tech Stack
| Layer         | Technology |
|---------------|------------|
| Frontend      | React.js, HTML, CSS, JavaScript |
| Backend       | Node.js, Express.js |
| Database      | MongoDB |
| Authentication| JWT, bcrypt |
| Testing       | Jest |
| Performance   | Caching implemented for APIs |
| Validation    | Input validation for all routes |
| APIs          | RESTful endpoints for repo analysis & user management |
| Others        | Axios for frontend API calls, Chart.js for data visualization |

---

## Usage
1. **Signup** as a new user
2. **Login** using your credentials
3. Add GitHub repository URLs to analyze
4. View dashboard:
   - Commit trends over time
   - Contributors and their activity
   - Overall repository health (production readiness & technical debt)

---

## Future Enhancements
- AI-based commit analysis and suggestions
- Advanced dashboard metrics
- CI/CD integration
- Notifications for repository changes

---

## Author
**Khushi Dandotiya**  
- B.Tech, Computer Science & Engineering  
- GitHub: [https://github.com/Khushidandotiya28](https://github.com/Khushidandotiya28)
