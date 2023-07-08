package alchem.ce;

import alchem.ce.common.AppEnv;
import alchem.ce.component.AppUI;
import org.jetbrains.annotations.NotNull;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class CircleEmitterApplication {

    public static void main(String... args) {
        var ignore = new SpringApplicationBuilder()
                .sources(CircleEmitterApplication.class)
                .headless(!AppEnv.isUIMode())
                .run(args);
    }

    @Bean
    public RestTemplate restTemplate(@NotNull RestTemplateBuilder builder) {
        return builder.build();
    }

    @Bean
    public WebServerFactoryCustomizer<ConfigurableServletWebServerFactory> serverPortCustomizer() {
        return (factory) -> factory.setPort(AppEnv.createPort());
    }

    @Bean
    public ApplicationRunner runner(@NotNull AppUI ui) {
        return (args) -> {
            if (AppEnv.isUIMode()) {
                ui.start();
            }
        };
    }
}
