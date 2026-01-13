# LangLeague - Digitized Language Textbook Platform

[![JHipster](https://img.shields.io/badge/JHipster-8.11.0-blue.svg)](https://www.jhipster.tech)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://reactjs.org/)

**LangLeague** is an innovative EdTech platform that digitizes language textbooks, empowering teachers to create comprehensive learning materials with AI assistance and enabling students to learn interactively with gamification features.

## 🎯 Key Features

### 👨‍🏫 For Teachers

- **AI-Powered Content Creation**: Create vocabulary, grammar lessons, and exercises with AI support
- **Structured Curriculum**: Organize content into Books → Chapters → Learning Materials
- **Comprehensive Management**: Full CRUD operations for books, chapters, vocabulary, grammar, and exercises
- **Drag-and-Drop Ordering**: Easily reorder chapters and exercises
- **Dashboard Analytics**: Track student progress and engagement

### 👨‍🎓 For Students

- **Interactive Learning**: Study vocabulary with audio pronunciation, practice grammar, and complete exercises
- **AI-Powered Feedback**: Get instant feedback on exercises and grammar checks
- **Gamification**: Track learning streaks, earn achievements, and compete with peers
- **Study Tools**: Take notes, use flashcards, play educational games
- **Progress Tracking**: Bookmark chapters, view learning history, and monitor streaks

### 👨‍💼 For Admins

- **User Management**: Create teacher accounts, manage roles, lock/unlock accounts
- **System Monitoring**: Dashboard with key metrics and system overview
- **Content Moderation**: Oversee platform content and user activities

## 📚 Documentation

### Core Documentation

- **[Use Cases (62 Features)](./USE_CASES.md)** - Complete list of all platform features
- **[Gap Analysis Report](./LangLeague_UC_Gap_Analysis_Report.md)** - Feature completeness review and roadmap
- **[API Testing Guide](./API_TESTING_GUIDE.md)** - Backend API documentation and testing
- **[Developer Quick Reference](./DEVELOPER_QUICK_REFERENCE.md)** - Quick start guide for developers

### Project Status

- **[Current Status Report (Vietnamese)](./BAO_CAO.md)** - Latest project status and issues (13/01/2026)
- **[Technical Documentation (Vietnamese)](./tài%20liệu.md)** - Detailed technical review
- **[TODO Checklist](./TODO_CHECKLIST.md)** - Pending tasks and improvements

## 🚀 Quick Start

This application was generated using JHipster 8.11.0. For detailed JHipster documentation, visit [https://www.jhipster.tech/documentation-archive/v8.11.0](https://www.jhipster.tech/documentation-archive/v8.11.0).

## 🏗️ Technology Stack

### Backend

- **Framework**: Spring Boot 3.x (Java 21)
- **Security**: Spring Security with JWT authentication
- **Database**: MySQL 8.x
- **ORM**: Spring Data JPA / Hibernate
- **Build Tool**: Maven
- **API Documentation**: Swagger/OpenAPI 3.0

### Frontend

- **Framework**: React 18.x with TypeScript
- **State Management**: Redux Toolkit
- **UI Framework**: Bootstrap 5 + Reactstrap
- **Build Tool**: Webpack
- **Testing**: Jest + React Testing Library

### AI Integration

- **Platform**: OpenAI GPT (for content generation and feedback)
- **Features**: Vocabulary generation, grammar explanation, exercise creation, answer evaluation

### DevOps

- **Containerization**: Docker & Docker Compose
- **Code Quality**: SonarQube, ESLint, Checkstyle
- **CI/CD**: Configurable (Jenkins, GitLab CI, GitHub Actions)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java 21** or higher
- **Node.js 20.x** (LTS) and npm
- **MySQL 8.x** (or use Docker Compose to run it)
- **Maven 3.8+** (optional - use included `./mvnw` wrapper)
- **Docker & Docker Compose** (optional - for containerized services)

## Project Structure

Node is required for generation and recommended for development. `package.json` is always generated for a better development experience with prettier, commit hooks, scripts and so on.

In the project root, JHipster generates configuration files for tools like git, prettier, eslint, husky, and others that are well known and you can find references in the web.

`/src/*` structure follows default Java structure.

- `.yo-rc.json` - Yeoman configuration file
  JHipster configuration is stored in this file at `generator-jhipster` key. You may find `generator-jhipster-*` for specific blueprints configuration.
- `.yo-resolve` (optional) - Yeoman conflict resolver
  Allows to use a specific action when conflicts are found skipping prompts for files that matches a pattern. Each line should match `[pattern] [action]` with pattern been a [Minimatch](https://github.com/isaacs/minimatch#minimatch) pattern and action been one of skip (default if omitted) or force. Lines starting with `#` are considered comments and are ignored.
- `.jhipster/*.json` - JHipster entity configuration files

- `npmw` - wrapper to use locally installed npm.
  JHipster installs Node and npm locally using the build tool by default. This wrapper makes sure npm is installed locally and uses it avoiding some differences different versions can cause. By using `./npmw` instead of the traditional `npm` you can configure a Node-less environment to develop or test your application.
- `/src/main/docker` - Docker configurations for the application and services that the application depends on

## Development

The build system will install automatically the recommended version of Node and npm.

We provide a wrapper to launch npm.
You will only need to run this command when dependencies change in [package.json](package.json).

```
./npmw install
```

We use npm scripts and [Webpack][] as our build system.

Run the following commands in two separate terminals to create a blissful development experience where your browser
auto-refreshes when files change on your hard drive.

```
./mvnw
./npmw start
```

Npm is also used to manage CSS and JavaScript dependencies used in this application. You can upgrade dependencies by
specifying a newer version in [package.json](package.json). You can also run `./npmw update` and `./npmw install` to manage dependencies.
Add the `help` flag on any command to see how you can use it. For example, `./npmw help update`.

The `./npmw run` command will list all the scripts available to run for this project.

### PWA Support

JHipster ships with PWA (Progressive Web App) support, and it's turned off by default. One of the main components of a PWA is a service worker.

The service worker initialization code is commented out by default. To enable it, uncomment the following code in `src/main/webapp/index.html`:

```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').then(function () {
      console.log('Service Worker Registered');
    });
  }
</script>
```

Note: [Workbox](https://developers.google.com/web/tools/workbox/) powers JHipster's service worker. It dynamically generates the `service-worker.js` file.

### Managing dependencies

For example, to add [Leaflet][] library as a runtime dependency of your application, you would run following command:

```
./npmw install --save --save-exact leaflet
```

To benefit from TypeScript type definitions from [DefinitelyTyped][] repository in development, you would run following command:

```
./npmw install --save-dev --save-exact @types/leaflet
```

Then you would import the JS and CSS files specified in library's installation instructions so that [Webpack][] knows about them:
Note: There are still a few other things remaining to do for Leaflet that we won't detail here.

For further instructions on how to develop with JHipster, have a look at [Using JHipster in development][].

## Building for production

### Packaging as jar

To build the final jar and optimize the langleague application for production, run:

```
./mvnw -Pprod clean verify
```

This will concatenate and minify the client CSS and JavaScript files. It will also modify `index.html` so it references these new files.
To ensure everything worked, run:

```
java -jar target/*.jar
```

Then navigate to [http://localhost:8080](http://localhost:8080) in your browser.

Refer to [Using JHipster in production][] for more details.

### Packaging as war

To package your application as a war in order to deploy it to an application server, run:

```
./mvnw -Pprod,war clean verify
```

### JHipster Control Center

JHipster Control Center can help you manage and control your application(s). You can start a local control center server (accessible on http://localhost:7419) with:

```
docker compose -f src/main/docker/jhipster-control-center.yml up
```

## Testing

### Spring Boot tests

To launch your application's tests, run:

```
./mvnw verify
```

### Client tests

Unit tests are run by [Jest][]. They're located near components and can be run with:

```
./npmw test
```

## Others

### Code quality using Sonar

Sonar is used to analyse code quality. You can start a local Sonar server (accessible on http://localhost:9001) with:

```
docker compose -f src/main/docker/sonar.yml up -d
```

Note: we have turned off forced authentication redirect for UI in [src/main/docker/sonar.yml](src/main/docker/sonar.yml) for out of the box experience while trying out SonarQube, for real use cases turn it back on.

You can run a Sonar analysis with using the [sonar-scanner](https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner) or by using the maven plugin.

Then, run a Sonar analysis:

```
./mvnw -Pprod clean verify sonar:sonar -Dsonar.login=admin -Dsonar.password=admin
```

If you need to re-run the Sonar phase, please be sure to specify at least the `initialize` phase since Sonar properties are loaded from the sonar-project.properties file.

```
./mvnw initialize sonar:sonar -Dsonar.login=admin -Dsonar.password=admin
```

Additionally, Instead of passing `sonar.password` and `sonar.login` as CLI arguments, these parameters can be configured from [sonar-project.properties](sonar-project.properties) as shown below:

```
sonar.login=admin
sonar.password=admin
```

For more information, refer to the [Code quality page][].

### Docker Compose support

JHipster generates a number of Docker Compose configuration files in the [src/main/docker/](src/main/docker/) folder to launch required third party services.

For example, to start required services in Docker containers, run:

```
docker compose -f src/main/docker/services.yml up -d
```

To stop and remove the containers, run:

```
docker compose -f src/main/docker/services.yml down
```

[Spring Docker Compose Integration](https://docs.spring.io/spring-boot/reference/features/dev-services.html) is enabled by default. It's possible to disable it in application.yml:

```yaml
spring:
  ...
  docker:
    compose:
      enabled: false
```

You can also fully dockerize your application and all the services that it depends on.
To achieve this, first build a Docker image of your app by running:

```sh
npm run java:docker
```

Or build a arm64 Docker image when using an arm64 processor os like MacOS with M1 processor family running:

```sh
npm run java:docker:arm64
```

Then run:

```sh
docker compose -f src/main/docker/app.yml up -d
```

For more information refer to [Using Docker and Docker-Compose][], this page also contains information on the Docker Compose sub-generator (`jhipster docker-compose`), which is able to generate Docker configurations for one or several JHipster applications.

## 🎓 Usage Guide

### Default Users

After starting the application, you can login with these default accounts:

| Role    | Username  | Password  | Description                     |
| ------- | --------- | --------- | ------------------------------- |
| Admin   | `admin`   | `admin`   | Full system access              |
| Teacher | `teacher` | `teacher` | Content creation and management |
| Student | `student` | `student` | Learning and practice           |

### Accessing the Application

- **Frontend**: http://localhost:9000
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui/index.html
- **H2 Console** (dev only): http://localhost:8080/h2-console

### Key Workflows

#### For Teachers:

1. Login as teacher
2. Navigate to "Books" → Create a new book
3. Add chapters to your book
4. Add vocabulary, grammar, and exercises to each chapter
5. Use AI assistance for content generation
6. Reorder content using drag-and-drop

#### For Students:

1. Login as student
2. Browse available books on homepage
3. Enroll in a book
4. Navigate through chapters and learn content
5. Complete exercises and get AI feedback
6. Track your learning streak and earn achievements
7. Use flashcards and games for practice

#### For Admins:

1. Login as admin
2. Manage users (create teachers, change roles, lock accounts)
3. Monitor system via dashboard
4. Review platform analytics

## 🔌 API Endpoints

### Authentication

- `POST /api/authenticate` - Login
- `POST /api/register` - Register new student
- `GET /api/activate` - Activate account
- `POST /api/account/reset-password/init` - Request password reset

### Books (Teacher)

- `GET /api/books` - List all books
- `POST /api/books` - Create book
- `PUT /api/books/{id}` - Update book
- `DELETE /api/books/{id}` - Delete book

### Chapters/Units (Teacher)

- `GET /api/units/by-book/{bookId}` - Get chapters by book
- `POST /api/units` - Create chapter
- `PUT /api/books/{id}/units/reorder` - Reorder chapters

### Vocabulary (Teacher)

- `GET /api/vocabularies/by-unit/{unitId}` - Get vocabulary by chapter
- `POST /api/vocabularies` - Create vocabulary (with AI support)
- `PUT /api/vocabularies/{id}` - Update vocabulary

### Exercises (Student)

- `GET /api/exercises/by-unit/{unitId}` - Get exercises by chapter
- `POST /api/exercise-attempts` - Submit exercise attempt
- `POST /api/exercises/check-answer` - Check answer with AI

### Enrollment (Student)

- `POST /api/enrollments` - Enroll in book
- `GET /api/enrollments?myCourses=true` - Get my enrolled books
- `DELETE /api/enrollments/{id}` - Unenroll from book

📖 **Full API documentation**: See [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)

## 🐛 Known Issues & Troubleshooting

### Common Issues

1. **Docker auto-start error**: Disable in `application-dev.yml`:

   ```yaml
   spring:
     docker:
       compose:
         enabled: false
   ```

2. **Frontend build errors**: Run `./npmw install` to update dependencies

3. **Swagger 401 errors**: Click "Authorize" button and paste your JWT token

4. **Database connection issues**: Ensure MySQL is running or use Docker:
   ```bash
   docker compose -f src/main/docker/mysql.yml up -d
   ```

For detailed issues and resolutions, see [BAO_CAO.md](./BAO_CAO.md)

## 📊 Project Statistics

- **Total Use Cases**: 62 (100% implemented)
- **AI-Powered Features**: 8
- **Supported Roles**: 3 (Admin, Teacher, Student)
- **Lines of Code**: ~50,000+ (Backend + Frontend)
- **Test Coverage**: In progress

## 🗺️ Roadmap

### Phase 1: MVP Enhancement (Priority)

- [ ] Content publishing workflow (Draft/Published states)
- [ ] Exercise retry and history review
- [ ] GDPR compliance (account deletion, data export)
- [ ] Enhanced admin moderation tools
- [ ] Notification system

### Phase 2: User Experience (3 months)

- [ ] Learning analytics dashboard
- [ ] Book preview before enrollment
- [ ] Teacher progress monitoring
- [ ] Advanced search and filtering

### Phase 3: Engagement Features (6 months)

- [ ] Leaderboards and social features
- [ ] Advanced gamification
- [ ] Discussion forums
- [ ] Certificate generation

📋 **Full roadmap**: See [LangLeague_UC_Gap_Analysis_Report.md](./LangLeague_UC_Gap_Analysis_Report.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is part of a graduation thesis (DATN - Đồ Án Tốt Nghiệp).

## 🙋‍♂️ Support

For issues and questions:

- Check [Known Issues](#-known-issues--troubleshooting)
- Review [API Testing Guide](./API_TESTING_GUIDE.md)
- Contact the development team

---

## Continuous Integration (optional)

To configure CI for your project, run the ci-cd sub-generator (`jhipster ci-cd`), this will let you generate configuration files for a number of Continuous Integration systems. Consult the [Setting up Continuous Integration][] page for more information.

[JHipster Homepage and latest documentation]: https://www.jhipster.tech
[JHipster 8.11.0 archive]: https://www.jhipster.tech/documentation-archive/v8.11.0
[Using JHipster in development]: https://www.jhipster.tech/documentation-archive/v8.11.0/development/
[Using Docker and Docker-Compose]: https://www.jhipster.tech/documentation-archive/v8.11.0/docker-compose
[Using JHipster in production]: https://www.jhipster.tech/documentation-archive/v8.11.0/production/
[Running tests page]: https://www.jhipster.tech/documentation-archive/v8.11.0/running-tests/
[Code quality page]: https://www.jhipster.tech/documentation-archive/v8.11.0/code-quality/
[Setting up Continuous Integration]: https://www.jhipster.tech/documentation-archive/v8.11.0/setting-up-ci/
[Node.js]: https://nodejs.org/
[NPM]: https://www.npmjs.com/
[Webpack]: https://webpack.github.io/
[BrowserSync]: https://www.browsersync.io/
[Jest]: https://jestjs.io
[Leaflet]: https://leafletjs.com/
[DefinitelyTyped]: https://definitelytyped.org/
