package nano.common;

import java.io.IOException;
import java.net.ServerSocket;

public class AppEnv {

    private static final int DEFAULT_SERVER_PORT = 8001;

    private static final int port = createPort();

    public static int getAppPort() {
        return port;
    }

    private static int createPort() {
        var p = DEFAULT_SERVER_PORT;
        while (!isAvailable(p)) {
            p++;
        }
        return p;
    }


    public static boolean isUIMode() {
        return "UI".equals(System.getenv("APP"))
                || "UI".equals(System.getProperty("APP"));
    }

    private static boolean isAvailable(int port) {
        try (var ignored = new ServerSocket(port)) {
            return true;
        } catch (IOException ex) {
            return false;
        }
    }
}
