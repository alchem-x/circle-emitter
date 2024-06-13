package alchem.ce.component;

import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import javax.swing.*;
import java.awt.*;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.URI;

@Component
public class AppUI {

    private final Environment env;
    private final Resource icon;

    public AppUI(@NotNull Environment env,
                 @Value("classpath:icons/Check.png") Resource icon) {
        this.env = env;
        this.icon = icon;
    }

    private String getAppLink() {
        var port = this.env.getProperty("local.server.port");
        return "http://localhost:%s".formatted(port);
    }

    public void start() {
        SwingUtilities.invokeLater(() -> {
            if (SystemTray.isSupported()) {
                var systemTray = SystemTray.getSystemTray();
                var trayIcon = this.createTrayIcon();
                try {
                    systemTray.add(trayIcon);
                } catch (AWTException ex) {
                    throw new IllegalStateException(ex);
                }
                openLink(this.getAppLink());
            }
        });
    }

    private @NotNull TrayIcon createTrayIcon() {
        var popup = new PopupMenu();
        var mi = new MenuItem("Open CircleEmitter");
        mi.addActionListener((ev) -> openLink(this.getAppLink()));
        popup.add(mi);
        var image = this.getTrayIconImage();
        var icon = new TrayIcon(image, "CircleEmitter", popup);
        icon.setImageAutoSize(true);
        return icon;
    }

    private @NotNull Image getTrayIconImage() {
        try {
            return Toolkit.getDefaultToolkit().createImage(this.icon.getContentAsByteArray());
        } catch (IOException ex) {
            throw new UncheckedIOException(ex);
        }
    }

    private static void openLink(String link) {
        try {
            Desktop.getDesktop().browse(URI.create(link));
        } catch (IOException ex) {
            throw new UncheckedIOException(ex);
        }
    }
}
