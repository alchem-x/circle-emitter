package alchem.ce.component;

import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionListener;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.URI;

@Component
public class AppUI {

    private final Environment env;
    private final Resource trayIcon;

    public AppUI(@NotNull Environment env,
                 @Value("classpath:icons/Check.png") Resource trayIcon) {
        this.env = env;
        this.trayIcon = trayIcon;
    }

    private String getAppLink() {
        var port = this.env.getProperty("local.server.port");
        return "http://localhost:%s".formatted(port);
    }

    public void start() {
        SwingUtilities.invokeLater(() -> {
            if (SystemTray.isSupported()) {
                var systemTray = SystemTray.getSystemTray();
                var trayIcon = this.createTray();
                try {
                    systemTray.add(trayIcon);
                } catch (AWTException ex) {
                    throw new IllegalStateException(ex);
                }
                openLink(this.getAppLink());
            }
        });
    }

    private @NotNull TrayIcon createTray() {
        var popupMenu = new PopupMenu();
        popupMenu.add(createMenuItem("Open CircleEmitter", (ev) -> openLink(this.getAppLink())));
        popupMenu.add(createMenuItem("Exit", (ev) -> System.exit(0)));
        var trayIcon = new TrayIcon(this.getTrayIconImage(), "App", popupMenu);
        trayIcon.setImageAutoSize(true);
        return trayIcon;
    }

    private @NotNull Image getTrayIconImage() {
        try {
            return Toolkit.getDefaultToolkit().createImage(this.trayIcon.getContentAsByteArray());
        } catch (IOException ex) {
            throw new UncheckedIOException(ex);
        }
    }

    private static @NotNull MenuItem createMenuItem(String label, ActionListener listener) {
        var menu = new MenuItem(label);
        menu.addActionListener(listener);
        return menu;
    }

    private static void openLink(String link) {
        try {
            Desktop.getDesktop().browse(URI.create(link));
        } catch (IOException ex) {
            throw new UncheckedIOException(ex);
        }
    }
}
