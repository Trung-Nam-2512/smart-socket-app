package com.nguyentrungnam.lap306;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.ResourceResolver;
import org.springframework.web.servlet.resource.ResourceResolverChain;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * Configuration to serve frontend static files and handle SPA routing
 * API routes are excluded from SPA routing
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    // List of API path prefixes that should not be handled by SPA routing
    private static final List<String> API_PATHS = Arrays.asList(
        "/api/",
        "/devices",
        "/ws-sensor",
        "/ws-sensor-sockjs"
    );

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(false)
                .addResolver(new SpaResourceResolver());
    }

    /**
     * Custom ResourceResolver to handle SPA routing
     * Redirects non-API routes to index.html for React Router
     */
    private static class SpaResourceResolver implements ResourceResolver {
        @Override
        public Resource resolveResource(HttpServletRequest request, String requestPath,
                                       List<? extends Resource> locations, ResourceResolverChain chain) {
            // Check if this is an API route
            if (isApiRoute(requestPath)) {
                return null; // Let Spring handle API routes normally
            }

            // Try to resolve the requested resource using the chain
            Resource resource = chain.resolveResource(request, requestPath, locations);
            if (resource != null && resource.exists()) {
                return resource;
            }

            // If resource doesn't exist and it's not an API route, serve index.html
            // This enables React Router to handle client-side routing
            return getIndexResource(locations);
        }

        @Override
        public String resolveUrlPath(String resourcePath, List<? extends Resource> locations,
                                    ResourceResolverChain chain) {
            if (isApiRoute(resourcePath)) {
                return null;
            }
            String resolved = chain.resolveUrlPath(resourcePath, locations);
            if (resolved != null) {
                return resolved;
            }
            // For SPA routing, return the resource path as-is
            return resourcePath;
        }

        private boolean isApiRoute(String path) {
            if (path == null) {
                return false;
            }
            return API_PATHS.stream().anyMatch(path::startsWith);
        }

        private Resource getIndexResource(List<? extends Resource> locations) {
            for (Resource location : locations) {
                try {
                    Resource indexResource = location.createRelative("index.html");
                    if (indexResource.exists()) {
                        return indexResource;
                    }
                } catch (IOException e) {
                    // Ignore
                }
            }
            return null;
        }
    }
}

