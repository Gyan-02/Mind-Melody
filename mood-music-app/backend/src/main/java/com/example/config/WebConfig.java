package com.example.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Serve frontend static files
        registry.addResourceHandler("/**")
                .addResourceLocations("file:frontend/", "classpath:/static/")
                .setCachePeriod(0);
    }

    @Override
    public void addViewControllers(@NonNull ViewControllerRegistry registry) {
        // Serve index.html for root path
        registry.addViewController("/").setViewName("forward:/index.html");
    }
}
