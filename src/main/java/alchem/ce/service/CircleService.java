package alchem.ce.service;

import alchem.ce.common.CircleApi;
import alchem.ce.common.TriggerSpec;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.RequestEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class CircleService {

    private final RestTemplate fetch;

    public CircleService(RestTemplate fetch) {
        this.fetch = fetch;
    }

    public Map<?, ?> trigger(@NotNull TriggerSpec spec) {
        var circleApi = new CircleApi(spec.host(), spec.projectSlug());
        var request = RequestEntity.post(URI.create(circleApi.getTriggerUrl()))
                .header("Circle-Token", spec.circleToken())
                .body(Map.of(
                        "branch", spec.branch(),
                        "parameters", spec.parameters()
                ));
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
