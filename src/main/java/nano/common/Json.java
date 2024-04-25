package nano.common;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fetch.support.UnsafeUtils;
import org.jetbrains.annotations.NotNull;

import java.util.Map;

public abstract class Json {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static @NotNull String toJsonString(@NotNull Object object) {
        try {
            return objectMapper.writeValueAsString(object);
        } catch (JsonProcessingException ex) {
            UnsafeUtils.getUnsafe().throwException(ex);
            return "";
        }
    }

    @SuppressWarnings("unchecked")
    public static Map<String, Object> fromJsonString(String jsonString) {
        try {
            return (Map<String, Object>) objectMapper.readValue(jsonString, Map.class);
        } catch (JsonProcessingException ex) {
            UnsafeUtils.getUnsafe().throwException(ex);
            return Map.of();
        }
    }
}
