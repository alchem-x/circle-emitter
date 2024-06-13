package alchem.ce.common;

import java.util.Map;

public record TriggerSpec(
        String host,
        String projectSlug,
        String circleToken,
        String branch,
        Map<String, Object> parameters
) {

}
