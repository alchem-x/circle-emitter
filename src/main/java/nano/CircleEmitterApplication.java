package nano;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

@SpringBootApplication
public class CircleEmitterApplication {

    public static void main(String... args) {
        var ignore = new SpringApplicationBuilder()
                .sources(CircleEmitterApplication.class)
                .headless(true)
                .run(args);
    }
}
