package alchem.ce.service;

import alchem.ce.common.ProxySpec;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpMethod;
import org.springframework.http.RequestEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RequiredArgsConstructor
@Service
public class AppService {

    private final RestTemplate fetch;

    public Map<?, ?> proxy(@NotNull ProxySpec spec) {
        var builder = RequestEntity.method(HttpMethod.valueOf(spec.getMethod()), URI.create(spec.getUrl()));
        if (spec.getHeaders() != null) {
            spec.getHeaders().forEach(builder::header);
        }
        var request = spec.getBody() != null ? builder.body(spec.getBody()) : builder.build();
        try {
            var response = this.fetch.exchange(request, Map.class);
            return response.getBody();
        } catch (HttpClientErrorException ex) {
            return ex.getResponseBodyAs(Map.class);
        }
    }

    public void quit() {
        CompletableFuture.runAsync(() -> System.exit(0));
    }
}
