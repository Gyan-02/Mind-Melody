
# Build stage
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Environment variables (can be overridden at runtime)
ENV PORT=3001
ENV DB_HOST=localhost
ENV DB_PORT=3306
ENV DB_NAME=mind_melody
ENV DB_USER=root
ENV DB_PASSWORD=password

EXPOSE ${PORT}

ENTRYPOINT ["java", "-jar", "app.jar"]
