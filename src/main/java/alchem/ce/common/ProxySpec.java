package alchem.ce.common;

import lombok.Data;

import java.util.Map;

@Data
public class ProxySpec {
    private String url;
    private String method;
    private Map<String, String> headers;
    private Map<String, Object> body;
}
