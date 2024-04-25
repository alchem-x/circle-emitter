package fetch;

import fetch.support.Iterables;
import fetch.support.Pair;
import org.jetbrains.annotations.NotNull;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.net.URLConnection;
import java.net.http.HttpRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import static java.nio.charset.StandardCharsets.UTF_8;

public class MultiPartBodyPublisher {

    private final List<Pair<String, String>> stringPartList = new ArrayList<>();
    private final List<Pair<String, FilePart>> filePartList = new ArrayList<>();

    private final String boundary = UUID.randomUUID().toString();

    public void addPart(@NotNull String name, @NotNull String value) {
        Objects.requireNonNull(name, "name must be not null");
        Objects.requireNonNull(value, "value must be not null");
        this.stringPartList.add(Pair.of(name, value));
    }

    public void addPart(@NotNull String name, @NotNull MultiPartBodyPublisher.FilePart filePart) {
        Objects.requireNonNull(name, "name must be not null");
        Objects.requireNonNull(filePart, "filePart must be not null");
        this.filePartList.add(Pair.of(name, filePart));
    }

    public @NotNull HttpRequest.BodyPublisher build() {
        if (this.stringPartList.isEmpty() && this.filePartList.isEmpty()) {
            throw new IllegalStateException("Must have at least one part to build multipart message.");
        }
        return HttpRequest.BodyPublishers.ofByteArrays(this.getBytes());
    }

    public @NotNull String getBoundary() {
        return this.boundary;
    }

    private @NotNull Iterable<byte[]> getBytes() {
        return Iterables.compose(
                this.getStringPartBytes(),
                this.getFilePartByteArray(),
                this.getFinalBoundaryBytes()
        );
    }

    private @NotNull Iterable<byte[]> getStringPartBytes() {
        return Iterables.map(this.stringPartList, entry -> {
            var name = entry.left();
            var value = entry.right();
            var part = "--" + this.boundary + "\r\n" +
                    "Content-Disposition: form-data; name=\"" + name + "\"\r\n" +
                    "Content-Type: text/plain; charset=UTF-8\r\n\r\n" + value + "\r\n";
            return List.of(part.getBytes(UTF_8));
        });
    }

    private @NotNull Iterable<byte[]> getFilePartByteArray() {
        return Iterables.map(this.filePartList, entry -> {
            var name = entry.left();
            var filePart = entry.right();
            var filename = filePart.getFilename();
            var contentType = filePart.getContentType();
            var partHeader = "--" + this.boundary + "\r\n" +
                    "Content-Disposition: form-data; name=\"" + name + "\"; filename=\"" + filename + "\"\r\n" +
                    "Content-Type: " + contentType + "\r\n\r\n";
            return Iterables.compose(
                    List.of(partHeader.getBytes(UTF_8)),
                    new ByteArrayIterable(filePart::getInputStream),
                    List.of("\r\n".getBytes(UTF_8))
            );
        });
    }

    private Iterable<byte[]> getFinalBoundaryBytes() {
        return List.of(("--" + this.boundary + "--").getBytes(UTF_8));
    }

    @FunctionalInterface
    public interface FilePart {

        InputStream getInputStream();

        default String getFilename() {
            return "";
        }

        default String getContentType() {
            return "application/octet-stream";
        }

        static @NotNull FilePart from(@NotNull Resource resource) {
            Objects.requireNonNull(resource, "supplier must be not null");
            return new FilePart() {

                @Override
                public InputStream getInputStream() {
                    try {
                        return resource.getInputStream();
                    } catch (IOException ex) {
                        throw new UncheckedIOException(ex);
                    }
                }

                @Override
                public String getFilename() {
                    return Objects.requireNonNullElse(resource.getFilename(), "");
                }

                @Override
                public String getContentType() {
                    var contentType = URLConnection.guessContentTypeFromName(this.getFilename());
                    return Objects.requireNonNullElse(contentType, "application/octet-stream");
                }
            };
        }
    }
}