package org.example.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BackendApplication {

    public static void main(String[] args) {
        Dotenv.configure().directory("..").ignoreIfMissing().systemProperties().load();
        Dotenv.configure().directory("./").ignoreIfMissing().systemProperties().load();
        SpringApplication.run(BackendApplication.class, args);
    }

}
