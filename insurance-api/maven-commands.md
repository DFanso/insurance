# Maven Commands for Development

This document provides a reference for commonly used Maven commands during the development of the insurance-api project.

## Basic Commands

| Command | Description |
|---------|-------------|
| `./mvnw spring-boot:run` | Run the application |
| `./mvnw clean install` | Clean and build the project |
| `./mvnw test` | Run tests only |
| `./mvnw package` | Package the application (creates a JAR file in target/) |

## Additional Commands

| Command | Description |
|---------|-------------|
| `./mvnw install -DskipTests` | Skip tests during build |
| `./mvnw install -P<profile-name>` | Build with specific profile |
| `./mvnw versions:display-dependency-updates` | Check for dependency updates |
| `./mvnw site` | Generate project documentation |

## Debug Commands

| Command | Description |
|---------|-------------|
| `./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=8787"` | Run in debug mode |

## Production Commands

| Command | Description |
|---------|-------------|
| `./mvnw clean package -Pproduction` | Create a deployable JAR file for production |

## Notes

- On Windows, use `mvnw.cmd` instead of `./mvnw`
- If you have Maven installed globally, you can also use `mvn` instead of the wrapper
- The wrapper ensures consistent Maven version across development environments 