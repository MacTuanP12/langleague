# ==================================================
# Multi-stage Dockerfile for LangLeague Full Stack
# Build: docker build -t langleague-app .
# ==================================================

# ==================================================
# Stage 1: Build Frontend
# ==================================================
FROM node:22.15.0-alpine AS frontend-build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY npmw* ./

# Install dependencies
RUN npm ci --prefer-offline --no-audit

# Copy frontend source and config
COPY src/main/webapp ./src/main/webapp/
COPY webpack ./webpack/
COPY tsconfig*.json ./
COPY postcss.config.js ./
COPY eslint.config.mjs ./
COPY jest.conf.js ./

# Format code with Prettier before building
RUN npm run prettier:format

# Build frontend with increased memory
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run webapp:prod

# ==================================================
# Stage 2: Build Backend
# ==================================================
FROM maven:3.9-eclipse-temurin-21 AS backend-build

WORKDIR /app

# Copy Maven wrapper and pom.xml first (for dependency caching)
COPY pom.xml ./
COPY sonar-project.properties ./
COPY mvnw ./
COPY mvnw.cmd ./
COPY .mvn/ .mvn/

# Copy backend source
COPY src/main/java ./src/main/java/
COPY src/main/resources ./src/main/resources/

# Copy built frontend static files from previous stage
COPY --from=frontend-build /app/target/classes/static ./src/main/resources/static/

# Build backend JAR (skip frontend plugin since we already built it)
RUN ./mvnw clean package -DskipTests \
    -Dskip.npm \
    -Dskip.installnodenpm \
    -Pprod

# ==================================================
# Stage 3: Runtime Image
# ==================================================
FROM eclipse-temurin:21-jre-alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

WORKDIR /app

# Create non-root user
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy JAR from build stage
COPY --from=backend-build --chown=spring:spring /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=90s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# JVM options for production
ENV JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Run application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar app.jar"]

