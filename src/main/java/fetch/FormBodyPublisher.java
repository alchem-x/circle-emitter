package fetch;

import fetch.support.Pair;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.net.URLEncoder;
import java.net.http.HttpRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import static java.nio.charset.StandardCharsets.UTF_8;

public class FormBodyPublisher {

    private final List<Pair<String, String>> data = new ArrayList<>();

    public void append(@NotNull String name, @Nullable String value) {
        Objects.requireNonNull(name, "name must be not null");
        value = Objects.requireNonNullElse(value, "");
        this.data.add(Pair.of(name, value));
    }

    public HttpRequest.BodyPublisher build() {
        var body = this.data.stream().map(FormBodyPublisher::stringify)
                .collect(Collectors.joining("&"));
        return HttpRequest.BodyPublishers.ofString(body);
    }

    public static FormBodyPublisher from(@NotNull Map<String, ?> map) {
        var publisher = new FormBodyPublisher();
        map.forEach((name, value) -> {
            Objects.requireNonNull(name, "name must be not null");
            if (value == null || value instanceof String) {
                publisher.append(name, (String) value);
            } else {
                publisher.append(name, value.toString());
            }
        });
        return publisher;
    }

    private static String stringify(Pair<String, String> pair) {
        return String.join("=", encode(pair.left()), encode(pair.right()));
    }

    private static String encode(String s) {
        return URLEncoder.encode(s, UTF_8);
    }
}
