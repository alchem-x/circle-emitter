package nano;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.Resource;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionListener;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.URI;
import java.util.function.BiFunction;
import java.util.function.Consumer;
import java.util.function.Supplier;

@SpringBootApplication
public class CircleEmitterApplication {

    private static boolean isUIMode() {
        return "UI".equals(System.getenv("APP"))
                || "UI".equals(System.getProperty("APP"));
    }

    public static void main(String... args) {
        var ignore = new SpringApplicationBuilder()
                .sources(CircleEmitterApplication.class)
                .headless(!isUIMode())
                .run(args);
    }

    @Bean
    public ApplicationRunner applicationRunner(
            @Value("${server.port}") String port,
            @Value("classpath:icons/Jvav.png") Resource icon) {
        var APP_LINK = "http://localhost:%s".formatted(port);

        var openLink = (Consumer<String>) (link) -> {
            try {
                Desktop.getDesktop().browse(URI.create(link));
            } catch (IOException ex) {
                throw new UncheckedIOException(ex);
            }
        };

        var getTrayIconImage = (Supplier<Image>) () -> {
            try {
                return Toolkit.getDefaultToolkit().createImage(icon.getContentAsByteArray());
            } catch (IOException ex) {
                throw new UncheckedIOException(ex);
            }
        };

        var createPopupMenuItem = (BiFunction<String, ActionListener, MenuItem>) (label, listener) -> {
            var item = new MenuItem(label);
            item.addActionListener(listener);
            return item;
        };

        return (args) -> {
            if (isUIMode()) {
                System.setProperty("apple.awt.UIElement", "true");
                SwingUtilities.invokeLater(() -> {
                    if (SystemTray.isSupported()) {
                        var systemTray = SystemTray.getSystemTray();
                        var trayPopupMenu = new PopupMenu();
                        trayPopupMenu.add(createPopupMenuItem.apply("Open", (ev) -> openLink.accept(APP_LINK)));
                        trayPopupMenu.add(createPopupMenuItem.apply("Exit",(ev) -> System.exit(0)));
                        var trayIcon = new TrayIcon(getTrayIconImage.get(), "Circle Emitter", trayPopupMenu);
                        trayIcon.setImageAutoSize(true);
                        try {
                            systemTray.add(trayIcon);
                        } catch (AWTException ex) {
                            throw new RuntimeException(ex);
                        }
                        openLink.accept(APP_LINK);
                    }
                });
            }
        };
    }
}
