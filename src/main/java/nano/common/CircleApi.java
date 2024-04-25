package nano.common;

public class CircleApi {

    private final String host;
    private final String projectSlug;

    public CircleApi(String host, String projectSlug) {
        this.host = host;
        this.projectSlug = projectSlug;
    }

    public String getTriggerUrl() {
        return "https://%s/api/v2/project/%s/pipeline".formatted(this.host, this.projectSlug);
    }
}
