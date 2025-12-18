
package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.example.repository")
@EntityScan(basePackages = "com.example.model")
public class Main {
    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }
}
