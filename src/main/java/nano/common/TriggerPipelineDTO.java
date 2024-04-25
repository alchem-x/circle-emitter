package nano.common;

import java.util.Map;

public record TriggerPipelineDTO(
        String host,
        String projectSlug,
        String circleToken,
        String branch,
        Map<String, Object> parameters
) {

}
