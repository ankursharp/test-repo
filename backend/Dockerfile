FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn dependency:go-offline -B

RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre
RUN useradd -r -u 1001 appuser \
  && mkdir -p /app \
  && chown -R appuser:appuser /app

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]