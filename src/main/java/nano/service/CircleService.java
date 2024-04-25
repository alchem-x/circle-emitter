package nano.service;

import fetch.Fetch;
import nano.common.CircleApi;
import nano.common.Json;
import nano.common.TriggerPipelineDTO;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;
import java.util.Objects;

@Service
public class CircleService {


    public @NotNull Map<String, Object> triggerPipeline(@NotNull TriggerPipelineDTO triggerPipelineDTO) {
        var circleApi = new CircleApi(triggerPipelineDTO.host(), triggerPipelineDTO.projectSlug());
        var requestBodyString = Json.toJsonString(Map.of(
                "branch", triggerPipelineDTO.branch(),
                "parameters", triggerPipelineDTO.parameters()
        ));
        var request = HttpRequest
                .newBuilder()
                .uri(URI.create(circleApi.getTriggerUrl()))
                .POST(HttpRequest.BodyPublishers.ofString(requestBodyString))
                .header("Content-Type", "application/json")
                .header("Circle-Token", triggerPipelineDTO.circleToken())
                .build();
        var response = Fetch.fetch(request, HttpResponse.BodyHandlers.ofString());
        var responseBodyString = Objects.requireNonNull(response).body();
        try {
            return Json.fromJsonString(responseBodyString);
        } catch (Exception ex) {
            return Map.of("error", responseBodyString);
        }
    }
}
