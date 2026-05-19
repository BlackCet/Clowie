# Stage 1: Build the application using Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# We use standard Docker Maven here, completely bypassing the mvnw permission issue!
RUN mvn clean package -DskipTests

# Stage 2: Run the application on a lightweight Java server
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Copy the compiled .jar file from Stage 1
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]