import ch.qos.logback.classic.encoder.PatternLayoutEncoder

import java.nio.charset.Charset

if (System.getProperty('micronaut.environments')?.contains("prod")) {
    appender("ROLLING_FILE", RollingFileAppender) {
        file = "logs/today.log"
        rollingPolicy(TimeBasedRollingPolicy) {
            fileNamePattern = "logs/log.%d{yyyy-MM-dd}.%i.log"
            timeBasedFileNamingAndTriggeringPolicy(SizeAndTimeBasedFNATP) {
                maxFileSize = "50MB"
            }
            maxHistory = 15
        }
        encoder(PatternLayoutEncoder) {
            charset = Charset.forName("UTF-8")
            pattern = '{"time": "%d{HH:mm:ss.SSS}", "thread": "%thread", "level": "%level", "logger": "%logger{36}", "message": "%msg"}%n'
        }
    }
    root(INFO, ['ROLLING_FILE'])
} else {
    appender("STDOUT", ConsoleAppender) {
        encoder(PatternLayoutEncoder) {
            pattern = '%yellow(%d{HH:mm:ss.SSS}) [%thread] %highlight(%-5level) %-36logger{36} - %msg%n'
        }
    }
    root(INFO, ['STDOUT'])
}
