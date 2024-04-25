package fetch;

import org.jetbrains.annotations.NotNull;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.util.Iterator;
import java.util.NoSuchElementException;
import java.util.function.Supplier;

public class ByteArrayIterable implements Iterable<byte[]> {

    private final Supplier<InputStream> inputStreamSupplier;

    public ByteArrayIterable(Supplier<InputStream> inputStreamSupplier) {
        this.inputStreamSupplier = inputStreamSupplier;
    }

    @Override
    public @NotNull Iterator<byte[]> iterator() {
        var inputStream = this.inputStreamSupplier.get();
        return new Iterator<>() {

            private final byte[] buffer = new byte[8192];
            private boolean drained = false;

            @Override
            public boolean hasNext() {
                return !this.drained;
            }

            @Override
            public byte[] next() {
                this.ensureNotDrained();
                int read = this.readBytes();
                if (read > 0) {
                    var actualBytes = new byte[read];
                    System.arraycopy(this.buffer, 0, actualBytes, 0, read);
                    return actualBytes;
                } else {
                    this.drained = true;
                    this.closeStream();
                    return new byte[0];
                }
            }

            private int readBytes() {
                try {
                    return inputStream.read(this.buffer);
                } catch (IOException ex) {
                    throw new UncheckedIOException(ex);
                }
            }

            private void closeStream() {
                try {
                    inputStream.close();
                } catch (IOException ex) {
                    throw new UncheckedIOException(ex);
                }
            }

            private void ensureNotDrained() {
                if (this.drained) {
                    throw new NoSuchElementException("Stream is drained");
                }
            }
        };
    }
}
