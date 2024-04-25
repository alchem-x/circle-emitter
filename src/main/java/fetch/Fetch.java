package fetch;

import fetch.support.UnsafeUtils;
import org.jetbrains.annotations.NotNull;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Objects;

public abstract class Fetch {

    private static final HttpClient httpClient = HttpClient.newHttpClient();

    public static String fetchString(@NotNull String url) {
        var httpRequest = HttpRequest.newBuilder(URI.create(url)).build();
        var bodyHandler = HttpResponse.BodyHandlers.ofString();
        var response = fetch(httpRequest, bodyHandler);
        return Objects.requireNonNull(response).body();
    }

    public static HttpResponse<InputStream> fetch(@NotNull String url) {
        return fetch(HttpRequest.newBuilder(URI.create(url)).build());
    }

    public static HttpResponse<InputStream> fetch(@NotNull HttpRequest httpRequest) {
        return fetch(httpRequest, HttpResponse.BodyHandlers.ofInputStream());
    }

    public static <T> HttpResponse<T> fetch(@NotNull HttpRequest httpRequest, HttpResponse.@NotNull BodyHandler<T> bodyHandler) {
        try {
            return httpClient.send(httpRequest, bodyHandler);
        } catch (IOException | InterruptedException ex) {
            UnsafeUtils.getUnsafe().throwException(ex);
            return null;
        }
    }

    public static @NotNull MultiPartBodyPublisher newMultiPartBodyPublisher() {
        return new MultiPartBodyPublisher();
    }

    public static @NotNull FormBodyPublisher newFormBodyPublisher() {
        return new FormBodyPublisher();
    }
}
